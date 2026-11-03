"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const slides: {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  icon: LucideIcon;
}[] = [
  {
    eyebrow: "Spaces for the inspired",
    title: "Make room for your next big idea.",
    description:
      "Find a space that feels like yours, from sunlit photo studios to fully equipped production stages.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2400&q=85",
    imageAlt: "Light-filled creative studio with shared worktables",
    icon: SparklesIcon,
  },
  {
    eyebrow: "Create without limits",
    title: "Your vision deserves the right setting.",
    description:
      "Discover inspiring spaces with the tools, atmosphere, and room to bring your best work to life.",
    image:
      "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=2400&q=85",
    imageAlt: "Professional photography studio set up for a shoot",
    icon: SparklesIcon,
  },
  {
    eyebrow: "A place for every project",
    title: "Turn a great space into great work.",
    description:
      "Book a podcast room, music suite, or art workshop and get straight to creating.",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=2400&q=85",
    imageAlt: "Warmly lit recording studio with professional equipment",
    icon: SparklesIcon,
  },
];

export default function HomeHero() {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    const updateIndex = () => setActiveIndex(api.selectedScrollSnap());
    updateIndex();
    api.on("select", updateIndex);
    api.on("reInit", updateIndex);

    return () => {
      api.off("select", updateIndex);
      api.off("reInit", updateIndex);
    };
  }, [api]);

  return (
    <section className="relative isolate overflow-hidden bg-slate-950 text-white">
      <Carousel
        opts={{ loop: true, duration: 35 }}
        setApi={setApi}
        className="w-full"
        aria-label="Featured creative workspaces"
      >
        <CarouselContent className="ml-0">
          {slides.map((slide, index) => {
            const Icon = slide.icon;

            return (
              <CarouselItem key={slide.title} className="relative min-h-[610px] pl-0 sm:min-h-[680px] lg:min-h-[720px]">
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  unoptimized
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/15" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/10" />
                <div className="relative mx-auto flex min-h-[610px] max-w-7xl items-center px-5 pb-24 pt-20 sm:min-h-[680px] sm:px-8 sm:pb-28 lg:min-h-[720px] lg:px-12">
                  <div className="max-w-3xl">
                    <Badge className="mb-6 gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white backdrop-blur-md">
                      <Icon className="size-4 text-violet-200" aria-hidden="true" />
                      {slide.eyebrow}
                    </Badge>
                    <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
                      {slide.title}
                    </h1>
                    <p className="mt-6 max-w-xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
                      {slide.description}
                    </p>
                    <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                      <Button
                        render={<Link href="/studios" />}
                        nativeButton={false}
                        size="lg"
                        className="h-12 rounded-full bg-white px-6 text-slate-950 hover:bg-white/90"
                      >
                        Explore Studios
                        <ArrowRightIcon className="ml-1 size-4" aria-hidden="true" />
                      </Button>
                      <Button
                        render={<Link href="/studios" />}
                        nativeButton={false}
                        size="lg"
                        variant="outline"
                        className="h-12 rounded-full border-white/35 bg-white/10 px-6 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
                      >
                        Host Your Space
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <Button
          type="button"
          size="icon-lg"
          variant="outline"
          onClick={() => api?.scrollPrev()}
          aria-label="Previous featured space"
          className="absolute bottom-16 right-16 z-10 flex size-10 rounded-full border-white/30 bg-black/20 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white sm:bottom-auto sm:right-16 sm:top-1/2 sm:size-11 sm:-translate-y-1/2"
        >
          <ChevronLeftIcon aria-hidden="true" />
        </Button>
        <Button
          type="button"
          size="icon-lg"
          variant="outline"
          onClick={() => api?.scrollNext()}
          aria-label="Next featured space"
          className="absolute bottom-16 right-4 z-10 flex size-10 rounded-full border-white/30 bg-black/20 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white sm:bottom-auto sm:right-4 sm:top-1/2 sm:size-11 sm:-translate-y-1/2"
        >
          <ChevronRightIcon aria-hidden="true" />
        </Button>

        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto flex max-w-7xl items-center justify-between px-5 pb-7 sm:px-8 lg:px-12">
          <div className="flex items-center gap-2" aria-label="Choose a featured space">
            {slides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={activeIndex === index ? "true" : undefined}
                className={`h-1.5 rounded-full transition-all ${
                  activeIndex === index
                    ? "w-10 bg-white"
                    : "w-5 bg-white/45 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
          <p className="text-sm font-medium tracking-[0.2em] text-white/75">
            {String(activeIndex + 1).padStart(2, "0")}
            <span className="mx-2 text-white/40">/</span>
            {String(slides.length).padStart(2, "0")}
          </p>
        </div>
      </Carousel>
    </section>
  );
}
