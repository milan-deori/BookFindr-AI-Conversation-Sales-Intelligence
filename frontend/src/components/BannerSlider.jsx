import React, { useState, useEffect, useRef } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { MdArrowBackIosNew } from 'react-icons/md';
import Banner1 from '../assets/banner1.png';
import Banner2 from '../assets/banner2.png';

const banners = [Banner1, Banner2];

const BannerSlider = () => {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => resetTimeout();
  }, [current]);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="relative w-full overflow-hidden shadow-md">
      {/* Slide Container */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          width: `${banners.length * 50}%`,
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {banners.map((banner, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0"
            style={{ width: '100%' }}
          >
            <img
              src={banner}
              alt={`Banner ${index}`}
              loading="lazy"
              className="w-full h-[250px] object-cover rounded-sm shadow-lg transition-transform duration-500 ease-in-out hover:scale-105"
            />
          </div>
        ))}
      </div>

      {/* Always-visible Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white text-black p-2 rounded-full shadow hover:bg-blue-600 hover:text-white transition"
      >
        <MdArrowBackIosNew size={20} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white text-black p-2 rounded-full shadow hover:bg-blue-600 hover:text-white transition"
      >
        <FaChevronRight size={20} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, idx) => (
          <div
            key={idx}
            className={`w-3 h-3 rounded-full ${
              idx === current ? 'bg-blue-600 scale-110' : 'bg-gray-300'
            } transition-all duration-300`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;


