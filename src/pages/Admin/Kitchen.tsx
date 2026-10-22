import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  getKitchen,
  createKitchen,
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
  addressLine: "",
  area: "",
  city: "",
  state: "",
  postalCode: "",
};

type KitchenForm = typeof emptyForm;

function Kitchen() {
  const [kitchens, setKitchens] = useState<KitchenData[]>([]);
  const [formData, setFormData] = useState<KitchenForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "danger">(
    "success"
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // GET: Fetch kitchens
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
      setMessage(
        "Kitchen data could not be loaded. Check the API URL, endpoint and browser console."
      );
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

  // Reset form
  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  // CREATE / UPDATE
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const payload: KitchenInput = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      ownerName: formData.ownerName.trim() || null,
      phoneNumber: formData.phoneNumber.trim() || null,
      email: formData.email.trim() || null,
      addressLine: formData.addressLine.trim() || null,
      area: formData.area.trim() || null,
      city: formData.city.trim() || null,
      state: formData.state.trim() || null,
      postalCode: formData.postalCode.trim() || null,
    };

    try {
      if (editingId) {
        // UPDATE: Send Kitchen ID and form data
        await updateKitchen(editingId, payload);

        setMessage("Kitchen updated successfully.");
      } else {
        // CREATE: Send new Kitchen data
        await createKitchen(payload);

        setMessage("Kitchen created successfully.");
      }

      setMessageType("success");
      resetForm();

      // Reload list after successful save
      await loadKitchens();
    } catch (error) {
      console.error("Save Kitchen API error:", error);

      setMessage(
        editingId
          ? "Kitchen update failed. Please check the UpdateKitchen API."
          : "Kitchen creation failed. Please check the CreateKitchen API."
      );

      setMessageType("danger");
    } finally {
      setSaving(false);
    }
  };

  // EDIT: Load selected Kitchen into the form
  const handleEdit = (kitchen: KitchenData) => {
    setFormData({
      name: kitchen.name ?? "",
      description: kitchen.description ?? "",
      ownerName: kitchen.ownerName ?? "",
      phoneNumber: kitchen.phoneNumber ?? "",
      email: kitchen.email ?? "",
      addressLine: kitchen.addressLine ?? "",
      area: kitchen.area ?? "",
      city: kitchen.city ?? "",
      state: kitchen.state ?? "",
      postalCode: kitchen.postalCode ?? "",
    });

    setEditingId(kitchen.id);
    setShowForm(true);
    setMessage("");
  };

  // Open empty form for creating a Kitchen
  const handleCreate = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setMessage("");
  };

  return (
    <div className="container-fluid py-4 kitchen-management">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Kitchen Management</h2>
          <p className="text-secondary mb-0">
            Create, view and update kitchen information.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-success"
          onClick={handleCreate}
        >
          <i className="bi bi-plus-circle me-2" />
          Create Kitchen
        </button>
      </div>

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

      {/* Kitchen Create / Update Form */}
      {showForm && (
        <div className="row justify-content-center mb-4">
          <div className="col-12 kitchen-form-wrapper">
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-header bg-white border-0 px-4 pt-4">
                <h5 className="fw-bold mb-1">
                  {editingId ? "Update Kitchen" : "Create Kitchen"}
                </h5>

                <p className="text-secondary small mb-0">
                  Fill in the kitchen information below.
                </p>
              </div>

              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    {/* Kitchen ID: visible only during editing */}
                    {editingId && (
                      <div className="col-12">
                        <label className="form-label fw-semibold">
                          Kitchen ID
                        </label>

                        <input
                          type="text"
                          className="form-control"
                          value={editingId}
                          disabled
                          readOnly
                        />
                      </div>
                    )}

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
                        name="city"
                        value={formData.city}
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
                        name="area"
                        value={formData.area}
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
                        name="state"
                        value={formData.state}
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
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="Enter postal code"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Address
                      </label>

                      <textarea
                        className="form-control"
                        name="addressLine"
                        rows={2}
                        value={formData.addressLine}
                        onChange={handleChange}
                        placeholder="Enter kitchen address"
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
                        {saving
                          ? "Saving..."
                          : editingId
                            ? "Update Kitchen"
                            : "Save Kitchen"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kitchen List */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-header bg-white border-0 px-4 pt-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h5 className="fw-bold mb-1">All Kitchens</h5>

              <p className="text-secondary small mb-0">
                Total kitchens: {kitchens.length}
              </p>
            </div>

            <button
              type="button"
              className="btn btn-outline-success btn-sm"
              onClick={() => void loadKitchens(true)}
              disabled={loading}
            >
              <i className="bi bi-arrow-clockwise me-1" />
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
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

                      <p className="text-secondary small mb-3">
                        The API returned no kitchen records.
                      </p>

                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={handleCreate}
                      >
                        Create Kitchen
                      </button>
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
                      <td>{kitchen.city || "—"}</td>

                      <td>
                        {[
                          kitchen.addressLine,
                          kitchen.area,
                          kitchen.postalCode,
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
                          className="btn btn-sm btn-outline-success"
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