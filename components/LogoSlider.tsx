"use client";

// components/LogoSlider.tsx
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";

const logos = [
  "/images/logo1.jpeg",
  "/images/logo2.PNG",
  "/images/logo3.png",
  "/images/logo4.png",
  "/images/logo5.png",
  "/images/logo6.png",
  "/images/logo7.png",
  "/images/logo8.PNG",
  "/images/logo9.png",
  "/images/logo10.png",
  "/images/logo11.png",
];

const LogoSlider = () => {
  return (
<div className="w-full pb-8 pt-28">
  <h2 className="text-4xl font-bold text-center mb-6">
    Supported Brokers
  </h2>
  <span className="block text-base text-gray-500 text-center mb-20">
    Connect with your preferred broker seamlessly
  </span>

  <Swiper
    slidesPerView={8}
    spaceBetween={0}
    breakpoints={{
      0: { slidesPerView: 2 },
      400: { slidesPerView: 3 },
      768: { slidesPerView: 4 },
      1024: { slidesPerView: 6 },
      1280: { slidesPerView: 8 },
    }}
    autoplay={{
      delay: 2000,
      disableOnInteraction: false,
    }}
    loop={true}
    modules={[Autoplay]}
    className="!px-0"
  >
    {logos.map((logo, index) => (
      <SwiperSlide
        key={index}
        className="!p-0 !m-0 flex items-center justify-center"
      >
        <div className="flex items-center justify-center w-full">
          <img
            src={logo}
            alt={`Company Logo ${index + 1}`}
            className="w-16 h-16 object-cover rounded-full cursor-pointer"
          />
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
</div>
  );
};

export default LogoSlider;
