-- LifeOS Supabase Database Initial Schema
-- Migration File: 20260721000000_initial_schema.sql

-- Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. DATABASE TABLES
-- ==========================================

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER SETTINGS
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    theme TEXT DEFAULT 'dark',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    timezone TEXT DEFAULT 'UTC',
    language TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. HABIT CATEGORIES
CREATE TABLE IF NOT EXISTS public.habit_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon TEXT DEFAULT 'Tag',
    color TEXT DEFAULT '#6366f1',
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. HABITS
CREATE TABLE IF NOT EXISTS public.habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.habit_categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'CheckSquare',
    color TEXT DEFAULT '#6366f1',
    frequency TEXT DEFAULT 'daily', -- 'daily', 'weekly', 'custom'
    is_fixed BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. FIXED HABITS (Predefined Templates)
CREATE TABLE IF NOT EXISTS public.fixed_habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'Zap',
    category_id UUID REFERENCES public.habit_categories(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. HABIT SCHEDULES
CREATE TABLE IF NOT EXISTS public.habit_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    days_of_week INT[] DEFAULT '{0,1,2,3,4,5,6}',
    reminder_time TIME,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. HABIT COMPLETIONS
CREATE TABLE IF NOT EXISTS public.habit_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    completion_date DATE NOT NULL DEFAULT CURRENT_DATE,
    completed BOOLEAN DEFAULT TRUE,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT,
    UNIQUE(habit_id, completion_date)
);

-- 8. HABIT STREAKS
CREATE TABLE IF NOT EXISTS public.habit_streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    habit_id UUID UNIQUE NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_completed_date DATE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. GOALS
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_value NUMERIC NOT NULL DEFAULT 100,
    current_value NUMERIC DEFAULT 0,
    unit TEXT DEFAULT '%',
    deadline DATE,
    status TEXT DEFAULT 'in_progress', -- 'not_started', 'in_progress', 'completed', 'archived'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. GOAL PROGRESS
CREATE TABLE IF NOT EXISTS public.goal_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
    value NUMERIC NOT NULL,
    progress_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. MOOD ENTRIES
CREATE TABLE IF NOT EXISTS public.mood_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    mood INT CHECK (mood BETWEEN 1 AND 5),
    energy_level INT CHECK (energy_level BETWEEN 1 AND 5),
    stress_level INT CHECK (stress_level BETWEEN 1 AND 5),
    sleep_hours NUMERIC DEFAULT 8.0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, entry_date)
);

-- 12. JOURNAL ENTRIES
CREATE TABLE IF NOT EXISTS public.journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT,
    content TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. DAILY SCORES (LIFE SCORE)
CREATE TABLE IF NOT EXISTS public.daily_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    habit_score NUMERIC DEFAULT 0.0,
    goal_score NUMERIC DEFAULT 0.0,
    mood_score NUMERIC DEFAULT 0.0,
    consistency_score NUMERIC DEFAULT 0.0,
    life_score NUMERIC DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- 14. ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon TEXT DEFAULT 'Award',
    requirement JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. USER ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- 16. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. REMINDERS
CREATE TABLE IF NOT EXISTS public.reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE,
    reminder_time TIME NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. ANALYTICS
CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    period TEXT NOT NULL, -- 'weekly', 'monthly', 'yearly', 'lifetime'
    completion_rate NUMERIC DEFAULT 0.0,
    total_completed INT DEFAULT 0,
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, period)
);

-- 19. AI COACH DATA
CREATE TABLE IF NOT EXISTS public.ai_coach_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    insights TEXT,
    recommendations TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 2. INDEX OPTIMIZATIONS
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON public.habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_created_at ON public.habits(created_at);

CREATE INDEX IF NOT EXISTS idx_completions_user_id ON public.habit_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_completions_habit_id ON public.habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS idx_completions_date ON public.habit_completions(completion_date);

CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goal_progress_goal_id ON public.goal_progress(goal_id);

CREATE INDEX IF NOT EXISTS idx_mood_user_id ON public.mood_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_user_id ON public.journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_scores_user_date ON public.daily_scores(user_id, date);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, read);

-- ==========================================
-- 3. ROW LEVEL SECURITY (RLS) & POLICIES
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fixed_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_coach_data ENABLE ROW LEVEL SECURITY;

