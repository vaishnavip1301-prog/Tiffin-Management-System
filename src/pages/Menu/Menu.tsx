// import { useCallback, useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";

// import type { MenuItem } from "../../api/menuItemService";
// import { getMenuItems } from "../../api/menuItemService";

// import {
//   addCartItem,
//   getCart,
//   removeCartItem,
//   updateCartItemQty,
// } from "../../api/cartService";

// import "./Menu.css";

// type CartEntry = {
//   meal: MenuItem;
//   quantity: number;
//   cartItemId?: string;
// };

// type LocalizedMenuItem = MenuItem & {
//   nameEn?: string;
//   nameMr?: string;
//   descriptionEn?: string | null;
//   descriptionMr?: string | null;
//   categoryNameEn?: string;
//   categoryNameMr?: string;
//   subCategoryNameEn?: string;
//   subCategoryNameMr?: string;
//   mealTypeNameEn?: string;
//   mealTypeNameMr?: string;
//   foodTypeNameEn?: string;
//   foodTypeNameMr?: string;
// };

// const PAGE_SIZE = 100;
// const FALLBACK_IMAGE = "/images/tiffin.jpg";

// const getLocalizedValue = (
//   language: string,
//   english?: string | null,
//   marathi?: string | null,
//   fallback?: string | null
// ): string => {
//   if (language.startsWith("mr")) {
//     return marathi || fallback || english || "";
//   }

//   return english || fallback || marathi || "";
// };

// function getMealImage(meal: MenuItem): string {
//   const name = meal.name.toLowerCase().replace(/[^a-z0-9]/g, "");

//   const imageMap: Record<string, string> = {
//     butterroti: "/images/butterroti.jpg",
//     chapati: "/images/chapati.jpg",
//     chapatibhajithali: "/images/chapatibhaji.jpg",
//     dalrice: "/images/dalrice.jpg",
//     filtercoffee: "/images/filtercoffee.jpg",
//     freshlimewater: "/images/limejuice.jpg",
//     gajarhalawa: "/images/gajarhalwa.jpg",
//     gajarhalwa: "/images/gajarhalwa.jpg",
//     jirarice: "/images/jirarice.jpg",
//     jeerarice: "/images/jirarice.jpg",
//     kandabhaji: "/images/KandaBhaji.jpg",
//     kandapoha: "/images/kandapohe.jpg",
//     poha: "/images/kandapohe.jpg",
//     maharashtrianvegthali: "/images/maharashtrianveg.jpg",
//     masalachai: "/images/masalachai.jpg",
//     minivegthali: "/images/vegthali.jpg",
//     paneermasala: "/images/paneermasala.jpg",
//     paratha: "/images/paratha.jpg",
//     puranpoli: "/images/puranpoli.jpg",
//     upma: "/images/upma.jpg",
//     vadapav: "/images/vadapav.jpg",
//     vegsandwich: "/images/vegsandwich.jpg",
//     vegpulao: "/images/vegpulao.jpg",
//     zunkabhakri: "/images/zunkabhakri.jpg",
//   };

//   if (imageMap[name]) return imageMap[name];

//   if (
//     name.includes("chapati") ||
//     name.includes("roti") ||
//     name.includes("fulka")
//   ) {
//     return "/images/chapati.jpg";
//   }

//   if (name.includes("thali")) return "/images/vegthali.jpg";

//   if (name.includes("poha") || name.includes("pohe")) {
//     return "/images/kandapohe.jpg";
//   }

//   if (name.includes("coffee")) return "/images/filtercoffee.jpg";

//   if (name.includes("chai") || name.includes("tea")) {
//     return "/images/masalachai.jpg";
//   }

//   if (
//     name.includes("rice") ||
//     name.includes("pulao") ||
//     name.includes("pulav")
//   ) {
//     return "/images/vegpulao.jpg";
//   }

//   if (name.includes("bhaji") || name.includes("pakoda")) {
//     return "/images/KandaBhaji.jpg";
//   }

//   if (
//     name.includes("juice") ||
//     name.includes("lime") ||
//     name.includes("lemon")
//   ) {
//     return "/images/limejuice.jpg";
//   }

//   if (name.includes("halwa")) return "/images/gajarhalwa.jpg";
//   if (name.includes("vada")) return "/images/vadapav.jpg";
//   if (name.includes("sandwich")) return "/images/vegsandwich.jpg";
//   if (name.includes("upma")) return "/images/upma.jpg";
//   if (name.includes("puranpoli")) return "/images/puranpoli.jpg";

//   if (name.includes("paneer") || name.includes("special")) {
//     return "/images/paneermasala.jpg";
//   }

//   return FALLBACK_IMAGE;
// }

// function readString(
//   item: Record<string, unknown>,
//   ...keys: string[]
// ): string | undefined {
//   for (const key of keys) {
//     const value = item[key];

//     if (value !== undefined && value !== null && String(value).trim()) {
//       return String(value);
//     }
//   }

//   return undefined;
// }

// function readNumber(
//   item: Record<string, unknown>,
//   ...keys: string[]
// ): number | undefined {
//   for (const key of keys) {
//     const value = item[key];

//     if (value !== undefined && value !== null && value !== "") {
//       const number = Number(value);

//       if (Number.isFinite(number)) return number;
//     }
//   }

//   return undefined;
// }

// function getCartRows(response: unknown): Record<string, unknown>[] {
//   if (!response || typeof response !== "object") return [];

//   const object = response as Record<string, unknown>;

//   for (const key of ["items", "Items", "cartItems", "CartItems"]) {
//     if (Array.isArray(object[key])) {
//       return object[key] as Record<string, unknown>[];
//     }
//   }

//   for (const key of ["data", "Data", "result", "Result"]) {
//     const nested = object[key];

//     if (nested && typeof nested === "object") {
//       const rows = getCartRows(nested);

//       if (rows.length > 0) return rows;
//     }
//   }

//   return [];
// }

