import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getCart,
  updateCartItemQty,
  removeCartItem,
  validateCart,
  deleteCart,
  getGuestCartToken,
  type CartResponse,
  type CartItem,
} from "../../api/cartService";
import { getMenuItems } from "../../api/menuItemService";
import "./Cart.css";

const PAGE_SIZE = 10;

type MenuNameMap = Record<string, string>;

function CartPage() {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [menuNames, setMenuNames] = useState<MenuNameMap>({});
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [validationResult, setValidationResult] = useState<unknown>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // LOAD CART
  const loadCart = useCallback(async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const data = await getCart();
      setCart(data);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error loading cart:", err);
      setCart(null);
      setError(
        "Unable to load cart. Check the Cart API and guest cart token."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCart();
  }, [loadCart]);

  // LOAD MENU NAMES
  useEffect(() => {
    const loadMenuNames = async () => {
      try {
        const response = await getMenuItems(1, 100);
        const names: MenuNameMap = {};

        (response.items ?? []).forEach((menuItem) => {
          if (menuItem.id && menuItem.name) {
            names[menuItem.id] = menuItem.name;
          }
        });

        setMenuNames(names);
      } catch (err) {
        console.error("Error loading menu names:", err);
      }
    };

    void loadMenuNames();
  }, []);

  const getMenuName = (item: CartItem) =>
    item.name || menuNames[item.menuItemId] || "Menu name unavailable";

  const allItems = cart?.items ?? [];

  const totalPages = Math.max(
    1,
    Math.ceil(allItems.length / PAGE_SIZE)
  );

  // PAGINATION
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return allItems.slice(startIndex, startIndex + PAGE_SIZE);
  }, [allItems, currentPage]);

  // EDIT ITEM
  const handleEditItem = (item: CartItem) => {
    setSelectedItem(item);
    setQuantity(String(item.quantity));
    setError("");
    setMessage("");
  };

  // UPDATE QUANTITY
  const handleUpdateQuantity = async (item: CartItem) => {
    const newQuantity = Number(quantity);

    if (!Number.isInteger(newQuantity) || newQuantity < 1) {
      setError("Quantity must be a positive integer.");
      return;
    }

    setActionId(item.cartItemId);
    setError("");
    setMessage("");

    try {
      const updatedCart = await updateCartItemQty(
        item.cartItemId,
        newQuantity
      );

      setCart(updatedCart);
      setSelectedItem(null);
      setCurrentPage(1);
      setMessage("Cart item quantity updated successfully.");
    } catch (err) {
      console.error("Error updating cart quantity:", err);
      setError("Unable to update cart item quantity.");
    } finally {
      setActionId(null);
    }
  };

  // DELETE CART ITEM
  const handleDeleteItem = async (cartItemId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this cart item?"
    );

    if (!confirmed) return;

    setActionId(cartItemId);
    setError("");
    setMessage("");

    try {
      const updatedCart = await removeCartItem(cartItemId);

      setCart(updatedCart);

      if (selectedItem?.cartItemId === cartItemId) {
        setSelectedItem(null);
      }

      const updatedTotalPages = Math.max(
        1,
        Math.ceil((updatedCart.items?.length ?? 0) / PAGE_SIZE)
      );

      setCurrentPage((page) =>
        Math.min(page, updatedTotalPages)
      );

      setMessage("Cart item deleted successfully.");
    } catch (err) {
      console.error("Error deleting cart item:", err);
      setError("Unable to delete cart item.");
    } finally {
      setActionId(null);
    }
  };

  // VALIDATE CART
  const handleValidateCart = async () => {
    setActionId("validate");
    setError("");
    setMessage("");
    setValidationResult(null);

    try {
      const result = await validateCart();
      setValidationResult(result);
      setMessage("Cart validation request completed.");
    } catch (err) {
      console.error("Error validating cart:", err);
      setError("Unable to validate cart.");
    } finally {
      setActionId(null);
    }
  };

  // DELETE ENTIRE CART
  const handleDeleteCart = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete the entire current guest cart?"
    );

    if (!confirmed) return;

    setActionId("delete-cart");
    setError("");
    setMessage("");

    try {
      await deleteCart();

      setCart(null);
      setSelectedItem(null);
      setValidationResult(null);
      setCurrentPage(1);

      setMessage("Current guest cart deleted successfully.");
    } catch (err) {
      console.error("Error deleting cart:", err);
      setError("Unable to delete cart.");
    } finally {
      setActionId(null);
    }
  };

  const guestToken = getGuestCartToken();

  return (
    <div className="cart-management">
      {/* HEADER */}
      <div className="cart-header">
        <div>
          <h2>Cart Management</h2>
          <p>View and manage the current guest cart.</p>
        </div>

        <div className="cart-header-actions">
          <button
            type="button"
            className="cart-btn cart-btn-refresh"
            onClick={() => void loadCart()}
            disabled={loading || actionId !== null}
          >
            {loading ? "Loading..." : "↻ Refresh"}
          </button>

          <button
            type="button"
            className="cart-btn cart-btn-validate"
            onClick={() => void handleValidateCart()}
            disabled={loading || actionId !== null || !guestToken}
          >
            {actionId === "validate"
              ? "Validating..."
              : "Validate Cart"}
          </button>

          <button
            type="button"
            className="cart-btn cart-btn-delete"
            onClick={() => void handleDeleteCart()}
            disabled={loading || actionId !== null || !guestToken}
          >
            Delete Cart
          </button>
        </div>
      </div>

      {/* SUCCESS MESSAGE */}
      {message && (
        <div className="cart-alert cart-success" role="status">
          {message}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="cart-alert cart-error" role="alert">
          {error}
        </div>
      )}

      {/* SUMMARY */}
      <div className="cart-summary-grid">
        <div className="cart-summary-card">
          <span>Cart ID</span>
          <strong>{cart?.cartId || "—"}</strong>
        </div>

        <div className="cart-summary-card">
          <span>Total Items</span>
          <strong>{allItems.length}</strong>
        </div>

        <div className="cart-summary-card">
          <span>Total Quantity</span>
          <strong>{cart?.totalQuantity ?? 0}</strong>
        </div>

        <div className="cart-summary-card">
          <span>Subtotal</span>
          <strong>
            {cart?.currencyCode || "INR"}{" "}
            {Number(cart?.subtotal ?? 0).toFixed(2)}
          </strong>
        </div>
      </div>

      {/* GUEST CART TOKEN */}
      <div className="cart-token-card">
        <h3>Guest Cart Token</h3>

        <p>
          {guestToken
            ? "A guest cart token is saved in this browser."
            : "No guest cart token is currently saved. Refresh will attempt to create or load a cart."}
        </p>

        <div className="cart-token-value">
          {guestToken || "No token available"}
        </div>
      </div>

      {/* EDIT QUANTITY FORM */}
      {selectedItem && (
        <div className="cart-item-details">
          <div className="cart-details-heading">
            <h3>Edit Cart Item Quantity</h3>

            <button
              type="button"
              className="cart-close-btn"
              onClick={() => setSelectedItem(null)}
            >
              ×
            </button>
          </div>

          <p>
            <strong>Name:</strong> {getMenuName(selectedItem)}
          </p>

          <p>
            <strong>Item ID:</strong> {selectedItem.cartItemId}
          </p>

          <p>
            <strong>Menu Item ID:</strong> {selectedItem.menuItemId}
          </p>

          <p>
            <strong>Price:</strong>{" "}
            {selectedItem.currencyCode || cart?.currencyCode || "INR"}{" "}
            {Number(
              selectedItem.unitPrice ?? selectedItem.price ?? 0
            ).toFixed(2)}
          </p>

          <div className="cart-quantity-control">
            <label htmlFor="cartQuantity">Quantity</label>

            <input
              id="cartQuantity"
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(event) =>
                setQuantity(event.target.value)
              }
            />

            <button
              type="button"
              className="cart-btn cart-btn-save"
              onClick={() =>
                void handleUpdateQuantity(selectedItem)
              }
              disabled={actionId !== null}
            >
              {actionId === selectedItem.cartItemId
                ? "Updating..."
                : "Update Quantity"}
            </button>
          </div>
        </div>
      )}

      {/* VALIDATION RESPONSE */}
      {validationResult !== null && (
        <div className="cart-validation-card">
          <h3>Cart Validation Response</h3>
          <pre>
            {JSON.stringify(validationResult, null, 2)}
          </pre>
        </div>
      )}

      {/* CART TABLE */}
      <div className="cart-table-card">
        <div className="cart-table-toolbar">
          <div>
            <h3>Cart Items</h3>
            <span>{allItems.length} items found</span>
          </div>
        </div>

        {loading ? (
          <div className="cart-loading">
            Loading cart...
          </div>
        ) : !cart ? (
          <div className="cart-empty">
            <strong>No cart data available</strong>
            <p>
              Check the Cart API response and guest cart token.
            </p>
          </div>
        ) : allItems.length === 0 ? (
          <div className="cart-empty">
            <strong>Your cart is empty</strong>
            <p>
              Cart items will appear here when available.
            </p>
          </div>
        ) : (
          <>
            <div className="cart-table-wrapper">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Menu Name</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Line Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedItems.map((item, index) => (
                    <tr key={item.cartItemId}>
                      <td>
                        {(currentPage - 1) * PAGE_SIZE +
                          index +
                          1}
                      </td>

                      <td className="cart-item-name">
                        <div className="cart-product">
                          <div>
                            <strong>{getMenuName(item)}</strong>
                            <small>
                              {item.description || "—"}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td>{item.categoryName || "—"}</td>

                      <td>{item.quantity}</td>

                      <td>
                        {item.currencyCode ||
                          cart.currencyCode ||
                          "INR"}{" "}
                        {Number(
                          item.unitPrice ?? item.price ?? 0
                        ).toFixed(2)}
                      </td>

                      <td>
                        {item.currencyCode ||
                          cart.currencyCode ||
                          "INR"}{" "}
                        {Number(
                          item.lineTotal ??
                            (item.unitPrice ?? item.price ?? 0) *
                              item.quantity
                        ).toFixed(2)}
                      </td>

                      {/* ONLY EDIT AND DELETE */}
                      <td>
                        <div className="cart-action-buttons">
                          <button
                            type="button"
                            className="cart-action-btn cart-edit-btn"
                            onClick={() => handleEditItem(item)}
                            disabled={actionId !== null}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="cart-action-btn cart-delete-btn"
                            onClick={() =>
                              void handleDeleteItem(item.cartItemId)
                            }
                            disabled={actionId !== null}
                          >
                            {actionId === item.cartItemId
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

            {/* PAGINATION */}
            <div className="cart-pagination">
              <span>
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(
                  currentPage * PAGE_SIZE,
                  allItems.length
                )}{" "}
                of {allItems.length} items
              </span>

              <div className="cart-pagination-actions">
                <button
                  type="button"
                  className="cart-page-btn"
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.max(1, page - 1)
                    )
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                <span className="cart-page-number">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  className="cart-page-btn"
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(totalPages, page + 1)
                    )
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartPage;