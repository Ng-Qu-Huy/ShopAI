import React, { useRef, useEffect } from 'react';
import { View, Platform, StyleSheet, Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ROUTES } from '../constants/routes';
import { useCartAnimation } from '../store/CartAnimationContext';

// Import các màn hình
import HomeScreen from '../screens/home/HomeScreen';
import CategoryScreen from '../screens/category/CategoryScreen';
import CartScreen from '../screens/cart/CartScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

// ========================
// CartTabIcon — component riêng để dùng hook và ref đo tọa độ
// ========================
const CartTabIcon = ({ focused, color }: { focused: boolean; color: string }) => {
    const iconRef = useRef<View>(null);
    const { setCartIconPosition, bounceSignal } = useCartAnimation();

    // Bounce animation value
    const bounceScale = useRef(new Animated.Value(1)).current;

    // Đo tọa độ tuyệt đối của icon sau khi render
    const measureCartIcon = () => {
        if (iconRef.current) {
            iconRef.current.measureInWindow((x, y, width, height) => {
                if (width > 0) { // Đảm bảo đo được giá trị hợp lệ
                    setCartIconPosition({ x, y, width, height });
                }
            });
        }
    };

    // Bounce animation khi nhận tín hiệu từ Context
    useEffect(() => {
        if (bounceSignal === 0) return;
        Animated.sequence([
            Animated.timing(bounceScale, {
                toValue: 1.5,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.spring(bounceScale, {
                toValue: 1,
                friction: 3,
                tension: 200,
                useNativeDriver: true,
            }),
        ]).start();
    }, [bounceSignal]);

    const iconName = focused ? 'cart' : 'cart-outline';

    return (
        <View
            ref={iconRef}
            onLayout={measureCartIcon} // Đo ngay khi layout xong
            style={styles.iconContainer}
        >
            <Animated.View style={{ transform: [{ scale: bounceScale }] }}>
                <Ionicons name={iconName} size={24} color={color} />
            </Animated.View>
            {focused && <View style={[styles.activeDot, { backgroundColor: color }]} />}
        </View>
    );
};

// ========================
// TabNavigator
// ========================
const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: '#2563EB',
                tabBarInactiveTintColor: '#94A3B8',
                tabBarIcon: ({ focused, color }) => {
                    // Cart tab dùng CartTabIcon riêng để đo tọa độ + bounce
                    if (route.name === ROUTES.CART_TAB) {
                        return <CartTabIcon focused={focused} color={color} />;
                    }

                    let iconName = '';
                    if (route.name === ROUTES.HOME_TAB) {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === ROUTES.CATEGORY_TAB) {
                        iconName = focused ? 'grid' : 'grid-outline';
                    } else if (route.name === ROUTES.PROFILE_TAB) {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return (
                        <View style={styles.iconContainer}>
                            <Ionicons name={iconName} size={24} color={color} />
                            {focused && <View style={[styles.activeDot, { backgroundColor: color }]} />}
                        </View>
                    );
                },
            })}
        >
            <Tab.Screen name={ROUTES.HOME_TAB} component={HomeScreen} />
            <Tab.Screen name={ROUTES.CATEGORY_TAB} component={CategoryScreen} />
            <Tab.Screen name={ROUTES.CART_TAB} component={CartScreen} />
            <Tab.Screen name={ROUTES.PROFILE_TAB} component={ProfileScreen} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#FFFFFF',
        height: Platform.OS === 'android' ? 60 : 80,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'absolute',
        bottom: 0,
        borderTopWidth: 0,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        paddingBottom: Platform.OS === 'android' ? 10 : 20,
    },
    iconContainer: { alignItems: 'center', justifyContent: 'center', top: 5 },
    activeDot: { width: 5, height: 5, borderRadius: 2.5, marginTop: 4 },
});

export default TabNavigator;