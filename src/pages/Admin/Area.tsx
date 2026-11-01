
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

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
      setError("areasLoadError");
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
      setError("requiredFields");
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
        setSuccess("areaUpdated");
      } else {
        await addArea(payload);
        setSuccess("areaAdded");
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({ ...emptyForm });
      await loadAreas();
    } catch (err) {
      console.error("Save Area API error:", err);
      setError("areaSaveError");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (area: AreaData) => {
    const confirmed = window.confirm(
      t("area.deleteConfirmation", { name: area.name })
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deleteArea(area.id);
      setSuccess("areaDeleted");
      await loadAreas();
    } catch (err) {
      console.error("Delete Area API error:", err);
      setError("areaDeleteError");
    }
  };

  return (
    <div className="area-management">
      <div className="area-page-header">
        <div>
          <span className="area-eyebrow">
            {t("area.eyebrow")}
          </span>
          <h2>{t("area.title")}</h2>
          <p>{t("area.description")}</p>
        </div>

        <button
          type="button"
          className="area-primary-btn"
          onClick={openAddForm}
        >
          <i className="bi bi-plus-lg" /> {t("area.addArea")}
        </button>
      </div>

      {error && (
        <div className="area-alert area-alert-error" role="alert">
          <i className="bi bi-exclamation-circle" />
          <span>{t(`area.${error}`)}</span>
          <button
            type="button"
            onClick={() => setError("")}
            aria-label={t("area.dismissError")}
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>
      )}

      {success && (
        <div className="area-alert area-alert-success" role="status">
          <i className="bi bi-check-circle" />
          <span>{t(`area.${success}`)}</span>
          <button
            type="button"
            onClick={() => setSuccess("")}
            aria-label={t("area.dismissMessage")}
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>
      )}

      {showForm && (
        <section className="area-form-card">
          <div className="area-form-heading">
            <div>
              <h3>
                {editingId ? t("area.updateArea") : t("area.addNewArea")}
              </h3>
              <p>{t("area.formDescription")}</p>
            </div>

            <button
              type="button"
              className="area-close-btn"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setError("");
              }}
              aria-label={t("area.closeForm")}
            >
              <i className="bi bi-x-lg" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="area-form-grid">
              <div className="area-field">
                <label htmlFor="area-city">
                  {t("area.city")} *
                </label>
                <select
                  id="area-city"
                  name="cityId"
                  value={formData.cityId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">{t("area.selectCity")}</option>

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
                        )?.cityName ?? t("area.selectedCity")}
                      </option>
                    )}
                </select>
              </div>

              <div className="area-field">
                <label htmlFor="area-name">
                  {t("area.areaName")} *
                </label>
                <input
                  id="area-name"
                  name="name"
                  type="text"
                  placeholder={t("area.enterAreaName")}
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  maxLength={100}
                />
              </div>

              <div className="area-field">
                <label htmlFor="area-postal-code">
                  {t("area.postalCode")} *
                </label>
                <input
                  id="area-postal-code"
                  name="postalCode"
                  type="text"
                  placeholder={t("area.enterPostalCode")}
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  required
                  maxLength={12}
                />
              </div>

              <div className="area-field">
                <label htmlFor="area-status">
                  {t("area.status")} *
                </label>
                <select
                  id="area-status"
                  name="isActive"
                  value={String(formData.isActive)}
                  onChange={handleInputChange}
                >
                  <option value="true">{t("area.active")}</option>
                  <option value="false">{t("area.inactive")}</option>
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
                {t("area.cancel")}
              </button>

              <button
                type="submit"
                className="area-primary-btn"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="area-spinner" />
                    {t("area.saving")}
                  </>
                ) : (
                  <>
                    <i
                      className={`bi ${
                        editingId ? "bi-check-lg" : "bi-plus-lg"
                      }`}
                    />
                    {editingId
                      ? t("area.updateArea")
                      : t("area.saveArea")}
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
            <h3>{t("area.areasList")}</h3>
            <p>
              {t("area.areasFound", { count: filteredAreas.length })}
            </p>
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
            {t("area.refresh")}
          </button>
        </div>

        <div className="area-filters">
          <div className="area-search-box">
            <i className="bi bi-search" />
            <input
              type="search"
              placeholder={t("area.searchPlaceholder")}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            aria-label={t("area.filterByCity")}
            value={cityFilter}
            onChange={(event) => setCityFilter(event.target.value)}
          >
            <option value="all">{t("area.allCities")}</option>

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
            aria-label={t("area.filterByStatus")}
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">{t("area.allStatus")}</option>
            <option value="active">{t("area.active")}</option>
            <option value="inactive">{t("area.inactive")}</option>
          </select>
        </div>

        <div className="area-table-wrapper">
          <table className="area-table">
            <thead>
              <tr>
                <th>{t("area.areaName")}</th>
                <th>{t("area.city")}</th>
                <th>{t("area.state")}</th>
                <th>{t("area.postalCode")}</th>
                <th>{t("area.status")}</th>
                <th>{t("area.actions")}</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="area-table-message">
                    <span className="area-spinner" />
                    {t("area.loadingAreas")}
                  </td>
                </tr>
              ) : filteredAreas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="area-table-message">
                    {error
                      ? t("area.areasCouldNotLoad")
                      : t("area.noAreasFound")}
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
                        {area.isActive
                          ? t("area.active")
                          : t("area.inactive")}
                      </span>
                    </td>

                    <td>
                      <div className="area-action-buttons">
                        <button
                          type="button"
                          className="area-edit-btn"
                          onClick={() => openEditForm(area)}
                        >
                          {t("area.edit")}
                        </button>

                        <button
                          type="button"
                          className="area-delete-btn"
                          onClick={() => void handleDelete(area)}
                        >
                          {t("area.delete")}
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
