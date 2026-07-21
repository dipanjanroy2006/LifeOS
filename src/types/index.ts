export type PillarCategory = 'health' | 'career' | 'finance' | 'mindfulness' | 'relationships';

export interface Pillar {
  id: string;
  title: string;
  category: PillarCategory;
  color: string;
  icon: string;
  description: string;
}

export type GoalStatus = 'not_started' | 'in_progress' | 'completed' | 'archived';

export interface KeyResult {
  id: string;
  goal_id: string;
  title: string;
  current_value: number;
  target_value: number;
  unit: string;
}

export interface Goal {
  id: string;
  user_id: string;
  pillar_id: string;
  title: string;
  description: string;
  target_date: string;
  status: GoalStatus;
  key_results: KeyResult[];
  created_at: string;
}

export type HabitFrequency = 'daily' | 'weekly_days' | 'custom';
export type TimeOfDay = 'anytime' | 'morning' | 'afternoon' | 'evening';

export interface Habit {
  id: string;
  user_id: string;
  pillar_id?: string;
  goal_id?: string;
  title: string;
  description?: string;
  frequency: HabitFrequency;
  target_days: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  target_count: number;
  unit?: string;
  time_of_day: TimeOfDay;
  streak_count: number;
  best_streak: number;
  archived: boolean;
  color: string;
  icon: string;
  created_at: string;
}

export type HabitLogStatus = 'completed' | 'skipped' | 'failed';

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  logged_date: string; // YYYY-MM-DD
  completed_count: number;
  status: HabitLogStatus;
  notes?: string;
}

export interface MoodLog {
  id: string;
  user_id: string;
  logged_date: string; // YYYY-MM-DD
  valence: number; // 1 to 5 (Mood)
  energy: number; // 1 to 5 (Energy)
  tags: string[];
  journal_entry?: string;
  created_at: string;
}

export interface TimeBlock {
  id: string;
  user_id: string;
  title: string;
  start_time: string; // ISO string
  end_time: string; // ISO string
  category: string;
  habit_id?: string;
  is_completed: boolean;
  color: string;
}

export interface LifeScoreBreakdown {
  date: string;
  score: number; // 0 to 100
  habit_component: number; // 0 to 50
  goal_component: number; // 0 to 30
  mood_component: number; // 0 to 20
}

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url: string;
  timezone: string;
  theme_preference: 'dark' | 'light' | 'system';
  created_at: string;
}
