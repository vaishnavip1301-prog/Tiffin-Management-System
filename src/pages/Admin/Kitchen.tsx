
import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useTranslation } from "react-i18next";

import {
  getKitchen,
  updateKitchen,
  type Kitchen as KitchenData,
  type KitchenInput,
} from "../../api/kitchenService";

import "./Kitchen.css";

const emptyForm = {
  name: "",
  description: "",
  ownerName: "",
  phoneNumber: "",
  email: "",
  locationAddressLine: "",
  locationLandmark: "",
  locationAreaName: "",
  locationCityName: "",
  locationStateName: "",
  locationPostalCode: "",
};

type KitchenForm = typeof emptyForm;

function Kitchen() {
  const { t } = useTranslation();

  const [kitchens, setKitchens] = useState<KitchenData[]>([]);
  const [formData, setFormData] = useState<KitchenForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingKitchen, setEditingKitchen] =
    useState<KitchenData | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState<"success" | "danger">("success");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // GET: Load kitchen data
  const loadKitchens = useCallback(async (showMessage = false) => {
    setLoading(true);

    try {
      const result = await getKitchen();

      const records: KitchenData[] = Array.isArray(result)
        ? result
        : result
          ? [result]
          : [];

      setKitchens(records);

      if (showMessage) {
        setMessage("listRefreshed");
        setMessageType("success");
      }
    } catch (error) {
      console.error("Get Kitchen API error:", error);

      setMessage("loadFailed");
      setMessageType("danger");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadKitchens();
  }, [loadKitchens]);

  // Handle form changes
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Cancel editing
  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setEditingKitchen(null);
    setShowForm(false);
  };

  // PUT: Update kitchen
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!editingId || !editingKitchen) return;

    setSaving(true);
    setMessage("");

    const payload: KitchenInput = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      ownerName: formData.ownerName.trim() || null,
      phoneNumber: formData.phoneNumber.trim() || null,
      email: formData.email.trim() || null,
      locationId: editingKitchen.locationId,
      locationAddressLine: formData.locationAddressLine.trim() || null,
      locationLandmark: formData.locationLandmark.trim() || null,
      locationAreaName: formData.locationAreaName.trim() || null,
      locationCityName: formData.locationCityName.trim() || null,
      locationStateName: formData.locationStateName.trim() || null,
      locationPostalCode: formData.locationPostalCode.trim() || null,
      latitude: editingKitchen.latitude,
      longitude: editingKitchen.longitude,
      currencyCode: editingKitchen.currencyCode,
      isActive: editingKitchen.isActive,
    };

    try {
      await updateKitchen(editingId, payload);

      setMessage("updateSuccess");
      setMessageType("success");

      resetForm();
      await loadKitchens();
    } catch (error) {
      console.error("Update Kitchen API error:", error);

      setMessage("updateFailed");
      setMessageType("danger");
    } finally {
      setSaving(false);
    }
  };

  // Edit selected kitchen
  const handleEdit = (kitchen: KitchenData) => {
    setFormData({
      name: kitchen.name ?? "",
      description: kitchen.description ?? "",
      ownerName: kitchen.ownerName ?? "",
      phoneNumber: kitchen.phoneNumber ?? "",
      email: kitchen.email ?? "",
      locationAddressLine: kitchen.locationAddressLine ?? "",
      locationLandmark: kitchen.locationLandmark ?? "",
      locationAreaName: kitchen.locationAreaName ?? "",
      locationCityName: kitchen.locationCityName ?? "",
      locationStateName: kitchen.locationStateName ?? "",
      locationPostalCode: kitchen.locationPostalCode ?? "",
    });

    setEditingId(kitchen.id);
    setEditingKitchen(kitchen);
    setShowForm(true);
    setMessage("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container-fluid py-4 kitchen-management">
      {/* Page heading */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            {t("kitchen.pageTitle")}
          </h2>
          <p className="text-secondary mb-0">
            {t("kitchen.pageDescription")}
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-success"
          onClick={() => void loadKitchens(true)}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-1" />
          {loading ? t("kitchen.loading") : t("kitchen.refresh")}
        </button>
      </div>

      {/* API message */}
      {message && (
        <div
          className={`alert alert-${messageType} alert-dismissible fade show`}
          role="alert"
        >
          {t(`kitchen.${message}`)}
          <button
            type="button"
            className="btn-close"
            aria-label={t("kitchen.close")}
            onClick={() => setMessage("")}
          />
        </div>
      )}

      {/* Update form */}
      {showForm && (
        <div className="row justify-content-center mb-4">
          <div className="col-12 kitchen-form-wrapper">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-header bg-white border-0 px-4 pt-4">
                <h5 className="fw-bold mb-1">
                  {t("kitchen.updateKitchen")}
                </h5>
                <p className="text-secondary small mb-0">
                  {t("kitchen.updateDescription")}
                </p>
              </div>

              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        {t("kitchen.kitchenId")}
                      </label>
                      <input
                        className="form-control"
                        value={editingId ?? ""}
                        disabled
                        readOnly
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        {t("kitchen.kitchenName")} *
                      </label>
                      <input
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t("kitchen.enterKitchenName")}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        {t("kitchen.ownerName")}
                      </label>
                      <input
                        className="form-control"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        placeholder={t("kitchen.enterOwnerName")}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        {t("kitchen.mobileNumber")}
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder={t("kitchen.enterMobileNumber")}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        {t("kitchen.emailAddress")}
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t("kitchen.enterEmailAddress")}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        {t("kitchen.city")}
                      </label>
                      <input
                        className="form-control"
                        name="locationCityName"
                        value={formData.locationCityName}
                        onChange={handleChange}
                        placeholder={t("kitchen.enterCity")}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        {t("kitchen.area")}
                      </label>
                      <input
                        className="form-control"
                        name="locationAreaName"
                        value={formData.locationAreaName}
                        onChange={handleChange}
                        placeholder={t("kitchen.enterArea")}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        {t("kitchen.state")}
                      </label>
                      <input
                        className="form-control"
                        name="locationStateName"
                        value={formData.locationStateName}
                        onChange={handleChange}
                        placeholder={t("kitchen.enterState")}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        {t("kitchen.postalCode")}
                      </label>
                      <input
                        className="form-control"
                        name="locationPostalCode"
                        value={formData.locationPostalCode}
                        onChange={handleChange}
                        placeholder={t("kitchen.enterPostalCode")}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        {t("kitchen.address")}
                      </label>
                      <textarea
                        className="form-control"
                        name="locationAddressLine"
                        rows={2}
                        value={formData.locationAddressLine}
                        onChange={handleChange}
                        placeholder={t("kitchen.enterAddress")}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        {t("kitchen.landmark")}
                      </label>
                      <textarea
                        className="form-control"
                        name="locationLandmark"
                        rows={2}
                        value={formData.locationLandmark}
                        onChange={handleChange}
                        placeholder={t("kitchen.enterLandmark")}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        {t("kitchen.description")}
                      </label>
                      <textarea
                        className="form-control"
                        name="description"
                        rows={2}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder={t("kitchen.enterDescription")}
                      />
                    </div>

                    <div className="col-12 d-flex justify-content-end gap-2 mt-4">
                      <button
                        type="button"
                        className="btn btn-outline-secondary px-4"
                        onClick={resetForm}
                        disabled={saving}
                      >
                        {t("kitchen.cancel")}
                      </button>

                      <button
                        type="submit"
                        className="btn btn-success px-4"
                        disabled={saving}
                      >
                        {saving
                          ? t("kitchen.updating")
                          : t("kitchen.updateKitchen")}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kitchen list */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-header bg-white border-0 px-4 pt-4">
          <h5 className="fw-bold mb-1">
            {t("kitchen.allKitchens")}
          </h5>
          <p className="text-secondary small mb-0">
            {t("kitchen.totalKitchens", { count: kitchens.length })}
          </p>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4">{t("kitchen.kitchen")}</th>
                  <th>{t("kitchen.owner")}</th>
                  <th>{t("kitchen.mobile")}</th>
                  <th>{t("kitchen.city")}</th>
                  <th>{t("kitchen.address")}</th>
                  <th>{t("kitchen.status")}</th>
                  <th className="text-end px-4">
                    {t("kitchen.actions")}
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-5">
                      <div className="spinner-border text-success mb-2" />
                      <p className="text-secondary mb-0">
                        {t("kitchen.loadingData")}
                      </p>
                    </td>
                  </tr>
                ) : kitchens.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-5">
                      <i className="bi bi-shop fs-1 text-secondary d-block mb-2" />
                      <h6 className="fw-semibold">
                        {t("kitchen.noKitchensFound")}
                      </h6>
                      <p className="text-secondary small mb-0">
                        {t("kitchen.noKitchenRecords")}
                      </p>
                    </td>
                  </tr>
                ) : (
                  kitchens.map((kitchen) => (
                    <tr key={kitchen.id}>
                      <td className="px-4">
                        <div className="fw-semibold">
                          {kitchen.name || t("kitchen.unnamedKitchen")}
                        </div>
                        <small className="text-secondary">
                          {kitchen.email || t("kitchen.noEmail")}
                        </small>
                      </td>

                      <td>{kitchen.ownerName || "—"}</td>
                      <td>{kitchen.phoneNumber || "—"}</td>
                      <td>{kitchen.locationCityName || "—"}</td>

                      <td>
                        {[
                          kitchen.locationAddressLine,
                          kitchen.locationAreaName,
                          kitchen.locationPostalCode,
                        ]
                          .filter(Boolean)
                          .join(", ") || "—"}
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            kitchen.isActive === false
                              ? "text-bg-secondary"
                              : "text-bg-success"
                          }`}
                        >
                          {kitchen.isActive === false
                            ? t("kitchen.inactive")
                            : t("kitchen.active")}
                        </span>
                      </td>

                      <td className="text-end px-4">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary kitchen-edit-btn"
                          onClick={() => handleEdit(kitchen)}
                        >
                          <i className="bi bi-pencil-square me-1" />
                          {t("kitchen.edit")}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Kitchen;
