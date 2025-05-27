import React, { useState, useEffect, FC, ReactNode } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Type for testimonial
interface Testimonial {
  quote: string;
  name: string;
  role: string;
  image: string;
  rating: number;
  link?: string;
}

// Props for components
interface ComponentProps {
  children: ReactNode;
  className?: string;
}

interface ImageProps {
  src: string;
  alt?: string;
  width: number;
  height: number;
  className?: string;
}

interface IconProps {
  className?: string;
}

// Card components
const Card: FC<ComponentProps> = ({ children, className }) => (
  <div className={`rounded-lg ${className}`}>{children}</div>
);

const CardContent: FC<ComponentProps> = ({ children, className }) => (
  <div className={className}>{children}</div>
);

const Image: FC<ImageProps> = ({ src, alt = 'User', width, height, className }) => {
  const finalSrc = src && !src.startsWith('/')
    ? src
    : `https://placehold.co/${width}x${height}/cccccc/000000?text=${encodeURIComponent(alt)}`;

  return (
    <img
      src={finalSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement;
        target.onerror = null;
        target.src = `https://placehold.co/${width}x${height}/cccccc/000000?text=Error`;
      }}
    />
  );
};

const Star: FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.212a.75.75 0 011.424 0l4.5 9A.75.75 0 0116.5 13.5h-9a.75.75 0 01-.672-1.03l4.5-9z"
      clipRule="evenodd"
    />
    <path
      fillRule="evenodd"
      d="M15.75 18.75a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v-2.25a.75.75 0 01.75-.75h6.75a.75.75 0 01.75.75v2.25z"
      clipRule="evenodd"
    />
  </svg>
);

const TestSwiper: FC = () => {
  const testimonials: Testimonial[] = [
    {
      quote: "Climb the mountain not to plant your flag but to embrace the challenge, enjoy the air, and behold the way. See the world, not so the world can see you.",
      name: "Robert J. Hare",
      role: "Graphics Designer",
      image: "https://placehold.co/60x60/cccccc/000000?text=Robert",
      rating: 5,
      link: "Linktree*",
    },
    {
      quote: "My strategy used to take hours a day to monitor. Algo Tradex Mind runs flawlessly in the background.",
      name: "Nitin Verma",
      role: "Retail Trader",
      image: "https://placehold.co/60x60/cccccc/000000?text=Nitin",
      rating: 5,
    },
    {
      quote: "I cut down my manual work by 90% and improved execution accuracy.",
      name: "Rishabh S.",
      role: "Options Trader",
      image: "https://placehold.co/60x60/cccccc/000000?text=Rishabh",
      rating: 5,
    },
  ];

  const [showScrollToTop, setShowScrollToTop] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-blue-500 font-sans relative">
      <section className="py-20 sm:py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{
          backgroundImage: `radial-gradient(#d1d5db 1px, transparent 1px)`,
          backgroundSize: `20px 20px`,
        }}></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <p className="text-blue-600 font-semibold mb-2">Our Testimonials</p>
              <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl leading-tight">
                People Say About Our Mobile App Development
              </h2>
            </div>

            <div>
              <Swiper
                modules={[Pagination, Navigation, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation={false}
                className="mySwiper p-4"
                style={{
                  '--swiper-pagination-color': '#3b82f6',
                  '--swiper-pagination-bullet-inactive-color': '#d1d5db',
                  '--swiper-pagination-bullet-inactive-opacity': '1',
                  '--swiper-pagination-bullet-size': '10px',
                  '--swiper-pagination-bullet-horizontal-gap': '6px',
                } as React.CSSProperties}
              >
                {testimonials.map((testimonial, index) => (
                  <SwiperSlide key={index}>
                    <Card className="bg-white border border-gray-200 h-full shadow-lg rounded-lg p-8">
                      <CardContent>
                        <div className="flex justify-between items-start mb-4">
                          <p className="text-6xl font-bold text-blue-200 mr-4">“</p>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">{testimonial.name}</div>
                            <div className="text-sm text-gray-600">{testimonial.role}</div>
                          </div>
                        </div>
                        <blockquote className="mb-6 text-gray-700 italic text-lg leading-relaxed">
                          "{testimonial.quote}"
                        </blockquote>
                        <div className="flex items-center justify-between">
                          <div className="flex">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          {testimonial.link && (
                            <a href="#" className="text-blue-600 hover:underline font-medium">
                              {testimonial.link}
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-blue-900 py-16 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-full h-full opacity-10" style={{
          backgroundImage: `radial-gradient(#60a5fa 1px, transparent 1px)`,
          backgroundSize: `20px 20px`,
        }}></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between">
          <div className="flex items-center mb-8 lg:mb-0">
            <p className="text-white text-3xl font-bold mr-4">5m+</p>
            <p className="text-blue-200 text-lg">Trusted Customer</p>
            <div className="flex -space-x-3 ml-6">
              {['U1', 'U2', 'U3', 'U4'].map((user, i) => (
                <Image
                  key={i}
                  src={`https://placehold.co/40x40/cccccc/000000?text=${user}`}
                  alt={`User ${i + 1}`}
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white"
                />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-full p-4 flex items-center shadow-lg">
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.004 9.004 0 01-7.5-3.5L3 18m11-4h-2m0 0h-2m2 0v2m0-2V8m0 4a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </div>
            <p className="text-gray-800 font-medium mr-4">Get Free Consultations For Solutions</p>
            <a href="#" className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300">
              Get A Quote &gt;
            </a>
          </div>
        </div>
      </section>

      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
          aria-label="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default TestSwiper;
