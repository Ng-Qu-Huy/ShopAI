import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

const OrderDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const { orderId } = route.params || { orderId: 'DH10239' };

    // Giả lập dữ liệu chi tiết của 1 đơn hàng
    const orderDetail = {
        id: orderId,
        date: '2025-10-20 14:30',
        status: 'shipping',
        paymentMethod: 'Thanh toán khi nhận hàng (COD)',
        address: {
            name: 'Nguyễn Văn Dev',
            phone: '0901234567',
            full: '123 Đường Lập Trình, Phường Công Nghệ, TP. HCM'
        },
        items: [
            { id: 1, name: 'Arduino Uno R3 DIP', quantity: 2, price: 150000, image: 'https://m.media-amazon.com/images/I/71J15x0e36L.jpg' },
            { id: 2, name: 'Cảm biến DHT11', quantity: 1, price: 25000, image: 'https://m.media-amazon.com/images/I/51+6k8v+S+L._AC_SX679_.jpg' }
        ],
        subtotal: 325000,
        shippingFee: 30000,
        discount: 0,
        total: 355000
    };

    const formatCurrency = (amount: number) => amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Status Banner */}
                <View style={styles.statusBanner}>
                    <Ionicons name="bicycle" size={32} color="#fff" />
                    <View style={{ marginLeft: 15 }}>
                        <Text style={styles.statusTitle}>Đơn hàng đang giao đến bạn</Text>
                        <Text style={styles.statusDesc}>Dự kiến giao vào ngày mai</Text>
                    </View>
                </View>

                {/* Timeline Giao hàng (Mô phỏng) */}
                <View style={styles.section}>
                    <View style={styles.timelineRow}>
                        <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                        <View style={styles.timelineContent}>
                            <Text style={styles.timelineTextActive}>Đơn hàng đã xuất kho</Text>
                            <Text style={styles.timelineTime}>20-10-2025 16:45</Text>
                        </View>
                    </View>
                    <View style={styles.timelineLine} />
                    <View style={styles.timelineRow}>
                        <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                        <View style={styles.timelineContent}>
                            <Text style={styles.timelineTextActive}>Đã xác nhận đơn hàng</Text>
                            <Text style={styles.timelineTime}>20-10-2025 14:35</Text>
                        </View>
                    </View>
                </View>

                {/* Địa chỉ nhận hàng */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Địa chỉ nhận hàng</Text>
                    <View style={styles.addressBox}>
                        <Ionicons name="location" size={20} color="#64748B" style={{ marginTop: 2 }} />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.addressName}>{orderDetail.address.name} - {orderDetail.address.phone}</Text>
                            <Text style={styles.addressText}>{orderDetail.address.full}</Text>
                        </View>
                    </View>
                </View>

                {/* Danh sách sản phẩm */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sản phẩm ({orderDetail.items.length})</Text>
                    {orderDetail.items.map(item => (
                        <View key={item.id} style={styles.itemRow}>
                            <Image source={{ uri: item.image }} style={styles.itemImage} />
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                                <View style={styles.itemMeta}>
                                    <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
                                    <Text style={styles.itemQty}>x{item.quantity}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Tổng kết thanh toán */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thông tin thanh toán</Text>
                    <View style={styles.summaryRow}><Text style={styles.lbl}>Mã đơn hàng</Text><Text style={styles.val}>{orderDetail.id}</Text></View>
                    <View style={styles.summaryRow}><Text style={styles.lbl}>Phương thức</Text><Text style={styles.val}>{orderDetail.paymentMethod}</Text></View>
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}><Text style={styles.lbl}>Tổng tiền hàng</Text><Text style={styles.val}>{formatCurrency(orderDetail.subtotal)}</Text></View>
                    <View style={styles.summaryRow}><Text style={styles.lbl}>Phí vận chuyển</Text><Text style={styles.val}>{formatCurrency(orderDetail.shippingFee)}</Text></View>
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}><Text style={{ fontWeight: 'bold', fontSize: 16 }}>Tổng thanh toán</Text><Text style={styles.totalPrice}>{formatCurrency(orderDetail.total)}</Text></View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F1F5F9' },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
    backBtn: { padding: 5 },
    statusBanner: { backgroundColor: '#2563EB', padding: 20, flexDirection: 'row', alignItems: 'center' },
    statusTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    statusDesc: { color: '#DBEAFE', fontSize: 13, marginTop: 4 },
    section: { backgroundColor: '#fff', padding: 15, marginBottom: 10 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 15 },

    timelineRow: { flexDirection: 'row', alignItems: 'flex-start' },
    timelineContent: { marginLeft: 10, paddingBottom: 15 },
    timelineLine: { width: 1, height: 30, backgroundColor: '#10B981', marginLeft: 9, marginTop: -15, marginBottom: 5 },
    timelineTextActive: { color: '#10B981', fontWeight: '600', fontSize: 14 },
    timelineTime: { color: '#94A3B8', fontSize: 12, marginTop: 2 },

    addressBox: { flexDirection: 'row' },
    addressName: { fontWeight: 'bold', color: '#333', marginBottom: 4 },
    addressText: { color: '#64748B', lineHeight: 20 },

    itemRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 15, marginBottom: 15 },
    itemImage: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#F8F9FA' },
    itemInfo: { flex: 1, marginLeft: 12 },
    itemName: { color: '#334155', fontWeight: '500', marginBottom: 5 },
    itemMeta: { flexDirection: 'row', justifyContent: 'space-between' },
    itemPrice: { fontWeight: 'bold', color: '#2563EB' },
    itemQty: { color: '#64748B' },

    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    lbl: { color: '#64748B', fontSize: 14 },
    val: { color: '#1E293B', fontSize: 14, fontWeight: '500' },
    divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 10 },
    totalPrice: { fontSize: 18, fontWeight: 'bold', color: '#EF4444' }
});

export default OrderDetailScreen;