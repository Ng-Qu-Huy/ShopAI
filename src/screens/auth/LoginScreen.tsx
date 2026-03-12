import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    Image, SafeAreaView, StatusBar, Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../store/AuthContext';
import CustomInput from '../../components/CustomInput';   // <--- IMPORT COMPONENT MỚI
import CustomButton from '../../components/CustomButton'; // <--- IMPORT COMPONENT MỚI

const LoginScreen = () => {
    const navigation = useNavigation<any>();
    const { login } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        const success = login(username, password);
        if (success) {
            navigation.goBack();
        } else {
            Alert.alert('Đăng nhập thất bại', 'Sai tên tài khoản hoặc mật khẩu! Vui lòng thử lại.');
        }
    };

    const handleSocialLogin = (platform: string) => {
        Alert.alert('Thông báo', `Tính năng đăng nhập bằng ${platform} đang phát triển`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={styles.content}>
                <View style={styles.header}>
                    <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2920/2920349.png' }} style={styles.logo} />
                    <Text style={styles.title}>Chào mừng trở lại!</Text>
                    <Text style={styles.subtitle}>Đăng nhập để tiếp tục mua sắm</Text>
                </View>

                <View style={styles.form}>
                    {/* SỬ DỤNG CUSTOM INPUT */}
                    <CustomInput
                        iconName="person-outline"
                        placeholder="Tài khoản"
                        value={username}
                        onChangeText={setUsername}
                    />

                    <CustomInput
                        iconName="lock-closed-outline"
                        placeholder="Mật khẩu"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <TouchableOpacity style={styles.forgotBtn}>
                        <Text style={styles.forgotText}>Quên mật khẩu?</Text>
                    </TouchableOpacity>

                    {/* SỬ DỤNG CUSTOM BUTTON */}
                    <CustomButton
                        title="ĐĂNG NHẬP"
                        onPress={handleLogin}
                    />
                </View>

                <View style={styles.divider}>
                    <View style={styles.line} />
                    <Text style={styles.orText}>Hoặc đăng nhập bằng</Text>
                    <View style={styles.line} />
                </View>

                <View style={styles.socialRow}>
                    <TouchableOpacity style={styles.socialBtn} onPress={() => handleSocialLogin('Google')}><Ionicons name="logo-google" size={24} color="#DB4437" /></TouchableOpacity>
                    <TouchableOpacity style={styles.socialBtn} onPress={() => handleSocialLogin('Facebook')}><Ionicons name="logo-facebook" size={24} color="#4267B2" /></TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Chưa có tài khoản? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate(ROUTES.REGISTER)}><Text style={styles.signupText}>Đăng ký ngay</Text></TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    content: { flex: 1, padding: 25, justifyContent: 'center' },
    header: { alignItems: 'center', marginBottom: 40 },
    logo: { width: 80, height: 80, marginBottom: 15 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1E293B', marginBottom: 5 },
    subtitle: { fontSize: 14, color: '#64748B' },
    form: { marginBottom: 20 },
    forgotBtn: { alignSelf: 'flex-end', marginBottom: 20, marginTop: -5 },
    forgotText: { color: '#2563EB', fontWeight: '500' },
    divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
    line: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
    orText: { marginHorizontal: 10, color: '#94A3B8', fontSize: 12 },
    socialRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 30 },
    socialBtn: { width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', marginHorizontal: 10 },
    footer: { flexDirection: 'row', justifyContent: 'center' },
    footerText: { color: '#64748B' },
    signupText: { color: '#2563EB', fontWeight: 'bold' }
});

export default LoginScreen;