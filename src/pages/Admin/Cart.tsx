
// import { useCallback, useEffect, useMemo, useState } from "react";
// import { useTranslation } from "react-i18next";

// import {
//   getAllCarts,
//   getCartById,
//   adminDeleteCart,
//   type CartResponse,
//   type CartItem,
// } from "../../api/cartService";

// import { getMenuItems } from "../../api/menuItemService";
// import "./Cart.css";

// const PAGE_SIZE = 10;

// type MenuNameMap = Record<string, string>;

// type AdminCartItem = CartItem & {
//   id?: string;
//   cartItemId?: string;
//   name?: string;
//   menuItemName?: string;
//   unitPrice?: number;
//   price?: number;
//   lineTotal?: number;
// };

// type AdminCart = CartResponse & {
//   cartId: string;
//   status?: string;
//   updatedAtUtc?: string;
//   createdAtUtc?: string;
// };

// function readValue(
//   object: Record<string, unknown>,
//   keys: string[]
// ): unknown {
//   for (const key of keys) {
//     if (object[key] !== undefined && object[key] !== null) {
//       return object[key];
//     }
//   }

//   return undefined;
// }

// function unwrapResponse(response: unknown): unknown {
//   let data = response;

//   for (let i = 0; i < 4; i++) {
//     if (
//       data &&
//       typeof data === "object" &&
//       !Array.isArray(data) &&
//       "data" in data
//     ) {
//       data = (data as Record<string, unknown>).data;
//     } else {
//       break;
//     }
//   }

//   return data;
// }

// function normalizeCart(value: unknown): AdminCart {
//   const data = unwrapResponse(value);

//   const object: Record<string, unknown> =
//     data &&
//     typeof data === "object" &&
//     !Array.isArray(data)
//       ? (data as Record<string, unknown>)
//       : {};

//   const rawItems = readValue(object, [
//     "items",
//     "Items",
//     "cartItems",
//     "CartItems",
//   ]);

//   const items = Array.isArray(rawItems)
//     ? (rawItems.filter(
//         (item) => item && typeof item === "object"
//       ) as CartItem[])
//     : [];

//   const quantity = readValue(object, [
//     "totalQuantity",
//     "TotalQuantity",
//   ]);

//   const subtotal = readValue(object, [
//     "subtotal",
//     "Subtotal",
//     "totalAmount",
//     "TotalAmount",
//   ]);

//   return {
//     ...object,
//     cartId: String(
//       readValue(object, ["cartId", "CartId", "id", "Id"]) ?? ""
//     ),
//     status: String(
//       readValue(object, ["status", "Status"]) ?? "Unknown"
//     ),
//     currencyCode: String(
//       readValue(object, ["currencyCode", "CurrencyCode"]) ?? "INR"
//     ),
//     items,
//     subtotal: Number(subtotal ?? 0),
//     totalQuantity: Number(
//       quantity ??
//         items.reduce(
//           (sum, item) => sum + Number(item.quantity || 0),
//           0
//         )
//     ),
//     updatedAtUtc: String(
//       readValue(object, [
//         "updatedAtUtc",
//         "UpdatedAtUtc",
//         "updatedAt",
//         "UpdatedAt",
//       ]) ?? ""
//     ),
//     createdAtUtc: String(
//       readValue(object, [
//         "createdAtUtc",
//         "CreatedAtUtc",
//         "createdAt",
//         "CreatedAt",
//       ]) ?? ""
//     ),
//   } as AdminCart;
// }

// function normalizeCartList(response: unknown): AdminCart[] {
//   const data = unwrapResponse(response);

//   if (Array.isArray(data)) {
//     return data
//       .map(normalizeCart)
//       .filter((cart) => Boolean(cart.cartId));
//   }

//   if (data && typeof data === "object") {
//     const object = data as Record<string, unknown>;

//     const list = readValue(object, [
//       "carts",
//       "Carts",
//       "items",
//       "Items",
//       "results",
//       "Results",
//       "value",
//       "Value",
//       "data",
//       "Data",
//     ]);

//     if (Array.isArray(list)) {
//       return list
//         .map(normalizeCart)
//         .filter((cart) => Boolean(cart.cartId));
//     }
//   }

//   return [];
// }

// function CartPage() {
//   const { i18n } = useTranslation();

//   const [carts, setCarts] = useState<AdminCart[]>([]);
//   const [menuNames, setMenuNames] = useState<MenuNameMap>({});
//   const [selectedCart, setSelectedCart] = useState<AdminCart | null>(null);

//   const [loading, setLoading] = useState(true);
//   const [detailsLoading, setDetailsLoading] = useState(false);
//   const [actionId, setActionId] = useState<string | null>(null);

//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");

//   const [currentPage, setCurrentPage] = useState(1);

//   const language = i18n.language;

