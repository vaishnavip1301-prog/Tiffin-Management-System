
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";
import {
  getAreas,
  addArea,
  updateArea,
  deleteArea,
  type Area as AreaData,
  type AreaInput,
} from "../../api/areaService";
import "./Area.css";

const API_URL = "https://tiffinapis.ysaasinfotech.com";

interface City {
  id: string;
  name: string;
}

const emptyForm: AreaInput = {
  cityId: "",
  name: "",
  postalCode: "",
  isActive: true,
};

function Area() {
  const [areas, setAreas] = useState<AreaData[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [formData, setFormData] = useState<AreaInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadAreas = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAreas();
      setAreas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Areas API error:", err);
      setError(
        "Unable to load areas. Please verify the Areas API endpoint and try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCities = useCallback(async () => {
    try {
      const response = await axios.get<City[]>(
        `${API_URL}/Cities`
      );

      setCities(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Cities API error:", err);
      setCities([]);
    }
  }, []);

  useEffect(() => {
    void loadAreas();
    void loadCities();
  }, [loadAreas, loadCities]);

  const filteredAreas = useMemo(() => {
    return areas.filter((area) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        area.name?.toLowerCase().includes(searchText) ||
        area.cityName?.toLowerCase().includes(searchText) ||
        area.stateName?.toLowerCase().includes(searchText) ||
        area.postalCode?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && area.isActive) ||
        (statusFilter === "inactive" && !area.isActive);

      const matchesCity =
        cityFilter === "all" || area.cityId === cityFilter;

      return matchesSearch && matchesStatus && matchesCity;
    });
  }, [areas, search, statusFilter, cityFilter]);

  const openAddForm = () => {
    setFormData({ ...emptyForm });
    setEditingId(null);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const openEditForm = (area: AreaData) => {
    setFormData({
      cityId: area.cityId,
      name: area.name,
      postalCode: area.postalCode ?? "",
      isActive: area.isActive,
    });

    setEditingId(area.id);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    if (name === "isActive") {
      setFormData((previous) => ({
        ...previous,
        isActive: value === "true",
      }));
      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.cityId ||
      !formData.name.trim() ||
      !formData.postalCode.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setSaving(true);

    try {
      const payload: AreaInput = {
        cityId: formData.cityId,
        name: formData.name.trim(),
        postalCode: formData.postalCode.trim(),
        isActive: formData.isActive,
      };

      if (editingId) {
        await updateArea(editingId, payload);
        setSuccess("Area updated successfully.");
      } else {
        await addArea(payload);
        setSuccess("Area added successfully.");
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({ ...emptyForm });
      await loadAreas();
    } catch (err) {
      console.error("Save Area API error:", err);
      setError(
        "Unable to save area. Please check the API endpoint and required request fields."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (area: AreaData) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${area.name}"?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deleteArea(area.id);
      setSuccess("Area deleted successfully.");
      await loadAreas();
    } catch (err) {
      console.error("Delete Area API error:", err);
      setError("Unable to delete area. Please try again.");
    }
  };

  return (
    <div className="area-management">
      <div className="area-page-header">
        <div>
          <span className="area-eyebrow">LOCATION MANAGEMENT</span>
          <h2>Area Management</h2>
          <p>Manage areas, cities, postal codes and area status.</p>
        </div>

        <button
          type="button"
          className="area-primary-btn"
          onClick={openAddForm}
        >
          <i className="bi bi-plus-lg" /> Add Area
        </button>
      </div>

      {error && (
        <div className="area-alert area-alert-error" role="alert">
          <i className="bi bi-exclamation-circle" />
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>
      )}

      {success && (
        <div className="area-alert area-alert-success" role="status">
          <i className="bi bi-check-circle" />
          <span>{success}</span>
          <button
            type="button"
            onClick={() => setSuccess("")}
            aria-label="Dismiss message"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>
      )}

      {showForm && (
        <section className="area-form-card">
          <div className="area-form-heading">
            <div>
              <h3>{editingId ? "Update Area" : "Add New Area"}</h3>
              <p>Enter the area details below.</p>
            </div>

            <button
              type="button"
              className="area-close-btn"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setError("");
              }}
              aria-label="Close form"
            >
              <i className="bi bi-x-lg" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="area-form-grid">
              <div className="area-field">
                <label htmlFor="area-city">City *</label>
                <select
                  id="area-city"
                  name="cityId"
                  value={formData.cityId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                  {formData.cityId &&
                    !cities.some((city) => city.id === formData.cityId) && (
                      <option value={formData.cityId}>
                        {areas.find(
                          (area) => area.cityId === formData.cityId
                        )?.cityName ?? "Selected City"}
                      </option>
                    )}
                </select>
              </div>

              <div className="area-field">
                <label htmlFor="area-name">Area Name *</label>
                <input
                  id="area-name"
                  name="name"
                  type="text"
                  placeholder="Enter area name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  maxLength={100}
                />
              </div>

              <div className="area-field">
                <label htmlFor="area-postal-code">Postal Code *</label>
                <input
                  id="area-postal-code"
                  name="postalCode"
                  type="text"
                  placeholder="Enter postal code"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  required
                  maxLength={12}
                />
              </div>

              <div className="area-field">
                <label htmlFor="area-status">Status *</label>
                <select
                  id="area-status"
                  name="isActive"
                  value={String(formData.isActive)}
                  onChange={handleInputChange}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div className="area-form-actions">
              <button
                type="button"
                className="area-secondary-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setError("");
                }}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="area-primary-btn"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="area-spinner" />
                    Saving...
                  </>
                ) : (
                  <>
                    <i
                      className={`bi ${
                        editingId ? "bi-check-lg" : "bi-plus-lg"
                      }`}
                    />
                    {editingId ? "Update Area" : "Save Area"}
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="area-list-card">
        <div className="area-list-heading">
          <div>
            <h3>Areas List</h3>
            <p>{filteredAreas.length} area(s) found</p>
          </div>

          <button
            type="button"
            className="area-refresh-btn"
            onClick={() => {
              void loadAreas();
              void loadCities();
            }}
            disabled={loading}
          >
            <i
              className={`bi bi-arrow-clockwise ${
                loading ? "area-spinning" : ""
              }`}
            />
            Refresh
          </button>
        </div>

        <div className="area-filters">
          <div className="area-search-box">
            <i className="bi bi-search" />
            <input
              type="search"
              placeholder="Search area, city or postal code..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            aria-label="Filter by city"
            value={cityFilter}
            onChange={(event) => setCityFilter(event.target.value)}
          >
            <option value="all">All Cities</option>
            {Array.from(
              new Map(
                areas.map((area) => [
                  area.cityId,
                  { id: area.cityId, name: area.cityName },
                ])
              ).values()
            ).map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="area-table-wrapper">
          <table className="area-table">
            <thead>
              <tr>
                <th>Area Name</th>
                <th>City</th>
                <th>State</th>
                <th>Postal Code</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="area-table-message">
                    <span className="area-spinner" /> Loading areas...
                  </td>
                </tr>
              ) : filteredAreas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="area-table-message">
                    {error ? "Unable to load areas." : "No areas found."}
                  </td>
                </tr>
              ) : (
                filteredAreas.map((area) => (
                  <tr key={area.id}>
                    <td>
                      <div className="area-name-cell">
                        <span className="area-row-icon">
                          <i className="bi bi-geo-alt" />
                        </span>
                        <strong>{area.name}</strong>
                      </div>
                    </td>
                    <td>{area.cityName || "—"}</td>
                    <td>{area.stateName || "—"}</td>
                    <td>{area.postalCode || "—"}</td>
                    <td>
                      <span
                        className={`area-status ${
                          area.isActive
                            ? "area-status-active"
                            : "area-status-inactive"
                        }`}
                      >
                        {area.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                    <div className="area-action-buttons">
                      <button
                        type="button"
                        className="area-edit-btn"
                        onClick={() => openEditForm(area)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="area-delete-btn"
                        onClick={() => void handleDelete(area)}
                      >
                        Delete
                      </button>
                    </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Area;