// function getCartItemId(
//   response: unknown,
//   mealId: string
// ): string | undefined {
//   const row = getCartRows(response).find((item) => {
//     const menuItemId = readString(
//       item,
//       "menuItemId",
//       "MenuItemId",
//       "menuItemID"
//     );

//     return menuItemId === String(mealId);
//   });

//   if (!row) return undefined;

//   return readString(row, "cartItemId", "CartItemId", "id", "Id");
// }

// function mapCartToEntries(
//   response: unknown,
//   menuItems: MenuItem[]
// ): CartEntry[] {
//   const rows = getCartRows(response);

//   return rows.flatMap((row) => {
//     const menuItemId = readString(
//       row,
//       "menuItemId",
//       "MenuItemId",
//       "menuItemID"
//     );

//     const cartItemId = readString(
//       row,
//       "cartItemId",
//       "CartItemId",
//       "id",
//       "Id"
//     );

//     const quantity = readNumber(row, "quantity", "Quantity") ?? 1;

//     if (!menuItemId || quantity < 1) return [];

//     const meal = menuItems.find(
//       (item) => String(item.id) === String(menuItemId)
//     );

//     if (!meal) return [];

//     return [{ meal, quantity, cartItemId }];
//   });
// }

// export default function Menu() {
//   const navigate = useNavigate();
//   const { t, i18n } = useTranslation();

//   const language = i18n.language;

//   const [meals, setMeals] = useState<MenuItem[]>([]);
//   const [activeCategory, setActiveCategory] = useState("");
//   const [search, setSearch] = useState("");
//   const [cart, setCart] = useState<CartEntry[]>([]);
//   const [cartOpen, setCartOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [cartBusyId, setCartBusyId] = useState<string | null>(null);
//   const [cartMessage, setCartMessage] = useState("");

//   const getMealName = (meal: MenuItem) => {
//     const item = meal as LocalizedMenuItem;

//     return getLocalizedValue(
//       language,
//       item.nameEn,
//       item.nameMr,
//       item.name
//     );
//   };

//   const getMealDescription = (meal: MenuItem) => {
//     const item = meal as LocalizedMenuItem;

//     return getLocalizedValue(
//       language,
//       item.descriptionEn,
//       item.descriptionMr,
//       item.description
//     );
//   };

//   const getCategoryName = (meal: MenuItem) => {
//     const item = meal as LocalizedMenuItem;

//     return getLocalizedValue(
//       language,
//       item.categoryNameEn,
//       item.categoryNameMr,
//       item.categoryName
//     );
//   };

//   const getSubCategoryName = (meal: MenuItem) => {
//     const item = meal as LocalizedMenuItem;

//     return getLocalizedValue(
//       language,
//       item.subCategoryNameEn,
//       item.subCategoryNameMr,
//       item.subCategoryName
//     );
//   };

//   const getMealTypeName = (meal: MenuItem) => {
//     const item = meal as LocalizedMenuItem;

//     return getLocalizedValue(
//       language,
//       item.mealTypeNameEn,
//       item.mealTypeNameMr,
//       item.mealTypeName
//     );
//   };

//   const getFoodTypeName = (meal: MenuItem) => {
//     const item = meal as LocalizedMenuItem;

//     return getLocalizedValue(
//       language,
//       item.foodTypeNameEn,
//       item.foodTypeNameMr,
//       item.foodTypeName
//     );
//   };

//   const loadMeals = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const firstResponse = await getMenuItems(1, PAGE_SIZE);
//       let allItems = firstResponse.items ?? [];

//       const totalRecords =
//         firstResponse.totalRecords ?? allItems.length;

//       const pageSize = firstResponse.pageSize || PAGE_SIZE;

//       if (pageSize > 0 && allItems.length < totalRecords) {
//         const totalPages = Math.ceil(totalRecords / pageSize);

//         for (let page = 2; page <= totalPages; page += 1) {
//           const response = await getMenuItems(page, pageSize);
//           allItems = [...allItems, ...(response.items ?? [])];
//         }
//       }

//       const uniqueItems = Array.from(
//         new Map(
//           allItems.map((item) => [String(item.id), item])
//         ).values()
//       );

//       const activeItems = uniqueItems.filter(
//         (item) => item.isActive !== false
//       );

//       setMeals(activeItems);
//       setCart([]);
//     } catch (err) {
//       console.error("Failed to load website menu:", err);

//       setError(t("menu.messages.loadFailed"));
//     } finally {
//       setLoading(false);
//     }
//   }, [t]);

//   useEffect(() => {
//     void loadMeals();
//   }, [loadMeals]);

//   const categories = useMemo(() => {
//     const names = meals
//       .map((meal) => getCategoryName(meal)?.trim())
//       .filter((name): name is string => Boolean(name));

//     return [t("menu.filters.allMeals"), ...new Set(names)];
//   }, [meals, language, t]);

//   useEffect(() => {
//     setActiveCategory(t("menu.filters.allMeals"));
//   }, [language, t]);

//   const visibleMeals = useMemo(() => {
//     const query = search.trim().toLowerCase();

//     return meals.filter((meal) => {
//       const categoryMatches =
//         activeCategory === t("menu.filters.allMeals") ||
//         getCategoryName(meal)?.trim() === activeCategory;

//       const searchMatches = [
//         getMealName(meal),
//         getMealDescription(meal),
//         getCategoryName(meal),
//         getSubCategoryName(meal),
//         getMealTypeName(meal),
//         getFoodTypeName(meal),
//       ].some((value) => value.toLowerCase().includes(query));

//       return categoryMatches && searchMatches;
//     });
//   }, [meals, activeCategory, search, language, t]);

//   const cartCount = cart.reduce(
//     (total, entry) => total + entry.quantity,
//     0
//   );

//   const cartTotal = cart.reduce(
//     (total, entry) =>
//       total + Number(entry.meal.price) * entry.quantity,
//     0
//   );

//   // ADD ITEM TO BACKEND CART
//   const addToCart = async (meal: MenuItem) => {
//     if (meal.isAvailable === false || cartBusyId !== null) return;
//      console.log("123-----------")

