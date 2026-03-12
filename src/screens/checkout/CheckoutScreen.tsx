import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
    SafeAreaView, StatusBar, Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ROUTES } from '../../constants/routes';
import { useCartStore } from '../../store/useCartStore';
import { useOrder } from '../../store/OrderContext';

const CheckoutScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>(); // <-- THÊM DÒNG NÀY ĐỂ NHẬN DATA

    const { cartItems, removeFromCart } = useCartStore();
    const { addOrder } = useOrder();

    // Kiểm tra xem có phải là đang "Mua ngay" không
    const { isBuyNow, buyNowItem } = route.params || {};

    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [address, setAddress] = useState({
        name: 'Nguyễn Văn Dev',
        phone: '(+84) 901 234 567',
        fullAddress: '123 Đường Lập Trình, Phường Công Nghệ, TP. HCM',
        hasAddress: true
    });
    const [voucher, setVoucher] = useState<{ code: string, discount: number } | null>(null);

    // --- ĐÃ SỬA LỖI LOGIC TẠI ĐÂY ---
    // Nếu Mua ngay -> Chỉ lấy món được truyền sang. 
    // Nếu từ Giỏ hàng -> Lấy danh sách đang được tick.
    const checkoutItems = isBuyNow && buyNowItem
        ? [buyNowItem]
        : cartItems.filter(item => item.checked);

    const merchandiseSubtotal = checkoutItems.reduce((sum, item) => sum + (item.rawPrice * item.quantity), 0);
    const shippingFee = 30000;
    const discountAmount = voucher ? voucher.discount : 0;
    const finalTotal = Math.max(0, merchandiseSubtotal + shippingFee - discountAmount);

    const formatCurrency = (amount: number) => amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    const handleChangeAddress = () => {
        Alert.alert('Địa chỉ', 'Cập nhật địa chỉ mới:', [
            { text: 'Hủy', style: 'cancel' },
            { text: 'Sử dụng địa chỉ hiện tại', onPress: () => { } },
            { text: 'Nhập mới (Giả lập)', onPress: () => setAddress({ ...address, fullAddress: '456 Đường AI, Q.1, TP.HCM' }) }
        ]);
    };

    const handleSelectVoucher = () => {
        Alert.alert('Mã giảm giá', 'Chọn mã ưu đãi:', [
            { text: 'Hủy', style: 'cancel' },
            { text: 'SALE50K (Giảm 50k)', onPress: () => setVoucher({ code: 'SALE50K', discount: 50000 }) },
            { text: 'Gỡ mã', style: 'destructive', onPress: () => setVoucher(null) }
        ]);
    };

    const handlePlaceOrder = () => {
        if (checkoutItems.length === 0) {
            Alert.alert('Lỗi', 'Giỏ hàng rỗng hoặc chưa chọn sản phẩm!');
            return;
        }

        Alert.alert(
            'Xác nhận đặt hàng',
            `Tổng: ${formatCurrency(finalTotal)}\nHình thức: ${paymentMethod === 'COD' ? 'Tiền mặt' : 'Chuyển khoản'}`,
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'ĐỒNG Ý',
                    onPress: () => {
                        const newOrder = {
                            id: 'DH' + Math.floor(10000 + Math.random() * 90000),
                            date: new Date().toLocaleString('vi-VN'),
                            status: 'waiting' as 'waiting',
                            statusText: 'Chờ xác nhận',
                            totalPrice: finalTotal,
                            items: checkoutItems.map(item => ({
                                id: item.id,
                                name: item.name,
                                price: item.rawPrice,
                                quantity: item.quantity,
                                image: item.image
                            }))
                        };

                        addOrder(newOrder);

                        // --- ĐÃ SỬA LỖI LOGIC TẠI ĐÂY ---
                        // CHỈ xóa khỏi giỏ hàng nếu bạn thanh toán qua đường Giỏ hàng. 
                        // Nếu "Mua ngay" thì giỏ hàng của bạn vẫn được giữ nguyên vẹn!
                        if (!isBuyNow) {
                            checkoutItems.forEach(item => removeFromCart(item.id));
                        }

                        Alert.alert('Thành công', 'Đơn hàng của bạn đã được ghi nhận!', [
                            { text: 'Xem đơn hàng', onPress: () => navigation.navigate(ROUTES.ORDER_HISTORY) }
                        ]);
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Thanh toán</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                {/* 1. Địa chỉ */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="location-outline" size={20} color="#2563EB" />
                        <Text style={styles.sectionTitle}>Địa chỉ nhận hàng</Text>
                    </View>
                    <TouchableOpacity style={styles.addressCard} onPress={handleChangeAddress}>
                        <View style={styles.addressRow}>
                            <Text style={styles.userName}>{address.name}</Text>
                            <Text style={styles.userPhone}>| {address.phone}</Text>
                        </View>
                        <Text style={styles.addressText}>{address.fullAddress}</Text>
                        <Text style={styles.changeText}>Nhấn để thay đổi</Text>
                    </TouchableOpacity>
                </View>

                {/* 2. Sản phẩm */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitleSimple}>Sản phẩm ({checkoutItems.length})</Text>
                    {checkoutItems.map((item) => (
                        <View key={item.id} style={styles.itemRow}>
                            <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} style={styles.itemImage} resizeMode="contain" />
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                                <View style={styles.itemMeta}>
                                    <Text style={styles.itemPrice}>{formatCurrency(item.rawPrice)}</Text>
                                    <Text style={styles.itemQty}>x{item.quantity}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* 3. Voucher */}
                <View style={styles.section}>
                    <TouchableOpacity style={styles.voucherRow} onPress={handleSelectVoucher}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="ticket-outline" size={22} color="#F59E0B" />
                            <Text style={styles.voucherTitle}>ElectroVoucher</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[styles.voucherValue, voucher && { color: '#EF4444' }]}>
                                {voucher ? `- ${formatCurrency(voucher.discount)}` : 'Chọn mã'}
                            </Text>
                            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* 4. Thanh toán */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitleSimple}>Phương thức thanh toán</Text>
                    {['COD', 'BANK'].map((method) => (
                        <TouchableOpacity
                            key={method}
                            style={[styles.paymentOption, paymentMethod === method && styles.paymentActive]}
                            onPress={() => setPaymentMethod(method)}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name={method === 'COD' ? "cash-outline" : "card-outline"} size={24} color={paymentMethod === method ? "#2563EB" : "#64748B"} />
                                <Text style={[styles.paymentText, paymentMethod === method && { color: '#2563EB', fontWeight: 'bold' }]}>
                                    {method === 'COD' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng'}
                                </Text>
                            </View>
                            {paymentMethod === method && <Ionicons name="checkmark-circle" size={20} color="#2563EB" />}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* 5. Tổng kết */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitleSimple}>Chi tiết thanh toán</Text>
                    <View style={styles.summaryRow}><Text style={styles.lbl}>Tổng tiền hàng</Text><Text style={styles.val}>{formatCurrency(merchandiseSubtotal)}</Text></View>
                    <View style={styles.summaryRow}><Text style={styles.lbl}>Phí vận chuyển</Text><Text style={styles.val}>{formatCurrency(shippingFee)}</Text></View>
                    {voucher && <View style={styles.summaryRow}><Text style={styles.lbl}>Giảm giá</Text><Text style={[styles.val, { color: '#2563EB' }]}>- {formatCurrency(voucher.discount)}</Text></View>}
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}><Text style={styles.totalLabel}>Tổng thanh toán</Text><Text style={styles.totalValue}>{formatCurrency(finalTotal)}</Text></View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.footerLabel}>Tổng cộng</Text>
                    <Text style={styles.footerTotal}>{formatCurrency(finalTotal)}</Text>
                </View>
                <TouchableOpacity style={styles.orderBtn} onPress={handlePlaceOrder}>
                    <Text style={styles.orderBtnText}>ĐẶT HÀNG</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
    backBtn: { padding: 5 },
    section: { backgroundColor: '#fff', marginTop: 10, padding: 15 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#2563EB', marginLeft: 8 },
    sectionTitleSimple: { fontSize: 15, fontWeight: '600', color: '#334155', marginBottom: 12 },
    addressCard: { marginLeft: 28 },
    addressRow: { flexDirection: 'row', alignItems: 'center' },
    userName: { fontWeight: 'bold', fontSize: 14, color: '#1E293B' },
    userPhone: { color: '#64748B', marginLeft: 5 },
    addressText: { color: '#475569', marginTop: 4 },
    changeText: { color: '#2563EB', fontSize: 12, marginTop: 6, fontWeight: '500' },
    itemRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'center' },
    itemImage: { width: 50, height: 50, borderRadius: 8, backgroundColor: '#F1F5F9' },
    itemInfo: { flex: 1, marginLeft: 10 },
    itemName: { fontSize: 14, color: '#333', marginBottom: 2 },
    itemMeta: { flexDirection: 'row', justifyContent: 'space-between' },
    itemPrice: { fontWeight: 'bold', fontSize: 14 },
    itemQty: { color: '#64748B' },
    voucherRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    voucherTitle: { marginLeft: 10, fontWeight: '500', color: '#333' },
    voucherValue: { marginRight: 8, color: '#64748B', fontSize: 13 },
    paymentOption: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 8 },
    paymentActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
    paymentText: { marginLeft: 10, color: '#475569' },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    lbl: { color: '#64748B', fontSize: 13 },
    val: { color: '#1E293B', fontSize: 13 },
    divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 8 },
    totalLabel: { fontWeight: 'bold', fontSize: 15 },
    totalValue: { fontWeight: 'bold', fontSize: 18, color: '#EF4444' },
    footer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#fff', flexDirection: 'row', padding: 15, elevation: 10, borderTopWidth: 1, borderTopColor: '#E2E8F0' },
    footerLabel: { fontSize: 12, color: '#64748B' },
    footerTotal: { fontSize: 18, fontWeight: 'bold', color: '#EF4444' },
    orderBtn: { backgroundColor: '#EF4444', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 8, justifyContent: 'center' },
    orderBtnText: { color: '#fff', fontWeight: 'bold' }
});

export default CheckoutScreen;