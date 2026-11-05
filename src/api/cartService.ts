
import { cartAxiosInstance } from "./axiosInstance";

// =====================================================
// CONSTANTS
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
// CART ITEM RESPONSE DTO
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
// CART RESPONSE DTO
// =====================================================

export interface CartResponse {
  cartId: string;
  status: string;
  currencyCode: string;
  expiresAtUtc: string;

  items: CartItem[];

  subtotal: number;
  totalQuantity: number;

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
// GUEST CART TOKEN - LOCAL STORAGE
// =====================================================

// Get saved token
export function getGuestCartToken(): string | null {
  return localStorage.getItem(GUEST_CART_TOKEN_KEY);
}

// Save token
export function saveGuestCartToken(token: string): void {
  if (!token || !token.trim()) {
    throw new Error("Guest Cart Token is required.");
  }

  localStorage.setItem(GUEST_CART_TOKEN_KEY, token);
}

// Remove token
export function clearGuestCartToken(): void {
  localStorage.removeItem(GUEST_CART_TOKEN_KEY);
}

// Create headers with guest token
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
  // Prevent multiple cart creation requests
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

    // Save token in localStorage
    saveGuestCartToken(data.guestCartToken);

    console.log("Cart Created:", data);
    console.log("Saved Guest Token:", getGuestCartToken());

    return data;
  })();

  try {
    return await createCartPromise;
  } finally {
    createCartPromise = null;
  }
}

// =====================================================
// ENSURE GUEST CART TOKEN
// =====================================================

export async function ensureGuestCartToken(): Promise<string> {
  // Use existing token from localStorage
  const existingToken = getGuestCartToken();

  if (existingToken) {
    return existingToken;
  }

  // Create cart only if token does not exist
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

  return getResponseData<CartResponse>(response.data);
}

// =====================================================
// GET MY CART
// GET /GetMyCart
// =====================================================

export async function getMyCart(): Promise<CartResponse> {
  const token = await ensureGuestCartToken();

  const response = await cartAxiosInstance.get("/GetMyCart", {
    headers: getCartHeaders(token),
  });

  const data = getResponseData<CartResponse>(response.data);

  console.log("GetMyCart Response:", data);

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
// ASSOCIATE GUEST CART
// POST /AssociateGuestCart
// =====================================================

export async function associateGuestCart(
  requestBody: Record<string, unknown>
): Promise<unknown> {
  const token = await ensureGuestCartToken();

  const response = await cartAxiosInstance.post(
    "/AssociateGuestCart",
    requestBody,
    {
      headers: getCartHeaders(token),
    }
  );

  return getResponseData<unknown>(response.data);
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

  const response = await cartAxiosInstance.post(
    "/AddCartItem",
    requestBody,
    {
      headers: getCartHeaders(token),
    }
  );

  console.log("Add Cart Item Response:", response.data);

  return await getMyCart();
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
    { quantity },
    {
      headers: getCartHeaders(token),
    }
  );

  return await getMyCart();
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

  return await getMyCart();
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

  return await getMyCart();
}

// =====================================================
// DELETE CART
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
// ADMIN: GET ALL CARTS
// GET /GetAllCarts
// =====================================================

export async function getAllCarts(): Promise<unknown> {
  const response = await cartAxiosInstance.get("/GetAllCarts");

  const data = getResponseData<unknown>(response.data);

  console.log("Get All Carts Response:", data);

  return data;
}

// =====================================================
// ADMIN: GET CART BY ID
// GET /GetCartById/{cartId}
// =====================================================

export async function getCartById(
  cartId: string
): Promise<CartResponse> {
  if (!cartId) {
    throw new Error("Cart ID is required.");
  }

  const response = await cartAxiosInstance.get(
    `/GetCartById/${encodeURIComponent(cartId)}`
  );

  return getResponseData<CartResponse>(response.data);
}

// =====================================================
// ADMIN: UPDATE CART
// PUT /UpdateCart/{cartId}
// =====================================================

export async function updateCart(
  cartId: string,
  requestBody: Record<string, unknown>
): Promise<unknown> {
  if (!cartId) {
    throw new Error("Cart ID is required.");
  }

  const response = await cartAxiosInstance.put(
    `/UpdateCart/${encodeURIComponent(cartId)}`,
    requestBody
  );

  return getResponseData<unknown>(response.data);
}

// =====================================================
// ADMIN: DELETE CART BY ID
// DELETE /Admin/DeleteCart/{cartId}
// =====================================================

export async function adminDeleteCart(
  cartId: string
): Promise<void> {
  if (!cartId) {
    throw new Error("Cart ID is required.");
  }

  await cartAxiosInstance.delete(
    `/Admin/DeleteCart/${encodeURIComponent(cartId)}`
  );
}

// =====================================================
// RESET GUEST CART
// =====================================================

export async function resetGuestCart(): Promise<void> {
  await deleteCart();
}