//     const mealId = String(meal.id);

//     if (!mealId || mealId === "undefined") {
//       setCartMessage(t("menu.messages.invalidItemId"));
//       return;
//     }

//     setCartBusyId(mealId);
//     setCartMessage("");

//     try {
//       const currentCart = await getCart();
//       const currentEntries = mapCartToEntries(currentCart, meals);

//       const existing = currentEntries.find(
//         (entry) => String(entry.meal.id) === mealId
//       );

//       if (existing) {
//         const cartItemId =
//           existing.cartItemId ?? getCartItemId(currentCart, mealId);

//         if (!cartItemId) {
//           throw new Error(
//             `Cart item ID not found for menu item: ${mealId}`
//           );
//         }
//         console.log("12345-----------")
//         await updateCartItemQty(
//           cartItemId,
//           existing.quantity + 1
//         );
//         console.log("123456-----------")
//       } else {
//         await addCartItem({
//           menuItemId: mealId,
//           quantity: 1,
//         });
//       }

//       const updatedCart = await getCart();
//       const updatedEntries = mapCartToEntries(updatedCart, meals);

//       setCart(updatedEntries);
//       setCartOpen(true);
//       setCartMessage(
//         t("menu.messages.addedToCart", {
//           name: getMealName(meal),
//         })
//       );
//     } catch (err) {
//       console.error("Failed to add/update cart item:", err);

//       if (err && typeof err === "object" && "response" in err) {
//         const apiError = err as {
//           response?: {
//             status?: number;
//             data?: unknown;
//           };
//         };

//         console.error("Cart API Status:", apiError.response?.status);
//         console.error("Cart API Response:", apiError.response?.data);
//       }

//       setCartMessage(t("menu.messages.cartUpdateFailed"));
//     } finally {
//       setCartBusyId(null);
//     }
//   };

//   // UPDATE QUANTITY IN BACKEND CART
//   const changeQuantity = async (mealId: string, change: number) => {
//     const id = String(mealId);

//     if (cartBusyId !== null) return;

//     setCartBusyId(id);
//     setCartMessage("");

//     try {
//       const currentCart = await getCart();
//       const currentEntries = mapCartToEntries(currentCart, meals);

//       const entry = currentEntries.find(
//         (item) => String(item.meal.id) === id
//       );

//       if (!entry) {
//         setCartMessage(t("menu.messages.itemNotInCart"));
//         return;
//       }

//       const cartItemId =
//         entry.cartItemId ?? getCartItemId(currentCart, id);

//       if (!cartItemId) {
//         throw new Error(
//           "Cart item ID was not returned by GetCart API."
//         );
//       }

//       if (change < 0 && entry.quantity <= 1) {
//         await removeCartItem(cartItemId);
//       } else {
//         const nextQuantity = entry.quantity + change;

//         if (nextQuantity < 1) return;

//         await updateCartItemQty(cartItemId, nextQuantity);
//       }

//       const updatedCart = await getCart();
//       const updatedEntries = mapCartToEntries(updatedCart, meals);

//       setCart(updatedEntries);
//     } catch (err) {
//       console.error("Failed to change cart quantity:", err);

//       setCartMessage(t("menu.messages.quantityUpdateFailed"));
//     } finally {
//       setCartBusyId(null);
//     }
//   };

//   const handleOrderNow = () => {
//     if (cart.length === 0) {
//       setCartMessage(t("menu.messages.addMealBeforeOrder"));
//       setCartOpen(true);
//       return;
//     }

//     navigate("/order", {
//       state: {
//         cartItems: cart.map(({ meal, quantity, cartItemId }) => ({
//           id: String(meal.id),
//           menuItemId: String(meal.id),
//           name: getMealName(meal),
//           price: Number(meal.price),
//           quantity,
//           cartItemId,
//           image: getMealImage(meal),
//         })),
//         subtotal: cartTotal,
//         totalQuantity: cartCount,
//       },
//     });
//   };

//   const orderOnWhatsApp = () => {
//     if (cart.length === 0) return;

//     const lines = cart.map(
//       ({ meal, quantity }) =>
//         `${getMealName(meal)} x ${quantity} = Rs. ${(
//           Number(meal.price) * quantity
//         ).toFixed(2)}`
//     );

//     const message = [
//       t("menu.whatsapp.greeting"),
//       t("menu.whatsapp.orderRequest"),
//       "",
//       ...lines,
//       "",
//       `${t("menu.whatsapp.total")}: Rs. ${cartTotal.toFixed(2)}`,
//       t("menu.whatsapp.confirmation"),
//     ].join("\n");

//     const whatsappNumber = "919999999999";

//     window.open(
//       `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
//       "_blank",
//       "noopener,noreferrer"
//     );
//   };

//   const handleAddMoreItems = () => {
//     setCartOpen(false);
//     setCartMessage("");

//     document.querySelector(".menu-catalog")?.scrollIntoView({
//       behavior: "smooth",
//       block: "start",
//     });
//   };

//   return (
//     <main className="menu-page">
//       <section className="menu-hero">
//         <div className="menu-hero-shade" />

//         <div className="container menu-hero-content">
//           <span className="menu-kicker">
//             {t("menu.hero.kicker")}
//           </span>

//           <h1>{t("menu.hero.title")}</h1>

//           <p>{t("menu.hero.description")}</p>

//           <div className="menu-breadcrumb">
//             <a href="/">{t("menu.breadcrumb.home")}</a>
//             <span>/</span>
//             <span>{t("menu.breadcrumb.allMeals")}</span>
//           </div>
//         </div>
//       </section>

//       <section className="menu-intro">
//         <div className="container">
//           <span className="menu-section-kicker">
//             {t("menu.intro.kicker")}
//           </span>

//           <h2>
//             {t("menu.intro.heading")}{" "}
//             <span>{t("menu.intro.headingHighlight")}</span>
//           </h2>

//           <p>{t("menu.intro.description")}</p>
//         </div>
//       </section>

//       <section className="menu-catalog">
//         <div className="container">
//           <div className="menu-toolbar">
//             <div>
//               <h2>{t("menu.catalog.title")}</h2>
//               <p>{t("menu.catalog.description")}</p>
//             </div>

//             <label className="menu-search">
//               <span aria-hidden="true">⌕</span>

//               <input
//                 type="search"
//                 value={search}
//                 onChange={(event) => setSearch(event.target.value)}
//                 placeholder={t("menu.catalog.searchPlaceholder")}
//                 aria-label={t("menu.catalog.searchLabel")}
//               />
//             </label>
//           </div>

//           {!loading && !error && meals.length > 0 && (
//             <div className="menu-filters">
//               {categories.map((category) => (
//                 <button
//                   type="button"
//                   key={category}
//                   className={
//                     activeCategory === category
//                       ? "menu-filter active"
//                       : "menu-filter"
//                   }
//                   onClick={() => setActiveCategory(category)}
//                 >
//                   {category}
//                 </button>
//               ))}
//             </div>
//           )}

//           {loading && (
//             <div className="menu-no-results">
//               <h3>{t("menu.loading.title")}</h3>
//               <p>{t("menu.loading.description")}</p>
//             </div>
//           )}

//           {!loading && error && (
//             <div className="menu-no-results">
//               <h3>{t("menu.errors.title")}</h3>
//               <p>{error}</p>

//               <button
//                 type="button"
//                 className="menu-reset-button"
//                 onClick={() => void loadMeals()}
//               >
//                 {t("menu.buttons.tryAgain")}
//               </button>
//             </div>
//           )}

//           {!loading && !error && (
//             <>
//               <div className="row g-4">
//                 {visibleMeals.map((meal) => {
//                   const cartEntry = cart.find(
//                     (entry) =>
//                       String(entry.meal.id) === String(meal.id)
//                   );

//                   return (
//                     <div
//                       className="col-sm-6 col-lg-4 col-xl-3"
//                       key={meal.id}
//                     >
//                       <article className="meal-card">
//                         <div className="meal-image-wrap">
//                           <img
//                             src={getMealImage(meal)}
//                             alt={getMealName(meal)}
//                             className="meal-image"
//                             loading="lazy"
//                             onError={(event) => {
//                               const image = event.currentTarget;

//                               if (
//                                 image.dataset.fallbackApplied === "true"
//                               ) {
//                                 return;
//                               }

//                               image.dataset.fallbackApplied = "true";
//                               image.src = FALLBACK_IMAGE;
//                             }}
//                           />

//                           {meal.isAvailable === false && (
//                             <span className="meal-tag">
//                               {t("menu.meal.unavailable")}
//                             </span>
//                           )}
//                         </div>

//                         <div className="meal-card-body">
//                           <span className="meal-category">
//                             {getCategoryName(meal) ||
//                               t("menu.meal.defaultCategory")}
//                           </span>

//                           <h3>{getMealName(meal)}</h3>

//                           <p>
//                             {getMealDescription(meal) ||
//                               t("menu.meal.defaultDescription")}
//                           </p>

//                           <div className="meal-card-bottom">
//                             <strong className="meal-price">
//                               ₹{Number(meal.price).toFixed(2)}
//                             </strong>

//                             {meal.isAvailable === false ? (
//                               <button
//                                 type="button"
//                                 className="meal-add-button"
//                                 disabled
//                               >
//                                 {t("menu.meal.unavailable")}
//                               </button>
//                             ) : cartEntry ? (
//                               <div className="menu-card-order-actions">
//                                 <div className="menu-quantity menu-card-quantity">
//                                   <button
//                                     type="button"
//                                     disabled={cartBusyId !== null}
//                                     onClick={() =>
//                                       void changeQuantity(
//                                         String(meal.id),
//                                         -1
//                                       )
//                                     }
//                                     aria-label={t(
//                                       "menu.meal.decrease",
//                                       { name: getMealName(meal) }
//                                     )}
//                                   >
//                                     −
//                                   </button>

//                                   <span>{cartEntry.quantity}</span>

//                                   <button
//                                     type="button"
//                                     disabled={cartBusyId !== null}
//                                     onClick={() =>
//                                       void changeQuantity(
//                                         String(meal.id),
//                                         1
//                                       )
//                                     }
//                                     aria-label={t(
//                                       "menu.meal.increase",
//                                       { name: getMealName(meal) }
//                                     )}
//                                   >
//                                     +
//                                   </button>
//                                 </div>

//                                 <button
//                                   type="button"
//                                   className="menu-order-now-button"
//                                   onClick={handleOrderNow}
//                                 >
//                                   {t("menu.buttons.orderNow")}
//                                 </button>
//                               </div>
//                             ) : (
//                               <button
//                                 type="button"
//                                 className="meal-add-button"
//                                 disabled={cartBusyId !== null}
//                                 onClick={() => void addToCart(meal)}
//                               >
//                                 {cartBusyId === String(meal.id)
//                                   ? t("menu.buttons.adding")
//                                   : t("menu.buttons.addToCart")}
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       </article>
//                     </div>
//                   );
//                 })}
//               </div>

//               {visibleMeals.length === 0 && (
//                 <div className="menu-no-results">
//                   <h3>
//                     {meals.length === 0
//                       ? t("menu.empty.noItems")
//                       : t("menu.empty.noMealsFound")}
//                   </h3>

//                   <p>
//                     {meals.length === 0
//                       ? t("menu.empty.noItemsDescription")
//                       : t("menu.empty.noMealsDescription")}
//                   </p>

//                   <button
//                     type="button"
//                     className="menu-reset-button"
//                     onClick={() => {
//                       setSearch("");
//                       setActiveCategory(t("menu.filters.allMeals"));
//                     }}
//                   >
//                     {t("menu.buttons.showAllMeals")}
//                   </button>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </section>

//       {cartMessage && (
//         <div className="container" role="status" aria-live="polite">
//           <p className="menu-cart-message">{cartMessage}</p>
//         </div>
//       )}

