
import { cartAxiosInstance } from "./axiosInstance";

const GUEST_CART_TOKEN_KEY = "aaplaDabba_guestCartToken";

export interface CartItemRequest {
  menuItemId: string;
  quantity: number;
}

export interface UpdateCartQuantityRequest {
  quantity: number;
}

export interface CartItem {
  cartItemId: string;
  menuItemId: string;
  name?: string;
  description?: string;
  categoryName?: string;
  quantity: number;
  unitPrice?: number;
  price?: number;
  lineTotal?: number;
  currencyCode?: string;
  imageUrl?: string;
  [key: string]: unknown;
}

export interface CartResponse {
  cartId: string;
  guestCartToken?: string;
  expiresAtUtc?: string;
  currencyCode?: string;
  items: CartItem[];
  status?: string;
  subtotal: number;
  totalQuantity: number;
  updatedAtUtc?: string | null;
  [key: string]: unknown;
}

export interface AddCartResponse {
  cartId?: string;
  guestCartToken?: string;
  expiresAtUtc?: string;
  currencyCode?: string;
  [key: string]: unknown;
}

function getResponseData<T>(responseData: unknown): T {
  let result = responseData;

  if (
    result &&
    typeof result === "object" &&
    "data" in result &&
    Object.keys(result).length === 1
  ) {
    result = (result as { data: unknown }).data;
  }

  return result as T;
}

// Guest cart token management
export function getGuestCartToken(): string | null {
  return localStorage.getItem(GUEST_CART_TOKEN_KEY);
}

function saveGuestCartToken(token: string): void {
  localStorage.setItem(GUEST_CART_TOKEN_KEY, token);
}

export function clearGuestCartToken(): void {
  localStorage.removeItem(GUEST_CART_TOKEN_KEY);
}

function getCartHeaders(token: string) {
  return {
    "X-Guest-Cart-Token": token,
  };
}

// Prevent duplicate cart reset requests during React StrictMode.
let resetCartPromise: Promise<void> | null = null;

// Delete previous cart and start with a fresh guest cart.
export async function resetGuestCart(): Promise<void> {
  if (resetCartPromise) {
    return resetCartPromise;
  }

  const token = getGuestCartToken();

  if (!token) {
    return;
  }

  // Clear old token immediately so it cannot be reused.
  clearGuestCartToken();

  resetCartPromise = (async () => {
    await cartAxiosInstance.delete("/DeleteCart", {
      headers: getCartHeaders(token),
    });
  })();

  try {
    await resetCartPromise;
  } finally {
    resetCartPromise = null;
  }
}

// Get existing token or create a new cart.
export async function ensureGuestCartToken(): Promise<string> {
  const existingToken = getGuestCartToken();

  if (existingToken) {
    return existingToken;
  }

  const cart = await createCart();

  if (!cart.guestCartToken) {
    throw new Error(
      "Cart API did not return guestCartToken. Check the AddCart response."
    );
  }

  return cart.guestCartToken;
}

// Create a new guest cart.
export async function createCart(): Promise<AddCartResponse> {
  const response = await cartAxiosInstance.post("/AddCart");

  const data = getResponseData<AddCartResponse>(response.data);

  if (data.guestCartToken) {
    saveGuestCartToken(data.guestCartToken);
  }

  return data;
}

// Get cart with all items.
export async function getCart(): Promise<CartResponse> {
  const token = await ensureGuestCartToken();

  const response = await cartAxiosInstance.get("/GetCart", {
    headers: getCartHeaders(token),
  });

  return getResponseData<CartResponse>(response.data);
}

// Get one cart item by cart item ID.
export async function getCartItemById(
  cartItemId: string
): Promise<CartItem> {
  if (!cartItemId) {
    throw new Error("Cart item ID is required.");
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

// Add menu item to cart.
export async function addCartItem(
  input: CartItemRequest
): Promise<CartResponse> {
  if (!input.menuItemId) {
    throw new Error("Menu item ID is required.");
  }

  if (!Number.isInteger(input.quantity) || input.quantity < 1) {
    throw new Error("Quantity must be a positive integer.");
  }

  const token = await ensureGuestCartToken();

  await cartAxiosInstance.post(
    "/AddCartItem",
    {
      menuItemId: input.menuItemId,
      quantity: input.quantity,
    },
    {
      headers: getCartHeaders(token),
    }
  );

  return getCart();
}

// Update cart item quantity.
export async function updateCartItemQty(
  cartItemId: string,
  quantity: number
): Promise<CartResponse> {
  if (!cartItemId) {
    throw new Error("Cart item ID is required.");
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

  return getCart();
}

// Remove item using cart item ID.
export async function removeCartItem(
  cartItemId: string
): Promise<CartResponse> {
  if (!cartItemId) {
    throw new Error("Cart item ID is required.");
  }

  const token = await ensureGuestCartToken();

  await cartAxiosInstance.delete(
    `/RemoveCartItem/${encodeURIComponent(cartItemId)}`,
    {
      headers: getCartHeaders(token),
    }
  );

  return getCart();
}

// Remove item using menu item ID.
export async function removeCartItemByMenuItemId(
  menuItemId: string
): Promise<CartResponse> {
  if (!menuItemId) {
    throw new Error("Menu item ID is required.");
  }

  const token = await ensureGuestCartToken();

  await cartAxiosInstance.delete(
    `/RemoveCartItemById/${encodeURIComponent(menuItemId)}`,
    {
      headers: getCartHeaders(token),
    }
  );

  return getCart();
}

// Validate cart.
export async function validateCart(): Promise<unknown> {
  const token = await ensureGuestCartToken();

  const response = await cartAxiosInstance.get("/ValidateCart", {
    headers: getCartHeaders(token),
  });

  return getResponseData<unknown>(response.data);
}

// Delete entire cart and clear its token.
export async function deleteCart(): Promise<void> {
  await resetGuestCart();
}

// Delete cart item using API endpoint.
export async function deleteCartItem(): Promise<void> {
  const token = await ensureGuestCartToken();

  await cartAxiosInstance.delete("/DeleteCartItem", {
    headers: getCartHeaders(token),
  });
}
