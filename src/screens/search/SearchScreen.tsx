import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    SafeAreaView, StatusBar, Keyboard
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const RECENT_SEARCHES = ['Arduino Uno', 'Cảm biến nhiệt độ', 'Màn hình OLED', 'Relay 5V'];
const TRENDING_SEARCHES = ['ESP32', 'Raspberry Pi', 'Trạm hàn', 'Động cơ Servo', 'Dây cắm test board'];

const SearchScreen = () => {
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState('');
    const inputRef = useRef<TextInput>(null);

    // Tự động bật bàn phím khi vào trang
    useEffect(() => {
        setTimeout(() => inputRef.current?.focus(), 100);
    }, []);

    const renderTag = (item: string, isTrending: boolean = false) => (
        <TouchableOpacity
            key={item}
            style={[styles.tag, isTrending && styles.tagTrending]}
            onPress={() => setSearchText(item)}
        >
            {isTrending && <Ionicons name="trending-up" size={14} color="#EF4444" style={{ marginRight: 4 }} />}
            <Text style={[styles.tagText, isTrending && styles.tagTextTrending]}>{item}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header Search Bar */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => { Keyboard.dismiss(); navigation.goBack(); }} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.searchInputContainer}>
                    <Ionicons name="search" size={20} color="#94A3B8" />
                    <TextInput
                        ref={inputRef}
                        style={styles.searchInput}
                        placeholder="Tìm linh kiện, module..."
                        value={searchText}
                        onChangeText={setSearchText}
                        returnKeyType="search"
                        onSubmitEditing={() => console.log('Searching for:', searchText)}
                    />
                    {searchText.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchText('')}>
                            <Ionicons name="close-circle" size={20} color="#CBD5E1" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Nội dung gợi ý (Chỉ hiện khi chưa gõ text) */}
            {searchText.length === 0 ? (
                <View style={styles.content}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Lịch sử tìm kiếm</Text>
                        <TouchableOpacity><Text style={styles.clearText}>Xóa</Text></TouchableOpacity>
                    </View>
                    <View style={styles.tagContainer}>
                        {RECENT_SEARCHES.map(item => renderTag(item))}
                    </View>

                    <Text style={[styles.sectionTitle, { marginTop: 25 }]}>Tìm kiếm phổ biến</Text>
                    <View style={styles.tagContainer}>
                        {TRENDING_SEARCHES.map(item => renderTag(item, true))}
                    </View>
                </View>
            ) : (
                <View style={styles.searchingContent}>
                    <Ionicons name="search-outline" size={50} color="#E2E8F0" />
                    <Text style={styles.searchingText}>Đang tìm kiếm: "{searchText}"</Text>
                    <Text style={{ color: '#94A3B8', fontSize: 12, marginTop: 5 }}>(Giao diện danh sách kết quả sẽ hiện ở đây)</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    backBtn: { marginRight: 15 },
    searchInputContainer: {
        flex: 1, flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#F8FAFC', borderRadius: 10, paddingHorizontal: 12, height: 45
    },
    searchInput: { flex: 1, marginLeft: 8, fontSize: 15, color: '#333' },
    content: { padding: 20 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 10 },
    clearText: { color: '#64748B', fontSize: 13 },
    tagContainer: { flexDirection: 'row', flexWrap: 'wrap' },
    tag: { backgroundColor: '#F1F5F9', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, marginRight: 10, marginBottom: 10 },
    tagText: { color: '#475569', fontSize: 13 },
    tagTrending: { backgroundColor: '#FEF2F2', flexDirection: 'row', alignItems: 'center' },
    tagTextTrending: { color: '#DC2626' },
    searchingContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    searchingText: { marginTop: 15, fontSize: 16, color: '#333', fontWeight: '500' }
});

export default SearchScreen;