
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCart,
  updateCartItemQty,
  removeCartItem,
} from "../../api/cartService";
import "./Cart.css";

interface CartRow {
  cartItemId: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

const FALLBACK_IMAGE = "/images/tiffin.jpg";

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

function findCartRows(value: unknown): Record<string, unknown>[] {
  if (!value || typeof value !== "object") return [];

  if (Array.isArray(value)) {
    return value.filter(
      (item): item is Record<string, unknown> =>
        Boolean(item) && typeof item === "object"
    );
  }

  const object = value as Record<string, unknown>;

  for (const key of [
    "items",
    "Items",
    "cartItems",
    "CartItems",
    "data",
    "Data",
    "result",
    "Result",
  ]) {
    const nested = object[key];

    if (Array.isArray(nested)) {
      return findCartRows(nested);
    }

    if (nested && typeof nested === "object") {
      const rows = findCartRows(nested);
      if (rows.length) return rows;
    }
  }

  return [];
}

function mapCartRows(response: unknown): CartRow[] {
  return findCartRows(response)
    .map((item) => {
      const id = readValue(item, [
        "cartItemId",
        "CartItemId",
        "id",
        "Id",
      ]);

      const menuId = readValue(item, [
        "menuItemId",
        "MenuItemId",
      ]);

      const name = readValue(item, [
        "menuItemName",
        "MenuItemName",
        "name",
        "Name",
      ]);

      const price = Number(
        readValue(item, ["price", "Price", "unitPrice", "UnitPrice"]) ?? 0
      );

      const quantity = Number(
        readValue(item, ["quantity", "Quantity"]) ?? 1
      );

      const image = readValue(item, [
        "imageUrl",
        "ImageUrl",
        "image",
        "Image",
      ]);

      if (!id || !menuId) return null;

      return {
        cartItemId: String(id),
        menuItemId: String(menuId),
        name: String(name ?? "Menu Item"),
        price: Number.isFinite(price) ? price : 0,
        quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
        imageUrl: typeof image === "string" && image
          ? image
          : FALLBACK_IMAGE,
      };
    })
    .filter((item): item is CartRow => item !== null);
}

function Cart() {
  const navigate = useNavigate();

  const [items, setItems] = useState<CartRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadCart = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getCart();
      setItems(mapCartRows(response));
    } catch (err) {
      console.error("Unable to load cart:", err);
      setError(
        "Unable to load your cart. Please check the Cart API and guest cart token."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCart();
  }, [loadCart]);

  const totalQuantity = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const changeQuantity = async (
    item: CartRow,
    change: number
  ) => {
    if (busyId) return;

    const nextQuantity = item.quantity + change;
    setBusyId(item.cartItemId);
    setError("");

    try {
      if (nextQuantity <= 0) {
        await removeCartItem(item.cartItemId);

        setItems((current) =>
          current.filter(
            (row) => row.cartItemId !== item.cartItemId
          )
        );
      } else {
        await updateCartItemQty(item.cartItemId, nextQuantity);

        setItems((current) =>
          current.map((row) =>
            row.cartItemId === item.cartItemId
              ? { ...row, quantity: nextQuantity }
              : row
          )
        );
      }
    } catch (err) {
      console.error("Unable to update cart:", err);
      setError(
        "Unable to update your cart. Please try again."
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleOrderNow = () => {
    if (items.length === 0) return;

    navigate("/order", {
      state: {
        cartItems: items.map((item) => ({
          id: item.menuItemId,
          menuItemId: item.menuItemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.imageUrl,
          cartItemId: item.cartItemId,
        })),
        subtotal,
        totalQuantity,
      },
    });
  };

  return (
    <main className="cart-page">
      <section className="cart-hero">
        <div className="container">
          <p className="cart-eyebrow">AAPLA DABBA</p>
          <h1>My Cart</h1>
          <p>Review your meals before placing your order.</p>
        </div>
      </section>

      <section className="container cart-content">
        <div className="cart-heading">
          <div>
            <h2>Your Selected Meals</h2>
            <p>{totalQuantity} item(s) in your cart</p>
          </div>

          <button
            type="button"
            className="cart-continue-button"
            onClick={() => navigate("/menu")}
          >
            Continue Shopping
          </button>
        </div>

        {loading ? (
          <div className="cart-state">
            <p>Loading your cart...</p>
          </div>
        ) : error ? (
          <div className="cart-state cart-error">
            <p>{error}</p>
            <button type="button" onClick={() => void loadCart()}>
              Try Again
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="cart-state cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add your favourite homemade meals to get started.</p>
            <button
              type="button"
              className="cart-primary-button"
              onClick={() => navigate("/menu")}
            >
              Explore Menu
            </button>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {items.map((item) => (
                <article className="cart-item" key={item.cartItemId}>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    onError={(event) => {
                      event.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />

                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p>₹{item.price.toFixed(2)} each</p>

                    <div className="cart-quantity">
                      <button
                        type="button"
                        disabled={busyId !== null}
                        onClick={() => void changeQuantity(item, -1)}
                        aria-label={`Decrease ${item.name}`}
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        disabled={busyId !== null}
                        onClick={() => void changeQuantity(item, 1)}
                        aria-label={`Increase ${item.name}`}
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="cart-remove-button"
                      disabled={busyId !== null}
                      onClick={() => void changeQuantity(item, -item.quantity)}
                    >
                      Remove
                    </button>
                  </div>

                  <strong className="cart-item-total">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </strong>
                </article>
              ))}
            </div>

            <aside className="cart-summary">
              <h2>Order Summary</h2>

              <div className="cart-summary-line">
                <span>Total Items</span>
                <span>{totalQuantity}</span>
              </div>

              <div className="cart-summary-line">
                <span>Subtotal</span>
                <strong>₹{subtotal.toFixed(2)}</strong>
              </div>

              <p className="cart-delivery-note">
                Delivery charges, if applicable, will be confirmed separately.
              </p>

              <button
                type="button"
                className="cart-primary-button cart-order-button"
                disabled={items.length === 0 || busyId !== null}
                onClick={handleOrderNow}
              >
                Order Now
              </button>

              <button
                type="button"
                className="cart-back-button"
                onClick={() => navigate("/menu")}
              >
                Add More Meals
              </button>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}

export default Cart;
