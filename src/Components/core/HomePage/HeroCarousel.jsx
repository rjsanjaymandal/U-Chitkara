import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper';
import CTAButton from './Button';
import HighlightText from './HighlightText';

const HeroCarousel = () => {
  // Carousel slide data
  const carouselData = [
    {
      id: 1,
      title: "Unlock Your Coding Potential",
      description: "Join our comprehensive programming courses and master the skills that employers are looking for.",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1470&auto=format&fit=crop",
      ctaText: "Explore Courses",
      ctaLink: "/catalog/Web Development"
    },
    {
      id: 2,
      title: "Learn from Industry Experts",
      description: "Our instructors bring real-world experience to help you build practical skills for your career.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1471&auto=format&fit=crop",
      ctaText: "Meet Our Instructors",
      ctaLink: "/about"
    },
    {
      id: 3,
      title: "Interactive Learning Experience",
      description: "Engage with hands-on projects, coding challenges, and collaborative learning environments.",
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=1470&auto=format&fit=crop",
      ctaText: "Try Code Playground",
      ctaLink: "/code-playground"
    }
  ];

  return (
    <div className="w-full h-[500px] relative mb-10">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        effect={'fade'}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        className="mySwiper h-full w-full"
      >
        {carouselData.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              {/* Background Image with Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center" 
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-richblack-900 opacity-75"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4 md:px-8 lg:px-16">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4">
                  {slide.title.split(' ').map((word, index) => {
                    return index % 3 === 1 ? (
                      <HighlightText key={index} text={word + " "} />
                    ) : (
                      word + " "
                    );
                  })}
                </h1>
                <p className="text-base md:text-lg text-center max-w-3xl mb-8">
                  {slide.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <CTAButton active={true} linkto={slide.ctaLink}>
                    {slide.ctaText}
                  </CTAButton>
                  <CTAButton active={false} linkto="/signup">
                    Sign Up Now
                  </CTAButton>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroCarousel;