//       <section className="menu-cta">
//         <div className="container">
//           <div className="menu-cta-inner">
//             <div>
//               <span className="menu-section-kicker">
//                 {t("menu.cta.kicker")}
//               </span>

//               <h2>{t("menu.cta.title")}</h2>
//               <p>{t("menu.cta.description")}</p>
//             </div>

//             <button
//               type="button"
//               className="menu-cta-button"
//               onClick={() => setCartOpen(true)}
//             >
//               {t("menu.buttons.viewCart", { count: cartCount })}
//             </button>
//           </div>
//         </div>
//       </section>

//       <button
//         type="button"
//         className="menu-floating-cart"
//         onClick={() => setCartOpen(true)}
//         aria-label={t("menu.buttons.openCart", { count: cartCount })}
//       >
//         <span aria-hidden="true">🛒</span>
//         <span>{t("menu.buttons.cart")}</span>
//         <span className="menu-cart-badge">{cartCount}</span>
//       </button>

//       {cartOpen && (
//         <div
//           className="menu-cart-backdrop"
//           onClick={() => setCartOpen(false)}
//         >
//           <section
//             className="menu-cart-panel"
//             role="dialog"
//             aria-modal="true"
//             aria-labelledby="menu-cart-heading"
//             onClick={(event) => event.stopPropagation()}
//           >
//             <div className="menu-cart-header">
//               <div>
//                 <span className="menu-section-kicker">
//                   {t("menu.cart.kicker")}
//                 </span>

//                 <h2 id="menu-cart-heading">
//                   {t("menu.cart.title")}
//                 </h2>
//               </div>

//               <button
//                 type="button"
//                 className="menu-cart-close"
//                 onClick={() => setCartOpen(false)}
//                 aria-label={t("menu.buttons.closeCart")}
//               >
//                 ×
//               </button>
//             </div>

//             <button
//               type="button"
//               className="menu-add-more-button"
//               onClick={handleAddMoreItems}
//             >
//               <span aria-hidden="true">＋</span>
//               {t("menu.buttons.addMoreItems")}
//             </button>

//             {cart.length === 0 ? (
//               <div className="menu-cart-empty">
//                 <h3>{t("menu.cart.emptyTitle")}</h3>
//                 <p>{t("menu.cart.emptyDescription")}</p>

//                 <button
//                   type="button"
//                   className="menu-reset-button"
//                   onClick={handleAddMoreItems}
//                 >
//                   {t("menu.buttons.exploreMenu")}
//                 </button>
//               </div>
//             ) : (
//               <>
//                 <div className="menu-cart-items">
//                   {cart.map(({ meal, quantity }) => (
//                     <div className="menu-cart-row" key={meal.id}>
//                       <img
//                         src={getMealImage(meal)}
//                         alt={getMealName(meal)}
//                         onError={(event) => {
//                           const image = event.currentTarget;

//                           if (
//                             image.dataset.fallbackApplied === "true"
//                           ) {
//                             return;
//                           }

//                           image.dataset.fallbackApplied = "true";
//                           image.src = FALLBACK_IMAGE;
//                         }}
//                       />

//                       <div className="menu-cart-row-info">
//                         <h3>{getMealName(meal)}</h3>

//                         <p>
//                           ₹{Number(meal.price).toFixed(2)}{" "}
//                           {t("menu.cart.each")}
//                         </p>

//                         <div className="menu-quantity">
//                           <button
//                             type="button"
//                             disabled={cartBusyId !== null}
//                             onClick={() =>
//                               void changeQuantity(
//                                 String(meal.id),
//                                 -1
//                               )
//                             }
//                             aria-label={t("menu.meal.decrease", {
//                               name: getMealName(meal),
//                             })}
//                           >
//                             −
//                           </button>

//                           <span>{quantity}</span>

//                           <button
//                             type="button"
//                             disabled={cartBusyId !== null}
//                             onClick={() =>
//                               void changeQuantity(
//                                 String(meal.id),
//                                 1
//                               )
//                             }
//                             aria-label={t("menu.meal.increase", {
//                               name: getMealName(meal),
//                             })}
//                           >
//                             +
//                           </button>
//                         </div>
//                       </div>

//                       <strong>
//                         ₹{(
//                           Number(meal.price) * quantity
//                         ).toFixed(2)}
//                       </strong>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="menu-cart-footer">
//                   <div className="menu-cart-total">
//                     <span>{t("menu.cart.total")}</span>
//                     <strong>₹{cartTotal.toFixed(2)}</strong>
//                   </div>

//                   <button
//                     type="button"
//                     className="menu-order-now-button"
//                     onClick={handleOrderNow}
//                   >
//                     {t("menu.buttons.orderNow")}
//                   </button>

//                   <button
//                     type="button"
//                     className="menu-whatsapp-button"
//                     onClick={orderOnWhatsApp}
//                   >
//                     {t("menu.buttons.orderWhatsApp")}
//                   </button>

//                   <p>{t("menu.cart.deliveryNote")}</p>
//                 </div>
//               </>
//             )}
//           </section>
//         </div>
//       )}
//     </main>
//   );
// }


import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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

type LocalizedMenuItem = MenuItem & {
  nameEn?: string;
  nameMr?: string;
  descriptionEn?: string | null;
  descriptionMr?: string | null;
  categoryNameEn?: string;
  categoryNameMr?: string;
  subCategoryNameEn?: string;
  subCategoryNameMr?: string;
  mealTypeNameEn?: string;
  mealTypeNameMr?: string;
  foodTypeNameEn?: string;
  foodTypeNameMr?: string;
};

const PAGE_SIZE = 100;
const FALLBACK_IMAGE = "/images/tiffin.jpg";

