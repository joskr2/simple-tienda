import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import FakeStoreService from "../services/fakestore.service";
import { mapFakeStoreProduct, mapFakeStoreUser } from "../types/fakestore";
import type {
  FakeStoreProduct,
  FakeStoreUser,
  FakeStoreCart,
  ProductsQueryParams,
  FakeStoreQueryParams,
  FakeStoreApiError,
} from "../types/fakestore";

export const FAKESTORE_QUERY_KEYS = {
  // Productos
  products: ["fakestore", "products"] as const,
  product: (id: number) => ["fakestore", "products", id] as const,
  productsByCategory: (category: string) =>
    ["fakestore", "products", "category", category] as const,

  // Categorías
  categories: ["fakestore", "categories"] as const,

  // Usuarios
  users: ["fakestore", "users"] as const,
  user: (id: number) => ["fakestore", "users", id] as const,

  // Carritos
  carts: ["fakestore", "carts"] as const,
  cart: (id: number) => ["fakestore", "carts", id] as const,
  userCarts: (userId: number) =>
    ["fakestore", "carts", "user", userId] as const,

  // Health Check
  healthCheck: ["fakestore", "healthCheck"] as const,
} as const;

export const useFakeStoreProducts = (params?: ProductsQueryParams) => {
  return useQuery({
    queryKey: FAKESTORE_QUERY_KEYS.products,
    queryFn: () => FakeStoreService.getProducts(params),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos,
    retry: 3,
    select: (data) => data.map(mapFakeStoreProduct),
    placeholderData: keepPreviousData,
  });
};

export const useFakeStoreProduct = (id: number) => {
  return useQuery({
    queryKey: FAKESTORE_QUERY_KEYS.product(id),
    queryFn: () => FakeStoreService.getProductById(id),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos,
    retry: 3,
    select: mapFakeStoreProduct,
    placeholderData: keepPreviousData,
  });
};

export const useFakeStoreProductsByCategory = (
  category: string,
  params?: ProductsQueryParams
) => {
  return useQuery({
    queryKey: FAKESTORE_QUERY_KEYS.productsByCategory(category),
    queryFn: () => FakeStoreService.getProductByCategory(category, params),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos,
    retry: 3,
    select: (data) => data.map(mapFakeStoreProduct),
    placeholderData: keepPreviousData,
  });
};

export const useFakeStoreProductsInfinite = (params?: ProductsQueryParams) => {
  return useInfiniteQuery({
    queryKey: FAKESTORE_QUERY_KEYS.products,
    queryFn: () =>
      FakeStoreService.getProducts({ ...params, limit: params?.limit || 10 }),
    getNextPageParam: (lastPage, pages) =>
      lastPage.length > 0 ? pages.length + 1 : undefined,
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos,
    retry: 3,
    select: (data) =>
      data.pages.flatMap((page) => page.map(mapFakeStoreProduct)),
  });
};

export const useFakeStoreCategories = () => {
  return useQuery({
    queryKey: FAKESTORE_QUERY_KEYS.categories,
    queryFn: () => FakeStoreService.getCategories(),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos,
    retry: 3,
  });
};

export const useFakeStoreUsers = () => {
  return useQuery({
    queryKey: FAKESTORE_QUERY_KEYS.users,
    queryFn: () => FakeStoreService.getUsers(),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos,
    retry: 3,
    select: (data) => data.map(mapFakeStoreUser),
    placeholderData: keepPreviousData,
  });
};

export const useFakeStoreUser = (id: number) => {
  return useQuery({
    queryKey: FAKESTORE_QUERY_KEYS.user(id),
    queryFn: () => FakeStoreService.getUser(id),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos,
    retry: 3,
    select: mapFakeStoreUser,
    placeholderData: keepPreviousData,
  });
};

export const useFakeStoreCarts = (params?: FakeStoreQueryParams) => {
  return useQuery({
    queryKey: FAKESTORE_QUERY_KEYS.carts,
    queryFn: () => FakeStoreService.getCarts(params),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos,
    retry: 3,
  });
};

