import React, { createContext, useContext, useState, useCallback } from 'react';

export type Position = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export type AnimationPayload = {
    startPos: Position;
    imageUrl: string;
};

type CartAnimationContextType = {
    cartIconPosition: Position | null;
    setCartIconPosition: (pos: Position) => void;
    animationPayload: AnimationPayload | null;
    triggerAnimation: (payload: AnimationPayload) => void;
    onAnimationComplete: () => void;
    // Bounce signal cho cart icon
    bounceSignal: number;
};

const CartAnimationContext = createContext<CartAnimationContextType | null>(null);

export const CartAnimationProvider = ({ children }: { children: React.ReactNode }) => {
    const [cartIconPosition, setCartIconPosition] = useState<Position | null>(null);
    const [animationPayload, setAnimationPayload] = useState<AnimationPayload | null>(null);
    const [bounceSignal, setBounceSignal] = useState(0);

    const triggerAnimation = useCallback((payload: AnimationPayload) => {
        // Chỉ trigger khi đã biết tọa độ đích
        if (!cartIconPosition) return;
        setAnimationPayload(payload);
    }, [cartIconPosition]);

    const onAnimationComplete = useCallback(() => {
        setAnimationPayload(null);
        // Tăng signal để cart icon biết cần bounce
        setBounceSignal(prev => prev + 1);
    }, []);

    return (
        <CartAnimationContext.Provider value={{
            cartIconPosition,
            setCartIconPosition,
            animationPayload,
            triggerAnimation,
            onAnimationComplete,
            bounceSignal,
        }}>
            {children}
        </CartAnimationContext.Provider>
    );
};

export const useCartAnimation = () => {
    const ctx = useContext(CartAnimationContext);
    if (!ctx) throw new Error('useCartAnimation must be used inside CartAnimationProvider');
    return ctx;
};