const getLocalizedValue = (
  language: string,
  english?: string | null,
  marathi?: string | null,
  fallback?: string | null
): string => {
  if (language.startsWith("mr")) {
    return marathi || fallback || english || "";
  }

  return english || fallback || marathi || "";
};

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
  mealId: string
): string | undefined {
  const row = getCartRows(response).find((item) => {
    const menuItemId = readString(
      item,
      "menuItemId",
      "MenuItemId",
      "menuItemID"
    );

    return menuItemId === String(mealId);
  });

  if (!row) return undefined;

  return readString(row, "cartItemId", "CartItemId", "id", "Id");
}

function mapCartToEntries(
  response: unknown,
  menuItems: MenuItem[]
): CartEntry[] {
  const rows = getCartRows(response);

  return rows.flatMap((row) => {
    const menuItemId = readString(
      row,
      "menuItemId",
      "MenuItemId",
      "menuItemID"
    );

    const cartItemId = readString(
      row,
      "cartItemId",
      "CartItemId",
      "id",
      "Id"
    );

    const quantity = readNumber(row, "quantity", "Quantity") ?? 1;

    if (!menuItemId || quantity < 1) return [];

    const meal = menuItems.find(
      (item) => String(item.id) === String(menuItemId)
    );

    if (!meal) return [];

    return [{ meal, quantity, cartItemId }];
  });
}

