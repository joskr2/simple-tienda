import { useNavigate, useParams, useSearchParams } from "react-router";
import { HomePage } from "../../page/HomePage";
import { ProductsPage } from "../../page/ProductsPage";
import { ProductDetailPage } from "../../page/ProductDetailPage";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("categoria") || undefined;

  const handleCategoryChange = (category?: string) => {
    console.log(
      "🔄 ProductsPageWrapper: handleCategoryChange recibió:",
      category
    );

    if (category) {
      setSearchParams({ categoria: category });
    } else {
      setSearchParams({});
    }
  };

  return (
    <ProductsPage
      initialCategory={initialCategory}
      onNavigateToProduct={(productId) => navigate(`/producto/${productId}`)}
      onNavigateBack={() => navigate("/")}
      onCategoryChange={handleCategoryChange}
    />
  );
}

// Wrapper para ProductsPage con categoría específica
export function CategoryPageWrapper() {
  const navigate = useNavigate();
  const { categoria } = useParams();

  const handleCategoryChange = (category?: string) => {
    console.log(
      "🔄 CategoryPageWrapper: handleCategoryChange recibió:",
      category
    );
    console.log("🔄 CategoryPageWrapper: categoria param:", categoria);

    if (category) {
      console.log(
        "🔄 CategoryPageWrapper: Navegando a /productos?categoria=",
        category
      );
      navigate(`/productos?categoria=${category}`);
    } else {
      console.log("🔄 CategoryPageWrapper: Navegando a /productos");
      navigate("/productos");
    }
  };

  return (
    <ProductsPage
      initialCategory={categoria}
      onNavigateToProduct={(productId) => navigate(`/producto/${productId}`)}
      onNavigateBack={() => navigate("/")}
      onCategoryChange={handleCategoryChange}
    />
  );
}

// Página de producto individual
export function ProductPageWrapper() {
  const navigate = useNavigate();
  const { id } = useParams();

  if (!id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
          <p className="text-muted-foreground mb-6">
            No se especificó un ID de producto válido.
          </p>
          <button
            onClick={() => navigate("/productos")}
            className="text-blue-600 hover:text-blue-800"
          >
            Ver todos los productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <ProductDetailPage
      productId={id}
      onNavigateBack={() => navigate(-1)}
      onNavigateToProduct={(productId) => navigate(`/producto/${productId}`)}
    />
  );
}
