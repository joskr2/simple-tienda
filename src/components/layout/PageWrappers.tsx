import { useNavigate, useParams, useSearchParams } from "react-router";
import { HomePage } from "../../page/HomePage";
import { ProductsPage } from "../../page/ProductsPage";

// Wrapper para HomePage con navegación
export function HomePageWrapper() {
  const navigate = useNavigate();

  return (
    <HomePage
      onNavigateToProducts={() => navigate("/productos")}
      onNavigateToCategory={(category) =>
        navigate(`/productos?categoria=${category}`)
      }
      onNavigateToProduct={(productId) => navigate(`/producto/${productId}`)}
    />
  );
}

// Wrapper para ProductsPage con navegación y parámetros
export function ProductsPageWrapper() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("categoria") || undefined;

  return (
    <ProductsPage
      initialCategory={initialCategory}
      onNavigateToProduct={(productId) => navigate(`/producto/${productId}`)}
      onNavigateBack={() => navigate("/")}
    />
  );
}

// Wrapper para ProductsPage con categoría específica
export function CategoryPageWrapper() {
  const navigate = useNavigate();
  const { categoria } = useParams();

  return (
    <ProductsPage
      initialCategory={categoria}
      onNavigateToProduct={(productId) => navigate(`/producto/${productId}`)}
      onNavigateBack={() => navigate("/")}
    />
  );
}

// Página de producto individual (placeholder)
export function ProductPageWrapper() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Volver
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-4">Producto #{id}</h1>
      <div className="bg-muted/30 p-8 rounded-lg text-center">
        <p className="text-muted-foreground text-lg mb-4">
          Esta página estará disponible próximamente.
        </p>
        <p className="text-sm text-muted-foreground">
          Aquí se mostrará la información detallada del producto.
        </p>
      </div>
    </div>
  );
}
