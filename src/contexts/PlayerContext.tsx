import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Lecture } from "@/data/content";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://dummy.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "dummy-key";

const supabase = createClient(supabaseUrl, supabaseKey);

const STORAGE_KEY = "player_state";
const USER_ID_KEY = "user_id";

function getUserId(): string {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = `user_${Math.random().toString(36).substring(2, 15)}${Date.now()}`;
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
}

interface PlayerState {
  currentTrack: Lecture | null;
  isPlaying: boolean;
  playbackSpeed: number;
  progress: number;
  currentTime: number;
}

interface SavedProgress {
  contentId: string;
  progress: number;
  currentTime: number;
  lastPlayed: string;
}

interface PlayerContextType extends PlayerState {
  play: (lecture: Lecture, resumeFrom?: number) => void;
  togglePlay: () => void;
  setSpeed: (speed: number) => void;
  setProgress: (progress: number, currentTime?: number) => void;
  close: () => void;
  getSavedProgress: (contentId: string) => Promise<SavedProgress | null>;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlayerState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          currentTrack: parsed.currentTrack || null,
          isPlaying: false,
          playbackSpeed: parsed.playbackSpeed || 1,
          progress: parsed.progress || 0,
          currentTime: parsed.currentTime || 0,
        };
      } catch {
        return {
          currentTrack: null,
          isPlaying: false,
          playbackSpeed: 1,
          progress: 0,
          currentTime: 0,
        };
      }
    }
    return {
      currentTrack: null,
      isPlaying: false,
      playbackSpeed: 1,
      progress: 0,
      currentTime: 0,
    };
  });

  useEffect(() => {
    const stateToSave = {
      currentTrack: state.currentTrack,
      playbackSpeed: state.playbackSpeed,
      progress: state.progress,
      currentTime: state.currentTime,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));

    if (state.currentTrack && state.progress > 0) {
      saveProgressToDatabase(state.currentTrack.id, state.progress, state.currentTime);
    }
  }, [state.currentTrack, state.progress, state.playbackSpeed, state.currentTime]);

  const saveProgressToDatabase = async (contentId: string, progress: number, currentTime: number) => {
    try {
      const userId = getUserId();

      const { data: existing } = await supabase
        .from("playback_progress")
        .select("id")
        .eq("user_id", userId)
        .eq("content_id", contentId)
        .maybeSingle();

      const progressData = {
        user_id: userId,
        content_id: contentId,
        progress_seconds: Math.floor(currentTime),
        progress_percentage: Math.round(progress * 100) / 100,
        completed: progress >= 95,
        last_played_at: new Date().toISOString(),
      };

      if (existing) {
        await supabase
          .from("playback_progress")
          .update(progressData)
          .eq("id", existing.id);
      } else {
        await supabase
          .from("playback_progress")
          .insert(progressData);
      }
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const getSavedProgress = async (contentId: string): Promise<SavedProgress | null> => {
    try {
      const userId = getUserId();
      const { data } = await supabase
        .from("playback_progress")
        .select("progress_seconds, progress_percentage, last_played_at")
        .eq("user_id", userId)
        .eq("content_id", contentId)
        .maybeSingle();

      if (data && data.progress_percentage > 5 && data.progress_percentage < 95) {
        return {
          contentId,
          progress: data.progress_percentage,
          currentTime: data.progress_seconds,
          lastPlayed: data.last_played_at,
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching progress:", error);
      return null;
    }
  };

  const play = useCallback((lecture: Lecture, resumeFrom?: number) => {
    const startProgress = resumeFrom !== undefined ? resumeFrom : 0;
    const startTime = resumeFrom !== undefined ? (lecture.transcript?.[0]?.time || 0) * (resumeFrom / 100) : 0;

    setState({
      currentTrack: lecture,
      isPlaying: true,
      playbackSpeed: state.playbackSpeed,
      progress: startProgress,
      currentTime: startTime,
    });
  }, [state.playbackSpeed]);

  const togglePlay = useCallback(() => {
    setState((s) => ({ ...s, isPlaying: !s.isPlaying }));
  }, []);

  const setSpeed = useCallback((speed: number) => {
    setState((s) => ({ ...s, playbackSpeed: speed }));
  }, []);

  const setProgress = useCallback((progress: number, currentTime?: number) => {
    setState((s) => ({
      ...s,
      progress,
      currentTime: currentTime !== undefined ? currentTime : s.currentTime,
    }));
  }, []);

  const close = useCallback(() => {
    setState((s) => ({
      currentTrack: null,
      isPlaying: false,
      playbackSpeed: s.playbackSpeed,
      progress: 0,
      currentTime: 0,
    }));
  }, []);

  return (
    <PlayerContext.Provider value={{ ...state, play, togglePlay, setSpeed, setProgress, close, getSavedProgress }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
