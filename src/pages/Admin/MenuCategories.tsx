
import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import {
  getMenuCategories,
  createMenuCategory,
  updateMenuCategory,
  deleteMenuCategory,
  type MenuCategory,
  type MenuCategoryInput,
} from "../../api/menuCategoryService";

import "./MenuCategories.css";

const emptyForm: MenuCategoryInput = {
  name: "",
  kitchenId: "",
  description: "",
  isActive: true,
};

function MenuCategories() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [formData, setFormData] =
    useState<MenuCategoryInput>({ ...emptyForm });

  const [editingCategory, setEditingCategory] =
    useState<MenuCategory | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // GET: Load categories
  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMenuCategories();

      setCategories(
        Array.isArray(data) ? data : data ? [data] : []
      );
    } catch (err) {
      console.error("Get Menu Categories error:", err);

      setError("Failed to load menu categories. Please check the API.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  // Handle text inputs
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({ ...emptyForm });
    setEditingCategory(null);
    setError("");
    setMessage("");
  };

  // Edit selected category
  const handleEdit = (category: MenuCategory) => {
    setEditingCategory(category);

    setFormData({
      name: category.name ?? "",
      kitchenId: category.kitchenId ?? "",
      description: category.description ?? "",
      isActive: category.isActive ?? true,
    });

    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // CREATE / UPDATE
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (editingCategory) {
        await updateMenuCategory(editingCategory.id, formData);
        setMessage("Menu category updated successfully.");
      } else {
        await createMenuCategory(formData);
        setMessage("Menu category created successfully.");
      }

      setFormData({ ...emptyForm });
      setEditingCategory(null);

      await loadCategories();
    } catch (err) {
      console.error("Save Menu Category error:", err);

      setError(
        "Failed to save menu category. Check the API response and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // DELETE
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this menu category?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setMessage("");

      await deleteMenuCategory(id);

      setMessage("Menu category deleted successfully.");

      if (editingCategory?.id === id) {
        resetForm();
      }

      await loadCategories();
    } catch (err) {
      console.error("Delete Menu Category error:", err);
      setError("Failed to delete menu category.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container-fluid py-4 menu-categories-page">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 className="menu-page-title">Menu Categories</h2>
          <p className="text-muted mb-0">
            Create and manage your kitchen menu categories.
          </p>
        </div>

        <button
          type="button"
          className="btn category-primary-btn"
          onClick={resetForm}
        >
          + Add Category
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {message && (
        <div className="alert alert-success" role="status">
          {message}
        </div>
      )}

      {/* Create / Update form */}
      <div className="card category-card mb-4">
        <div className="card-body p-4">
          <h5 className="category-section-title">
            {editingCategory
              ? "Update Menu Category"
              : "Create Menu Category"}
          </h5>

          <p className="text-muted mb-4">
            {editingCategory
              ? "Update the category information below."
              : "Fill in the category information below."}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {editingCategory && (
                <div className="col-12">
                  <label className="form-label" htmlFor="categoryId">
                    Category ID
                  </label>

                  <input
                    id="categoryId"
                    className="form-control"
                    value={editingCategory.id}
                    disabled
                    readOnly
                  />
                </div>
              )}

              <div className="col-md-6">
                <label className="form-label" htmlFor="categoryName">
                  Category Name <span className="required-star">*</span>
                </label>

                <input
                  id="categoryName"
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="kitchenId">
                  Kitchen ID <span className="required-star">*</span>
                </label>

                <input
                  id="kitchenId"
                  type="text"
                  className="form-control"
                  name="kitchenId"
                  value={formData.kitchenId ?? ""}
                  onChange={handleChange}
                  placeholder="Enter kitchen ID"
                  required
                />
              </div>

              <div className="col-12">
                <label
                  className="form-label"
                  htmlFor="categoryDescription"
                >
                  Description
                </label>

                <textarea
                  id="categoryDescription"
                  className="form-control"
                  name="description"
                  value={formData.description ?? ""}
                  onChange={handleChange}
                  placeholder="Enter category description"
                  rows={3}
                />
              </div>

              <div className="col-12">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="categoryActive"
                    checked={Boolean(formData.isActive)}
                    onChange={(event) =>
                      setFormData((previous) => ({
                        ...previous,
                        isActive: event.target.checked,
                      }))
                    }
                  />

                  <label
                    className="form-check-label"
                    htmlFor="categoryActive"
                  >
                    Active Category
                  </label>
                </div>
              </div>

              <div className="col-12 d-flex flex-wrap gap-2">
                <button
                  type="submit"
                  className="btn category-primary-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingCategory
                      ? "Update Category"
                      : "Create Menu Category"}
                </button>

                {editingCategory && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={resetForm}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Category list */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h5 className="category-section-title mb-0">
          All Menu Categories
        </h5>

        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={() => void loadCategories()}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-1" />
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {loading ? (
        <div className="card category-card">
          <div className="card-body text-center py-5">
            <div
              className="spinner-border category-spinner"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted mt-3 mb-0">
              Loading categories...
            </p>
          </div>
        </div>
      ) : (
        <div className="card category-card">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Kitchen ID</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <tr key={category.id}>
                      <td className="fw-semibold">
                        {category.name}
                      </td>

                      <td>{category.description || "-"}</td>

                      <td className="category-kitchen-id">
                        {category.kitchenId || "-"}
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            category.isActive === false
                              ? "bg-secondary"
                              : "category-active-badge"
                          }`}
                        >
                          {category.isActive === false
                            ? "Inactive"
                            : "Active"}
                        </span>
                      </td>

                      <td className="text-nowrap">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEdit(category)}
                          disabled={saving || deletingId !== null}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => void handleDelete(category.id)}
                          disabled={deletingId !== null || saving}
                        >
                          {deletingId === category.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-5 text-muted"
                    >
                      No menu categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuCategories;
