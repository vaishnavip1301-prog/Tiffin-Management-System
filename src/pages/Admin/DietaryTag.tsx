
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
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

const emptyForm: DietaryTagInput = {
  name: "",
  description: "",
  displayOrder: 1,
};

function DietaryTag() {
  const [tags, setTags] = useState<DietaryTagData[]>([]);
  const [formData, setFormData] =
    useState<DietaryTagInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadTags = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDietaryTags();
      setTags(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading dietary tags:", err);
      setError("Failed to load dietary tags. Please check the API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTags();
  }, []);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
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

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const payload: DietaryTagInput = {
      name: formData.name.trim(),
      description: formData.description?.trim() || null,
      displayOrder: Number(formData.displayOrder),
    };

    if (!payload.name) {
      setError("Please enter the dietary tag name.");
      return;
    }

    if (
      !Number.isInteger(payload.displayOrder) ||
      payload.displayOrder < 0
    ) {
      setError("Display Order must be a whole number, 0 or greater.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (editingId) {
        await updateDietaryTag(editingId, payload);
        setMessage("Dietary tag updated successfully.");
      } else {
        await createDietaryTag(payload);
        setMessage("Dietary tag created successfully.");
      }

      resetForm();
      await loadTags();
    } catch (err) {
      console.error("Error saving dietary tag:", err);
      setError(
        "Failed to save dietary tag. Please check the API response."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      setError("");
      setMessage("");

      const tag = await getDietaryTagById(id);

      setFormData({
        name: tag.name ?? "",
        description: tag.description ?? "",
        displayOrder: tag.displayOrder ?? 1,
      });

      setEditingId(tag.id);
      setShowForm(true);
    } catch (err) {
      console.error("Error loading dietary tag:", err);
      setError("Failed to load dietary tag details.");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this dietary tag?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await deleteDietaryTag(id);

      if (editingId === id) {
        resetForm();
      }

      setMessage("Dietary tag deleted successfully.");
      await loadTags();
    } catch (err) {
      console.error("Error deleting dietary tag:", err);
      setError(
        "Failed to delete dietary tag. It may be in use by a menu item."
      );
    }
  };

  return (
    <div className="dietary-management">
      <div className="dietary-header">
        <div>
          <h2>Dietary Tags</h2>
          <p>Manage dietary preferences for your menu items.</p>
        </div>

        <button
          type="button"
          className="dietary-primary-btn"
          onClick={handleAdd}
        >
          + Add Dietary Tag
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
            {editingId ? "Update Dietary Tag" : "Create Dietary Tag"}
          </h3>

          <div className="dietary-form-grid">
            <div className="dietary-field">
              <label htmlFor="dietary-name">Tag Name *</label>
              <input
                id="dietary-name"
                name="name"
                type="text"
                placeholder="e.g. Gluten Free"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="dietary-field">
              <label htmlFor="dietary-order">Display Order *</label>
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
                Description
              </label>
              <textarea
                id="dietary-description"
                name="description"
                placeholder="Enter dietary tag description"
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
                ? "Saving..."
                : editingId
                  ? "Update Tag"
                  : "Add Tag"}
            </button>

            <button
              type="button"
              className="dietary-cancel-btn"
              onClick={resetForm}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="dietary-table-card">
        <div className="dietary-table-heading">
          <h3>Dietary Tag List</h3>
          <span>{tags.length} tags</span>
        </div>

        {loading ? (
          <p className="dietary-state">Loading dietary tags...</p>
        ) : tags.length === 0 ? (
          <p className="dietary-state">No dietary tags found.</p>
        ) : (
          <div className="dietary-table-wrapper">
            <table className="dietary-table">
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Tag Name</th>
                  <th>Description</th>
                  <th>Display Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {tags.map((tag, index) => (
                  <tr key={tag.id}>
                    <td>{index + 1}</td>
                    <td>
                      <span className="dietary-tag-name">
                        {tag.name}
                      </span>
                    </td>
                    <td>{tag.description || "—"}</td>
                    <td>{tag.displayOrder}</td>
                    <td>
                      <span
                        className={
                          tag.isActive
                            ? "dietary-status active"
                            : "dietary-status inactive"
                        }
                      >
                        {tag.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="dietary-row-actions">
                        <button
                          type="button"
                          className="dietary-edit-btn"
                          onClick={() => void handleEdit(tag.id)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="dietary-delete-btn"
                          onClick={() => void handleDelete(tag.id)}
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
      </div>
    </div>
  );
}

export default DietaryTag;
