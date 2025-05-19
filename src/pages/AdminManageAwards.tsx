
import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { Award, Edit, Plus, Trash, ArrowLeft, Loader2, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getAllAwardsSystemAPI, upsertAwardAdminAPI, deleteAwardAdminAPI } from '@/services/api';
import { Award as AwardType } from '@/types';

const AdminManageAwards: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [currentAward, setCurrentAward] = useState<AwardType | null>(null);
  const [newAward, setNewAward] = useState({
    name: '',
    description: '',
    filename: '',
    payload: ''
  });
  const [editMode, setEditMode] = useState(false);
  const queryClient = useQueryClient();

  // Fetch all awards
  const { 
    data: awards = [], 
    isLoading: loadingAwards, 
    error 
  } = useQuery({
    queryKey: ['admin-awards'],
    queryFn: () => getAllAwardsSystemAPI(),
    select: data => data?.awards || [],
    staleTime: 60000 // 1 minute
  });

  // Create/update award mutation
  const upsertAwardMutation = useMutation({
    mutationFn: (awardData: {
      name: string;
      description: string;
      filename?: string;
      payload?: string;
      awardGuid?: string;
    }) => {
      if (!user?.loginUsername) {
        throw new Error("Not authenticated");
      }
      return upsertAwardAdminAPI(user.loginUsername, awardData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-awards'] });
      resetForm();
    }
  });

  // Delete award mutation
  const deleteAwardMutation = useMutation({
    mutationFn: (awardGuid: string) => {
      if (!user?.loginUsername) {
        throw new Error("Not authenticated");
      }
      return deleteAwardAdminAPI(user.loginUsername, awardGuid);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-awards'] });
    }
  });

  // Reset form state
  const resetForm = () => {
    setNewAward({
      name: '',
      description: '',
      filename: '',
      payload: ''
    });
    setCurrentAward(null);
    setEditMode(false);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (limit to 1MB)
    if (file.size > 1024 * 1024) {
      toast.error('Image is too large. Please upload images smaller than 1MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Extract the base64 data part, removing the MIME type prefix
      const payload = base64String.split(',')[1];
      setNewAward({
        ...newAward,
        filename: file.name,
        payload: payload
      });
    };
    reader.readAsDataURL(file);
  };

  // Handle creating a new award
  const handleCreateAward = () => {
    // Validate form
    if (!newAward.name.trim() || !newAward.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Create award using mutation
    toast.promise(upsertAwardMutation.mutateAsync({
      name: newAward.name.trim(),
      description: newAward.description.trim(),
      filename: newAward.filename || undefined,
      payload: newAward.payload || undefined
    }), {
      loading: 'Creating award...',
      success: `Award "${newAward.name}" has been created`,
      error: (err) => `Failed to create award: ${err.message || 'Unknown error'}`
    });
  };

  // Handle editing an award
  const handleEditAward = () => {
    if (!currentAward) return;
    
    // Validate form
    if (!newAward.name.trim() || !newAward.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Update the award using mutation
    toast.promise(upsertAwardMutation.mutateAsync({
      awardGuid: currentAward.awardGuid,
      name: newAward.name.trim(),
      description: newAward.description.trim(),
      filename: newAward.filename || undefined,
      payload: newAward.payload || undefined
    }), {
      loading: 'Updating award...',
      success: `Award "${newAward.name}" has been updated`,
      error: (err) => `Failed to update award: ${err.message || 'Unknown error'}`
    });
  };

  // Handle deleting an award
  const handleDeleteAward = (award: AwardType) => {
    toast.promise(deleteAwardMutation.mutateAsync(award.awardGuid), {
      loading: `Deleting award "${award.name}"...`,
      success: `Award "${award.name}" has been deleted`,
      error: (err) => `Failed to delete award: ${err.message || 'Unknown error'}`
    });
  };

  // Set up edit mode
  const setupEditMode = (award: AwardType) => {
    setCurrentAward(award);
    setNewAward({
      name: award.name,
      description: award.description,
      filename: '',
      payload: ''
    });
    setEditMode(true);
  };

  if (authLoading) {
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

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="container flex-1 py-8">
          <div className="mb-6">
            <Link to="/admin/dashboard" className="inline-flex items-center text-sm text-campaign-orange hover:underline mb-2">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Manage Awards</h1>
          </div>
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              An error occurred: {(error as Error).message || 'Failed to fetch awards'}
            </CardContent>
          </Card>
        </main>
      </div>
    );
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
                  <label htmlFor="imageUpload" className="text-sm font-medium">
                    Award Image <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('imageUpload')?.click()}
                      className="w-full"
                      type="button"
                    >
                      <Upload className="h-4 w-4 mr-2" /> 
                      {newAward.filename ? 'Change Image' : 'Upload Image'}
                    </Button>
                  </div>
                  {newAward.filename && (
                    <p className="text-xs text-muted-foreground">
                      Selected: {newAward.filename}
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" onClick={resetForm}>Cancel</Button>
                </DialogClose>
                <Button 
                  onClick={handleCreateAward}
                  disabled={upsertAwardMutation.isPending}
                >
                  {upsertAwardMutation.isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</>
                  ) : (
                    'Create Award'
                  )}
                </Button>
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
              <div className="py-8 text-center text-muted-foreground flex items-center justify-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading awards...
              </div>
            ) : awards.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {awards.map((award) => (
                  <Card key={award.awardGuid} className="overflow-hidden">
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
                                <label htmlFor="edit-imageUpload" className="text-sm font-medium">
                                  Award Image <span className="text-muted-foreground">(optional)</span>
                                </label>
                                <div className="flex items-center gap-2">
                                  <Input
                                    id="edit-imageUpload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                  />
                                  <Button
                                    variant="outline"
                                    onClick={() => document.getElementById('edit-imageUpload')?.click()}
                                    className="w-full"
                                    type="button"
                                  >
                                    <Upload className="h-4 w-4 mr-2" />
                                    {newAward.filename ? 'Change Image' : 'Upload New Image'}
                                  </Button>
                                </div>
                                {newAward.filename && (
                                  <p className="text-xs text-muted-foreground">
                                    Selected: {newAward.filename}
                                  </p>
                                )}
                                {!newAward.filename && award.imageUrl && (
                                  <p className="text-xs">Current image will be kept if no new image is uploaded.</p>
                                )}
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline" onClick={resetForm}>Cancel</Button>
                              </DialogClose>
                              <Button 
                                onClick={handleEditAward}
                                disabled={upsertAwardMutation.isPending}
                              >
                                {upsertAwardMutation.isPending ? (
                                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</>
                                ) : (
                                  'Update Award'
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              disabled={deleteAwardMutation.isPending}
                            >
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
