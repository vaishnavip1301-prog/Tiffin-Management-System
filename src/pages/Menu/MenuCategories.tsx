
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getMenuCategories,
  type MenuCategory,
} from "../../api/menuCategoryService";

import "./MenuCategories.css";

function getCategoryImage(categoryName: string): string {
  const name = categoryName.toLowerCase();

  if (name.includes("thali")) {
    return "/images/vegthali.jpg";
  }

  if (name.includes("healthy")) {
    return "/images/tiffin1.jpg";
  }

  if (name.includes("special")) {
    return "/images/tiffin.jpg";
  }

  return "/images/tiffin2.jpg";
}

function MenuCategories() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMenuCategories();

        const activeCategories = Array.isArray(response)
          ? response.filter((category) => category.isActive !== false)
          : [];

        setCategories(activeCategories);
      } catch (err) {
        console.error("Failed to load menu categories:", err);
        setError("Unable to load menu categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    void loadCategories();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/menu/${encodeURIComponent(categoryId)}`);
  };

  return (
    <main className="menu-categories-page">
      <div className="container">
        <div className="menu-page-header">
          <p className="menu-brand-label">Aapla Dabba</p>

          <h1 className="menu-page-title">Explore Our Menu</h1>

          <p className="menu-page-description">
            Discover delicious, homemade meals prepared with love.
            Choose your favourite category to explore our menu.
          </p>
        </div>

        {loading && (
          <div className="menu-loading">
            <div
              className="spinner-border"
              role="status"
              aria-label="Loading categories"
            />
            <p className="text-muted mt-3">
              Loading categories...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <div className="menu-empty-state">
            <h4>No categories available</h4>
            <p>Please check back later.</p>
          </div>
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="row g-4">
            {categories.map((category) => (
              <div
                className="col-12 col-sm-6 col-lg-4"
                key={category.id}
              >
                <button
                  type="button"
                  className="card menu-category-card"
                  onClick={() => handleCategoryClick(category.id)}
                  aria-label={`Explore ${category.name}`}
                >
                  <div className="menu-category-image-wrap">
                    <img
                      src={getCategoryImage(category.name)}
                      alt={category.name}
                      className="menu-category-image"
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = "/images/tiffin2.jpg";
                      }}
                    />
                  </div>

                  <div className="menu-category-content">
                    <div className="menu-category-top">
                      <span className="menu-category-badge">
                        Menu Category
                      </span>

                      <span
                        className="menu-category-arrow"
                        aria-hidden="true"
                      >
                        <i className="bi bi-arrow-up-right" />
                      </span>
                    </div>

                    <h2 className="menu-category-name">
                      {category.name}
                    </h2>

                    <p className="menu-category-description">
                      {category.description ||
                        `Explore delicious meals from our ${category.name} collection.`}
                    </p>
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default MenuCategories;
