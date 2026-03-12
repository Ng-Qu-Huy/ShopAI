import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation';
import { CartProvider } from './src/store/CartContext';
import { AuthProvider } from './src/store/AuthContext';
import { OrderProvider } from './src/store/OrderContext';

const App = () => {
    return (
        // 2. BỌC GESTURE HANDLER ROOT VIEW Ở NGOÀI CÙNG
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <AuthProvider>
                    <CartProvider>
                        <OrderProvider>
                            <AppNavigator />
                        </OrderProvider>
                    </CartProvider>
                </AuthProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
};

export default App;