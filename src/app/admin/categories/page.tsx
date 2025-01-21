"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Category } from "@prisma/client";
import { Loader2, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import useSWR, { mutate } from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Type for optimistic category update
type OptimisticCategory = Omit<Category, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export default function AdminCategoriesPage() {
  const { data: categories, error, isLoading } = useSWR<Category[]>("/api/categories", fetcher);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "category");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");
      const data = await response.json();
      return data.url;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Handle create category with optimistic update
  const handleCreateCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const imageFile = formData.get("image") as File;

    try {
      setUploading(true);

      // Upload image first
      const imageUrl = await handleImageUpload(imageFile);

      // Prepare new category
      const newCategory = {
        name,
        description,
        imageUrl,
        sortOrder: (categories?.length || 0) + 1
      };

      // Optimistic update
      mutate("/api/categories", [...(categories || []), newCategory], false);

      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) {
        throw new Error("Failed to create category");
      }

      // Revalidate cache
      mutate("/api/categories");

      form.reset();
      toast({
        title: "Success",
        description: "Category created successfully",
      });
    } catch (error) {
      // Revert optimistic update on error
      mutate("/api/categories");
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create category",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // Handle delete with optimistic update
  const handleDeleteCategory = async (id: string) => {
    try {
      // Optimistic update
      const categoryToDelete = categories?.find(c => c.id === id);
      if (!categoryToDelete) return;

      mutate(
        "/api/categories",
        categories?.filter((category: Category) => category.id !== id),
        false
      );

      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      // Revalidate cache
      mutate("/api/categories");

      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (error) {
      // Revert optimistic update on error
      mutate("/api/categories");
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete category",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Handle sort order update with optimistic update
  const handleUpdateSortOrder = async (id: string, newOrder: number) => {
    try {
      // Optimistic update
      const updatedCategories = categories?.map((category: Category) => {
        if (category.id === id) {
          return { ...category, sortOrder: newOrder };
        }
        return category;
      }).sort((a: Category, b: Category) => a.sortOrder - b.sortOrder);

      mutate("/api/categories", updatedCategories, false);

      const response = await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: newOrder }),
      });

      if (!response.ok) {
        throw new Error("Failed to update sort order");
      }

      // Revalidate cache
      mutate("/api/categories");

      toast({
        title: "Success",
        description: "Sort order updated successfully",
      });
    } catch (error) {
      // Revert optimistic update on error
      mutate("/api/categories");
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update sort order",
        variant: "destructive",
      });
    }
  };

  if (error) {
    toast({
      title: "Error",
      description: "Failed to fetch categories",
      variant: "destructive",
    });
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-3xl font-bold">Category Management</h1>

      {/* Create Category Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create New Category</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateCategory} className="space-y-4" ref={formRef}>
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                name="name"
                required
                minLength={3}
                maxLength={50}
                placeholder="Category name"
              />
            </div>

            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                required
                minLength={10}
                maxLength={200}
                placeholder="Category description"
              />
            </div>

            <div>
              <label htmlFor="image" className="mb-2 block text-sm font-medium">
                Image
              </label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                className="cursor-pointer"
              />
            </div>

            <Button type="submit" disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Category
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Categories List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories?.map((category: Category, index: number) => (
          <Card key={category.id}>
            <CardContent className="p-4">
              <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>

              <h3 className="mb-2 text-xl font-semibold">{category.name}</h3>
              <p className="mb-4 text-sm text-gray-600">{category.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateSortOrder(category.id, category.sortOrder - 1)}
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateSortOrder(category.id, category.sortOrder + 1)}
                    disabled={index === categories.length - 1}
                  >
                    ↓
                  </Button>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeletingId(category.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && handleDeleteCategory(deletingId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
