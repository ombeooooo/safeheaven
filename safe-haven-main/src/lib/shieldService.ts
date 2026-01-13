import { supabase } from './supabase';

const USER_ID_KEY = 'shield_user_id';

export const getUserId = (): string => {
  let userId = localStorage.getItem(USER_ID_KEY);

  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, userId);
  }

  return userId;
};

export const getBlockedSites = async (): Promise<string[]> => {
  const userId = getUserId();

  const { data, error } = await supabase
    .from('blocked_sites')
    .select('domain')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching blocked sites:', error);
    return [];
  }

  return data.map(item => item.domain);
};

export const addBlockedSite = async (domain: string): Promise<boolean> => {
  const userId = getUserId();

  const { error } = await supabase
    .from('blocked_sites')
    .insert({ user_id: userId, domain });

  if (error) {
    console.error('Error adding blocked site:', error);
    return false;
  }

  return true;
};

export const removeBlockedSite = async (domain: string): Promise<boolean> => {
  const userId = getUserId();

  const { error } = await supabase
    .from('blocked_sites')
    .delete()
    .eq('user_id', userId)
    .eq('domain', domain);

  if (error) {
    console.error('Error removing blocked site:', error);
    return false;
  }

  return true;
};

export const getBlockedKeywords = async (): Promise<string[]> => {
  const userId = getUserId();

  const { data, error } = await supabase
    .from('blocked_keywords')
    .select('keyword')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching blocked keywords:', error);
    return [];
  }

  return data.map(item => item.keyword);
};

export const addBlockedKeyword = async (keyword: string): Promise<boolean> => {
  const userId = getUserId();

  const { error } = await supabase
    .from('blocked_keywords')
    .insert({ user_id: userId, keyword });

  if (error) {
    console.error('Error adding blocked keyword:', error);
    return false;
  }

  return true;
};

export const removeBlockedKeyword = async (keyword: string): Promise<boolean> => {
  const userId = getUserId();

  const { error } = await supabase
    .from('blocked_keywords')
    .delete()
    .eq('user_id', userId)
    .eq('keyword', keyword);

  if (error) {
    console.error('Error removing blocked keyword:', error);
    return false;
  }

  return true;
};

export interface StreakData {
  currentStreak: number;
  lastCheckIn: string | null;
  protectionEnabled: boolean;
}

export const getStreak = async (): Promise<StreakData> => {
  const userId = getUserId();

  const { data, error } = await supabase
    .from('streaks')
    .select('current_streak, last_check_in, protection_enabled')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching streak:', error);
    return { currentStreak: 0, lastCheckIn: null, protectionEnabled: true };
  }

  if (!data) {
    const { data: newStreak } = await supabase
      .from('streaks')
      .insert({ user_id: userId, current_streak: 0, protection_enabled: true })
      .select('current_streak, last_check_in, protection_enabled')
      .single();

    return {
      currentStreak: newStreak?.current_streak || 0,
      lastCheckIn: newStreak?.last_check_in || null,
      protectionEnabled: newStreak?.protection_enabled || true,
    };
  }

  return {
    currentStreak: data.current_streak,
    lastCheckIn: data.last_check_in,
    protectionEnabled: data.protection_enabled,
  };
};

export const updateProtectionStatus = async (enabled: boolean): Promise<boolean> => {
  const userId = getUserId();

  const { error } = await supabase
    .from('streaks')
    .update({ protection_enabled: enabled, updated_at: new Date().toISOString() })
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating protection status:', error);
    return false;
  }

  return true;
};

export const checkInStreak = async (): Promise<number> => {
  const userId = getUserId();
  const today = new Date().toISOString().split('T')[0];

  const { data: currentData } = await supabase
    .from('streaks')
    .select('current_streak, last_check_in, protection_enabled')
    .eq('user_id', userId)
    .maybeSingle();

  if (!currentData) {
    const { data: newStreak } = await supabase
      .from('streaks')
      .insert({
        user_id: userId,
        current_streak: 1,
        last_check_in: today,
        protection_enabled: true
      })
      .select('current_streak')
      .single();

    return newStreak?.current_streak || 1;
  }

  const lastCheckIn = currentData.last_check_in;
  let newStreak = currentData.current_streak;

  if (!lastCheckIn) {
    newStreak = 1;
  } else if (lastCheckIn === today) {
    return newStreak;
  } else {
    const lastDate = new Date(lastCheckIn);
    const todayDate = new Date(today);
    const diffTime = todayDate.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1 && currentData.protection_enabled) {
      newStreak += 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    }
  }

  await supabase
    .from('streaks')
    .update({
      current_streak: newStreak,
      last_check_in: today,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);

  return newStreak;
};
