import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { EyeIcon, ShoppingCartIcon } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Product 1",
    image: "https://placehold.co/600x400?text=Product+1",
    price: 100,
    description: "Product 1 description",
  },
  {
    id: 2,
    name: "Product 2",
    image: "https://placehold.co/600x400?text=Product+2",
    price: 200,
    description: "Product 2 description",
  },

  {
    id: 3,
    name: "Product 3",
    image: "https://placehold.co/600x400?text=Product+3",
    price: 300,
    description: "Product 3 description",
  },
  {
    id: 4,
    name: "Product 4",
    image: "https://placehold.co/600x400?text=Product+4",
    price: 400,
    description: "Product 4 description",
  },
  {
    id: 5,
    name: "Product 5",
    image: "https://placehold.co/600x400?text=Product+5",
    price: 500,
    description: "Product 5 description",
  },
  {
    id: 6,
    name: "Product 6",
    image: "https://placehold.co/600x400?text=Product+6",
    price: 600,
    description: "Product 6 description",
  },
  {
    id: 7,
    name: "Product 7",
    image: "https://placehold.co/600x400?text=Product+7",
    price: 700,
    description: "Product 7 description",
  },
];

const ProductGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
      {products.map((product) => (
        <Card key={product.id} className="w-full h-full">
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
            <CardDescription>{product.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-center"> $ {product.price}</p>
            <CardAction className="flex justify-center gap-2">
              <Button
                variant="outline"
                className="  font-semibold py-3 px-8 rounded-lg transition-colors duration-300 shadow-lg"
              >
                <ShoppingCartIcon className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="  font-semibold py-3 px-8 rounded-lg transition-colors duration-300 shadow-lg"
              >
                <EyeIcon className="w-4 h-4" />
              </Button>
            </CardAction>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ProductGrid;
