
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { MenuItem } from "../../api/menuItemService";
import { getMenuItems } from "../../api/menuItemService";
import {
  addCartItem,
  getCart,
  removeCartItem,
  updateCartItemQty,
} from "../../api/cartService";
import "./Menu.css";

type CartEntry = {
  meal: MenuItem;
  quantity: number;
  cartItemId?: string;
};

const PAGE_SIZE = 100;
const FALLBACK_IMAGE = "/images/tiffin.jpg";

function getMealImage(meal: MenuItem): string {
  const name = meal.name.toLowerCase().replace(/[^a-z0-9]/g, "");

  const imageMap: Record<string, string> = {
    butterroti: "/images/butterroti.jpg",
    chapati: "/images/chapati.jpg",
    chapatibhajithali: "/images/chapatibhaji.jpg",
    dalrice: "/images/dalrice.jpg",
    filtercoffee: "/images/filtercoffee.jpg",
    freshlimewater: "/images/limejuice.jpg",
    gajarhalawa: "/images/gajarhalwa.jpg",
    gajarhalwa: "/images/gajarhalwa.jpg",
    jirarice: "/images/jirarice.jpg",
    jeerarice: "/images/jirarice.jpg",
    kandabhaji: "/images/KandaBhaji.jpg",
    kandapoha: "/images/kandapohe.jpg",
    poha: "/images/kandapohe.jpg",
    maharashtrianvegthali: "/images/maharashtrianveg.jpg",
    masalachai: "/images/masalachai.jpg",
    minivegthali: "/images/vegthali.jpg",
    paneermasala: "/images/paneermasala.jpg",
    paratha: "/images/paratha.jpg",
    puranpoli: "/images/puranpoli.jpg",
    upma: "/images/upma.jpg",
    vadapav: "/images/vadapav.jpg",
    vegsandwich: "/images/vegsandwich.jpg",
    vegpulao: "/images/vegpulao.jpg",
    zunkabhakri: "/images/zunkabhakri.jpg",
  };

  if (imageMap[name]) return imageMap[name];

  if (
    name.includes("chapati") ||
    name.includes("roti") ||
    name.includes("fulka")
  ) {
    return "/images/chapati.jpg";
  }

  if (name.includes("thali")) return "/images/vegthali.jpg";

  if (name.includes("poha") || name.includes("pohe")) {
    return "/images/kandapohe.jpg";
  }

  if (name.includes("coffee")) return "/images/filtercoffee.jpg";

  if (name.includes("chai") || name.includes("tea")) {
    return "/images/masalachai.jpg";
  }

  if (
    name.includes("rice") ||
    name.includes("pulao") ||
    name.includes("pulav")
  ) {
    return "/images/vegpulao.jpg";
  }

  if (name.includes("bhaji") || name.includes("pakoda")) {
    return "/images/KandaBhaji.jpg";
  }

  if (
    name.includes("juice") ||
    name.includes("lime") ||
    name.includes("lemon")
  ) {
    return "/images/limejuice.jpg";
  }

  if (name.includes("halwa")) return "/images/gajarhalwa.jpg";
  if (name.includes("vada")) return "/images/vadapav.jpg";
  if (name.includes("sandwich")) return "/images/vegsandwich.jpg";
  if (name.includes("upma")) return "/images/upma.jpg";
  if (name.includes("puranpoli")) return "/images/puranpoli.jpg";

  if (name.includes("paneer") || name.includes("special")) {
    return "/images/paneermasala.jpg";
  }

  return FALLBACK_IMAGE;
}

function readString(
  item: Record<string, unknown>,
  ...keys: string[]
): string | undefined {
  for (const key of keys) {
    const value = item[key];

    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value);
    }
  }

  return undefined;
}

function readNumber(
  item: Record<string, unknown>,
  ...keys: string[]
): number | undefined {
  for (const key of keys) {
    const value = item[key];

    if (value !== undefined && value !== null && value !== "") {
      const number = Number(value);

      if (Number.isFinite(number)) return number;
    }
  }

  return undefined;
}

