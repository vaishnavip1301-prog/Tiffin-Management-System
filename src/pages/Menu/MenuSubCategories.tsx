
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getMenuSubCategoriesByCategory,
  type MenuSubCategory,
} from "../../api/menuSubCategoryService";
import "./MenuSubCategories.css";

function getSubCategoryImage(name: string): string {
  const value = name.toLowerCase();

  if (value.includes("thali")) return "/images/vegthali.jpg";
  if (value.includes("healthy")) return "/images/tiffin1.jpg";
  if (value.includes("special")) return "/images/tiffin.jpg";
  if (value.includes("rice")) return "/images/tiffin2.jpg";

  return "/images/tiffin2.jpg";
}

function MenuSubCategories() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const [subCategories, setSubCategories] = useState<MenuSubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSubCategories = async () => {
      if (!categoryId) {
        setError("Menu category was not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await getMenuSubCategoriesByCategory(categoryId);

        const activeSubCategories = Array.isArray(response)
          ? response
              .filter((item) => item.isActive !== false)
              .sort((a, b) => a.displayOrder - b.displayOrder)
          : [];

        setSubCategories(activeSubCategories);
      } catch (err) {
        console.error("Failed to load menu subcategories:", err);
        setError("Unable to load subcategories. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    void loadSubCategories();
  }, [categoryId]);

  const handleSubCategoryClick = (id: string) => {
    navigate(`/menu/subcategory/${encodeURIComponent(id)}`);
  };

  const categoryName = subCategories[0]?.menuCategoryName;

  return (
    <main className="menu-subcategories-page">
      <div className="container">
        <div className="menu-subcategories-header">
          <button
            type="button"
            className="menu-back-button"
            onClick={() => navigate("/menu")}
          >
            <i className="bi bi-arrow-left" aria-hidden="true" />
            <span>All Categories</span>
          </button>

          <p className="menu-subcategories-brand">Aapla Dabba</p>

          <h1 className="menu-subcategories-title">
            {categoryName || "Explore Subcategories"}
          </h1>

          <p className="menu-subcategories-description">
            Choose a collection to discover delicious homemade meals.
          </p>
        </div>

        {loading && (
          <div className="menu-subcategories-loading">
            <div
              className="spinner-border"
              role="status"
              aria-label="Loading subcategories"
            />
            <p>Loading subcategories...</p>
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && subCategories.length === 0 && (
          <div className="menu-subcategories-empty">
            <i className="bi bi-egg-fried" aria-hidden="true" />

            <h3>No subcategories available</h3>

            <p>
              There are currently no subcategories in this menu category.
            </p>

            <button
              type="button"
              className="menu-subcategories-return"
              onClick={() => navigate("/menu")}
            >
              Browse All Categories
            </button>
          </div>
        )}

        {!loading && !error && subCategories.length > 0 && (
          <div className="row g-4">
            {subCategories.map((item) => (
              <div className="col-12 col-sm-6 col-lg-4" key={item.id}>
                <button
                  type="button"
                  className="card menu-subcategory-card"
                  onClick={() => handleSubCategoryClick(item.id)}
                  aria-label={`Explore ${item.name}`}
                >
                  <div className="menu-subcategory-image-wrap">
                    <img
                      src={getSubCategoryImage(item.name)}
                      alt={item.name}
                      className="menu-subcategory-image"
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = "/images/tiffin2.jpg";
                      }}
                    />
                  </div>

                  <div className="menu-subcategory-content">
                    <div className="menu-subcategory-card-top">
                      <span className="menu-subcategory-badge">
                        Our Collection
                      </span>

                      <span
                        className="menu-subcategory-arrow"
                        aria-hidden="true"
                      >
                        <i className="bi bi-arrow-up-right" />
                      </span>
                    </div>

                    <h2 className="menu-subcategory-name">{item.name}</h2>

                    <p className="menu-subcategory-text">
                      {item.description ||
                        `Explore delicious options from ${item.name}.`}
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

export default MenuSubCategories;
