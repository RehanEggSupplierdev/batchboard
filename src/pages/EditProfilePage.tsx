import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Save, Plus, Trash2, Upload, X } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import Card from '../components/UI/Card';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import { useAuth } from '../contexts/AuthContext';
import { supabase, uploadFile } from '../lib/supabase';
import toast from 'react-hot-toast';

const schema = yup.object({
  full_name: yup.string()
    .required('Name is required')
    .matches(/^[A-Z\s]+$/, 'Name should be in uppercase letters only (e.g., AFTAB)')
    .max(50, 'Name too long'),
  bio: yup.string().max(500, 'Bio must be less than 500 characters'),
  quote: yup.string().max(200, 'Quote must be less than 200 characters'),
  skills: yup.array().of(
    yup.object({
      value: yup.string().required('Skill is required').max(50, 'Skill name too long')
    })
  ).max(20, 'Maximum 20 skills allowed'),
  social_links: yup.array().of(
    yup.object({
      platform: yup.string().required('Platform is required'),
      url: yup.string().url('Must be a valid URL').required('URL is required')
    })
  ).max(10, 'Maximum 10 social links allowed'),
  public: yup.boolean()
});

interface FormData {
  full_name: string;
  bio: string;
  quote: string;
  skills: { value: string }[];
  social_links: { platform: string; url: string }[];
  public: boolean;
}

const EditProfilePage: React.FC = () => {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty }
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      full_name: '',
      bio: '',
      quote: '',
      skills: [],
      social_links: [],
      public: true
    }
  });

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control,
    name: 'skills'
  });

  const { fields: socialFields, append: appendSocial, remove: removeSocial } = useFieldArray({
    control,
    name: 'social_links'
  });

  const bioValue = watch('bio');

  useEffect(() => {
    if (profile) {
      setValue('full_name', profile.full_name || '');
      setValue('bio', profile.bio || '');
      setValue('quote', profile.quote || '');
      setValue('public', profile.public ?? true);
      setProfilePic(profile.profile_pic);

      // Set skills
      if (profile.skills && profile.skills.length > 0) {
        setValue('skills', profile.skills.map(skill => ({ value: skill })));
      }

      // Set social links
      if (profile.social_links && Object.keys(profile.social_links).length > 0) {
        const socialArray = Object.entries(profile.social_links).map(([platform, url]) => ({
          platform,
          url
        }));
        setValue('social_links', socialArray);
      }
    }
  }, [profile, setValue]);

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const { data, error } = await uploadFile(file, user.id, 'profiles');
      
      if (error) {
        toast.error('Failed to upload image');
      } else if (data) {
        setProfilePic(data.file_url);
        toast.success('Profile picture uploaded!');
      }
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!user) return;

    setLoading(true);
    try {
      // Prepare social links object
      const socialLinksObj = data.social_links.reduce((acc, link) => {
        acc[link.platform] = link.url;
        return acc;
      }, {} as Record<string, string>);

      // Prepare skills array
      const skillsArray = data.skills.map(skill => skill.value);

      const updates = {
        full_name: data.full_name,
        bio: data.bio || null,
        quote: data.quote || null,
        skills: skillsArray,
        social_links: socialLinksObj,
        profile_pic: profilePic,
        public: data.public
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) {
        toast.error('Failed to update profile');
      } else {
        await refreshProfile();
        toast.success('Profile updated successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Profile</h1>
          <p className="text-gray-600">
            Update your profile information to showcase your personality and skills.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Profile Picture */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Picture</h2>
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-2xl font-bold text-white">
                      {getInitials(profile?.full_name || 'U')}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div>
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      loading={uploading}
                      onClick={(e) => {
                        e.preventDefault();
                        (e.target as HTMLElement).previousElementSibling?.click();
                      }}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload New Picture
                    </Button>
                  </label>
                </div>
                {profilePic && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setProfilePic(null)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove Picture
                  </Button>
                )}
                <p className="text-sm text-gray-500">
                  JPG, PNG or GIF. Max size 5MB.
                </p>
              </div>
            </div>
          </Card>

          {/* Basic Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <Input
                label="Name (First Name Only)"
                placeholder="e.g., AFTAB"
                error={errors.full_name?.message}
                helperText="Use uppercase letters only for your first name"
                {...register('full_name')}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  {...register('bio')}
                  rows={4}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us about yourself..."
                />
                <div className="flex justify-between mt-1">
                  {errors.bio && (
                    <p className="text-sm text-red-600">{errors.bio.message}</p>
                  )}
                  <p className="text-sm text-gray-500 ml-auto">
                    {bioValue?.length || 0}/500 characters
                  </p>
                </div>
              </div>

              <Input
                label="Personal Quote"
                placeholder="Your favorite quote or motto..."
                error={errors.quote?.message}
                {...register('quote')}
              />

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="public"
                  {...register('public')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="public" className="text-sm text-gray-700">
                  Make my profile public (visible to everyone)
                </label>
              </div>
            </div>
          </Card>

          {/* Skills */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Skills & Interests</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendSkill({ value: '' })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
            </div>
            
            <div className="space-y-3">
              {skillFields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <div className="flex-1">
                    <Input
                      placeholder="e.g., JavaScript, Photography, Public Speaking"
                      error={errors.skills?.[index]?.value?.message}
                      {...register(`skills.${index}.value`)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill(index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
              
              {skillFields.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No skills added yet. Click "Add Skill" to get started!
                </p>
              )}
            </div>
          </Card>

          {/* Social Links */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Social Links</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendSocial({ platform: '', url: '' })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Link
              </Button>
            </div>
            
            <div className="space-y-4">
              {socialFields.map((field, index) => (
                <div key={field.id} className="flex items-start space-x-2">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <select
                      {...register(`social_links.${index}.platform`)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Platform</option>
                      <option value="github">GitHub</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="twitter">Twitter</option>
                      <option value="instagram">Instagram</option>
                      <option value="facebook">Facebook</option>
                      <option value="youtube">YouTube</option>
                      <option value="behance">Behance</option>
                      <option value="dribbble">Dribbble</option>
                      <option value="medium">Medium</option>
                      <option value="website">Personal Website</option>
                    </select>
                    <Input
                      placeholder="https://..."
                      error={errors.social_links?.[index]?.url?.message}
                      {...register(`social_links.${index}.url`)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSocial(index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
              
              {socialFields.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No social links added yet. Click "Add Link" to connect your profiles!
                </p>
              )}
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              disabled={!isDirty}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditProfilePage;