import { supabase } from '../config/database';

export interface ProfileInput {
  name: string;
  mobile_number: string;
  address: string;
  business_name?: string;
}

export class ProfileService {
  /**
   * Save or update user profile
   */
  static async saveProfile(userId: string, input: ProfileInput) {
    const { name, mobile_number, address, business_name } = input;

    // Check existing profile
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existingProfile) {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          name,
          mobile_number,
          address,
          business_name: business_name || null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        throw { statusCode: 500, message: 'Failed to update profile.' };
      }

      return data;
    } else {
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: userId,
            name,
            mobile_number,
            address,
            business_name: business_name || null
          }
        ])
        .select('*')
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        throw { statusCode: 500, message: 'Failed to save profile.' };
      }

      return data;
    }
  }

  /**
   * Get user profile by User ID
   */
  static async getProfile(userId: string) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
      throw { statusCode: 500, message: 'Failed to fetch profile.' };
    }

    return profile || null;
  }
}
