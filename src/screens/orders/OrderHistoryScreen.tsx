import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView, StatusBar, ScrollView, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../constants/routes';
import { useOrder } from '../../store/OrderContext'; // <--- 1. IMPORT STORE

const OrderHistoryScreen = () => {
    const navigation = useNavigation<any>();
    const [activeTab, setActiveTab] = useState('all');

    // 2. LẤY DỮ LIỆU ĐƠN HÀNG THẬT TỪ CONTEXT
    const { orders } = useOrder();

    const tabs = [
        { key: 'all', label: 'Tất cả' },
        { key: 'waiting', label: 'Chờ xác nhận' },
        { key: 'shipping', label: 'Đang giao' },
        { key: 'delivered', label: 'Đã giao' },
        { key: 'cancelled', label: 'Đã hủy' },
    ];

    // 3. LỌC DỮ LIỆU TỪ "orders" THAY VÌ "MOCK_ORDERS"
    const filteredOrders = activeTab === 'all'
        ? orders
        : orders.filter(order => order.status === activeTab);

    const formatCurrency = (amount: number) => {
        return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    const renderOrder = ({ item }: any) => (
        <View style={styles.orderCard}>
            <View style={styles.cardHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.shopName}>ElectroShop</Text>
                    <Text style={styles.orderId}> | {item.id}</Text>
                </View>
                <Text style={[
                    styles.statusText,
                    item.status === 'delivered' && { color: '#10B981' },
                    item.status === 'cancelled' && { color: '#EF4444' },
                    item.status === 'shipping' && { color: '#2563EB' },
                ]}>
                    {item.statusText}
                </Text>
            </View>

            {/* Bấm vào để xem chi tiết */}
            <TouchableOpacity style={styles.productRow} activeOpacity={0.8} onPress={() => navigation.navigate(ROUTES.ORDER_DETAIL, { orderId: item.id })}>
                <Image source={{ uri: item.items[0].image }} style={styles.productImage} />
                <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={1}>{item.items[0].name}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                        <Text style={styles.productQty}>x{item.items[0].quantity}</Text>
                        <Text style={styles.productPrice}>{formatCurrency(item.items[0].price)}</Text>
                    </View>
                </View>
            </TouchableOpacity>

            {item.items.length > 1 && (
                <TouchableOpacity style={styles.moreItems} onPress={() => navigation.navigate(ROUTES.ORDER_DETAIL, { orderId: item.id })}>
                    <Text style={styles.moreText}>Xem thêm {item.items.length - 1} sản phẩm khác...</Text>
                </TouchableOpacity>
            )}

            <View style={styles.cardFooter}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>{item.items.length} sản phẩm</Text>
                    <Text style={styles.totalLabel}>Thành tiền: <Text style={styles.totalPrice}>{formatCurrency(item.totalPrice)}</Text></Text>
                </View>
                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={styles.outlineBtn}
                        onPress={() => Alert.alert('Liên hệ Shop', 'Hotline: 1800-ELECTRO\nEmail: support@electroshop.vn', [{ text: 'Đóng' }])}
                    >
                        <Text style={styles.outlineBtnText}>Liên hệ Shop</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.primaryBtn}
                        onPress={() => navigation.navigate(ROUTES.ORDER_DETAIL, { orderId: item.id })}
                    >
                        <Text style={styles.primaryBtnText}>Xem chi tiết</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}><Ionicons name="arrow-back" size={24} color="#333" /></TouchableOpacity>
                <Text style={styles.headerTitle}>Lịch sử đơn hàng</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.tabsContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {tabs.map((tab) => (
                        <TouchableOpacity key={tab.key} style={[styles.tabItem, activeTab === tab.key && styles.tabItemActive]} onPress={() => setActiveTab(tab.key)}>
                            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>{tab.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={filteredOrders}
                renderItem={renderOrder}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 15, paddingBottom: 50 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="receipt-outline" size={60} color="#CBD5E1" />
                        <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào</Text>
                        <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 5 }}>Hãy mua sắm để đơn hàng xuất hiện ở đây nhé!</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F1F5F9' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
    backBtn: { padding: 5 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
    tabsContainer: { backgroundColor: '#fff', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
    tabItem: { paddingHorizontal: 16, paddingVertical: 8, marginHorizontal: 5, borderRadius: 20, backgroundColor: '#F1F5F9' },
    tabItemActive: { backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#2563EB' },
    tabText: { color: '#64748B', fontSize: 13 },
    tabTextActive: { color: '#2563EB', fontWeight: 'bold' },
    orderCard: { backgroundColor: '#fff', marginBottom: 15, borderRadius: 12, padding: 12, elevation: 2 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
    shopName: { fontWeight: 'bold', fontSize: 14, color: '#1E293B' },
    orderId: { fontSize: 12, color: '#64748B' },
    statusText: { fontSize: 12, color: '#F59E0B', fontWeight: '500' },
    productRow: { flexDirection: 'row', alignItems: 'center' },
    productImage: { width: 70, height: 70, borderRadius: 8, backgroundColor: '#F1F5F9' },
    productInfo: { flex: 1, marginLeft: 12, height: 70, justifyContent: 'center' },
    productName: { fontSize: 14, color: '#334155', fontWeight: '500', marginBottom: 4 },
    productQty: { fontSize: 12, color: '#64748B' },
    productPrice: { fontSize: 14, color: '#1E293B', fontWeight: '500' },
    moreItems: { marginTop: 8, paddingLeft: 82, paddingVertical: 4 },
    moreText: { fontSize: 11, color: '#94A3B8', fontStyle: 'italic' },
    cardFooter: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F8FAFC' },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    totalLabel: { fontSize: 12, color: '#64748B' },
    totalPrice: { fontSize: 16, fontWeight: 'bold', color: '#2563EB' },
    actionRow: { flexDirection: 'row', justifyContent: 'flex-end' },
    outlineBtn: { paddingVertical: 8, paddingHorizontal: 16, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 6, marginRight: 10 },
    outlineBtnText: { color: '#475569', fontSize: 13 },
    primaryBtn: { paddingVertical: 8, paddingHorizontal: 20, backgroundColor: '#2563EB', borderRadius: 6 },
    primaryBtnText: { color: '#fff', fontSize: 13, fontWeight: '500' },
    emptyContainer: { alignItems: 'center', marginTop: 100 },
    emptyText: { marginTop: 10, color: '#1E293B', fontWeight: 'bold', fontSize: 16 },
});

export default OrderHistoryScreen;