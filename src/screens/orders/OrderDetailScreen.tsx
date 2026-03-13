import React from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, Image, SafeAreaView, StatusBar
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useOrder, Order } from '../../store/OrderContext';

// --- Cấu hình trạng thái đơn hàng ---
const STATUS_CONFIG: Record<string, { label: string; icon: string; color: string; bannerText: string; bannerDesc: string }> = {
    waiting: {
        label: 'Chờ xác nhận',
        icon: 'hourglass-outline',
        color: '#F59E0B',
        bannerText: 'Đơn hàng đang chờ xác nhận',
        bannerDesc: 'Shop sẽ xác nhận đơn trong thời gian sớm nhất.',
    },
    shipping: {
        label: 'Đang giao hàng',
        icon: 'bicycle',
        color: '#2563EB',
        bannerText: 'Đơn hàng đang giao đến bạn',
        bannerDesc: 'Dự kiến giao trong 1 - 2 ngày làm việc.',
    },
    delivered: {
        label: 'Đã giao hàng',
        icon: 'checkmark-circle',
        color: '#10B981',
        bannerText: 'Đơn hàng đã giao thành công!',
        bannerDesc: 'Cảm ơn bạn đã mua sắm tại ElectroShop.',
    },
    cancelled: {
        label: 'Đã hủy',
        icon: 'close-circle',
        color: '#EF4444',
        bannerText: 'Đơn hàng đã bị hủy',
        bannerDesc: 'Đơn hàng này đã được hủy thành công.',
    },
};

// Hằng số phí vận chuyển (đồng bộ với CheckoutScreen)
const SHIPPING_FEE = 30000;

const OrderDetailScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { orderId } = route.params || {};

    // --- Lấy đơn hàng thật từ OrderContext ---
    const { orders } = useOrder();
    const order: Order | undefined = orders.find(o => o.id === orderId);

    const formatCurrency = (amount: number) =>
        amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    // --- Trường hợp không tìm thấy đơn hàng ---
    if (!order) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color="#1E293B" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
                    <View style={{ width: 34 }} />
                </View>
                <View style={styles.notFoundContainer}>
                    <Ionicons name="receipt-outline" size={72} color="#CBD5E1" />
                    <Text style={styles.notFoundTitle}>Không tìm thấy đơn hàng</Text>
                    <Text style={styles.notFoundSub}>Mã đơn hàng #{orderId} không tồn tại.</Text>
                    <TouchableOpacity style={styles.goBackBtn} onPress={() => navigation.goBack()}>
                        <Text style={styles.goBackBtnText}>Quay lại</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const statusConf = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.waiting;

    // Tính subtotal từ danh sách sản phẩm
    const subtotal = order.items.reduce((sum, item) => {
        const price = typeof item.price === 'number'
            ? item.price
            : parseInt(item.price.toString().replace(/[^0-9]/g, ''), 10);
        return sum + price * item.quantity;
    }, 0);

    // Phí ship cố định, discount = totalPrice - subtotal - shippingFee (có thể âm nếu có voucher)
    const discount = subtotal + SHIPPING_FEE - order.totalPrice;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
                <View style={{ width: 34 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                {/* Status Banner — Động theo trạng thái thực */}
                <View style={[styles.statusBanner, { backgroundColor: statusConf.color }]}>
                    <Ionicons name={statusConf.icon as any} size={32} color="#fff" />
                    <View style={{ marginLeft: 15, flex: 1 }}>
                        <Text style={styles.statusTitle} numberOfLines={1}>{statusConf.bannerText}</Text>
                        <Text style={styles.statusDesc}>{statusConf.bannerDesc}</Text>
                    </View>
                </View>

                {/* Thông tin đơn hàng */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thông tin đơn hàng</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Mã đơn hàng</Text>
                        <Text style={styles.infoValueBold}>{order.id}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Ngày đặt</Text>
                        <Text style={styles.infoValue}>{order.date}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Trạng thái</Text>
                        <View style={[styles.statusPill, { backgroundColor: `${statusConf.color}20` }]}>
                            <Text style={[styles.statusPillText, { color: statusConf.color }]}>
                                {statusConf.label}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Danh sách sản phẩm — Dữ liệu thực */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sản phẩm ({order.items.length})</Text>
                    {order.items.map((item, index) => {
                        const itemPrice = typeof item.price === 'number'
                            ? item.price
                            : parseInt(item.price.toString().replace(/[^0-9]/g, ''), 10);
                        return (
                            <View
                                key={`${item.id}-${index}`}
                                style={[styles.itemRow, index === order.items.length - 1 && { borderBottomWidth: 0 }]}
                            >
                                <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="contain" />
                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                                    <View style={styles.itemMeta}>
                                        <Text style={styles.itemPrice}>{formatCurrency(itemPrice)}</Text>
                                        <Text style={styles.itemQty}>x{item.quantity}</Text>
                                    </View>
                                    <Text style={styles.itemSubtotal}>
                                        Thành tiền: {formatCurrency(itemPrice * item.quantity)}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* Tổng kết thanh toán — Tính từ dữ liệu thực */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Chi tiết thanh toán</Text>

                    <View style={styles.summaryRow}>
                        <Text style={styles.lbl}>Tổng tiền hàng</Text>
                        <Text style={styles.val}>{formatCurrency(subtotal)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.lbl}>Phí vận chuyển</Text>
                        <Text style={styles.val}>{formatCurrency(SHIPPING_FEE)}</Text>
                    </View>
                    {discount > 0 && (
                        <View style={styles.summaryRow}>
                            <Text style={styles.lbl}>Giảm giá / Voucher</Text>
                            <Text style={[styles.val, { color: '#2563EB' }]}>- {formatCurrency(discount)}</Text>
                        </View>
                    )}

                    <View style={styles.divider} />

                    <View style={styles.summaryRow}>
                        <Text style={styles.totalLabel}>Tổng thanh toán</Text>
                        <Text style={styles.totalPrice}>{formatCurrency(order.totalPrice)}</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F1F5F9' },

    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#fff',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
    backBtn: { padding: 5 },

    // Status Banner
    statusBanner: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    statusDesc: { color: 'rgba(255,255,255,0.85)', fontSize: 13, lineHeight: 18 },

    // Section
    section: { backgroundColor: '#fff', padding: 15, marginTop: 10 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 15 },

    // Info rows
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    infoLabel: { fontSize: 14, color: '#64748B' },
    infoValue: { fontSize: 14, color: '#1E293B', fontWeight: '500', flexShrink: 1, textAlign: 'right', marginLeft: 10 },
    infoValueBold: { fontSize: 14, color: '#1E293B', fontWeight: '700', flex: 1, textAlign: 'right' },

    // Status pill
    statusPill: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    statusPillText: { fontSize: 12, fontWeight: '700' },

    // Items
    itemRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        paddingBottom: 14,
        marginBottom: 14,
    },
    itemImage: { width: 65, height: 65, borderRadius: 8, backgroundColor: '#F8F9FA' },
    itemInfo: { flex: 1, marginLeft: 12 },
    itemName: { color: '#334155', fontWeight: '500', marginBottom: 6, lineHeight: 20, fontSize: 14 },
    itemMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    itemPrice: { fontWeight: 'bold', color: '#2563EB', fontSize: 14 },
    itemQty: { color: '#64748B', fontSize: 13 },
    itemSubtotal: { fontSize: 12, color: '#94A3B8', marginTop: 4 },

    // Summary
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    lbl: { color: '#64748B', fontSize: 14 },
    val: { color: '#1E293B', fontSize: 14, fontWeight: '500' },
    divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 10 },
    totalLabel: { fontWeight: 'bold', fontSize: 15, color: '#1E293B' },
    totalPrice: { fontSize: 18, fontWeight: 'bold', color: '#EF4444' },

    // Not Found State
    notFoundContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    notFoundTitle: { fontSize: 18, fontWeight: 'bold', color: '#334155', marginTop: 16, marginBottom: 8 },
    notFoundSub: { fontSize: 14, color: '#94A3B8', textAlign: 'center', marginBottom: 24 },
    goBackBtn: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 28,
        paddingVertical: 12,
        borderRadius: 25,
    },
    goBackBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});

export default OrderDetailScreen;