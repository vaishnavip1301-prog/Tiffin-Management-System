
import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useTranslation } from "react-i18next";

import {
  getMealTypes,
  createMealType,
  updateMealType,
  deleteMealType,
} from "../../api/mealTypeService";

import type {
  MealType as MealTypeData,
  MealTypeInput,
} from "../../api/mealTypeService";

import "./MealType.css";

type LocalizedMealType = MealTypeData & {
  nameEn?: string;
  nameMr?: string;
  descriptionEn?: string | null;
  descriptionMr?: string | null;
};

const emptyForm: MealTypeInput = {
  name: "",
  description: "",
  displayOrder: 1,
};

function MealTypePage() {
  const { t, i18n } = useTranslation();

  const isMarathi = i18n.language.startsWith("mr");

  const [mealTypes, setMealTypes] = useState<MealTypeData[]>([]);
  const [formData, setFormData] = useState<MealTypeInput>({
    ...emptyForm,
  });
  const [editingMealType, setEditingMealType] =
    useState<MealTypeData | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const getMealTypeName = (item: MealTypeData) => {
    const localizedItem = item as LocalizedMealType;

    if (isMarathi) {
      return localizedItem.nameMr || item.name || "";
    }

    return localizedItem.nameEn || item.name || "";
  };

  const getMealTypeDescription = (item: MealTypeData) => {
    const localizedItem = item as LocalizedMealType;

    if (isMarathi) {
      return localizedItem.descriptionMr || item.description || "—";
    }

    return localizedItem.descriptionEn || item.description || "—";
  };

  const loadMealTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMealTypes();

      setMealTypes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Get Meal Types error:", err);
      setError(t("mealType.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadMealTypes();
  }, [loadMealTypes]);

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

  const resetForm = (clearMessage = true) => {
    setFormData({ ...emptyForm });
    setEditingMealType(null);
    setError("");

    if (clearMessage) {
      setMessage("");
    }
  };

  const handleEdit = (item: MealTypeData) => {
    setEditingMealType(item);

    // Keep original API values in the edit form.
    setFormData({
      name: item.name ?? "",
      description: item.description ?? "",
      displayOrder: item.displayOrder ?? 1,
    });

    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = formData.name.trim();
    const displayOrder = Number(formData.displayOrder);

    if (!name) {
      setError(t("mealType.requiredName"));
      return;
    }

    if (!Number.isInteger(displayOrder) || displayOrder < 1) {
      setError(t("mealType.invalidDisplayOrder"));
      return;
    }

    const payload: MealTypeInput = {
      name,
      description: formData.description?.trim() || null,
      displayOrder,
    };

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (editingMealType) {
        await updateMealType(editingMealType.id, payload);
        resetForm(false);
        setMessage(t("mealType.updateSuccess"));
      } else {
        await createMealType(payload);
        resetForm(false);
        setMessage(t("mealType.createSuccess"));
      }

      await loadMealTypes();
    } catch (err) {
      console.error("Save Meal Type error:", err);
      setError(t("mealType.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: MealTypeData) => {
    const confirmed = window.confirm(
      t("mealType.deleteConfirmation", {
        name: getMealTypeName(item),
      })
    );

    if (!confirmed) return;

    try {
      setDeletingId(item.id);
      setError("");
      setMessage("");

      await deleteMealType(item.id);

      setMealTypes((previous) =>
        previous.filter((mealType) => mealType.id !== item.id)
      );

      if (editingMealType?.id === item.id) {
        resetForm();
      }

      setMessage(t("mealType.deleteSuccess"));
    } catch (err) {
      console.error("Delete Meal Type error:", err);
      setError(t("mealType.deleteFailed"));
    } finally {
      setDeletingId(null);
    }
  };

  const filteredMealTypes = mealTypes
    .filter((item) =>
      `${getMealTypeName(item)} ${getMealTypeDescription(item)}`
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase())
    )
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="container-fluid py-4 meal-type-page">
      {/* Page heading and count */}
      <div className="meal-type-header d-flex justify-content-between align-items-center gap-3 mb-4">
        <div className="meal-type-heading">
          <h2 className="meal-type-page-title">
            {t("mealType.pageTitle")}
          </h2>

          <p className="text-muted mb-0">
            {t("mealType.pageDescription")}
          </p>
        </div>

        <div className="meal-type-count">
          <div className="meal-type-count-icon">
            <i className="bi bi-clock-history" />
          </div>

          <div className="meal-type-count-info">
            <span>{t("mealType.totalMealTypes")}</span>
            <strong>{mealTypes.length}</strong>
          </div>
        </div>
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
      <div className="card meal-type-card mb-4">
        <div className="card-body p-4">
          <h5 className="meal-type-section-title">
            {editingMealType
              ? t("mealType.updateTitle")
              : t("mealType.createTitle")}
          </h5>

          <p className="text-muted mb-4">
            {editingMealType
              ? t("mealType.updateDescription")
              : t("mealType.createDescription")}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {editingMealType && (
                <div className="col-12">
                  <label className="form-label" htmlFor="mealTypeId">
                    {t("mealType.mealTypeId")}
                  </label>

                  <input
                    id="mealTypeId"
                    className="form-control"
                    value={editingMealType.id}
                    disabled
                    readOnly
                  />
                </div>
              )}

              <div className="col-md-6">
                <label className="form-label" htmlFor="mealTypeName">
                  {t("mealType.name")}{" "}
                  <span className="meal-type-required">*</span>
                </label>

                <input
                  id="mealTypeName"
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t("mealType.namePlaceholder")}
                  maxLength={100}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="displayOrder">
                  {t("mealType.displayOrder")}{" "}
                  <span className="meal-type-required">*</span>
                </label>

                <input
                  id="displayOrder"
                  type="number"
                  className="form-control"
                  name="displayOrder"
                  value={formData.displayOrder}
                  onChange={handleChange}
                  min={1}
                  step={1}
                  required
                />

                <small className="text-muted">
                  {t("mealType.orderHint")}
                </small>
              </div>

              <div className="col-12">
                <label
                  className="form-label"
                  htmlFor="mealTypeDescription"
                >
                  {t("mealType.description")}
                </label>

                <textarea
                  id="mealTypeDescription"
                  className="form-control"
                  name="description"
                  value={formData.description ?? ""}
                  onChange={handleChange}
                  placeholder={t("mealType.descriptionPlaceholder")}
                  rows={3}
                  maxLength={500}
                />
              </div>

              <div className="col-12 d-flex flex-wrap gap-2">
                <button
                  type="submit"
                  className="btn meal-type-primary-btn"
                  disabled={saving}
                >
                  {saving
                    ? t("mealType.saving")
                    : editingMealType
                      ? t("mealType.updateButton")
                      : t("mealType.createButton")}
                </button>

                {editingMealType && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary meal-type-cancel-btn"
                    onClick={() => resetForm()}
                    disabled={saving}
                  >
                    {t("mealType.cancel")}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Meal Types list */}
      <div className="meal-type-list-heading d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
        <div>
          <h5 className="meal-type-section-title mb-1">
            {t("mealType.allMealTypes")}
          </h5>

          <p className="text-muted mb-0">
            {t("mealType.listDescription")}
          </p>
        </div>

        <div className="meal-type-list-tools">
          <input
            type="search"
            className="form-control"
            placeholder={t("mealType.searchPlaceholder")}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label={t("mealType.searchPlaceholder")}
          />

          <button
            type="button"
            className="btn btn-outline-secondary meal-type-refresh-btn"
            onClick={() => void loadMealTypes()}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise me-1" />
            {loading ? t("mealType.loading") : t("mealType.refresh")}
          </button>
        </div>
      </div>

      <div className="card meal-type-card">
        {loading ? (
          <div className="card-body text-center py-5">
            <div
              className="spinner-border meal-type-spinner"
              role="status"
            >
              <span className="visually-hidden">
                {t("mealType.loading")}
              </span>
            </div>

            <p className="text-muted mt-3 mb-0">
              {t("mealType.loading")}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 meal-type-table">
              <thead>
                <tr>
                  <th>{t("mealType.name")}</th>
                  <th>{t("mealType.description")}</th>
                  <th>{t("mealType.displayOrder")}</th>
                  <th>{t("mealType.actions")}</th>
                </tr>
              </thead>

              <tbody>
                {filteredMealTypes.length > 0 ? (
                  filteredMealTypes.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="meal-type-name-cell">
                          <span className="meal-type-avatar">
                            {getMealTypeName(item)
                              .charAt(0)
                              .toUpperCase() || "M"}
                          </span>

                          <span className="fw-semibold">
                            {getMealTypeName(item)}
                          </span>
                        </div>
                      </td>

                      <td className="meal-type-description">
                        {getMealTypeDescription(item)}
                      </td>

                      <td>
                        <span className="meal-type-order">
                          {item.displayOrder}
                        </span>
                      </td>

                      <td className="text-nowrap">
                        <button
                          type="button"
                          className="btn btn-sm meal-type-edit-btn me-2"
                          onClick={() => handleEdit(item)}
                          disabled={saving || deletingId !== null}
                        >
                          {t("mealType.edit")}
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm meal-type-delete-btn"
                          onClick={() => void handleDelete(item)}
                          disabled={deletingId !== null || saving}
                        >
                          {deletingId === item.id
                            ? t("mealType.deleting")
                            : t("mealType.delete")}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-5 text-muted"
                    >
                      {searchTerm
                        ? t("mealType.noMatchingRecords")
                        : t("mealType.noRecords")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="meal-type-table-footer mt-3">
        {t("mealType.showingRecords", {
          filtered: filteredMealTypes.length,
          total: mealTypes.length,
        })}
      </div>
    </div>
  );
}

export default MealTypePage;