-- User Isolation Policies (auth.uid() = user_id)
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can access own settings" ON public.user_settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access own habits" ON public.habits FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access habit schedules" ON public.habit_schedules FOR ALL USING (
    EXISTS (SELECT 1 FROM public.habits WHERE id = habit_schedules.habit_id AND user_id = auth.uid())
);
CREATE POLICY "Users can access habit completions" ON public.habit_completions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access habit streaks" ON public.habit_streaks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access own goals" ON public.goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access goal progress" ON public.goal_progress FOR ALL USING (
    EXISTS (SELECT 1 FROM public.goals WHERE id = goal_progress.goal_id AND user_id = auth.uid())
);
CREATE POLICY "Users can access mood entries" ON public.mood_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access journal entries" ON public.journal_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access daily scores" ON public.daily_scores FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access user achievements" ON public.user_achievements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access reminders" ON public.reminders FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access analytics" ON public.analytics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access ai coach data" ON public.ai_coach_data FOR ALL USING (auth.uid() = user_id);

-- Public Read Policies
CREATE POLICY "Public read habit categories" ON public.habit_categories FOR SELECT USING (is_system = TRUE OR auth.uid() = user_id);
CREATE POLICY "Users can create own habit categories" ON public.habit_categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habit categories" ON public.habit_categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own habit categories" ON public.habit_categories FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public read fixed habits" ON public.fixed_habits FOR SELECT USING (TRUE);
CREATE POLICY "Public read achievements" ON public.achievements FOR SELECT USING (TRUE);

-- ==========================================
-- 4. DATABASE TRIGGERS & FUNCTIONS
-- ==========================================