function getCartRows(response: unknown): Record<string, unknown>[] {
  if (!response || typeof response !== "object") return [];

  const object = response as Record<string, unknown>;

  for (const key of ["items", "Items", "cartItems", "CartItems"]) {
    if (Array.isArray(object[key])) {
      return object[key] as Record<string, unknown>[];
    }
  }

  for (const key of ["data", "Data", "result", "Result"]) {
    const nested = object[key];

    if (nested && typeof nested === "object") {
      const rows = getCartRows(nested);

      if (rows.length > 0) return rows;
    }
  }

  return [];
}

function getCartItemId(
  response: unknown,
  mealId: string,
): string | undefined {
  const row = getCartRows(response).find((item) => {
    const menuItemId = readString(
      item,
      "menuItemId",
      "MenuItemId",
      "menuItemID",
    );

    return menuItemId === mealId;
  });

  if (!row) return undefined;

  return readString(row, "cartItemId", "CartItemId", "id", "Id");
}

function mapCartToEntries(
  response: unknown,
  menuItems: MenuItem[],
): CartEntry[] {
  const rows = getCartRows(response);

  return rows.flatMap((row) => {
    const menuItemId = readString(
      row,
      "menuItemId",
      "MenuItemId",
      "menuItemID",
    );

    const cartItemId = readString(
      row,
      "cartItemId",
      "CartItemId",
      "id",
      "Id",
    );

    const quantity = readNumber(row, "quantity", "Quantity") ?? 1;

    if (!menuItemId || quantity < 1) return [];

    const meal = menuItems.find(
      (item) => String(item.id) === menuItemId,
    );

    if (!meal) return [];

    return [{ meal, quantity, cartItemId }];
  });
}