export default function Menu() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const language = i18n.language;

  const [meals, setMeals] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartBusyId, setCartBusyId] = useState<string | null>(null);
  const [cartMessage, setCartMessage] = useState("");

  const getMealName = (meal: MenuItem) => {
    const item = meal as LocalizedMenuItem;

    return getLocalizedValue(
      language,
      item.nameEn,
      item.nameMr,
      item.name
    );
  };

  const getMealDescription = (meal: MenuItem) => {
    const item = meal as LocalizedMenuItem;

    return getLocalizedValue(
      language,
      item.descriptionEn,
      item.descriptionMr,
      item.description
    );
  };

  const getCategoryName = (meal: MenuItem) => {
    const item = meal as LocalizedMenuItem;

    return getLocalizedValue(
      language,
      item.categoryNameEn,
      item.categoryNameMr,
      item.categoryName
    );
  };

  const getSubCategoryName = (meal: MenuItem) => {
    const item = meal as LocalizedMenuItem;

    return getLocalizedValue(
      language,
      item.subCategoryNameEn,
      item.subCategoryNameMr,
      item.subCategoryName
    );
  };

  const getMealTypeName = (meal: MenuItem) => {
    const item = meal as LocalizedMenuItem;

    return getLocalizedValue(
      language,
      item.mealTypeNameEn,
      item.mealTypeNameMr,
      item.mealTypeName
    );
  };

  const getFoodTypeName = (meal: MenuItem) => {
    const item = meal as LocalizedMenuItem;

    return getLocalizedValue(
      language,
      item.foodTypeNameEn,
      item.foodTypeNameMr,
      item.foodTypeName
    );
  };

  // LOAD MENU ITEMS AND EXISTING BACKEND CART
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
        new Map(
          allItems.map((item) => [String(item.id), item])
        ).values()
      );

      const activeItems = uniqueItems.filter(
        (item) => item.isActive !== false
      );

      setMeals(activeItems);

      // Fetch previously saved cart from backend
      try {
        const cartResponse = await getCart();

        const cartEntries = mapCartToEntries(
          cartResponse,
          activeItems
        );

        setCart(cartEntries);
      } catch (cartError) {
        console.error("Failed to load existing cart:", cartError);

        // Menu should still display even if cart loading fails
        setCart([]);
      }
    } catch (err) {
      console.error("Failed to load website menu:", err);

      setError(t("menu.messages.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadMeals();
  }, [loadMeals]);

  const categories = useMemo(() => {
    const names = meals
      .map((meal) => getCategoryName(meal)?.trim())
      .filter((name): name is string => Boolean(name));

    return [t("menu.filters.allMeals"), ...new Set(names)];
  }, [meals, language, t]);

  useEffect(() => {
    setActiveCategory(t("menu.filters.allMeals"));
  }, [language, t]);

  const visibleMeals = useMemo(() => {
    const query = search.trim().toLowerCase();

    return meals.filter((meal) => {
      const categoryMatches =
        activeCategory === t("menu.filters.allMeals") ||
        getCategoryName(meal)?.trim() === activeCategory;

      const searchMatches = [
        getMealName(meal),
        getMealDescription(meal),
        getCategoryName(meal),
        getSubCategoryName(meal),
        getMealTypeName(meal),
        getFoodTypeName(meal),
      ].some((value) => value.toLowerCase().includes(query));

      return categoryMatches && searchMatches;
    });
  }, [meals, activeCategory, search, language, t]);

  const cartCount = cart.reduce(
    (total, entry) => total + entry.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, entry) =>
      total + Number(entry.meal.price) * entry.quantity,
    0
  );

  // ADD ITEM TO BACKEND CART
  const addToCart = async (meal: MenuItem) => {
    if (meal.isAvailable === false || cartBusyId !== null) return;

    const mealId = String(meal.id);

    if (!mealId || mealId === "undefined") {
      setCartMessage(t("menu.messages.invalidItemId"));
      return;
    }

    setCartBusyId(mealId);
    setCartMessage("");

    try {
      const currentCart = await getCart();

      const currentEntries = mapCartToEntries(
        currentCart,
        meals
      );

      const existing = currentEntries.find(
        (entry) => String(entry.meal.id) === mealId
      );

      let updatedCart: unknown;

      if (existing) {
        const cartItemId =
          existing.cartItemId ?? getCartItemId(currentCart, mealId);

        if (!cartItemId) {
          throw new Error(
            `Cart item ID not found for menu item: ${mealId}`
          );
        }

        // Existing item: increase quantity
        updatedCart = await updateCartItemQty(
          cartItemId,
          existing.quantity + 1
        );
      } else {
        // New item: add to backend cart
        updatedCart = await addCartItem({
          menuItemId: mealId,
          quantity: 1,
        });
      }

      // Service returns the updated cart response
      const updatedEntries = mapCartToEntries(
        updatedCart,
        meals
      );

      setCart(updatedEntries);
      setCartOpen(true);

      setCartMessage(
        t("menu.messages.addedToCart", {
          name: getMealName(meal),
        })
      );
    } catch (err) {
      console.error("Failed to add/update cart item:", err);

      if (err && typeof err === "object" && "response" in err) {
        const apiError = err as {
          response?: {
            status?: number;
            data?: unknown;
          };
        };

        console.error("Cart API Status:", apiError.response?.status);
        console.error("Cart API Response:", apiError.response?.data);
      }

      setCartMessage(t("menu.messages.cartUpdateFailed"));
    } finally {
      setCartBusyId(null);
    }
  };

  // UPDATE QUANTITY IN BACKEND CART
  const changeQuantity = async (mealId: string, change: number) => {
    const id = String(mealId);

    if (cartBusyId !== null) return;

    setCartBusyId(id);
    setCartMessage("");

    try {
      const currentCart = await getCart();

      const currentEntries = mapCartToEntries(
        currentCart,
        meals
      );

      const entry = currentEntries.find(
        (item) => String(item.meal.id) === id
      );

      if (!entry) {
        setCartMessage(t("menu.messages.itemNotInCart"));
        return;
      }

      const cartItemId =
        entry.cartItemId ?? getCartItemId(currentCart, id);

      if (!cartItemId) {
        throw new Error(
          "Cart item ID was not returned by GetCart API."
        );
      }

      let updatedCart: unknown;

      if (change < 0 && entry.quantity <= 1) {
        // Quantity is 1: remove item from backend cart
        updatedCart = await removeCartItem(cartItemId);
      } else {
        const nextQuantity = entry.quantity + change;

        if (nextQuantity < 1) return;

        // Update item quantity in backend
        updatedCart = await updateCartItemQty(
          cartItemId,
          nextQuantity
        );
      }

      // Update frontend cart using API response
      const updatedEntries = mapCartToEntries(
        updatedCart,
        meals
      );

      setCart(updatedEntries);
    } catch (err) {
      console.error("Failed to change cart quantity:", err);

      setCartMessage(t("menu.messages.quantityUpdateFailed"));
    } finally {
      setCartBusyId(null);
    }
  };

  const handleOrderNow = () => {
    if (cart.length === 0) {
      setCartMessage(t("menu.messages.addMealBeforeOrder"));
      setCartOpen(true);
      return;
    }

    navigate("/order", {
      state: {
        cartItems: cart.map(({ meal, quantity, cartItemId }) => ({
          id: String(meal.id),
          menuItemId: String(meal.id),
          name: getMealName(meal),
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
        `${getMealName(meal)} x ${quantity} = Rs. ${(
          Number(meal.price) * quantity
        ).toFixed(2)}`
    );

    const message = [
      t("menu.whatsapp.greeting"),
      t("menu.whatsapp.orderRequest"),
      "",
      ...lines,
      "",
      `${t("menu.whatsapp.total")}: Rs. ${cartTotal.toFixed(2)}`,
      t("menu.whatsapp.confirmation"),
    ].join("\n");

    const whatsappNumber = "919999999999";

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleAddMoreItems = () => {
    setCartOpen(false);
    setCartMessage("");

    document.querySelector(".menu-catalog")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="menu-page">
      <section className="menu-hero">
        <div className="menu-hero-shade" />

        <div className="container menu-hero-content">
          <span className="menu-kicker">
            {t("menu.hero.kicker")}
          </span>

          <h1>{t("menu.hero.title")}</h1>

          <p>{t("menu.hero.description")}</p>

          <div className="menu-breadcrumb">
            <a href="/">{t("menu.breadcrumb.home")}</a>
            <span>/</span>
            <span>{t("menu.breadcrumb.allMeals")}</span>
          </div>
        </div>
      </section>

      <section className="menu-intro">
        <div className="container">
          <span className="menu-section-kicker">
            {t("menu.intro.kicker")}
          </span>

          <h2>
            {t("menu.intro.heading")}{" "}
            <span>{t("menu.intro.headingHighlight")}</span>
          </h2>

          <p>{t("menu.intro.description")}</p>
        </div>
      </section>

      <section className="menu-catalog">
        <div className="container">
          <div className="menu-toolbar">
            <div>
              <h2>{t("menu.catalog.title")}</h2>
              <p>{t("menu.catalog.description")}</p>
            </div>

            <label className="menu-search">
              <span aria-hidden="true">⌕</span>

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("menu.catalog.searchPlaceholder")}
                aria-label={t("menu.catalog.searchLabel")}
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
              <h3>{t("menu.loading.title")}</h3>
              <p>{t("menu.loading.description")}</p>
            </div>
          )}

          {!loading && error && (
            <div className="menu-no-results">
              <h3>{t("menu.errors.title")}</h3>
              <p>{error}</p>

              <button
                type="button"
                className="menu-reset-button"
                onClick={() => void loadMeals()}
              >
                {t("menu.buttons.tryAgain")}
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="row g-4">
                {visibleMeals.map((meal) => {
                  const cartEntry = cart.find(
                    (entry) =>
                      String(entry.meal.id) === String(meal.id)
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
                            alt={getMealName(meal)}
                            className="meal-image"
                            loading="lazy"
                            onError={(event) => {
                              const image = event.currentTarget;

                              if (
                                image.dataset.fallbackApplied === "true"
                              ) {
                                return;
                              }

                              image.dataset.fallbackApplied = "true";
                              image.src = FALLBACK_IMAGE;
                            }}
                          />

                          {meal.isAvailable === false && (
                            <span className="meal-tag">
                              {t("menu.meal.unavailable")}
                            </span>
                          )}
                        </div>

                        <div className="meal-card-body">
                          <span className="meal-category">
                            {getCategoryName(meal) ||
                              t("menu.meal.defaultCategory")}
                          </span>

                          <h3>{getMealName(meal)}</h3>

                          <p>
                            {getMealDescription(meal) ||
                              t("menu.meal.defaultDescription")}
                          </p>

                          <div className="meal-card-bottom">
                            <strong className="meal-price">
                              ₹{Number(meal.price).toFixed(2)}
                            </strong>

                            {meal.isAvailable === false ? (
                              <button
                                type="button"
                                className="meal-add-button"
                                disabled
                              >
                                {t("menu.meal.unavailable")}
                              </button>
                            ) : cartEntry ? (
                              <div className="menu-card-order-actions">
                                <div className="menu-quantity menu-card-quantity">
                                  <button
                                    type="button"
                                    disabled={cartBusyId !== null}
                                    onClick={() =>
                                      void changeQuantity(
                                        String(meal.id),
                                        -1
                                      )
                                    }
                                    aria-label={t(
                                      "menu.meal.decrease",
                                      { name: getMealName(meal) }
                                    )}
                                  >
                                    −
                                  </button>

                                  <span>{cartEntry.quantity}</span>

                                  <button
                                    type="button"
                                    disabled={cartBusyId !== null}
                                    onClick={() =>
                                      void changeQuantity(
                                        String(meal.id),
                                        1
                                      )
                                    }
                                    aria-label={t(
                                      "menu.meal.increase",
                                      { name: getMealName(meal) }
                                    )}
                                  >
                                    +
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  className="menu-order-now-button"
                                  onClick={handleOrderNow}
                                >
                                  {t("menu.buttons.orderNow")}
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                className="meal-add-button"
                                disabled={cartBusyId !== null}
                                onClick={() => void addToCart(meal)}
                              >
                                {cartBusyId === String(meal.id)
                                  ? t("menu.buttons.adding")
                                  : t("menu.buttons.addToCart")}
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
                      ? t("menu.empty.noItems")
                      : t("menu.empty.noMealsFound")}
                  </h3>

                  <p>
                    {meals.length === 0
                      ? t("menu.empty.noItemsDescription")
                      : t("menu.empty.noMealsDescription")}
                  </p>

                  <button
                    type="button"
                    className="menu-reset-button"
                    onClick={() => {
                      setSearch("");
                      setActiveCategory(t("menu.filters.allMeals"));
                    }}
                  >
                    {t("menu.buttons.showAllMeals")}
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
                {t("menu.cta.kicker")}
              </span>

              <h2>{t("menu.cta.title")}</h2>
              <p>{t("menu.cta.description")}</p>
            </div>

            <button
              type="button"
              className="menu-cta-button"
              onClick={() => setCartOpen(true)}
            >
              {t("menu.buttons.viewCart", { count: cartCount })}
            </button>
          </div>
        </div>
      </section>

      <button
        type="button"
        className="menu-floating-cart"
        onClick={() => setCartOpen(true)}
        aria-label={t("menu.buttons.openCart", { count: cartCount })}
      >
        <span aria-hidden="true">🛒</span>
        <span>{t("menu.buttons.cart")}</span>
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
                <span className="menu-section-kicker">
                  {t("menu.cart.kicker")}
                </span>

                <h2 id="menu-cart-heading">
                  {t("menu.cart.title")}
                </h2>
              </div>

              <button
                type="button"
                className="menu-cart-close"
                onClick={() => setCartOpen(false)}
                aria-label={t("menu.buttons.closeCart")}
              >
                ×
              </button>
            </div>

            <button
              type="button"
              className="menu-add-more-button"
              onClick={handleAddMoreItems}
            >
              <span aria-hidden="true">＋</span>
              {t("menu.buttons.addMoreItems")}
            </button>

            {cart.length === 0 ? (
              <div className="menu-cart-empty">
                <h3>{t("menu.cart.emptyTitle")}</h3>
                <p>{t("menu.cart.emptyDescription")}</p>

                <button
                  type="button"
                  className="menu-reset-button"
                  onClick={handleAddMoreItems}
                >
                  {t("menu.buttons.exploreMenu")}
                </button>
              </div>
            ) : (
              <>
                <div className="menu-cart-items">
                  {cart.map(({ meal, quantity }) => (
                    <div className="menu-cart-row" key={meal.id}>
                      <img
                        src={getMealImage(meal)}
                        alt={getMealName(meal)}
                        onError={(event) => {
                          const image = event.currentTarget;

                          if (
                            image.dataset.fallbackApplied === "true"
                          ) {
                            return;
                          }

                          image.dataset.fallbackApplied = "true";
                          image.src = FALLBACK_IMAGE;
                        }}
                      />

                      <div className="menu-cart-row-info">
                        <h3>{getMealName(meal)}</h3>

                        <p>
                          ₹{Number(meal.price).toFixed(2)}{" "}
                          {t("menu.cart.each")}
                        </p>

                        <div className="menu-quantity">
                          <button
                            type="button"
                            disabled={cartBusyId !== null}
                            onClick={() =>
                              void changeQuantity(
                                String(meal.id),
                                -1
                              )
                            }
                            aria-label={t("menu.meal.decrease", {
                              name: getMealName(meal),
                            })}
                          >
                            −
                          </button>

                          <span>{quantity}</span>

                          <button
                            type="button"
                            disabled={cartBusyId !== null}
                            onClick={() =>
                              void changeQuantity(
                                String(meal.id),
                                1
                              )
                            }
                            aria-label={t("menu.meal.increase", {
                              name: getMealName(meal),
                            })}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <strong>
                        ₹{(
                          Number(meal.price) * quantity
                        ).toFixed(2)}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="menu-cart-footer">
                  <div className="menu-cart-total">
                    <span>{t("menu.cart.total")}</span>
                    <strong>₹{cartTotal.toFixed(2)}</strong>
                  </div>

                  <button
                    type="button"
                    className="menu-order-now-button"
                    onClick={handleOrderNow}
                  >
                    {t("menu.buttons.orderNow")}
                  </button>

                  <button
                    type="button"
                    className="menu-whatsapp-button"
                    onClick={orderOnWhatsApp}
                  >
                    {t("menu.buttons.orderWhatsApp")}
                  </button>

                  <p>{t("menu.cart.deliveryNote")}</p>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
