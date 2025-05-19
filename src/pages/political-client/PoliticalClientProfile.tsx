
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import PoliticalClientLayout from '@/components/layout/PoliticalClientLayout';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useAuth from '@/hooks/useAuth';
import { updatePoliticalClientAPI } from '@/services/api';
import { User, TargetingOptions } from '@/types';

// Form schema
const profileSchema = z.object({
  politicalClientName: z.string().min(2, 'Name must be at least 2 characters'),
  loginUsername: z.string().email('Invalid email format'),
  email: z.string().email('Invalid email format').optional(),
  ein: z.string().optional(),
  fecNum: z.string().optional(),
  pacId: z.string().optional(),
  fundingMethod: z.string().optional(),
  platform: z.string().optional(),
  profileImagePayload: z.string().optional(),
  targets: z.object({
    age: z.array(z.string()).optional(),
    education: z.array(z.string()).optional(),
    gender: z.array(z.string()).optional(),
    language: z.array(z.string()).optional(),
    location: z.array(z.string()).optional(),
    relationship: z.array(z.string()).optional(),
  }).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// Options for targeting selects
const targetingOptions = {
  age: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
  education: ['High School', 'Some College', 'Bachelor\'s Degree', 'Master\'s Degree', 'Doctorate'],
  gender: ['Male', 'Female', 'Non-binary', 'Other'],
  language: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Other'],
  relationship: ['Single', 'In a relationship', 'Married', 'Divorced', 'Widowed'],
};

const PoliticalClientProfile: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(user?.profileImageUrl || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with user data
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      politicalClientName: user?.politicalClientName || '',
      loginUsername: user?.loginUsername || user?.email || '',
      email: user?.email || user?.loginUsername || '',
      ein: user?.ein || '',
      fecNum: user?.fecNum || '',
      pacId: user?.pacId || '',
      fundingMethod: user?.fundingMethod || '',
      platform: user?.platform || '',
      targets: user?.targets || {
        age: [],
        education: [],
        gender: [],
        language: [],
        location: [],
        relationship: [],
      },
    },
  });

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      form.reset({
        politicalClientName: user.politicalClientName || '',
        loginUsername: user.loginUsername || user.email || '',
        email: user.email || user.loginUsername || '',
        ein: user.ein || '',
        fecNum: user.fecNum || '',
        pacId: user.pacId || '',
        fundingMethod: user.fundingMethod || '',
        platform: user.platform || '',
        targets: user.targets || {
          age: [],
          education: [],
          gender: [],
          language: [],
          location: [],
          relationship: [],
        },
      });
      setProfileImage(user.profileImageUrl || null);
    }
  }, [user, form]);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File is too large. Please select an image under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1]; // Remove the data:image/jpeg;base64, part
      form.setValue('profileImagePayload', base64Data);
      setProfileImage(base64String);
    };
    reader.readAsDataURL(file);
  };

  // Handle form submission
  const onSubmit = async (values: ProfileFormValues) => {
    if (!user?.loginUsername) {
      toast.error('User information is missing');
      return;
    }

    setIsSubmitting(true);
    try {
      const updateData = {
        ...values,
        targets: values.targets ? JSON.stringify(values.targets) : undefined,
      };

      const updatedProfile = await updatePoliticalClientAPI(user.loginUsername, updateData);
      
      // Update user in context
      if (updatedProfile) {
        const updatedUser: User = {
          ...user,
          politicalClientName: values.politicalClientName,
          loginUsername: values.loginUsername,
          email: values.email,
          ein: values.ein,
          fecNum: values.fecNum,
          pacId: values.pacId,
          fundingMethod: values.fundingMethod,
          platform: values.platform,
          targets: values.targets as TargetingOptions,
          profileImageUrl: updatedProfile.profileImageUrl || user.profileImageUrl,
        };
        updateUserProfile(updatedUser);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error(`Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PoliticalClientLayout title="Political Client Profile">
      <Tabs defaultValue="basic">
        <TabsList>
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="targeting">Targeting Settings</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Update your organization details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Profile Image */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-muted flex items-center justify-center">
                      {profileImage ? (
                        <img 
                          src={profileImage} 
                          alt="Profile" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <span className="text-4xl text-muted-foreground">PC</span>
                      )}
                    </div>
                    <Input 
                      id="profileImage" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload}
                      className="max-w-xs"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Max file size: 5MB</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Organization Name */}
                    <FormField
                      control={form.control}
                      name="politicalClientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter organization name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Login Username/Email */}
                    <FormField
                      control={form.control}
                      name="loginUsername"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Login Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter login email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* EIN */}
                    <FormField
                      control={form.control}
                      name="ein"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>EIN</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter EIN" {...field} />
                          </FormControl>
                          <FormDescription>
                            Employer Identification Number
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* FEC Number */}
                    <FormField
                      control={form.control}
                      name="fecNum"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>FEC Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter FEC number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* PAC ID */}
                    <FormField
                      control={form.control}
                      name="pacId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PAC ID</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter PAC ID" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Funding Method */}
                    <FormField
                      control={form.control}
                      name="fundingMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Funding Method</FormLabel>
                          <FormControl>
                            <Select 
                              value={field.value || ''}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select funding method" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="direct">Direct</SelectItem>
                                <SelectItem value="pac">PAC</SelectItem>
                                <SelectItem value="both">Both</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Platform */}
                    <FormField
                      control={form.control}
                      name="platform"
                      render={({ field }) => (
                        <FormItem className="col-span-1 md:col-span-2">
                          <FormLabel>Platform/Mission</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your organization's platform or mission" 
                              className="h-32"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="targeting" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Default Targeting Settings</CardTitle>
                  <CardDescription>
                    Configure default targeting options for your initiatives
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Age Targeting */}
                    <FormField
                      control={form.control}
                      name="targets.age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age Groups</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value?.[0] || ''}
                              onValueChange={(value) => field.onChange([value])}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select age group" />
                              </SelectTrigger>
                              <SelectContent>
                                {targetingOptions.age.map((age) => (
                                  <SelectItem key={age} value={age}>{age}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Education Targeting */}
                    <FormField
                      control={form.control}
                      name="targets.education"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Education Level</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value?.[0] || ''}
                              onValueChange={(value) => field.onChange([value])}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select education level" />
                              </SelectTrigger>
                              <SelectContent>
                                {targetingOptions.education.map((edu) => (
                                  <SelectItem key={edu} value={edu}>{edu}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Gender Targeting */}
                    <FormField
                      control={form.control}
                      name="targets.gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value?.[0] || ''}
                              onValueChange={(value) => field.onChange([value])}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                {targetingOptions.gender.map((gender) => (
                                  <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Language Targeting */}
                    <FormField
                      control={form.control}
                      name="targets.language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Language</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value?.[0] || ''}
                              onValueChange={(value) => field.onChange([value])}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                              <SelectContent>
                                {targetingOptions.language.map((lang) => (
                                  <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Location Targeting */}
                    <FormField
                      control={form.control}
                      name="targets.location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter targeted locations (e.g., NY, CA)" 
                              value={field.value?.join(', ') || ''}
                              onChange={(e) => {
                                const locations = e.target.value
                                  .split(',')
                                  .map(loc => loc.trim())
                                  .filter(Boolean);
                                field.onChange(locations);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter locations separated by commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Relationship Status Targeting */}
                    <FormField
                      control={form.control}
                      name="targets.relationship"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relationship Status</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value?.[0] || ''}
                              onValueChange={(value) => field.onChange([value])}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select relationship status" />
                              </SelectTrigger>
                              <SelectContent>
                                {targetingOptions.relationship.map((rel) => (
                                  <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </PoliticalClientLayout>
  );
};

export default PoliticalClientProfile;
