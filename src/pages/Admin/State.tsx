
import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  getStates,
  getStateById,
  addState,
  updateState,
  deleteState,
  type State as StateData,
  type StateInput,
} from "../../api/stateService";
import "./State.css";

const emptyForm: StateInput = {
  name: "",
  code: "",
  isActive: true,
};

function State() {
  const [states, setStates] = useState<StateData[]>([]);
  const [formData, setFormData] = useState<StateInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [addId, setAddId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadStates = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getStates();
      setStates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading states:", err);
      setError("Unable to load states. Please check the API.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStates();
  }, [loadStates]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: name === "isActive" ? value === "true" : value,
    }));
  };

  const openAddForm = () => {
    setEditingId(null);
    setViewingId(null);
    setFormData({ ...emptyForm });
    setAddId("");
    setMessage("");
    setError("");
    setShowForm(true);
  };

  const handleEdit = async (id: string) => {
    try {
      setError("");
      setMessage("");

      const state = await getStateById(id);

      setFormData({
        name: state.name,
        code: state.code,
        isActive: state.isActive,
      });

      setEditingId(id);
      setViewingId(null);
      setShowForm(true);
    } catch (err) {
      console.error("Error fetching state:", err);
      setError("Unable to load state details.");
    }
  };

  const handleView = async (id: string) => {
    try {
      setError("");
      setMessage("");

      const state = await getStateById(id);

      setFormData({
        name: state.name,
        code: state.code,
        isActive: state.isActive,
      });

      setEditingId(null);
      setViewingId(id);
      setShowForm(true);
    } catch (err) {
      console.error("Error fetching state:", err);
      setError("Unable to load state details.");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const payload: StateInput = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        isActive: formData.isActive,
      };

      if (!payload.name || !payload.code) {
        setError("Please enter both State Name and State Code.");
        return;
      }

      if (editingId) {
        await updateState(editingId, payload);
        setMessage("State updated successfully.");
      } else {
        const stateId = addId.trim();

        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        if (!stateId) {
          setError("Please enter the required State ID.");
          return;
        }

        if (!uuidRegex.test(stateId)) {
          setError(
            "Please enter a valid UUID. Example: 550e8400-e29b-41d4-a716-446655440000"
          );
          return;
        }

        await addState(stateId, {
          name: payload.name,
          code: payload.code,
        } as StateInput);

        setMessage("State added successfully.");
      }

      setShowForm(false);
      setEditingId(null);
      setViewingId(null);
      setFormData({ ...emptyForm });

      await loadStates();
    } catch (err) {
      console.error("Error saving state:", err);
      setError("Unable to save state. Please verify the API request.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this state?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await deleteState(id);
      setMessage("State deleted successfully.");
      await loadStates();
    } catch (err) {
      console.error("Error deleting state:", err);
      setError("Unable to delete state.");
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setViewingId(null);
    setFormData({ ...emptyForm });
  };

  return (
    <div className="state-management">
      <div className="state-header">
        <div>
          <h2>State Management</h2>
          <p>Manage states and their details</p>
        </div>

        <div className="state-header-actions">
          <button
            type="button"
            className="state-refresh-btn"
            onClick={() => void loadStates()}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>

          <button
            type="button"
            className="state-add-btn"
            onClick={openAddForm}
          >
            + Add State
          </button>
        </div>
      </div>

      {message && (
        <div className="state-message state-success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="state-message state-error-message">
          {error}
        </div>
      )}

      {showForm && (
        <div className="state-card">
          <div className="state-card-header">
            <div>
              <h3>
                {viewingId
                  ? "State Details"
                  : editingId
                    ? "Update State"
                    : "Add State"}
              </h3>
              <p>
                {viewingId
                  ? "View state information"
                  : "Enter the state information below"}
              </p>
            </div>
          </div>

          <form className="state-form" onSubmit={handleSubmit}>
            {!editingId && !viewingId && (
              <div className="state-form-group">
                <label htmlFor="addId">Required API ID (UUID)</label>
                <input
                  id="addId"
                  name="addId"
                  type="text"
                  value={addId}
                  onChange={(e) => setAddId(e.target.value)}
                  placeholder="550e8400-e29b-41d4-a716-446655440000"
                  required
                />
              </div>
            )}

            <div className="state-form-grid">
              <div className="state-form-group">
                <label htmlFor="stateName">State Name</label>
                <input
                  id="stateName"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter state name"
                  maxLength={100}
                  required
                  disabled={Boolean(viewingId)}
                />
              </div>

              <div className="state-form-group">
                <label htmlFor="stateCode">State Code</label>
                <input
                  id="stateCode"
                  name="code"
                  type="text"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g. MH"
                  maxLength={10}
                  required
                  disabled={Boolean(viewingId)}
                />
              </div>

              <div className="state-form-group">
                <label htmlFor="stateActive">Status</label>
                <select
                  id="stateActive"
                  name="isActive"
                  value={String(formData.isActive)}
                  onChange={handleChange}
                  disabled={Boolean(viewingId)}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div className="state-form-actions">
              <button
                type="button"
                className="state-cancel-btn"
                onClick={closeForm}
              >
                {viewingId ? "Close" : "Cancel"}
              </button>

              {!viewingId && (
                <button
                  type="submit"
                  className="state-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update State"
                      : "Save State"}
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="state-card">
        <div className="state-card-header">
          <div>
            <h3>States List</h3>
            <p>Total states: {states.length}</p>
          </div>
        </div>

        {loading ? (
          <div className="state-loading">Loading states...</div>
        ) : states.length === 0 ? (
          <div className="state-empty">
            <strong>No states found</strong>
            <p>States will appear here when available from the API.</p>
          </div>
        ) : (
          <div className="state-table-wrapper">
            <table className="state-table">
              <thead>
                <tr>
                  <th>State Name</th>
                  <th>State Code</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {states.map((state) => (
                  <tr key={state.id}>
                    <td className="state-name">{state.name}</td>
                    <td>{state.code}</td>
                    <td>
                      <span
                        className={`state-status ${
                          state.isActive ? "active" : "inactive"
                        }`}
                      >
                        {state.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      {state.createdAtUtc
                        ? new Date(state.createdAtUtc).toLocaleDateString()
                        : "—"}
                    </td>
                    <td>
                      <div className="state-action-buttons">
                        {/* <button
                          type="button"
                          className="state-view-btn"
                          onClick={() => void handleView(state.id)}
                        >
                          View
                        </button> */}

                        <button
                          type="button"
                          className="state-edit-btn"
                          onClick={() => void handleEdit(state.id)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="state-delete-btn"
                          onClick={() => void handleDelete(state.id)}
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

export default State;
