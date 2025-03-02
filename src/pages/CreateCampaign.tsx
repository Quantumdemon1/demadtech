
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const CreateCampaign: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Campaign form state
  const [formData, setFormData] = useState({
    name: '',
    contentType: 'funny',
    contentText: '',
    startDate: '',
    endDate: '',
    adSpend: 100,
  });

  // Mock contest data - in a real app this would come from an API
  const contests = [
    { id: '1', state: 'California', district: '12', label: 'CA-12: Smith vs. Johnson' },
    { id: '2', state: 'New York', district: '8', label: 'NY-8: Williams vs. Brown' },
    { id: '3', state: 'Texas', district: '23', label: 'TX-23: Garcia vs. Miller' },
  ];
  
  const [selectedContest, setSelectedContest] = useState<string>('');
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedContest) {
      toast.error("Please select a contest");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // In a real app, this would be an API call
      // Simulating a network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new campaign object
      const newCampaign = {
        id: `campaign-${Date.now()}`,
        name: formData.name,
        userId: user.id,
        contestId: selectedContest,
        contentType: formData.contentType as 'funny' | 'personal' | 'formal',
        contentText: formData.contentText,
        startDate: formData.startDate,
        endDate: formData.endDate,
        adSpend: Number(formData.adSpend),
        status: 'draft',
        createdAt: new Date().toISOString(),
      };
      
      // In a real app, this would be saved to a database
      // For now, we'll just save to localStorage
      const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
      campaigns.push(newCampaign);
      localStorage.setItem('campaigns', JSON.stringify(campaigns));
      
      toast.success("Campaign created successfully!");
      navigate(`/campaigns/${newCampaign.id}`);
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign. Please try again.");
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
                  <Label htmlFor="contest">Select Contest</Label>
                  <Select value={selectedContest} onValueChange={(value) => setSelectedContest(value)}>
                    <SelectTrigger id="contest">
                      <SelectValue placeholder="Select a political contest" />
                    </SelectTrigger>
                    <SelectContent>
                      {contests.map((contest) => (
                        <SelectItem key={contest.id} value={contest.id}>
                          {contest.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
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
                  <Label htmlFor="contentText">Ad Content</Label>
                  <Textarea
                    id="contentText"
                    name="contentText"
                    value={formData.contentText}
                    onChange={handleInputChange}
                    placeholder="Write the content for your advertisement..."
                    rows={5}
                    required
                  />
                </div>
                
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
                  disabled={isSubmitting}
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
