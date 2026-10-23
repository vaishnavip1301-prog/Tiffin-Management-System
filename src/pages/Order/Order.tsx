
import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./Order.css";

type MealPlan = "Daily" | "Weekly" | "Monthly";

const plans = [
  {
    name: "Daily" as MealPlan,
    price: 120,
    duration: "Per day",
    description: "Fresh gharghuti jevan every day",
    icon: "bi-sun",
  },
  {
    name: "Weekly" as MealPlan,
    price: 700,
    duration: "Per week",
    description: "Convenient meals for the whole week",
    icon: "bi-calendar-week",
  },
  {
    name: "Monthly" as MealPlan,
    price: 2800,
    duration: "Per month",
    description: "Your regular monthly tiffin plan",
    icon: "bi-calendar-month",
  },
];

function Order() {
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState<MealPlan>("Daily");
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [instructions, setInstructions] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const plan = plans.find((item) => item.name === selectedPlan)!;
  const total = plan.price * quantity;

  const today = new Date();
  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="order-page">
        <div className="container">
          <div className="order-success">
            <div className="order-success-icon">
              <i className="bi bi-check2-circle" />
            </div>

            <h1>Order Details Ready!</h1>
            <p>
              Please review your tiffin details below. Your order has not
              been placed yet.
            </p>

            <div className="order-review">
              <div>
                <span>Customer</span>
                <strong>{customerName}</strong>
              </div>
              <div>
                <span>Phone</span>
                <strong>{phone}</strong>
              </div>
              <div>
                <span>Meal plan</span>
                <strong>{plan.name} Tiffin</strong>
              </div>
              <div>
                <span>Quantity</span>
                <strong>{quantity}</strong>
              </div>
              <div>
                <span>Delivery date</span>
                <strong>{deliveryDate}</strong>
              </div>
              <div>
                <span>Estimated total</span>
                <strong>₹{total.toLocaleString("en-IN")}</strong>
              </div>
              <div className="order-review-address">
                <span>Delivery address</span>
                <strong>{address}, {pincode}</strong>
              </div>
              {instructions && (
                <div className="order-review-address">
                  <span>Special instructions</span>
                  <strong>{instructions}</strong>
                </div>
              )}
            </div>

            <div className="order-notice">
              <i className="bi bi-info-circle" />
              Backend order submission is not connected yet. These details
              have not been saved to the server.
            </div>

            <div className="order-success-actions">
              <button
                type="button"
                className="order-primary-btn"
                onClick={() => setSubmitted(false)}
              >
                <i className="bi bi-pencil-square" /> Edit Details
              </button>

              <button
                type="button"
                className="order-secondary-btn"
                onClick={() => navigate("/")}
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="order-page">
      <div className="order-hero">
        <div className="container">
          <div className="order-hero-content">
            <span className="order-eyebrow">
              <i className="bi bi-egg-fried" /> AAPLA DABBA
            </span>
            <h1>Your Daily Meals, <span>Made Simple.</span></h1>
            <p>
              Choose your favourite gharghuti tiffin plan and share
              your delivery details.
            </p>
            <div className="order-hero-points">
              <span><i className="bi bi-check-circle-fill" /> Homemade Taste</span>
              <span><i className="bi bi-check-circle-fill" /> Fresh Meals</span>
              <span><i className="bi bi-check-circle-fill" /> Convenient Plans</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container order-container">
        <div className="order-section-heading">
          <span>LET'S GET STARTED</span>
          <h2>Place Your Tiffin Order</h2>
          <p>Select your meal plan and enter your delivery information.</p>
        </div>

        <form className="order-form" onSubmit={handleSubmit}>
          <div className="order-form-main">
            <section className="order-card">
              <div className="order-card-heading">
                <span className="order-step">01</span>
                <div>
                  <h3>Choose Your Meal Plan</h3>
                  <p>Pick the plan that suits your routine.</p>
                </div>
              </div>

              <div className="order-plan-grid">
                {plans.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    className={`order-plan-card ${
                      selectedPlan === item.name ? "selected" : ""
                    }`}
                    onClick={() => setSelectedPlan(item.name)}
                    aria-pressed={selectedPlan === item.name}
                  >
                    <span className="order-plan-icon">
                      <i className={`bi ${item.icon}`} />
                    </span>

                    {selectedPlan === item.name && (
                      <span className="order-plan-check">
                        <i className="bi bi-check-lg" />
                      </span>
                    )}

                    <strong>{item.name}</strong>
                    <span className="order-plan-description">
                      {item.description}
                    </span>

                    <span className="order-plan-price">
                      ₹{item.price.toLocaleString("en-IN")}
                    </span>
                    <span className="order-plan-duration">
                      {item.duration}
                    </span>
                  </button>
                ))}
              </div>

              <div className="order-quantity">
                <div>
                  <strong>Number of tiffins</strong>
                  <p>Choose how many tiffins you need.</p>
                </div>

                <div className="order-quantity-control">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  >
                    <i className="bi bi-dash-lg" />
                  </button>

                  <span>{quantity}</span>

                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={quantity >= 20}
                    onClick={() => setQuantity((value) => Math.min(20, value + 1))}
                  >
                    <i className="bi bi-plus-lg" />
                  </button>
                </div>
              </div>
            </section>

            <section className="order-card">
              <div className="order-card-heading">
                <span className="order-step">02</span>
                <div>
                  <h3>Delivery Details</h3>
                  <p>Tell us where to deliver your tiffin.</p>
                </div>
              </div>

              <div className="order-input-grid">
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
                    maxLength={100}
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
                    inputMode="numeric"
                    pattern="[6-9][0-9]{9}"
                    title="Enter a valid 10-digit Indian mobile number."
                    required
                  />
                </div>

                <div className="order-field order-field-full">
                  <label htmlFor="address">Full Delivery Address *</label>
                  <textarea
                    id="address"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="House number, street, area, landmark"
                    rows={3}
                    autoComplete="street-address"
                    required
                    maxLength={500}
                  />
                </div>

                <div className="order-field">
                  <label htmlFor="pincode">PIN Code *</label>
                  <input
                    id="pincode"
                    type="text"
                    value={pincode}
                    onChange={(event) =>
                      setPincode(event.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="6-digit PIN code"
                    inputMode="numeric"
                    pattern="[1-9][0-9]{5}"
                    title="Enter a valid 6-digit PIN code."
                    required
                  />
                </div>

                <div className="order-field">
                  <label htmlFor="deliveryDate">Preferred Start Date *</label>
                  <input
                    id="deliveryDate"
                    type="date"
                    min={minDate}
                    value={deliveryDate}
                    onChange={(event) => setDeliveryDate(event.target.value)}
                    required
                  />
                </div>

                <div className="order-field order-field-full">
                  <label htmlFor="instructions">
                    Special Instructions <span>(Optional)</span>
                  </label>
                  <textarea
                    id="instructions"
                    value={instructions}
                    onChange={(event) => setInstructions(event.target.value)}
                    placeholder="Any delivery instructions or meal preferences?"
                    rows={2}
                    maxLength={500}
                  />
                </div>
              </div>
            </section>
          </div>

          <aside className="order-summary-card">
            <div className="order-summary-top">
              <span><i className="bi bi-receipt" /> ORDER SUMMARY</span>
              <h3>Your Tiffin</h3>
            </div>

            <div className="order-summary-meal">
              <div className="order-summary-icon">
                <i className="bi bi-egg-fried" />
              </div>
              <div>
                <strong>{plan.name} Tiffin Plan</strong>
                <span>{plan.duration}</span>
              </div>
            </div>

            <div className="order-summary-row">
              <span>Price per plan</span>
              <strong>₹{plan.price.toLocaleString("en-IN")}</strong>
            </div>

            <div className="order-summary-row">
              <span>Quantity</span>
              <strong>× {quantity}</strong>
            </div>

            <div className="order-summary-divider" />

            <div className="order-summary-total">
              <span>Estimated Total</span>
              <strong>₹{total.toLocaleString("en-IN")}</strong>
            </div>

            <p className="order-summary-note">
              <i className="bi bi-info-circle" />
              Delivery charges, if applicable, will be confirmed separately.
            </p>

            <button type="submit" className="order-primary-btn order-submit-btn">
              Review Order <i className="bi bi-arrow-right" />
            </button>

            <div className="order-secure-note">
              <i className="bi bi-shield-check" />
              Your details are used for your order information.
            </div>
          </aside>
        </form>
      </div>
    </section>
  );
}

export default Order;
