import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Platform,
    Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../constants/routes';

// Dữ liệu giả lập (Hardcode) để hiển thị luôn
const MOCK_USER = {
    username: 'Nguyễn Văn Dev',
    rank: 'Thành viên Vàng',
    avatar: 'https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg',
    voucherCount: 12,
    points: '250k',
    memberType: 'Hạng Bạc'
};

const ProfileScreen = () => {
    const navigation = useNavigation<any>();

    // Không cần useAuth() hay kiểm tra đăng nhập nữa.
    // Luôn render giao diện đã đăng nhập.

    // Component Menu Con
    const MenuItem = ({ icon, title, subtitle, color = '#333', isLast = false, onPress }: any) => (
        <TouchableOpacity
            style={[styles.menuItem, isLast && styles.menuItemLast]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.menuIconBox, { backgroundColor: `${color}15` }]}>
                <Ionicons name={icon} size={22} color={color} />
            </View>
            <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{title}</Text>
                {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#2563EB" barStyle="light-content" />

            {/* HEADER PROFILE (Màu xanh) */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Image
                        source={{ uri: MOCK_USER.avatar }}
                        style={styles.avatar}
                    />
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{MOCK_USER.username}</Text>
                        <View style={styles.rankBadge}>
                            <Text style={styles.rankText}>{MOCK_USER.rank}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.settingsBtn}
                        onPress={() => navigation.navigate(ROUTES.SETTINGS)}
                    >
                        <Ionicons name="settings-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* STATS ROW (Voucher/Điểm) */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{MOCK_USER.voucherCount}</Text>
                        <Text style={styles.statLabel}>Voucher</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{MOCK_USER.points}</Text>
                        <Text style={styles.statLabel}>Điểm thưởng</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{MOCK_USER.memberType}</Text>
                        <Text style={styles.statLabel}>Thành viên</Text>
                    </View>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                style={styles.body}
            >
                {/* ORDER STATUS CARD */}
                <View style={styles.orderCard}>
                    <View style={styles.orderHeader}>
                        {/* Tab nhỏ phía trên Card (như hình mẫu) */}
                        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                            {['Chờ xác nhận', 'Chờ lấy hàng', 'Đang giao', 'Đánh giá'].map((status, index) => (
                                <Text key={index} style={{ fontSize: 11, color: '#64748B' }}>{status}</Text>
                            ))}
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.orderRow}>
                        <TouchableOpacity style={styles.orderItem} onPress={() => navigation.navigate(ROUTES.ORDER_HISTORY)}>
                            <Ionicons name="wallet-outline" size={28} color="#2563EB" />
                            <Text style={styles.orderText}>Chờ xác nhận</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.orderItem} onPress={() => navigation.navigate(ROUTES.ORDER_HISTORY)}>
                            <Ionicons name="cube-outline" size={28} color="#2563EB" />
                            <Text style={styles.orderText}>Chờ lấy hàng</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.orderItem} onPress={() => navigation.navigate(ROUTES.ORDER_HISTORY)}>
                            <View>
                                <Ionicons name="bicycle-outline" size={28} color="#2563EB" />
                                <View style={styles.badge}><Text style={styles.badgeText}>2</Text></View>
                            </View>
                            <Text style={styles.orderText}>Đang giao</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.orderItem}>
                            <Ionicons name="star-outline" size={28} color="#2563EB" />
                            <Text style={styles.orderText}>Đánh giá</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* MENU GROUP 1 */}
                <View style={styles.menuGroup}>
                    <MenuItem
                        icon="person-outline"
                        title="Thông tin tài khoản"
                        subtitle="Cập nhật tên, số điện thoại"
                        color="#0EA5E9"
                        onPress={() => Alert.alert('Thông báo', 'Tính năng đang cập nhật')}
                    />
                    <MenuItem
                        icon="location-outline"
                        title="Địa chỉ giao hàng"
                        color="#F59E0B"
                        onPress={() => Alert.alert('Thông báo', 'Tính năng đang cập nhật')}
                    />
                    <MenuItem
                        icon="card-outline"
                        title="Phương thức thanh toán"
                        color="#10B981"
                        isLast
                        onPress={() => Alert.alert('Thông báo', 'Tính năng đang cập nhật')}
                    />
                </View>

                {/* MENU GROUP 2 */}
                <View style={styles.menuGroup}>
                    <MenuItem
                        icon="help-circle-outline"
                        title="Trung tâm trợ giúp"
                        color="#6366F1"
                    />
                    <MenuItem
                        icon="chatbubble-ellipses-outline"
                        title="Chat với hỗ trợ"
                        color="#EC4899"
                        isLast
                    />
                </View>

                {/* LOGOUT BUTTON */}
                <TouchableOpacity
                    style={styles.logoutBtn}
                    onPress={() => Alert.alert('Thông báo', 'Đây là bản Demo, không cần đăng xuất!')}
                >
                    <Text style={styles.logoutText}>Đăng xuất</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Phiên bản 1.0.0 - ElectroShop</Text>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F1F5F9' },

    // HEADER
    header: {
        backgroundColor: '#2563EB',
        paddingTop: Platform.OS === 'android' ? 40 : 60,
        paddingBottom: 80, // Để chừa chỗ cho Card Order đè lên
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
    avatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: '#fff' },
    userInfo: { flex: 1, marginLeft: 15 },
    userName: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
    rankBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start' },
    rankText: { color: '#fff', fontSize: 12, fontWeight: '500' },
    settingsBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12 },

    // STATS
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 },
    statItem: { alignItems: 'center', flex: 1 },
    statNumber: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
    statLabel: { fontSize: 12, color: '#DBEAFE', marginTop: 2 },
    statDivider: { width: 1, height: 25, backgroundColor: 'rgba(255,255,255,0.3)' },

    // BODY
    body: { flex: 1, marginTop: -60, paddingHorizontal: 15 },

    // ORDER CARD
    orderCard: {
        backgroundColor: '#fff', borderRadius: 20, padding: 15, marginBottom: 20,
        shadowColor: '#64748B', shadowOpacity: 0.1, shadowRadius: 10, elevation: 4
    },
    orderHeader: { marginBottom: 10 },
    divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 15 },
    orderRow: { flexDirection: 'row', justifyContent: 'space-between' },
    orderItem: { alignItems: 'center', width: '25%' },
    orderText: { fontSize: 11, color: '#475569', marginTop: 8, textAlign: 'center' },
    badge: { position: 'absolute', top: -6, right: -4, backgroundColor: '#EF4444', minWidth: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

    // MENU
    menuGroup: {
        backgroundColor: '#fff', borderRadius: 16, marginBottom: 15,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, overflow: 'hidden'
    },
    menuItem: {
        flexDirection: 'row', alignItems: 'center', padding: 16,
        borderBottomWidth: 1, borderBottomColor: '#F1F5F9'
    },
    menuItemLast: { borderBottomWidth: 0 },
    menuIconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    menuContent: { flex: 1 },
    menuTitle: { fontSize: 15, fontWeight: '600', color: '#1E293B' },
    menuSubtitle: { fontSize: 12, color: '#94A3B8', marginTop: 2 },

    // FOOTER
    logoutBtn: { backgroundColor: '#FEE2E2', padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 10, marginBottom: 10 },
    logoutText: { color: '#EF4444', fontWeight: 'bold', fontSize: 16 },
    versionText: { textAlign: 'center', color: '#CBD5E1', fontSize: 12, marginBottom: 20 }
});

export default ProfileScreen;