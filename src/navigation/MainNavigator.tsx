import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../constants/routes';

import TabNavigator from './TabNavigator';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ProductDetailScreen from '../screens/product/ProductDetailScreen';
import CheckoutScreen from '../screens/checkout/CheckoutScreen';
import OrderHistoryScreen from '../screens/orders/OrderHistoryScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import ProductListScreen from '../screens/product/ProductListScreen'; // <--- 1. IMPORT LẠI FILE NÀY
import SearchScreen from '../screens/search/SearchScreen';
import FavoritesScreen from '../screens/favorites/FavoritesScreen';
import OrderDetailScreen from '../screens/orders/OrderDetailScreen';


const Stack = createNativeStackNavigator();

const MainNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: true }}>
            <Stack.Screen
                name="MainTabs"
                component={TabNavigator}
                options={{ headerShown: false }}
            />

            {/* AUTH SCREEN */}
            <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name={ROUTES.REGISTER} component={RegisterScreen} options={{ headerShown: false }} />

            {/* MAIN STACK */}

            {/* --- 2. KHÔI PHỤC LẠI MÀN HÌNH DANH SÁCH SẢN PHẨM --- */}
            <Stack.Screen
                name={ROUTES.PRODUCT_LIST}
                component={ProductListScreen}
                options={{ headerShown: false }}
            />
            {/* --------------------------------------------------- */}

            <Stack.Screen
                name={ROUTES.PRODUCT_DETAIL}
                component={ProductDetailScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={ROUTES.CHECKOUT}
                component={CheckoutScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={ROUTES.ORDER_HISTORY}
                component={OrderHistoryScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name={ROUTES.SETTINGS}
                component={SettingsScreen}
                options={{ title: 'Cài đặt' }}
            />
            <Stack.Screen name={ROUTES.SEARCH} component={SearchScreen} options={{ headerShown: false }} />
            <Stack.Screen name={ROUTES.FAVORITES} component={FavoritesScreen} options={{ headerShown: false }} />
            <Stack.Screen name={ROUTES.ORDER_DETAIL} component={OrderDetailScreen} options={{ headerShown: false }} />
        </Stack.Navigator>

    );
};

export default MainNavigator;