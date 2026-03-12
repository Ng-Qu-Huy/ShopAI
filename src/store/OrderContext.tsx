import React, { createContext, useContext, useState } from 'react';

export type OrderItem = {
    id: number;
    name: string;
    price: number | string;
    quantity: number;
    image: any;
};

export type Order = {
    id: string;
    date: string;
    status: 'waiting' | 'shipping' | 'delivered' | 'cancelled';
    statusText: string;
    totalPrice: number;
    items: OrderItem[];
};

type OrderContextType = {
    orders: Order[];
    addOrder: (order: Order) => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
    const [orders, setOrders] = useState<Order[]>([]);

    // Hàm thêm đơn hàng mới (đẩy lên đầu danh sách)
    const addOrder = (order: Order) => {
        setOrders([order, ...orders]);
    };

    return (
        <OrderContext.Provider value={{ orders, addOrder }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => {
    const context = useContext(OrderContext);
    if (!context) throw new Error('useOrder must be used within an OrderProvider');
    return context;
};