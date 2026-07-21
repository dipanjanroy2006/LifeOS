import { create } from 'zustand';
import type { Pillar, Goal, Habit, HabitLog, MoodLog, TimeBlock, LifeScoreBreakdown, UserProfile } from '../types';
import { format, subDays } from 'date-fns';

interface LifeOSState {
  // Navigation & UI State
  activePage: string;
  setActivePage: (page: string) => void;
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  // User Profile
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;

  // Pillars
  pillars: Pillar[];

  // Habits
  habits: Habit[];
  habitLogs: Record<string, HabitLog>; // key: `${habitId}_${loggedDate}`
  toggleHabitLog: (habitId: string, dateStr?: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'streak_count' | 'best_streak'>) => void;
  deleteHabit: (habitId: string) => void;

  // Goals & Key Results
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'user_id' | 'created_at'>) => void;
  updateKeyResult: (goalId: string, keyResultId: string, newValue: number) => void;

  // Time Blocks
  timeBlocks: TimeBlock[];
  addTimeBlock: (block: Omit<TimeBlock, 'id' | 'user_id'>) => void;
  toggleTimeBlock: (blockId: string) => void;

  // Mood Logs
  moodLogs: Record<string, MoodLog>; // key: YYYY-MM-DD
  logMood: (valence: number, energy: number, tags: string[], entry?: string) => void;

  // Life Score Computation
  getDailyLifeScore: (dateStr?: string) => LifeScoreBreakdown;
  getHistoricalScores: (days?: number) => LifeScoreBreakdown[];
}

const TODAY_STR = format(new Date(), 'yyyy-MM-dd');

const initialPillars: Pillar[] = [
  { id: 'p1', title: 'Health & Fitness', category: 'health', color: '#10b981', icon: 'Activity', description: 'Physical energy, workouts, sleep, and nutrition.' },
  { id: 'p2', title: 'Career & Build', category: 'career', color: '#6366f1', icon: 'Briefcase', description: 'Software execution, architecture, and professional milestones.' },
  { id: 'p3', title: 'Finance & Wealth', category: 'finance', color: '#f59e0b', icon: 'DollarSign', description: 'Investments, savings rate, and financial freedom.' },
  { id: 'p4', title: 'Mindfulness & Mind', category: 'mindfulness', color: '#8b5cf6', icon: 'Sparkles', description: 'Meditation, mental clarity, and deep focus.' },
  { id: 'p5', title: 'Relationships', category: 'relationships', color: '#f43f5e', icon: 'Heart', description: 'Family, friendships, and community engagement.' },
];