-- Trigger Function: Automatic Profile and Settings Creation on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'LifeOS Architect'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256')
    );

    INSERT INTO public.user_settings (user_id)
    VALUES (NEW.id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- Function: Calculate & Update Habit Streaks
CREATE OR REPLACE FUNCTION public.update_habit_streak()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
    v_habit_id UUID;
    v_curr_streak INT := 0;
    v_longest_streak INT := 0;
    v_last_date DATE;
    v_check_date DATE;
BEGIN
    v_user_id := NEW.user_id;
    v_habit_id := NEW.habit_id;

    IF NEW.completed = TRUE THEN
        -- Calculate consecutive completed days
        v_check_date := NEW.completion_date;
        WHILE EXISTS (
            SELECT 1 FROM public.habit_completions 
            WHERE habit_id = v_habit_id AND completion_date = v_check_date AND completed = TRUE
        ) LOOP
            v_curr_streak := v_curr_streak + 1;
            v_check_date := v_check_date - INTERVAL '1 day';
        END LOOP;

        -- Fetch existing longest streak
        SELECT longest_streak INTO v_longest_streak 
        FROM public.habit_streaks 
        WHERE habit_id = v_habit_id;

        IF v_longest_streak IS NULL THEN
            v_longest_streak := 0;
        END IF;

        IF v_curr_streak > v_longest_streak THEN
            v_longest_streak := v_curr_streak;
        END IF;

        -- Upsert streak table
        INSERT INTO public.habit_streaks (user_id, habit_id, current_streak, longest_streak, last_completed_date, updated_at)
        VALUES (v_user_id, v_habit_id, v_curr_streak, v_longest_streak, NEW.completion_date, NOW())
        ON CONFLICT (habit_id) DO UPDATE SET
            current_streak = EXCLUDED.current_streak,
            longest_streak = EXCLUDED.longest_streak,
            last_completed_date = EXCLUDED.last_completed_date,
            updated_at = NOW();
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_habit_completion_streak ON public.habit_completions;
CREATE TRIGGER on_habit_completion_streak
    AFTER INSERT OR UPDATE ON public.habit_completions
    FOR EACH ROW EXECUTE FUNCTION public.update_habit_streak();


-- Function: Calculate Daily Life Score
-- Formula: Life Score = 0.45 * Habit + 0.25 * Goals + 0.15 * Mood + 0.15 * Consistency
CREATE OR REPLACE FUNCTION public.calculate_daily_life_score(p_user_id UUID, p_date DATE DEFAULT CURRENT_DATE)
RETURNS NUMERIC AS $$
DECLARE
    v_habit_score NUMERIC := 0.0;
    v_goal_score NUMERIC := 0.0;
    v_mood_score NUMERIC := 0.0;
    v_consistency_score NUMERIC := 0.0;
    v_final_score NUMERIC := 0.0;
    v_total_habits INT := 0;
    v_completed_habits INT := 0;
    v_valence INT := 4;
    v_energy INT := 4;
BEGIN
    -- 1. Habit Score (0-100)
    SELECT COUNT(*) INTO v_total_habits FROM public.habits WHERE user_id = p_user_id AND is_active = TRUE;
    IF v_total_habits > 0 THEN
        SELECT COUNT(*) INTO v_completed_habits 
        FROM public.habit_completions 
        WHERE user_id = p_user_id AND completion_date = p_date AND completed = TRUE;
        
        v_habit_score := (v_completed_habits::NUMERIC / v_total_habits::NUMERIC) * 100.0;
    ELSE
        v_habit_score := 100.0;
    END IF;

    -- 2. Goal Score (0-100)
    SELECT COALESCE(AVG(progress_percentage), 100.0) INTO v_goal_score
    FROM (
        SELECT CASE WHEN target_value > 0 THEN LEAST(100.0, (current_value / target_value) * 100.0) ELSE 100.0 END AS progress_percentage
        FROM public.goals
        WHERE user_id = p_user_id AND status = 'in_progress'
    ) g;

    -- 3. Mood Score (0-100)
    SELECT valence, energy_level INTO v_valence, v_energy
    FROM public.mood_entries
    WHERE user_id = p_user_id AND entry_date = p_date;

    IF v_valence IS NOT NULL AND v_energy IS NOT NULL THEN
        v_mood_score := ((v_valence + v_energy)::NUMERIC / 10.0) * 100.0;
    ELSE
        v_mood_score := 80.0;
    END IF;

    -- 4. Consistency Score (0-100)
    SELECT COALESCE(AVG(current_streak), 0) * 10 INTO v_consistency_score
    FROM public.habit_streaks
    WHERE user_id = p_user_id;
    v_consistency_score := LEAST(100.0, v_consistency_score);

    -- Calculate Final Weighted Score
    v_final_score := ROUND((0.45 * v_habit_score) + (0.25 * v_goal_score) + (0.15 * v_mood_score) + (0.15 * v_consistency_score), 1);

    -- Upsert Daily Score
    INSERT INTO public.daily_scores (user_id, date, habit_score, goal_score, mood_score, consistency_score, life_score)
    VALUES (p_user_id, p_date, ROUND(v_habit_score, 1), ROUND(v_goal_score, 1), ROUND(v_mood_score, 1), ROUND(v_consistency_score, 1), v_final_score)
    ON CONFLICT (user_id, date) DO UPDATE SET
        habit_score = EXCLUDED.habit_score,
        goal_score = EXCLUDED.goal_score,
        mood_score = EXCLUDED.mood_score,
        consistency_score = EXCLUDED.consistency_score,
        life_score = EXCLUDED.life_score;

    RETURN v_final_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==========================================
-- 5. TEST / SEED DATA
-- ==========================================

-- Seed Habit Categories
INSERT INTO public.habit_categories (name, icon, color, is_system)
VALUES 
    ('Fitness', 'Activity', '#10b981', TRUE),
    ('Health', 'Heart', '#ec4899', TRUE),
    ('Learning', 'BookOpen', '#06b6d4', TRUE),
    ('Finance', 'DollarSign', '#f59e0b', TRUE),
    ('Productivity', 'Briefcase', '#6366f1', TRUE)
ON CONFLICT DO NOTHING;

-- Seed Fixed Habits
INSERT INTO public.fixed_habits (name, description, icon)
VALUES
    ('No Porn', 'Maintain mental clarity and dopamine control', 'ShieldCheck'),
    ('Drink Water', 'Drink at least 3 liters of water daily', 'Droplet'),
    ('Workout', 'Engage in at least 30 minutes of physical training', 'Activity'),
    ('Meditation', 'Practice mindfulness meditation for 15 minutes', 'Sparkles'),
    ('Reading', 'Read at least 20 pages of a book', 'BookOpen'),
    ('Sleep Before 11 PM', 'Prioritize circadian rhythm and restorative sleep', 'Moon')
ON CONFLICT (name) DO NOTHING;

-- Seed Achievements
INSERT INTO public.achievements (name, description, icon, requirement)
VALUES
    ('7 Day Streak', 'Maintain an active habit streak for 7 consecutive days', 'Flame', '{"streak_days": 7}'),
    ('30 Day Streak', 'Maintain an active habit streak for 30 consecutive days', 'Award', '{"streak_days": 30}'),
    ('100 Day Streak', 'Reach 100 days of unbroken discipline', 'Trophy', '{"streak_days": 100}'),
    ('Fitness Hero', 'Complete 50 workout habit sessions', 'Zap', '{"category": "Fitness", "count": 50}'),
    ('Bookworm', 'Read 20 pages a day for 14 days', 'BookOpen', '{"category": "Learning", "count": 14}'),
    ('Coding Beast', 'Log deep work coding sessions 5 days a week', 'Code', '{"category": "Productivity", "count": 20}')
ON CONFLICT (name) DO NOTHING;
