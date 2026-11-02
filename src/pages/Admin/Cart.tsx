
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

type AdminCartItem = CartItem & {
  id?: string;
  name?: string;
  menuItemName?: string;
  unitPrice?: number;
  price?: number;
  lineTotal?: number;
};

function readValue(
  item: Record<string, unknown>,
  keys: string[]
): unknown {
  for (const key of keys) {
    if (item[key] !== undefined && item[key] !== null) {
      return item[key];
    }
  }

  return undefined;
}

function normalizeCartResponse(value: unknown): CartResponse {
  let data = value;

  if (
    data &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    "data" in data
  ) {
    data = (data as Record<string, unknown>).data;
  }

  const object =
    data && typeof data === "object" && !Array.isArray(data)
      ? (data as Record<string, unknown>)
      : {};

  const rawItems = readValue(object, [
    "items",
    "Items",
    "cartItems",
    "CartItems",
  ]);

  const items = Array.isArray(rawItems)
    ? rawItems.filter(
        (item): item is CartItem =>
          Boolean(item) && typeof item === "object"
      )
    : [];

  return {
    ...object,
    cartId: String(
      readValue(object, ["cartId", "CartId"]) ?? ""
    ),
    guestCartToken: String(
      readValue(object, ["guestCartToken", "GuestCartToken"]) ?? ""
    ),
    currencyCode: String(
      readValue(object, ["currencyCode", "CurrencyCode"]) ?? "INR"
    ),
    items,
    subtotal: Number(
      readValue(object, ["subtotal", "Subtotal"]) ?? 0
    ),
    totalQuantity: Number(
      readValue(object, ["totalQuantity", "TotalQuantity"]) ??
        items.reduce(
          (sum, item) => sum + Number(item.quantity || 0),
          0
        )
    ),
  } as CartResponse;
}

