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
  isPaused: boolean;
  pauseStartedAt: string | null;
}

export interface UserStatistics {
  totalBlocksPrevented: number;
  longestStreak: number;
  totalSitesManaged: number;
}

export interface ProtectionEvent {
  id: string;
  eventType: string;
  details: string | null;
  createdAt: string;
}

export const getStreak = async (): Promise<StreakData> => {
  const userId = getUserId();

  const { data, error } = await supabase
    .from('streaks')
    .select('current_streak, last_check_in, protection_enabled, is_paused, pause_started_at')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching streak:', error);
    return {
      currentStreak: 0,
      lastCheckIn: null,
      protectionEnabled: true,
      isPaused: false,
      pauseStartedAt: null
    };
  }

  if (!data) {
    const { data: newStreak } = await supabase
      .from('streaks')
      .insert({ user_id: userId, current_streak: 0, protection_enabled: true, is_paused: false })
      .select('current_streak, last_check_in, protection_enabled, is_paused, pause_started_at')
      .single();

    return {
      currentStreak: newStreak?.current_streak || 0,
      lastCheckIn: newStreak?.last_check_in || null,
      protectionEnabled: newStreak?.protection_enabled || true,
      isPaused: newStreak?.is_paused || false,
      pauseStartedAt: newStreak?.pause_started_at || null,
    };
  }

  return {
    currentStreak: data.current_streak,
    lastCheckIn: data.last_check_in,
    protectionEnabled: data.protection_enabled,
    isPaused: data.is_paused || false,
    pauseStartedAt: data.pause_started_at || null,
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

export const getStatistics = async (): Promise<UserStatistics> => {
  const userId = getUserId();

  const { data, error } = await supabase
    .from('user_statistics')
    .select('total_blocks_prevented, longest_streak, total_sites_managed')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching statistics:', error);
    return { totalBlocksPrevented: 0, longestStreak: 0, totalSitesManaged: 0 };
  }

  if (!data) {
    const { data: newStats } = await supabase
      .from('user_statistics')
      .insert({ user_id: userId })
      .select('total_blocks_prevented, longest_streak, total_sites_managed')
      .single();

    return {
      totalBlocksPrevented: newStats?.total_blocks_prevented || 0,
      longestStreak: newStats?.longest_streak || 0,
      totalSitesManaged: newStats?.total_sites_managed || 0,
    };
  }

  return {
    totalBlocksPrevented: data.total_blocks_prevented,
    longestStreak: data.longest_streak,
    totalSitesManaged: data.total_sites_managed,
  };
};

export const recordProtectionEvent = async (
  eventType: string,
  details?: string
): Promise<boolean> => {
  const userId = getUserId();

  const { error } = await supabase
    .from('protection_events')
    .insert({ user_id: userId, event_type: eventType, details: details || null });

  if (error) {
    console.error('Error recording protection event:', error);
    return false;
  }

  if (eventType === 'site_blocked' || eventType === 'keyword_blocked') {
    const { error: statsError } = await supabase.rpc('increment_blocks_prevented', {
      p_user_id: userId
    });

    if (statsError) {
      const { data: stats } = await supabase
        .from('user_statistics')
        .select('total_blocks_prevented')
        .eq('user_id', userId)
        .maybeSingle();

      const currentBlocks = stats?.total_blocks_prevented || 0;

      await supabase
        .from('user_statistics')
        .upsert({
          user_id: userId,
          total_blocks_prevented: currentBlocks + 1,
          updated_at: new Date().toISOString()
        });
    }
  }

  return true;
};

export const getRecentActivity = async (limit: number = 10): Promise<ProtectionEvent[]> => {
  const userId = getUserId();

  const { data, error } = await supabase
    .from('protection_events')
    .select('id, event_type, details, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }

  return data.map(event => ({
    id: event.id,
    eventType: event.event_type,
    details: event.details,
    createdAt: event.created_at,
  }));
};

export const togglePause = async (pause: boolean): Promise<boolean> => {
  const userId = getUserId();

  const updateData = pause
    ? { is_paused: true, pause_started_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    : { is_paused: false, pause_started_at: null, updated_at: new Date().toISOString() };

  const { error } = await supabase
    .from('streaks')
    .update(updateData)
    .eq('user_id', userId);

  if (error) {
    console.error('Error toggling pause:', error);
    return false;
  }

  await recordProtectionEvent(pause ? 'protection_paused' : 'protection_resumed');

  return true;
};

export const updateLongestStreak = async (currentStreak: number): Promise<void> => {
  const userId = getUserId();

  const { data: stats } = await supabase
    .from('user_statistics')
    .select('longest_streak')
    .eq('user_id', userId)
    .maybeSingle();

  const longestStreak = stats?.longest_streak || 0;

  if (currentStreak > longestStreak) {
    await supabase
      .from('user_statistics')
      .upsert({
        user_id: userId,
        longest_streak: currentStreak,
        updated_at: new Date().toISOString()
      });
  }
};
