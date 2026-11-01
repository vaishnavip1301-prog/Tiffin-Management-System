
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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

type LocalizedMenuItem = MenuItem & {
  nameEn?: string;
  nameMr?: string;
  descriptionEn?: string | null;
  descriptionMr?: string | null;
  categoryNameEn?: string;
  categoryNameMr?: string;
  subCategoryNameEn?: string;
  subCategoryNameMr?: string;
  mealTypeNameEn?: string;
  mealTypeNameMr?: string;
  foodTypeNameEn?: string;
  foodTypeNameMr?: string;
};

type LocalizedMenuCategory = MenuCategory & {
  nameEn?: string;
  nameMr?: string;
};

type LocalizedMenuSubCategory = MenuSubCategory & {
  nameEn?: string;
  nameMr?: string;
};

function MenuItemPage() {
  const { t, i18n } = useTranslation();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [subCategories, setSubCategories] = useState<MenuSubCategory[]>([]);

  const [formData, setFormData] = useState<MenuItemInput>({
    ...emptyForm,
  });

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

  const currentLanguage = i18n.resolvedLanguage || i18n.language;
  const isMarathi = currentLanguage.startsWith("mr");

  const totalPages = Math.max(1, Math.ceil(totalRecords / PAGE_SIZE));

  // Localized menu item fields
  const getItemName = (item: MenuItem) => {
    const data = item as LocalizedMenuItem;

    return (
      (isMarathi ? data.nameMr : data.nameEn) ||
      data.name ||
      "-"
    );
  };

  const getItemDescription = (item: MenuItem) => {
    const data = item as LocalizedMenuItem;

    return (
      (isMarathi ? data.descriptionMr : data.descriptionEn) ||
      data.description ||
      t("menuItem.noDescription")
    );
  };

  const getCategoryName = (category: MenuCategory) => {
    const data = category as LocalizedMenuCategory;

    return (
      (isMarathi ? data.nameMr : data.nameEn) ||
      data.name ||
      "-"
    );
  };

  const getSubCategoryName = (category: MenuSubCategory) => {
    const data = category as LocalizedMenuSubCategory;

    return (
      (isMarathi ? data.nameMr : data.nameEn) ||
      data.name ||
      "-"
    );
  };

  const getItemCategoryName = (item: MenuItem) => {
    const data = item as LocalizedMenuItem;

    return (
      (isMarathi ? data.categoryNameMr : data.categoryNameEn) ||
      data.categoryName ||
      "-"
    );
  };

  const getItemMealTypeName = (item: MenuItem) => {
    const data = item as LocalizedMenuItem;

    return (
      (isMarathi ? data.mealTypeNameMr : data.mealTypeNameEn) ||
      data.mealTypeName ||
      "-"
    );
  };

  const getItemFoodTypeName = (item: MenuItem) => {
    const data = item as LocalizedMenuItem;

    return (
      (isMarathi ? data.foodTypeNameMr : data.foodTypeNameEn) ||
      data.foodTypeName ||
      "-"
    );
  };

  // GET: Load menu items
  const loadMenuItems = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMenuItems(pageNumber, PAGE_SIZE);

      setMenuItems(response.items ?? []);
      setTotalRecords(response.totalRecords ?? 0);
    } catch (err) {
      console.error("Failed to load menu items:", err);

      setError(t("menuItem.loadItemsFailed"));
    } finally {
      setLoading(false);
    }
  }, [pageNumber, t]);

  // GET: Load categories
  const loadCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);

      const response = await getMenuCategories();

      setCategories(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Failed to load categories:", err);

      setError(t("menuItem.loadCategoriesFailed"));
    } finally {
      setLoadingCategories(false);
    }
  }, [t]);

  useEffect(() => {
    void loadMenuItems();
  }, [loadMenuItems]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  // GET: Load subcategories based on selected category
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

          setError(t("menuItem.loadSubCategoriesFailed"));
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
  }, [formData.menuCategoryId, t]);

  // Handle input changes
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

  // Reset form
  const resetForm = () => {
    setFormData({ ...emptyForm });
    setSubCategories([]);
    setEditingId(null);
    setShowForm(false);
    setMessage("");
    setError("");
  };

  // CREATE
  const handleCreate = () => {
    resetForm();
    setShowForm(true);
  };

  // EDIT
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

      setError(t("menuItem.loadItemDetailsFailed"));
    }
  };

  // CREATE / UPDATE
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
      setError(t("menuItem.requiredSelections"));
      return;
    }

    if (!formData.name.trim()) {
      setError(t("menuItem.nameRequired"));
      return;
    }

    if (formData.price <= 0) {
      setError(t("menuItem.invalidPrice"));
      return;
    }

    if (formData.preparationTimeMinutes < 0) {
      setError(t("menuItem.invalidPreparationTime"));
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

        setMessage(t("menuItem.updateSuccess"));
      } else {
        await createMenuItem(payload);

        setMessage(t("menuItem.createSuccess"));
      }

      setFormData({ ...emptyForm });
      setSubCategories([]);
      setEditingId(null);
      setShowForm(false);

      await loadMenuItems();
    } catch (err) {
      console.error("Failed to save menu item:", err);

      setError(t("menuItem.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  // DELETE
  const handleDelete = async (id: string) => {
    if (!window.confirm(t("menuItem.deleteConfirmation"))) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await deleteMenuItem(id);

      setMessage(t("menuItem.deleteSuccess"));

      if (menuItems.length === 1 && pageNumber > 1) {
        setPageNumber((previous) => previous - 1);
      } else {
        await loadMenuItems();
      }
    } catch (err) {
      console.error("Failed to delete menu item:", err);

      setError(t("menuItem.deleteFailed"));
    }
  };

  // Pagination
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
          <h2>{t("menuItem.pageTitle")}</h2>
          <p>{t("menuItem.pageDescription")}</p>
        </div>

        <button
          type="button"
          className="menu-item-create-btn"
          onClick={handleCreate}
        >
          + {t("menuItem.addButton")}
        </button>
      </div>

      {message && (
        <div className="menu-item-message">{message}</div>
      )}

      {error && (
        <div className="menu-item-error">{error}</div>
      )}

      {showForm && (
        <form className="menu-item-form" onSubmit={handleSubmit}>
          <h3>
            {editingId
              ? t("menuItem.updateTitle")
              : t("menuItem.createTitle")}
          </h3>

          <div className="menu-item-form-grid">
            <div className="menu-item-field">
              <label htmlFor="kitchenId">
                {t("menuItem.kitchenId")} *
              </label>

              <input
                id="kitchenId"
                name="kitchenId"
                value={formData.kitchenId}
                onChange={handleChange}
                placeholder={t("menuItem.kitchenIdPlaceholder")}
                required
              />
            </div>

            <div className="menu-item-field">
              <label htmlFor="menuCategoryId">
                {t("menuItem.category")} *
              </label>

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
                    ? t("menuItem.loadingCategories")
                    : t("menuItem.selectCategory")}
                </option>

                {categories
                  .filter((category) => category.isActive !== false)
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {getCategoryName(category)}
                    </option>
                  ))}
              </select>
            </div>

            <div className="menu-item-field">
              <label htmlFor="menuSubCategoryId">
                {t("menuItem.subcategory")} *
              </label>

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
                    ? t("menuItem.selectCategoryFirst")
                    : loadingSubCategories
                      ? t("menuItem.loadingSubcategories")
                      : subCategories.length === 0
                        ? t("menuItem.noSubcategories")
                        : t("menuItem.selectSubcategory")}
                </option>

                {subCategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {getSubCategoryName(subcategory)}
                  </option>
                ))}
              </select>
            </div>

            <div className="menu-item-field">
              <label htmlFor="name">
                {t("menuItem.itemName")} *
              </label>

              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t("menuItem.itemNamePlaceholder")}
                required
              />
            </div>

            <div className="menu-item-field">
              <label htmlFor="mealTypeId">
                {t("menuItem.mealType")} *
              </label>

              <select
                id="mealTypeId"
                name="mealTypeId"
                value={formData.mealTypeId}
                onChange={handleChange}
                required
              >
                <option value="">
                  {t("menuItem.selectMealType")}
                </option>

                {mealTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {t(`menuItem.mealTypes.${type.name}`)}
                  </option>
                ))}
              </select>
            </div>

            <div className="menu-item-field">
              <label htmlFor="foodTypeId">
                {t("menuItem.foodType")} *
              </label>

              <select
                id="foodTypeId"
                name="foodTypeId"
                value={formData.foodTypeId}
                onChange={handleChange}
                required
              >
                <option value="">
                  {t("menuItem.selectFoodType")}
                </option>

                {foodTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {t(`menuItem.foodTypes.${type.name}`)}
                  </option>
                ))}
              </select>
            </div>

            <div className="menu-item-field">
              <label htmlFor="price">
                {t("menuItem.price")} (₹) *
              </label>

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
                {t("menuItem.preparationTime")} *
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
              <label htmlFor="description">
                {t("menuItem.description")}
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder={t("menuItem.descriptionPlaceholder")}
                rows={3}
              />
            </div>

            <div className="menu-item-field menu-item-full-width">
              <label htmlFor="imageUrl">
                {t("menuItem.imageUrl")}
              </label>

              <input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl ?? ""}
                onChange={handleChange}
                placeholder={t("menuItem.imageUrlPlaceholder")}
              />
            </div>

            <div className="menu-item-field menu-item-checkbox">
              <label htmlFor="isAvailable">
                {t("menuItem.available")}
              </label>

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
                ? t("menuItem.saving")
                : editingId
                  ? t("menuItem.updateButton")
                  : t("menuItem.createButton")}
            </button>

            <button
              type="button"
              className="menu-item-cancel-btn"
              onClick={resetForm}
            >
              {t("menuItem.cancel")}
            </button>
          </div>
        </form>
      )}

      <div className="menu-item-table-container">
        {loading ? (
          <p className="menu-item-loading">
            {t("menuItem.loadingItems")}
          </p>
        ) : menuItems.length === 0 ? (
          <p className="menu-item-empty">
            {t("menuItem.noItems")}
          </p>
        ) : (
          <table className="menu-item-table">
            <thead>
              <tr>
                <th>{t("menuItem.serialNumber")}</th>
                <th>{t("menuItem.menuItem")}</th>
                <th>{t("menuItem.category")}</th>
                <th>{t("menuItem.mealType")}</th>
                <th>{t("menuItem.foodType")}</th>
                <th>{t("menuItem.price")}</th>
                <th>{t("menuItem.available")}</th>
                <th>{t("menuItem.actions")}</th>
              </tr>
            </thead>

            <tbody>
              {menuItems.map((item, index) => (
                <tr key={item.id}>
                  <td>
                    {(pageNumber - 1) * PAGE_SIZE + index + 1}
                  </td>

                  <td>
                    <strong>{getItemName(item)}</strong>
                    <small>{getItemDescription(item)}</small>
                  </td>

                  <td>{getItemCategoryName(item)}</td>

                  <td>{getItemMealTypeName(item)}</td>

                  <td>{getItemFoodTypeName(item)}</td>

                  <td>₹{Number(item.price).toFixed(2)}</td>

                  <td>
                    <span
                      className={
                        item.isAvailable
                          ? "menu-item-status available"
                          : "menu-item-status unavailable"
                      }
                    >
                      {item.isAvailable
                        ? t("menuItem.available")
                        : t("menuItem.unavailable")}
                    </span>
                  </td>

                  <td>
                    <div className="menu-item-actions">
                      <button
                        type="button"
                        className="menu-item-edit-btn"
                        onClick={() => void handleEdit(item.id)}
                        disabled={saving}
                      >
                        {t("menuItem.edit")}
                      </button>

                      <button
                        type="button"
                        className="menu-item-delete-btn"
                        onClick={() => void handleDelete(item.id)}
                        disabled={saving}
                      >
                        {t("menuItem.delete")}
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
          {t("menuItem.totalRecords")}: {totalRecords} |{" "}
          {t("menuItem.page")} {pageNumber} {t("menuItem.of")} {totalPages}
        </span>

        <div className="menu-item-page-buttons">
          <button
            type="button"
            disabled={pageNumber === 1 || loading}
            onClick={() => setPageNumber(1)}
          >
            {t("menuItem.first")}
          </button>

          <button
            type="button"
            disabled={pageNumber === 1 || loading}
            onClick={() => setPageNumber((page) => page - 1)}
          >
            {t("menuItem.previous")}
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
            {t("menuItem.next")}
          </button>

          <button
            type="button"
            disabled={pageNumber === totalPages || loading}
            onClick={() => setPageNumber(totalPages)}
          >
            {t("menuItem.last")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuItemPage;
