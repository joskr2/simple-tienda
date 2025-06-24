import axios, { type AxiosInstance, type AxiosError } from "axios";
import type {
  FakeStoreProduct,
  FakeStoreUser,
  FakeStoreCart,
  FakeStoreApiError,
  ProductsQueryParams,
  FakeStoreQueryParams,
} from "../types/fakestore";

const API_BASE_URL = import.meta.env.VITE_FAKESTORE_API_URL;

const createApiClient = () => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return client;
};

const fakestoreApi = createApiClient();

// fakestoreApi.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
// );

fakestoreApi.interceptors.request.use(
  (config) => {
    console.log("config", config);
    return config;
  },
  (error) => {
    console.log("error", error);
    return Promise.reject(error);
  }
);

fakestoreApi.interceptors.response.use(
  (response) => {
    console.log("response", response);
    return response;
  },
  (error) => {
    console.log("error", error);
    return Promise.reject(error);
  }
);

class FakeStoreService {
  private readonly apiClient: AxiosInstance;

  constructor() {
    this.apiClient = createApiClient();
  }

  async getProducts(params?: ProductsQueryParams): Promise<FakeStoreProduct[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.category) queryParams.append("category", params.category);
      if (params?.sort) queryParams.append("sort", params.sort);

      const categoryUrl = params?.category
        ? `/products/category/${params.category}`
        : "/products";

      const url = queryParams.toString() ? `${categoryUrl}?${queryParams.toString()}` : categoryUrl;

      const { data } = await this.apiClient.get<FakeStoreProduct[]>(url);
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  async getProductById(id: number): Promise<FakeStoreProduct> {
    try {
      const { data } = await this.apiClient.get<FakeStoreProduct>(`/products/${id}`);
      return data;
    } catch (error) {
      console.error("Error fetching product by id:", error);
      throw error;
    }
  }

  async getProductByCategory(category: string, params?: ProductsQueryParams): Promise<FakeStoreProduct[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      if (params?.sort) queryParams.append("sort", params.sort);

      const url = `/products/category/${category}?${queryParams.toString()}`;
      const { data } = await this.apiClient.get<FakeStoreProduct[]>(url);
      return data;
    } catch (error) {
      console.error("Error fetching products by category:", error);
      throw error;
    }
  }
  
  async createProduct(product: Omit<FakeStoreProduct, "id">): Promise<FakeStoreProduct> {
    try {
      const { data } = await this.apiClient.post<FakeStoreProduct>("/products", product);
      return data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

    async updateProduct(id: number, product: Partial<FakeStoreProduct>): Promise<FakeStoreProduct> {
      try {
      const { data } = await this.apiClient.put<FakeStoreProduct>(`/products/${id}`, product);
      return data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
    }
  
  async updateOnlyProductName(id: number, name: string): Promise<FakeStoreProduct> {
    try {
      const { data } = await this.apiClient.patch<FakeStoreProduct>(`/products/${id}`, { title: name });
      return data;
    } catch (error) {
      console.error("Error updating product name:", error);
      throw error;
    }
  }

  async deleteProduct(id: number): Promise<void> {
    try {
      await this.apiClient.delete(`/products/${id}`);
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }


  async getCategories(): Promise<string[]> {
    try {
      const { data } = await this.apiClient.get<string[]>("/products/categories");
      return data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  async getUsers(): Promise<FakeStoreUser[]> {
    try {
      const { data } = await this.apiClient.get<FakeStoreUser[]>("/users");
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  async getUser(id: number): Promise<FakeStoreUser> {
    try {
      const { data } = await this.apiClient.get<FakeStoreUser>(`/users/${id}`);
      return data;
    } catch (error) {
      console.error("Error fetching user by id:", error);
      throw error;
    }
  }


  async createUser(user: Omit<FakeStoreUser, "id">): Promise<FakeStoreUser> {
    try {
      const { data } = await this.apiClient.post<FakeStoreUser>("/users", user);
      return data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async getCarts(params?: FakeStoreQueryParams): Promise<FakeStoreCart[]> {

      try {
        const queryParams = new URLSearchParams();
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.sort) queryParams.append("sort", params.sort);

        const url = `/carts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const { data } = await this.apiClient.get<FakeStoreCart[]>(url);
        return data;
      } catch (error) {
        console.error("Error fetching carts:", error);
        throw error;
      }
  }

  async getCart(id: number): Promise<FakeStoreCart> {
    try {
      const { data } = await this.apiClient.get<FakeStoreCart>(`/carts/${id}`);
      return data;
    } catch (error) {
      console.error("Error fetching cart by id:", error);
      throw error;
    }
  }

  async getUserCarts(userId: number): Promise<FakeStoreCart[]> {
    try {
      const { data } = await this.apiClient.get<FakeStoreCart[]>(`/carts/user/${userId}`);
      return data;
    } catch (error) {
      console.error("Error fetching user carts:", error);
      throw error;
    }
  }

  async createCart(cart: Omit<FakeStoreCart, "id">): Promise<FakeStoreCart> {
    try {
      const { data } = await this.apiClient.post<FakeStoreCart>("/carts", cart);
      return data;
    } catch (error) {
      console.error("Error creating cart:", error);
      throw error;
    }
  }

  async updateCart(id: number, cart: Partial<FakeStoreCart>): Promise<FakeStoreCart> {
    try {
      const { data } = await this.apiClient.put<FakeStoreCart>(`/carts/${id}`, cart);
      return data;
    } catch (error) {
      console.error("Error updating cart:", error);
      throw error;
    }
  }

  async deleteCart(id: number): Promise<void> {
    try {
      await this.apiClient.delete(`/carts/${id}`);
    } catch (error) {
      console.error("Error deleting cart:", error);
      throw error;
    }
  }

  async login(username: string, password: string): Promise<{token: string}> {
    try {
      const { data } = await this.apiClient.post<{token: string}>("/auth/login", { username, password });
      return data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  private handleError(error: unknown): FakeStoreApiError {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<FakeStoreApiError>;
      return axiosError.response?.data || { status: 500, message: "An unknown error occurred" };
    }
    return { status: 500, message: "An unknown error occurred" };
  }

  async healthCheck(): Promise<boolean> {
    try {
      const { data } = await this.apiClient.get<{status: string}>("/health");
      return data.status === "ok";
    } catch (error) {
      this.handleError(error);
      return false;
    }
  }

}

export default new FakeStoreService();
