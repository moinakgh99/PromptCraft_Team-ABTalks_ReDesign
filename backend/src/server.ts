import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { abtalksService } from "./services/abtalksService.js";
import { globalStore } from "./services/store.js";
import { APIResponse, APIError } from "./types/index.js";
import { setSystemDateOverride, getSystemDate } from "./utils/formulas.js";
import { simulateNetworkLatency } from "./utils/latency.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Latency & Error Injection Middleware (Option B feature)
app.use(async (req: Request, res: Response, next: NextFunction) => {
  const wantsLatency = req.query.latency === "true" || req.headers["x-simulate-latency"] === "true";
  const wantsFailure = req.query.simulateFailure === "true" || req.headers["x-simulate-failure"] === "true";

  if (wantsLatency || wantsFailure) {
    try {
      await simulateNetworkLatency(() => {}, {
        minMs: 150,
        maxMs: 400,
        enableFailures: wantsFailure,
        failureRate: 1.0 // Force error if header requested
      });
      next();
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: {
          code: "SIMULATED_NETWORK_FAILURE",
          message: err.message || "Simulated 500 error path triggered for frontend error state testing."
        }
      } as APIResponse<null>);
    }
  } else {
    next();
  }
});

// Helper wrapper for standard response envelopes
function sendSuccess<T>(res: Response, data: T, status: number = 200) {
  const payload: APIResponse<T> = { success: true, data };
  return res.status(status).json(payload);
}

function sendError(res: Response, code: string, message: string, status: number = 400, details?: any) {
  const payload: APIResponse<null> = {
    success: false,
    error: { code, message, details }
  };
  return res.status(status).json(payload);
}

// ==========================================
// API ROUTES
// ==========================================

/**
 * Health check endpoint
 */
app.get("/api/health", (req: Request, res: Response) => {
  sendSuccess(res, { status: "ok", systemDate: getSystemDate().toISOString() });
});

/**
 * GET /api/student/:id
 * Full student profile + computed level/streak state
 */
app.get("/api/student/:id", (req: Request, res: Response) => {
  try {
    const studentId = req.params.id;
    const profile = abtalksService.getStudentProfile(studentId);
    return sendSuccess(res, profile);
  } catch (err: any) {
    return sendError(res, err.code || "INTERNAL_ERROR", err.message || "Failed to fetch student profile", 500);
  }
});

/**
 * GET /api/challenges
 * All 60 days, with isLocked computed per student
 */
app.get("/api/challenges", (req: Request, res: Response) => {
  try {
    const studentId = (req.query.studentId as string) || "student-far";
    const challenges = abtalksService.getChallenges(studentId);
    return sendSuccess(res, challenges);
  } catch (err: any) {
    return sendError(res, err.code || "INTERNAL_ERROR", err.message || "Failed to fetch challenges", 500);
  }
});

/**
 * GET /api/challenges/:day
 * Single day detail
 */
app.get("/api/challenges/:day", (req: Request, res: Response) => {
  try {
    const day = Number(req.params.day);
    const studentId = (req.query.studentId as string) || "student-far";
    const challenge = abtalksService.getChallengeByDay(day, studentId);
    return sendSuccess(res, challenge);
  } catch (err: any) {
    const status = err.code === "NOT_FOUND" ? 404 : 400;
    return sendError(res, err.code || "BAD_REQUEST", err.message || "Invalid challenge day", status);
  }
});

/**
 * POST /api/challenges/:day/submit
 * Body: { studentId?, githubRepoUrl, githubCommitUrl, linkedinPostUrl }
 */
app.post("/api/challenges/:day/submit", (req: Request, res: Response) => {
  try {
    const day = Number(req.params.day);
    const result = abtalksService.submitChallenge(day, req.body);
    return sendSuccess(res, result, 201);
  } catch (err: any) {
    let status = 400;
    if (err.code === "DAY_LOCKED") status = 403;
    if (err.code === "ALREADY_SUBMITTED") status = 409;
    if (err.code === "NOT_FOUND") status = 404;
    return sendError(res, err.code || "SUBMISSION_FAILED", err.message || "Submission failed", status);
  }
});

/**
 * GET /api/student/:id/heatmap
 * Contribution graph activity level array
 */
