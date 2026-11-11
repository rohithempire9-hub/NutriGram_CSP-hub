import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import {
  createHmac,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";

const app = express();
const PORT = Number(process.env.PORT || 10000);
const isProduction = process.env.NODE_ENV === "production";
const COOKIE_NAME = "nutrigram_admin_session";
const TOKEN_TTL_SECONDS = 8 * 60 * 60;

const allowedOrigins = (process.env.FRONTEND_URL || process.env.APP_URL || "")
  .split(",")
  .map((value) => value.trim().replace(/\/$/, ""))
  .filter(Boolean);

const requiredEnv = ["MONGODB_URI", "JWT_SECRET", "ADMIN_USERNAME", "ADMIN_PASSWORD_HASH", "FRONTEND_URL"];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}
if (process.env.JWT_SECRET.length < 32) {
  console.error("JWT_SECRET must contain at least 32 characters.");
  process.exit(1);
}

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Cache-Control", "no-store");
  next();
});

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.length && !allowedOrigins.includes(origin.replace(/\/$/, ""))) {
    return res.status(403).json({ message: "Origin is not allowed." });
  }
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json({ limit: "1mb" }));

const childSchema = new mongoose.Schema(
  {
    _id: { type: String, default: randomUUID },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    age: { type: Number, required: true, min: 1, max: 18 },
    gender: { type: String, required: true, enum: ["male", "female"] },
    height: { type: Number, required: true, min: 50, max: 200 },
    weight: { type: Number, required: true, min: 4, max: 120 },
    eggIntake: { type: Number, required: true, min: 0, max: 21 },
    milkIntake: {
      type: String,
      required: true,
      enum: ["1-2 times", "3-4 times", "5-6 times", "7 or more times"],
    },
    vegetableIntake: {
      type: String,
      required: true,
      enum: ["3-4 times a week", "1-2 times a week", "rarely"],
    },
    mandalId: { type: String, required: true, trim: true },
    mandalName: { type: String, trim: true, maxlength: 120 },
    ward: { type: String, trim: true, maxlength: 120 },
    schoolGrade: { type: String, trim: true, maxlength: 80 },
    guardianContact: { type: String, trim: true, maxlength: 30 },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
  }
);

const mandalSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    district: { type: String, required: true, trim: true, maxlength: 120 },
    supervisorName: { type: String, required: true, trim: true, maxlength: 120 },
    supervisorPhone: { type: String, trim: true, maxlength: 30, default: "" },
    anganwadiCount: { type: Number, required: true, min: 0, max: 10000 },
    enrolledChildrenCount: { type: Number, min: 0, default: 0 },
    notes: { type: String, trim: true, maxlength: 1000, default: "" },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
  }
);

const Child = mongoose.model("Child", childSchema);
const Mandal = mongoose.model("Mandal", mandalSchema);

const defaultMandals = [
  {
    _id: "mandal-1",
    name: "Kuppam Mandal",
    district: "Chittoor District",
    supervisorName: "Smt. Lakshmi Devi",
    supervisorPhone: "+91 98451 22301",
    anganwadiCount: 24,
    notes: "Covers rural school zones, border Anganwadis, and Mid-Day meal centers.",
  },
  {
    _id: "mandal-2",
    name: "Palamaner Mandal",
    district: "Chittoor District",
    supervisorName: "Sri. K. Ramesh Rao",
    supervisorPhone: "+91 98451 22302",
    anganwadiCount: 18,
    notes: "Active dairy cooperative hub with morning milk distribution pilot.",
  },
  {
    _id: "mandal-3",
    name: "Bangarupalem Mandal",
    district: "Chittoor District",
    supervisorName: "Smt. Meenakshi Amma",
    supervisorPhone: "+91 98451 22303",
    anganwadiCount: 20,
    notes: "Special Poshan Vatika nutrition garden drive launched in 12 villages.",
  },
  {
    _id: "mandal-4",
    name: "Ramapuram Mandal",
    district: "Annamayya District",
    supervisorName: "Sri. V. Narayana Swamy",
    supervisorPhone: "+91 98451 22304",
    anganwadiCount: 16,
    notes: "Hilly remote habitations prioritized for egg supplement drives.",
  },
];

function passwordMatches(password, storedHash) {
  const [salt, expectedHex] = String(storedHash).split(":");
  if (!salt || !expectedHex) return false;
  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHex, "hex");
  return expected.length === actual.length && timingSafeEqual(actual, expected);
}

function signToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(
    JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS })
  ).toString("base64url");
  const unsigned = `${header}.${body}`;
  const signature = createHmac("sha256", process.env.JWT_SECRET).update(unsigned).digest("base64url");
  return `${unsigned}.${signature}`;
}

function verifyToken(token) {
  try {
    const [header, body, signature] = token.split(".");
    if (!header || !body || !signature) return null;
    const unsigned = `${header}.${body}`;
    const expected = createHmac("sha256", process.env.JWT_SECRET).update(unsigned).digest();
    const actual = Buffer.from(signature, "base64url");
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

function readCookie(req, name) {
  const cookieHeader = req.headers.cookie || "";
  for (const part of cookieHeader.split(";")) {
    const [key, ...value] = part.trim().split("=");
    if (key === name) return decodeURIComponent(value.join("="));
  }
  return null;
}

function setSessionCookie(res, token) {
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    "HttpOnly",
    "Path=/",
    "Max-Age=" + TOKEN_TTL_SECONDS,
    "SameSite=" + (isProduction ? "None" : "Lax"),
  ];
  if (isProduction) parts.push("Secure");
  res.setHeader("Set-Cookie", parts.join("; "));
}

function clearSessionCookie(res) {
  const parts = [`${COOKIE_NAME}=`, "HttpOnly", "Path=/", "Max-Age=0", "SameSite=None"];
  if (isProduction) parts.push("Secure");
  res.setHeader("Set-Cookie", parts.join("; "));
}

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const token = bearer || readCookie(req, COOKIE_NAME);
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== "admin" || payload.sub !== process.env.ADMIN_USERNAME) {
    return res.status(401).json({ message: "Please sign in with the administrator account." });
  }
  req.admin = { username: payload.sub, role: "admin" };
  next();
}

