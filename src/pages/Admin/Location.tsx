
import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  getLocations,
  addLocation,
  updateLocation,
  deleteLocation,
} from "../../api/locationService";
import type {
  Location as LocationData,
  LocationInput,
} from "../../api/locationService";
import { getAreas } from "../../api/areaService";
import type { Area as AreaData } from "../../api/areaService";
import "./Location.css";

const emptyForm: LocationInput = {
  areaId: "",
  postalCode: "",
  addressLine: "",
  landmark: "",
  latitude: 0,
  longitude: 0,
  isActive: true,
};

function Location() {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [areas, setAreas] = useState<AreaData[]>([]);
  const [formData, setFormData] = useState<LocationInput>({
    ...emptyForm,
  });
  const [editingLocation, setEditingLocation] =
    useState<LocationData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadLocations = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getLocations();
      setLocations(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Failed to load locations:", err);
      setError("Unable to load locations. Please check the API.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAreas = useCallback(async () => {
    try {
      const response = await getAreas();
      setAreas(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Failed to load areas:", err);
      setAreas([]);
      setError("Unable to load areas for the Area dropdown.");
    }
  }, []);

  useEffect(() => {
    void loadLocations();
    void loadAreas();
  }, [loadLocations, loadAreas]);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => {
      if (name === "latitude" || name === "longitude") {
        return {
          ...previous,
          [name]: value === "" ? 0 : Number(value),
        };
      }

      if (name === "isActive") {
        return {
          ...previous,
          isActive: value === "true",
        };
      }

      return {
        ...previous,
        [name]: value,
      };
    });
  };

  const handleAdd = () => {
    setEditingLocation(null);
    setFormData({ ...emptyForm });
    setMessage("");
    setError("");
    setShowForm(true);
  };

  const handleEdit = (location: LocationData) => {
    setEditingLocation(location);

    setFormData({
      areaId: location.areaId,
      postalCode: location.postalCode,
      addressLine: location.addressLine,
      landmark: location.landmark ?? "",
      latitude: location.latitude ?? 0,
      longitude: location.longitude ?? 0,
      isActive: location.isActive,
    });

    setMessage("");
    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (
      !formData.areaId ||
      !formData.postalCode.trim() ||
      !formData.addressLine.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setSaving(true);

    try {
      const payload: LocationInput = {
        ...formData,
        areaId: formData.areaId,
        postalCode: formData.postalCode.trim(),
        addressLine: formData.addressLine.trim(),
        landmark: formData.landmark?.trim() || null,
      };

      if (editingLocation) {
        await updateLocation({
          ...editingLocation,
          ...payload,
        });

        setMessage("Location updated successfully.");
      } else {
        await addLocation(payload);
        setMessage("Location created successfully.");
      }

      setShowForm(false);
      setEditingLocation(null);
      setFormData({ ...emptyForm });

      await loadLocations();
    } catch (err) {
      console.error("Failed to save location:", err);
      setError("Unable to save location. Please check the API details.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this location?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setMessage("");
    setError("");

    try {
      await deleteLocation(id);
      setMessage("Location deleted successfully.");
      await loadLocations();
    } catch (err) {
      console.error("Failed to delete location:", err);
      setError("Unable to delete location. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="location-management">
      <div className="location-header">
        <div>
          <h2>Location Management</h2>
          <p>Manage delivery locations for Aapla Dabba.</p>
        </div>

        <button
          type="button"
          className="location-add-btn"
          onClick={handleAdd}
        >
          + Add Location
        </button>
      </div>

      {message && (
        <div className="location-success" role="status">
          {message}
        </div>
      )}

      {error && (
        <div className="location-error" role="alert">
          {error}
        </div>
      )}

      {showForm && (
        <form className="location-form" onSubmit={handleSubmit}>
          <h3>
            {editingLocation ? "Update Location" : "Create Location"}
          </h3>

          <div className="location-form-grid">
            <div className="location-field">
              <label htmlFor="location-areaId">Area *</label>
              <select
                id="location-areaId"
                name="areaId"
                value={formData.areaId}
                onChange={handleChange}
                required
              >
                <option value="">Select Area</option>

                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                    {area.cityName ? `, ${area.cityName}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="location-field">
              <label htmlFor="location-postalCode">
                Postal Code *
              </label>
              <input
                id="location-postalCode"
                name="postalCode"
                type="text"
                value={formData.postalCode}
                onChange={handleChange}
                required
              />
            </div>

            <div className="location-field location-full-width">
              <label htmlFor="location-addressLine">Address *</label>
              <textarea
                id="location-addressLine"
                name="addressLine"
                value={formData.addressLine}
                onChange={handleChange}
                rows={2}
                required
              />
            </div>

            <div className="location-field">
              <label htmlFor="location-landmark">Landmark</label>
              <input
                id="location-landmark"
                name="landmark"
                type="text"
                value={formData.landmark ?? ""}
                onChange={handleChange}
              />
            </div>

            <div className="location-field">
              <label htmlFor="location-latitude">Latitude</label>
              <input
                id="location-latitude"
                name="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={handleChange}
              />
            </div>

            <div className="location-field">
              <label htmlFor="location-longitude">Longitude</label>
              <input
                id="location-longitude"
                name="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={handleChange}
              />
            </div>

            <div className="location-field">
              <label htmlFor="location-isActive">Status</label>
              <select
                id="location-isActive"
                name="isActive"
                value={String(formData.isActive)}
                onChange={handleChange}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <div className="location-form-actions">
            <button
              type="submit"
              className="location-save-btn"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingLocation
                  ? "Update Location"
                  : "Create Location"}
            </button>

            <button
              type="button"
              className="location-cancel-btn"
              disabled={saving}
              onClick={() => {
                setShowForm(false);
                setEditingLocation(null);
                setError("");
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="location-table-card">
        <div className="location-table-heading">
          <h3>All Locations</h3>

          <button
            type="button"
            className="location-refresh-btn"
            onClick={() => {
              void loadLocations();
              void loadAreas();
            }}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {loading ? (
          <p className="location-empty">Loading locations...</p>
        ) : locations.length === 0 ? (
          <p className="location-empty">No locations found.</p>
        ) : (
          <div className="location-table-wrapper">
            <table className="location-table">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Area</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Postal Code</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {locations.map((location) => (
                  <tr key={location.id}>
                    <td>
                      <strong>{location.addressLine}</strong>
                      {location.landmark && (
                        <small>{location.landmark}</small>
                      )}
                    </td>

                    <td>
                      {location.areaName || location.areaId || "-"}
                    </td>
                    <td>{location.cityName || "-"}</td>
                    <td>{location.stateName || "-"}</td>
                    <td>{location.postalCode || "-"}</td>

                    <td>
                      <span
                        className={`location-status ${
                          location.isActive ? "active" : "inactive"
                        }`}
                      >
                        {location.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <div className="location-actions">
                        <button
                          type="button"
                          className="location-edit-btn"
                          onClick={() => handleEdit(location)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="location-delete-btn"
                          disabled={deletingId === location.id}
                          onClick={() => void handleDelete(location.id)}
                        >
                          {deletingId === location.id
                            ? "Deleting..."
                            : "Delete"}
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

export default Location;