app.get("/api/student/:id/heatmap", (req: Request, res: Response) => {
  try {
    const studentId = req.params.id;
    const heatmap = abtalksService.getHeatmap(studentId);
    return sendSuccess(res, heatmap);
  } catch (err: any) {
    return sendError(res, err.code || "INTERNAL_ERROR", err.message || "Failed to fetch heatmap", 500);
  }
});

/**
 * GET /api/student/:id/achievements
 * Catalog + unlocked state
 */
app.get("/api/student/:id/achievements", (req: Request, res: Response) => {
  try {
    const studentId = req.params.id;
    const achievements = abtalksService.getAchievements(studentId);
    return sendSuccess(res, achievements);
  } catch (err: any) {
    return sendError(res, err.code || "INTERNAL_ERROR", err.message || "Failed to fetch achievements", 500);
  }
});

/**
 * GET /api/leaderboard?sortBy=xp|streak|completion|achievements
 */
app.get("/api/leaderboard", (req: Request, res: Response) => {
  try {
    const sortBy = (req.query.sortBy as any) || "xp";
    const leaderboard = abtalksService.getLeaderboard(sortBy);
    return sendSuccess(res, leaderboard);
  } catch (err: any) {
    return sendError(res, err.code || "INTERNAL_ERROR", err.message || "Failed to fetch leaderboard", 500);
  }
});

/**
 * GET /api/community/spotlight
 * Top N featured students
 */
app.get("/api/community/spotlight", (req: Request, res: Response) => {
  try {
    const spotlight = abtalksService.getCommunitySpotlight();
    return sendSuccess(res, spotlight);
  } catch (err: any) {
    return sendError(res, err.code || "INTERNAL_ERROR", err.message || "Failed to fetch spotlight", 500);
  }
});

/**
 * GET /api/student/:id/ai-coach
 * Freshly generated mocked insight bundle
 */
app.get("/api/student/:id/ai-coach", (req: Request, res: Response) => {
  try {
    const studentId = req.params.id;
    const insight = abtalksService.getAICoachInsight(studentId);
    return sendSuccess(res, insight);
  } catch (err: any) {
    return sendError(res, err.code || "INTERNAL_ERROR", err.message || "Failed to fetch AI coach insight", 500);
  }
});

/**
 * POST /api/student/:id/profile
 * Update avatar/bio/track/theme
 */
app.post("/api/student/:id/profile", (req: Request, res: Response) => {
  try {
    const studentId = req.params.id;
    const updated = abtalksService.updateStudentProfile(studentId, req.body);
    return sendSuccess(res, updated);
  } catch (err: any) {
    return sendError(res, err.code || "UPDATE_FAILED", err.message || "Failed to update profile", 400);
  }
});

/**
 * POST /api/student/:id/recover-streak
 * Spend streak freeze token to recover streak
 */
app.post("/api/student/:id/recover-streak", (req: Request, res: Response) => {
  try {
    const studentId = req.params.id;
    const updated = abtalksService.recoverStreakWithFreezeToken(studentId);
    return sendSuccess(res, updated);
  } catch (err: any) {
    return sendError(res, err.code || "RECOVERY_FAILED", err.message || "Streak freeze recovery failed", 400);
  }
});

/**
 * POST /api/admin/reset
 * Reset store state to initial seed data
 */
app.post("/api/admin/reset", (req: Request, res: Response) => {
  globalStore.resetToSeed();
  setSystemDateOverride(null);
  return sendSuccess(res, { message: "Store and system date reset to seed values." });
});

/**
 * POST /api/admin/system-date
 * Inject/override system date for testing edge cases (e.g. missed days)
 */
app.post("/api/admin/system-date", (req: Request, res: Response) => {
  const { date } = req.body;
  if (!date) {
    setSystemDateOverride(null);
    return sendSuccess(res, { message: "System date override cleared.", currentDate: getSystemDate().toISOString() });
  }
  setSystemDateOverride(date);
  return sendSuccess(res, { message: `System date overridden to ${date}`, currentDate: getSystemDate().toISOString() });
});

// Fallback 404 handler
app.use((req: Request, res: Response) => {
  sendError(res, "NOT_FOUND", `Endpoint ${req.method} ${req.url} does not exist.`, 404);
});

// Start Express Server
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🚀 ABTalks Option B REST Server running at http://localhost:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  });
}

export default app;