//   const text = useCallback(
//     (english: string, marathi: string) =>
//       language.startsWith("mr") ? marathi : english,
//     [language]
//   );

//   // LOAD ALL CUSTOMER CARTS
//   const loadAllCarts = useCallback(async () => {
//     setLoading(true);
//     setError("");
//     setMessage("");

//     try {
//       const response = await getAllCarts();

//       console.log("All Carts API Response:", response);

//       const normalizedCarts = normalizeCartList(response);

//       console.log("Normalized All Carts:", normalizedCarts);

//       setCarts(normalizedCarts);
//       setCurrentPage(1);
//     } catch (err) {
//       console.error("All carts loading failed:", err);

//       setCarts([]);

//       setError(
//         text(
//           "Unable to load customer carts. Please check the Cart API.",
//           "ग्राहकांचे Cart लोड झाले नाहीत. कृपया Cart API तपासा."
//         )
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [text]);

//   useEffect(() => {
//     void loadAllCarts();
//   }, [loadAllCarts]);

//   // LOAD MENU ITEM NAMES
//   useEffect(() => {
//     let active = true;

//     const loadMenuNames = async () => {
//       try {
//         const response = await getMenuItems(1, 100);
//         const names: MenuNameMap = {};

//         (response.items ?? []).forEach((menuItem) => {
//           const item = menuItem as {
//             id?: string;
//             name?: string;
//             nameEn?: string;
//             nameMr?: string;
//           };

//           if (item.id) {
//             names[item.id] = language.startsWith("mr")
//               ? item.nameMr || item.name || item.nameEn || "Menu Item"
//               : item.nameEn || item.name || item.nameMr || "Menu Item";
//           }
//         });

//         if (active) {
//           setMenuNames(names);
//         }
//       } catch (err) {
//         console.error("Unable to load menu names:", err);
//       }
//     };

//     void loadMenuNames();

//     return () => {
//       active = false;
//     };
//   }, [language]);

//   // SUMMARY
//   const totalCarts = carts.length;

//   const totalItems = carts.reduce(
//     (sum, cart) => sum + cart.items.length,
//     0
//   );

//   const totalQuantity = carts.reduce(
//     (sum, cart) => sum + cart.totalQuantity,
//     0
//   );

//   const totalAmount = carts.reduce(
//     (sum, cart) => sum + cart.subtotal,
//     0
//   );

//   // PAGINATION
//   const totalPages = Math.max(
//     1,
//     Math.ceil(carts.length / PAGE_SIZE)
//   );

//   const paginatedCarts = useMemo(() => {
//     const start = (currentPage - 1) * PAGE_SIZE;
//     return carts.slice(start, start + PAGE_SIZE);
//   }, [carts, currentPage]);

//   // DATE FORMAT
//   const formatDate = (date?: string) => {
//     if (!date) return "—";

//     const parsedDate = new Date(date);

//     if (Number.isNaN(parsedDate.getTime())) {
//       return "—";
//     }

//     return parsedDate.toLocaleString(
//       language.startsWith("mr") ? "mr-IN" : "en-IN",
//       {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       }
//     );
//   };

//   // MENU ITEM NAME
//   const getMenuName = (item: CartItem) => {
//     const localized = item as AdminCartItem;

//     return (
//       localized.menuItemName ||
//       localized.name ||
//       menuNames[item.menuItemId] ||
//       "Menu Item"
//     );
//   };

//   const getPrice = (item: CartItem) => {
//     const localized = item as AdminCartItem;

//     return Number(
//       localized.unitPrice ?? localized.price ?? 0
//     );
//   };

//   const getLineTotal = (item: CartItem) => {
//     const localized = item as AdminCartItem;

//     return Number(
//       localized.lineTotal ??
//         getPrice(item) * Number(item.quantity || 0)
//     );
//   };

//   // VIEW CART DETAILS
//   const handleViewCart = async (cartId: string) => {
//     if (!cartId) return;

//     setDetailsLoading(true);
//     setSelectedCart(null);
//     setError("");
//     setMessage("");

//     try {
//       const response = await getCartById(cartId);

//       console.log("Cart Details API Response:", response);

//       const normalizedCart = normalizeCart(response);

//       setSelectedCart({
//         ...normalizedCart,
//         cartId: normalizedCart.cartId || cartId,
//       });
//     } catch (err) {
//       console.error("Cart details loading failed:", err);

//       setError(
//         text(
//           "Unable to load cart details.",
//           "Cart ची माहिती लोड करता आली नाही."
//         )
//       );
//     } finally {
//       setDetailsLoading(false);
//     }
//   };

//   // DELETE CUSTOMER CART
//   const handleDeleteCart = async (cartId: string) => {
//     const confirmed = window.confirm(
//       text(
//         "Are you sure you want to delete this customer's cart?",
//         "तुम्हाला या ग्राहकाचा Cart delete करायचा आहे का?"
//       )
//     );

