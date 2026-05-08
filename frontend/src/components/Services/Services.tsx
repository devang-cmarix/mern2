import "./Services.css";
import { FiTruck, FiHeadphones, FiShield } from "react-icons/fi";

const services = [
  {
    icon: <FiTruck />,
    title: "FREE AND FAST DELIVERY",
    desc: "Free delivery for all orders over $140",
  },
  {
    icon: <FiHeadphones />,
    title: "24/7 CUSTOMER SERVICE",
    desc: "Friendly 24/7 customer support",
  },
  {
    icon: <FiShield />,
    title: "MONEY BACK GUARANTEE",
    desc: "We return money within 30 days",
  },
];

const Services = () => {
  return (
    <section className="services">
      <div className="services-container">
        {services.map((item, index) => (
          <div key={index} className="service-card">
            
            <div className="icon-wrapper">
              <div className="icon">{item.icon}</div>
            </div>

            <h4>{item.title}</h4>
            <p>{item.desc}</p>

          </div>
        ))}
      </div>

      {/* Scroll to top button */}
      <div className="scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        ↑
      </div>
    </section>
  );
};

export default Services;