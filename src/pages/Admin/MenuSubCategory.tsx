
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { FormEvent, ChangeEvent } from "react";

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

type LocalizedMenuSubCategory = MenuSubCategoryData & {
  nameEn?: string;
  nameMr?: string;
  descriptionEn?: string | null;
  descriptionMr?: string | null;
  menuCategoryNameEn?: string;
  menuCategoryNameMr?: string;
};

type LocalizedMenuCategory = MenuCategory & {
  nameEn?: string;
  nameMr?: string;
};

const emptyForm: MenuSubCategoryInput = {
  name: "",
  description: "",
  displayOrder: 0,
  menuCategoryId: "",
};

function MenuSubCategory() {
  const { t, i18n } = useTranslation();

  const [subCategories, setSubCategories] = useState<
    MenuSubCategoryData[]
  >([]);

  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [formData, setFormData] =
    useState<MenuSubCategoryInput>({ ...emptyForm });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const currentLanguage = i18n.resolvedLanguage || i18n.language;
  const isMarathi = currentLanguage.startsWith("mr");

  // Get localized subcategory name
  const getSubCategoryName = (item: MenuSubCategoryData) => {
    const category = item as LocalizedMenuSubCategory;

    return (
      (isMarathi ? category.nameMr : category.nameEn) ||
      category.name ||
      "-"
    );
  };

  // Get localized subcategory description
  const getSubCategoryDescription = (item: MenuSubCategoryData) => {
    const category = item as LocalizedMenuSubCategory;

    return (
      (isMarathi ? category.descriptionMr : category.descriptionEn) ||
      category.description ||
      "—"
    );
  };

  // Get localized parent category name
  const getMenuCategoryName = (item: MenuSubCategoryData) => {
    const subCategory = item as LocalizedMenuSubCategory;

    return (
      (isMarathi
        ? subCategory.menuCategoryNameMr
        : subCategory.menuCategoryNameEn) ||
      item.menuCategoryName ||
      "-"
    );
  };

  // Get localized category name for dropdown
  const getCategoryName = (category: MenuCategory) => {
    const item = category as LocalizedMenuCategory;

    return (
      (isMarathi ? item.nameMr : item.nameEn) ||
      item.name ||
      "-"
    );
  };

  // GET: Load subcategories and categories
  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [subCategoryData, categoryData] = await Promise.all([
        getMenuSubCategories(),
        getMenuCategories(),
      ]);

      setSubCategories(
        Array.isArray(subCategoryData) ? subCategoryData : []
      );

      setCategories(
        Array.isArray(categoryData) ? categoryData : []
      );
    } catch (err) {
      console.error("Failed to load menu subcategories:", err);

      setError(t("menuSubCategory.loadFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleInputChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: name === "displayOrder" ? Number(value) : value,
    }));
  };

  // CREATE form
  const handleCreate = () => {
    setEditingId(null);
    setFormData({ ...emptyForm });
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  // EDIT form
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

  // CREATE / UPDATE
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.menuCategoryId) {
      setError(t("menuSubCategory.selectCategoryError"));
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
        setSuccess(t("menuSubCategory.updateSuccess"));
      } else {
        await createMenuSubCategory(payload);
        setSuccess(t("menuSubCategory.createSuccess"));
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({ ...emptyForm });

      await loadData();
    } catch (err) {
      console.error("Failed to save menu subcategory:", err);

      setError(t("menuSubCategory.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  // DELETE
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      t("menuSubCategory.deleteConfirmation")
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deleteMenuSubCategory(id);

      setSuccess(t("menuSubCategory.deleteSuccess"));

      await loadData();
    } catch (err) {
      console.error("Failed to delete menu subcategory:", err);

      setError(t("menuSubCategory.deleteFailed"));
    }
  };

  // CLOSE form
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ ...emptyForm });
    setError("");
    setSuccess("");
  };

  return (
    <div className="sub-category-page">
      <div className="sub-category-header">
        <div>
          <h2>{t("menuSubCategory.pageTitle")}</h2>

          <p>{t("menuSubCategory.pageDescription")}</p>
        </div>

        <button
          type="button"
          className="sub-category-add-btn"
          onClick={handleCreate}
        >
          + {t("menuSubCategory.addButton")}
        </button>
      </div>

      {error && (
        <div className="sub-category-alert error">
          {error}
        </div>
      )}

      {success && (
        <div className="sub-category-alert success">
          {success}
        </div>
      )}

      {showForm && (
        <form className="sub-category-form" onSubmit={handleSubmit}>
          <div className="sub-category-form-header">
            <h3>
              {editingId
                ? t("menuSubCategory.editTitle")
                : t("menuSubCategory.createTitle")}
            </h3>

            <button
              type="button"
              className="sub-category-close-btn"
              onClick={handleCloseForm}
              aria-label={t("menuSubCategory.closeForm")}
            >
              ×
            </button>
          </div>

          <div className="sub-category-form-grid">
            <div className="sub-category-field">
              <label htmlFor="menuCategoryId">
                {t("menuSubCategory.menuCategory")} *
              </label>

              <select
                id="menuCategoryId"
                name="menuCategoryId"
                value={formData.menuCategoryId}
                onChange={handleInputChange}
                required
              >
                <option value="">
                  {t("menuSubCategory.selectMenuCategory")}
                </option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {getCategoryName(category)}
                  </option>
                ))}
              </select>
            </div>

            <div className="sub-category-field">
              <label htmlFor="name">
                {t("menuSubCategory.subCategoryName")} *
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder={t("menuSubCategory.namePlaceholder")}
                required
              />
            </div>

            <div className="sub-category-field">
              <label htmlFor="displayOrder">
                {t("menuSubCategory.displayOrder")} *
              </label>

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
              <label htmlFor="description">
                {t("menuSubCategory.description")}
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description ?? ""}
                onChange={handleInputChange}
                placeholder={t("menuSubCategory.descriptionPlaceholder")}
                rows={3}
              />
            </div>
          </div>

          <div className="sub-category-form-actions">
            <button
              type="button"
              className="sub-category-cancel-btn"
              onClick={handleCloseForm}
            >
              {t("menuSubCategory.cancel")}
            </button>

            <button
              type="submit"
              className="sub-category-save-btn"
              disabled={saving}
            >
              {saving
                ? t("menuSubCategory.saving")
                : editingId
                  ? t("menuSubCategory.updateButton")
                  : t("menuSubCategory.createButton")}
            </button>
          </div>
        </form>
      )}

      <div className="sub-category-table-card">
        <div className="sub-category-table-title">
          <h3>{t("menuSubCategory.listTitle")}</h3>

          <span>
            {subCategories.length}{" "}
            {t("menuSubCategory.records")}
          </span>
        </div>

        {loading ? (
          <div className="sub-category-state">
            {t("menuSubCategory.loading")}
          </div>
        ) : subCategories.length === 0 ? (
          <div className="sub-category-state">
            {t("menuSubCategory.noRecords")}
          </div>
        ) : (
          <div className="sub-category-table-wrapper">
            <table className="sub-category-table">
              <thead>
                <tr>
                  <th>{t("menuSubCategory.subCategory")}</th>
                  <th>{t("menuSubCategory.menuCategory")}</th>
                  <th>{t("menuSubCategory.description")}</th>
                  <th>{t("menuSubCategory.order")}</th>
                  <th>{t("menuSubCategory.status")}</th>
                  <th>{t("menuSubCategory.actions")}</th>
                </tr>
              </thead>

              <tbody>
                {subCategories.map((item) => (
                  <tr key={item.id}>
                    <td className="sub-category-name">
                      {getSubCategoryName(item)}
                    </td>

                    <td>{getMenuCategoryName(item)}</td>

                    <td>{getSubCategoryDescription(item)}</td>

                    <td>{item.displayOrder}</td>

                    <td>
                      <span
                        className={`sub-category-status ${
                          item.isActive ? "active" : "inactive"
                        }`}
                      >
                        {item.isActive
                          ? t("menuSubCategory.active")
                          : t("menuSubCategory.inactive")}
                      </span>
                    </td>

                    <td>
                      <div className="sub-category-actions">
                        <button
                          type="button"
                          className="sub-category-edit-btn"
                          onClick={() => handleEdit(item)}
                          disabled={saving}
                        >
                          {t("menuSubCategory.edit")}
                        </button>

                        <button
                          type="button"
                          className="sub-category-delete-btn"
                          onClick={() => void handleDelete(item.id)}
                          disabled={saving}
                        >
                          {t("menuSubCategory.delete")}
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
