
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useTranslation } from "react-i18next";

import {
  getDietaryTags,
  getDietaryTagById,
  createDietaryTag,
  updateDietaryTag,
  deleteDietaryTag,
  type DietaryTag as DietaryTagData,
  type DietaryTagInput,
} from "../../api/dietaryTagService";

import "./DietaryTag.css";

type LocalizedDietaryTag = DietaryTagData & {
  nameEn?: string;
  nameMr?: string;
  descriptionEn?: string | null;
  descriptionMr?: string | null;
};

const emptyForm: DietaryTagInput = {
  name: "",
  description: "",
  displayOrder: 1,
};

function DietaryTag() {
  const { t, i18n } = useTranslation();

  const [tags, setTags] = useState<DietaryTagData[]>([]);
  const [formData, setFormData] =
    useState<DietaryTagInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isMarathi = i18n.language.startsWith("mr");

  // Get language-wise dietary tag name
  const getTagName = (tag: DietaryTagData) => {
    const localizedTag = tag as LocalizedDietaryTag;

    if (isMarathi) {
      return localizedTag.nameMr || tag.name || "";
    }

    return localizedTag.nameEn || tag.name || "";
  };

  // Get language-wise dietary tag description
  const getTagDescription = (tag: DietaryTagData) => {
    const localizedTag = tag as LocalizedDietaryTag;

    if (isMarathi) {
      return localizedTag.descriptionMr || tag.description || "—";
    }

    return localizedTag.descriptionEn || tag.description || "—";
  };

  const loadTags = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDietaryTags();
      setTags(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading dietary tags:", err);
      setError(t("dietaryTag.loadFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTags();
  }, []);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: name === "displayOrder" ? Number(value) : value,
    }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  const handleAdd = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setError("");
    setMessage("");
    setShowForm(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: DietaryTagInput = {
      name: formData.name.trim(),
      description: formData.description?.trim() || null,
      displayOrder: Number(formData.displayOrder),
    };

    if (!payload.name) {
      setError(t("dietaryTag.requiredName"));
      return;
    }

    if (
      !Number.isInteger(payload.displayOrder) ||
      payload.displayOrder < 0
    ) {
      setError(t("dietaryTag.invalidDisplayOrder"));
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (editingId) {
        await updateDietaryTag(editingId, payload);
        setMessage(t("dietaryTag.updateSuccess"));
      } else {
        await createDietaryTag(payload);
        setMessage(t("dietaryTag.createSuccess"));
      }

      resetForm();
      await loadTags();
    } catch (err) {
      console.error("Error saving dietary tag:", err);
      setError(t("dietaryTag.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      setError("");
      setMessage("");

      const tag = await getDietaryTagById(id);

      // Keep original API values in the form.
      // Do not submit translated display values to the original fields.
      setFormData({
        name: tag.name ?? "",
        description: tag.description ?? "",
        displayOrder: tag.displayOrder ?? 1,
      });

      setEditingId(tag.id);
      setShowForm(true);
    } catch (err) {
      console.error("Error loading dietary tag:", err);
      setError(t("dietaryTag.detailsLoadFailed"));
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      t("dietaryTag.deleteConfirmation")
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await deleteDietaryTag(id);

      if (editingId === id) {
        resetForm();
      }

      setMessage(t("dietaryTag.deleteSuccess"));
      await loadTags();
    } catch (err) {
      console.error("Error deleting dietary tag:", err);
      setError(t("dietaryTag.deleteFailed"));
    }
  };

  return (
    <div className="dietary-management">
      <div className="dietary-header">
        <div>
          <h2>{t("dietaryTag.pageTitle")}</h2>
          <p>{t("dietaryTag.pageDescription")}</p>
        </div>

        <button
          type="button"
          className="dietary-primary-btn"
          onClick={handleAdd}
        >
          + {t("dietaryTag.addTag")}
        </button>
      </div>

      {message && (
        <div className="dietary-message">{message}</div>
      )}

      {error && (
        <div className="dietary-error">{error}</div>
      )}

      {showForm && (
        <form className="dietary-form" onSubmit={handleSubmit}>
          <h3>
            {editingId
              ? t("dietaryTag.updateTag")
              : t("dietaryTag.createTag")}
          </h3>

          <div className="dietary-form-grid">
            <div className="dietary-field">
              <label htmlFor="dietary-name">
                {t("dietaryTag.tagName")} *
              </label>

              <input
                id="dietary-name"
                name="name"
                type="text"
                placeholder={t("dietaryTag.namePlaceholder")}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="dietary-field">
              <label htmlFor="dietary-order">
                {t("dietaryTag.displayOrder")} *
              </label>

              <input
                id="dietary-order"
                name="displayOrder"
                type="number"
                min="0"
                step="1"
                value={formData.displayOrder}
                onChange={handleChange}
                required
              />
            </div>

            <div className="dietary-field dietary-description-field">
              <label htmlFor="dietary-description">
                {t("dietaryTag.description")}
              </label>

              <textarea
                id="dietary-description"
                name="description"
                placeholder={t("dietaryTag.descriptionPlaceholder")}
                value={formData.description ?? ""}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>

          <div className="dietary-form-actions">
            <button
              type="submit"
              className="dietary-primary-btn"
              disabled={saving}
            >
              {saving
                ? t("dietaryTag.saving")
                : editingId
                  ? t("dietaryTag.updateTag")
                  : t("dietaryTag.createTag")}
            </button>

            <button
              type="button"
              className="dietary-cancel-btn"
              onClick={resetForm}
              disabled={saving}
            >
              {t("dietaryTag.cancel")}
            </button>
          </div>
        </form>
      )}

      <div className="dietary-table-card">
        <div className="dietary-table-heading">
          <h3>{t("dietaryTag.tagList")}</h3>
          <span>
            {t("dietaryTag.totalTags", { count: tags.length })}
          </span>
        </div>

        {loading ? (
          <p className="dietary-state">
            {t("dietaryTag.loading")}
          </p>
        ) : tags.length === 0 ? (
          <p className="dietary-state">
            {t("dietaryTag.noTagsFound")}
          </p>
        ) : (
          <div className="dietary-table-wrapper">
            <table className="dietary-table">
              <thead>
                <tr>
                  <th>{t("dietaryTag.serialNumber")}</th>
                  <th>{t("dietaryTag.tagName")}</th>
                  <th>{t("dietaryTag.description")}</th>
                  <th>{t("dietaryTag.displayOrder")}</th>
                  <th>{t("dietaryTag.status")}</th>
                  <th>{t("dietaryTag.actions")}</th>
                </tr>
              </thead>

              <tbody>
                {tags.map((tag, index) => (
                  <tr key={tag.id}>
                    <td>{index + 1}</td>

                    <td>
                      <span className="dietary-tag-name">
                        {getTagName(tag)}
                      </span>
                    </td>

                    <td>{getTagDescription(tag)}</td>

                    <td>{tag.displayOrder}</td>

                    <td>
                      <span
                        className={
                          tag.isActive
                            ? "dietary-status active"
                            : "dietary-status inactive"
                        }
                      >
                        {tag.isActive
                          ? t("dietaryTag.active")
                          : t("dietaryTag.inactive")}
                      </span>
                    </td>

                    <td>
                      <div className="dietary-row-actions">
                        <button
                          type="button"
                          className="dietary-edit-btn"
                          onClick={() => void handleEdit(tag.id)}
                        >
                          {t("dietaryTag.edit")}
                        </button>

                        <button
                          type="button"
                          className="dietary-delete-btn"
                          onClick={() => void handleDelete(tag.id)}
                        >
                          {t("dietaryTag.delete")}
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

export default DietaryTag;
