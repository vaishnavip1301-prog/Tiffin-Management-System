
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  type MenuItem,
  type MenuItemInput,
} from "../../api/menuItemService";

import {
  getMenuCategories,
  type MenuCategory,
} from "../../api/menuCategoryService";

import {
  getMenuSubCategoriesByCategory,
  type MenuSubCategory,
} from "../../api/menuSubCategoryService";

import "./MenuItem.css";

const PAGE_SIZE = 10;

const emptyForm: MenuItemInput = {
  kitchenId: "",
  menuCategoryId: "",
  menuSubCategoryId: "",
  name: "",
  description: "",
  mealTypeId: "",
  foodTypeId: "",
  dietaryTagIds: [],
  price: 0,
  isAvailable: true,
  preparationTimeMinutes: 5,
  imageUrl: "",
};

const mealTypes = [
  { id: "10000000-0000-0000-0000-000000000001", name: "Breakfast" },
  { id: "10000000-0000-0000-0000-000000000002", name: "Lunch" },
  { id: "10000000-0000-0000-0000-000000000003", name: "Dinner" },
  { id: "10000000-0000-0000-0000-000000000004", name: "Snacks" },
  { id: "10000000-0000-0000-0000-000000000005", name: "Beverages" },
];

const foodTypes = [
  { id: "20000000-0000-0000-0000-000000000001", name: "Unspecified" },
  { id: "20000000-0000-0000-0000-000000000002", name: "Vegetarian" },
];

function MenuItemPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [subCategories, setSubCategories] = useState<MenuSubCategory[]>([]);

  const [formData, setFormData] = useState<MenuItemInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [pageNumber, setPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const totalPages = Math.max(1, Math.ceil(totalRecords / PAGE_SIZE));

  const loadMenuItems = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMenuItems(pageNumber, PAGE_SIZE);

      setMenuItems(response.items ?? []);
      setTotalRecords(response.totalRecords ?? 0);
    } catch (err) {
      console.error("Failed to load menu items:", err);
      setError("Menu items could not be loaded. Please check the API.");
    } finally {
      setLoading(false);
    }
  }, [pageNumber]);

  const loadCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);

      const response = await getMenuCategories();
      setCategories(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setError("Categories could not be loaded. Please check the API.");
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    void loadMenuItems();
  }, [loadMenuItems]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    const categoryId = formData.menuCategoryId;

    if (!categoryId) {
      setSubCategories([]);
      return;
    }

    let cancelled = false;

    const loadSubCategories = async () => {
      try {
        setLoadingSubCategories(true);
        setSubCategories([]);
        setError("");

        const response =
          await getMenuSubCategoriesByCategory(categoryId);

        if (!cancelled) {
          setSubCategories(
            response.filter(
              (subcategory) =>
                subcategory.menuCategoryId === categoryId &&
                subcategory.isActive !== false
            )
          );
        }
      } catch (err) {
        console.error("Failed to load subcategories:", err);

        if (!cancelled) {
          setSubCategories([]);
          setError(
            "Subcategories could not be loaded. Check the API endpoint and response."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingSubCategories(false);
        }
      }
    };

    void loadSubCategories();

    return () => {
      cancelled = true;
    };
  }, [formData.menuCategoryId]);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    if (name === "menuCategoryId") {
      setFormData((previous) => ({
        ...previous,
        menuCategoryId: value,
        menuSubCategoryId: "",
      }));
      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "price" || name === "preparationTimeMinutes"
          ? Number(value)
          : value,
    }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setSubCategories([]);
    setEditingId(null);
    setShowForm(false);
    setMessage("");
    setError("");
  };

  const handleCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = async (id: string) => {
    try {
      setError("");
      setMessage("");

      const item = await getMenuItemById(id);

      setFormData({
        kitchenId: item.kitchenId ?? "",
        menuCategoryId: item.menuCategoryId ?? "",
        menuSubCategoryId: item.menuSubCategoryId ?? "",
        name: item.name ?? "",
        description: item.description ?? "",
        mealTypeId: item.mealTypeId ?? "",
        foodTypeId: item.foodTypeId ?? "",
        dietaryTagIds: [],
        price: item.price ?? 0,
        isAvailable: item.isAvailable ?? true,
        preparationTimeMinutes: item.preparationTimeMinutes ?? 5,
        imageUrl: item.imageUrl ?? "",
      });

      setEditingId(id);
      setShowForm(true);
    } catch (err) {
      console.error("Failed to load menu item:", err);
      setError("Menu item details could not be loaded.");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (
      !formData.kitchenId.trim() ||
      !formData.menuCategoryId ||
      !formData.menuSubCategoryId ||
      !formData.mealTypeId ||
      !formData.foodTypeId
    ) {
      setError(
        "Please enter Kitchen ID and select Category, Subcategory, Meal Type and Food Type."
      );
      return;
    }

    if (!formData.name.trim()) {
      setError("Menu item name is required.");
      return;
    }

    if (formData.price <= 0) {
      setError("Please enter a price greater than zero.");
      return;
    }

    if (formData.preparationTimeMinutes < 0) {
      setError("Preparation time cannot be negative.");
      return;
    }

    try {
      setSaving(true);

      const payload: MenuItemInput = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
        imageUrl: formData.imageUrl?.trim() || "",
      };

      if (editingId) {
        await updateMenuItem({
          ...payload,
          id: editingId,
        } as MenuItemInput);

        setMessage("Menu item updated successfully.");
      } else {
        await createMenuItem(payload);
        setMessage("Menu item created successfully.");
      }

      setFormData(emptyForm);
      setSubCategories([]);
      setEditingId(null);
      setShowForm(false);

      await loadMenuItems();
    } catch (err) {
      console.error("Failed to save menu item:", err);
      setError(
        "Menu item could not be saved. Please check the API request format."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await deleteMenuItem(id);
      setMessage("Menu item deleted successfully.");

      if (menuItems.length === 1 && pageNumber > 1) {
        setPageNumber((previous) => previous - 1);
      } else {
        await loadMenuItems();
      }
    } catch (err) {
      console.error("Failed to delete menu item:", err);
      setError("Menu item could not be deleted.");
    }
  };

  const pageNumbers = useMemo(() => {
    const start = Math.max(
      1,
      Math.min(pageNumber - 2, totalPages - 4)
    );
    const end = Math.min(totalPages, start + 4);

    return Array.from(
      { length: end - start + 1 },
      (_, index) => start + index
    );
  }, [pageNumber, totalPages]);

  return (
    <div className="menu-item-page">
      <div className="menu-item-header">
        <div>
          <h2>Menu Item Management</h2>
          <p>Manage your kitchen menu items.</p>
        </div>

        <button
          type="button"
          className="menu-item-create-btn"
          onClick={handleCreate}
        >
          + Add Menu Item
        </button>
      </div>

      {message && <div className="menu-item-message">{message}</div>}
      {error && <div className="menu-item-error">{error}</div>}

      {showForm && (
        <form className="menu-item-form" onSubmit={handleSubmit}>
          <h3>{editingId ? "Update Menu Item" : "Create Menu Item"}</h3>

          <div className="menu-item-form-grid">
            <div className="menu-item-field">
              <label htmlFor="kitchenId">Kitchen ID *</label>
              <input
                id="kitchenId"
                name="kitchenId"
                value={formData.kitchenId}
                onChange={handleChange}
                placeholder="Enter kitchen ID"
                required
              />
            </div>

            <div className="menu-item-field">
              <label htmlFor="menuCategoryId">Category *</label>
              <select
                id="menuCategoryId"
                name="menuCategoryId"
                value={formData.menuCategoryId}
                onChange={handleChange}
                disabled={loadingCategories}
                required
              >
                <option value="">
                  {loadingCategories
                    ? "Loading categories..."
                    : "Select Category"}
                </option>

                {categories
                  .filter((category) => category.isActive !== false)
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="menu-item-field">
              <label htmlFor="menuSubCategoryId">Subcategory *</label>
              <select
                id="menuSubCategoryId"
                name="menuSubCategoryId"
                value={formData.menuSubCategoryId}
                onChange={handleChange}
                disabled={
                  !formData.menuCategoryId || loadingSubCategories
                }
                required
              >
                <option value="">
                  {!formData.menuCategoryId
                    ? "Select Category First"
                    : loadingSubCategories
                      ? "Loading subcategories..."
                      : subCategories.length === 0
                        ? "No subcategories found"
                        : "Select Subcategory"}
                </option>

                {subCategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="menu-item-field">
              <label htmlFor="name">Menu Item Name *</label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Veg Thali"
                required
              />
            </div>

            <div className="menu-item-field">
              <label htmlFor="mealTypeId">Meal Type *</label>
              <select
                id="mealTypeId"
                name="mealTypeId"
                value={formData.mealTypeId}
                onChange={handleChange}
                required
              >
                <option value="">Select Meal Type</option>
                {mealTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="menu-item-field">
              <label htmlFor="foodTypeId">Food Type *</label>
              <select
                id="foodTypeId"
                name="foodTypeId"
                value={formData.foodTypeId}
                onChange={handleChange}
                required
              >
                <option value="">Select Food Type</option>
                {foodTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="menu-item-field">
              <label htmlFor="price">Price (₹) *</label>
              <input
                id="price"
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="menu-item-field">
              <label htmlFor="preparationTimeMinutes">
                Preparation Time (Minutes) *
              </label>
              <input
                id="preparationTimeMinutes"
                name="preparationTimeMinutes"
                type="number"
                min="0"
                value={formData.preparationTimeMinutes}
                onChange={handleChange}
                required
              />
            </div>

            <div className="menu-item-field menu-item-full-width">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter menu item description"
                rows={3}
              />
            </div>

            <div className="menu-item-field menu-item-full-width">
              <label htmlFor="imageUrl">Image URL (Optional)</label>
              <input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl ?? ""}
                onChange={handleChange}
                placeholder="Enter image URL"
              />
            </div>

            <div className="menu-item-field menu-item-checkbox">
              <label htmlFor="isAvailable">Available</label>
              <input
                id="isAvailable"
                name="isAvailable"
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(event) =>
                  setFormData((previous) => ({
                    ...previous,
                    isAvailable: event.target.checked,
                  }))
                }
              />
            </div>
          </div>

          <div className="menu-item-form-actions">
            <button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Menu Item"
                  : "Create Menu Item"}
            </button>

            <button
              type="button"
              className="menu-item-cancel-btn"
              onClick={resetForm}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="menu-item-table-container">
        {loading ? (
          <p className="menu-item-loading">Loading menu items...</p>
        ) : menuItems.length === 0 ? (
          <p className="menu-item-empty">No menu items found.</p>
        ) : (
          <table className="menu-item-table">
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Menu Item</th>
                <th>Category</th>
                <th>Meal Type</th>
                <th>Food Type</th>
                <th>Price</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {menuItems.map((item, index) => (
                <tr key={item.id}>
                  <td>{(pageNumber - 1) * PAGE_SIZE + index + 1}</td>
                  <td>
                    <strong>{item.name}</strong>
                    <small>{item.description || "No description"}</small>
                  </td>
                  <td>{item.categoryName || "-"}</td>
                  <td>{item.mealTypeName || "-"}</td>
                  <td>{item.foodTypeName || "-"}</td>
                  <td>₹{Number(item.price).toFixed(2)}</td>
                  <td>
                    <span
                      className={
                        item.isAvailable
                          ? "menu-item-status available"
                          : "menu-item-status unavailable"
                      }
                    >
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td>
                    <div className="menu-item-actions">
                      <button
                        type="button"
                        className="menu-item-edit-btn"
                        onClick={() => void handleEdit(item.id)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="menu-item-delete-btn"
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
        )}
      </div>

      <div className="menu-item-pagination">
        <span>
          Total Records: {totalRecords} | Page {pageNumber} of {totalPages}
        </span>

        <div className="menu-item-page-buttons">
          <button
            type="button"
            disabled={pageNumber === 1 || loading}
            onClick={() => setPageNumber(1)}
          >
            First
          </button>

          <button
            type="button"
            disabled={pageNumber === 1 || loading}
            onClick={() => setPageNumber((page) => page - 1)}
          >
            Previous
          </button>

          {pageNumbers.map((page) => (
            <button
              type="button"
              key={page}
              className={page === pageNumber ? "active" : ""}
              disabled={loading}
              onClick={() => setPageNumber(page)}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            disabled={pageNumber === totalPages || loading}
            onClick={() => setPageNumber((page) => page + 1)}
          >
            Next
          </button>

          <button
            type="button"
            disabled={pageNumber === totalPages || loading}
            onClick={() => setPageNumber(totalPages)}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuItemPage;