export const useLifeOSStore = create<LifeOSState>((set, get) => ({
  activePage: 'dashboard',
  setActivePage: (page: string) => set({ activePage: page }),
  isCommandPaletteOpen: false,
  setCommandPaletteOpen: (open: boolean) => set({ isCommandPaletteOpen: open }),

  profile: {
    id: 'u1',
    full_name: 'Roy',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    timezone: 'Asia/Kolkata',
    theme_preference: 'dark',
    created_at: new Date().toISOString().split('T')[0],
  },
  updateProfile: (updates: Partial<UserProfile>) => set((state) => ({ profile: { ...state.profile, ...updates } })),

  pillars: initialPillars,
  habits: [],
  habitLogs: {},
  goals: [],
  timeBlocks: [],
  moodLogs: {},

  toggleHabitLog: (habitId: string, dateStr: string = TODAY_STR) => set((state) => {
    const key = `${habitId}_${dateStr}`;
    const existingLog = state.habitLogs[key];
    const newLogs = { ...state.habitLogs };

    if (existingLog && existingLog.status === 'completed') {
      delete newLogs[key];
    } else {
      newLogs[key] = {
        id: `hl_${habitId}_${dateStr}`,
        habit_id: habitId,
        user_id: state.profile.id,
        logged_date: dateStr,
        completed_count: 1,
        status: 'completed',
      };
    }

    const updatedHabits = state.habits.map((h) => {
      if (h.id === habitId) {
        const isDone = newLogs[key]?.status === 'completed';
        const newStreak = isDone ? h.streak_count + 1 : Math.max(0, h.streak_count - 1);
        return { ...h, streak_count: newStreak, best_streak: Math.max(h.best_streak, newStreak) };
      }
      return h;
    });

    return { habitLogs: newLogs, habits: updatedHabits };
  }),

  addHabit: (newHabitData: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'streak_count' | 'best_streak'>) => set((state) => {
    const newHabit: Habit = {
      ...newHabitData,
      id: `h_${Date.now()}`,
      user_id: state.profile.id,
      streak_count: 0,
      best_streak: 0,
      archived: false,
      created_at: new Date().toISOString(),
    };
    return { habits: [newHabit, ...state.habits] };
  }),

  deleteHabit: (habitId: string) => set((state) => ({
    habits: state.habits.filter((h) => h.id !== habitId),
  })),

  addGoal: (newGoalData: Omit<Goal, 'id' | 'user_id' | 'created_at'>) => set((state) => {
    const newGoal: Goal = {
      ...newGoalData,
      id: `g_${Date.now()}`,
      user_id: state.profile.id,
      created_at: new Date().toISOString(),
    };
    return { goals: [newGoal, ...state.goals] };
  }),

  updateKeyResult: (goalId: string, keyResultId: string, newValue: number) => set((state) => ({
    goals: state.goals.map((g) => {
      if (g.id === goalId) {
        const updatedKrs = g.key_results.map((kr) => kr.id === keyResultId ? { ...kr, current_value: newValue } : kr);
        const isAllComplete = updatedKrs.every((kr) => kr.current_value >= kr.target_value);
        return {
          ...g,
          key_results: updatedKrs,
          status: isAllComplete ? 'completed' : 'in_progress',
        };
      }
      return g;
    }),
  })),

  addTimeBlock: (blockData: Omit<TimeBlock, 'id' | 'user_id'>) => set((state) => ({
    timeBlocks: [...state.timeBlocks, { ...blockData, id: `tb_${Date.now()}`, user_id: state.profile.id }],
  })),

  toggleTimeBlock: (blockId: string) => set((state) => ({
    timeBlocks: state.timeBlocks.map((tb) => tb.id === blockId ? { ...tb, is_completed: !tb.is_completed } : tb),
  })),

  logMood: (valence: number, energy: number, tags: string[], entry?: string) => set((state) => ({
    moodLogs: {
      ...state.moodLogs,
      [TODAY_STR]: {
        id: `ml_${TODAY_STR}`,
        user_id: state.profile.id,
        logged_date: TODAY_STR,
        valence,
        energy,
        tags,
        journal_entry: entry,
        created_at: new Date().toISOString(),
      },
    },
  })),

  getDailyLifeScore: (dateStr: string = TODAY_STR) => {
    const state = get();
    const activeHabits = state.habits.filter((h) => !h.archived);
    if (activeHabits.length === 0) return { date: dateStr, score: 100, habit_component: 50, goal_component: 30, mood_component: 20 };

    let completedCount = 0;
    activeHabits.forEach((h) => {
      const log = state.habitLogs[`${h.id}_${dateStr}`];
      if (log && log.status === 'completed') completedCount++;
    });

    const habitRatio = completedCount / activeHabits.length;
    const habitComp = habitRatio * 50;

    let goalProgressSum = 0;
    state.goals.forEach((g) => {
      if (g.key_results.length === 0) return;
      const krSum = g.key_results.reduce((acc, kr) => acc + Math.min(1, kr.current_value / kr.target_value), 0);
      goalProgressSum += (krSum / g.key_results.length);
    });
    const goalRatio = state.goals.length > 0 ? goalProgressSum / state.goals.length : 1;
    const goalComp = goalRatio * 30;

    const moodLog = state.moodLogs[dateStr];
    const valence = moodLog ? moodLog.valence : 4;
    const energy = moodLog ? moodLog.energy : 4;
    const moodRatio = (valence + energy) / 10;
    const moodComp = moodRatio * 20;

    const totalScore = Math.round(habitComp + goalComp + moodComp);

    return {
      date: dateStr,
      score: Math.min(100, Math.max(0, totalScore)),
      habit_component: Math.round(habitComp),
      goal_component: Math.round(goalComp),
      mood_component: Math.round(moodComp),
    };
  },

  getHistoricalScores: (days: number = 14) => {
    const scores: LifeScoreBreakdown[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const dStr = format(subDays(new Date(), i), 'yyyy-MM-dd');
      scores.push(get().getDailyLifeScore(dStr));
    }
    return scores;
  },
}));
