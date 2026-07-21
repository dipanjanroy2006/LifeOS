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

const initialHabits: Habit[] = [
  { id: 'h1', user_id: 'u1', pillar_id: 'p1', title: 'Morning Hydration & 30-min Workout', frequency: 'daily', target_days: [0,1,2,3,4,5,6], target_count: 1, time_of_day: 'morning', streak_count: 14, best_streak: 21, archived: false, color: '#10b981', icon: 'Zap', created_at: '2026-01-01' },
  { id: 'h2', user_id: 'u1', pillar_id: 'p4', title: '15-min Mindfulness Meditation', frequency: 'daily', target_days: [0,1,2,3,4,5,6], target_count: 1, time_of_day: 'morning', streak_count: 8, best_streak: 15, archived: false, color: '#8b5cf6', icon: 'Sparkles', created_at: '2026-01-01' },
  { id: 'h3', user_id: 'u1', pillar_id: 'p2', title: 'Deep Work Coding Session (2 Hours)', frequency: 'daily', target_days: [1,2,3,4,5], target_count: 1, time_of_day: 'afternoon', streak_count: 12, best_streak: 19, archived: false, color: '#6366f1', icon: 'Code', created_at: '2026-01-01' },
  { id: 'h4', user_id: 'u1', pillar_id: 'p3', title: 'Track Expenses & Portfolio Review', frequency: 'weekly_days', target_days: [5], target_count: 1, time_of_day: 'evening', streak_count: 4, best_streak: 8, archived: false, color: '#f59e0b', icon: 'TrendingUp', created_at: '2026-01-01' },
  { id: 'h5', user_id: 'u1', pillar_id: 'p1', title: 'Read 20 Pages of Tech / Growth Book', frequency: 'daily', target_days: [0,1,2,3,4,5,6], target_count: 1, time_of_day: 'evening', streak_count: 19, best_streak: 30, archived: false, color: '#06b6d4', icon: 'BookOpen', created_at: '2026-01-01' },
];

const initialGoals: Goal[] = [
  {
    id: 'g1',
    user_id: 'u1',
    pillar_id: 'p2',
    title: 'Architect & Deploy Production LifeOS PWA',
    description: 'Build a high performance Personal Life Operating System with modern UX.',
    target_date: '2026-08-30',
    status: 'in_progress',
    created_at: '2026-07-01',
    key_results: [
      { id: 'kr1', goal_id: 'g1', title: 'Core UI Modules Implemented', current_value: 6, target_value: 7, unit: 'modules' },
      { id: 'kr2', goal_id: 'g1', title: 'Lighthouse Performance Score', current_value: 98, target_value: 100, unit: 'pts' },
      { id: 'kr3', goal_id: 'g1', title: 'PWA Offline Storage Sync Test', current_value: 1, target_value: 1, unit: 'pass' },
    ],
  },
  {
    id: 'g2',
    user_id: 'u1',
    pillar_id: 'p1',
    title: 'Achieve Peak Physical Fitness & Stamina',
    description: 'Maintain regular strength training and cardiovascular health.',
    target_date: '2026-09-15',
    status: 'in_progress',
    created_at: '2026-07-01',
    key_results: [
      { id: 'kr4', goal_id: 'g2', title: 'Weekly Workouts Logged', current_value: 18, target_value: 24, unit: 'sessions' },
      { id: 'kr5', goal_id: 'g2', title: '5K Run Time Improvement', current_value: 23.5, target_value: 22.0, unit: 'mins' },
    ],
  },
];

// Generate initial habit logs for past 30 days
const generateInitialHabitLogs = (): Record<string, HabitLog> => {
  const logs: Record<string, HabitLog> = {};
  initialHabits.forEach((h) => {
    logs[`${h.id}_${TODAY_STR}`] = {
      id: `hl_${h.id}_${TODAY_STR}`,
      habit_id: h.id,
      user_id: 'u1',
      logged_date: TODAY_STR,
      completed_count: 1,
      status: 'completed',
    };

    for (let i = 1; i <= 30; i++) {
      const dStr = format(subDays(new Date(), i), 'yyyy-MM-dd');
      if (Math.random() > 0.25) {
        logs[`${h.id}_${dStr}`] = {
          id: `hl_${h.id}_${dStr}`,
          habit_id: h.id,
          user_id: 'u1',
          logged_date: dStr,
          completed_count: 1,
          status: 'completed',
        };
      }
    }
  });
  return logs;
};

const initialTimeBlocks: TimeBlock[] = [
  { id: 'tb1', user_id: 'u1', title: 'Morning Workout & Hydration', start_time: `${TODAY_STR}T07:00:00`, end_time: `${TODAY_STR}T07:45:00`, category: 'Health', is_completed: true, color: '#10b981' },
  { id: 'tb2', user_id: 'u1', title: 'System Architecture Review', start_time: `${TODAY_STR}T09:00:00`, end_time: `${TODAY_STR}T11:30:00`, category: 'Career', is_completed: true, color: '#6366f1' },
  { id: 'tb3', user_id: 'u1', title: 'Deep Work Coding & Component Build', start_time: `${TODAY_STR}T13:00:00`, end_time: `${TODAY_STR}T15:30:00`, category: 'Career', is_completed: false, color: '#6366f1' },
  { id: 'tb4', user_id: 'u1', title: 'Mindfulness & Reading Hour', start_time: `${TODAY_STR}T19:00:00`, end_time: `${TODAY_STR}T20:00:00`, category: 'Mindfulness', is_completed: false, color: '#8b5cf6' },
];

const initialMoodLogs: Record<string, MoodLog> = {
  [TODAY_STR]: {
    id: `ml_${TODAY_STR}`,
    user_id: 'u1',
    logged_date: TODAY_STR,
    valence: 4,
    energy: 5,
    tags: ['productive', 'focused', 'energized'],
    journal_entry: 'Great momentum today. System components feel responsive and crisp.',
    created_at: new Date().toISOString(),
  },
};

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
    created_at: '2026-01-01',
  },
  updateProfile: (updates: Partial<UserProfile>) => set((state) => ({ profile: { ...state.profile, ...updates } })),

  pillars: initialPillars,
  habits: initialHabits,
  habitLogs: generateInitialHabitLogs(),

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

  goals: initialGoals,
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

  timeBlocks: initialTimeBlocks,
  addTimeBlock: (blockData: Omit<TimeBlock, 'id' | 'user_id'>) => set((state) => ({
    timeBlocks: [...state.timeBlocks, { ...blockData, id: `tb_${Date.now()}`, user_id: state.profile.id }],
  })),

  toggleTimeBlock: (blockId: string) => set((state) => ({
    timeBlocks: state.timeBlocks.map((tb) => tb.id === blockId ? { ...tb, is_completed: !tb.is_completed } : tb),
  })),

  moodLogs: initialMoodLogs,
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
