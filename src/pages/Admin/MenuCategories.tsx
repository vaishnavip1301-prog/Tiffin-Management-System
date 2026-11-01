
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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

type LocalizedMenuCategory = MenuCategory & {
  nameEn?: string;
  nameMr?: string;
  descriptionEn?: string | null;
  descriptionMr?: string | null;
};

const emptyForm: MenuCategoryInput = {
  name: "",
  kitchenId: "",
  description: "",
  isActive: true,
};

function MenuCategories() {
  const { t, i18n } = useTranslation();

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

  const currentLanguage = i18n.resolvedLanguage || i18n.language;
  const isMarathi = currentLanguage.startsWith("mr");

  // Get localized category name
  const getCategoryName = (category: MenuCategory) => {
    const item = category as LocalizedMenuCategory;

    return (
      (isMarathi ? item.nameMr : item.nameEn) ||
      item.name ||
      "-"
    );
  };

  // Get localized category description
  const getCategoryDescription = (category: MenuCategory) => {
    const item = category as LocalizedMenuCategory;

    return (
      (isMarathi ? item.descriptionMr : item.descriptionEn) ||
      item.description ||
      "-"
    );
  };

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
      setError(t("menuCategories.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [t]);

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
        setMessage(t("menuCategories.updateSuccess"));
      } else {
        await createMenuCategory(formData);
        setMessage(t("menuCategories.createSuccess"));
      }

      setFormData({ ...emptyForm });
      setEditingCategory(null);

      await loadCategories();
    } catch (err) {
      console.error("Save Menu Category error:", err);

      setError(t("menuCategories.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  // DELETE
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      t("menuCategories.deleteConfirmation")
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setMessage("");

      await deleteMenuCategory(id);

      setMessage(t("menuCategories.deleteSuccess"));

      if (editingCategory?.id === id) {
        resetForm();
      }

      await loadCategories();
    } catch (err) {
      console.error("Delete Menu Category error:", err);
      setError(t("menuCategories.deleteFailed"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container-fluid py-4 menu-categories-page">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 className="menu-page-title">
            {t("menuCategories.pageTitle")}
          </h2>

          <p className="text-muted mb-0">
            {t("menuCategories.pageDescription")}
          </p>
        </div>

        <button
          type="button"
          className="btn category-primary-btn"
          onClick={resetForm}
        >
          + {t("menuCategories.addCategory")}
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
              ? t("menuCategories.updateTitle")
              : t("menuCategories.createTitle")}
          </h5>

          <p className="text-muted mb-4">
            {editingCategory
              ? t("menuCategories.updateDescription")
              : t("menuCategories.createDescription")}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {editingCategory && (
                <div className="col-12">
                  <label className="form-label" htmlFor="categoryId">
                    {t("menuCategories.categoryId")}
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
                  {t("menuCategories.categoryName")}{" "}
                  <span className="required-star">*</span>
                </label>

                <input
                  id="categoryName"
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t("menuCategories.categoryNamePlaceholder")}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="kitchenId">
                  {t("menuCategories.kitchenId")}{" "}
                  <span className="required-star">*</span>
                </label>

                <input
                  id="kitchenId"
                  type="text"
                  className="form-control"
                  name="kitchenId"
                  value={formData.kitchenId ?? ""}
                  onChange={handleChange}
                  placeholder={t("menuCategories.kitchenIdPlaceholder")}
                  required
                />
              </div>

              <div className="col-12">
                <label
                  className="form-label"
                  htmlFor="categoryDescription"
                >
                  {t("menuCategories.description")}
                </label>

                <textarea
                  id="categoryDescription"
                  className="form-control"
                  name="description"
                  value={formData.description ?? ""}
                  onChange={handleChange}
                  placeholder={t("menuCategories.descriptionPlaceholder")}
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
                    {t("menuCategories.activeCategory")}
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
                    ? t("menuCategories.saving")
                    : editingCategory
                      ? t("menuCategories.updateCategory")
                      : t("menuCategories.createCategory")}
                </button>

                {editingCategory && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={resetForm}
                    disabled={saving}
                  >
                    {t("menuCategories.cancel")}
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
          {t("menuCategories.allCategories")}
        </h5>

        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={() => void loadCategories()}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-1" />
          {loading
            ? t("menuCategories.loading")
            : t("menuCategories.refresh")}
        </button>
      </div>

      {loading ? (
        <div className="card category-card">
          <div className="card-body text-center py-5">
            <div
              className="spinner-border category-spinner"
              role="status"
            >
              <span className="visually-hidden">
                {t("menuCategories.loading")}
              </span>
            </div>

            <p className="text-muted mt-3 mb-0">
              {t("menuCategories.loadingCategories")}
            </p>
          </div>
        </div>
      ) : (
        <div className="card category-card">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>{t("menuCategories.categoryName")}</th>
                  <th>{t("menuCategories.description")}</th>
                  <th>{t("menuCategories.kitchenId")}</th>
                  <th>{t("menuCategories.status")}</th>
                  <th>{t("menuCategories.actions")}</th>
                </tr>
              </thead>

              <tbody>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <tr key={category.id}>
                      <td className="fw-semibold">
                        {getCategoryName(category)}
                      </td>

                      <td>
                        {getCategoryDescription(category)}
                      </td>

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
                            ? t("menuCategories.inactive")
                            : t("menuCategories.active")}
                        </span>
                      </td>

                      <td className="text-nowrap">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEdit(category)}
                          disabled={saving || deletingId !== null}
                        >
                          {t("menuCategories.edit")}
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => void handleDelete(category.id)}
                          disabled={deletingId !== null || saving}
                        >
                          {deletingId === category.id
                            ? t("menuCategories.deleting")
                            : t("menuCategories.delete")}
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
                      {t("menuCategories.noCategories")}
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
