import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "../ui/button";

const Hero = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Carrusel de imágenes */}
      <Carousel className="w-full h-full" opts={{ loop: true }}>
        <CarouselContent>
          <CarouselItem className="relative">
            <img
              src="https://cdn.pixabay.com/photo/2023/07/04/08/31/cats-8105667_1280.jpg"
              alt="Hero"
              className="w-full h-screen object-cover"
            />
          </CarouselItem>
          <CarouselItem className="relative">
            <img
              src="https://cdn.pixabay.com/photo/2018/07/13/10/20/kittens-3535404_1280.jpg"
              alt="Hero"
              className="w-full h-screen object-cover"
            />
          </CarouselItem>
        </CarouselContent>
        <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20" />
        <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20" />
      </Carousel>

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>

      {/* Contenido de texto centrado */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Bienvenido a mi tienda virtual
          </h1>
          <p className="text-lg md:text-xl mb-8 drop-shadow-md max-w-2xl">
            Descubre productos únicos y de calidad para tu hogar y estilo de
            vida
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 shadow-lg">
            Explorar productos
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
