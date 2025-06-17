import Hero from "./components/custom/hero";
import ProductGrid from "./components/custom/product-grid";
// import SearchForm from "./components/custom/search";
// import { Button } from "./components/ui/button";

const App = () => {
  return (
    <div className="container mx-auto">
      <Hero type="home" description="Hero" buttonText="Hero" />
      <section className="mt-10">
        <ProductGrid />
      </section>
      <section className="mt-10">
        <Hero
          type="product"
          title="Los favoritos de los clientes"
          description="Productos"
          buttonText="Productos"
        />
        <ProductGrid />
      </section>
    </div>
  );
};

export default App;
