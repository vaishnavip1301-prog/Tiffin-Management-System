import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import {
  createMenuItem,
  deleteMenuItem,
  getAllMenuItems,
  updateMenuItem,
} from "../../api/menuItemService";

import type {
  MenuItem,
  MenuItemInput,
} from "../../api/menuItemService";

import { getKitchen } from "../../api/kitchenService";
import { getMenuCategories } from "../../api/menuCategoryService";

import "./MenuItem.css";

interface Option {
  id: string;
  name: string;
}

type FormData = MenuItemInput;

const emptyForm: FormData = {
  kitchenId: "",
  menuCategoryId: "",
  menuSubCategoryId: "",
  mealTypeId: "",
  foodTypeId: "",
  name: "",
  description: "",
  price: 0,
  currencyCode: "INR",
  isAvailable: true,
  preparationTimeMinutes: 30,
  imageUrl: "",
};

function extractRecords(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    return value.filter(
      (item): item is Record<string, unknown> =>
        typeof item === "object" && item !== null
    );
  }

  if (typeof value !== "object" || value === null) {
    return [];
  }

  const result = value as Record<string, unknown>;

  for (const key of [
    "items",
    "data",
    "records",
    "results",
    "categories",
    "kitchens",
  ]) {
    if (Array.isArray(result[key])) {
      return extractRecords(result[key]);
    }
  }

  if (
    result.id ||
    result.Id ||
    result.kitchenId ||
    result.menuCategoryId
  ) {
    return [result];
  }

  return [];
}

function getString(
  record: Record<string, unknown>,
  keys: string[]
): string {
  for (const key of keys) {
    const value = record[key];

    if (
      typeof value === "string" &&
      value.trim() !== ""
    ) {
      return value.trim();
    }
  }

  return "";
}

function makeOptions(
  records: Record<string, unknown>[],
  idKeys: string[],
  nameKeys: string[],
  uniqueByName = false
): Option[] {
  const options = new Map<string, Option>();
  const seenNames = new Set<string>();

  records.forEach((record) => {
    const id = getString(record, idKeys);
    const name = getString(record, nameKeys);

    if (!id || !name) return;

    const normalizedName = name.toLowerCase();

    if (uniqueByName) {
      if (seenNames.has(normalizedName)) return;
      seenNames.add(normalizedName);
    }

    if (!options.has(id)) {
      options.set(id, { id, name });
    }
  });

  return Array.from(options.values());
}

function getItemOptions(
  items: MenuItem[],
  idKey: keyof MenuItem,
  nameKey: keyof MenuItem,
  uniqueByName = false
): Option[] {
  const options = new Map<string, Option>();
  const seenNames = new Set<string>();

  items.forEach((item) => {
    const id = item[idKey];
    const name = item[nameKey];

    if (
      typeof id !== "string" ||
      !id.trim() ||
      typeof name !== "string" ||
      !name.trim()
    ) {
      return;
    }

    const normalizedName = name.trim().toLowerCase();

    if (uniqueByName) {
      if (seenNames.has(normalizedName)) return;
      seenNames.add(normalizedName);
    }

    if (!options.has(id)) {
      options.set(id, {
        id,
        name: name.trim(),
      });
    }
  });

  return Array.from(options.values());
}

function MenuItemPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [kitchens, setKitchens] = useState<Option[]>([]);
  const [categories, setCategories] = useState<Option[]>([]);

  const [formData, setFormData] =
    useState<FormData>(emptyForm);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadMenuItems = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAllMenuItems();
      setItems(data);
    } catch (err) {
      console.error("Failed to load menu items:", err);
      setError(
        "Unable to load menu items. Please check the backend API."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDropdownOptions = useCallback(async () => {
    try {
      const [kitchenResponse, categoryResponse] =
        await Promise.all([
          getKitchen(),
          getMenuCategories(),
        ]);

      const kitchenRecords = extractRecords(kitchenResponse);
      const categoryRecords = extractRecords(categoryResponse);

      setKitchens(
        makeOptions(
          kitchenRecords,
          ["id", "Id", "kitchenId", "KitchenId"],
          ["name", "Name", "kitchenName", "KitchenName"]
        )
      );

      setCategories(
        makeOptions(
          categoryRecords,
          [
            "id",
            "Id",
            "menuCategoryId",
            "MenuCategoryId",
            "categoryId",
          ],
          [
            "name",
            "Name",
            "categoryName",
            "CategoryName",
            "menuCategoryName",
          ]
        )
      );
    } catch (err) {
      console.error("Failed to load dropdown options:", err);
      setError(
        "Unable to load Kitchen or Category options. Please check their APIs."
      );
    }
  }, []);

  useEffect(() => {
    void loadMenuItems();
    void loadDropdownOptions();
  }, [loadMenuItems, loadDropdownOptions]);

  const subCategoryOptions = useMemo(() => {
    const filteredItems = items.filter(
      (item) =>
        item.menuCategoryId === formData.menuCategoryId
    );

    return getItemOptions(
      filteredItems,
      "menuSubCategoryId",
      "subCategoryName",
      true
    );
  }, [items, formData.menuCategoryId]);

  const mealTypeOptions = useMemo(
    () =>
      getItemOptions(
        items,
        "mealTypeId",
        "mealTypeName",
        true
      ),
    [items]
  );

  const foodTypeOptions = useMemo(
    () =>
      getItemOptions(
        items,
        "foodTypeId",
        "foodTypeName",
        true
      ),
    [items]
  );

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = event.target;

    const nextValue =
      type === "checkbox"
        ? (event.target as HTMLInputElement).checked
        : name === "price" ||
            name === "preparationTimeMinutes"
          ? Number(value)
          : value;

    setFormData((previous) => ({
      ...previous,
      [name]: nextValue,
      ...(name === "menuCategoryId"
        ? { menuSubCategoryId: "" }
        : {}),
    }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload: MenuItemInput = {
        ...formData,
        kitchenId: formData.kitchenId,
        menuCategoryId: formData.menuCategoryId,
        menuSubCategoryId: formData.menuSubCategoryId,
        mealTypeId: formData.mealTypeId,
        foodTypeId: formData.foodTypeId,
        price: Number(formData.price),
        preparationTimeMinutes: Number(
          formData.preparationTimeMinutes
        ),
      };

      if (editingId) {
        await updateMenuItem(editingId, payload);
        setSuccess("Menu item updated successfully.");
      } else {
        await createMenuItem(payload);
        setSuccess("Menu item created successfully.");
      }

      setFormData(emptyForm);
      setEditingId(null);

      await Promise.all([
        loadMenuItems(),
        loadDropdownOptions(),
      ]);
    } catch (err) {
      console.error("Failed to save menu item:", err);
      setError(
        "Unable to save menu item. Please verify the API payload and backend."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setError("");
    setSuccess("");

    setFormData({
      kitchenId: item.kitchenId ?? "",
      menuCategoryId: item.menuCategoryId ?? "",
      menuSubCategoryId: item.menuSubCategoryId ?? "",
      mealTypeId: item.mealTypeId ?? "",
      foodTypeId: item.foodTypeId ?? "",
      name: item.name ?? "",
      description: item.description ?? "",
      price: Number(item.price ?? 0),
      currencyCode: item.currencyCode ?? "INR",
      isAvailable: item.isAvailable ?? true,
      preparationTimeMinutes: Number(
        item.preparationTimeMinutes ?? 30
      ),
      imageUrl: item.imageUrl ?? "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this menu item?"
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deleteMenuItem(id);
      setSuccess("Menu item deleted successfully.");
      await loadMenuItems();
    } catch (err) {
      console.error("Failed to delete menu item:", err);
      setError("Unable to delete menu item.");
    }
  };

  const renderSelect = (
    label: string,
    name: keyof FormData,
    options: Option[],
    required = true,
    disabled = false
  ) => (
    <div className="col-md-6" key={name}>
      <label
        className="form-label fw-semibold"
        htmlFor={name}
      >
        {label}
      </label>

      <select
        id={name}
        className="form-select"
        name={name}
        value={String(formData[name])}
        onChange={handleChange}
        required={required}
        disabled={disabled}
      >
        <option value="">Select {label}</option>

        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>

      {options.length === 0 && (
        <small className="text-secondary">
          No options available.
        </small>
      )}
    </div>
  );

  return (
    <div className="menu-item-page container-fluid">
      <div className="menu-item-heading">
        <div>
          <h2>Menu Items</h2>
          <p>Manage your kitchen menu items here.</p>
        </div>

        <button
          type="button"
          className="btn menu-refresh-btn"
          onClick={() => {
            void loadMenuItems();
            void loadDropdownOptions();
          }}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success" role="status">
          {success}
        </div>
      )}

      <section className="menu-item-form-card">
        <h4>
          {editingId ? "Update Menu Item" : "Create Menu Item"}
        </h4>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {renderSelect(
              "Kitchen",
              "kitchenId",
              kitchens
            )}

            {renderSelect(
              "Category",
              "menuCategoryId",
              categories
            )}

            {renderSelect(
              "Subcategory",
              "menuSubCategoryId",
              subCategoryOptions,
              false,
              !formData.menuCategoryId
            )}

            {renderSelect(
              "Meal Type",
              "mealTypeId",
              mealTypeOptions
            )}

            {renderSelect(
              "Food Type",
              "foodTypeId",
              foodTypeOptions
            )}

            <div className="col-md-6">
              <label
                className="form-label fw-semibold"
                htmlFor="name"
              >
                Menu Item Name
              </label>
              <input
                id="name"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter menu item name"
                required
              />
            </div>

            <div className="col-md-6">
              <label
                className="form-label fw-semibold"
                htmlFor="price"
              >
                Price
              </label>
              <input
                id="price"
                className="form-control"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label
                className="form-label fw-semibold"
                htmlFor="currencyCode"
              >
                Currency
              </label>
              <select
                id="currencyCode"
                className="form-select"
                name="currencyCode"
                value={formData.currencyCode}
                onChange={handleChange}
                required
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
              </select>
            </div>

            <div className="col-md-6">
              <label
                className="form-label fw-semibold"
                htmlFor="preparationTimeMinutes"
              >
                Preparation Time (minutes)
              </label>
              <input
                id="preparationTimeMinutes"
                className="form-control"
                name="preparationTimeMinutes"
                type="number"
                min="0"
                value={formData.preparationTimeMinutes}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12">
              <label
                className="form-label fw-semibold"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                className="form-control"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
              />
            </div>

            <div className="col-12">
              <label
                className="form-label fw-semibold"
                htmlFor="imageUrl"
              >
                Image URL
              </label>
              <input
                id="imageUrl"
                className="form-control"
                name="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="Enter image URL"
              />
            </div>

            <div className="col-12">
              <label className="menu-availability">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                />
                <span>Available for customers</span>
              </label>
            </div>

            <div className="col-12 d-flex flex-wrap gap-2">
              <button
                type="submit"
                className="btn menu-save-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Menu Item"
                    : "Create Menu Item"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="btn menu-cancel-btn"
                  onClick={resetForm}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </div>
        </form>
      </section>

      <section className="menu-item-table-card">
        <div className="menu-table-heading">
          <h4>Menu Item List</h4>
          <span>{items.length} items</span>
        </div>

        {loading ? (
          <p className="menu-empty-message">
            Loading menu items...
          </p>
        ) : items.length === 0 ? (
          <p className="menu-empty-message">
            No menu items found.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle menu-item-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Kitchen</th>
                  <th>Category</th>
                  <th>Subcategory</th>
                  <th>Meal Type</th>
                  <th>Food Type</th>
                  <th>Price</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.name}</strong>
                      {item.description && (
                        <small className="menu-item-description">
                          {item.description}
                        </small>
                      )}
                    </td>

                    <td>
                      {item.kitchenName ||
                        kitchens.find(
                          (option) => option.id === item.kitchenId
                        )?.name ||
                        "—"}
                    </td>

                    <td>
                      {item.categoryName ||
                        categories.find(
                          (option) =>
                            option.id === item.menuCategoryId
                        )?.name ||
                        "—"}
                    </td>

                    <td>{item.subCategoryName || "—"}</td>
                    <td>{item.mealTypeName || "—"}</td>
                    <td>{item.foodTypeName || "—"}</td>

                    <td>
                      {item.currencyCode || "INR"}{" "}
                      {Number(item.price || 0).toFixed(2)}
                    </td>

                    <td>
                      <span
                        className={`menu-status ${
                          item.isAvailable
                            ? "menu-status-available"
                            : "menu-status-unavailable"
                        }`}
                      >
                        {item.isAvailable
                          ? "Available"
                          : "Unavailable"}
                      </span>
                    </td>

                    <td>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn menu-edit-btn"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn menu-delete-btn"
                          onClick={() =>
                            void handleDelete(item.id)
                          }
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
      </section>
    </div>
  );
}

export default MenuItemPage;
