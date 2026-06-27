import { createContext, useContext, useReducer, useState, useCallback, useEffect, useMemo } from 'react'
import { ORDER_TYPE, DELIVERY_FEE, MIN_DELIVERY_ITEMS } from '../utils/constants'

const CartContext = createContext(null)

const STORAGE_KEY = 'titikpedas_cart'

/**
 * ID unik per cart entry: gabungan menuItemId + sorted topping IDs.
 * Item yang sama tapi beda topping → cartItemId berbeda → baris terpisah.
 */
function makeCartItemId(menuItemId, toppings = []) {
  const toppingKey = [...toppings].map((t) => t.id).sort().join(',')
  return `${menuItemId}|${toppingKey}`
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const cartItemId = makeCartItemId(action.item.menuItemId, action.item.toppings)
      const existingIdx = state.findIndex((i) => i.cartItemId === cartItemId)

      if (existingIdx !== -1) {
        return state.map((item, idx) =>
          idx === existingIdx ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...state, { ...action.item, cartItemId, quantity: 1 }]
    }

    case 'REMOVE_ITEM':
      return state.filter((i) => i.cartItemId !== action.cartItemId)

    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0)
        return state.filter((i) => i.cartItemId !== action.cartItemId)
      return state.map((i) =>
        i.cartItemId === action.cartItemId ? { ...i, quantity: action.quantity } : i
      )
    }

    case 'CLEAR_CART':
      return []

    default:
      return state
  }
}

export function CartProvider({ children }) {
  // Inisialisasi dari localStorage agar cart tidak hilang saat refresh
  const [cartItems, dispatch] = useReducer(cartReducer, [], () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // Pilihan metode pembelian: take_away (default) atau delivery
  const [orderType, setOrderType] = useState(ORDER_TYPE.TAKE_AWAY)

  // Sinkron ke localStorage setiap kali cartItems berubah
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  // ─── Actions ────────────────────────────────────────────────────────────────
  //
  // addToCart menerima objek:
  // { menuItemId, name, basePrice, toppings: [{ id, name, price }] }

  const addToCart = useCallback((item) => {
    dispatch({ type: 'ADD_ITEM', item })
  }, [])

  const removeFromCart = useCallback((cartItemId) => {
    dispatch({ type: 'REMOVE_ITEM', cartItemId })
  }, [])

  const updateQuantity = useCallback((cartItemId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', cartItemId, quantity })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' })
  }, [])

  // ─── Computed Values ─────────────────────────────────────────────────────────

  const { totalItems, totalPrice } = useMemo(() => {
    let items = 0
    let price = 0
    for (const item of cartItems) {
      items += item.quantity
      const toppingSum = item.toppings.reduce((s, t) => s + t.price, 0)
      price += (item.basePrice + toppingSum) * item.quantity
    }
    return { totalItems: items, totalPrice: price }
  }, [cartItems])

  // Delivery hanya tersedia jika total item >= 3 (sesuai PRD)
  const isDeliveryEligible = totalItems >= MIN_DELIVERY_ITEMS

  // Jika orderType delivery tapi tidak eligible, fee tetap 0 (validasi di checkout)
  const deliveryFee =
    orderType === ORDER_TYPE.DELIVERY && isDeliveryEligible ? DELIVERY_FEE : 0

  const grandTotal = totalPrice + deliveryFee

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        orderType,
        setOrderType,
        totalItems,
        totalPrice,
        deliveryFee,
        grandTotal,
        isDeliveryEligible,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart harus digunakan di dalam CartProvider')
  return ctx
}
