import { prisma } from "@/lib/prisma";
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { Category } from "@prisma/client";

describe("Category Management", () => {
  let testCategory: Category;

  beforeAll(async () => {
    // Clean up test data
    await prisma.category.deleteMany({
      where: {
        name: {
          startsWith: "Test_"
        }
      }
    });
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.category.deleteMany({
      where: {
        name: {
          startsWith: "Test_"
        }
      }
    });
  });

  describe("Category CRUD Operations", () => {
    it("should create a new category", async () => {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Role": "ADMIN",
        },
        body: JSON.stringify({
          name: "Test_Category",
          description: "Test category description",
          imageUrl: "/images/placeholder.jpg",
          sortOrder: 1,
        }),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      testCategory = data;
      expect(data.name).toBe("Test_Category");
    });

    it("should fetch all categories", async () => {
      // Create a category first to ensure there's data
      const createResponse = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Role": "ADMIN",
        },
        body: JSON.stringify({
          name: "Test_Category",
          description: "Test category description",
          imageUrl: "/images/placeholder.jpg",
          sortOrder: 1,
        }),
      });
      const createData = await createResponse.json();
      testCategory = createData;

      const response = await fetch("/api/categories");
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.some((cat: Category) => cat.id === testCategory.id)).toBe(true);
    });

    it("should update category sort order", async () => {
      // Create a category first to ensure there's data
      const createResponse = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Role": "ADMIN",
        },
        body: JSON.stringify({
          name: "Test_Category",
          description: "Test category description",
          imageUrl: "/images/placeholder.jpg",
          sortOrder: 1,
        }),
      });
      const createData = await createResponse.json();
      testCategory = createData;

      const response = await fetch("/api/categories", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-User-Role": "ADMIN",
        },
        body: JSON.stringify({
          id: testCategory.id,
          sortOrder: 2,
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.sortOrder).toBe(2);
    });

    it("should delete a category", async () => {
      // Create a category first to ensure there's data
      const createResponse = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Role": "ADMIN",
        },
        body: JSON.stringify({
          name: "Test_Category",
          description: "Test category description",
          imageUrl: "/images/placeholder.jpg",
          sortOrder: 1,
        }),
      });
      const createData = await createResponse.json();
      testCategory = createData;

      const response = await fetch(`/api/categories?id=${testCategory.id}`, {
        method: "DELETE",
        headers: {
          "X-User-Role": "ADMIN",
        },
      });

      expect(response.status).toBe(200);

      // Verify deletion
      const checkResponse = await fetch("/api/categories");
      const data = await checkResponse.json();
      expect(data.some((cat: Category) => cat.id === testCategory.id)).toBe(false);
    });
  });

  describe("Category Validation", () => {
    it("should reject invalid category names", async () => {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Role": "ADMIN",
        },
        body: JSON.stringify({
          name: "ab", // Too short
          description: "Test category description",
          imageUrl: "/images/placeholder.jpg",
          sortOrder: 1,
        }),
      });

      expect(response.status).toBe(400);
    });

    it("should reject invalid descriptions", async () => {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Role": "ADMIN",
        },
        body: JSON.stringify({
          name: "Test_Category",
          description: "Too short", // Too short
          imageUrl: "/images/placeholder.jpg",
          sortOrder: 1,
        }),
      });

      expect(response.status).toBe(400);
    });

    it("should reject invalid image URLs", async () => {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Role": "ADMIN",
        },
        body: JSON.stringify({
          name: "Test_Category",
          description: "Test category description",
          imageUrl: "invalid-url", // Invalid URL
          sortOrder: 1,
        }),
      });

      expect(response.status).toBe(400);
    });
  });

  describe("RLS Policies", () => {
    it("should allow public access to category list", async () => {
      const response = await fetch("/api/categories");
      expect(response.status).toBe(200);
    });

    it("should prevent non-admin users from creating categories", async () => {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Role": "USER",
        },
        body: JSON.stringify({
          name: "Test_Category",
          description: "Test category description",
          imageUrl: "/images/placeholder.jpg",
          sortOrder: 1,
        }),
      });

      expect(response.status).toBe(403);
    });

    it("should prevent non-admin users from updating categories", async () => {
      const response = await fetch("/api/categories", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-User-Role": "USER",
        },
        body: JSON.stringify({
          id: "some-id",
          sortOrder: 2,
        }),
      });

      expect(response.status).toBe(403);
    });

    it("should prevent non-admin users from deleting categories", async () => {
      const response = await fetch(`/api/categories?id=some-id`, {
        method: "DELETE",
        headers: {
          "X-User-Role": "USER",
        },
      });

      expect(response.status).toBe(403);
    });
  });

  describe("Image Upload", () => {
    it("should handle image upload", async () => {
      const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "category");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.url).toBeTruthy();
    });

    it("should reject invalid file types", async () => {
      const file = new File(["test"], "test.txt", { type: "text/plain" });
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "category");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      expect(response.status).toBe(400);
    });
  });
});
