import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    SafeAreaView,
    Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
    const navigation = useNavigation();

    const SectionHeader = ({ title }: { title: string }) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
    );

    const SettingsItem = ({
        title,
        subtitle,
        icon,
        hideChevron = false,
        onPress,
        isLast = false
    }: any) => (
        <TouchableOpacity
            style={styles.settingItem}
            activeOpacity={0.7}
            onPress={onPress}
        >
            <View style={styles.itemLeft}>
                <Text style={styles.itemTitle}>{title}</Text>
                {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
            </View>
            <View style={styles.itemRight}>
                {!hideChevron && <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />}
            </View>
            {!isLast && <View style={styles.separator} />}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={26} color="#DC2626" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Thiết lập tài khoản</Text>
                <View style={styles.backBtn} /> {/* Placeholder để cân bằng flex giữa 2 bên */}
            </View>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* SECTION: TÀI KHOẢN */}
                <SectionHeader title="Tài khoản" />
                <View style={styles.sectionContainer}>
                    <SettingsItem title="Tài khoản & Bảo mật" />
                    <SettingsItem title="Địa chỉ" subtitle="1 Địa chỉ" />
                    <SettingsItem title="Tài khoản / Thẻ ngân hàng" isLast />
                </View>

                {/* SECTION: CÀI ĐẶT */}
                <SectionHeader title="Cài đặt" />
                <View style={styles.sectionContainer}>
                    <SettingsItem title="Cài đặt Chat" />
                    <SettingsItem title="Cài đặt Thông báo" />
                    <SettingsItem title="Cài đặt Quyền riêng tư" />
                    <SettingsItem title="Người dùng bị chặn" />
                    <SettingsItem title="Ngôn ngữ / Language" subtitle="Tiếng Việt" isLast />
                </View>

                {/* SECTION: HỖ TRỢ */}
                <SectionHeader title="Hỗ trợ" />
                <View style={styles.sectionContainer}>
                    <SettingsItem title="Trung tâm Trợ giúp" />
                    <SettingsItem title="Tiêu chuẩn Cộng đồng" />
                    <SettingsItem title="Điều khoản" />
                    <SettingsItem title="Đánh giá Ứng dụng" />
                    <SettingsItem title="Giới thiệu" isLast />
                </View>

                {/* BUTTONS */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.switchAccountBtn}>
                        <Text style={styles.switchAccountText}>Chuyển đổi tài khoản</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.logoutBtn}>
                        <Text style={styles.logoutText}>Đăng xuất</Text>
                    </TouchableOpacity>
                </View>

                {/* VERSION */}
                <Text style={styles.versionText}>ElectroShop v1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#F1F5F9', // Nền màu xám nhạt như Shopee
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        height: 56,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    backBtn: {
        width: 40,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#1E293B',
    },
    sectionHeader: {
        paddingHorizontal: 15,
        paddingTop: 20,
        paddingBottom: 8,
    },
    sectionTitle: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    sectionContainer: {
        backgroundColor: '#fff',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#E2E8F0',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
    },
    itemLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 10,
    },
    itemTitle: {
        fontSize: 15,
        color: '#333',
    },
    itemSubtitle: {
        fontSize: 13,
        color: '#64748B',
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    separator: {
        position: 'absolute',
        bottom: 0,
        left: 15,
        right: 0,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#E2E8F0',
    },
    buttonContainer: {
        marginTop: 25,
        marginBottom: 30,
    },
    switchAccountBtn: {
        backgroundColor: '#fff',
        paddingVertical: 14,
        alignItems: 'center',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#E2E8F0',
        marginBottom: 15,
    },
    switchAccountText: {
        fontSize: 15,
        color: '#333',
        fontWeight: '400',
    },
    logoutBtn: {
        backgroundColor: '#fff',
        paddingVertical: 14,
        alignItems: 'center',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#E2E8F0',
    },
    logoutText: {
        fontSize: 15,
        color: '#333',
        fontWeight: '400',
    },
    versionText: {
        textAlign: 'center',
        color: '#94A3B8',
        fontSize: 13,
        marginBottom: 40,
    }
});

export default SettingsScreen;