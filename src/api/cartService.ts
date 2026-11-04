
// import { cartAxiosInstance } from "./axiosInstance";

// const GUEST_CART_TOKEN_KEY = "aaplaDabba_guestCartToken";

// export interface CartItemRequest {
//   menuItemId: string;
//   quantity: number;
// }

// export interface UpdateCartQuantityRequest {
//   quantity: number;
// }

// export interface CartItem {
//   id?: string;
//   cartItemId?: string;
//   menuItemId: string;
//   name?: string;
//   menuItemName?: string;
//   description?: string;
//   categoryName?: string;
//   quantity: number;
//   unitPrice?: number;
//   price?: number;
//   lineTotal?: number;
//   currencyCode?: string;
//   imageUrl?: string;
//   [key: string]: unknown;
// }

// export interface CartResponse {
//   cartId: string;
//   guestCartToken?: string;
//   expiresAtUtc?: string;
//   currencyCode?: string;
//   items: CartItem[];
//   status?: string;
//   subtotal?: number;
//   totalQuantity?: number;
//   updatedAtUtc?: string | null;
//   [key: string]: unknown;
// }

// export interface AddCartResponse {
//   cartId?: string;
//   guestCartToken?: string;
//   expiresAtUtc?: string;
//   currencyCode?: string;
//   [key: string]: unknown;
// }

// // Handle API response.
// function getResponseData<T>(responseData: unknown): T {
//   let result = responseData;

//   if (
//     result &&
//     typeof result === "object" &&
//     !Array.isArray(result) &&
//     "data" in result &&
//     Object.keys(result).length === 1
//   ) {
//     result = (result as { data: unknown }).data;
//   }

//   return result as T;
// }

// // Guest cart token management.
// export function getGuestCartToken(): string | null {
//   return localStorage.getItem(GUEST_CART_TOKEN_KEY);
// }

// function saveGuestCartToken(token: string): void {
//   localStorage.setItem(GUEST_CART_TOKEN_KEY, token);
// }

// export function clearGuestCartToken(): void {
//   localStorage.removeItem(GUEST_CART_TOKEN_KEY);
// }

// function getCartHeaders(token: string) {
//   return {
//     "X-Guest-Cart-Token": token,
//   };
// }

// // Prevent multiple cart creation requests.
// let createCartPromise: Promise<AddCartResponse> | null = null;

// // Create a new guest cart.
// export async function createCart(): Promise<AddCartResponse> {
//   if (createCartPromise) {
//     return createCartPromise;
//   }

//   createCartPromise = (async () => {
//     const response = await cartAxiosInstance.post("/AddCart");

//     const data = getResponseData<AddCartResponse>(response.data);

//     if (!data.guestCartToken) {
//       throw new Error(
//         "Guest cart token was not returned by the AddCart API."
//       );
//     }

//     saveGuestCartToken(data.guestCartToken);

//     return data;
//   })();

//   try {
//     return await createCartPromise;
//   } finally {
//     createCartPromise = null;
//   }
// }

// // Get existing token or create a new guest cart.
// export async function ensureGuestCartToken(): Promise<string> {
//   const existingToken = getGuestCartToken();

//   if (existingToken) {
//     return existingToken;
//   }

//   const cart = await createCart();

//   if (!cart.guestCartToken) {
//     throw new Error("Unable to create guest cart.");
//   }

//   return cart.guestCartToken;
// }

// // Get cart with all items.
// export async function getCart(): Promise<CartResponse> {
//   const token = await ensureGuestCartToken();

//   const response = await cartAxiosInstance.get("/GetCart", {
//     headers: getCartHeaders(token),
//   });

//   return getResponseData<CartResponse>(response.data);
// }

// // Get one cart item by cart item ID.
// export async function getCartItemById(
//   cartItemId: string
// ): Promise<CartItem> {
//   if (!cartItemId) {
//     throw new Error("Cart item ID is required.");
//   }

//   const token = await ensureGuestCartToken();

//   const response = await cartAxiosInstance.get(
//     `/GetCartItemById/${encodeURIComponent(cartItemId)}`,
//     {
//       headers: getCartHeaders(token),
//     }
//   );

//   return getResponseData<CartItem>(response.data);
// }
// // Add menu item to cart.
// export async function addCartItem(
//   input: CartItemRequest
// ): Promise<CartResponse> {
 