function CartPage() {
  const { t, i18n } = useTranslation();

  const [cart, setCart] = useState<CartResponse | null>(null);
  const [menuNames, setMenuNames] = useState<MenuNameMap>({});
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);
  const [quantity, setQuantity] = useState("1");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [validationResult, setValidationResult] = useState<unknown>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const language = i18n.language;

  const text = useCallback(
    (
      english: string,
      marathi: string
    ) => (language.startsWith("mr") ? marathi : english),
    [language]
  );

  // LOAD CART
  const loadCart = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getCart();
      const normalized = normalizeCartResponse(response);

      console.log("Admin Cart API Response:", response);
      console.log("Normalized Admin Cart:", normalized);

      setCart(normalized);
      setCurrentPage(1);
    } catch (err) {
      console.error("Admin cart loading failed:", err);
      setCart(null);
      setError(text(
        "Unable to load cart. Please check the Cart API.",
        "कार्ट लोड करता आला नाही. कृपया Cart API तपासा."
      ));
    } finally {
      setLoading(false);
    }
  }, [text]);

  useEffect(() => {
    void loadCart();
  }, [loadCart]);

  // LOAD MENU NAMES
  useEffect(() => {
    let active = true;

    const loadMenuNames = async () => {
      try {
        const response = await getMenuItems(1, 100);
        const names: MenuNameMap = {};

        (response.items ?? []).forEach((menuItem) => {
          const item = menuItem as {
            id?: string;
            name?: string;
            nameEn?: string;
            nameMr?: string;
          };

          if (item.id) {
            names[item.id] = language.startsWith("mr")
              ? item.nameMr || item.name || item.nameEn || "Menu Item"
              : item.nameEn || item.name || item.nameMr || "Menu Item";
          }
        });

        if (active) {
          setMenuNames(names);
        }
      } catch (err) {
        console.error("Unable to load menu names:", err);
      }
    };

    void loadMenuNames();

    return () => {
      active = false;
    };
  }, [language]);

  const allItems = cart?.items ?? [];

  const totalPages = Math.max(
    1,
    Math.ceil(allItems.length / PAGE_SIZE)
  );

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return allItems.slice(start, start + PAGE_SIZE);
  }, [allItems, currentPage]);

  const getMenuName = (item: CartItem) => {
    const localized = item as AdminCartItem;

    return (
      localized.menuItemName ||
      localized.name ||
      menuNames[item.menuItemId] ||
      "Menu Item"
    );
  };

  const getPrice = (item: CartItem) => {
    const localized = item as AdminCartItem;

    return Number(
      localized.unitPrice ?? localized.price ?? 0
    );
  };

  const getLineTotal = (item: CartItem) => {
    const localized = item as AdminCartItem;

    return Number(
      localized.lineTotal ??
        getPrice(item) * Number(item.quantity || 0)
    );
  };

  const getCartItemId = (item: CartItem) => {
    const localized = item as AdminCartItem;

    return String(
      localized.cartItemId || localized.id || ""
    );
  };

  // EDIT
  const handleEditItem = (item: CartItem) => {
    setSelectedItem(item);
    setQuantity(String(item.quantity));
    setError("");
    setMessage("");
  };

  // UPDATE QUANTITY
  const handleUpdateQuantity = async () => {
    if (!selectedItem) return;

    const newQuantity = Number(quantity);
    const cartItemId = getCartItemId(selectedItem);

    if (!Number.isInteger(newQuantity) || newQuantity < 1) {
      setError(text(
        "Enter a valid quantity.",
        "कृपया योग्य संख्या टाका."
      ));
      return;
    }

    if (!cartItemId) {
      setError(text(
        "Cart item ID is missing.",
        "Cart Item ID उपलब्ध नाही."
      ));
      return;
    }

    setActionId(cartItemId);
    setError("");
    setMessage("");

    try {
      await updateCartItemQty(cartItemId, newQuantity);
      setSelectedItem(null);
      await loadCart();

      setMessage(text(
        "Quantity updated successfully.",
        "Quantity यशस्वीरीत्या अपडेट झाली."
      ));
    } catch (err) {
      console.error("Admin quantity update failed:", err);
      setError(text(
        "Unable to update quantity.",
        "Quantity अपडेट करता आली नाही."
      ));
    } finally {
      setActionId(null);
    }
  };

  // DELETE ITEM
  const handleDeleteItem = async (item: CartItem) => {
    const cartItemId = getCartItemId(item);

    if (!cartItemId) {
      setError(text(
        "Cart item ID is missing.",
        "Cart Item ID उपलब्ध नाही."
      ));
      return;
    }

    const confirmed = window.confirm(
      text(
        "Are you sure you want to delete this item?",
        "तुम्हाला हा item delete करायचा आहे का?"
      )
    );

    if (!confirmed) return;

    setActionId(cartItemId);
    setError("");
    setMessage("");

    try {
      await removeCartItem(cartItemId);

      if (
        selectedItem &&
        getCartItemId(selectedItem) === cartItemId
      ) {
        setSelectedItem(null);
      }

      await loadCart();

      setMessage(text(
        "Cart item deleted successfully.",
        "Cart item यशस्वीरीत्या delete झाला."
      ));
    } catch (err) {
      console.error("Admin item deletion failed:", err);
      setError(text(
        "Unable to delete cart item.",
        "Cart item delete करता आला नाही."
      ));
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

      setMessage(text(
        "Cart validation completed.",
        "Cart validation पूर्ण झाले."
      ));
    } catch (err) {
      console.error("Cart validation failed:", err);
      setError(text(
        "Cart validation failed.",
        "Cart validation अयशस्वी झाले."
      ));
    } finally {
      setActionId(null);
    }
  };

  // DELETE ENTIRE CART
  const handleDeleteCart = async () => {
    const confirmed = window.confirm(
      text(
        "Are you sure you want to delete the entire cart?",
        "तुम्हाला संपूर्ण Cart delete करायचा आहे का?"
      )
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

      setMessage(text(
        "Cart deleted successfully.",
        "Cart यशस्वीरीत्या delete झाला."
      ));
    } catch (err) {
      console.error("Cart deletion failed:", err);
      setError(text(
        "Unable to delete cart.",
        "Cart delete करता आला नाही."
      ));
    } finally {
      setActionId(null);
    }
  };

  const guestToken = getGuestCartToken();

  return (
    <div className="cart-management">
      <div className="cart-header">
        <div>
          <h2>{text("Cart Management", "कार्ट व्यवस्थापन")}</h2>
          <p>
            {text(
              "View and manage guest cart items.",
              "Guest Cart मधील items पाहा आणि व्यवस्थापित करा."
            )}
          </p>
        </div>

        <div className="cart-header-actions">
          <button
            type="button"
            className="cart-btn cart-btn-refresh"
            onClick={() => void loadCart()}
            disabled={loading || actionId !== null}
          >
            ↻ {text("Refresh", "रिफ्रेश")}
          </button>

          <button
            type="button"
            className="cart-btn cart-btn-validate"
            onClick={() => void handleValidateCart()}
            disabled={loading || actionId !== null || !guestToken}
          >
            {actionId === "validate"
              ? text("Validating...", "तपासत आहे...")
              : text("Validate Cart", "कार्ट तपासा")}
          </button>

          <button
            type="button"
            className="cart-btn cart-btn-delete"
            onClick={() => void handleDeleteCart()}
            disabled={loading || actionId !== null || !guestToken}
          >
            {text("Delete Cart", "कार्ट डिलीट करा")}
          </button>
        </div>
      </div>

      {message && (
        <div className="cart-alert cart-success" role="status">
          {message}
        </div>
      )}

      {error && (
        <div className="cart-alert cart-error" role="alert">
          {error}
        </div>
      )}

      <div className="cart-summary-grid">
        <div className="cart-summary-card">
          <span>{text("Cart ID", "कार्ट आयडी")}</span>
          <strong>{cart?.cartId || "—"}</strong>
        </div>

        <div className="cart-summary-card">
          <span>{text("Total Items", "एकूण Items")}</span>
          <strong>{allItems.length}</strong>
        </div>

        <div className="cart-summary-card">
          <span>{text("Total Quantity", "एकूण संख्या")}</span>
          <strong>{cart?.totalQuantity ?? 0}</strong>
        </div>

        <div className="cart-summary-card">
          <span>{text("Subtotal", "एकूण रक्कम")}</span>
          <strong>
            {cart?.currencyCode || "INR"}{" "}
            {Number(cart?.subtotal ?? 0).toFixed(2)}
          </strong>
        </div>
      </div>

      <div className="cart-token-card">
        <h3>{text("Guest Cart Token", "Guest Cart Token")}</h3>
        <p>
          {guestToken
            ? text("Token saved in browser.", "Token browser मध्ये save आहे.")
            : text("No guest token found.", "Guest Token उपलब्ध नाही.")}
        </p>
        <div className="cart-token-value">
          {guestToken || "—"}
        </div>
      </div>

      {selectedItem && (
        <div className="cart-item-details">
          <div className="cart-details-heading">
            <h3>{text("Edit Cart Item", "Cart Item बदला")}</h3>

            <button
              type="button"
              className="cart-close-btn"
              onClick={() => setSelectedItem(null)}
            >
              ×
            </button>
          </div>

          <p>
            <strong>{text("Item Name", "Item नाव")}:</strong>{" "}
            {getMenuName(selectedItem)}
          </p>

          <p>
            <strong>Cart Item ID:</strong>{" "}
            {getCartItemId(selectedItem)}
          </p>

          <p>
            <strong>Menu Item ID:</strong>{" "}
            {selectedItem.menuItemId}
          </p>

          <p>
            <strong>{text("Unit Price", "प्रति Item किंमत")}:</strong>{" "}
            {cart?.currencyCode || "INR"}{" "}
            {getPrice(selectedItem).toFixed(2)}
          </p>

          <div className="cart-quantity-control">
            <label htmlFor="cartQuantity">
              {text("Quantity", "संख्या")}
            </label>

            <input
              id="cartQuantity"
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />

            <button
              type="button"
              className="cart-btn cart-btn-save"
              onClick={() => void handleUpdateQuantity()}
              disabled={actionId !== null}
            >
              {actionId === getCartItemId(selectedItem)
                ? text("Updating...", "अपडेट करत आहे...")
                : text("Update Quantity", "संख्या अपडेट करा")}
            </button>
          </div>
        </div>
      )}

      {validationResult !== null && (
        <div className="cart-validation-card">
          <h3>{text("Validation Response", "Validation Response")}</h3>
          <pre>{JSON.stringify(validationResult, null, 2)}</pre>
        </div>
      )}

      <div className="cart-table-card">
        <div className="cart-table-toolbar">
          <div>
            <h3>{text("Cart Items", "कार्ट Items")}</h3>
            <span>
              {allItems.length} {text("items found", "Items मिळाले")}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="cart-loading">
            {text("Loading cart...", "कार्ट लोड होत आहे...")}
          </div>
        ) : !cart ? (
          <div className="cart-empty">
            <strong>{text("No cart data", "कार्ट डेटा उपलब्ध नाही")}</strong>
          </div>
        ) : allItems.length === 0 ? (
          <div className="cart-empty">
            <strong>{text("Cart is empty", "कार्ट रिकामा आहे")}</strong>
          </div>
        ) : (
          <>
            <div className="cart-table-wrapper">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>{text("Menu Item", "Menu Item")}</th>
                    <th>{text("Quantity", "संख्या")}</th>
                    <th>{text("Unit Price", "प्रति Item किंमत")}</th>
                    <th>{text("Line Total", "एकूण किंमत")}</th>
                    <th>{text("Actions", "Actions")}</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedItems.map((item, index) => {
                    const itemId = getCartItemId(item);

                    return (
                      <tr key={itemId || `${item.menuItemId}-${index}`}>
                        <td>
                          {(currentPage - 1) * PAGE_SIZE + index + 1}
                        </td>

                        <td className="cart-item-name">
                          <strong>{getMenuName(item)}</strong>
                        </td>

                        <td>{item.quantity}</td>

                        <td>
                          {cart.currencyCode || "INR"}{" "}
                          {getPrice(item).toFixed(2)}
                        </td>

                        <td>
                          {cart.currencyCode || "INR"}{" "}
                          {getLineTotal(item).toFixed(2)}
                        </td>

                        <td>
                          <div className="cart-action-buttons">
                            <button
                              type="button"
                              className="cart-action-btn cart-edit-btn"
                              onClick={() => handleEditItem(item)}
                              disabled={!itemId || actionId !== null}
                            >
                              {text("Edit", "बदला")}
                            </button>

                            <button
                              type="button"
                              className="cart-action-btn cart-delete-btn"
                              onClick={() => void handleDeleteItem(item)}
                              disabled={!itemId || actionId !== null}
                            >
                              {text("Delete", "डिलीट")}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="cart-pagination">
              <span>
                {text("Page", "पान")} {currentPage}{" "}
                {text("of", "पैकी")} {totalPages}
              </span>

              <div className="cart-pagination-actions">
                <button
                  type="button"
                  className="cart-page-btn"
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                  disabled={currentPage === 1}
                >
                  {text("Previous", "मागील")}
                </button>

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
                  {text("Next", "पुढील")}
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
