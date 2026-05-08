import "./stats.css";
import { FiShoppingBag, FiDollarSign, FiPackage, FiAward } from "react-icons/fi";

const stats = [
  {
    icon: <FiShoppingBag />,
    value: "10.5k",
    label: "Sellers active our site",
  },
  {
    icon: <FiDollarSign />,
    value: "33k",
    label: "Monthly Product Sale",
    active: true,
  },
  {
    icon: <FiPackage />,
    value: "45.5k",
    label: "Customer active in our site",
  },
  {
    icon: <FiAward />,
    value: "25k",
    label: "Annual gross sale in our site",
  },
];

const Stats = () => {
  return (
    <section className="stats">
      <div className="stats-container">
        {stats.map((item, i) => (
          <div key={i} className="stat-card">
            
            <div className="icon-wrapper">
              <div className="icon">{item.icon}</div>
            </div>

            <h3>{item.value}</h3>
            <p>{item.label}</p>

          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;