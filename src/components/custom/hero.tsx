import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import type { CarouselApi } from "@/components/ui/carousel";

interface HeroProps {
  title?: string;
  type: "home" | "product";
  description: string;
  buttonText: string;
}

const Hero = ({ title, type }: HeroProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Auto-play functionality
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(interval);
  }, [api]);

  return (
    <div>
      <h2 className="text-2xl font-bold">{title}</h2>
      <section className="relative w-full overflow-hidden">
        {/* Carrusel de imágenes */}
        {type === "home" && (
          <Carousel
            className="w-full h-full"
            opts={{
              loop: true,
              align: "start",
            }}
            setApi={setApi}
          >
            <CarouselContent className="h-full -ml-0">
              <CarouselItem className="h-full pl-0">
                <div className="relative h-full w-full">
                  <img
                    src="https://cdn.pixabay.com/photo/2023/07/04/08/31/cats-8105667_1280.jpg"
                    alt="Hero Image 1"
                    className="w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
              <CarouselItem className="h-full pl-0">
                <div className="relative h-full w-full">
                  <img
                    src="https://cdn.pixabay.com/photo/2018/07/13/10/20/kittens-3535404_1280.jpg"
                    alt="Hero Image 2"
                    className="w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            </CarouselContent>

            {/* Botones de navegación personalizados */}
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 border-white/50 text-white" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 border-white/50 text-white" />
          </Carousel>
        )}
        {type === "product" && (
          <Carousel
            className="w-full h-40"
            opts={{
              loop: true,
              align: "start",
            }}
            setApi={setApi}
          >
            <CarouselContent className="h-40 -ml-0">
              <CarouselItem className="h-40 pl-0">
                <div className="relative h-40 w-full">
                  <img
                    src="https://cdn.pixabay.com/photo/2023/07/04/08/31/cats-8105667_1280.jpg"
                    alt="Hero Image 1"
                    className="w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
              <CarouselItem className="h-full pl-0">
                <div className="relative h-40 w-full">
                  <img
                    src="https://cdn.pixabay.com/photo/2023/07/04/08/31/cats-8105667_1280.jpg"
                    alt="Hero Image 1"
                    className="w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
              <CarouselItem className="h-full pl-0">
                <div className="relative h-40 w-full">
                  <img
                    src="https://cdn.pixabay.com/photo/2023/07/04/08/31/cats-8105667_1280.jpg"
                    alt="Hero Image 1"
                    className="w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
              <CarouselItem className="h-full pl-0">
                <div className="relative h-40 w-full">
                  <img
                    src="https://cdn.pixabay.com/photo/2023/07/04/08/31/cats-8105667_1280.jpg"
                    alt="Hero Image 1"
                    className="w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        )}
        {/* Overlay oscuro */}

        {type === "home" && (
          <div className="absolute inset-0 bg-black/50 z-10" />
        )}

        {/* Contenido de texto centrado */}
        {type === "home" && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-center text-white px-4">
              <h2 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                {title}
              </h2>
            <Button
              variant="ghost"
              className=" hover:bg-white/50 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 shadow-lg"
            >
              Explorar productos
            </Button>
            </div>
          </div>
        )}

        {/* Indicadores de slide */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              type="button"
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index + 1 === current
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Ir a la imagen ${index + 1}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Hero;
