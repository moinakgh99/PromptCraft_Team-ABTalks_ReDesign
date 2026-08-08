import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import app from "../src/server.js";
import { globalStore } from "../src/services/store.js";
import { abtalksService } from "../src/services/abtalksService.js";
import {
  calculateSubmissionXP,
  calculateLevel,
  calculateRecruiterScore,
  evaluateStreakState,
  computeNewStreakOnSubmission,
  setSystemDateOverride,
  validateSubmissionURLs
} from "../src/utils/formulas.js";

describe("ABTalks Option B Mock Backend Test Suite", () => {
  beforeEach(() => {
    globalStore.resetToSeed();
    setSystemDateOverride(null);
  });

  describe("1. Business Math & Formulas", () => {
    it("XP Formula calculates base + capped streak + early submission bonus correctly", () => {
      // 0 streak day, early morning (10:00 AM local time)
      const earlyDate = new Date(2026, 7, 8, 10, 0, 0);
      const xp1 = calculateSubmissionXP(0, earlyDate);
      assert.equal(xp1.baseXP, 100);
      assert.equal(xp1.streakBonus, 0);
      assert.equal(xp1.earlyBonus, 50);
      assert.equal(xp1.totalXP, 150);

      // 5-day streak (5 * 15 = 75 bonus), late night (21:00 PM local time - no early bonus)
      const lateDate = new Date(2026, 7, 8, 21, 0, 0);
      const xp2 = calculateSubmissionXP(5, lateDate);
      assert.equal(xp2.streakBonus, 75);
      assert.equal(xp2.earlyBonus, 0);
      assert.equal(xp2.totalXP, 175);

      // 15-day streak (should cap at 150 max streak bonus)
      const xp3 = calculateSubmissionXP(15, earlyDate);
      assert.equal(xp3.streakBonus, 150); // Capped at 150
      assert.equal(xp3.totalXP, 300);
    });

    it("Level mapping maps XP correctly to status tiers", () => {
      assert.equal(calculateLevel(0).level, "Explorer");
      assert.equal(calculateLevel(499).level, "Explorer");
      assert.equal(calculateLevel(500).level, "Builder");
      assert.equal(calculateLevel(1499).level, "Builder");
      assert.equal(calculateLevel(1500).level, "Creator");
      assert.equal(calculateLevel(3500).level, "Architect");
      assert.equal(calculateLevel(7000).level, "Legend");
      assert.equal(calculateLevel(12000).level, "Legend");
    });

    it("Recruiter Visibility Score computes 4 weighted metrics transparently", () => {
      const student = globalStore.getStudent("student-far")!;
      const subs = globalStore.getSubmissions("student-far");
      const breakdown = calculateRecruiterScore(student, subs);

      assert.ok(breakdown.totalScore >= 0 && breakdown.totalScore <= 100);
      assert.ok(breakdown.commitScore <= 35);
      assert.ok(breakdown.linkedinScore <= 20);
      assert.ok(breakdown.completionScore <= 25);
      assert.ok(breakdown.streakScore <= 20);
    });

    it("URL validation rejects invalid GitHub/LinkedIn formatting", () => {
      const valid = validateSubmissionURLs({
        githubRepoUrl: "https://github.com/user/repo",
        githubCommitUrl: "https://github.com/user/repo/commit/12345",
        linkedinPostUrl: "https://linkedin.com/posts/activity-123"
      });
      assert.equal(valid.valid, true);

      const invalidRepo = validateSubmissionURLs({
        githubRepoUrl: "https://invalid.com/repo",
        githubCommitUrl: "https://github.com/user/repo/commit/12345",
        linkedinPostUrl: "https://linkedin.com/posts/activity-123"
      });
      assert.equal(invalidRepo.valid, false);
      assert.match(invalidRepo.errorMessage!, /githubRepoUrl must be a valid GitHub URL/);
    });
  });

  describe("2. Student Profile & Edge Cases", () => {
    it("Brand new student returns valid non-null intentional zeroed state", () => {
      const res = abtalksService.getStudentProfile("student-fresh");
      assert.equal(res.student.currentStreak, 0);
      assert.equal(res.student.totalDaysCompleted, 0);
      assert.equal(res.student.xp, 0);
      assert.equal(res.student.level, "Explorer");
      assert.equal(res.student.profileComplete, false);
      assert.equal(res.rank, null);

      const heatmap = abtalksService.getHeatmap("student-fresh");
      assert.deepEqual(heatmap, []);
    });

    it("Missed yesterday student produces missedYesterday: true", () => {
      setSystemDateOverride("2026-08-08");
      const res = abtalksService.getStudentProfile("student-missed");
      assert.equal(res.missedYesterday, true);
      assert.equal(res.daysSinceLastSubmission, 2);
    });

    it("Streak recovery spends 1 token and preserves active streak", () => {
      setSystemDateOverride("2026-08-08");
      const initial = abtalksService.getStudentProfile("student-missed");
      assert.equal(initial.student.streakFreezeTokens, 1);
      assert.equal(initial.missedYesterday, true);

      const recovered = abtalksService.recoverStreakWithFreezeToken("student-missed");
      assert.equal(recovered.streakFreezeTokens, 0);
      assert.equal(recovered.currentStreak, initial.student.currentStreak + 1);

      const afterRecovery = abtalksService.getStudentProfile("student-missed");
      assert.equal(afterRecovery.missedYesterday, false);
    });
  });

  describe("3. Challenge Submission & Locking Engine", () => {
    it("Rejects submission to a locked future day with DAY_LOCKED error code", () => {
      assert.throws(
        () => {
          abtalksService.submitChallenge(45, {
            studentId: "student-far", // Day 42 completed, max unlocked is 43
            githubRepoUrl: "https://github.com/alexmercer/abtalks-challenge",
            githubCommitUrl: "https://github.com/alexmercer/abtalks-challenge/commit/abc",
            linkedinPostUrl: "https://linkedin.com/posts/alexmercer-day45"
          });
        },
        (err: any) => {
          return err.code === "DAY_LOCKED";
        }
      );
    });

    it("Rejects resubmitting an already completed day with ALREADY_SUBMITTED error code", () => {
      assert.throws(
        () => {
          abtalksService.submitChallenge(42, {
            studentId: "student-far",
            githubRepoUrl: "https://github.com/alexmercer/abtalks-challenge",
            githubCommitUrl: "https://github.com/alexmercer/abtalks-challenge/commit/abc",
            linkedinPostUrl: "https://linkedin.com/posts/alexmercer-day42"
          });
        },
        (err: any) => {
          return err.code === "ALREADY_SUBMITTED";
        }
      );
    });

    it("Successful submission updates XP, streak, total days, unlocks achievements, and issues reward box", () => {
      setSystemDateOverride("2026-08-08T14:00:00Z");

      const result = abtalksService.submitChallenge(43, {
        studentId: "student-far",
        githubRepoUrl: "https://github.com/alexmercer/abtalks-challenge",
        githubCommitUrl: "https://github.com/alexmercer/abtalks-challenge/commit/day43commit",
        linkedinPostUrl: "https://linkedin.com/posts/alexmercer-day43"
      });

      assert.ok(result.xpEarned > 0);
      assert.equal(result.updatedStudent.totalDaysCompleted, 43);
      assert.equal(result.updatedStudent.currentStreak, 15);
      assert.equal(result.updatedStudent.lastSubmissionDate, "2026-08-08");
      assert.ok(result.rewardBoxResult.reward.title.length > 0);
      assert.ok(result.aiCoachInsight.percentileText.length > 0);
    });
  });

  describe("4. Leaderboard & AI Coach Engine", () => {
    it("Leaderboard supports all 4 sort modes cleanly", () => {
      const byXp = abtalksService.getLeaderboard("xp");
      assert.ok(byXp[0].xp >= byXp[1].xp);

      const byStreak = abtalksService.getLeaderboard("streak");
      assert.ok(byStreak[0].currentStreak >= byStreak[1].currentStreak);

      const byCompletion = abtalksService.getLeaderboard("completion");
      assert.ok(byCompletion[0].totalDaysCompleted >= byCompletion[1].totalDaysCompleted);

      const byAchievements = abtalksService.getLeaderboard("achievements");
      assert.ok(byAchievements[0].achievementsCount >= byAchievements[1].achievementsCount);
    });

    it("AI Coach generates dynamic, non-static insight lines", () => {
      const insight = abtalksService.getAICoachInsight("student-far");
      assert.ok(insight.percentileText.includes("top"));
      assert.ok(insight.completionProbability > 0);
      assert.ok(insight.nextDayCallout.length > 0);
      assert.ok(insight.productiveTimeCallout.length > 0);
    });

    it("Updating student profile sets profileComplete flag when bio/avatar/track are filled", () => {
      const fresh = abtalksService.updateStudentProfile("student-fresh", {
        bio: "Fullstack developer passionate about React and Node.",
        avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=JordanNew",
        track: "Fullstack Web"
      });

      assert.equal(fresh.profileComplete, true);
      assert.equal(fresh.bio, "Fullstack developer passionate about React and Node.");
    });
  });
});
