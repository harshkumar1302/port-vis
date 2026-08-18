import { resolveArtPrice } from './artwork';

/** Normalize a numeric sale price from cart row or catalog row */
export function enrichCartItem(item, catalogRow) {
  const price = resolveArtPrice(item) ?? resolveArtPrice(catalogRow);
  const original = item.original_price ?? catalogRow?.original_price ?? null;
  return {
    ...item,
    price,
    original_price: original != null && original !== '' ? Number(original) : null,
  };
}

export function enrichCart(cart, catalog = []) {
  return cart.map((item) => {
    const live = catalog.find((row) => row.id === item.id);
    return enrichCartItem(item, live);
  });
}

export function getCartLineTotal(item) {
  const price = resolveArtPrice(item);
  if (price == null) return null;
  return price * (item.quantity || 1);
}

export function getCartSubtotal(cart) {
  return cart.reduce((sum, item) => sum + (getCartLineTotal(item) ?? 0), 0);
}
