import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import PoliticalClientLayout from '@/components/layout/PoliticalClientLayout';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import useAuth from '@/hooks/useAuth';
import { getPoliticalClientInitiativesAPI, upsertInitiativeAPI } from '@/services/api';
import { Initiative, TargetingOptions } from '@/types';

// Form schema
const initiativeSchema = z.object({
  initiativeName: z.string().min(3, 'Initiative name must be at least 3 characters'),
  objective: z.string().min(3, 'Objective is required'),
  status: z.enum(['new', 'active', 'complete']),
  seedQuestions: z.array(z.string().min(3, 'Question must be at least 3 characters')),
  initiativeImagePayload: z.string().optional(),
  targets: z.object({
    age: z.array(z.string()).optional(),
    education: z.array(z.string()).optional(),
    gender: z.array(z.string()).optional(),
    language: z.array(z.string()).optional(),
    location: z.array(z.string()).optional(),
    relationship: z.array(z.string()).optional(),
  }).optional(),
});

type InitiativeFormValues = z.infer<typeof initiativeSchema>;

// Options for dropdowns
const objectiveOptions = [
  'Voter Identification',
  'Persuasion',
  'Get Out The Vote',
  'Issue Advocacy',
  'Fundraising',
  'Volunteer Recruitment',
  'Community Outreach'
];

const targetingOptions = {
  age: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
  education: ['High School', 'Some College', 'Bachelor\'s Degree', 'Master\'s Degree', 'Doctorate'],
  gender: ['Male', 'Female', 'Non-binary', 'Other'],
  language: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Other'],
  relationship: ['Single', 'In a relationship', 'Married', 'Divorced', 'Widowed'],
};

