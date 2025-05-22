
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { getAllInitiativesAPI, createAdCampaignAPI } from '@/services/api';
import { Initiative } from '@/types';
import { mapBackendInitiativeToInitiative, mapCampaignToAdCampaignRequest } from '@/services/dataMapping';

const CreateCampaign: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingInitiatives, setIsLoadingInitiatives] = useState(false);
  
  // Campaign form state
  const [formData, setFormData] = useState({
    name: '',
    contentType: 'funny',
    contentText: '',
    startDate: '',
    endDate: '',
    adSpend: 100,
  });

  // Initiative state
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [selectedInitiativeGuid, setSelectedInitiativeGuid] = useState<string>('');
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative | null>(null);
  const [seedAnswers, setSeedAnswers] = useState<Record<string, string>>({});
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  // Fetch initiatives on component mount
  useEffect(() => {
    const fetchInitiatives = async () => {
      if (!user?.email && !user?.loginUsername) return;
      
      setIsLoadingInitiatives(true);
      try {
        const loginUsername = user.email || user.loginUsername || '';
        const response = await getAllInitiativesAPI(loginUsername);
        const mappedInitiatives = Array.isArray(response) 
          ? response.map(i => mapBackendInitiativeToInitiative(i))
          : [];
        setInitiatives(mappedInitiatives);
      } catch (error) {
        console.error("Error fetching initiatives:", error);
        toast.error("Failed to load initiatives. Please try again.");
        setInitiatives([]);
      } finally {
        setIsLoadingInitiatives(false);
      }
    };
    
    fetchInitiatives();
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleInitiativeSelect = (value: string) => {
    setSelectedInitiativeGuid(value);
    const initiative = initiatives.find(i => i.id === value) || null;
    setSelectedInitiative(initiative);
    setSeedAnswers({}); // Reset answers when initiative changes
  };
  
  const handleSeedAnswerChange = (question: string, answer: string) => {
    setSeedAnswers(prev => ({
      ...prev,
      [question]: answer
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedInitiativeGuid) {
      toast.error("Please select an initiative");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (!user?.email && !user?.loginUsername) {
        throw new Error("User not authenticated");
      }
      
      // Prepare seed answers in the format expected by the API
      const formattedSeedAnswers = selectedInitiative?.seedQuestions 
        ? selectedInitiative.seedQuestions.map(question => ({
            question,
            answer: seedAnswers[question] || ''
          }))
        : [];
      
      // Create ad campaign request object
      const campaignRequest = mapCampaignToAdCampaignRequest(
        {
          name: formData.name,
          contestId: selectedInitiativeGuid,
          contentText: formData.contentText,
          contentType: formData.contentType as 'funny' | 'personal' | 'formal',
          startDate: formData.startDate,
          endDate: formData.endDate,
          adSpend: formData.adSpend,
        },
        formattedSeedAnswers
      );
      
      // Use email or loginUsername for API call
      const loginUsername = user.email || user.loginUsername || '';
      
      // Send request to API
      const response = await createAdCampaignAPI(loginUsername, campaignRequest);
      
      toast.success("Campaign created successfully!");
      
      // Navigate to the campaign detail page using the returned adCampaignGuid
      if (response && response.adCampaignGuid) {
        navigate(`/campaigns/${response.adCampaignGuid}`);
      } else {
        navigate('/dashboard'); // Fallback if no ID returned
      }
    } catch (error: any) {
      console.error("Error creating campaign:", error);
      
      if (error.code === 'MISSING_REQUIRED_FIELDS') {
        toast.error("Please fill in all required fields");
      } else if (error.code === 'INVALID_INITIATIVE') {
        toast.error("Selected initiative is not valid");
      } else {
        toast.error("Failed to create campaign. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Create a New Campaign</h1>
          <p className="text-muted-foreground mt-2">
            Fill out the form below to create a new targeted ad campaign.
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Details</CardTitle>
                <CardDescription>
                  Basic information about your campaign
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Support for Education Reform"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="initiative">Select Initiative</Label>
                  <Select 
                    value={selectedInitiativeGuid} 
                    onValueChange={handleInitiativeSelect} 
                    disabled={isLoadingInitiatives}
                  >
                    <SelectTrigger id="initiative">
                      <SelectValue placeholder={isLoadingInitiatives ? "Loading initiatives..." : "Select an initiative"} />
                    </SelectTrigger>
                    <SelectContent>
                      {initiatives.map((initiative) => (
                        <SelectItem key={initiative.id} value={initiative.id}>
                          {initiative.initiativeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* These fields are kept for UI consistency but not sent to backend in this phase */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adSpend">Ad Spend ($)</Label>
                  <Input
                    id="adSpend"
                    name="adSpend"
                    type="number"
                    min="100"
                    step="50"
                    value={formData.adSpend}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Campaign Content</CardTitle>
                <CardDescription>
                  Define the content and style of your campaign
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contentType">Content Style</Label>
                  <Select
                    value={formData.contentType}
                    onValueChange={(value) => handleSelectChange('contentType', value)}
                  >
                    <SelectTrigger id="contentType">
                      <SelectValue placeholder="Select content style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="funny">Funny/Light-hearted</SelectItem>
                      <SelectItem value="personal">Personal/Emotional</SelectItem>
                      <SelectItem value="formal">Formal/Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contentText">Campaign Description</Label>
                  <Textarea
                    id="contentText"
                    name="contentText"
                    value={formData.contentText}
                    onChange={handleInputChange}
                    placeholder="Write the main description for your campaign..."
                    rows={5}
                    required
                  />
                </div>
                
                {/* Dynamic seed questions based on selected initiative */}
                {selectedInitiative && selectedInitiative.seedQuestions && selectedInitiative.seedQuestions.length > 0 && (
                  <div className="space-y-4 mt-4 border-t pt-4">
                    <h3 className="text-md font-semibold">Initiative Questions:</h3>
                    {selectedInitiative.seedQuestions.map((question, index) => (
                      <div className="space-y-2" key={index}>
                        <Label htmlFor={`seed-question-${index}`}>{question}</Label>
                        <Textarea
                          id={`seed-question-${index}`}
                          placeholder={`Your answer to: "${question}"`}
                          value={seedAnswers[question] || ''}
                          onChange={(e) => handleSeedAnswerChange(question, e.target.value)}
                          rows={2}
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Image upload kept for UI consistency but not sent to backend in this phase */}
                <div className="space-y-2">
                  <Label htmlFor="contentImage">Image Upload (Optional)</Label>
                  <Input
                    id="contentImage"
                    name="contentImage"
                    type="file"
                    accept="image/*"
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload an image to include with your ad (max 5MB)
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-campaign-orange hover:bg-campaign-orange-dark"
                  disabled={isSubmitting || isLoadingInitiatives}
                >
                  {isSubmitting ? 'Creating...' : 'Create Campaign'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateCampaign;
