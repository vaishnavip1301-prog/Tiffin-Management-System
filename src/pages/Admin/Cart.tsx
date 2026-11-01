import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

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

type LocalizedMenuItem = {
  id?: string;
  name?: string;
  nameEn?: string;
  nameMr?: string;
};

type LocalizedCartItem = CartItem & {
  nameEn?: string;
  nameMr?: string;
  descriptionEn?: string;
  descriptionMr?: string;
  categoryNameEn?: string;
  categoryNameMr?: string;
};

const getLocalizedValue = (
  language: string,
  english?: string | null,
  marathi?: string | null,
  fallback?: string | null
) => {
  if (language.startsWith("mr")) {
    return marathi || fallback || english || "";
  }

  return english || fallback || marathi || "";
};

function CartPage() {
  const { t, i18n } = useTranslation();

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

  const language = i18n.language;

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
      setError(t("cart.messages.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [t]);

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
          const localizedItem = menuItem as LocalizedMenuItem;

          if (localizedItem.id) {
            names[localizedItem.id] = getLocalizedValue(
              language,
              localizedItem.nameEn,
              localizedItem.nameMr,
              localizedItem.name
            );
          }
        });

        setMenuNames(names);
      } catch (err) {
        console.error("Error loading menu names:", err);
      }
    };

    void loadMenuNames();
  }, [language]);

  const getMenuName = (item: CartItem) => {
    const localizedItem = item as LocalizedCartItem;

    return (
      getLocalizedValue(
        language,
        localizedItem.nameEn,
        localizedItem.nameMr,
        localizedItem.name
      ) ||
      menuNames[item.menuItemId] ||
      t("cart.messages.menuNameUnavailable")
    );
  };

  const getItemDescription = (item: CartItem) => {
    const localizedItem = item as LocalizedCartItem;

    return getLocalizedValue(
      language,
      localizedItem.descriptionEn,
      localizedItem.descriptionMr,
      localizedItem.description
    ) || "—";
  };

  const getCategoryName = (item: CartItem) => {
    const localizedItem = item as LocalizedCartItem;

    return (
      getLocalizedValue(
        language,
        localizedItem.categoryNameEn,
        localizedItem.categoryNameMr,
        localizedItem.categoryName
      ) || "—"
    );
  };

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
      setError(t("cart.messages.invalidQuantity"));
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
      setMessage(t("cart.messages.quantityUpdated"));
    } catch (err) {
      console.error("Error updating cart quantity:", err);
      setError(t("cart.messages.quantityUpdateFailed"));
    } finally {
      setActionId(null);
    }
  };

  // DELETE CART ITEM
  const handleDeleteItem = async (cartItemId: string) => {
    const confirmed = window.confirm(
      t("cart.confirmations.deleteItem")
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

      setMessage(t("cart.messages.itemDeleted"));
    } catch (err) {
      console.error("Error deleting cart item:", err);
      setError(t("cart.messages.itemDeleteFailed"));
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
      setMessage(t("cart.messages.validationCompleted"));
    } catch (err) {
      console.error("Error validating cart:", err);
      setError(t("cart.messages.validationFailed"));
    } finally {
      setActionId(null);
    }
  };

  // DELETE ENTIRE CART
  const handleDeleteCart = async () => {
    const confirmed = window.confirm(
      t("cart.confirmations.deleteCart")
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

      setMessage(t("cart.messages.cartDeleted"));
    } catch (err) {
      console.error("Error deleting cart:", err);
      setError(t("cart.messages.cartDeleteFailed"));
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
          <h2>{t("cart.pageTitle")}</h2>
          <p>{t("cart.pageDescription")}</p>
        </div>

        <div className="cart-header-actions">
          <button
            type="button"
            className="cart-btn cart-btn-refresh"
            onClick={() => void loadCart()}
            disabled={loading || actionId !== null}
          >
            {loading
              ? t("cart.buttons.loading")
              : `↻ ${t("cart.buttons.refresh")}`}
          </button>

          <button
            type="button"
            className="cart-btn cart-btn-validate"
            onClick={() => void handleValidateCart()}
            disabled={loading || actionId !== null || !guestToken}
          >
            {actionId === "validate"
              ? t("cart.buttons.validating")
              : t("cart.buttons.validateCart")}
          </button>

          <button
            type="button"
            className="cart-btn cart-btn-delete"
            onClick={() => void handleDeleteCart()}
            disabled={loading || actionId !== null || !guestToken}
          >
            {t("cart.buttons.deleteCart")}
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
          <span>{t("cart.summary.cartId")}</span>
          <strong>{cart?.cartId || "—"}</strong>
        </div>

        <div className="cart-summary-card">
          <span>{t("cart.summary.totalItems")}</span>
          <strong>{allItems.length}</strong>
        </div>

        <div className="cart-summary-card">
          <span>{t("cart.summary.totalQuantity")}</span>
          <strong>{cart?.totalQuantity ?? 0}</strong>
        </div>

        <div className="cart-summary-card">
          <span>{t("cart.summary.subtotal")}</span>
          <strong>
            {cart?.currencyCode || "INR"}{" "}
            {Number(cart?.subtotal ?? 0).toFixed(2)}
          </strong>
        </div>
      </div>

      {/* GUEST CART TOKEN */}
      <div className="cart-token-card">
        <h3>{t("cart.token.title")}</h3>

        <p>
          {guestToken
            ? t("cart.token.saved")
            : t("cart.token.notSaved")}
        </p>

        <div className="cart-token-value">
          {guestToken || t("cart.token.unavailable")}
        </div>
      </div>

      {/* EDIT QUANTITY FORM */}
      {selectedItem && (
        <div className="cart-item-details">
          <div className="cart-details-heading">
            <h3>{t("cart.edit.title")}</h3>

            <button
              type="button"
              className="cart-close-btn"
              onClick={() => setSelectedItem(null)}
            >
              ×
            </button>
          </div>

          <p>
            <strong>{t("cart.edit.name")}:</strong>{" "}
            {getMenuName(selectedItem)}
          </p>

          <p>
            <strong>{t("cart.edit.itemId")}:</strong>{" "}
            {selectedItem.cartItemId}
          </p>

          <p>
            <strong>{t("cart.edit.menuItemId")}:</strong>{" "}
            {selectedItem.menuItemId}
          </p>

          <p>
            <strong>{t("cart.edit.price")}:</strong>{" "}
            {selectedItem.currencyCode || cart?.currencyCode || "INR"}{" "}
            {Number(
              selectedItem.unitPrice ?? selectedItem.price ?? 0
            ).toFixed(2)}
          </p>

          <div className="cart-quantity-control">
            <label htmlFor="cartQuantity">
              {t("cart.edit.quantity")}
            </label>

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
                ? t("cart.buttons.updating")
                : t("cart.buttons.updateQuantity")}
            </button>
          </div>
        </div>
      )}

      {/* VALIDATION RESPONSE */}
      {validationResult !== null && (
        <div className="cart-validation-card">
          <h3>{t("cart.validation.title")}</h3>
          <pre>
            {JSON.stringify(validationResult, null, 2)}
          </pre>
        </div>
      )}

      {/* CART TABLE */}
      <div className="cart-table-card">
        <div className="cart-table-toolbar">
          <div>
            <h3>{t("cart.table.title")}</h3>
            <span>
              {allItems.length} {t("cart.table.itemsFound")}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="cart-loading">
            {t("cart.table.loading")}
          </div>
        ) : !cart ? (
          <div className="cart-empty">
            <strong>{t("cart.table.noCartData")}</strong>
            <p>{t("cart.table.checkCartApi")}</p>
          </div>
        ) : allItems.length === 0 ? (
          <div className="cart-empty">
            <strong>{t("cart.table.emptyCart")}</strong>
            <p>{t("cart.table.emptyCartDescription")}</p>
          </div>
        ) : (
          <>
            <div className="cart-table-wrapper">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>{t("cart.table.serialNumber")}</th>
                    <th>{t("cart.table.menuName")}</th>
                    <th>{t("cart.table.category")}</th>
                    <th>{t("cart.table.quantity")}</th>
                    <th>{t("cart.table.unitPrice")}</th>
                    <th>{t("cart.table.lineTotal")}</th>
                    <th>{t("cart.table.actions")}</th>
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
                              {getItemDescription(item)}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td>{getCategoryName(item)}</td>

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

                      <td>
                        <div className="cart-action-buttons">
                          <button
                            type="button"
                            className="cart-action-btn cart-edit-btn"
                            onClick={() => handleEditItem(item)}
                            disabled={actionId !== null}
                          >
                            {t("cart.buttons.edit")}
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
                              ? t("cart.buttons.deleting")
                              : t("cart.buttons.delete")}
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
                {t("cart.pagination.showing")}{" "}
                {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(
                  currentPage * PAGE_SIZE,
                  allItems.length
                )}{" "}
                {t("cart.pagination.of")} {allItems.length}{" "}
                {t("cart.pagination.items")}
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
                  {t("cart.pagination.previous")}
                </button>

                <span className="cart-page-number">
                  {t("cart.pagination.page")} {currentPage}{" "}
                  {t("cart.pagination.of")} {totalPages}
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
                  {t("cart.pagination.next")}
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