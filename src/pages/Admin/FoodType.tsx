
import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useTranslation } from "react-i18next";

import {
  getFoodTypes,
  getFoodTypeById,
  createFoodType,
  updateFoodType,
  deleteFoodType,
  type FoodType,
  type FoodTypeInput,
} from "../../api/foodTypeService";

import "./FoodType.css";

type LocalizedFoodType = FoodType & {
  nameEn?: string;
  nameMr?: string;
  descriptionEn?: string | null;
  descriptionMr?: string | null;
};

const emptyForm: FoodTypeInput = {
  name: "",
  description: "",
  displayOrder: 1,
};

function FoodTypePage() {
  const { t, i18n } = useTranslation();

  const isMarathi = i18n.language.startsWith("mr");

  const [foodTypes, setFoodTypes] = useState<FoodType[]>([]);
  const [formData, setFormData] = useState<FoodTypeInput>({
    ...emptyForm,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getFoodTypeName = (item: FoodType) => {
    const localizedItem = item as LocalizedFoodType;

    if (isMarathi) {
      return localizedItem.nameMr || item.name || "";
    }

    return localizedItem.nameEn || item.name || "";
  };

  const getFoodTypeDescription = (item: FoodType) => {
    const localizedItem = item as LocalizedFoodType;

    if (isMarathi) {
      return localizedItem.descriptionMr || item.description || "—";
    }

    return localizedItem.descriptionEn || item.description || "—";
  };

  const loadFoodTypes = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getFoodTypes();
      setFoodTypes(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error("Food Type GET error:", err);
      setError(t("foodType.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadFoodTypes();
  }, [loadFoodTypes]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "displayOrder"
          ? value === ""
            ? 0
            : Number(value)
          : value,
    }));
  };

  const resetForm = () => {
    setFormData({ ...emptyForm });
    setEditingId(null);
    setShowForm(false);
  };

  const handleCreate = () => {
    setMessage("");
    setError("");
    setEditingId(null);

    setFormData({
      ...emptyForm,
      displayOrder: foodTypes.length + 1,
    });

    setShowForm(true);
  };

  const handleEdit = async (id: string) => {
    setMessage("");
    setError("");

    try {
      const item = await getFoodTypeById(id);

      // Keep original API values in the form.
      setFormData({
        name: item.name ?? "",
        description: item.description ?? "",
        displayOrder: item.displayOrder ?? 1,
      });

      setEditingId(item.id);
      setShowForm(true);
    } catch (err) {
      console.error("Food Type GET by ID error:", err);
      setError(t("foodType.detailsLoadFailed"));
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const name = formData.name.trim();
    const displayOrder = Number(formData.displayOrder);

    if (!name) {
      setError(t("foodType.requiredName"));
      return;
    }

    if (!Number.isInteger(displayOrder) || displayOrder < 1) {
      setError(t("foodType.invalidDisplayOrder"));
      return;
    }

    const payload: FoodTypeInput = {
      name,
      description: formData.description?.trim() || null,
      displayOrder,
    };

    setSaving(true);

    try {
      if (editingId) {
        await updateFoodType(editingId, payload);
        setMessage(t("foodType.updateSuccess"));
      } else {
        await createFoodType(payload);
        setMessage(t("foodType.createSuccess"));
      }

      resetForm();
      await loadFoodTypes();
    } catch (err) {
      console.error("Food Type save error:", err);
      setError(t("foodType.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const confirmed = window.confirm(
      t("foodType.deleteConfirmation", { name })
    );

    if (!confirmed) return;

    setMessage("");
    setError("");
    setDeletingId(id);

    try {
      await deleteFoodType(id);
      setMessage(t("foodType.deleteSuccess"));

      if (editingId === id) {
        resetForm();
      }

      await loadFoodTypes();
    } catch (err) {
      console.error("Food Type DELETE error:", err);
      setError(t("foodType.deleteFailed"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="food-type-page">
      <header className="food-type-header">
        <div>
          <h2>{t("foodType.pageTitle")}</h2>
          <p>{t("foodType.pageDescription")}</p>
        </div>

        <button
          type="button"
          className="food-type-create-btn"
          onClick={handleCreate}
        >
          <i className="bi bi-plus-lg" aria-hidden="true" />
          <span>{t("foodType.createButton")}</span>
        </button>
      </header>

      {message && (
        <div className="food-type-alert success" role="status">
          {message}
        </div>
      )}

      {error && (
        <div className="food-type-alert error" role="alert">
          {error}
        </div>
      )}

      {showForm && (
        <section className="food-type-form-card">
          <div className="food-type-form-heading">
            <h3>
              {editingId
                ? t("foodType.editTitle")
                : t("foodType.createTitle")}
            </h3>

            <button
              type="button"
              className="food-type-close-btn"
              onClick={resetForm}
              disabled={saving}
              aria-label={t("foodType.closeForm")}
              title={t("foodType.closeForm")}
            >
              <i className="bi bi-x-lg" aria-hidden="true" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="food-type-form-grid">
              <div className="food-type-field">
                <label htmlFor="foodTypeName">
                  {t("foodType.name")} *
                </label>

                <input
                  id="foodTypeName"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t("foodType.namePlaceholder")}
                  maxLength={100}
                  required
                />
              </div>

              <div className="food-type-field">
                <label htmlFor="foodTypeOrder">
                  {t("foodType.displayOrder")} *
                </label>

                <input
                  id="foodTypeOrder"
                  name="displayOrder"
                  type="number"
                  min="1"
                  step="1"
                  value={formData.displayOrder}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="food-type-field full-width">
                <label htmlFor="foodTypeDescription">
                  {t("foodType.description")}
                </label>

                <textarea
                  id="foodTypeDescription"
                  name="description"
                  value={formData.description ?? ""}
                  onChange={handleChange}
                  placeholder={t("foodType.descriptionPlaceholder")}
                  rows={3}
                  maxLength={500}
                />
              </div>
            </div>

            <div className="food-type-form-actions">
              <button
                type="button"
                className="food-type-cancel-btn"
                onClick={resetForm}
                disabled={saving}
              >
                {t("foodType.cancel")}
              </button>

              <button
                type="submit"
                className="food-type-submit-btn"
                disabled={saving}
              >
                {saving
                  ? t("foodType.saving")
                  : editingId
                    ? t("foodType.updateButton")
                    : t("foodType.createButton")}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="food-type-table-card">
        <div className="food-type-table-heading">
          <h3>{t("foodType.tableTitle")}</h3>

          <span>
            {t("foodType.recordCount", {
              count: foodTypes.length,
            })}
          </span>
        </div>

        {loading ? (
          <div className="food-type-loading" role="status">
            <span
              className="food-type-spinner"
              aria-hidden="true"
            />
            {t("foodType.loading")}
          </div>
        ) : (
          <div className="food-type-table-wrapper">
            <table className="food-type-table">
              <thead>
                <tr>
                  <th scope="col">{t("foodType.serialNumber")}</th>
                  <th scope="col">{t("foodType.name")}</th>
                  <th scope="col">{t("foodType.description")}</th>
                  <th scope="col">{t("foodType.displayOrder")}</th>
                  <th scope="col">{t("foodType.status")}</th>
                  <th scope="col">{t("foodType.actions")}</th>
                </tr>
              </thead>

              <tbody>
                {foodTypes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="food-type-empty">
                      {t("foodType.noRecords")}
                    </td>
                  </tr>
                ) : (
                  [...foodTypes]
                    .sort(
                      (a, b) => a.displayOrder - b.displayOrder
                    )
                    .map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>

                        <td className="food-type-name">
                          {getFoodTypeName(item)}
                        </td>

                        <td className="food-type-description">
                          {getFoodTypeDescription(item)}
                        </td>

                        <td>{item.displayOrder}</td>

                        <td>
                          <span
                            className={`food-type-status ${
                              item.isActive ? "active" : "inactive"
                            }`}
                          >
                            <span
                              className="food-type-status-dot"
                              aria-hidden="true"
                            />

                            {item.isActive
                              ? t("foodType.active")
                              : t("foodType.inactive")}
                          </span>
                        </td>

                        <td>
                          <div className="food-type-actions">
                            <button
                              type="button"
                              className="food-type-edit-btn"
                              onClick={() => void handleEdit(item.id)}
                              title={t("foodType.editItem", {
                                name: getFoodTypeName(item),
                              })}
                              disabled={saving || deletingId !== null}
                            >
                              {t("foodType.edit")}
                            </button>

                            <button
                              type="button"
                              className="food-type-delete-btn"
                              onClick={() =>
                                void handleDelete(
                                  item.id,
                                  getFoodTypeName(item)
                                )
                              }
                              title={t("foodType.deleteItem", {
                                name: getFoodTypeName(item),
                              })}
                              disabled={deletingId !== null || saving}
                            >
                              {deletingId === item.id
                                ? t("foodType.deleting")
                                : t("foodType.delete")}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default FoodTypePage;
