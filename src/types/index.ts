import * as z from "zod";

// Product Types
export type Product = {
  id: number;
  price: number;
  productSize?: string;
  productColor: string;
  productName: string;
  image: string;
  inStock: boolean;
  isLiked: boolean;
};

export const ProductsSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  price: z.number().min(0, "Price must be a positive number"),
  image: z.string().min(1, "Image URL is required"),
  productSize: z.enum(["small", "medium", "large"]).optional(),
  productColor: z.string().min(1, "Color is required"),
  inStock: z.boolean(),
  isLiked: z.boolean(),
});

export type ProductFormValues = z.infer<typeof ProductsSchema>;

// Auth Types
export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthResponse = {
  accessToken?: string;
  message?: string;
};

export type User = {
  email: string;
  accessToken: string;
};

export const LoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof LoginSchema>;

// API Response Types
export type ApiError = {
  message: string;
  status?: number;
};