export const useFakeStoreCart = (id: number, enabled: boolean) => {
  return useQuery({
    queryKey: FAKESTORE_QUERY_KEYS.cart(id),
    queryFn: () => FakeStoreService.getCart(id),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos,
    retry: 3,
    placeholderData: keepPreviousData,
  });
};

export const useFakeStoreUserCarts = (userId: number, enabled: boolean) => {
  return useQuery({
    queryKey: FAKESTORE_QUERY_KEYS.userCarts(userId),
    queryFn: () => FakeStoreService.getUserCarts(userId),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos,
    retry: 3,
    placeholderData: keepPreviousData,
  });
};

export const useCreateFakeStoreProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (product: FakeStoreProduct) =>
      FakeStoreService.createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: FAKESTORE_QUERY_KEYS.products,
      });
    },
    onError: (error: FakeStoreApiError) => {
      console.error("Error creating product:", error);
    },
  });
};

export const useUpdateFakeStoreProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...product }: FakeStoreProduct) =>
      FakeStoreService.updateProduct(id, product),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: FAKESTORE_QUERY_KEYS.products,
      });
    },
  });
};

export const useUpdateOnlyNameFakeStoreProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      FakeStoreService.updateOnlyProductName(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: FAKESTORE_QUERY_KEYS.products,
      });
    },
  });
};

export const useDeleteFakeStoreProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => FakeStoreService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: FAKESTORE_QUERY_KEYS.products,
      });
    },
    onError: (error: FakeStoreApiError) => {
      console.error("Error deleting product:", error);
    },
  });
};

export const useCreateFakeStoreUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: FakeStoreUser) => FakeStoreService.createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAKESTORE_QUERY_KEYS.users });
    },
  });
};

export const useCreateFakeStoreCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cart: FakeStoreCart) => FakeStoreService.createCart(cart),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAKESTORE_QUERY_KEYS.carts });
    },
    onError: (error: FakeStoreApiError) => {
      console.error("Error creating cart:", error);
    },
  });
};

export const useUpdateFakeStoreCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...cart }: FakeStoreCart) => FakeStoreService.updateCart(id, cart),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAKESTORE_QUERY_KEYS.carts });
    },
  });
};

export const useFakeStoreLogin = () => {
  return useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => FakeStoreService.login(username, password),
    onError: (error: FakeStoreApiError) => {
      console.error("Error logging in:", error);
    },
  });
};

export const useFakeStoreFeaturedProducts = (limit = 8) => {
  const { data: products } = useFakeStoreProducts({ limit });

  const featuredProducts = products?.filter(
    (product) => product.rating > 4.5
  );

  return featuredProducts;
};

// export const useFakeStoreSearchProducts = (searchTerm: string, enabled = true) => {
//   const { data: products, ...query } = useFakeStoreProducts({ search: searchTerm, enabled });

//   return {
//     products,
//     ...query,
//   };
// }

export const useFakeStoreHealthCheck = () => {
  return useQuery({
    queryKey: FAKESTORE_QUERY_KEYS.healthCheck,
    queryFn: () => FakeStoreService.healthCheck(),
  });
};

export const useFakeStoreErrorHandler = () => {
  const handleError = (error: FakeStoreApiError) => {
    switch (error.status) {
      case 401:
        return "Unauthorized";
      case 404:
        return "Not Found";
      default:
        return "Something went wrong";
    }
  };

  return { handleError };
};

export type FakeStoreProductsQuery = ReturnType<typeof useFakeStoreProducts>;
export type FakeStoreProductsInfiniteQuery = ReturnType<
  typeof useFakeStoreProductsInfinite
>;
export type FakeStoreCategoriesQuery = ReturnType<
  typeof useFakeStoreCategories
>;
export type FakeStoreUsersQuery = ReturnType<typeof useFakeStoreUsers>;
export type FakeStoreUserQuery = ReturnType<typeof useFakeStoreUser>;
export type FakeStoreCartsQuery = ReturnType<typeof useFakeStoreCarts>;
export type FakeStoreCartQuery = ReturnType<typeof useFakeStoreCart>;

export type {
  FakeStoreProduct,
  FakeStoreUser,
  FakeStoreCart,
  ProductsQueryParams,
  FakeStoreQueryParams,
  FakeStoreApiError,
};