//     if (!confirmed) return;

//     setActionId(cartId);
//     setError("");
//     setMessage("");

//     try {
//       await adminDeleteCart(cartId);

//       setCarts((previous) =>
//         previous.filter((cart) => cart.cartId !== cartId)
//       );

//       if (selectedCart?.cartId === cartId) {
//         setSelectedCart(null);
//       }

//       setMessage(
//         text(
//           "Customer cart deleted successfully.",
//           "ग्राहकाचा Cart यशस्वीरीत्या delete झाला."
//         )
//       );
//     } catch (err) {
//       console.error("Cart deletion failed:", err);

//       setError(
//         text(
//           "Unable to delete customer cart.",
//           "ग्राहकाचा Cart delete करता आला नाही."
//         )
//       );
//     } finally {
//       setActionId(null);
//     }
//   };

//   return (
//     <div className="cart-management">
//       {/* HEADER */}
//       <div className="cart-header">
//         <div>
//           <h2>{text("Cart Management", "कार्ट व्यवस्थापन")}</h2>

//           <p>
//             {text(
//               "View and manage all customer carts.",
//               "सर्व ग्राहकांचे Cart पाहा आणि व्यवस्थापित करा."
//             )}
//           </p>
//         </div>

//         <div className="cart-header-actions">
//           <button
//             type="button"
//             className="cart-btn cart-btn-refresh"
//             onClick={() => void loadAllCarts()}
//             disabled={loading || actionId !== null}
//           >
//             ↻ {text("Refresh", "रिफ्रेश")}
//           </button>
//         </div>
//       </div>

//       {/* ALERTS */}
//       {message && (
//         <div className="cart-alert cart-success" role="status">
//           {message}
//         </div>
//       )}

//       {error && (
//         <div className="cart-alert cart-error" role="alert">
//           {error}
//         </div>
//       )}

//       {/* SUMMARY */}
//       <div className="cart-summary-grid">
//         <div className="cart-summary-card">
//           <span>{text("Total Carts", "एकूण Cart")}</span>
//           <strong>{totalCarts}</strong>
//         </div>

//         <div className="cart-summary-card">
//           <span>{text("Total Items", "एकूण Items")}</span>
//           <strong>{totalItems}</strong>
//         </div>

//         <div className="cart-summary-card">
//           <span>{text("Total Quantity", "एकूण संख्या")}</span>
//           <strong>{totalQuantity}</strong>
//         </div>

//         <div className="cart-summary-card">
//           <span>{text("Total Amount", "एकूण रक्कम")}</span>
//           <strong>₹ {totalAmount.toFixed(2)}</strong>
//         </div>
//       </div>

//       {/* SELECTED CART DETAILS */}
//       {selectedCart && (
//         <div className="cart-item-details">
//           <div className="cart-details-heading">
//             <h3>
//               {text("Customer Cart Details", "ग्राहक Cart माहिती")}
//             </h3>

//             <button
//               type="button"
//               className="cart-close-btn"
//               onClick={() => setSelectedCart(null)}
//             >
//               ×
//             </button>
//           </div>

//           <p>
//             <strong>Cart ID:</strong> {selectedCart.cartId}
//           </p>

//           <p>
//             <strong>{text("Status", "स्थिती")}:</strong>{" "}
//             {selectedCart.status || "—"}
//           </p>

//           <p>
//             <strong>{text("Total Items", "एकूण Items")}:</strong>{" "}
//             {selectedCart.items.length}
//           </p>

//           <p>
//             <strong>{text("Total Quantity", "एकूण संख्या")}:</strong>{" "}
//             {selectedCart.totalQuantity}
//           </p>

//           <p>
//             <strong>{text("Subtotal", "एकूण रक्कम")}:</strong>{" "}
//             {selectedCart.currencyCode || "INR"}{" "}
//             {selectedCart.subtotal.toFixed(2)}
//           </p>

//           <p>
//             <strong>{text("Updated Date", "अपडेट तारीख")}:</strong>{" "}
//             {formatDate(selectedCart.updatedAtUtc)}
//           </p>

//           <h4>{text("Cart Items", "Cart मधील Items")}</h4>

//           {selectedCart.items.length === 0 ? (
//             <div className="cart-empty">
//               {text(
//                 "No items in this cart.",
//                 "या Cart मध्ये Items नाहीत."
//               )}
//             </div>
//           ) : (
//             <div className="cart-table-wrapper">
//               <table className="cart-table">
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>{text("Menu Item", "Menu Item")}</th>
//                     <th>{text("Quantity", "संख्या")}</th>
//                     <th>{text("Unit Price", "प्रति Item किंमत")}</th>
//                     <th>{text("Total", "एकूण")}</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {selectedCart.items.map((item, index) => {
//                     const localized = item as AdminCartItem;

