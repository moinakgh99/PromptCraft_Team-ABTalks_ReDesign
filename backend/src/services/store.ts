import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  Student,
  Challenge,
  Submission,
  Achievement,
  RewardOutcome
} from "../types/index.js";

// Helper for ESM directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../data");

export class Store {
  private students: Map<string, Student> = new Map();
  private challenges: Challenge[] = [];
  private submissions: Submission[] = [];
  private achievementsCatalog: Achievement[] = [];
  private rewardsCatalog: RewardOutcome[] = [];
  private aiCoachPools: any = {};

  constructor() {
    this.loadFromSeed();
  }

  public loadFromSeed(): void {
    const studentsRaw: Student[] = JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, "students.json"), "utf-8")
    );
    this.students.clear();
    studentsRaw.forEach((s) => this.students.set(s.id, { ...s }));

    this.challenges = JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, "challenges.json"), "utf-8")
    );

    this.submissions = JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, "submissions.json"), "utf-8")
    );

    this.achievementsCatalog = JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, "achievements.json"), "utf-8")
    );

    this.rewardsCatalog = JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, "rewards.json"), "utf-8")
    );

    this.aiCoachPools = JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, "aiCoach.json"), "utf-8")
    );
  }

  public getStudent(id: string): Student | null {
    const student = this.students.get(id);
    return student ? { ...student, unlockedAchievements: [...student.unlockedAchievements], unlockedThemes: [...student.unlockedThemes] } : null;
  }

  public getAllStudents(): Student[] {
    return Array.from(this.students.values()).map((s) => ({
      ...s,
      unlockedAchievements: [...s.unlockedAchievements],
      unlockedThemes: [...s.unlockedThemes]
    }));
  }

  public updateStudent(student: Student): void {
    this.students.set(student.id, {
      ...student,
      unlockedAchievements: [...student.unlockedAchievements],
      unlockedThemes: [...student.unlockedThemes]
    });
  }

  public getChallenges(): Challenge[] {
    return this.challenges.map((c) => ({
      ...c,
      learningObjectives: [...c.learningObjectives],
      buildChecklist: [...c.buildChecklist]
    }));
  }

  public getChallenge(day: number): Challenge | null {
    const c = this.challenges.find((item) => item.day === day);
    return c
      ? {
          ...c,
          learningObjectives: [...c.learningObjectives],
          buildChecklist: [...c.buildChecklist]
        }
      : null;
  }

  public getSubmissions(studentId?: string): Submission[] {
    if (studentId) {
      return this.submissions.filter((s) => s.studentId === studentId);
    }
    return [...this.submissions];
  }

  public addSubmission(sub: Submission): void {
    this.submissions.unshift({ ...sub });
  }

  public getAchievementsCatalog(): Achievement[] {
    return this.achievementsCatalog.map((a) => ({ ...a, unlockCondition: { ...a.unlockCondition } }));
  }

  public getRewardsCatalog(): RewardOutcome[] {
    return this.rewardsCatalog.map((r) => ({ ...r }));
  }

  public getAICoachPools(): any {
    return JSON.parse(JSON.stringify(this.aiCoachPools));
  }

  public resetToSeed(): void {
    this.loadFromSeed();
  }
}

export const globalStore = new Store();
