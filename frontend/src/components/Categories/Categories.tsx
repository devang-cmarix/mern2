import "./Categories.css";
import {
  FiSmartphone,
  FiMonitor,
  FiWatch,
  FiCamera,
  FiHeadphones,
} from "react-icons/fi";
import { GiGamepad } from "react-icons/gi";

const categories = [
  { name: "Phones", icon: <FiSmartphone /> },
  { name: "Computers", icon: <FiMonitor /> },
  { name: "SmartWatch", icon: <FiWatch /> },
  { name: "Camera", icon: <FiCamera />, active: true },
  { name: "HeadPhones", icon: <FiHeadphones /> },
  { name: "Gaming", icon: <GiGamepad /> },
];

const Categories = () => {
  return (
    <section className="categories">

      {/* Header */}
      <div className="cat-header">

        <div className="cat-left">
          <div className="cat-label">
            <span className="bar"></span>
            <p>Categories</p>
          </div>

          <h2>Browse By Category</h2>
        </div>

        <div className="cat-arrows">
          <button>←</button>
          <button>→</button>
        </div>

      </div>

      {/* Cards */}
      <div className="cat-list">
        {categories.map((cat, index) => (
          <div key={index} className={`cat-card ${cat.active ? "active" : ""}`}>
            <div className="icon">{cat.icon}</div>
            <p>{cat.name}</p>
          </div>
        ))}
      </div>

      <div className="divider"></div>
    </section>
  );
};

export default Categories;