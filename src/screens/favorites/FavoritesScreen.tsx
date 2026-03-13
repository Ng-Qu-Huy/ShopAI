import React from 'react';
import {
    View, Text, StyleSheet, FlatList, Image,
    TouchableOpacity, SafeAreaView, StatusBar, Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../constants/routes';
import { useFavoritesStore } from '../../store/useFavoritesStore';
import { useCartStore } from '../../store/useCartStore';

const FavoritesScreen = () => {
    const navigation = useNavigation<any>();

    // --- Lấy dữ liệu từ Zustand Stores ---
    const favorites = useFavoritesStore((state) => state.favorites);
    const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
    const addToCart = useCartStore((state) => state.addToCart);

    const formatCurrency = (amount: number) =>
        amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    // --- Xử lý xóa yêu thích có xác nhận ---
    const handleRemoveFavorite = (id: number, name: string) => {
        Alert.alert(
            'Bỏ yêu thích',
            `Xóa "${name}" khỏi danh sách yêu thích?`,
            [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Xóa', style: 'destructive', onPress: () => removeFavorite(id) },
            ]
        );
    };

    // --- Xử lý thêm vào giỏ từ màn Yêu thích ---
    const handleAddToCart = (item: any) => {
        addToCart(item, 1);
        Alert.alert(
            'Thành công',
            `Đã thêm "${item.name}" vào giỏ hàng!`,
            [
                { text: 'Tiếp tục', style: 'cancel' },
                { text: 'Đến giỏ hàng', onPress: () => navigation.navigate('MainTabs', { screen: ROUTES.CART_TAB }) },
            ]
        );
    };

    // --- Render từng sản phẩm yêu thích ---
    const renderItem = ({ item }: any) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => navigation.navigate(ROUTES.PRODUCT_DETAIL, { product: item })}
        >
            <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />

            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
                {item.rating && (
                    <View style={styles.ratingRow}>
                        <Ionicons name="star" size={12} color="#F59E0B" />
                        <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                )}
                <Text style={styles.price}>{formatCurrency(item.rawPrice)}</Text>
            </View>

            <View style={styles.actions}>
                {/* Nút xóa khỏi yêu thích */}
                <TouchableOpacity
                    style={styles.heartBtn}
                    onPress={() => handleRemoveFavorite(item.id, item.name)}
                >
                    <Ionicons name="heart" size={22} color="#EF4444" />
                </TouchableOpacity>

                {/* Nút thêm vào giỏ */}
                <TouchableOpacity
                    style={styles.cartBtn}
                    onPress={() => handleAddToCart(item)}
                >
                    <Ionicons name="cart" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    // --- Empty State Component ---
    const EmptyState = () => (
        <View style={styles.emptyContainer}>
            {/* Icon trái tim vỡ */}
            <View style={styles.emptyIconWrapper}>
                <View style={styles.emptyIconBg}>
                    <Ionicons name="heart-dislike-outline" size={64} color="#FDA4AF" />
                </View>
                {/* Dấu chấm trang trí */}
                <View style={[styles.dot, { top: 10, right: 10, backgroundColor: '#FCA5A5' }]} />
                <View style={[styles.dot, { bottom: 5, left: 15, backgroundColor: '#FBCFE8', width: 10, height: 10 }]} />
            </View>

            <Text style={styles.emptyTitle}>Chưa có sản phẩm yêu thích</Text>
            <Text style={styles.emptySubtitle}>
                Nhấn vào icon ❤️ trên sản phẩm bất kỳ{'\n'}để lưu vào danh sách yêu thích của bạn.
            </Text>

            <TouchableOpacity
                style={styles.shopNowBtn}
                onPress={() => navigation.navigate('MainTabs', { screen: ROUTES.HOME_TAB })}
                activeOpacity={0.85}
            >
                <Ionicons name="storefront-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.shopNowText}>Khám phá ngay</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Sản phẩm yêu thích</Text>
                {/* Badge số lượng */}
                <View style={styles.countBadge}>
                    <Text style={styles.countText}>{favorites.length}</Text>
                </View>
            </View>

            <FlatList
                data={favorites}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={[
                    styles.listContent,
                    favorites.length === 0 && styles.emptyList,
                ]}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<EmptyState />}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', flex: 1, textAlign: 'center' },
    backBtn: { padding: 5 },
    countBadge: {
        backgroundColor: '#EFF6FF',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    countText: { color: '#2563EB', fontWeight: 'bold', fontSize: 13 },

    // List
    listContent: { padding: 15, paddingBottom: 30 },
    emptyList: { flex: 1 },

    // Card sản phẩm
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 14,
        marginBottom: 14,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
    },
    image: {
        width: 82,
        height: 82,
        borderRadius: 10,
        backgroundColor: '#F1F5F9',
    },
    info: { flex: 1, marginLeft: 12 },
    name: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 5, lineHeight: 20 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
    ratingText: { fontSize: 11, color: '#94A3B8', marginLeft: 3 },
    price: { fontSize: 16, fontWeight: 'bold', color: '#2563EB' },

    // Action buttons
    actions: { justifyContent: 'center', alignItems: 'center', gap: 10, marginLeft: 8 },
    heartBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FEF2F2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // ===== EMPTY STATE =====
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingBottom: 60,
    },
    emptyIconWrapper: {
        position: 'relative',
        marginBottom: 30,
    },
    emptyIconBg: {
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: '#FFF1F2',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FECDD3',
        elevation: 4,
        shadowColor: '#EF4444',
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },
    dot: {
        position: 'absolute',
        width: 14,
        height: 14,
        borderRadius: 7,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 12,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    shopNowBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2563EB',
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 30,
        elevation: 4,
        shadowColor: '#2563EB',
        shadowOpacity: 0.35,
        shadowRadius: 10,
    },
    shopNowText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
    },
});

export default FavoritesScreen;