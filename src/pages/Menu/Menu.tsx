
import { useMemo, useState } from "react";
import "./Menu.css";

type Meal = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  tag?: string;
};

type CartEntry = {
  meal: Meal;
  quantity: number;
};

const categories = [
  "All Meals",
  "Daily Tiffin",
  "Healthy Meals",
  "Special Dishes",
];

const meals: Meal[] = [
  {
    id: 1,
    name: "Daily Veg Tiffin",
    category: "Daily Tiffin",
    description: "Fresh chapati, seasonal sabzi, dal and rice.",
    price: 120,
    image: "/images/t3.jpg",
    tag: "Popular",
  },
  {
    id: 2,
    name: "Mini Tiffin",
    category: "Daily Tiffin",
    description: "A simple and satisfying homemade meal.",
    price: 80,
    image: "/images/t4.jpg",
  },
  {
    id: 3,
    name: "Healthy Lunch Box",
    category: "Healthy Meals",
    description: "A balanced meal prepared with fresh ingredients.",
    price: 130,
    image: "/images/t5.jpg",
    tag: "Healthy Choice",
  },
  {
    id: 4,
    name: "Fresh Veg Bowl",
    category: "Healthy Meals",
    description: "A wholesome combination for your daily routine.",
    price: 140,
    image: "/images/t6.jpg",
  },
  {
    id: 5,
    name: "Maharashtrian Thali",
    category: "Special Dishes",
    description: "Traditional flavours in a complete meal.",
    price: 180,
    image: "/images/t3.jpg",
    tag: "Best Seller",
  },
  {
    id: 6,
    name: "Special Veg Thali",
    category: "Special Dishes",
    description: "A delicious variety of home-style dishes.",
    price: 200,
    image: "/images/t4.jpg",
  },
  {
    id: 7,
    name: "Premium Family Meal",
    category: "Special Dishes",
    description: "A generous meal for those who love variety.",
    price: 250,
    image: "/images/t5.jpg",
  },
  {
    id: 8,
    name: "Everyday Healthy Tiffin",
    category: "Daily Tiffin",
    description: "Comforting homemade food for busy days.",
    price: 110,
    image: "/images/t6.jpg",
  },
];

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("All Meals");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const visibleMeals = useMemo(() => {
    const query = search.trim().toLowerCase();

    return meals.filter((meal) => {
      const categoryMatches =
        activeCategory === "All Meals" ||
        meal.category === activeCategory;

      const searchMatches =
        meal.name.toLowerCase().includes(query) ||
        meal.description.toLowerCase().includes(query) ||
        meal.category.toLowerCase().includes(query);

      return categoryMatches && searchMatches;
    });
  }, [activeCategory, search]);

  const cartCount = cart.reduce(
    (total, entry) => total + entry.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, entry) => total + entry.meal.price * entry.quantity,
    0
  );

  const addToCart = (meal: Meal) => {
    setCart((current) => {
      const found = current.find((entry) => entry.meal.id === meal.id);

      if (found) {
        return current.map((entry) =>
          entry.meal.id === meal.id
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry
        );
      }

      return [...current, { meal, quantity: 1 }];
    });
  };

  const changeQuantity = (mealId: number, change: number) => {
    setCart((current) =>
      current
        .map((entry) =>
          entry.meal.id === mealId
            ? { ...entry, quantity: entry.quantity + change }
            : entry
        )
        .filter((entry) => entry.quantity > 0)
    );
  };

  const orderOnWhatsApp = () => {
    if (cart.length === 0) return;

    const lines = cart.map(
      ({ meal, quantity }) =>
        `${meal.name} x ${quantity} = Rs. ${meal.price * quantity}`
    );

    const message = [
      "Hello Aapla Dabba!",
      "I would like to order:",
      "",
      ...lines,
      "",
      `Total: Rs. ${cartTotal}`,
      "Please confirm my order and delivery details.",
    ].join("\n");

    // Replace this sample number with your business WhatsApp number.
    const whatsappNumber = "919999999999";

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <main className="menu-page">
      <section className="menu-hero">
        <div className="menu-hero-shade" />
        <div className="container menu-hero-content">
          <span className="menu-kicker">FRESH • HOMEMADE • DELICIOUS</span>
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

          <div className="row g-4">
            {visibleMeals.map((meal) => {
              const cartEntry = cart.find(
                (entry) => entry.meal.id === meal.id
              );

              return (
                <div className="col-sm-6 col-lg-4 col-xl-3" key={meal.id}>
                  <article className="meal-card">
                    <div className="meal-image-wrap">
                      <img
                        src={meal.image}
                        alt={meal.name}
                        className="meal-image"
                        loading="lazy"
                      />
                      {meal.tag && (
                        <span className="meal-tag">{meal.tag}</span>
                      )}
                    </div>

                    <div className="meal-card-body">
                      <span className="meal-category">{meal.category}</span>
                      <h3>{meal.name}</h3>
                      <p>{meal.description}</p>

                      <div className="meal-card-bottom">
                        <strong className="meal-price">₹{meal.price}</strong>
                        <button
                          type="button"
                          className="meal-add-button"
                          onClick={() => addToCart(meal)}
                        >
                          {cartEntry ? `Added (${cartEntry.quantity})` : "Add +"}
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>

          {visibleMeals.length === 0 && (
            <div className="menu-no-results">
              <h3>No meals found</h3>
              <p>Try another search or select a different category.</p>
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
        </div>
      </section>

      <section className="menu-cta">
        <div className="container">
          <div className="menu-cta-inner">
            <div>
              <span className="menu-section-kicker">YOUR NEXT MEAL AWAITS</span>
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
                      <img src={meal.image} alt={meal.name} />
                      <div className="menu-cart-row-info">
                        <h3>{meal.name}</h3>
                        <p>₹{meal.price} each</p>
                        <div className="menu-quantity">
                          <button
                            type="button"
                            onClick={() => changeQuantity(meal.id, -1)}
                            aria-label={`Decrease ${meal.name}`}
                          >
                            −
                          </button>
                          <span>{quantity}</span>
                          <button
                            type="button"
                            onClick={() => changeQuantity(meal.id, 1)}
                            aria-label={`Increase ${meal.name}`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <strong>₹{meal.price * quantity}</strong>
                    </div>
                  ))}
                </div>

                <div className="menu-cart-footer">
                  <div className="menu-cart-total">
                    <span>Total</span>
                    <strong>₹{cartTotal}</strong>
                  </div>
                  <button
                    type="button"
                    className="menu-whatsapp-button"
                    onClick={orderOnWhatsApp}
                  >
                    Order on WhatsApp
                  </button>
                  <p>Delivery charges, if applicable, are confirmed separately.</p>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
