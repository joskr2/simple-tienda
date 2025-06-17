import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Hero = () => {
    return (
      <Carousel>
        <CarouselContent>
          <CarouselItem>
            <img
              src="https://cdn.pixabay.com/photo/2023/07/04/08/31/cats-8105667_1280.jpg"
              alt="Hero"
            />
          </CarouselItem>
          <CarouselItem>
            <img
              src="https://cdn.pixabay.com/photo/2018/07/13/10/20/kittens-3535404_1280.jpg"
              alt="Hero"
            />
          </CarouselItem>
        </CarouselContent>
        <CarouselNext />
        <CarouselPrevious />
      </Carousel>
    );
};

export default Hero;
