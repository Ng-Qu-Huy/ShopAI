import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, View } from 'react-native';
import { useCartAnimation } from '../store/CartAnimationContext';

/**
 * CartAnimationOverlay
 * Được mount ở ngoài cùng App (sau NavigationContainer),
 * dùng pointerEvents="none" để không block touch events.
 */
const CartAnimationOverlay = () => {
    const { animationPayload, cartIconPosition, onAnimationComplete } = useCartAnimation();

    // Animated values
    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!animationPayload || !cartIconPosition) return;

        const { startPos } = animationPayload;

        // Tâm điểm xuất phát (giữa ảnh sản phẩm)
        const fromX = startPos.x + startPos.width / 2 - 30; // trừ nửa kích thước flyingImage (60/2)
        const fromY = startPos.y + startPos.height / 2 - 30;

        // Tâm điểm đích (giữa icon giỏ hàng)
        const toX = cartIconPosition.x + cartIconPosition.width / 2 - 30;
        const toY = cartIconPosition.y + cartIconPosition.height / 2 - 30;

        // Reset về điểm xuất phát
        translateX.setValue(fromX);
        translateY.setValue(fromY);
        scale.setValue(1);
        opacity.setValue(1);

        // Hiệu ứng bay: parabol chéo lên + thu nhỏ + mờ dần
        Animated.parallel([
            Animated.timing(translateX, {
                toValue: toX,
                duration: 700,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: toY,
                duration: 700,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(scale, {
                toValue: 0.15,
                duration: 700,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            // Mờ dần chỉ ở giai đoạn cuối (delay 400ms)
            Animated.sequence([
                Animated.delay(400),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]),
        ]).start(() => {
            onAnimationComplete(); // Báo context: xong, bounce cart icon đi
        });
    }, [animationPayload]);

    // Ẩn hoàn toàn khi không có animation
    if (!animationPayload) return null;

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Animated.Image
                source={{ uri: animationPayload.imageUrl }}
                style={[
                    styles.flyingImage,
                    {
                        opacity,
                        transform: [
                            { translateX },
                            { translateY },
                            { scale },
                        ],
                    },
                ]}
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    flyingImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: '#EFF6FF',
    },
});

export default CartAnimationOverlay;