//   if (!input.menuItemId) {
//     throw new Error("Menu item ID is required.");
//   }

//   if (!Number.isInteger(input.quantity) || input.quantity < 1) {
//     throw new Error("Quantity must be a positive integer.");
//   }

//   const token = await ensureGuestCartToken();
//  console.log("========== ADD TO CART ==========");
//   console.log("Guest Cart Token:", token);
//   console.log("Menu Item ID:", input.menuItemId);
//   console.log("Quantity:", input.quantity);

//  console.log("========== ADD TO CART CALL==========");
//   const requestBody = {
//     menuItemId: input.menuItemId,
//     quantity: input.quantity,
//   };

//   console.log("Add Cart Request Body:", requestBody);

//   try {
//     const response = await cartAxiosInstance.post(
//       "/AddCartItem",
//       requestBody,
//       {
//         headers: getCartHeaders(token),
//       }
//     );

//     console.log("Add Cart API Success:", response.data);

//     return await getCart();

//   } catch (error) {
//     console.error("Add Cart API Failed:", error);
//     throw error;
//   }
// }

// // Update cart item quantity.
// export async function updateCartItemQty(
//   cartItemId: string,
//   quantity: number
// ): Promise<CartResponse> {
//   console.log("1234567---------");
//   if (!cartItemId) {
//     throw new Error("Cart item ID is required.");
//   }

//   if (!Number.isInteger(quantity) || quantity < 1) {
//     throw new Error("Quantity must be a positive integer.");
//   }

//   console.log("12345678---------");
//   const token = await ensureGuestCartToken();
// console.log("token---------"+token);
// console.log("cartItemId---------"+cartItemId);
// console.log("quantity---------"+quantity);
//   await cartAxiosInstance.put(
//     `/UpdateCartItemQty/${encodeURIComponent(cartItemId)}`,
//     {
//       quantity,
//     },
//     {
//       headers: getCartHeaders(token),
//     }
//   );

//   return getCart();
// }

// // Remove item using cart item ID.
// export async function removeCartItem(
//   cartItemId: string
// ): Promise<CartResponse> {
//   if (!cartItemId) {
//     throw new Error("Cart item ID is required.");
//   }

//   const token = await ensureGuestCartToken();

//   await cartAxiosInstance.delete(
//     `/RemoveCartItem/${encodeURIComponent(cartItemId)}`,
//     {
//       headers: getCartHeaders(token),
//     }
//   );

//   return getCart();
// }

// // Remove item using menu item ID.
// export async function removeCartItemByMenuItemId(
//   menuItemId: string
// ): Promise<CartResponse> {
//   if (!menuItemId) {
//     throw new Error("Menu item ID is required.");
//   }

//   const token = await ensureGuestCartToken();

//   await cartAxiosInstance.delete(
//     `/RemoveCartItemById/${encodeURIComponent(menuItemId)}`,
//     {
//       headers: getCartHeaders(token),
//     }
//   );

//   return getCart();
// }

// // Validate cart.
// export async function validateCart(): Promise<unknown> {
//   const token = await ensureGuestCartToken();

//   const response = await cartAxiosInstance.get("/ValidateCart", {
//     headers: getCartHeaders(token),
//   });

//   return getResponseData<unknown>(response.data);
// }

// // Delete entire cart.
// export async function deleteCart(): Promise<void> {
//   const token = getGuestCartToken();

//   if (!token) {
//     return;
//   }

//   await cartAxiosInstance.delete("/DeleteCart", {
//     headers: getCartHeaders(token),
//   });

//   // Clear token only after successful API response.
//   clearGuestCartToken();
// }

// // Delete cart item using DeleteCartItem endpoint.
// export async function deleteCartItem(): Promise<void> {
//   const token = await ensureGuestCartToken();

//   await cartAxiosInstance.delete("/DeleteCartItem", {
//     headers: getCartHeaders(token),
//   });
// }

// // Reset guest cart.
// export async function resetGuestCart(): Promise<void> {
//   await deleteCart();
// }


import { cartAxiosInstance } from "./axiosInstance";

// =====================================================
// CONSTANT
// =====================================================

const GUEST_CART_TOKEN_KEY = "aaplaDabba_guestCartToken";

// =====================================================
// REQUEST INTERFACES
// =====================================================

export interface CartItemRequest {
  menuItemId: string;
  quantity: number;
}

