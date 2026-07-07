import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  requiresQuote?: boolean;
  imageUrl?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  increaseItem: (id: string) => void;
  decreaseItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // Thêm sản phẩm vào giỏ
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i,
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      // Cập nhật số lượng trực tiếp, số lượng <= 0 sẽ xóa sản phẩm
      updateQuantity: (id, quantity) =>
        set((state) => {
          const normalizedQuantity = Math.floor(quantity);

          return {
            items:
              normalizedQuantity <= 0
                ? state.items.filter((i) => i.id !== id)
                : state.items.map((i) =>
                    i.id === id ? { ...i, quantity: normalizedQuantity } : i,
                  ),
          };
        }),

      // Tăng số lượng
      increaseItem: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        })),

      // Giảm số lượng, nếu còn 0 thì xóa khỏi giỏ
      decreaseItem: (id) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
            .filter((i) => i.quantity > 0),
        })),

      // Xóa sản phẩm
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      // Xóa toàn bộ giỏ (Dùng sau khi khách gửi form tư vấn thành công)
      clearCart: () => set({ items: [] }),

      // Tính tổng tiền (mang tính tham khảo)
      getCartTotal: () => {
        return get().items.reduce(
          (total, item) =>
            item.requiresQuote ? total : total + item.price * item.quantity,
          0,
        );
      },
    }),
    {
      name: "hoang-long-cart-storage", // Tên key lưu trong localStorage
    },
  ),
);
