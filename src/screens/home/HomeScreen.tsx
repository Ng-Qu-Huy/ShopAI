import React, { useState, useRef } from 'react';
import {
    View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,
    FlatList, Dimensions, RefreshControl, StatusBar, Platform, Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../constants/routes';
import { useCartStore } from '../../store/useCartStore';
import { useCartAnimation } from '../../store/CartAnimationContext';

const { width } = Dimensions.get('window');

// --- DỮ LIỆU GIẢ LẬP (MOCK DATA) ---
const CATEGORIES = [
    { id: 1, name: 'Vi điều khiển', icon: 'hardware-chip', color: '#2563EB', bg: '#EFF6FF' },
    { id: 2, name: 'Cảm biến', icon: 'radio', color: '#10B981', bg: '#ECFDF5' },
    { id: 3, name: 'Module', icon: 'layers', color: '#F59E0B', bg: '#FFFBEB' },
    { id: 4, name: 'Công cụ', icon: 'construct', color: '#8B5CF6', bg: '#F5F3FF' },
    { id: 5, name: 'IoT', icon: 'cloud-upload', color: '#06B6D4', bg: '#ECFEFF' },
    { id: 6, name: 'Nguồn', icon: 'battery-charging', color: '#EF4444', bg: '#FEF2F2' },
    { id: 7, name: 'Màn hình', icon: 'tv', color: '#EC4899', bg: '#FDF2F8' },
    { id: 8, name: 'Khác', icon: 'grid', color: '#64748B', bg: '#F1F5F9' },
];

const BANNERS = [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
];

const PRODUCTS = [
    { id: 101, name: 'Arduino Uno R3 DIP (Kèm cáp)', price: '150.000₫', rawPrice: 150000, image: 'https://m.media-amazon.com/images/I/71J15x0e36L.jpg', rating: 4.8, sold: 120, discount: '-20%' },
    { id: 102, name: 'ESP32-WROOM-32E WiFi BLE', price: '115.000₫', rawPrice: 115000, image: 'https://m.media-amazon.com/images/I/61N+QjXm8-L._AC_SX679_.jpg', rating: 4.9, sold: 850, discount: null },
    { id: 103, name: 'Cảm biến nhiệt ẩm DHT22', price: '65.000₫', rawPrice: 65000, image: 'https://m.media-amazon.com/images/I/51+6k8v+S+L._AC_SX679_.jpg', rating: 4.6, sold: 2100, discount: '-15%' },
    { id: 104, name: 'Màn hình OLED 0.96 I2C Xanh', price: '55.000₫', rawPrice: 55000, image: 'https://m.media-amazon.com/images/I/61J5-2Rk0XL._AC_SX679_.jpg', rating: 4.7, sold: 430, discount: null },
    { id: 105, name: 'Module Relay 5V 1 Kênh', price: '15.000₫', rawPrice: 15000, image: 'https://m.media-amazon.com/images/I/61r-Fz-K-uL._AC_SX679_.jpg', rating: 4.5, sold: 5000, discount: '-50%' },
    { id: 106, name: 'Breadboard 830 lỗ MB-102', price: '35.000₫', rawPrice: 35000, image: 'https://m.media-amazon.com/images/I/71X6q-jGj-L._AC_SX679_.jpg', rating: 4.8, sold: 1200, discount: null }
];

const HomeScreen = () => {
    const navigation = useNavigation<any>();
    const [refreshing, setRefreshing] = useState(false);

    const addToCart = useCartStore((state) => state.addToCart);
    const { triggerAnimation } = useCartAnimation();

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1500);
    }, []);

    // --- FLY-TO-CART: đo tọa độ ảnh SP và trigger animation ---
    const handleAddToCart = (item: any, imageRef: React.RefObject<any>) => {
        addToCart(item, 1);
        if (imageRef.current) {
            imageRef.current.measureInWindow((x: number, y: number, width: number, height: number) => {
                triggerAnimation({
                    startPos: { x, y, width, height },
                    imageUrl: item.image,
                });
            });
        }
    };

    const renderHeader = () => (
        <View style={styles.headerBg}>
            <View style={styles.headerTop}>
                <View>
                    <Text style={styles.welcomeText}>Xin chào bạn,</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="hardware-chip" size={24} color="#FFD700" style={{ marginRight: 8 }} />
                        <Text style={styles.brandText}>ElectroShop</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate(ROUTES.FAVORITES)}>
                    <Ionicons name="heart-outline" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity activeOpacity={0.9} style={styles.searchBox} onPress={() => navigation.navigate(ROUTES.SEARCH)}>
                <Ionicons name="search" size={20} color="#64748B" />
                <Text style={styles.searchText}>Tìm linh kiện, module, cảm biến...</Text>
            </TouchableOpacity>
        </View>
    );

    const renderBanner = () => (
        <View style={styles.bannerContainer}>
            <FlatList
                data={BANNERS}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => <Image source={{ uri: item }} style={styles.bannerImage} resizeMode="cover" />}
            />
        </View>
    );

    const renderCategories = () => (
        <View style={styles.section}>
            <Text style={styles.title}>Danh mục phổ biến</Text>
            <View style={styles.catGrid}>
                {CATEGORIES.map((cat) => (
                    <TouchableOpacity key={cat.id} style={styles.catItem} onPress={() => navigation.navigate(ROUTES.PRODUCT_LIST, { categoryId: cat.id, categoryName: cat.name })}>
                        <View style={[styles.catIconBox, { backgroundColor: cat.bg }]}><Ionicons name={cat.icon as any} size={26} color={cat.color} /></View>
                        <Text style={styles.catText} numberOfLines={1}>{cat.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    const ProductCard = ({ item, isHorizontal = false }: any) => {
        // Mỗi card có ref ảnh riêng để đo tọa độ
        const imageRef = useRef<any>(null);
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.card, isHorizontal ? { width: 160, marginRight: 15 } : { width: '48%', marginBottom: 15 }]}
                onPress={() => navigation.navigate(ROUTES.PRODUCT_DETAIL, { product: item })}
            >
                <Image ref={imageRef} source={{ uri: item.image }} style={styles.cardImage} resizeMode="contain" />
                {item.discount && <View style={styles.discountBadge}><Text style={styles.discountText}>{item.discount}</Text></View>}
                <View style={styles.cardInfo}>
                    <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.cardPrice}>{item.price}</Text>
                    <View style={styles.cardRating}><Ionicons name="star" size={12} color="#F59E0B" /><Text style={styles.ratingText}>{item.rating} • Đã bán {item.sold}</Text></View>
                </View>

                {/* Nút Cộng (+) — gọi fly-to-cart */}
                <TouchableOpacity style={styles.addBtn} onPress={() => handleAddToCart(item, imageRef)}>
                    <Ionicons name="add" size={20} color="#fff" />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#2563EB" barStyle="light-content" />
            {renderHeader()}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}>
                {renderBanner()}
                {renderCategories()}
                <View style={styles.flashSale}>
                    <View style={styles.sectionHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}><Ionicons name="flash" size={20} color="#DC2626" style={{ marginRight: 5 }} /><Text style={[styles.title, { color: '#DC2626', marginBottom: 0 }]}>Flash Sale</Text></View>
                        <Text style={styles.timer}>02:15:40</Text>
                    </View>
                    <FlatList horizontal data={PRODUCTS} showsHorizontalScrollIndicator={false} renderItem={({ item }) => <ProductCard item={item} isHorizontal />} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 10 }} />
                </View>
                <View style={styles.section}>
                    <Text style={styles.title}>Gợi ý hôm nay</Text>
                    <View style={styles.grid}>
                        {PRODUCTS.map((item, index) => <ProductCard key={index} item={item} />)}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F1F5F9' },
    headerBg: { backgroundColor: '#2563EB', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 40 : 60, paddingBottom: 25, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, zIndex: 10 },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    welcomeText: { fontSize: 12, color: '#BFDBFE', marginBottom: 4 },
    brandText: { fontSize: 22, fontWeight: '800', color: '#fff' },
    iconBtn: { backgroundColor: 'rgba(255,255,255,0.15)', padding: 10, borderRadius: 14 },
    searchBox: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, height: 45, alignItems: 'center', paddingHorizontal: 15 },
    searchText: { flex: 1, marginLeft: 12, color: '#94A3B8', fontSize: 14 },
    bannerContainer: { marginTop: 20 },
    bannerImage: { width: width - 40, height: 170, borderRadius: 24, marginHorizontal: 20 },
    section: { marginTop: 25, paddingHorizontal: 20 },
    title: { fontSize: 18, fontWeight: '700', color: '#1E293B', marginBottom: 15 },
    catGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    catItem: { alignItems: 'center', width: '23%', marginBottom: 20 },
    catIconBox: { width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    catText: { fontSize: 11, color: '#475569', fontWeight: '600' },
    card: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', elevation: 3 },
    cardImage: { width: '100%', height: 140, backgroundColor: '#fff', marginTop: 10 },
    discountBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: '#EF4444', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    discountText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    cardInfo: { padding: 12 },
    cardName: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 6, lineHeight: 18, height: 36 },
    cardPrice: { fontSize: 16, fontWeight: 'bold', color: '#2563EB' },
    cardRating: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
    ratingText: { fontSize: 10, color: '#94A3B8', marginLeft: 4, fontWeight: '500' },
    addBtn: { position: 'absolute', bottom: 10, right: 10, backgroundColor: '#2563EB', borderRadius: 10, padding: 6 },
    flashSale: { marginTop: 15, backgroundColor: '#FEF2F2', paddingVertical: 20 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 15, alignItems: 'center' },
    timer: { backgroundColor: '#DC2626', color: '#fff', fontSize: 12, fontWeight: 'bold', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, overflow: 'hidden' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});

export default HomeScreen;