export interface UpdateCartQuantityRequest {
  quantity: number;
}

// =====================================================
// CART ITEM RESPONSE
// =====================================================

export interface CartItem {
  id: string;
  menuItemId: string;
  menuItemName: string;
  description: string | null;

  menuCategoryId: string;
  categoryName: string | null;

  menuSubCategoryId: string;
  subCategoryName: string | null;

  mealTypeId: string;
  mealTypeName: string | null;

  foodTypeId: string;
  foodTypeName: string | null;

  dietaryTagNames: string[];

  imageUrl: string | null;
  preparationTimeMinutes: number;

  unitPrice: number;
  quantity: number;
  lineTotal: number;
  currencyCode: string;
}

// =====================================================
// CART RESPONSE
// =====================================================

export interface CartResponse {
  cartId: string;
  status: string;
  currencyCode: string;
  items: CartItem[];

  totalQuantity: number;
  subtotal: number;

  expiresAtUtc: string;
  updatedAtUtc: string | null;
}

// =====================================================
// ADD CART RESPONSE
// =====================================================

export interface AddCartResponse {
  cartId?: string;
  guestCartToken?: string;
  expiresAtUtc?: string;
  currencyCode?: string;
  [key: string]: unknown;
}

// =====================================================
// RESPONSE HANDLER
// =====================================================

function getResponseData<T>(responseData: unknown): T {
  let result = responseData;

  if (
    result &&
    typeof result === "object" &&
    !Array.isArray(result) &&
    "data" in result &&
    Object.keys(result).length === 1
  ) {
    result = (result as { data: unknown }).data;
  }

  return result as T;
}

// =====================================================
// LOCAL STORAGE TOKEN MANAGEMENT
// =====================================================

// Get saved guest cart token
export function getGuestCartToken(): string | null {
  return localStorage.getItem(GUEST_CART_TOKEN_KEY);
}

// Save guest cart token
export function saveGuestCartToken(token: string): void {
  if (!token) {
    throw new Error("Guest Cart Token is required.");
  }

  localStorage.setItem(GUEST_CART_TOKEN_KEY, token);
}

// Clear guest cart token
export function clearGuestCartToken(): void {
  localStorage.removeItem(GUEST_CART_TOKEN_KEY);
}

// Create request headers with guest token
function getCartHeaders(token: string) {
  return {
    "X-Guest-Cart-Token": token,
  };
}

// =====================================================
// CREATE CART
// POST /AddCart
// =====================================================

let createCartPromise: Promise<AddCartResponse> | null = null;

export async function createCart(): Promise<AddCartResponse> {
  if (createCartPromise) {
    return createCartPromise;
  }

  createCartPromise = (async () => {
    const response = await cartAxiosInstance.post("/AddCart");

    const data = getResponseData<AddCartResponse>(response.data);

    if (!data?.guestCartToken) {
      throw new Error(
        "Guest Cart Token was not returned by AddCart API."
      );
    }

    // Save token in browser localStorage
    saveGuestCartToken(data.guestCartToken);

    console.log("Cart Created Successfully:", data);
    console.log(
      "Guest Cart Token Saved:",
      getGuestCartToken()
    );

    return data;
  })();

  try {
    return await createCartPromise;
  } finally {
    createCartPromise = null;
  }
}

// =====================================================
// GET EXISTING TOKEN OR CREATE NEW CART
// =====================================================

export async function ensureGuestCartToken(): Promise<string> {
  const existingToken = getGuestCartToken();

  // Reuse existing token
  if (existingToken) {
    return existingToken;
  }

  // Create new cart if token does not exist
  const cart = await createCart();

  if (!cart.guestCartToken) {
    throw new Error("Unable to create guest cart.");
  }

  return cart.guestCartToken;
}

// =====================================================
// GET CART
// GET /GetCart
// =====================================================

export async function getCart(): Promise<CartResponse> {
  const token = await ensureGuestCartToken();

  const response = await cartAxiosInstance.get("/GetCart", {
    headers: getCartHeaders(token),
  });

  const data = getResponseData<CartResponse>(response.data);

  console.log("Get Cart Response:", data);

  return data;
}

// =====================================================
// GET CART ITEM BY ID
// GET /GetCartItemById/{cartItemId}
// =====================================================