export default function Menu() {
  const navigate = useNavigate();

  const [meals, setMeals] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("All Meals");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartBusyId, setCartBusyId] = useState<string | null>(null);
  const [cartMessage, setCartMessage] = useState("");

  const loadMeals = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const firstResponse = await getMenuItems(1, PAGE_SIZE);
      let allItems = firstResponse.items ?? [];

      const totalRecords =
        firstResponse.totalRecords ?? allItems.length;

      const pageSize = firstResponse.pageSize || PAGE_SIZE;

      if (pageSize > 0 && allItems.length < totalRecords) {
        const totalPages = Math.ceil(totalRecords / pageSize);

        for (let page = 2; page <= totalPages; page += 1) {
          const response = await getMenuItems(page, pageSize);
          allItems = [...allItems, ...(response.items ?? [])];
        }
      }

      const uniqueItems = Array.from(
        new Map(allItems.map((item) => [item.id, item])).values(),
      );

      setMeals(uniqueItems.filter((item) => item.isActive !== false));
    } catch (err) {
      console.error("Failed to load website menu:", err);

      setError(
        "Menu items could not be loaded. Please check the API connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCart = useCallback(async () => {
    if (meals.length === 0) return;

    try {
      const response = await getCart();
      setCart(mapCartToEntries(response, meals));
    } catch (err) {
      console.error("Failed to load cart:", err);

      setCartMessage(
        "Your cart could not be loaded. Please check the Cart API response and guest cart token.",
      );
    }
  }, [meals]);

  useEffect(() => {
    void loadMeals();
  }, [loadMeals]);

  useEffect(() => {
    if (meals.length > 0) {
      void loadCart();
    }
  }, [meals, loadCart]);

  const categories = useMemo(() => {
    const names = meals
      .map((meal) => meal.categoryName?.trim())
      .filter((name): name is string => Boolean(name));

    return ["All Meals", ...new Set(names)];
  }, [meals]);

  const visibleMeals = useMemo(() => {
    const query = search.trim().toLowerCase();

    return meals.filter((meal) => {
      const categoryMatches =
        activeCategory === "All Meals" ||
        meal.categoryName?.trim() === activeCategory;

      const searchMatches = [
        meal.name,
        meal.description ?? "",
        meal.categoryName ?? "",
        meal.subCategoryName ?? "",
        meal.mealTypeName ?? "",
        meal.foodTypeName ?? "",
      ].some((value) => value.toLowerCase().includes(query));

      return categoryMatches && searchMatches;
    });
  }, [meals, activeCategory, search]);

  const cartCount = cart.reduce(
    (total, entry) => total + entry.quantity,
    0,
  );

  const cartTotal = cart.reduce(
    (total, entry) =>
      total + Number(entry.meal.price) * entry.quantity,
    0,
  );

  // Add item, refresh the cart from API and open the cart panel.
  const addToCart = async (meal: MenuItem) => {
    if (!meal.isAvailable || cartBusyId !== null) return;

    setCartBusyId(meal.id);
    setCartMessage("");

    try {
      const existing = cart.find((entry) => entry.meal.id === meal.id);

      if (existing) {
        let cartItemId = existing.cartItemId;

        if (!cartItemId) {
          const currentCart = await getCart();
          cartItemId = getCartItemId(currentCart, meal.id);
        }

        if (!cartItemId) {
          throw new Error("Cart item ID was not returned by GetCart.");
        }

        await updateCartItemQty(cartItemId, existing.quantity + 1);
      } else {
        await addCartItem({
          menuItemId: meal.id,
          quantity: 1,
        });
      }

      // Fetch the saved cart again so the UI displays API data.
      const updatedCart = await getCart();
      setCart(mapCartToEntries(updatedCart, meals));
      setCartOpen(true);
      setCartMessage(`${meal.name} added to your cart successfully!`);
    } catch (err) {
      console.error("Failed to add/update cart item:", err);

      setCartMessage(
        "Could not update cart. Please check the Cart API response and guest cart token.",
      );
    } finally {
      setCartBusyId(null);
    }
  };

  const changeQuantity = async (mealId: string, change: number) => {
    const entry = cart.find((item) => item.meal.id === mealId);

    if (!entry || cartBusyId !== null) return;

    setCartBusyId(mealId);
    setCartMessage("");

    try {
      let cartItemId = entry.cartItemId;

      if (!cartItemId) {
        const currentCart = await getCart();
        cartItemId = getCartItemId(currentCart, mealId);
      }

      if (!cartItemId) {
        throw new Error("Cart item ID was not returned by GetCart.");
      }

      if (change < 0 && entry.quantity <= 1) {
        await removeCartItem(cartItemId);

        const updatedCart = await getCart();
        setCart(mapCartToEntries(updatedCart, meals));

        return;
      }

      const nextQuantity = entry.quantity + change;

      if (nextQuantity < 1) return;

      await updateCartItemQty(cartItemId, nextQuantity);

      const updatedCart = await getCart();
      setCart(mapCartToEntries(updatedCart, meals));
    } catch (err) {
      console.error("Failed to change cart quantity:", err);

      setCartMessage(
        "Could not update quantity. Please check the Cart API response.",
      );
    } finally {
      setCartBusyId(null);
    }
  };

  const handleOrderNow = () => {
    if (cart.length === 0) {
      setCartMessage("Please add at least one meal before placing an order.");
      setCartOpen(true);
      return;
    }

    navigate("/order", {
      state: {
        cartItems: cart.map(({ meal, quantity, cartItemId }) => ({
          id: String(meal.id),
          menuItemId: String(meal.id),
          name: meal.name,
          price: Number(meal.price),
          quantity,
          cartItemId,
          image: getMealImage(meal),
        })),
        subtotal: cartTotal,
        totalQuantity: cartCount,
      },
    });
  };

  const orderOnWhatsApp = () => {
    if (cart.length === 0) return;

    const lines = cart.map(
      ({ meal, quantity }) =>
        `${meal.name} x ${quantity} = Rs. ${(
          Number(meal.price) * quantity
        ).toFixed(2)}`,
    );

    const message = [
      "Hello Aapla Dabba!",
      "I would like to order:",
      "",
      ...lines,
      "",
      `Total: Rs. ${cartTotal.toFixed(2)}`,
      "Please confirm my order and delivery details.",
    ].join("\n");

    // Replace with your actual business WhatsApp number.
    const whatsappNumber = "919999999999";

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <main className="menu-page">
      <section className="menu-hero">
        <div className="menu-hero-shade" />

        <div className="container menu-hero-content">
          <span className="menu-kicker">
            FRESH • HOMEMADE • DELICIOUS
          </span>

          <h1>Our Menu</h1>

          <p>
            Everyday comfort food, prepared with care and delivered fresh.
          </p>

          <div className="menu-breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span>All Meals</span>
          </div>
        </div>
      </section>

      <section className="menu-intro">
        <div className="container">
          <span className="menu-section-kicker">MADE WITH LOVE</span>

          <h2>
            Good Food. <span>Good Mood.</span>
          </h2>

          <p>
            Explore our daily tiffins, healthy meals and special dishes.
            Choose your favourites and add them to your cart.
          </p>
        </div>
      </section>

      <section className="menu-catalog">
        <div className="container">
          <div className="menu-toolbar">
            <div>
              <h2>Explore All Meals</h2>
              <p>Fresh food for your everyday routine.</p>
            </div>

            <label className="menu-search">
              <span aria-hidden="true">⌕</span>

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search meals..."
                aria-label="Search meals"
              />
            </label>
          </div>

          {!loading && !error && meals.length > 0 && (
            <div className="menu-filters">
              {categories.map((category) => (
                <button
                  type="button"
                  key={category}
                  className={
                    activeCategory === category
                      ? "menu-filter active"
                      : "menu-filter"
                  }
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div className="menu-no-results">
              <h3>Loading menu...</h3>
              <p>Please wait while we fetch the latest meals.</p>
            </div>
          )}

          {!loading && error && (
            <div className="menu-no-results">
              <h3>Unable to load menu</h3>
              <p>{error}</p>

              <button
                type="button"
                className="menu-reset-button"
                onClick={() => void loadMeals()}
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="row g-4">
                {visibleMeals.map((meal) => {
                  const cartEntry = cart.find(
                    (entry) => entry.meal.id === meal.id,
                  );

                  return (
                    <div
                      className="col-sm-6 col-lg-4 col-xl-3"
                      key={meal.id}
                    >
                      <article className="meal-card">
                        <div className="meal-image-wrap">
                          <img
                            src={getMealImage(meal)}
                            alt={meal.name}
                            className="meal-image"
                            loading="lazy"
                            onError={(event) => {
                              const image = event.currentTarget;

                              if (image.dataset.fallbackApplied === "true") {
                                return;
                              }

                              image.dataset.fallbackApplied = "true";
                              image.src = FALLBACK_IMAGE;
                            }}
                          />

                          {!meal.isAvailable && (
                            <span className="meal-tag">
                              Currently Unavailable
                            </span>
                          )}
                        </div>

                        <div className="meal-card-body">
                          <span className="meal-category">
                            {meal.categoryName || "Our Menu"}
                          </span>

                          <h3>{meal.name}</h3>

                          <p>
                            {meal.description ||
                              "Freshly prepared with care by Aapla Dabba."}
                          </p>

                          <div className="meal-card-bottom">
                            <strong className="meal-price">
                              ₹{Number(meal.price).toFixed(2)}
                            </strong>

                            {!meal.isAvailable ? (
                              <button
                                type="button"
                                className="meal-add-button"
                                disabled
                              >
                                Unavailable
                              </button>
                            ) : cartEntry ? (
                              <div className="menu-card-order-actions">
                                <div className="menu-quantity menu-card-quantity">
                                  <button
                                    type="button"
                                    disabled={cartBusyId !== null}
                                    onClick={() =>
                                      void changeQuantity(meal.id, -1)
                                    }
                                    aria-label={`Decrease ${meal.name}`}
                                  >
                                    −
                                  </button>

                                  <span>{cartEntry.quantity}</span>

                                  <button
                                    type="button"
                                    disabled={cartBusyId !== null}
                                    onClick={() =>
                                      void changeQuantity(meal.id, 1)
                                    }
                                    aria-label={`Increase ${meal.name}`}
                                  >
                                    +
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  className="menu-order-now-button"
                                  onClick={handleOrderNow}
                                >
                                  Order Now
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                className="meal-add-button"
                                disabled={cartBusyId !== null}
                                onClick={() => void addToCart(meal)}
                              >
                                {cartBusyId === meal.id
                                  ? "Adding..."
                                  : "Add +"}
                              </button>
                            )}
                          </div>
                        </div>
                      </article>
                    </div>
                  );
                })}
              </div>

              {visibleMeals.length === 0 && (
                <div className="menu-no-results">
                  <h3>
                    {meals.length === 0
                      ? "No menu items available"
                      : "No meals found"}
                  </h3>

                  <p>
                    {meals.length === 0
                      ? "Menu items added by the admin will appear here when available in the API."
                      : "Try another search or select a different category."}
                  </p>

                  <button
                    type="button"
                    className="menu-reset-button"
                    onClick={() => {
                      setSearch("");
                      setActiveCategory("All Meals");
                    }}
                  >
                    Show All Meals
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {cartMessage && (
        <div className="container" role="status" aria-live="polite">
          <p className="menu-cart-message">{cartMessage}</p>
        </div>
      )}

      <section className="menu-cta">
        <div className="container">
          <div className="menu-cta-inner">
            <div>
              <span className="menu-section-kicker">
                YOUR NEXT MEAL AWAITS
              </span>

              <h2>Craving a homemade meal?</h2>
              <p>Choose your favourite meals and place your order.</p>
            </div>

            <button
              type="button"
              className="menu-cta-button"
              onClick={() => setCartOpen(true)}
            >
              View Cart ({cartCount})
            </button>
          </div>
        </div>
      </section>

      <button
        type="button"
        className="menu-floating-cart"
        onClick={() => setCartOpen(true)}
        aria-label={`Open cart, ${cartCount} items`}
      >
        <span aria-hidden="true">🛒</span>
        <span>Cart</span>
        <span className="menu-cart-badge">{cartCount}</span>
      </button>

      {cartOpen && (
        <div
          className="menu-cart-backdrop"
          onClick={() => setCartOpen(false)}
        >
          <section
            className="menu-cart-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="menu-cart-heading"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="menu-cart-header">
              <div>
                <span className="menu-section-kicker">YOUR SELECTION</span>
                <h2 id="menu-cart-heading">Your Cart</h2>
              </div>

              <button
                type="button"
                className="menu-cart-close"
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="menu-cart-empty">
                <h3>Your cart is empty</h3>
                <p>Add a meal from our menu to get started.</p>

                <button
                  type="button"
                  className="menu-reset-button"
                  onClick={() => setCartOpen(false)}
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              <>
                <div className="menu-cart-items">
                  {cart.map(({ meal, quantity }) => (
                    <div className="menu-cart-row" key={meal.id}>
                      <img
                        src={getMealImage(meal)}
                        alt={meal.name}
                        onError={(event) => {
                          const image = event.currentTarget;

                          if (image.dataset.fallbackApplied === "true") {
                            return;
                          }

                          image.dataset.fallbackApplied = "true";
                          image.src = FALLBACK_IMAGE;
                        }}
                      />

                      <div className="menu-cart-row-info">
                        <h3>{meal.name}</h3>
                        <p>₹{Number(meal.price).toFixed(2)} each</p>

                        <div className="menu-quantity">
                          <button
                            type="button"
                            disabled={cartBusyId !== null}
                            onClick={() =>
                              void changeQuantity(meal.id, -1)
                            }
                            aria-label={`Decrease ${meal.name}`}
                          >
                            −
                          </button>

                          <span>{quantity}</span>

                          <button
                            type="button"
                            disabled={cartBusyId !== null}
                            onClick={() =>
                              void changeQuantity(meal.id, 1)
                            }
                            aria-label={`Increase ${meal.name}`}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <strong>
                        ₹{(Number(meal.price) * quantity).toFixed(2)}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="menu-cart-footer">
                  <div className="menu-cart-total">
                    <span>Total</span>
                    <strong>₹{cartTotal.toFixed(2)}</strong>
                  </div>

                  <button
                    type="button"
                    className="menu-order-now-button"
                    onClick={handleOrderNow}
                  >
                    Order Now
                  </button>

                  <button
                    type="button"
                    className="menu-whatsapp-button"
                    onClick={orderOnWhatsApp}
                  >
                    Order on WhatsApp
                  </button>

                  <p>
                    Delivery charges, if applicable, are confirmed separately.
                  </p>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
