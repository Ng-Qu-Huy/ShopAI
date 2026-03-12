import { create } from 'zustand';

// Định nghĩa Type (Giống hệt cũ)
type Product = {
    id: number;
    name: string;
    price: string | number;
    image: any;
};

type CartItem = Product & {
    quantity: number;
    checked: boolean;
    rawPrice: number;
};

interface CartState {
    cartItems: CartItem[];
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, type: 'increase' | 'decrease') => void;
    toggleCheck: (id: number) => void;
    clearCart: () => void;
    // Hàm tính toán
    getTotalPrice: () => number;
    getTotalItems: () => number;
}

// KHỞI TẠO ZUSTAND STORE
export const useCartStore = create<CartState>((set, get) => ({
    cartItems: [],

    addToCart: (product, quantity = 1) => set((state) => {
        // Xử lý giá tiền (Lọc lấy số)
        const rawPrice = typeof product.price === 'number'
            ? product.price
            : parseInt(product.price.toString().replace(/[^0-9]/g, ''), 10);

        // Kiểm tra xem SP đã có trong giỏ chưa
        const existingItem = state.cartItems.find(item => item.id === product.id);

        if (existingItem) {
            return {
                cartItems: state.cartItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                )
            };
        }

        // Thêm mới
        return {
            cartItems: [...state.cartItems, { ...product, quantity, checked: true, rawPrice }]
        };
    }),

    removeFromCart: (id) => set((state) => ({
        cartItems: state.cartItems.filter(item => item.id !== id)
    })),

    updateQuantity: (id, type) => set((state) => ({
        cartItems: state.cartItems.map(item => {
            if (item.id === id) {
                if (type === 'decrease' && item.quantity === 1) return item;
                const newQty = type === 'increase' ? item.quantity + 1 : item.quantity - 1;
                return { ...item, quantity: newQty };
            }
            return item;
        })
    })),

    toggleCheck: (id) => set((state) => ({
        cartItems: state.cartItems.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        )
    })),

    clearCart: () => set({ cartItems: [] }),

    // Tính tổng tiền các món được check
    getTotalPrice: () => {
        return get().cartItems.reduce((sum, item) => {
            return item.checked ? sum + item.rawPrice * item.quantity : sum;
        }, 0);
    },

    // Tính tổng số lượng hàng trong giỏ
    getTotalItems: () => {
        return get().cartItems.reduce((sum, item) => sum + item.quantity, 0);
    }
}));