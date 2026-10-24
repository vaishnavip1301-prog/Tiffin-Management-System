import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
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

const emptyForm: MealTypeInput = {
  name: "",
  description: "",
  displayOrder: 1,
};

function MealTypePage() {
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

  const loadMealTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMealTypes();

      setMealTypes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Get Meal Types error:", err);
      setError("Failed to load meal types. Please check the API.");
    } finally {
      setLoading(false);
    }
  }, []);

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
      setError("Please enter a Meal Type name.");
      return;
    }

    if (!Number.isInteger(displayOrder) || displayOrder < 1) {
      setError("Display Order must be a positive whole number.");
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
        setMessage("Meal Type updated successfully.");
      } else {
        await createMealType(payload);
        resetForm(false);
        setMessage("Meal Type created successfully.");
      }

      await loadMealTypes();
    } catch (err) {
      console.error("Save Meal Type error:", err);
      setError("Failed to save Meal Type. Please check the API response.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: MealTypeData) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}"?`
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

      setMessage("Meal Type deleted successfully.");
    } catch (err) {
      console.error("Delete Meal Type error:", err);
      setError(
        "Failed to delete Meal Type. It may be in use by a menu item."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const filteredMealTypes = mealTypes
    .filter((item) =>
      `${item.name} ${item.description ?? ""}`
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase())
    )
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="container-fluid py-4 meal-type-page">
      {/* Page heading and compact count */}
      <div className="meal-type-header d-flex justify-content-between align-items-center gap-3 mb-4">
        <div className="meal-type-heading">
          

          <h2 className="meal-type-page-title">
            Meal Types
          </h2>

          <p className="text-muted mb-0">
            Create and manage breakfast, lunch, dinner and other meal types.
          </p>
        </div>

        <div className="meal-type-count">
          <div className="meal-type-count-icon">
            <i className="bi bi-clock-history" />
          </div>

          <div className="meal-type-count-info">
            <span>Total Meal Types</span>
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
            {editingMealType ? "Update Meal Type" : "Create Meal Type"}
          </h5>

          <p className="text-muted mb-4">
            {editingMealType
              ? "Update the meal type information below."
              : "Fill in the details below to create a meal type."}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {editingMealType && (
                <div className="col-12">
                  <label className="form-label" htmlFor="mealTypeId">
                    Meal Type ID
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
                  Meal Type Name{" "}
                  <span className="meal-type-required">*</span>
                </label>

                <input
                  id="mealTypeName"
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Breakfast"
                  maxLength={100}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label" htmlFor="displayOrder">
                  Display Order{" "}
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
                  Smaller numbers appear first.
                </small>
              </div>

              <div className="col-12">
                <label
                  className="form-label"
                  htmlFor="mealTypeDescription"
                >
                  Description
                </label>

                <textarea
                  id="mealTypeDescription"
                  className="form-control"
                  name="description"
                  value={formData.description ?? ""}
                  onChange={handleChange}
                  placeholder="Enter meal type description"
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
                    ? "Saving..."
                    : editingMealType
                      ? "Update Meal Type"
                      : "Create Meal Type"}
                </button>

                {editingMealType && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary meal-type-cancel-btn"
                    onClick={() => resetForm()}
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

      {/* Meal Types list */}
      <div className="meal-type-list-heading d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
        <div>
          <h5 className="meal-type-section-title mb-1">
            All Meal Types
          </h5>

          <p className="text-muted mb-0">
            View, search and manage your meal type records.
          </p>
        </div>

        <div className="meal-type-list-tools">
          <input
            type="search"
            className="form-control"
            placeholder="Search meal types..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label="Search meal types"
          />

          <button
            type="button"
            className="btn btn-outline-secondary meal-type-refresh-btn"
            onClick={() => void loadMealTypes()}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise me-1" />
            {loading ? "Loading..." : "Refresh"}
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
              <span className="visually-hidden">Loading...</span>
            </div>

            <p className="text-muted mt-3 mb-0">
              Loading meal types...
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 meal-type-table">
              <thead>
                <tr>
                  <th>Meal Type</th>
                  <th>Description</th>
                  <th>Display Order</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredMealTypes.length > 0 ? (
                  filteredMealTypes.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="meal-type-name-cell">
                          <span className="meal-type-avatar">
                            {item.name?.charAt(0)?.toUpperCase() || "M"}
                          </span>

                          <span className="fw-semibold">
                            {item.name}
                          </span>
                        </div>
                      </td>

                      <td className="meal-type-description">
                        {item.description || "-"}
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
                          <i className="bi bi-pencil me-1" />
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm meal-type-delete-btn"
                          onClick={() => void handleDelete(item)}
                          disabled={deletingId !== null || saving}
                        >
                          <i className="bi bi-trash me-1" />
                          {deletingId === item.id ? "Deleting..." : "Delete"}
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
                        ? "No matching meal types found."
                        : "No meal types found. Add your first meal type above."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="meal-type-table-footer mt-3">
        Showing <strong>{filteredMealTypes.length}</strong> of{" "}
        <strong>{mealTypes.length}</strong> meal types
      </div>
    </div>
  );
}

export default MealTypePage;
