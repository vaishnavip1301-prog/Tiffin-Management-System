
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  getMenuSubCategories,
  createMenuSubCategory,
  updateMenuSubCategory,
  deleteMenuSubCategory,
  type MenuSubCategory as MenuSubCategoryData,
  type MenuSubCategoryInput,
} from "../../api/menuSubCategoryService";
import {
  getMenuCategories,
  type MenuCategory,
} from "../../api/menuCategoryService";
import "./MenuSubCategory.css";

const emptyForm: MenuSubCategoryInput = {
  name: "",
  description: "",
  displayOrder: 0,
  menuCategoryId: "",
};

function MenuSubCategory() {
  const [subCategories, setSubCategories] = useState<
    MenuSubCategoryData[]
  >([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [formData, setFormData] =
    useState<MenuSubCategoryInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [subCategoryData, categoryData] = await Promise.all([
        getMenuSubCategories(),
        getMenuCategories(),
      ]);

      setSubCategories(subCategoryData);
      setCategories(categoryData);
    } catch (err) {
      console.error("Failed to load menu subcategories:", err);
      setError("Failed to load menu subcategories or menu categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: name === "displayOrder" ? Number(value) : value,
    }));
  };

  const handleCreate = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const handleEdit = (item: MenuSubCategoryData) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      description: item.description ?? "",
      displayOrder: item.displayOrder,
      menuCategoryId: item.menuCategoryId,
    });
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.menuCategoryId) {
      setError("Please select a menu category.");
      return;
    }

    setSaving(true);

    try {
      const payload: MenuSubCategoryInput = {
        name: formData.name.trim(),
        description: formData.description?.trim() || null,
        displayOrder: Number(formData.displayOrder),
        menuCategoryId: formData.menuCategoryId,
      };

      if (editingId) {
        await updateMenuSubCategory(payload);
        setSuccess("Menu subcategory updated successfully.");
      } else {
        await createMenuSubCategory(payload);
        setSuccess("Menu subcategory created successfully.");
      }

      setShowForm(false);
      setEditingId(null);
      setFormData(emptyForm);
      await loadData();
    } catch (err) {
      console.error("Failed to save menu subcategory:", err);
      setError("Failed to save menu subcategory. Please check the API.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this subcategory?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deleteMenuSubCategory(id);
      setSuccess("Menu subcategory deleted successfully.");
      await loadData();
    } catch (err) {
      console.error("Failed to delete menu subcategory:", err);
      setError("Failed to delete menu subcategory.");
    }
  };

  return (
    <div className="sub-category-page">
      <div className="sub-category-header">
        <div>
          <h2>Menu Sub Categories</h2>
          <p>Manage subcategories under each menu category.</p>
        </div>

        <button
          type="button"
          className="sub-category-add-btn"
          onClick={handleCreate}
        >
          + Add Sub Category
        </button>
      </div>

      {error && <div className="sub-category-alert error">{error}</div>}
      {success && (
        <div className="sub-category-alert success">{success}</div>
      )}

      {showForm && (
        <form className="sub-category-form" onSubmit={handleSubmit}>
          <div className="sub-category-form-header">
            <h3>{editingId ? "Edit Sub Category" : "Create Sub Category"}</h3>
            <button
              type="button"
              className="sub-category-close-btn"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData(emptyForm);
              }}
              aria-label="Close form"
            >
              ×
            </button>
          </div>

          <div className="sub-category-form-grid">
            <div className="sub-category-field">
              <label htmlFor="menuCategoryId">Menu Category *</label>
              <select
                id="menuCategoryId"
                name="menuCategoryId"
                value={formData.menuCategoryId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Menu Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sub-category-field">
              <label htmlFor="name">Sub Category Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter subcategory name"
                required
              />
            </div>

            <div className="sub-category-field">
              <label htmlFor="displayOrder">Display Order *</label>
              <input
                id="displayOrder"
                name="displayOrder"
                type="number"
                min="0"
                value={formData.displayOrder}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="sub-category-field full-width">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description ?? ""}
                onChange={handleInputChange}
                placeholder="Enter description"
                rows={3}
              />
            </div>
          </div>

          <div className="sub-category-form-actions">
            <button
              type="button"
              className="sub-category-cancel-btn"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="sub-category-save-btn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Sub Category"
                  : "Create Sub Category"}
            </button>
          </div>
        </form>
      )}

      <div className="sub-category-table-card">
        <div className="sub-category-table-title">
          <h3>Sub Category List</h3>
          <span>{subCategories.length} records</span>
        </div>

        {loading ? (
          <div className="sub-category-state">Loading subcategories...</div>
        ) : subCategories.length === 0 ? (
          <div className="sub-category-state">No subcategories found.</div>
        ) : (
          <div className="sub-category-table-wrapper">
            <table className="sub-category-table">
              <thead>
                <tr>
                  <th>Sub Category</th>
                  <th>Menu Category</th>
                  <th>Description</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subCategories.map((item) => (
                  <tr key={item.id}>
                    <td className="sub-category-name">{item.name}</td>
                    <td>{item.menuCategoryName}</td>
                    <td>{item.description || "—"}</td>
                    <td>{item.displayOrder}</td>
                    <td>
                      <span
                        className={`sub-category-status ${
                          item.isActive ? "active" : "inactive"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="sub-category-actions">
                        <button
                          type="button"
                          className="sub-category-edit-btn"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="sub-category-delete-btn"
                          onClick={() => void handleDelete(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MenuSubCategory;
