import React, { useState, useRef } from 'react';
import {
    View, Text, StyleSheet, Image, TouchableOpacity, ScrollView,
    StatusBar, Modal, TouchableWithoutFeedback, Platform, Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCartStore } from '../../store/useCartStore';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useCartAnimation } from '../../store/CartAnimationContext';
import { ROUTES } from '../../constants/routes';

const ProductDetailScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { product } = route.params;

    const addToCart = useCartStore((state) => state.addToCart);
    const totalItems = useCartStore((state) => state.getTotalItems());

    // --- Favorites Store ---
    const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
    const isFavorite = useFavoritesStore((state) => state.isFavorite(product.id));

    // --- Animation Store ---
    const { triggerAnimation } = useCartAnimation();
    const imageRef = useRef<any>(null);

    const [isSheetVisible, setSheetVisible] = useState(false);
    const [actionType, setActionType] = useState<'cart' | 'buy'>('cart');
    const [quantity, setQuantity] = useState(1);

    const handleOpenSheet = (type: 'cart' | 'buy') => {
        setActionType(type);
        setSheetVisible(true);
    };

    const handleQuantity = (type: 'inc' | 'dec') => {
        if (type === 'dec' && quantity > 1) setQuantity(quantity - 1);
        if (type === 'inc') setQuantity(quantity + 1);
    };

    // --- ĐÃ SỬA LỖI LOGIC TẠI ĐÂY ---
    const handleConfirm = () => {
        setSheetVisible(false);

        if (actionType === 'cart') {
            // NẾU LÀ THÊM VÀO GIỎ: Lưu vào Zustand Store
            addToCart(product, quantity);

            // --- Hiệu ứng bay vào giỏ ---
            setTimeout(() => { // Đợi modal đóng xong màn hình hết mờ
                if (imageRef.current) {
                    imageRef.current.measureInWindow((x: number, y: number, width: number, height: number) => {
                        triggerAnimation({
                            startPos: { x, y, width, height },
                            imageUrl: product.image,
                        });
                    });
                }
            }, 300);

        } else {
            // Mua ngay
            const rawPrice = typeof product.price === 'number'
                ? product.price
                : parseInt(product.price.toString().replace(/[^0-9]/g, ''), 10);

            navigation.navigate(ROUTES.CHECKOUT, {
                buyNowItem: {
                    ...product,
                    quantity: quantity,
                    rawPrice: rawPrice,
                }
            });
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate('MainTabs', { screen: ROUTES.CART_TAB })}
                    style={styles.cartHeaderBtn}
                >
                    <Ionicons name="cart-outline" size={24} color="#333" />
                    {totalItems > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{totalItems}</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.titleRow}>
                    <Text style={styles.name}>{product.name}</Text>
                    <TouchableOpacity
                        onPress={() => {
                            // Chuẩn bị rawPrice trước khi toggle
                            const rawPrice = typeof product.price === 'number'
                                ? product.price
                                : parseInt(product.price.toString().replace(/[^0-9]/g, ''), 10);
                            toggleFavorite({ ...product, rawPrice });
                        }}
                        style={styles.favoriteBtn}
                    >
                        <Ionicons
                            name={isFavorite ? 'heart' : 'heart-outline'}
                            size={26}
                            color="#EF4444"
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={16} color="#F59E0B" />
                    <Text style={styles.rating}>{product.rating} (120 đánh giá)</Text>
                    <Text style={styles.sold}>• Đã bán {product.sold}</Text>
                </View>

                <Text style={styles.price}>{product.price.toLocaleString('vi-VN')}đ</Text>

                <View style={styles.descSection}>
                    <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
                    <Text style={styles.description}>
                        Sản phẩm chính hãng chất lượng cao, phù hợp cho các dự án IoT, Smart Home và học tập.
                        {"\n"}- Điện áp hoạt động ổn định
                        {"\n"}- Độ bền cao, dễ dàng lắp đặt
                        {"\n"}- Bảo hành 1 đổi 1 trong 30 ngày
                    </Text>
                </View>
            </ScrollView>

            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.cartBtn} onPress={() => handleOpenSheet('cart')}>
                    <Ionicons name="cart-outline" size={22} color="#2563EB" />
                    <Text style={styles.cartBtnText}>Thêm vào giỏ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buyBtn} onPress={() => handleOpenSheet('buy')}>
                    <Text style={styles.buyText}>Mua ngay</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={isSheetVisible} transparent={true} animationType="slide" onRequestClose={() => setSheetVisible(false)}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback onPress={() => setSheetVisible(false)}><View style={styles.modalBackdrop} /></TouchableWithoutFeedback>
                    <View style={styles.bottomSheet}>
                        <View style={styles.sheetHeader}>
                            <Image
                                ref={imageRef}
                                source={{ uri: product.image }}
                                style={styles.sheetImage}
                                resizeMode="contain"
                            />
                            <View style={styles.sheetHeaderInfo}>
                                <Text style={styles.sheetPrice}>{product.price.toLocaleString('vi-VN')}đ</Text>
                                <Text style={styles.sheetStock}>Kho: 124</Text>
                            </View>
                            <TouchableOpacity onPress={() => setSheetVisible(false)} style={styles.closeBtn}><Ionicons name="close" size={24} color="#64748B" /></TouchableOpacity>
                        </View>
                        <View style={styles.sheetBody}>
                            <Text style={styles.sheetSectionTitle}>Số lượng</Text>
                            <View style={styles.qtyBox}>
                                <TouchableOpacity onPress={() => handleQuantity('dec')} style={styles.qtyActionBtn}><Ionicons name="remove" size={20} color="#333" /></TouchableOpacity>
                                <Text style={styles.qtyValue}>{quantity}</Text>
                                <TouchableOpacity onPress={() => handleQuantity('inc')} style={styles.qtyActionBtn}><Ionicons name="add" size={20} color="#333" /></TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.sheetFooter}>
                            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
                                <Text style={styles.confirmBtnText}>{actionType === 'cart' ? 'Thêm vào giỏ hàng' : 'Xác nhận mua'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { height: 320, backgroundColor: '#F8F9FA', justifyContent: 'center', alignItems: 'center' },
    backBtn: { position: 'absolute', top: Platform.OS === 'ios' ? 50 : 20, left: 20, zIndex: 10, backgroundColor: '#fff', padding: 8, borderRadius: 20, elevation: 3 },
    cartHeaderBtn: { position: 'absolute', top: Platform.OS === 'ios' ? 50 : 20, right: 20, zIndex: 10, backgroundColor: '#fff', padding: 8, borderRadius: 20, elevation: 3 },
    badge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#EF4444', minWidth: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#fff' },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    image: { width: '80%', height: '80%' },
    content: { flex: 1, padding: 20, borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: '#fff', marginTop: -25 },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    name: { fontSize: 20, fontWeight: 'bold', color: '#1E293B', flex: 1, marginRight: 10, lineHeight: 28 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
    rating: { marginLeft: 5, color: '#64748B', fontSize: 13 },
    sold: { marginLeft: 10, color: '#94A3B8', fontSize: 13 },
    price: { fontSize: 26, fontWeight: 'bold', color: '#2563EB', marginTop: 15 },
    descSection: { marginTop: 25, marginBottom: 50 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 10 },
    description: { fontSize: 14, color: '#64748B', lineHeight: 24 },
    bottomBar: { flexDirection: 'row', padding: 15, paddingBottom: Platform.OS === 'ios' ? 30 : 15, borderTopWidth: 1, borderTopColor: '#F1F5F9', backgroundColor: '#fff' },
    cartBtn: { flex: 1, flexDirection: 'row', backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', borderRadius: 12, marginRight: 10, height: 50, borderWidth: 1, borderColor: '#BFDBFE' },
    cartBtnText: { color: '#2563EB', fontWeight: '600', fontSize: 15, marginLeft: 8 },
    buyBtn: { flex: 1, backgroundColor: '#2563EB', justifyContent: 'center', alignItems: 'center', borderRadius: 12, height: 50 },
    buyText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    modalOverlay: { flex: 1, justifyContent: 'flex-end' },
    modalBackdrop: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)' },
    bottomSheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
    sheetHeader: { flexDirection: 'row', alignItems: 'flex-start', borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 20 },
    sheetImage: { width: 90, height: 90, borderRadius: 12, backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#E2E8F0' },
    sheetHeaderInfo: { flex: 1, marginLeft: 15, justifyContent: 'flex-end', paddingBottom: 5 },
    sheetPrice: { fontSize: 20, fontWeight: 'bold', color: '#2563EB', marginBottom: 4 },
    sheetStock: { fontSize: 13, color: '#64748B' },
    closeBtn: { padding: 4 },
    sheetBody: { paddingVertical: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    sheetSectionTitle: { fontSize: 16, fontWeight: '600', color: '#1E293B' },
    qtyBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, backgroundColor: '#F8FAFC' },
    qtyActionBtn: { paddingHorizontal: 12, paddingVertical: 8 },
    qtyValue: { fontSize: 16, fontWeight: 'bold', color: '#333', width: 30, textAlign: 'center' },
    sheetFooter: { paddingTop: 10 },
    confirmBtn: { backgroundColor: '#EF4444', height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    confirmBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    favoriteBtn: { padding: 4 },
});

export default ProductDetailScreen;