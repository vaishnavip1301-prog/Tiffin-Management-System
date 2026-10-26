import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

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
        setMessage("Kitchen list refreshed successfully.");
        setMessageType("success");
      }
    } catch (error) {
      console.error("Get Kitchen API error:", error);

      setMessage("Kitchen data could not be loaded. Please check the API endpoint.");
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

      setMessage("Kitchen updated successfully.");
      setMessageType("success");

      resetForm();
      await loadKitchens();
    } catch (error) {
      console.error("Update Kitchen API error:", error);

      setMessage(
        "Kitchen update failed. Please check the UpdateKitchen API and request fields."
      );
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
          <h2 className="fw-bold mb-1">Kitchen Management</h2>
          <p className="text-secondary mb-0">
            View and update kitchen information.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-success"
          onClick={() => void loadKitchens(true)}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-1" />
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* API message */}
      {message && (
        <div
          className={`alert alert-${messageType} alert-dismissible fade show`}
          role="alert"
        >
          {message}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
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
                <h5 className="fw-bold mb-1">Update Kitchen</h5>
                <p className="text-secondary small mb-0">
                  Edit the kitchen information below.
                </p>
              </div>

              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Kitchen ID
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
                        Kitchen Name *
                      </label>
                      <input
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter kitchen name"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Owner Name
                      </label>
                      <input
                        className="form-control"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        placeholder="Enter owner name"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Enter mobile number"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        City
                      </label>
                      <input
                        className="form-control"
                        name="locationCityName"
                        value={formData.locationCityName}
                        onChange={handleChange}
                        placeholder="Enter city"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Area
                      </label>
                      <input
                        className="form-control"
                        name="locationAreaName"
                        value={formData.locationAreaName}
                        onChange={handleChange}
                        placeholder="Enter area"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        State
                      </label>
                      <input
                        className="form-control"
                        name="locationStateName"
                        value={formData.locationStateName}
                        onChange={handleChange}
                        placeholder="Enter state"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Postal Code
                      </label>
                      <input
                        className="form-control"
                        name="locationPostalCode"
                        value={formData.locationPostalCode}
                        onChange={handleChange}
                        placeholder="Enter postal code"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Address
                      </label>
                      <textarea
                        className="form-control"
                        name="locationAddressLine"
                        rows={2}
                        value={formData.locationAddressLine}
                        onChange={handleChange}
                        placeholder="Enter kitchen address"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Landmark
                      </label>
                      <textarea
                        className="form-control"
                        name="locationLandmark"
                        rows={2}
                        value={formData.locationLandmark}
                        onChange={handleChange}
                        placeholder="Enter nearby landmark"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Description
                      </label>
                      <textarea
                        className="form-control"
                        name="description"
                        rows={2}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter kitchen description"
                      />
                    </div>

                    <div className="col-12 d-flex justify-content-end gap-2 mt-4">
                      <button
                        type="button"
                        className="btn btn-outline-secondary px-4"
                        onClick={resetForm}
                        disabled={saving}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="btn btn-success px-4"
                        disabled={saving}
                      >
                        {saving ? "Updating..." : "Update Kitchen"}
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
          <h5 className="fw-bold mb-1">All Kitchens</h5>
          <p className="text-secondary small mb-0">
            Total kitchens: {kitchens.length}
          </p>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-4">Kitchen</th>
                  <th>Owner</th>
                  <th>Mobile</th>
                  <th>City</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th className="text-end px-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-5">
                      <div className="spinner-border text-success mb-2" />
                      <p className="text-secondary mb-0">
                        Loading kitchen data...
                      </p>
                    </td>
                  </tr>
                ) : kitchens.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-5">
                      <i className="bi bi-shop fs-1 text-secondary d-block mb-2" />
                      <h6 className="fw-semibold">No kitchens found</h6>
                      <p className="text-secondary small mb-0">
                        The API returned no kitchen records.
                      </p>
                    </td>
                  </tr>
                ) : (
                  kitchens.map((kitchen) => (
                    <tr key={kitchen.id}>
                      <td className="px-4">
                        <div className="fw-semibold">
                          {kitchen.name || "Unnamed Kitchen"}
                        </div>
                        <small className="text-secondary">
                          {kitchen.email || "No email"}
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
                            ? "Inactive"
                            : "Active"}
                        </span>
                      </td>

                      <td className="text-end px-4">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary kitchen-edit-btn"
                          onClick={() => handleEdit(kitchen)}
                        >
                          <i className="bi bi-pencil-square me-1" />
                          Edit
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
