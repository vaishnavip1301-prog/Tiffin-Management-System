
import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
      setError(t("stateManagement.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [t]);

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
      setError(t("stateManagement.detailsLoadFailed"));
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
      setError(t("stateManagement.detailsLoadFailed"));
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
        setError(t("stateManagement.requiredFields"));
        return;
      }

      if (editingId) {
        await updateState(editingId, payload);
        setMessage(t("stateManagement.updateSuccess"));
      } else {
        const stateId = addId.trim();

        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        if (!stateId) {
          setError(t("stateManagement.requiredStateId"));
          return;
        }

        if (!uuidRegex.test(stateId)) {
          setError(t("stateManagement.invalidUuid"));
          return;
        }

        await addState(stateId, {
          name: payload.name,
          code: payload.code,
        } as StateInput);

        setMessage(t("stateManagement.addSuccess"));
      }

      setShowForm(false);
      setEditingId(null);
      setViewingId(null);
      setFormData({ ...emptyForm });

      await loadStates();
    } catch (err) {
      console.error("Error saving state:", err);
      setError(t("stateManagement.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      t("stateManagement.deleteConfirmation")
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await deleteState(id);
      setMessage(t("stateManagement.deleteSuccess"));
      await loadStates();
    } catch (err) {
      console.error("Error deleting state:", err);
      setError(t("stateManagement.deleteFailed"));
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
          <h2>{t("stateManagement.pageTitle")}</h2>
          <p>{t("stateManagement.pageDescription")}</p>
        </div>

        <div className="state-header-actions">
          <button
            type="button"
            className="state-refresh-btn"
            onClick={() => void loadStates()}
            disabled={loading}
          >
            {loading
              ? t("stateManagement.loading")
              : t("stateManagement.refresh")}
          </button>

          <button
            type="button"
            className="state-add-btn"
            onClick={openAddForm}
          >
            + {t("stateManagement.addState")}
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
                  ? t("stateManagement.stateDetails")
                  : editingId
                    ? t("stateManagement.updateState")
                    : t("stateManagement.addState")}
              </h3>

              <p>
                {viewingId
                  ? t("stateManagement.viewDescription")
                  : t("stateManagement.formDescription")}
              </p>
            </div>
          </div>

          <form className="state-form" onSubmit={handleSubmit}>
            {!editingId && !viewingId && (
              <div className="state-form-group">
                <label htmlFor="addId">
                  {t("stateManagement.requiredApiId")}
                </label>

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
                <label htmlFor="stateName">
                  {t("stateManagement.stateName")}
                </label>

                <input
                  id="stateName"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t("stateManagement.enterStateName")}
                  maxLength={100}
                  required
                  disabled={Boolean(viewingId)}
                />
              </div>

              <div className="state-form-group">
                <label htmlFor="stateCode">
                  {t("stateManagement.stateCode")}
                </label>

                <input
                  id="stateCode"
                  name="code"
                  type="text"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder={t("stateManagement.stateCodePlaceholder")}
                  maxLength={10}
                  required
                  disabled={Boolean(viewingId)}
                />
              </div>

              <div className="state-form-group">
                <label htmlFor="stateActive">
                  {t("stateManagement.status")}
                </label>

                <select
                  id="stateActive"
                  name="isActive"
                  value={String(formData.isActive)}
                  onChange={handleChange}
                  disabled={Boolean(viewingId)}
                >
                  <option value="true">
                    {t("stateManagement.active")}
                  </option>
                  <option value="false">
                    {t("stateManagement.inactive")}
                  </option>
                </select>
              </div>
            </div>

            <div className="state-form-actions">
              <button
                type="button"
                className="state-cancel-btn"
                onClick={closeForm}
              >
                {viewingId
                  ? t("stateManagement.close")
                  : t("stateManagement.cancel")}
              </button>

              {!viewingId && (
                <button
                  type="submit"
                  className="state-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? t("stateManagement.saving")
                    : editingId
                      ? t("stateManagement.updateState")
                      : t("stateManagement.saveState")}
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="state-card">
        <div className="state-card-header">
          <div>
            <h3>{t("stateManagement.statesList")}</h3>
            <p>
              {t("stateManagement.totalStates", {
                count: states.length,
              })}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="state-loading">
            {t("stateManagement.loadingStates")}
          </div>
        ) : states.length === 0 ? (
          <div className="state-empty">
            <strong>{t("stateManagement.noStatesFound")}</strong>
            <p>{t("stateManagement.noStatesDescription")}</p>
          </div>
        ) : (
          <div className="state-table-wrapper">
            <table className="state-table">
              <thead>
                <tr>
                  <th>{t("stateManagement.stateName")}</th>
                  <th>{t("stateManagement.stateCode")}</th>
                  <th>{t("stateManagement.status")}</th>
                  <th>{t("stateManagement.createdAt")}</th>
                  <th>{t("stateManagement.actions")}</th>
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
                        {state.isActive
                          ? t("stateManagement.active")
                          : t("stateManagement.inactive")}
                      </span>
                    </td>

                    <td>
                      {state.createdAtUtc
                        ? new Date(
                            state.createdAtUtc
                          ).toLocaleDateString()
                        : "—"}
                    </td>

                    <td>
                      <div className="state-action-buttons">
                        {/* View button can be enabled when required.
                        <button
                          type="button"
                          className="state-view-btn"
                          onClick={() => void handleView(state.id)}
                        >
                          {t("stateManagement.view")}
                        </button>
                        */}

                        <button
                          type="button"
                          className="state-edit-btn"
                          onClick={() => void handleEdit(state.id)}
                        >
                          {t("stateManagement.edit")}
                        </button>

                        <button
                          type="button"
                          className="state-delete-btn"
                          onClick={() => void handleDelete(state.id)}
                        >
                          {t("stateManagement.delete")}
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
