import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          student_id: string;
          full_name: string;
          bio: string | null;
          skills: string[] | null;
          social_links: Record<string, string> | null;
          profile_pic: string | null;
          quote: string | null;
          public: boolean;
          first_login: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          student_id: string;
          full_name: string;
          bio?: string | null;
          skills?: string[] | null;
          social_links?: Record<string, string> | null;
          profile_pic?: string | null;
          quote?: string | null;
          public?: boolean;
          first_login?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          student_id?: string;
          full_name?: string;
          bio?: string | null;
          skills?: string[] | null;
          social_links?: Record<string, string> | null;
          profile_pic?: string | null;
          quote?: string | null;
          public?: boolean;
          first_login?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      pages: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content?: string;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      media: {
        Row: {
          id: string;
          user_id: string;
          file_url: string;
          file_name: string;
          file_type: 'image' | 'document' | 'video';
          file_size: number;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          file_url: string;
          file_name: string;
          file_type: 'image' | 'document' | 'video';
          file_size: number;
          uploaded_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          file_url?: string;
          file_name?: string;
          file_type?: 'image' | 'document' | 'video';
          file_size?: number;
          uploaded_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          user_id: string;
          target_type: 'profile' | 'page';
          target_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          target_type: 'profile' | 'page';
          target_id: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          target_type?: 'profile' | 'page';
          target_id?: string;
          content?: string;
          created_at?: string;
        };
      };
      profile_views: {
        Row: {
          id: string;
          profile_id: string;
          visitor_id: string | null;
          visited_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          visitor_id?: string | null;
          visited_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          visitor_id?: string | null;
          visited_at?: string;
        };
      };
    };
  };
};

// Helper functions for common operations
export const createProfile = async (profileData: Database['public']['Tables']['profiles']['Insert']) => {
  // Validate student ID format (more flexible)
  if (profileData.student_id && !/^[A-Za-z0-9]{3,20}$/.test(profileData.student_id.trim())) {
    return { data: null, error: { message: 'Student ID must be 3-20 characters (letters and numbers only)' } };
  }

  // Validate and format name
  if (profileData.full_name) {
    const trimmedName = profileData.full_name.trim();
    if (trimmedName.length < 2) {
      return { data: null, error: { message: 'Name must be at least 2 characters long' } };
    }
    profileData.full_name = trimmedName;
  }

  // Ensure student_id is trimmed
  if (profileData.student_id) {
    profileData.student_id = profileData.student_id.trim();
  }

  const { data, error } = await supabase
    .from('profiles')
    .insert(profileData)
    .select()
    .single();
  
  return { data, error };
};

export const updateProfile = async (userId: string, updates: Database['public']['Tables']['profiles']['Update']) => {
  // Validate and format name if provided
  if (updates.full_name) {
    const trimmedName = updates.full_name.trim();
    if (!/^[A-Za-z\s]{2,50}$/.test(trimmedName)) {
      return { data: null, error: { message: 'Name must be 2-50 characters (letters and spaces only)' } };
    }
    updates.full_name = trimmedName;
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();
  
  return { data, error };
};

export const getProfile = async (studentId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('student_id', studentId)
    .single();
  
  return { data, error };
};

export const trackProfileView = async (profileId: string, visitorId?: string) => {
  const { error } = await supabase
    .from('profile_views')
    .insert({
      profile_id: profileId,
      visitor_id: visitorId || null
    });
  
  return { error };
};

export const uploadFile = async (file: File, userId: string, bucket: string = 'media') => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);
  
  if (uploadError) return { data: null, error: uploadError };
  
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);
  
  // Save to media table
  const { data: mediaData, error: mediaError } = await supabase
    .from('media')
    .insert({
      user_id: userId,
      file_url: urlData.publicUrl,
      file_name: file.name,
      file_type: file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('video/') ? 'video' : 'document',
      file_size: file.size
    })
    .select()
    .single();
  
  return { data: mediaData, error: mediaError };
};