//                     return (
//                       <tr
//                         key={
//                           localized.cartItemId ||
//                           localized.id ||
//                           `${item.menuItemId}-${index}`
//                         }
//                       >
//                         <td>{index + 1}</td>

//                         <td className="cart-item-name">
//                           <strong>{getMenuName(item)}</strong>
//                         </td>

//                         <td>{item.quantity}</td>

//                         <td>
//                           {selectedCart.currencyCode || "INR"}{" "}
//                           {getPrice(item).toFixed(2)}
//                         </td>

//                         <td>
//                           {selectedCart.currencyCode || "INR"}{" "}
//                           {getLineTotal(item).toFixed(2)}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {/* ALL CUSTOMER CARTS */}
//       <div className="cart-table-card">
//         <div className="cart-table-toolbar">
//           <div>
//             <h3>
//               {text("All Customer Carts", "सर्व ग्राहकांचे Cart")}
//             </h3>

//             <span>
//               {carts.length} {text("carts found", "Cart मिळाले")}
//             </span>
//           </div>
//         </div>

//         {loading ? (
//           <div className="cart-loading">
//             {text(
//               "Loading customer carts...",
//               "ग्राहकांचे Cart लोड होत आहेत..."
//             )}
//           </div>
//         ) : carts.length === 0 ? (
//           <div className="cart-empty">
//             <strong>
//               {text(
//                 "No customer carts found.",
//                 "ग्राहकांचे Cart उपलब्ध नाहीत."
//               )}
//             </strong>
//           </div>
//         ) : (
//           <>
//             <div className="cart-table-wrapper">
//               <table className="cart-table">
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>{text("Cart ID", "Cart ID")}</th>
//                     <th>{text("Status", "स्थिती")}</th>
//                     <th>{text("Items", "Items")}</th>
//                     <th>{text("Quantity", "संख्या")}</th>
//                     <th>{text("Subtotal", "एकूण रक्कम")}</th>
//                     <th>{text("Updated Date", "अपडेट तारीख")}</th>
//                     <th>{text("Actions", "Actions")}</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {paginatedCarts.map((cart, index) => (
//                     <tr key={cart.cartId}>
//                       <td>
//                         {(currentPage - 1) * PAGE_SIZE + index + 1}
//                       </td>

//                       <td className="cart-item-name">
//                         <strong>{cart.cartId}</strong>
//                       </td>

//                       <td>{cart.status || "—"}</td>

//                       <td>{cart.items.length}</td>

//                       <td>{cart.totalQuantity}</td>

//                       <td>
//                         {cart.currencyCode || "INR"}{" "}
//                         {cart.subtotal.toFixed(2)}
//                       </td>

//                       <td>
//                         {formatDate(
//                           cart.updatedAtUtc || cart.createdAtUtc
//                         )}
//                       </td>

//                       <td>
//                         <div className="cart-action-buttons">
//                           <button
//                             type="button"
//                             className="cart-action-btn cart-edit-btn"
//                             onClick={() => void handleViewCart(cart.cartId)}
//                             disabled={
//                               actionId !== null || detailsLoading
//                             }
//                           >
//                             {text("View", "पाहा")}
//                           </button>

