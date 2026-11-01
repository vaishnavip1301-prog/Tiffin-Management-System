
import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
      setError("statesLoadError");
    }

    try {
      const cityData = await getCities();
      setCities(Array.isArray(cityData) ? cityData : []);
    } catch (err) {
      console.error("Error loading cities:", err);
      setCities([]);
      setError("citiesLoadError");
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
      setError("cityDetailsError");
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
      setError("cityDetailsError");
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
      setError("cityNameRequired");
      return;
    }

    if (!formData.stateId) {
      setError("stateRequired");
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
        setMessage("cityUpdated");
      } else {
        await addCity(payload);
        setMessage("cityAdded");
      }

      setShowForm(false);
      resetForm();

      await loadData();
    } catch (err) {
      console.error("Error saving city:", err);
      setError("citySaveError");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(t("city.deleteConfirmation"));

    if (!confirmed) return;

    setActionId(id);
    setError("");
    setMessage("");

    try {
      await deleteCity(id);
      setMessage("cityDeleted");

      await loadData();
    } catch (err) {
      console.error("Error deleting city:", err);
      setError("cityDeleteError");
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

      {/* Header */}
      <div className="city-header">
        <div>
          <h2>{t("city.title")}</h2>
          <p>{t("city.description")}</p>
        </div>

        <div className="city-header-actions">
          <button
            type="button"
            className="city-btn city-btn-refresh"
            onClick={() => void loadData()}
            disabled={loading}
          >
            {loading ? t("city.loading") : t("city.refresh")}
          </button>

          <button
            type="button"
            className="city-btn city-btn-add"
            onClick={openAddForm}
          >
            {t("city.addCity")}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {message && (
        <div className="city-alert city-success" role="status">
          {t(`city.${message}`)}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="city-alert city-error" role="alert">
          {t(`city.${error}`)}
        </div>
      )}

      {/* Add / Edit / View Form */}
      {showForm && (
        <div className="city-form-card">

          <div className="city-form-heading">
            <h3>
              {viewingId
                ? t("city.viewCity")
                : editingId
                  ? t("city.editCity")
                  : t("city.addNewCity")}
            </h3>

            <button
              type="button"
              className="city-close-btn"
              onClick={closeForm}
              aria-label={t("city.close")}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="city-form-grid">

              {/* City Name */}
              <div className="city-form-group">
                <label htmlFor="cityName">
                  {t("city.cityName")} *
                </label>

                <input
                  id="cityName"
                  type="text"
                  placeholder={t("city.enterCityName")}
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

              {/* State */}
              <div className="city-form-group">
                <label htmlFor="cityState">
                  {t("city.state")} *
                </label>

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
                  <option value="">
                    {t("city.selectState")}
                  </option>

                  {states.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="city-form-group city-status-group">
                <label htmlFor="cityStatus">
                  {t("city.status")}
                </label>

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
                  <option value="true">
                    {t("city.active")}
                  </option>

                  <option value="false">
                    {t("city.inactive")}
                  </option>
                </select>
              </div>

            </div>

            {/* Form Buttons */}
            <div className="city-form-actions">
              <button
                type="button"
                className="city-btn city-btn-cancel"
                onClick={closeForm}
                disabled={saving}
              >
                {t("city.close")}
              </button>

              {!viewingId && (
                <button
                  type="submit"
                  className="city-btn city-btn-add"
                  disabled={saving}
                >
                  {saving
                    ? t("city.saving")
                    : editingId
                      ? t("city.updateCity")
                      : t("city.saveCity")}
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Cities Table */}
      <div className="city-table-card">

        <div className="city-table-toolbar">
          <div>
            <h3>{t("city.allCities")}</h3>

            <span>
              {t("city.citiesFound", {
                count: filteredCities.length,
              })}
            </span>
          </div>

          {/* Search and Filter */}
          <div className="city-filters">
            <input
              type="search"
              placeholder={t("city.searchPlaceholder")}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label={t("city.searchCities")}
            />

            <select
              value={filterState}
              onChange={(event) => setFilterState(event.target.value)}
              aria-label={t("city.filterByState")}
            >
              <option value="">
                {t("city.allStates")}
              </option>

              {states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="city-loading">
            {t("city.loadingCities")}
          </div>
        ) : (
          <div className="city-table-wrapper">
            <table className="city-table">

              <thead>
                <tr>
                  <th>{t("city.cityName")}</th>
                  <th>{t("city.state")}</th>
                  <th>{t("city.status")}</th>
                  <th>{t("city.createdDate")}</th>
                  <th>{t("city.actions")}</th>
                </tr>
              </thead>

              <tbody>
                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <tr key={city.id}>

                      <td className="city-name-cell">
                        {city.name}
                      </td>

                      <td>
                        {city.stateName || "-"}
                      </td>

                      <td>
                        <span
                          className={`city-status ${
                            city.isActive ? "active" : "inactive"
                          }`}
                        >
                          {city.isActive
                            ? t("city.active")
                            : t("city.inactive")}
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

                          {/* View Button (Optional) */}
                          {/* 
                          <button
                            type="button"
                            className="city-action-btn city-view-btn"
                            onClick={() => void handleView(city.id)}
                            disabled={actionId !== null}
                          >
                            {actionId === city.id
                              ? t("city.loading")
                              : t("city.view")}
                          </button>
                          */}

                          <button
                            type="button"
                            className="city-action-btn city-edit-btn"
                            onClick={() => void openEditForm(city.id)}
                            disabled={actionId !== null}
                          >
                            {t("city.edit")}
                          </button>

                          <button
                            type="button"
                            className="city-action-btn city-delete-btn"
                            onClick={() => void handleDelete(city.id)}
                            disabled={actionId !== null}
                          >
                            {t("city.delete")}
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="city-empty">
                      {error
                        ? t("city.citiesCouldNotLoad")
                        : search || filterState
                          ? t("city.noMatchingCities")
                          : t("city.noCitiesFound")}
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
