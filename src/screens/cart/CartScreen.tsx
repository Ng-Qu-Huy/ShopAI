import React from 'react';
import {
    View, Text, StyleSheet, FlatList, Image, TouchableOpacity,
    SafeAreaView, StatusBar, Alert, Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ROUTES } from '../../constants/routes';
import { Swipeable } from 'react-native-gesture-handler';

// LẤY DỮ LIỆU TỪ ZUSTAND CHUẨN XÁC
import { useCartStore } from '../../store/useCartStore';

const CartScreen = ({ navigation }: any) => {

    // Sử dụng Zustand thay thế Context cũ
    const cartItems = useCartStore((state) => state.cartItems);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const toggleCheck = useCartStore((state) => state.toggleCheck);
    const totalPrice = useCartStore((state) => state.getTotalPrice()); // Gọi hàm tính tổng

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    const confirmRemove = (id: number, name: string) => {
        Alert.alert(
            'Xóa sản phẩm',
            `Bạn có chắc muốn xóa "${name}"?`,
            [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Xóa', onPress: () => removeFromCart(id), style: 'destructive' }
            ]
        );
    };

    // Nút xóa (Hiện ra khi vuốt)
    const renderRightActions = (id: number, name: string) => {
        return (
            <TouchableOpacity style={styles.deleteAction} onPress={() => confirmRemove(id, name)}>
                <Ionicons name="trash-outline" size={28} color="#fff" />
                <Text style={styles.deleteActionText}>Xóa</Text>
            </TouchableOpacity>
        );
    };

    // Render từng sản phẩm
    const renderItem = ({ item }: any) => (
        <Swipeable renderRightActions={() => renderRightActions(item.id, item.name)}>
            <View style={styles.cartItem}>
                <TouchableOpacity onPress={() => toggleCheck(item.id)} style={styles.checkbox}>
                    <Ionicons name={item.checked ? "checkmark-circle" : "ellipse-outline"} size={24} color={item.checked ? "#2563EB" : "#CBD5E1"} />
                </TouchableOpacity>

                <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="contain" />

                <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.itemPrice}>{formatCurrency(item.rawPrice)}</Text>

                    <View style={styles.qtyBox}>
                        <TouchableOpacity onPress={() => updateQuantity(item.id, 'decrease')} style={styles.qtyBtn}>
                            <Ionicons name="remove" size={16} color="#333" />
                        </TouchableOpacity>
                        <Text style={styles.qtyValue}>{item.quantity}</Text>
                        <TouchableOpacity onPress={() => updateQuantity(item.id, 'increase')} style={styles.qtyBtn}>
                            <Ionicons name="add" size={16} color="#333" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Swipeable>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Giỏ hàng ({cartItems.length})</Text>
            </View>

            {/* Danh sách SP */}
            <FlatList
                data={cartItems}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{ padding: 15, paddingBottom: 180 }} // <-- Đã tăng padding để cuộn không bị che
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconBg}>
                            <Ionicons name="cart-outline" size={60} color="#94A3B8" />
                        </View>
                        <Text style={styles.emptyText}>Giỏ hàng trống</Text>
                        <Text style={styles.emptySubText}>Chưa có sản phẩm nào trong giỏ hàng của bạn.</Text>
                        <TouchableOpacity style={styles.shopNowBtn} onPress={() => navigation.navigate(ROUTES.HOME_TAB)}>
                            <Text style={styles.shopNowText}>Mua sắm ngay</Text>
                        </TouchableOpacity>
                    </View>
                }
            />

            {/* Thanh Checkout */}
            {cartItems.length > 0 && (
                <View style={styles.checkoutBar}>
                    <View style={styles.totalInfo}>
                        <Text style={styles.totalLabel}>Tổng thanh toán</Text>
                        <Text style={styles.totalPrice}>{formatCurrency(totalPrice)}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.checkoutBtn}
                        onPress={() => navigation.navigate(ROUTES.CHECKOUT)}
                    >
                        <Text style={styles.checkoutBtnText}>Mua hàng</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F1F5F9' },
    header: { padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },

    // Giao diện sản phẩm
    cartItem: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 15, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
    checkbox: { marginRight: 10 },
    itemImage: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#F8F9FA' },
    itemInfo: { flex: 1, marginLeft: 12 },
    itemName: { fontSize: 14, color: '#334155', fontWeight: '500', marginBottom: 8 },
    itemPrice: { fontSize: 16, fontWeight: 'bold', color: '#2563EB', marginBottom: 10 },

    qtyBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 6, alignSelf: 'flex-start' },
    qtyBtn: { padding: 6, paddingHorizontal: 10 },
    qtyValue: { fontSize: 14, fontWeight: 'bold', color: '#333', marginHorizontal: 8 },

    // Nút Xóa (Vuốt hiện ra)
    deleteAction: {
        backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'center',
        width: 80, borderRadius: 12, marginBottom: 15, marginLeft: 10,
    },
    deleteActionText: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginTop: 5 },

    // FIX LỖI BỊ CHE: Đẩy thanh này lên trên thanh Menu Tab (80px iOS, 60px Android)
    checkoutBar: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 80 : 60,
        width: '100%', backgroundColor: '#fff', flexDirection: 'row',
        justifyContent: 'space-between', alignItems: 'center', padding: 15,
        borderTopWidth: 1, borderTopColor: '#E2E8F0', elevation: 10
    },
    totalInfo: { justifyContent: 'center' },
    totalLabel: { fontSize: 12, color: '#64748B' },
    totalPrice: { fontSize: 20, fontWeight: 'bold', color: '#2563EB' },
    checkoutBtn: { backgroundColor: '#EF4444', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 34 },
    checkoutBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
    emptyIconBg: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    emptyText: { fontSize: 18, fontWeight: 'bold', color: '#334155', marginBottom: 8 },
    emptySubText: { fontSize: 14, color: '#64748B', textAlign: 'center', paddingHorizontal: 40, marginBottom: 20 },
    shopNowBtn: { backgroundColor: '#2563EB', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
    shopNowText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});

export default CartScreen;