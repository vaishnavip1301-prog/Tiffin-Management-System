
import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useTranslation } from "react-i18next";

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

type LocalizedLocation = LocationData & {
  addressLineEn?: string;
  addressLineMr?: string;
  landmarkEn?: string;
  landmarkMr?: string;
  areaNameEn?: string;
  areaNameMr?: string;
  cityNameEn?: string;
  cityNameMr?: string;
  stateNameEn?: string;
  stateNameMr?: string;
};

type LocalizedArea = AreaData & {
  nameEn?: string;
  nameMr?: string;
  cityNameEn?: string;
  cityNameMr?: string;
};

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
  const { t, i18n } = useTranslation();

  const isMarathi = i18n.language.startsWith("mr");

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

  // Backend data language helpers
  const getLocationAddress = (location: LocationData) => {
    const item = location as LocalizedLocation;

    return isMarathi
      ? item.addressLineMr || item.addressLine
      : item.addressLineEn || item.addressLine;
  };

  const getLocationLandmark = (location: LocationData) => {
    const item = location as LocalizedLocation;

    return isMarathi
      ? item.landmarkMr || item.landmark
      : item.landmarkEn || item.landmark;
  };

  const getLocationArea = (location: LocationData) => {
    const item = location as LocalizedLocation;

    return isMarathi
      ? item.areaNameMr || item.areaName || item.areaId
      : item.areaNameEn || item.areaName || item.areaId;
  };

  const getLocationCity = (location: LocationData) => {
    const item = location as LocalizedLocation;

    return isMarathi
      ? item.cityNameMr || item.cityName
      : item.cityNameEn || item.cityName;
  };

  const getLocationState = (location: LocationData) => {
    const item = location as LocalizedLocation;

    return isMarathi
      ? item.stateNameMr || item.stateName
      : item.stateNameEn || item.stateName;
  };

  const getAreaName = (area: AreaData) => {
    const item = area as LocalizedArea;

    const name = isMarathi
      ? item.nameMr || item.name
      : item.nameEn || item.name;

    const cityName = isMarathi
      ? item.cityNameMr || item.cityName
      : item.cityNameEn || item.cityName;

    return `${name}${cityName ? `, ${cityName}` : ""}`;
  };

  const loadLocations = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getLocations();
      setLocations(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Failed to load locations:", err);
      setError(t("location.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const loadAreas = useCallback(async () => {
    try {
      const response = await getAreas();
      setAreas(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Failed to load areas:", err);
      setAreas([]);
      setError(t("location.areasLoadFailed"));
    }
  }, [t]);

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
      setError(t("location.requiredFields"));
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

        setMessage(t("location.updateSuccess"));
      } else {
        await addLocation(payload);
        setMessage(t("location.createSuccess"));
      }

      setShowForm(false);
      setEditingLocation(null);
      setFormData({ ...emptyForm });

      await loadLocations();
    } catch (err) {
      console.error("Failed to save location:", err);
      setError(t("location.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      t("location.deleteConfirmation")
    );

    if (!confirmed) return;

    setDeletingId(id);
    setMessage("");
    setError("");

    try {
      await deleteLocation(id);
      setMessage(t("location.deleteSuccess"));
      await loadLocations();
    } catch (err) {
      console.error("Failed to delete location:", err);
      setError(t("location.deleteFailed"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="location-management">
      <div className="location-header">
        <div>
          <h2>{t("location.pageTitle")}</h2>
          <p>{t("location.pageDescription")}</p>
        </div>

        <button
          type="button"
          className="location-add-btn"
          onClick={handleAdd}
        >
          + {t("location.addLocation")}
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
            {editingLocation
              ? t("location.updateLocation")
              : t("location.createLocation")}
          </h3>

          <div className="location-form-grid">
            <div className="location-field">
              <label htmlFor="location-areaId">
                {t("location.area")} *
              </label>

              <select
                id="location-areaId"
                name="areaId"
                value={formData.areaId}
                onChange={handleChange}
                required
              >
                <option value="">
                  {t("location.selectArea")}
                </option>

                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {getAreaName(area)}
                  </option>
                ))}
              </select>
            </div>

            <div className="location-field">
              <label htmlFor="location-postalCode">
                {t("location.postalCode")} *
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
              <label htmlFor="location-addressLine">
                {t("location.address")} *
              </label>

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
              <label htmlFor="location-landmark">
                {t("location.landmark")}
              </label>

              <input
                id="location-landmark"
                name="landmark"
                type="text"
                value={formData.landmark ?? ""}
                onChange={handleChange}
              />
            </div>

            <div className="location-field">
              <label htmlFor="location-latitude">
                {t("location.latitude")}
              </label>

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
              <label htmlFor="location-longitude">
                {t("location.longitude")}
              </label>

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
              <label htmlFor="location-isActive">
                {t("location.status")}
              </label>

              <select
                id="location-isActive"
                name="isActive"
                value={String(formData.isActive)}
                onChange={handleChange}
              >
                <option value="true">
                  {t("location.active")}
                </option>

                <option value="false">
                  {t("location.inactive")}
                </option>
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
                ? t("location.saving")
                : editingLocation
                  ? t("location.updateLocation")
                  : t("location.createLocation")}
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
              {t("location.cancel")}
            </button>
          </div>
        </form>
      )}

      <div className="location-table-card">
        <div className="location-table-heading">
          <h3>{t("location.allLocations")}</h3>

          <button
            type="button"
            className="location-refresh-btn"
            onClick={() => {
              void loadLocations();
              void loadAreas();
            }}
            disabled={loading}
          >
            {loading
              ? t("location.loading")
              : t("location.refresh")}
          </button>
        </div>

        {loading ? (
          <p className="location-empty">
            {t("location.loadingLocations")}
          </p>
        ) : locations.length === 0 ? (
          <p className="location-empty">
            {t("location.noLocationsFound")}
          </p>
        ) : (
          <div className="location-table-wrapper">
            <table className="location-table">
              <thead>
                <tr>
                  <th>{t("location.address")}</th>
                  <th>{t("location.area")}</th>
                  <th>{t("location.city")}</th>
                  <th>{t("location.state")}</th>
                  <th>{t("location.postalCode")}</th>
                  <th>{t("location.status")}</th>
                  <th>{t("location.actions")}</th>
                </tr>
              </thead>

              <tbody>
                {locations.map((location) => (
                  <tr key={location.id}>
                    <td>
                      <strong>
                        {getLocationAddress(location)}
                      </strong>

                      {getLocationLandmark(location) && (
                        <small>
                          {getLocationLandmark(location)}
                        </small>
                      )}
                    </td>

                    <td>
                      {getLocationArea(location) || "-"}
                    </td>

                    <td>
                      {getLocationCity(location) || "-"}
                    </td>

                    <td>
                      {getLocationState(location) || "-"}
                    </td>

                    <td>{location.postalCode || "-"}</td>

                    <td>
                      <span
                        className={`location-status ${
                          location.isActive
                            ? "active"
                            : "inactive"
                        }`}
                      >
                        {location.isActive
                          ? t("location.active")
                          : t("location.inactive")}
                      </span>
                    </td>

                    <td>
                      <div className="location-actions">
                        <button
                          type="button"
                          className="location-edit-btn"
                          onClick={() => handleEdit(location)}
                        >
                          {t("location.edit")}
                        </button>

                        <button
                          type="button"
                          className="location-delete-btn"
                          disabled={deletingId === location.id}
                          onClick={() =>
                            void handleDelete(location.id)
                          }
                        >
                          {deletingId === location.id
                            ? t("location.deleting")
                            : t("location.delete")}
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
