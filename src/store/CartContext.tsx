import React, { createContext, useContext, useState } from 'react';
import { Alert } from 'react-native';

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

// --- QUAN TRỌNG: CẬP NHẬT TYPE TẠI ĐÂY ---
type CartContextType = {
    cartItems: CartItem[];
    // Dòng này báo cho TS biết hàm nhận 2 tham số:
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, type: 'increase' | 'decrease') => void;
    toggleCheck: (id: number) => void;
    totalPrice: number;
    totalItems: number;
};
// ------------------------------------------

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const parsePrice = (price: string | number): number => {
        if (typeof price === 'number') return price;
        return parseInt(price.replace(/[^0-9]/g, ''), 10);
    };

    // Cập nhật logic nhận quantity
    const addToCart = (product: Product, quantity: number = 1) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === product.id);
            if (existingItem) {
                return prevItems.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            } else {
                return [
                    ...prevItems,
                    {
                        ...product,
                        quantity: quantity,
                        checked: true,
                        rawPrice: parsePrice(product.price),
                    },
                ];
            }
        });
        Alert.alert('Thành công', `Đã thêm ${quantity} sản phẩm vào giỏ!`);
    };

    // ... (Các hàm updateQuantity, removeFromCart, toggleCheck, totalPrice giữ nguyên như cũ)
    const updateQuantity = (id: number, type: 'increase' | 'decrease') => {
        setCartItems((prevItems) => {
            return prevItems.map((item) => {
                if (item.id === id) {
                    if (type === 'decrease' && item.quantity === 1) return item;
                    const newQty = type === 'increase' ? item.quantity + 1 : item.quantity - 1;
                    return { ...item, quantity: newQty };
                }
                return item;
            });
        });
    };

    const removeFromCart = (id: number) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const toggleCheck = (id: number) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, checked: !item.checked } : item
            )
        );
    };

    const totalPrice = cartItems.reduce((sum, item) => {
        return item.checked ? sum + item.rawPrice * item.quantity : sum;
    }, 0);

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, toggleCheck, totalPrice, totalItems }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};