export async function getCartItemById(
  cartItemId: string
): Promise<CartItem> {
  if (!cartItemId) {
    throw new Error("Cart Item ID is required.");
  }

  const token = await ensureGuestCartToken();

  const response = await cartAxiosInstance.get(
    `/GetCartItemById/${encodeURIComponent(cartItemId)}`,
    {
      headers: getCartHeaders(token),
    }
  );

  return getResponseData<CartItem>(response.data);
}

// =====================================================
// ADD CART ITEM
// POST /AddCartItem
// =====================================================

export async function addCartItem(
  input: CartItemRequest
): Promise<CartResponse> {
  if (!input.menuItemId) {
    throw new Error("Menu Item ID is required.");
  }

  if (!Number.isInteger(input.quantity) || input.quantity < 1) {
    throw new Error("Quantity must be a positive integer.");
  }

  const token = await ensureGuestCartToken();

  const requestBody: CartItemRequest = {
    menuItemId: input.menuItemId,
    quantity: input.quantity,
  };

  console.log("Add Cart Request:", requestBody);
  console.log("Guest Cart Token:", token);

  const response = await cartAxiosInstance.post(
    "/AddCartItem",
    requestBody,
    {
      headers: getCartHeaders(token),
    }
  );

  console.log("Add Cart Item Response:", response.data);

  // Fetch latest cart after adding item
  return await getCart();
}

// =====================================================
// UPDATE CART ITEM QUANTITY
// PUT /UpdateCartItemQty/{cartItemId}
// =====================================================

export async function updateCartItemQty(
  cartItemId: string,
  quantity: number
): Promise<CartResponse> {
  if (!cartItemId) {
    throw new Error("Cart Item ID is required.");
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantity must be a positive integer.");
  }

  const token = await ensureGuestCartToken();

  await cartAxiosInstance.put(
    `/UpdateCartItemQty/${encodeURIComponent(cartItemId)}`,
    {
      quantity,
    },
    {
      headers: getCartHeaders(token),
    }
  );

  return await getCart();
}

// =====================================================
// REMOVE CART ITEM BY CART ITEM ID
// DELETE /RemoveCartItem/{cartItemId}
// =====================================================

export async function removeCartItem(
  cartItemId: string
): Promise<CartResponse> {
  if (!cartItemId) {
    throw new Error("Cart Item ID is required.");
  }

  const token = await ensureGuestCartToken();

  await cartAxiosInstance.delete(
    `/RemoveCartItem/${encodeURIComponent(cartItemId)}`,
    {
      headers: getCartHeaders(token),
    }
  );

  return await getCart();
}

// =====================================================
// REMOVE CART ITEM BY MENU ITEM ID
// DELETE /RemoveCartItemById/{menuItemId}
// =====================================================

export async function removeCartItemByMenuItemId(
  menuItemId: string
): Promise<CartResponse> {
  if (!menuItemId) {
    throw new Error("Menu Item ID is required.");
  }

  const token = await ensureGuestCartToken();

  await cartAxiosInstance.delete(
    `/RemoveCartItemById/${encodeURIComponent(menuItemId)}`,
    {
      headers: getCartHeaders(token),
    }
  );

  return await getCart();
}

// =====================================================
// VALIDATE CART
// GET /ValidateCart
// =====================================================

export async function validateCart(): Promise<unknown> {
  const token = await ensureGuestCartToken();

  const response = await cartAxiosInstance.get("/ValidateCart", {
    headers: getCartHeaders(token),
  });

  return getResponseData<unknown>(response.data);
}

// =====================================================
// DELETE ENTIRE CART
// DELETE /DeleteCart
// =====================================================

export async function deleteCart(): Promise<void> {
  const token = getGuestCartToken();

  if (!token) {
    return;
  }

  await cartAxiosInstance.delete("/DeleteCart", {
    headers: getCartHeaders(token),
  });

  // Remove token only after successful API response
  clearGuestCartToken();
}

// =====================================================
// DELETE CART ITEM
// DELETE /DeleteCartItem
// =====================================================

export async function deleteCartItem(): Promise<void> {
  const token = await ensureGuestCartToken();

  await cartAxiosInstance.delete("/DeleteCartItem", {
    headers: getCartHeaders(token),
  });
}

// =====================================================
// RESET GUEST CART
// =====================================================

export async function resetGuestCart(): Promise<void> {
  await deleteCart();
}
