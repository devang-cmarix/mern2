import "./Categories.css";
import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSmartphone,
  FiMonitor,
  FiWatch,
  FiCamera,
  FiHeadphones,
  FiBox,
} from "react-icons/fi";
import { GiGamepad } from "react-icons/gi";
import { categoryAPI } from "../../services/api";
import type * as Types from "../../types";

type CategoryCard = {
  name: string;
  slug: string;
  icon: ReactElement;
};

const defaultCategories: CategoryCard[] = [
  { name: "Phones", slug: "phones", icon: <FiSmartphone /> },
  { name: "Computers", slug: "computers", icon: <FiMonitor /> },
  { name: "Watches", slug: "Watches", icon: <FiWatch /> },
  { name: "Camera", slug: "Camera", icon: <FiCamera /> },
  { name: "HeadPhones", slug: "headphones", icon: <FiHeadphones /> },
  { name: "Gaming", slug: "gaming", icon: <GiGamepad /> },
];

const iconMap: Record<string, ReactElement> = {
  phones: <FiSmartphone />,
  computers: <FiMonitor />,
  Watches: <FiWatch />,
  Camera: <FiCamera />,
  headphones: <FiHeadphones />,
  gaming: <GiGamepad />,
};

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Types.Category[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        const response = await categoryAPI.getCategories();
        if (isMounted && response?.data?.length) {
          setCategories(response.data);
          return;
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      }

      if (isMounted) {
        setCategories(defaultCategories.map((item) => ({ name: item.name, slug: item.slug })));
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const renderedCategories: CategoryCard[] =
    categories.length > 0
      ? categories.map((cat) => ({
          name: cat.name,
          slug: cat.slug,
          icon:
            iconMap[cat.name.toLowerCase().replace(/\s+/g, "")] ?? <FiBox />,
        }))
      : defaultCategories;

  return (
    <section className="categories">
      <div className="cat-header">
        <div className="cat-left">
          <div className="cat-label">
            <span className="bar"></span>
            <p>Categories</p>
          </div>

          <h2>Browse By Category</h2>
        </div>

        <div className="cat-arrows">
          <button
            type="button"
            onClick={() => setActiveIndex((prev) => Math.max(prev - 1, 0))}
            disabled={activeIndex === 0}
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => setActiveIndex((prev) => Math.min(prev + 1, renderedCategories.length - 1))}
            disabled={activeIndex >= renderedCategories.length - 1}
          >
            →
          </button>
        </div>
      </div>

      <div className="cat-list">
        {renderedCategories.map((cat, index) => (
          <div
            key={cat.name}
            className={`cat-card ${index === activeIndex ? "active" : ""}`}
            onClick={() => {
              setActiveIndex(index);
              navigate(`/products?category=${encodeURIComponent(cat.slug)}`);
            }}
          >
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
