import "./Hero.css";
import { FiChevronRight } from "react-icons/fi";
import { useState } from "react";



const categories = [
  "Woman’s Fashion",
  "Men’s Fashion",
  "Electronics",
  "Home & Lifestyle",
  "Medicine",
  "Sports & Outdoor",
  "Baby’s & Toys",
  "Groceries & Pets",
  "Health & Beauty",
];

const slides = [
  {
    title: "Up to 10% off Voucher",
    subtitle: " iPhone 14 Series",
    image: "/images/heroIphone.jpg",
  },
  {
    title: "Big Sale on Laptops",
    subtitle: "MacBook Deals",
    image: "/images/laptop.jpg",
  },
  {
    title: "Best Headphones",
    subtitle: "Audio Sale",
    image: "/images/headphones.jpg",
  },
];
  
const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <section className="hero">
  <div className="hero-container">
      {/* Sidebar */}
      <div className="sidebar">
        {categories.map((item, index) => (
          <div key={index} className="category">
            <span>{item}</span>
            <FiChevronRight />
          </div>
        ))}
      </div>

       <div className="banner">

    <div className="banner-content">
      <div className="apple">
         {slides[currentIndex].subtitle}
      </div>

      <h1>{slides[currentIndex].title}</h1>

      <button className="shop-btn">Shop Now →</button>
    </div>

    <img
      src={slides[currentIndex].image}
      alt="banner"
      className="banner-img"
    />

    {/* DOTS */}
    <div className="dots">
      {slides.map((_, index) => (
        <span
          key={index}
          className={currentIndex === index ? "active" : ""}
          onClick={() => setCurrentIndex(index)}
        ></span>
      ))}
    </div>

  </div>
    </div>
    </section>
  );
};

export default Hero;
