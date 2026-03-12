import React, { useState } from 'react';
import {
    View, Text, StyleSheet, FlatList, Image, TouchableOpacity,
    SafeAreaView, StatusBar, Modal, Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ROUTES } from '../../constants/routes';
import { useCartStore } from '../../store/useCartStore'; // <-- CHUYỂN SANG DÙNG ZUSTAND

// Mock Data
const MOCK_PRODUCTS = Array.from({ length: 12 }).map((_, index) => ({
    id: index + 100,
    name: index % 2 === 0 ? `Module Cảm biến ${index}` : `Vi điều khiển ESP32 - V${index}`,
    price: '50.000₫', rawPrice: 50000,
    rating: 4.5, sold: 10 + index,
    image: index % 2 === 0 ? 'https://m.media-amazon.com/images/I/51+6k8v+S+L._AC_SX679_.jpg' : 'https://m.media-amazon.com/images/I/61N+QjXm8-L._AC_SX679_.jpg',
}));

const ProductListScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { categoryName } = route.params || { categoryName: 'Sản phẩm' };

    // --- Lấy hàm addToCart từ Zustand ---
    const addToCart = useCartStore((state) => state.addToCart);

    const [modalVisible, setModalVisible] = useState(false);

    // --- HÀM XỬ LÝ THÊM VÀO GIỎ CÓ THÔNG BÁO ---
    const handleAddToCart = (item: any) => {
        addToCart(item, 1);
        Alert.alert(
            'Thành công',
            `Đã thêm 1 "${item.name}" vào giỏ hàng!`,
            [
                { text: 'Tiếp tục mua sắm', style: 'cancel' },
                { text: 'Đến giỏ hàng', onPress: () => navigation.navigate('MainTabs', { screen: ROUTES.CART_TAB }) }
            ]
        );
    };

    const renderProductItem = ({ item }: any) => (
        <View style={styles.productCard}>
            <TouchableOpacity
                onPress={() => navigation.navigate(ROUTES.PRODUCT_DETAIL, { product: item })}
                style={styles.cardInner}
                activeOpacity={0.9}
            >
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.price}>{item.price}</Text>
                    <View style={styles.ratingRow}>
                        <Ionicons name="star" size={10} color="#F59E0B" />
                        <Text style={styles.ratingNum}>{item.rating} | Đã bán {item.sold}</Text>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Nút Cộng (+) gọi hàm handleAddToCart */}
            <TouchableOpacity style={styles.addBtn} onPress={() => handleAddToCart(item)}>
                <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#2563EB" />
                </TouchableOpacity>
                <View style={styles.searchBar}>
                    <Text style={styles.searchText}>{categoryName}</Text>
                </View>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.filterBtn}>
                    <Ionicons name="filter" size={20} color="#2563EB" />
                </TouchableOpacity>
            </View>

            {/* Product Grid */}
            <FlatList
                data={MOCK_PRODUCTS}
                renderItem={renderProductItem}
                keyExtractor={item => item.id.toString()}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />

            {/* Modal Filter Giả lập */}
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Bộ lọc (Demo)</Text>
                        <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F1F5F9' },
    header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15 },
    backBtn: { padding: 5 },
    searchBar: { flex: 1, alignItems: 'center' },
    searchText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    filterBtn: { padding: 5 },
    listContainer: { padding: 10 },

    productCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, margin: 6, elevation: 2 },
    cardInner: { flex: 1 },
    productImage: { width: '100%', height: 140, resizeMode: 'contain' },
    productInfo: { padding: 10 },
    productName: { fontSize: 13, color: '#333', marginBottom: 5, height: 36 },
    price: { fontSize: 15, fontWeight: 'bold', color: '#2563EB' },
    ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
    ratingNum: { fontSize: 10, color: '#94A3B8', marginLeft: 4 },

    addBtn: { position: 'absolute', bottom: 10, right: 10, backgroundColor: '#2563EB', borderRadius: 8, padding: 4 },

    modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, height: 200, alignItems: 'center' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
    closeBtn: { backgroundColor: '#2563EB', padding: 10, borderRadius: 8, width: 100, alignItems: 'center' }
});

export default ProductListScreen;