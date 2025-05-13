
import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { Award, Edit, Plus, Trash, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Define the Award type
interface Award {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

const AdminManageAwards: React.FC = () => {
  const { user, loading } = useAuth();
  const [awards, setAwards] = useState<Award[]>([]);
  const [loadingAwards, setLoadingAwards] = useState(true);
  const [currentAward, setCurrentAward] = useState<Award | null>(null);
  const [newAward, setNewAward] = useState({
    name: '',
    description: '',
    imageUrl: ''
  });
  const [editMode, setEditMode] = useState(false);

  // Mock data: awards
  React.useEffect(() => {
    // In a real app, this would be an API call to get all awards
    const mockAwards: Award[] = [
      {
        id: 'award-1',
        name: 'Gold Megaphone',
        description: 'Awarded for exceptional political advertising that demonstrates outstanding creativity and effectiveness.',
        imageUrl: '/placeholder.svg',
        createdAt: '2024-01-15',
      },
      {
        id: 'award-2',
        name: 'Silver Speech Bubble',
        description: 'Recognizes compelling messaging that clearly communicates policy positions to voters.',
        imageUrl: '/placeholder.svg',
        createdAt: '2024-01-20',
      },
      {
        id: 'award-3',
        name: 'Bronze Ballot',
        description: 'Honors campaigns that effectively increase voter engagement and turnout through advertising.',
        imageUrl: '/placeholder.svg',
        createdAt: '2024-02-05',
      },
      {
        id: 'award-4',
        name: 'Digital Democracy Award',
        description: 'Celebrates innovative use of digital platforms in political advertising.',
        imageUrl: '/placeholder.svg',
        createdAt: '2024-02-10',
      },
      {
        id: 'award-5',
        name: 'Truth Teller Badge',
        description: 'Reserved for campaigns with exceptional accuracy and integrity in their messaging.',
        imageUrl: '/placeholder.svg',
        createdAt: '2024-03-01',
      }
    ];

    // Simulate API delay
    setTimeout(() => {
      setAwards(mockAwards);
      setLoadingAwards(false);
    }, 800);
  }, []);

  // Reset form state
  const resetForm = () => {
    setNewAward({
      name: '',
      description: '',
      imageUrl: ''
    });
    setCurrentAward(null);
    setEditMode(false);
  };

  // Handle creating a new award
  const handleCreateAward = () => {
    // Validate form
    if (!newAward.name.trim() || !newAward.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Create a new award object
    const award: Award = {
      id: `award-${Date.now()}`,
      name: newAward.name.trim(),
      description: newAward.description.trim(),
      imageUrl: newAward.imageUrl || '/placeholder.svg',
      createdAt: new Date().toISOString().slice(0, 10)
    };

    // In a real app, this would be an API call to create the award
    setAwards(prevAwards => [...prevAwards, award]);
    toast.success(`Award "${award.name}" has been created`);
    resetForm();
  };

  // Handle editing an award
  const handleEditAward = () => {
    if (!currentAward) return;
    
    // Validate form
    if (!newAward.name.trim() || !newAward.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Update the award
    const updatedAward: Award = {
      ...currentAward,
      name: newAward.name.trim(),
      description: newAward.description.trim(),
      imageUrl: newAward.imageUrl || currentAward.imageUrl,
      updatedAt: new Date().toISOString().slice(0, 10)
    };

    // In a real app, this would be an API call to update the award
    setAwards(prevAwards => 
      prevAwards.map(award => 
        award.id === currentAward.id ? updatedAward : award
      )
    );
    
    toast.success(`Award "${updatedAward.name}" has been updated`);
    resetForm();
  };

  // Handle deleting an award
  const handleDeleteAward = (award: Award) => {
    // In a real app, this would be an API call to delete the award
    setAwards(prevAwards => prevAwards.filter(a => a.id !== award.id));
    toast.success(`Award "${award.name}" has been deleted`);
  };

  // Set up edit mode
  const setupEditMode = (award: Award) => {
    setCurrentAward(award);
    setNewAward({
      name: award.name,
      description: award.description,
      imageUrl: award.imageUrl || ''
    });
    setEditMode(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="container flex-1 py-8 text-center">Loading...</main>
      </div>
    );
  }

  // Protect the route: only admins should access this page
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container flex-1 py-8">
        <div className="mb-6">
          <Link to="/admin/dashboard" className="inline-flex items-center text-sm text-campaign-orange hover:underline mb-2">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Manage Awards</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage award types in the system.
          </p>
        </div>

        <div className="mb-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-campaign-orange hover:bg-campaign-orange-dark">
                <Plus className="mr-2 h-4 w-4" /> Create New Award
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create New Award</DialogTitle>
                <DialogDescription>
                  Fill in the details below to create a new award type.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Award Name*
                  </label>
                  <Input
                    id="name"
                    placeholder="Enter award name"
                    value={newAward.name}
                    onChange={(e) => setNewAward({ ...newAward, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description*
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Enter award description"
                    value={newAward.description}
                    onChange={(e) => setNewAward({ ...newAward, description: e.target.value })}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="imageUrl" className="text-sm font-medium">
                    Image URL <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <Input
                    id="imageUrl"
                    placeholder="Enter image URL"
                    value={newAward.imageUrl}
                    onChange={(e) => setNewAward({ ...newAward, imageUrl: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" onClick={resetForm}>Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={handleCreateAward}>Create Award</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader className="bg-muted/50">
            <CardTitle>Award Types</CardTitle>
            <CardDescription>
              The following awards can be assigned to campaigns based on performance and quality.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingAwards ? (
              <div className="py-8 text-center text-muted-foreground">Loading awards...</div>
            ) : awards.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {awards.map((award) => (
                  <Card key={award.id} className="overflow-hidden">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <img 
                        src={award.imageUrl || '/placeholder.svg'} 
                        alt={award.name} 
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg flex items-center">
                        <Award className="h-5 w-5 mr-2 text-campaign-orange" />
                        {award.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {award.description}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="p-4 pt-0 flex justify-between items-center">
                      <Badge variant="outline" className="text-xs">
                        Created: {new Date(award.createdAt).toLocaleDateString()}
                      </Badge>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setupEditMode(award)}>
                              <Edit className="h-4 w-4 mr-1" /> Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[550px]">
                            <DialogHeader>
                              <DialogTitle>Edit Award</DialogTitle>
                              <DialogDescription>
                                Update the details of this award.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <label htmlFor="edit-name" className="text-sm font-medium">
                                  Award Name*
                                </label>
                                <Input
                                  id="edit-name"
                                  placeholder="Enter award name"
                                  value={newAward.name}
                                  onChange={(e) => setNewAward({ ...newAward, name: e.target.value })}
                                />
                              </div>
                              <div className="grid gap-2">
                                <label htmlFor="edit-description" className="text-sm font-medium">
                                  Description*
                                </label>
                                <Textarea
                                  id="edit-description"
                                  placeholder="Enter award description"
                                  value={newAward.description}
                                  onChange={(e) => setNewAward({ ...newAward, description: e.target.value })}
                                  className="min-h-[100px]"
                                />
                              </div>
                              <div className="grid gap-2">
                                <label htmlFor="edit-imageUrl" className="text-sm font-medium">
                                  Image URL <span className="text-muted-foreground">(optional)</span>
                                </label>
                                <Input
                                  id="edit-imageUrl"
                                  placeholder="Enter image URL"
                                  value={newAward.imageUrl}
                                  onChange={(e) => setNewAward({ ...newAward, imageUrl: e.target.value })}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline" onClick={resetForm}>Cancel</Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button onClick={handleEditAward}>Update Award</Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Award</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the "{award.name}" award? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteAward(award)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No awards have been created yet. Click "Create New Award" to add one.
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminManageAwards;