//                           <button
//                             type="button"
//                             className="cart-action-btn cart-delete-btn"
//                             onClick={() =>
//                               void handleDeleteCart(cart.cartId)
//                             }
//                             disabled={actionId === cart.cartId}
//                           >
//                             {actionId === cart.cartId
//                               ? text("Deleting...", "Delete होत आहे...")
//                               : text("Delete", "Delete")}
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {detailsLoading && (
//               <div className="cart-loading">
//                 {text(
//                   "Loading cart details...",
//                   "Cart ची माहिती लोड होत आहे..."
//                 )}
//               </div>
//             )}

//             {/* PAGINATION */}
//             <div className="cart-pagination">
//               <span>
//                 {text("Page", "पान")} {currentPage}{" "}
//                 {text("of", "पैकी")} {totalPages}
//               </span>

//               <div className="cart-pagination-actions">
//                 <button
//                   type="button"
//                   className="cart-page-btn"
//                   onClick={() =>
//                     setCurrentPage((page) => Math.max(1, page - 1))
//                   }
//                   disabled={currentPage === 1}
//                 >
//                   {text("Previous", "मागील")}
//                 </button>

//                 <button
//                   type="button"
//                   className="cart-page-btn"
//                   onClick={() =>
//                     setCurrentPage((page) =>
//                       Math.min(totalPages, page + 1)
//                     )
//                   }
//                   disabled={currentPage === totalPages}
//                 >
//                   {text("Next", "पुढील")}
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default CartPage;

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  getAllCarts,
  getCartById,
  updateCartItemQty,
  adminDeleteCart,
  type CartResponse,
  type CartItem,
} from "../../api/cartService";

import { getMenuItems } from "../../api/menuItemService";
import "./Cart.css";

const PAGE_SIZE = 10;

type MenuNameMap = Record<string, string>;

type AdminCartItem = Partial<CartItem> & {
  id?: string;
  cartItemId?: string;
  name?: string;
  menuItemName?: string;
  unitPrice?: number;
  price?: number;
  lineTotal?: number;
};

type AdminCart = CartResponse & {
  cartId: string;
  status: string;
  updatedAtUtc: string;
  createdAtUtc: string;
};

function readValue(
  object: Record<string, unknown>,
  keys: string[]
): unknown {
  for (const key of keys) {
    if (object[key] !== undefined && object[key] !== null) {
      return object[key];
    }
  }

  return undefined;
}

function unwrapResponse(response: unknown): unknown {
  let data = response;

  for (let i = 0; i < 4; i++) {
    if (
      data &&
      typeof data === "object" &&
      !Array.isArray(data) &&
      "data" in data
    ) {
      data = (data as Record<string, unknown>).data;
    } else {
      break;
    }
  }

  return data;
}

// =====================================================
// NORMALIZE SINGLE CART
// =====================================================

function normalizeCart(value: unknown): AdminCart {
  const data = unwrapResponse(value);

  const object: Record<string, unknown> =
    data &&
    typeof data === "object" &&
    !Array.isArray(data)
      ? (data as Record<string, unknown>)
      : {};

  const rawItems = readValue(object, [
    "items",
    "Items",
    "cartItems",
    "CartItems",
  ]);

  const items = Array.isArray(rawItems)
    ? (rawItems.filter(
        (item) => item && typeof item === "object"
      ) as CartItem[])
    : [];

  const quantity = readValue(object, [
    "totalQuantity",
    "TotalQuantity",
  ]);

  const subtotal = readValue(object, [
    "subtotal",
    "Subtotal",
    "totalAmount",
    "TotalAmount",
  ]);

  return {
    ...object,
    cartId: String(
      readValue(object, ["cartId", "CartId", "id", "Id"]) ?? ""
    ),
    status: String(
      readValue(object, ["status", "Status"]) ?? "Unknown"
    ),
    currencyCode: String(
      readValue(object, ["currencyCode", "CurrencyCode"]) ?? "INR"
    ),
    expiresAtUtc: String(
      readValue(object, ["expiresAtUtc", "ExpiresAtUtc"]) ?? ""
    ),
    items,
    subtotal: Number(subtotal ?? 0),
    totalQuantity: Number(
      quantity ??
        items.reduce(
          (sum, item) => sum + Number(item.quantity || 0),
          0
        )
    ),
    updatedAtUtc: String(
      readValue(object, [
        "updatedAtUtc",
        "UpdatedAtUtc",
        "updatedAt",
        "UpdatedAt",
      ]) ?? ""
    ),
    createdAtUtc: String(
      readValue(object, [
        "createdAtUtc",
        "CreatedAtUtc",
        "createdAt",
        "CreatedAt",
      ]) ?? ""
    ),
  } as AdminCart;
}

// =====================================================
// NORMALIZE CART LIST
// =====================================================

function normalizeCartList(response: unknown): AdminCart[] {
  const data = unwrapResponse(response);

  if (Array.isArray(data)) {
    return data
      .map(normalizeCart)
      .filter((cart) => Boolean(cart.cartId));
  }

  if (data && typeof data === "object") {
    const object = data as Record<string, unknown>;

    const list = readValue(object, [
      "carts",
      "Carts",
      "items",
      "Items",
      "results",
      "Results",
      "value",
      "Value",
      "data",
      "Data",
    ]);

    if (Array.isArray(list)) {
      return list
        .map(normalizeCart)
        .filter((cart) => Boolean(cart.cartId));
    }
  }

  return [];
}

// =====================================================
// CART PAGE
// =====================================================

function CartPage() {
  const { i18n } = useTranslation();

  const [carts, setCarts] = useState<AdminCart[]>([]);
  const [menuNames, setMenuNames] = useState<MenuNameMap>({});
  const [selectedCart, setSelectedCart] =
    useState<AdminCart | null>(null);

  const [quantityDrafts, setQuantityDrafts] =
    useState<Record<string, string>>({});

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const language = i18n.language;

  const text = useCallback(
    (english: string, marathi: string) =>
      language.startsWith("mr") ? marathi : english,
    [language]
  );

  // ===================================================
  // GET ALL CARTS
  // GET /GetAllCarts
  // ===================================================

  const loadAllCarts = useCallback(async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await getAllCarts();

      console.log("All Carts API Response:", response);

      const normalizedCarts = normalizeCartList(response);

      console.log("Normalized All Carts:", normalizedCarts);

      setCarts(normalizedCarts);
      setCurrentPage(1);
    } catch (err) {
      console.error("All carts loading failed:", err);

      setCarts([]);

      setError(
        text(
          "Unable to load customer carts. Please check the Cart API.",
          "ग्राहकांचे Cart लोड झाले नाहीत. कृपया Cart API तपासा."
        )
      );
    } finally {
      setLoading(false);
    }
  }, [text]);

  useEffect(() => {
    void loadAllCarts();
  }, [loadAllCarts]);

  // ===================================================
  // GET MENU ITEM NAMES
  // ===================================================

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

  // ===================================================
  // SUMMARY
  // ===================================================

  const totalCarts = carts.length;

  const totalItems = carts.reduce(
    (sum, cart) => sum + cart.items.length,
    0
  );

  const totalQuantity = carts.reduce(
    (sum, cart) => sum + cart.totalQuantity,
    0
  );

  const totalAmount = carts.reduce(
    (sum, cart) => sum + cart.subtotal,
    0
  );

  // ===================================================
  // PAGINATION
  // ===================================================

  const totalPages = Math.max(
    1,
    Math.ceil(carts.length / PAGE_SIZE)
  );

  const paginatedCarts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return carts.slice(start, start + PAGE_SIZE);
  }, [carts, currentPage]);

  // ===================================================
  // DATE FORMAT
  // ===================================================

  const formatDate = (date?: string) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleString(
      language.startsWith("mr") ? "mr-IN" : "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // ===================================================
  // MENU ITEM NAME
  // ===================================================

  const getMenuName = (item: CartItem) => {
    const localized = item as AdminCartItem;

    return (
      localized.menuItemName ||
      localized.name ||
      menuNames[localized.menuItemId || ""] ||
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
        getPrice(item) * Number(localized.quantity || 0)
    );
  };

  // ===================================================
  // GET CART BY ID
  // GET /GetCartById/{cartId}
  // ===================================================

  const handleViewCart = async (cartId: string) => {
    if (!cartId) return;

    setDetailsLoading(true);
    setSelectedCart(null);
    setError("");
    setMessage("");
    setQuantityDrafts({});

    try {
      const response = await getCartById(cartId);

      console.log("Cart Details API Response:", response);

      const normalizedCart = normalizeCart(response);

      setSelectedCart({
        ...normalizedCart,
        cartId: normalizedCart.cartId || cartId,
      });
    } catch (err) {
      console.error("Cart details loading failed:", err);

      setError(
        text(
          "Unable to load cart details.",
          "Cart ची माहिती लोड करता आली नाही."
        )
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // ===================================================
  // UPDATE QUANTITY DRAFT
  // ===================================================

  const handleQuantityChange = (
    itemId: string,
    value: string
  ) => {
    setQuantityDrafts((previous) => ({
      ...previous,
      [itemId]: value,
    }));
  };

  // ===================================================
  // UPDATE CART ITEM QUANTITY
  // PUT /UpdateCartItemQty/{cartItemId}
  // Body: { quantity: number }
  // ===================================================

  const handleUpdateQuantity = async (item: CartItem) => {
    const localized = item as AdminCartItem;

    const itemId = localized.cartItemId || localized.id;

    if (!itemId) {
      setError(
        text(
          "Cart Item ID is missing.",
          "Cart Item ID उपलब्ध नाही."
        )
      );
      return;
    }

    const quantity = Number(
      quantityDrafts[itemId] ?? localized.quantity
    );

    if (!Number.isInteger(quantity) || quantity < 1) {
      setError(
        text(
          "Please enter a valid quantity.",
          "कृपया योग्य संख्या टाका."
        )
      );
      return;
    }

    if (quantity === Number(localized.quantity)) {
      setMessage(
        text(
          "Quantity is already up to date.",
          "Quantity आधीच अपडेट आहे."
        )
      );
      return;
    }

    setActionId(itemId);
    setError("");
    setMessage("");

    try {
      const response = await updateCartItemQty(
        itemId,
        quantity
      );

      console.log("Update Cart Item Quantity Response:", response);

      // Refresh selected cart details
      if (selectedCart) {
        const detailResponse = await getCartById(
          selectedCart.cartId
        );

        const updatedCart = normalizeCart(detailResponse);

        setSelectedCart({
          ...updatedCart,
          cartId: updatedCart.cartId || selectedCart.cartId,
        });
      }

      // Refresh all customer carts
      await loadAllCarts();

      setQuantityDrafts((previous) => {
        const updated = { ...previous };
        delete updated[itemId];
        return updated;
      });

      setMessage(
        text(
          "Cart item quantity updated successfully.",
          "Cart Item ची संख्या यशस्वीरीत्या अपडेट झाली."
        )
      );
    } catch (err) {
      console.error("Cart quantity update failed:", err);

      setError(
        text(
          "Unable to update cart item quantity.",
          "Cart Item ची संख्या अपडेट करता आली नाही."
        )
      );
    } finally {
      setActionId(null);
    }
  };

  // ===================================================
  // ADMIN DELETE CART
  // DELETE /Admin/DeleteCart/{cartId}
  // ===================================================

  const handleDeleteCart = async (cartId: string) => {
    const confirmed = window.confirm(
      text(
        "Are you sure you want to delete this customer's cart?",
        "तुम्हाला या ग्राहकाचा Cart delete करायचा आहे का?"
      )
    );

    if (!confirmed) return;

    setActionId(cartId);
    setError("");
    setMessage("");

    try {
      await adminDeleteCart(cartId);

      setCarts((previous) =>
        previous.filter((cart) => cart.cartId !== cartId)
      );

      if (selectedCart?.cartId === cartId) {
        setSelectedCart(null);
      }

      setMessage(
        text(
          "Customer cart deleted successfully.",
          "ग्राहकाचा Cart यशस्वीरीत्या delete झाला."
        )
      );
    } catch (err) {
      console.error("Cart deletion failed:", err);

      setError(
        text(
          "Unable to delete customer cart.",
          "ग्राहकाचा Cart delete करता आला नाही."
        )
      );
    } finally {
      setActionId(null);
    }
  };

  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="cart-management">

      {/* HEADER */}

      <div className="cart-header">
        <div>
          <h2>
            {text("Cart Management", "कार्ट व्यवस्थापन")}
          </h2>

          <p>
            {text(
              "View and manage all customer carts.",
              "सर्व ग्राहकांचे Cart पाहा आणि व्यवस्थापित करा."
            )}
          </p>
        </div>

        <div className="cart-header-actions">
          <button
            type="button"
            className="cart-btn cart-btn-refresh"
            onClick={() => void loadAllCarts()}
            disabled={loading || actionId !== null}
          >
            ↻ {text("Refresh", "रिफ्रेश")}
          </button>
        </div>
      </div>

      {/* ALERTS */}

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

      {/* SUMMARY */}

      <div className="cart-summary-grid">

        <div className="cart-summary-card">
          <span>{text("Total Carts", "एकूण Cart")}</span>
          <strong>{totalCarts}</strong>
        </div>

        <div className="cart-summary-card">
          <span>{text("Total Items", "एकूण Items")}</span>
          <strong>{totalItems}</strong>
        </div>

        <div className="cart-summary-card">
          <span>{text("Total Quantity", "एकूण संख्या")}</span>
          <strong>{totalQuantity}</strong>
        </div>

        <div className="cart-summary-card">
          <span>{text("Total Amount", "एकूण रक्कम")}</span>
          <strong>₹ {totalAmount.toFixed(2)}</strong>
        </div>

      </div>

      {/* SELECTED CART DETAILS */}

      {selectedCart && (
        <div className="cart-item-details">

          <div className="cart-details-heading">
            <h3>
              {text(
                "Customer Cart Details",
                "ग्राहक Cart माहिती"
              )}
            </h3>

            <button
              type="button"
              className="cart-close-btn"
              onClick={() => {
                setSelectedCart(null);
                setQuantityDrafts({});
              }}
            >
              ×
            </button>
          </div>

          <p>
            <strong>Cart ID:</strong> {selectedCart.cartId}
          </p>

          <p>
            <strong>{text("Status", "स्थिती")}:</strong>{" "}
            {selectedCart.status || "—"}
          </p>

          <p>
            <strong>{text("Total Items", "एकूण Items")}:</strong>{" "}
            {selectedCart.items.length}
          </p>

          <p>
            <strong>
              {text("Total Quantity", "एकूण संख्या")}:
            </strong>{" "}
            {selectedCart.totalQuantity}
          </p>

          <p>
            <strong>{text("Subtotal", "एकूण रक्कम")}:</strong>{" "}
            {selectedCart.currencyCode || "INR"}{" "}
            {selectedCart.subtotal.toFixed(2)}
          </p>

          <p>
            <strong>
              {text("Updated Date", "अपडेट तारीख")}:
            </strong>{" "}
            {formatDate(selectedCart.updatedAtUtc)}
          </p>

          <h4>{text("Cart Items", "Cart मधील Items")}</h4>

          {selectedCart.items.length === 0 ? (
            <div className="cart-empty">
              {text(
                "No items in this cart.",
                "या Cart मध्ये Items नाहीत."
              )}
            </div>
          ) : (
            <div className="cart-table-wrapper">

              <table className="cart-table">

                <thead>
                  <tr>
                    <th>#</th>
                    <th>{text("Menu Item", "Menu Item")}</th>
                    <th>{text("Quantity", "संख्या")}</th>
                    <th>{text("Unit Price", "प्रति Item किंमत")}</th>
                    <th>{text("Total", "एकूण")}</th>
                    <th>{text("Actions", "Actions")}</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedCart.items.map((item, index) => {
                    const localized = item as AdminCartItem;

                    const itemId =
                      localized.cartItemId || localized.id || "";

                    return (
                      <tr
                        key={
                          itemId ||
                          `${localized.menuItemId}-${index}`
                        }
                      >
                        <td>{index + 1}</td>

                        <td className="cart-item-name">
                          <strong>{getMenuName(item)}</strong>
                        </td>

                        <td>
                          <input
                            type="number"
                            className="cart-quantity-input"
                            min="1"
                            step="1"
                            value={
                              itemId
                                ? quantityDrafts[itemId] ??
                                  String(localized.quantity ?? 1)
                                : String(localized.quantity ?? 1)
                            }
                            onChange={(e) =>
                              handleQuantityChange(
                                itemId,
                                e.target.value
                              )
                            }
                            disabled={!itemId || actionId !== null}
                          />
                        </td>

                        <td>
                          {selectedCart.currencyCode || "INR"}{" "}
                          {getPrice(item).toFixed(2)}
                        </td>

                        <td>
                          {selectedCart.currencyCode || "INR"}{" "}
                          {getLineTotal(item).toFixed(2)}
                        </td>

                        <td>
                          <button
                            type="button"
                            className="cart-action-btn cart-edit-btn"
                            onClick={() =>
                              void handleUpdateQuantity(item)
                            }
                            disabled={
                              !itemId ||
                              actionId !== null ||
                              Number(
                                quantityDrafts[itemId] ??
                                  localized.quantity
                              ) === Number(localized.quantity)
                            }
                          >
                            {actionId === itemId
                              ? text("Updating...", "अपडेट होत आहे...")
                              : text("Update", "अपडेट")}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>
          )}

        </div>
      )}

      {/* ALL CUSTOMER CARTS */}

      <div className="cart-table-card">

        <div className="cart-table-toolbar">
          <div>
            <h3>
              {text(
                "All Customer Carts",
                "सर्व ग्राहकांचे Cart"
              )}
            </h3>

            <span>
              {carts.length}{" "}
              {text("carts found", "Cart मिळाले")}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="cart-loading">
            {text(
              "Loading customer carts...",
              "ग्राहकांचे Cart लोड होत आहेत..."
            )}
          </div>
        ) : carts.length === 0 ? (
          <div className="cart-empty">
            <strong>
              {text(
                "No customer carts found.",
                "ग्राहकांचे Cart उपलब्ध नाहीत."
              )}
            </strong>
          </div>
        ) : (
          <>

            <div className="cart-table-wrapper">

              <table className="cart-table">

                <thead>
                  <tr>
                    <th>#</th>
                    <th>{text("Cart ID", "Cart ID")}</th>
                    <th>{text("Status", "स्थिती")}</th>
                    <th>{text("Items", "Items")}</th>
                    <th>{text("Quantity", "संख्या")}</th>
                    <th>{text("Subtotal", "एकूण रक्कम")}</th>
                    <th>{text("Updated Date", "अपडेट तारीख")}</th>
                    <th>{text("Actions", "Actions")}</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedCarts.map((cart, index) => (
                    <tr key={cart.cartId}>

                      <td>
                        {(currentPage - 1) * PAGE_SIZE +
                          index +
                          1}
                      </td>

                      <td className="cart-item-name">
                        <strong>{cart.cartId}</strong>
                      </td>

                      <td>{cart.status || "—"}</td>

                      <td>{cart.items.length}</td>

                      <td>{cart.totalQuantity}</td>

                      <td>
                        {cart.currencyCode || "INR"}{" "}
                        {cart.subtotal.toFixed(2)}
                      </td>

                      <td>
                        {formatDate(
                          cart.updatedAtUtc || cart.createdAtUtc
                        )}
                      </td>

                      <td>
                        <div className="cart-action-buttons">

                          <button
                            type="button"
                            className="cart-action-btn cart-edit-btn"
                            onClick={() =>
                              void handleViewCart(cart.cartId)
                            }
                            disabled={
                              actionId !== null || detailsLoading
                            }
                          >
                            {text("View", "पाहा")}
                          </button>

                          <button
                            type="button"
                            className="cart-action-btn cart-delete-btn"
                            onClick={() =>
                              void handleDeleteCart(cart.cartId)
                            }
                            disabled={actionId !== null}
                          >
                            {actionId === cart.cartId
                              ? text("Deleting...", "Delete होत आहे...")
                              : text("Delete", "Delete")}
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

            {detailsLoading && (
              <div className="cart-loading">
                {text(
                  "Loading cart details...",
                  "Cart ची माहिती लोड होत आहे..."
                )}
              </div>
            )}

            {/* PAGINATION */}

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
                    setCurrentPage((page) =>
                      Math.max(1, page - 1)
                    )
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
