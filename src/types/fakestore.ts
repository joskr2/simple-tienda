/**
 * Tipos para FakeStore API
 * Adaptación de los tipos existentes del proyecto para trabajar con FakeStore
 */

// Tipos base de FakeStore API
export interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface FakeStoreCategory {
  name: string;
  slug: string;
}

export interface FakeStoreUser {
  id: number;
  email: string;
  username: string;
  password: string;
  name: {
    firstname: string;
    lastname: string;
  };
  address: {
    city: string;
    street: string;
    number: number;
    zipcode: string;
    geolocation: {
      lat: string;
      long: string;
    };
  };
  phone: string;
}

export interface FakeStoreCartProduct {
  productId: number;
  quantity: number;
}

export interface FakeStoreCart {
  id: number;
  userId: number;
  date: string;
  products: FakeStoreCartProduct[];
}

// Mapeo de categorías de FakeStore a nuestras categorías
export const FAKESTORE_CATEGORY_MAP: Record<string, string> = {
  electronics: "electronics",
  jewelery: "beauty", // Mapeamos joyería a belleza
  "men's clothing": "clothing",
  "women's clothing": "clothing",
};

// Función para mapear producto de FakeStore a nuestro tipo Product
export const mapFakeStoreProduct = (
  product: FakeStoreProduct
): import("../types/product").Product => {
  return {
    id: product.id.toString(),
    name: product.title,
    title: product.title,
    description: product.description,
    price: Math.round(product.price * 3800), // Convertir USD a COP aproximado
    originalPrice: Math.round(product.price * 4200), // Precio original un poco mayor
    currency: "COP",
    category: FAKESTORE_CATEGORY_MAP[product.category] || "electronics",
    images: [product.image],
    thumbnail: product.image,
    inStock: true,
    stock: Math.floor(Math.random() * 50) + 10, // Stock aleatorio
    status: "available",
    rating: product.rating.rate,
    reviewCount: product.rating.count,
    tags: [product.category, "fakestore"],
    featured: product.rating.rate > 4.0,
    bestseller: product.rating.count > 100,
    newArrival: Math.random() > 0.7,
    onSale: Math.random() > 0.6,
    discount: Math.random() > 0.6 ? Math.floor(Math.random() * 30) + 10 : 0,
    sku: `FS-${product.id}`,
    brand: "FakeStore",
    weight: Math.floor(Math.random() * 2000) + 100,
    specs: {
      brand: "FakeStore",
      category: product.category,
      rating: product.rating.rate.toString(),
      reviews: product.rating.count.toString(),
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as import("../types/product").Product;
};

// Función para mapear usuario de FakeStore
export const mapFakeStoreUser = (
  user: FakeStoreUser
): Partial<import("../types/user").User> => {
  return {
    id: user.id.toString(),
    email: user.email,
    profile: {
      firstName: user.name.firstname,
      lastName: user.name.lastname,
      displayName: `${user.name.firstname} ${user.name.lastname}`,
      phoneNumber: user.phone,
      preferences: {
        language: "es",
        currency: "COP",
        timezone: "America/Bogota",
        theme: "light",
      },
    },
    role: "customer",
    status: "active",
    addresses: [
      {
        id: "1",
        type: "home",
        fullName: `${user.name.firstname} ${user.name.lastname}`,
        phone: user.phone,
        address1: `${user.address.street} ${user.address.number}`,
        city: user.address.city,
        state: "N/A",
        zipCode: user.address.zipcode,
        country: "US",
        isDefault: true,
        verified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Respuestas de la API
export interface FakeStoreApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Parámetros de consulta
export interface FakeStoreQueryParams {
  limit?: number;
  sort?: "asc" | "desc";
}

export interface ProductsQueryParams extends FakeStoreQueryParams {
  category?: string;
}

// Errores de la API
export interface FakeStoreApiError {
  message: string;
  status: number;
  code?: string;
}
