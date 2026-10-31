
import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
  getCities,
  getCityById,
  addCity,
  updateCity,
  deleteCity,
  type City,
  type CityInput,
} from "../../api/cityService";

import {
  getStates,
  type State,
} from "../../api/stateService";

import "./City.css";

const emptyForm: CityInput = {
  name: "",
  stateId: "",
  isActive: true,
};

function CityPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [formData, setFormData] = useState<CityInput>(emptyForm);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filterState, setFilterState] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load States and Cities independently.
  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const stateData = await getStates();
      setStates(Array.isArray(stateData) ? stateData : []);
    } catch (err) {
      console.error("Error loading states:", err);
      setStates([]);
      setError("Unable to load states. Please check the States API.");
    }

    try {
      const cityData = await getCities();
      setCities(Array.isArray(cityData) ? cityData : []);
    } catch (err) {
      console.error("Error loading cities:", err);
      setCities([]);
      setError("Unable to load cities. Please check the Cities API endpoint.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const resetForm = () => {
    setFormData({ ...emptyForm });
    setEditingId(null);
    setViewingId(null);
  };

  const openAddForm = () => {
    resetForm();
    setMessage("");
    setError("");
    setShowForm(true);
  };

  const openEditForm = async (id: string) => {
    setActionId(id);
    setMessage("");
    setError("");

    try {
      const city = await getCityById(id);

      setFormData({
        name: city.name ?? "",
        stateId: city.stateId ?? "",
        isActive: city.isActive ?? true,
      });

      setEditingId(id);
      setViewingId(null);
      setShowForm(true);
    } catch (err) {
      console.error("Error fetching city:", err);
      setError("Unable to load city details.");
    } finally {
      setActionId(null);
    }
  };

  const handleView = async (id: string) => {
    setActionId(id);
    setMessage("");
    setError("");

    try {
      const city = await getCityById(id);

      setFormData({
        name: city.name ?? "",
        stateId: city.stateId ?? "",
        isActive: city.isActive ?? true,
      });

      setViewingId(id);
      setEditingId(null);
      setShowForm(true);
    } catch (err) {
      console.error("Error viewing city:", err);
      setError("Unable to load city details.");
    } finally {
      setActionId(null);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setError("Please enter a city name.");
      return;
    }

    if (!formData.stateId) {
      setError("Please select a state.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload: CityInput = {
        name: formData.name.trim(),
        stateId: formData.stateId,
        isActive: formData.isActive,
      };

      if (editingId) {
        await updateCity(editingId, payload);
        setMessage("City updated successfully.");
      } else {
        await addCity(payload);
        setMessage("City added successfully.");
      }

      setShowForm(false);
      resetForm();

      await loadData();
    } catch (err) {
      console.error("Error saving city:", err);
      setError("Unable to save city. Please check the API request.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this city?"
    );

    if (!confirmed) return;

    setActionId(id);
    setError("");
    setMessage("");

    try {
      await deleteCity(id);
      setMessage("City deleted successfully.");

      await loadData();
    } catch (err) {
      console.error("Error deleting city:", err);
      setError("Unable to delete city. Please check the API request.");
    } finally {
      setActionId(null);
    }
  };

  const filteredCities = cities.filter((city) => {
    const searchText = search.trim().toLowerCase();

    const matchesSearch =
      (city.name ?? "").toLowerCase().includes(searchText) ||
      (city.stateName ?? "").toLowerCase().includes(searchText);

    const matchesState =
      !filterState || city.stateId === filterState;

    return matchesSearch && matchesState;
  });

  return (
    <div className="city-management">
      <div className="city-header">
        <div>
          <h2>City Management</h2>
          <p>Manage cities and their associated states.</p>
        </div>

        <div className="city-header-actions">
          <button
            type="button"
            className="city-btn city-btn-refresh"
            onClick={() => void loadData()}
            disabled={loading}
          >
            {loading ? "Loading..." : "↻ Refresh"}
          </button>

          <button
            type="button"
            className="city-btn city-btn-add"
            onClick={openAddForm}
          >
            + Add City
          </button>
        </div>
      </div>

      {message && (
        <div className="city-alert city-success" role="status">
          {message}
        </div>
      )}

      {error && (
        <div className="city-alert city-error" role="alert">
          {error}
        </div>
      )}

      {showForm && (
        <div className="city-form-card">
          <div className="city-form-heading">
            <h3>
              {viewingId
                ? "View City"
                : editingId
                  ? "Edit City"
                  : "Add New City"}
            </h3>

            <button
              type="button"
              className="city-close-btn"
              onClick={closeForm}
              aria-label="Close form"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="city-form-grid">
              <div className="city-form-group">
                <label htmlFor="cityName">City Name *</label>
                <input
                  id="cityName"
                  type="text"
                  placeholder="Enter city name"
                  value={formData.name}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      name: event.target.value,
                    })
                  }
                  required
                  disabled={!!viewingId || saving}
                />
              </div>

              <div className="city-form-group">
                <label htmlFor="cityState">State *</label>
                <select
                  id="cityState"
                  value={formData.stateId}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      stateId: event.target.value,
                    })
                  }
                  required
                  disabled={!!viewingId || saving}
                >
                  <option value="">Select State</option>

                  {states.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="city-form-group city-status-group">
                <label htmlFor="cityStatus">Status</label>
                <select
                  id="cityStatus"
                  value={formData.isActive ? "true" : "false"}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      isActive: event.target.value === "true",
                    })
                  }
                  disabled={!!viewingId || saving}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div className="city-form-actions">
              <button
                type="button"
                className="city-btn city-btn-cancel"
                onClick={closeForm}
                disabled={saving}
              >
                Close
              </button>

              {!viewingId && (
                <button
                  type="submit"
                  className="city-btn city-btn-add"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update City"
                      : "Save City"}
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="city-table-card">
        <div className="city-table-toolbar">
          <div>
            <h3>All Cities</h3>
            <span>{filteredCities.length} cities found</span>
          </div>

          <div className="city-filters">
            <input
              type="search"
              placeholder="Search city or state..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search cities"
            />

            <select
              value={filterState}
              onChange={(event) => setFilterState(event.target.value)}
              aria-label="Filter by state"
            >
              <option value="">All States</option>

              {states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="city-loading">Loading cities...</div>
        ) : (
          <div className="city-table-wrapper">
            <table className="city-table">
              <thead>
                <tr>
                  <th>City Name</th>
                  <th>State</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <tr key={city.id}>
                      <td className="city-name-cell">{city.name}</td>
                      <td>{city.stateName || "-"}</td>

                      <td>
                        <span
                          className={`city-status ${
                            city.isActive ? "active" : "inactive"
                          }`}
                        >
                          {city.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td>
                        {city.createdAtUtc
                          ? new Date(
                              city.createdAtUtc
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>
                        <div className="city-action-buttons">
                          {/* <button
                            type="button"
                            className="city-action-btn city-view-btn"
                            onClick={() => void handleView(city.id)}
                            disabled={actionId !== null}
                          >
                            {actionId === city.id ? "Loading..." : "View"}
                          </button> */}

                          <button
                            type="button"
                            className="city-action-btn city-edit-btn"
                            onClick={() => void openEditForm(city.id)}
                            disabled={actionId !== null}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="city-action-btn city-delete-btn"
                            onClick={() => void handleDelete(city.id)}
                            disabled={actionId !== null}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="city-empty">
                      {error
                        ? "Cities could not be loaded."
                        : search || filterState
                          ? "No matching cities found."
                          : "No cities found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CityPage;
