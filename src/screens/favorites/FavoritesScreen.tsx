import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../constants/routes';
import { useCart } from '../../store/CartContext';

// Dữ liệu giả lập sản phẩm yêu thích
const MOCK_FAVORITES = [
    { id: 101, name: 'Arduino Uno R3 DIP (Kèm cáp)', price: 150000, image: 'https://m.media-amazon.com/images/I/71J15x0e36L.jpg' },
    { id: 104, name: 'Màn hình OLED 0.96 I2C Xanh', price: 55000, image: 'https://m.media-amazon.com/images/I/61J5-2Rk0XL._AC_SX679_.jpg' },
];

const FavoritesScreen = () => {
    const navigation = useNavigation<any>();
    const { addToCart } = useCart();

    const formatCurrency = (amount: number) => amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    const renderItem = ({ item }: any) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate(ROUTES.PRODUCT_DETAIL, { product: item })}
        >
            <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.price}>{formatCurrency(item.price)}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity style={styles.iconBtn}>
                    <Ionicons name="heart" size={24} color="#EF4444" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.iconBtn, { backgroundColor: '#2563EB' }]} onPress={() => addToCart(item)}>
                    <Ionicons name="cart" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Sản phẩm yêu thích</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={MOCK_FAVORITES}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{ padding: 15 }}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
    backBtn: { padding: 5 },
    card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 15, elevation: 2 },
    image: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#F1F5F9' },
    info: { flex: 1, marginLeft: 12, justifyContent: 'center' },
    name: { fontSize: 14, fontWeight: '500', color: '#334155', marginBottom: 8 },
    price: { fontSize: 16, fontWeight: 'bold', color: '#2563EB' },
    actions: { justifyContent: 'space-between', alignItems: 'center' },
    iconBtn: { padding: 8, borderRadius: 20 },
});

export default FavoritesScreen;