import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  type MenuItem,
  type MenuItemInput,
  type UpdateMenuItemInput,
} from "../../api/menuItemService";
import "./MenuItem.css";

const PAGE_SIZE = 10;

const emptyForm = {
  kitchenId: "",
  menuCategoryId: "",
  name: "",
  description: "",
  mealType: "",
  price: "1",
  isAvailable: true,
  preparationTimeMinutes: "1",
  imageUrl: "",
};

type MenuItemForm = typeof emptyForm;

const menuCategories = [
  {
    id: "260CC8A1-9677-4DF5-92F7-27D730DDEE4E",
    name: "Drinks",
  },
  {
    id: "8A939413-04A7-4C35-8270-66F1173BADFB",
    name: "Maharashtrian PuranPoli Thali",
  },
  {
    id: "E9633172-4E73-450C-B5D3-6BFED76D001A",
    name: "Rice and Curry",
  },
  {
    id: "7F63FCFB-9AF4-413E-AEA0-79933139877A",
    name: "Today's Special",
  },
  {
    id: "B1E68E65-FC62-441E-9A35-83E9ED948E53",
    name: "Maharashtrian Veg Thali",
  },
  {
    id: "F193C26F-5615-40F1-BE43-90A0F4766E2F",
    name: "Maharashtrian Specials",
  },
  {
    id: "0BBEAD67-029C-4CEC-B70E-9C0D86682395",
    name: "Breads and Rotis",
  },
  {
    id: "37777CDA-4D93-432D-932C-A23B794E1754",
    name: "Quick Bites",
  },
  {
    id: "31728D82-8677-48BF-B11C-E1B83518C0DC",
    name: "Maharashtrian Thali",
  },
];

function MenuItemPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState<MenuItemForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "danger">(
    "success"
  );

  const totalPages = Math.ceil(totalRecords / PAGE_SIZE);

  // GET: Load menu items for the selected page
  const loadMenuItems = useCallback(
    async (pageNumber = currentPage, showMessage = false) => {
      setLoading(true);

      try {
        const response = await getMenuItems(pageNumber, PAGE_SIZE);

        setMenuItems(
          Array.isArray(response.items) ? response.items : []
        );
        setTotalRecords(response.totalRecords ?? 0);

        if (showMessage) {
          setMessage("Menu items refreshed successfully.");
          setMessageType("success");
        }
      } catch (error) {
        console.error("Get Menu Items API error:", error);
        setMenuItems([]);
        setTotalRecords(0);
        setMessage(
          "Menu items could not be loaded. Please check the API response and browser console."
        );
        setMessageType("danger");
      } finally {
        setLoading(false);
      }
    },
    [currentPage]
  );

  useEffect(() => {
    void loadMenuItems(currentPage);
  }, [currentPage, loadMenuItems]);

  // Handle form changes
  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = event.target;
    const { name, value } = target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        target instanceof HTMLInputElement && target.type === "checkbox"
          ? target.checked
          : value,
    }));
  };

  // Create form
  const handleCreate = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setMessage("");
  };

  // Edit form
  const handleEdit = (item: MenuItem) => {
    setFormData({
      kitchenId: item.kitchenId ?? "",
      menuCategoryId: item.menuCategoryId ?? "",
      name: item.name ?? "",
      description: item.description ?? "",
      mealType: String(item.mealType ?? ""),
      price: String(item.price ?? 0),
      isAvailable: item.isAvailable ?? true,
      preparationTimeMinutes: String(item.preparationTimeMinutes ?? 1),
      imageUrl: item.imageUrl ?? "",
    });

    setEditingId(item.id);
    setShowForm(true);
    setMessage("");
  };

  // Reset form
  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  // Create / Update
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const description = formData.description.trim() || null;
      const menuCategoryId = formData.menuCategoryId.trim() || null;
      const imageUrl = formData.imageUrl.trim() || null;

      if (!editingId && !formData.kitchenId.trim()) {
        setMessage("Kitchen ID is required.");
        setMessageType("danger");
        return;
      }

      if (!formData.name.trim()) {
        setMessage("Menu item name is required.");
        setMessageType("danger");
        return;
      }

      if (!formData.menuCategoryId.trim()) {
        setMessage("Please select a menu category.");
        setMessageType("danger");
        return;
      }

      if (!formData.mealType) {
        setMessage("Please select a meal type.");
        setMessageType("danger");
        return;
      }

      const mealType = Number(formData.mealType);
      const price = Number(formData.price);
      const preparationTimeMinutes = Number(
        formData.preparationTimeMinutes
      );

      if (
        !Number.isFinite(mealType) ||
        !Number.isFinite(price) ||
        !Number.isFinite(preparationTimeMinutes) ||
        price < 0 ||
        preparationTimeMinutes < 0
      ) {
        setMessage("Please enter valid menu item details.");
        setMessageType("danger");
        return;
      }

      if (editingId) {
        const payload: UpdateMenuItemInput = {
          id: editingId,
          menuCategoryId,
          name: formData.name.trim(),
          description,
          mealType,
          price,
          isAvailable: formData.isAvailable,
          preparationTimeMinutes,
          imageUrl,
        };

        await updateMenuItem(payload);
        setMessage("Menu item updated successfully.");
      } else {
        const payload: MenuItemInput = {
          kitchenId: formData.kitchenId.trim(),
          menuCategoryId,
          name: formData.name.trim(),
          description,
          mealType,
          price,
          isAvailable: formData.isAvailable,
          preparationTimeMinutes,
          imageUrl,
        };

        await createMenuItem(payload);
        setMessage("Menu item created successfully.");
      }

      setMessageType("success");
      resetForm();
      await loadMenuItems(currentPage);
    } catch (error) {
      console.error("Save Menu Item API error:", error);
      setMessage(
        editingId
          ? "Menu item update failed. Please check the API response."
          : "Menu item creation failed. Please check the API response."
      );
      setMessageType("danger");
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async (item: MenuItem) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}"?`
    );

    if (!confirmed) return;

    setDeletingId(item.id);
    setMessage("");

    try {
      await deleteMenuItem(item.id);

      setMessage("Menu item deleted successfully.");
      setMessageType("success");

      if (editingId === item.id) {
        resetForm();
      }

      const response = await getMenuItems(currentPage, PAGE_SIZE);
      const remainingItems = response.totalRecords ?? 0;
      const lastPage = Math.max(1, Math.ceil(remainingItems / PAGE_SIZE));

      setTotalRecords(remainingItems);

      if (currentPage > lastPage) {
        setCurrentPage(lastPage);
      } else {
        setMenuItems(response.items ?? []);
      }
    } catch (error) {
      console.error("Delete Menu Item API error:", error);
      setMessage(
        "Menu item could not be deleted. Please check the API response."
      );
      setMessageType("danger");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container-fluid py-4 menu-item-management">
      {/* Page heading */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Menu Items</h2>
          <p className="text-secondary mb-0">
            Manage your kitchen menu, prices and availability.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-success"
          onClick={handleCreate}
        >
          <i className="bi bi-plus-circle me-2" />
          Add Menu Item
        </button>
      </div>

      {/* Status message */}
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

      {/* Create / Update form */}
      {showForm && (
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-header bg-white border-0 px-4 pt-4">
            <h5 className="fw-bold mb-1">
              {editingId ? "Update Menu Item" : "Create Menu Item"}
            </h5>
            <p className="text-secondary small mb-0">
              Enter the details of your menu item.
            </p>
          </div>

          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Kitchen ID {!editingId && "*"}
                  </label>
                  <input
                    className="form-control"
                    name="kitchenId"
                    value={formData.kitchenId}
                    onChange={handleChange}
                    placeholder="Enter Kitchen ID"
                    required={!editingId}
                    disabled={Boolean(editingId)}
                  />
                </div>

                {/* Menu Category Dropdown */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Menu Category *
                  </label>
                  <select
                    className="form-select"
                    name="menuCategoryId"
                    value={formData.menuCategoryId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Menu Category</option>
                    {menuCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Menu Item Name *
                  </label>
                  <input
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Veg Thali"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Price (₹) *
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    name="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Meal Type Dropdown */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Meal Type *
                  </label>
                  <select
                    className="form-select"
                    name="mealType"
                    value={formData.mealType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Meal Type</option>
                    <option value="1">Breakfast</option>
                    <option value="2">Lunch</option>
                    <option value="3">Dinner</option>
                    <option value="4">Snacks</option>
                    <option value="5">Beverages</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Preparation Time (minutes) *
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    name="preparationTimeMinutes"
                    min="0"
                    step="1"
                    value={formData.preparationTimeMinutes}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the menu item"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">
                    Image URL
                  </label>
                  <input
                    className="form-control"
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.imageUrl.trim() && (
                    <div className="mt-3">
                      <img
                        src={formData.imageUrl}
                        alt="Menu item preview"
                        width={120}
                        height={90}
                        style={{
                          objectFit: "cover",
                          borderRadius: 10,
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="col-12">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="menuItemAvailable"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleChange}
                    />
                    <label
                      className="form-check-label fw-semibold"
                      htmlFor="menuItemAvailable"
                    >
                      Available for ordering
                    </label>
                  </div>
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
                        ? "Update Menu Item"
                        : "Save Menu Item"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Menu items table */}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-header bg-white border-0 px-4 pt-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h5 className="fw-bold mb-1">All Menu Items</h5>
              <p className="text-secondary small mb-0">
                Total items: {totalRecords}
              </p>
            </div>

            <button
              type="button"
              className="btn btn-outline-success btn-sm"
              onClick={() => void loadMenuItems(currentPage, true)}
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
                  <th className="px-4">Menu Item</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Meal Type</th>
                  <th>Prep. Time</th>
                  <th>Availability</th>
                  <th className="text-end px-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-5">
                      <div className="spinner-border text-success mb-2" />
                      <p className="text-secondary mb-0">
                        Loading menu items...
                      </p>
                    </td>
                  </tr>
                ) : menuItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-5">
                      <i className="bi bi-egg-fried fs-1 text-secondary d-block mb-2" />
                      <h6 className="fw-semibold">No menu items found</h6>
                      <p className="text-secondary small mb-3">
                        No menu items were returned by the API.
                      </p>
                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={handleCreate}
                      >
                        Add Menu Item
                      </button>
                    </td>
                  </tr>
                ) : (
                  menuItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4">
                        <div className="d-flex align-items-center gap-3">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="menu-item-thumbnail"
                            />
                          ) : (
                            <div className="menu-item-placeholder">
                              <i className="bi bi-egg-fried" />
                            </div>
                          )}

                          <div>
                            <div className="fw-semibold">
                              {item.name || "Unnamed item"}
                            </div>
                            <small className="text-secondary">
                              {item.description || "No description"}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td>{item.categoryName || "—"}</td>
                      <td className="fw-semibold">
                        ₹{Number(item.price ?? 0).toFixed(2)}
                      </td>
                      <td>{item.mealType}</td>
                      <td>{item.preparationTimeMinutes} min</td>

                      <td>
                        <span
                          className={`badge ${
                            item.isAvailable
                              ? "text-bg-success"
                              : "text-bg-secondary"
                          }`}
                        >
                          {item.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </td>

                      <td className="text-end px-4">
                        <div className="d-inline-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleEdit(item)}
                          >
                            <i className="bi bi-pencil-square me-1" />
                            Edit
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => void handleDelete(item)}
                            disabled={deletingId === item.id}
                          >
                            {deletingId === item.id ? (
                              <span className="spinner-border spinner-border-sm" />
                            ) : (
                              <>
                                <i className="bi bi-trash me-1" />
                                Delete
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 px-4 py-3 border-top">
              <small className="text-secondary">
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, totalRecords)} of{" "}
                {totalRecords} items
              </small>

              <nav aria-label="Menu items pagination">
                <ul className="pagination pagination-sm mb-0 flex-wrap">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      type="button"
                      className="page-link"
                      disabled={currentPage === 1}
                      onClick={() =>
                        setCurrentPage((page) => Math.max(1, page - 1))
                      }
                    >
                      Previous
                    </button>
                  </li>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (
                    <li
                      key={page}
                      className={`page-item ${
                        currentPage === page ? "active" : ""
                      }`}
                    >
                      <button
                        type="button"
                        className="page-link"
                        aria-current={
                          currentPage === page ? "page" : undefined
                        }
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    </li>
                  ))}

                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      type="button"
                      className="page-link"
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((page) =>
                          Math.min(totalPages, page + 1)
                        )
                      }
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuItemPage;
