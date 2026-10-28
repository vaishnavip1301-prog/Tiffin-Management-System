import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Order.css";

type CartOrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  cartItemId?: string;
  image?: string;
};

type Plan = {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
};

type OrderLocationState = {
  cartItems?: CartOrderItem[];
};

const plans: Plan[] = [
  {
    id: "daily",
    name: "Daily Plan",
    price: 120,
    duration: "per day",
    description: "Fresh homemade meals for your everyday needs.",
  },
  {
    id: "weekly",
    name: "Weekly Plan",
    price: 700,
    duration: "per week",
    description: "Convenient homemade meals throughout the week.",
  },
  {
    id: "monthly",
    name: "Monthly Plan",
    price: 2800,
    duration: "per month",
    description: "An affordable monthly homemade meal plan.",
  },
];

const FALLBACK_IMAGE = "/images/tiffin.jpg";

export default function Order() {
  const navigate = useNavigate();
  const location = useLocation();

  const routeState = location.state as OrderLocationState | null;
  const cartItems = routeState?.cartItems ?? [];
  const isCartOrder = cartItems.length > 0;

  const [selectedPlan, setSelectedPlan] = useState("daily");
  const [quantity, setQuantity] = useState(1);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [instructions, setInstructions] = useState("");

  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const currentPlan =
    plans.find((plan) => plan.id === selectedPlan) ?? plans[0];

  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total + Number(item.price) * Number(item.quantity),
        0,
      ),
    [cartItems],
  );

  const planTotal = currentPlan.price * quantity;
  const totalAmount = isCartOrder ? cartTotal : planTotal;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!customerName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (!address.trim()) {
      setError("Please enter your delivery address.");
      return;
    }

    if (!/^\d{6}$/.test(pincode.trim())) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    if (!deliveryDate) {
      setError("Please select your delivery date.");
      return;
    }

    if (isCartOrder && cartItems.length === 0) {
      setError("Your cart is empty. Please add a meal first.");
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="order-page">
        <section className="order-container">
          <div className="order-success">
            <div className="order-success-icon">✓</div>

            <h1>Order Details Submitted!</h1>

            <p>
              Your order details have been reviewed. Please contact Aapla
              Dabba to confirm availability and delivery.
            </p>

            <div className="order-review-card">
              <h2>Order Summary</h2>

              <div className="order-review-row">
                <span>Customer</span>
                <strong>{customerName}</strong>
              </div>

              <div className="order-review-row">
                <span>Phone</span>
                <strong>{phone}</strong>
              </div>

              <div className="order-review-row">
                <span>Delivery Date</span>
                <strong>{deliveryDate}</strong>
              </div>

              {isCartOrder ? (
                <>
                  <h3>Selected Meals</h3>

                  {cartItems.map((item) => (
                    <div
                      className="order-review-row"
                      key={item.id}
                    >
                      <span>
                        {item.name} × {item.quantity}
                      </span>

                      <strong>
                        ₹{(
                          Number(item.price) * item.quantity
                        ).toFixed(2)}
                      </strong>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div className="order-review-row">
                    <span>Selected Plan</span>
                    <strong>{currentPlan.name}</strong>
                  </div>

                  <div className="order-review-row">
                    <span>Quantity</span>
                    <strong>{quantity}</strong>
                  </div>
                </>
              )}

              <div className="order-review-row">
                <span>Delivery Address</span>
                <strong>{address}</strong>
              </div>

              <div className="order-review-row">
                <span>Pincode</span>
                <strong>{pincode}</strong>
              </div>

              {instructions.trim() && (
                <div className="order-review-row">
                  <span>Instructions</span>
                  <strong>{instructions}</strong>
                </div>
              )}

              <div className="order-review-total">
                <span>Total Amount</span>
                <strong>₹{totalAmount.toFixed(2)}</strong>
              </div>
            </div>

            <p className="order-note">
              Note: This page currently displays your order summary. The
              order has not been saved to a backend order API.
            </p>

            <div className="order-success-actions">
              <button
                type="button"
                className="order-secondary-button"
                onClick={() => navigate("/menu")}
              >
                Back to Menu
              </button>

              <button
                type="button"
                className="order-primary-button"
                onClick={() => navigate("/")}
              >
                Go to Home
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="order-page">
      <section className="order-hero">
        <div className="container">
          <span className="order-kicker">AAPLA DABBA</span>
          <h1>Place Your Order</h1>
          <p>Fresh homemade meals, delivered with care.</p>
        </div>
      </section>

      <section className="order-container">
        <div className="order-heading">
          <h2>
            {isCartOrder ? "Your Selected Meals" : "Choose Your Meal Plan"}
          </h2>

          <p>
            {isCartOrder
              ? "Review your cart and enter your delivery details."
              : "Select the plan that suits your needs."}
          </p>
        </div>

        <form className="order-form" onSubmit={handleSubmit}>
          {isCartOrder ? (
            <section className="order-section">
              <h3>Cart Summary</h3>

              <div className="order-selected-meals">
                {cartItems.map((item) => (
                  <div
                    className="order-selected-meal"
                    key={item.id}
                  >
                    <img
                      src={item.image || FALLBACK_IMAGE}
                      alt={item.name}
                      onError={(event) => {
                        const image = event.currentTarget;

                        if (image.dataset.fallbackApplied === "true") {
                          return;
                        }

                        image.dataset.fallbackApplied = "true";
                        image.src = FALLBACK_IMAGE;
                      }}
                    />

                    <div className="order-selected-meal-info">
                      <h4>{item.name}</h4>

                      <p>
                        ₹{Number(item.price).toFixed(2)} × {item.quantity}
                      </p>
                    </div>

                    <strong>
                      ₹{(
                        Number(item.price) * item.quantity
                      ).toFixed(2)}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="order-total-row">
                <span>Total Amount</span>
                <strong>₹{cartTotal.toFixed(2)}</strong>
              </div>

              <button
                type="button"
                className="order-secondary-button"
                onClick={() => navigate("/menu")}
              >
                Back to Menu
              </button>
            </section>
          ) : (
            <section className="order-section">
              <h3>Select a Plan</h3>

              <div className="order-plan-grid">
                {plans.map((plan) => (
                  <button
                    type="button"
                    key={plan.id}
                    className={
                      selectedPlan === plan.id
                        ? "order-plan-card active"
                        : "order-plan-card"
                    }
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <span className="order-plan-name">{plan.name}</span>

                    <strong className="order-plan-price">
                      ₹{plan.price}
                    </strong>

                    <span className="order-plan-duration">
                      {plan.duration}
                    </span>

                    <p>{plan.description}</p>

                    <span className="order-plan-select">
                      {selectedPlan === plan.id
                        ? "Selected"
                        : "Select Plan"}
                    </span>
                  </button>
                ))}
              </div>

              <div className="order-quantity-row">
                <label htmlFor="planQuantity">Number of plans</label>

                <div className="order-quantity-control">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((current) => Math.max(1, current - 1))
                    }
                    disabled={quantity <= 1}
                    aria-label="Decrease plan quantity"
                  >
                    −
                  </button>

                  <span>{quantity}</span>

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((current) => current + 1)
                    }
                    aria-label="Increase plan quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="order-total-row">
                <span>Total Amount</span>
                <strong>₹{planTotal.toFixed(2)}</strong>
              </div>
            </section>
          )}

          <section className="order-section">
            <h3>Delivery Details</h3>

            <div className="order-fields-grid">
              <div className="order-field">
                <label htmlFor="customerName">Full Name *</label>

                <input
                  id="customerName"
                  type="text"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="order-field">
                <label htmlFor="phone">Mobile Number *</label>

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  placeholder="10-digit mobile number"
                  autoComplete="tel"
                  maxLength={10}
                  required
                />
              </div>

              <div className="order-field order-field-full">
                <label htmlFor="address">Delivery Address *</label>

                <textarea
                  id="address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="Flat number, building, street, area..."
                  rows={3}
                  autoComplete="street-address"
                  required
                />
              </div>

              <div className="order-field">
                <label htmlFor="pincode">Pincode *</label>

                <input
                  id="pincode"
                  type="text"
                  inputMode="numeric"
                  value={pincode}
                  onChange={(event) =>
                    setPincode(
                      event.target.value.replace(/\D/g, "").slice(0, 6),
                    )
                  }
                  placeholder="6-digit pincode"
                  maxLength={6}
                  required
                />
              </div>

              <div className="order-field">
                <label htmlFor="deliveryDate">Delivery Date *</label>

                <input
                  id="deliveryDate"
                  type="date"
                  value={deliveryDate}
                  onChange={(event) => setDeliveryDate(event.target.value)}
                  min={new Date().toLocaleDateString("en-CA")}
                  required
                />
              </div>

              <div className="order-field order-field-full">
                <label htmlFor="instructions">
                  Special Instructions (Optional)
                </label>

                <textarea
                  id="instructions"
                  value={instructions}
                  onChange={(event) => setInstructions(event.target.value)}
                  placeholder="Any delivery instructions or food preferences..."
                  rows={3}
                />
              </div>
            </div>
          </section>

          {error && (
            <p className="order-error" role="alert">
              {error}
            </p>
          )}

          <div className="order-submit-area">
            <div className="order-submit-total">
              <span>Total Payable</span>
              <strong>₹{totalAmount.toFixed(2)}</strong>
            </div>

            <button
              type="submit"
              className="order-primary-button"
              disabled={isCartOrder && cartItems.length === 0}
            >
              Review Order
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}