const loginAttempts = new Map();
function loginRateLimit(req, res, next) {
  const key = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const current = loginAttempts.get(key);
  if (current && current.resetAt > now && current.count >= 10) {
    return res.status(429).json({ message: "Too many login attempts. Try again in 15 minutes." });
  }
  if (!current || current.resetAt <= now) loginAttempts.set(key, { count: 0, resetAt: now + 15 * 60 * 1000 });
  next();
}

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    service: "NutriGram API",
  });
});

app.post("/api/auth/login", loginRateLimit, (req, res) => {
  const username = String(req.body?.username || "").trim();
  const password = String(req.body?.password || "");
  const key = req.ip || req.socket.remoteAddress || "unknown";
  const current = loginAttempts.get(key) || { count: 0, resetAt: Date.now() + 15 * 60 * 1000 };

  const valid =
    username.toLowerCase() === process.env.ADMIN_USERNAME.toLowerCase() &&
    password.length > 0 &&
    passwordMatches(password, process.env.ADMIN_PASSWORD_HASH);

  if (!valid) {
    current.count += 1;
    loginAttempts.set(key, current);
    return res.status(401).json({ message: "Invalid administrator username or password." });
  }

  loginAttempts.delete(key);
  const token = signToken({ sub: process.env.ADMIN_USERNAME, role: "admin" });
  setSessionCookie(res, token);
  return res.json({
    user: {
      id: "admin",
      username: process.env.ADMIN_USERNAME,
      name: process.env.ADMIN_DISPLAY_NAME || "NutriGram Administrator",
      role: "admin",
    },
  });
});

app.get("/api/auth/me", requireAdmin, (req, res) => {
  res.json({
    user: {
      id: "admin",
      username: req.admin.username,
      name: process.env.ADMIN_DISPLAY_NAME || "NutriGram Administrator",
      role: "admin",
    },
  });
});

app.post("/api/auth/logout", (_req, res) => {
  clearSessionCookie(res);
  res.json({ message: "Signed out successfully." });
});

app.use("/api/children", requireAdmin);

app.get("/api/children", async (_req, res, next) => {
  try {
    const children = await Child.find().sort({ createdAt: -1 }).lean();
    res.json(children.map((child) => ({ ...child, id: child._id, _id: undefined })));
  } catch (error) {
    next(error);
  }
});

app.post("/api/children", async (req, res, next) => {
  try {
    const payload = { ...req.body };
    delete payload.id;
    delete payload._id;
    const child = await Child.create(payload);
    res.status(201).json(child);
  } catch (error) {
    next(error);
  }
});

app.put("/api/children/:id", async (req, res, next) => {
  try {
    const payload = { ...req.body };
    delete payload.id;
    delete payload._id;
    delete payload.createdAt;
    const child = await Child.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    if (!child) return res.status(404).json({ message: "Child record not found." });
    res.json(child);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/children/:id", async (req, res, next) => {
  try {
    const child = await Child.findByIdAndDelete(req.params.id);
    if (!child) return res.status(404).json({ message: "Child record not found." });
    res.json({ message: "Child record deleted." });
  } catch (error) {
    next(error);
  }
});

app.use("/api/mandals", requireAdmin);

app.get("/api/mandals", async (_req, res, next) => {
  try {
    const mandals = await Mandal.find().sort({ name: 1 }).lean();
    res.json(mandals.map((mandal) => ({ ...mandal, id: mandal._id, _id: undefined })));
  } catch (error) {
    next(error);
  }
});

app.post("/api/mandals", async (req, res, next) => {
  try {
    const payload = { ...req.body };
    const id = String(payload.id || `mandal-${randomUUID()}`);
    delete payload.id;
    delete payload._id;
    const mandal = await Mandal.create({ ...payload, _id: id });
    res.status(201).json(mandal);
  } catch (error) {
    next(error);
  }
});

app.put("/api/mandals/:id", async (req, res, next) => {
  try {
    const payload = { ...req.body };
    delete payload.id;
    delete payload._id;
    const mandal = await Mandal.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    if (!mandal) return res.status(404).json({ message: "Mandal not found." });
    res.json(mandal);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/mandals/:id", async (req, res, next) => {
  try {
    const linkedChildren = await Child.countDocuments({ mandalId: req.params.id });
    if (linkedChildren > 0) {
      return res.status(409).json({
        message: `This Mandal has ${linkedChildren} linked child record(s). Reassign them before deleting it.`,
      });
    }
    const mandal = await Mandal.findByIdAndDelete(req.params.id);
    if (!mandal) return res.status(404).json({ message: "Mandal not found." });
    res.json({ message: "Mandal deleted." });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  if (error?.name === "ValidationError" || error?.name === "CastError") {
    return res.status(400).json({ message: error.message });
  }
  if (error?.code === 11000) {
    return res.status(409).json({ message: "A record with this identifier already exists." });
  }
  console.error("API error:", error);
  res.status(500).json({ message: "An unexpected server error occurred." });
});

async function start() {
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log("Connected to MongoDB.");

  if ((await Mandal.countDocuments()) === 0) {
    await Mandal.insertMany(defaultMandals);
    console.log("Inserted the four starter Mandal records.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NutriGram API listening on port ${PORT}`);
  });
}

start().catch((error) => {
  console.error("Could not start NutriGram API:", error.message);
  process.exit(1);
});
