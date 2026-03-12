import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    StatusBar,
    Dimensions
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../constants/routes';

const { width } = Dimensions.get('window');

// Dữ liệu danh mục (Đồng bộ với Home)
const CATEGORIES = [
    { id: 1, name: 'Vi điều khiển', icon: 'hardware-chip', color: '#2563EB', bg: '#EFF6FF', desc: 'Arduino, ESP32, STM32' },
    { id: 2, name: 'Cảm biến', icon: 'radio', color: '#10B981', bg: '#ECFDF5', desc: 'Cảm biến nhiệt, quang, âm thanh' },
    { id: 3, name: 'Module', icon: 'layers', color: '#F59E0B', bg: '#FFFBEB', desc: 'Relay, Motor Driver, LCD' },
    { id: 4, name: 'Công cụ', icon: 'construct', color: '#8B5CF6', bg: '#F5F3FF', desc: 'Kìm, hàn, đồng hồ đo' },
    { id: 5, name: 'IoT', icon: 'cloud-upload', color: '#06B6D4', bg: '#ECFEFF', desc: 'Module Wifi, Bluetooth, LoRa' },
    { id: 6, name: 'Nguồn', icon: 'battery-charging', color: '#EF4444', bg: '#FEF2F2', desc: 'Pin, Sạc, Adapter' },
    { id: 7, name: 'Màn hình', icon: 'tv', color: '#EC4899', bg: '#FDF2F8', desc: 'LCD, OLED, E-ink' },
    { id: 8, name: 'Khác', icon: 'grid', color: '#64748B', bg: '#F1F5F9', desc: 'Dây cắm, Breadboard...' },
];

const CategoryScreen = () => {
    const navigation = useNavigation<any>();

    const renderItem = ({ item }: any) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => {
                // CHUYỂN HƯỚNG SANG MÀN HÌNH DANH SÁCH, TRUYỀN ID VÀ TÊN DANH MỤC
                navigation.navigate(ROUTES.PRODUCT_LIST, {
                    categoryId: item.id,
                    categoryName: item.name
                });
            }}
        >
            <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
                <Ionicons name={item.icon} size={32} color={item.color} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDesc}>{item.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Danh mục sản phẩm</Text>
                <TouchableOpacity>
                    <Ionicons name="search" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Grid List */}
            <FlatList
                data={CATEGORIES}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{ padding: 20 }}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0'
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E293B' },

    // Item Style
    itemContainer: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#fff', borderRadius: 16, padding: 15, marginBottom: 15,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2
    },
    iconBox: {
        width: 60, height: 60, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15
    },
    textContainer: { flex: 1 },
    itemName: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
    itemDesc: { fontSize: 12, color: '#64748B' }
});

export default CategoryScreen;