const CreateEditInitiative: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [initiativeImage, setInitiativeImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentInitiative, setCurrentInitiative] = useState<Initiative | null>(null);

  const loginUsername = user?.loginUsername || '';

  // Fetch existing initiative data if editing - fixed the useQuery hook
  const { data: initiatives } = useQuery({
    queryKey: ['politicalClientInitiatives', loginUsername],
    queryFn: () => getPoliticalClientInitiativesAPI(loginUsername),
    enabled: !!loginUsername && isEditing,
    // Moved onSuccess to the proper location per TanStack Query v5
    meta: {
      onSuccess: (data) => {
        if (isEditing && data) {
          const initiative = data.find((init: Initiative) => init.id === id);
          if (initiative) {
            setCurrentInitiative(initiative);
            setInitiativeImage(initiative.initiativeImageUrl || null);
          } else {
            toast.error('Initiative not found');
            navigate('/political-client/dashboard');
          }
        }
      }
    }
  });

  // useEffect to handle data success since we can't use onSuccess in the query options
  useEffect(() => {
    if (isEditing && initiatives) {
      const initiative = initiatives.find((init: Initiative) => init.id === id);
      if (initiative) {
        setCurrentInitiative(initiative);
        setInitiativeImage(initiative.initiativeImageUrl || null);
      } else {
        toast.error('Initiative not found');
        navigate('/political-client/dashboard');
      }
    }
  }, [initiatives, isEditing, id, navigate]);

  // Initialize form with default values or existing initiative data
  const form = useForm<InitiativeFormValues>({
    resolver: zodResolver(initiativeSchema),
    defaultValues: {
      initiativeName: '',
      objective: '',
      status: 'new',
      seedQuestions: [''],
      targets: {
        age: [],
        education: [],
        gender: [],
        language: [],
        location: [],
        relationship: [],
      },
    },
  });

  // Update form when initiative data is loaded
  useEffect(() => {
    if (currentInitiative) {
      form.reset({
        initiativeName: currentInitiative.initiativeName,
        objective: currentInitiative.objective,
        status: currentInitiative.status,
        seedQuestions: currentInitiative.seedQuestions || [''],
        targets: currentInitiative.targets || {
          age: [],
          education: [],
          gender: [],
          language: [],
          location: [],
          relationship: [],
        },
      });
    }
  }, [currentInitiative, form]);

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
      form.setValue('initiativeImagePayload', base64Data);
      setInitiativeImage(base64String);
    };
    reader.readAsDataURL(file);
  };

  // Handle adding a new seed question
  const addQuestion = () => {
    const currentQuestions = form.getValues('seedQuestions') || [];
    form.setValue('seedQuestions', [...currentQuestions, '']);
  };

  // Handle removing a seed question
  const removeQuestion = (index: number) => {
    const currentQuestions = form.getValues('seedQuestions') || [];
    if (currentQuestions.length > 1) {
      const updatedQuestions = currentQuestions.filter((_, i) => i !== index);
      form.setValue('seedQuestions', updatedQuestions);
    }
  };

  // Fixed the form submission function
  const onSubmit = async (values: InitiativeFormValues) => {
    if (!user?.loginUsername) {
      toast.error('User information is missing');
      return;
    }

    setIsSubmitting(true);
    try {
      // Fix: Ensure all required fields are present and properly typed
      const initiativeData = {
        initiativeName: values.initiativeName,
        objective: values.objective,
        seedQuestions: JSON.stringify(values.seedQuestions),
        status: values.status,
        targets: JSON.stringify(values.targets),
        initiativeGuid: isEditing ? id : undefined,
        initiativeImageFilename: values.initiativeImagePayload ? 'initiative-image.jpg' : undefined,
        initiativeImagePayload: values.initiativeImagePayload
      };

      await upsertInitiativeAPI(user.loginUsername, initiativeData);
      toast.success(`Initiative ${isEditing ? 'updated' : 'created'} successfully`);
      navigate('/political-client/dashboard');
    } catch (error) {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} initiative: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PoliticalClientLayout title={isEditing ? 'Edit Initiative' : 'Create New Initiative'}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Initiative Name */}
                <FormField
                  control={form.control}
                  name="initiativeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initiative Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter initiative name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Initiative Objective */}
                <FormField
                  control={form.control}
                  name="objective"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objective</FormLabel>
                      <FormControl>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an objective" />
                          </SelectTrigger>
                          <SelectContent>
                            {objectiveOptions.map((objective) => (
                              <SelectItem key={objective} value={objective}>
                                {objective}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Initiative Status */}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="complete">Complete</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Initiative Image */}
                <FormItem>
                  <FormLabel>Initiative Image</FormLabel>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded overflow-hidden bg-muted flex items-center justify-center">
                      {initiativeImage ? (
                        <img 
                          src={initiativeImage} 
                          alt="Initiative" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <span className="text-2xl text-muted-foreground">+</span>
                      )}
                    </div>
                    <Input 
                      id="initiativeImage" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload}
                      className="max-w-xs"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Max file size: 5MB</p>
                </FormItem>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-lg">Seed Questions</h3>
                  <Button type="button" variant="outline" onClick={addQuestion} size="sm">
                    Add Question
                  </Button>
                </div>

                {/* Seed Questions */}
                {form.watch('seedQuestions')?.map((_, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={`seedQuestions.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-start space-x-3">
                          <FormControl className="flex-1">
                            <Textarea
                              placeholder="Enter a question for donors"
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeQuestion(index)}
                            disabled={form.watch('seedQuestions').length <= 1}
                          >
                            <Trash2 className="h-5 w-5 text-red-500" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <h3 className="font-medium text-lg">Targeting Options</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Age Targeting */}
                  <FormField
                    control={form.control}
                    name="targets.age"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Age Targeting</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value && field.value.length > 0}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([targetingOptions.age[0]]);
                                } else {
                                  field.onChange([]);
                                }
                              }}
                            />
                          </FormControl>
                        </div>
                        
                        {field.value && field.value.length > 0 && (
                          <Select
                            value={field.value[0] || ''}
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
                        )}
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
                        <div className="flex items-center justify-between">
                          <FormLabel>Gender Targeting</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value && field.value.length > 0}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([targetingOptions.gender[0]]);
                                } else {
                                  field.onChange([]);
                                }
                              }}
                            />
                          </FormControl>
                        </div>
                        
                        {field.value && field.value.length > 0 && (
                          <Select
                            value={field.value[0] || ''}
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
                        )}
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
                        <div className="flex items-center justify-between">
                          <FormLabel>Education Targeting</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value && field.value.length > 0}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([targetingOptions.education[0]]);
                                } else {
                                  field.onChange([]);
                                }
                              }}
                            />
                          </FormControl>
                        </div>
                        
                        {field.value && field.value.length > 0 && (
                          <Select
                            value={field.value[0] || ''}
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
                        )}
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
                        <div className="flex items-center justify-between">
                          <FormLabel>Language Targeting</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value && field.value.length > 0}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([targetingOptions.language[0]]);
                                } else {
                                  field.onChange([]);
                                }
                              }}
                            />
                          </FormControl>
                        </div>
                        
                        {field.value && field.value.length > 0 && (
                          <Select
                            value={field.value[0] || ''}
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
                        )}
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
                        <div className="flex items-center justify-between">
                          <FormLabel>Location Targeting</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value && field.value.length > 0}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange(['']);
                                } else {
                                  field.onChange([]);
                                }
                              }}
                            />
                          </FormControl>
                        </div>
                        
                        {field.value && field.value.length > 0 && (
                          <Input 
                            placeholder="Enter targeted locations (e.g., NY, CA)" 
                            value={field.value.join(', ')}
                            onChange={(e) => {
                              const locations = e.target.value
                                .split(',')
                                .map(loc => loc.trim())
                                .filter(Boolean);
                              field.onChange(locations);
                            }}
                          />
                        )}
                        <FormDescription>
                          Enter locations separated by commas
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Relationship Targeting */}
                  <FormField
                    control={form.control}
                    name="targets.relationship"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Relationship Targeting</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value && field.value.length > 0}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([targetingOptions.relationship[0]]);
                                } else {
                                  field.onChange([]);
                                }
                              }}
                            />
                          </FormControl>
                        </div>
                        
                        {field.value && field.value.length > 0 && (
                          <Select
                            value={field.value[0] || ''}
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
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate('/political-client/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Initiative' : 'Create Initiative'}
            </Button>
          </div>
        </form>
      </Form>
    </PoliticalClientLayout>
  );
};

export default CreateEditInitiative;
