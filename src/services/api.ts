import type { LoginCredentials, AuthResponse, Product, ProductFormValues } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `Request failed with status ${response.status}`,
      response.status
    );
  }
  return response.json();
};

export const api = {
  // Auth endpoints
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return handleResponse<AuthResponse>(response);
  },

  // Product endpoints
  getProducts: async (): Promise<Product[]> => {
    const response = await fetch(`${API_URL}/api/products`, {
      headers: getAuthHeaders(),
    });
    const data = await handleResponse<Product[] | { products: Product[] }>(response);
    // Handle both direct array and wrapped { products: [...] } response
    return Array.isArray(data) ? data : data.products;
  },

  createProduct: async (productData: ProductFormValues): Promise<Product> => {
    const newProduct = {
      id: Date.now(),
      ...productData,
    };
    const response = await fetch(`${API_URL}/api/products`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(newProduct),
    });
    return handleResponse<Product>(response);
  },

  deleteProduct: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/api/products/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || "Failed to delete product",
        response.status
      );
    }
  },

  updateProduct: async (id: number, productData: Partial<Product>): Promise<Product> => {
    const response = await fetch(`${API_URL}/api/products/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    return handleResponse<Product>(response);
  },
};

export { ApiError };
export default api;
