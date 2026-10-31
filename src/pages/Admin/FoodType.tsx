import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
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

const emptyForm: FoodTypeInput = {
  name: "",
  description: "",
  displayOrder: 1,
};

function FoodTypePage() {
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

  const loadFoodTypes = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getFoodTypes();
      setFoodTypes(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      console.error("Food Type GET error:", err);
      setError(
        "Failed to load food types. Please check the API connection."
      );
    } finally {
      setLoading(false);
    }
  }, []);

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

      setFormData({
        name: item.name ?? "",
        description: item.description ?? "",
        displayOrder: item.displayOrder ?? 1,
      });

      setEditingId(item.id);
      setShowForm(true);
    } catch (err) {
      console.error("Food Type GET by ID error:", err);
      setError("Failed to load the selected food type.");
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
      setError("Food Type Name is required.");
      return;
    }

    if (
      !Number.isInteger(displayOrder) ||
      displayOrder < 1
    ) {
      setError(
        "Display Order must be a positive whole number."
      );
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
        setMessage("Food Type updated successfully.");
      } else {
        await createFoodType(payload);
        setMessage("Food Type created successfully.");
      }

      resetForm();
      await loadFoodTypes();
    } catch (err) {
      console.error("Food Type save error:", err);
      setError(
        "Failed to save Food Type. Please check the API response."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (
    id: string,
    name: string
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (!confirmed) return;

    setMessage("");
    setError("");
    setDeletingId(id);

    try {
      await deleteFoodType(id);
      setMessage("Food Type deleted successfully.");

      if (editingId === id) {
        resetForm();
      }

      await loadFoodTypes();
    } catch (err) {
      console.error("Food Type DELETE error:", err);
      setError(
        "Failed to delete Food Type. Please check the API response."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="food-type-page">
      <header className="food-type-header">
        <div>
          <h2>Food Type Management</h2>
          <p>
            Manage food classifications for Aapla Dabba.
          </p>
        </div>

        <button
          type="button"
          className="food-type-create-btn"
          onClick={handleCreate}
        >
          <i
            className="bi bi-plus-lg"
            aria-hidden="true"
          />
          <span>Create Food Type</span>
        </button>
      </header>

      {message && (
        <div
          className="food-type-alert success"
          role="status"
        >
          {message}
        </div>
      )}

      {error && (
        <div
          className="food-type-alert error"
          role="alert"
        >
          {error}
        </div>
      )}

      {showForm && (
        <section className="food-type-form-card">
          <div className="food-type-form-heading">
            <h3>
              {editingId
                ? "Edit Food Type"
                : "Create Food Type"}
            </h3>

            <button
              type="button"
              className="food-type-close-btn"
              onClick={resetForm}
              disabled={saving}
              aria-label="Close form"
              title="Close"
            >
              <i
                className="bi bi-x-lg"
                aria-hidden="true"
              />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="food-type-form-grid">
              <div className="food-type-field">
                <label htmlFor="foodTypeName">
                  Food Type Name *
                </label>

                <input
                  id="foodTypeName"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Vegetarian"
                  maxLength={100}
                  required
                />
              </div>

              <div className="food-type-field">
                <label htmlFor="foodTypeOrder">
                  Display Order *
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
                  Description
                </label>

                <textarea
                  id="foodTypeDescription"
                  name="description"
                  value={formData.description ?? ""}
                  onChange={handleChange}
                  placeholder="Enter a short description"
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
                Cancel
              </button>

              <button
                type="submit"
                className="food-type-submit-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Food Type"
                    : "Create Food Type"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="food-type-table-card">
        <div className="food-type-table-heading">
          <h3>Food Types</h3>

          <span>
            {foodTypes.length}{" "}
            {foodTypes.length === 1 ? "record" : "records"}
          </span>
        </div>

        {loading ? (
          <div
            className="food-type-loading"
            role="status"
          >
            <span
              className="food-type-spinner"
              aria-hidden="true"
            />
            Loading food types...
          </div>
        ) : (
          <div className="food-type-table-wrapper">
            <table className="food-type-table">
              <thead>
                <tr>
                  <th scope="col">Sr. No.</th>
                  <th scope="col">Food Type</th>
                  <th scope="col">Description</th>
                  <th scope="col">Display Order</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>

              <tbody>
                {foodTypes.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="food-type-empty"
                    >
                      No food types found.
                    </td>
                  </tr>
                ) : (
                  [...foodTypes]
                    .sort(
                      (a, b) =>
                        a.displayOrder - b.displayOrder
                    )
                    .map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>

                        <td className="food-type-name">
                          {item.name}
                        </td>

                        <td className="food-type-description">
                          {item.description?.trim() || "—"}
                        </td>

                        <td>{item.displayOrder}</td>

                        <td>
                          <span
                            className={`food-type-status ${
                              item.isActive
                                ? "active"
                                : "inactive"
                            }`}
                          >
                            <span
                              className="food-type-status-dot"
                              aria-hidden="true"
                            />

                            {item.isActive
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </td>

                        <td>
                        <div className="food-type-actions">
                          <button
                            type="button"
                            className="food-type-edit-btn"
                            onClick={() => void handleEdit(item.id)}
                            title={`Edit ${item.name}`}
                            disabled={saving || deletingId !== null}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="food-type-delete-btn"
                            onClick={() =>
                              void handleDelete(item.id, item.name)
                            }
                            title={`Delete ${item.name}`}
                            disabled={deletingId !== null || saving}
                          >
                            {deletingId === item.id ? "Deleting..." : "Delete"}
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