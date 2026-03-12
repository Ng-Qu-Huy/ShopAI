import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    SafeAreaView, StatusBar, Alert, ScrollView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../../constants/routes';
import { useAuth } from '../../store/AuthContext';
import CustomInput from '../../components/CustomInput';   // <--- IMPORT COMPONENT MỚI
import CustomButton from '../../components/CustomButton'; // <--- IMPORT COMPONENT MỚI

const RegisterScreen = () => {
    const navigation = useNavigation<any>();
    const { register } = useAuth();

    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errors, setErrors] = useState({
        username: '', phone: '', password: '', confirmPassword: ''
    });

    const validateRegister = () => {
        let isValid = true;
        let newErrors = { username: '', phone: '', password: '', confirmPassword: '' };

        const usernameRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        const phoneRegex = /^[0-9]{10,11}$/;

        if (!username.trim()) { newErrors.username = 'Tài khoản không được để trống'; isValid = false; }
        else if (!usernameRegex.test(username)) { newErrors.username = 'Tài khoản cần 6+ ký tự, gồm chữ HOA, thường & số'; isValid = false; }

        if (!phone.trim()) { newErrors.phone = 'Số điện thoại không được để trống'; isValid = false; }
        else if (!phoneRegex.test(phone)) { newErrors.phone = 'Số điện thoại không hợp lệ'; isValid = false; }

        if (!password.trim()) { newErrors.password = 'Mật khẩu không được để trống'; isValid = false; }
        else if (!passwordRegex.test(password)) { newErrors.password = 'Mật khẩu cần 8+ ký tự, chữ, số & ký tự đặc biệt'; isValid = false; }

        if (!confirmPassword.trim()) { newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu'; isValid = false; }
        else if (password !== confirmPassword) { newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'; isValid = false; }

        setErrors(newErrors);
        return isValid;
    };

    const handleRegister = () => {
        if (validateRegister()) {
            const success = register({
                username: username,
                phone: phone,
                password: password
            });

            if (success) {
                Alert.alert('Thành công', 'Đăng ký tài khoản thành công! Vui lòng đăng nhập.', [
                    { text: 'OK', onPress: () => navigation.navigate(ROUTES.LOGIN) }
                ]);
            }
        }
    };

    const handleChange = (field: keyof typeof errors, value: string, setter: (val: string) => void) => {
        setter(value);
        if (errors[field]) setErrors({ ...errors, [field]: '' });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Đăng ký tài khoản</Text>
            </View>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.subtitle}>Tạo tài khoản mới để nhận ưu đãi ngay hôm nay!</Text>

                <View style={styles.form}>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tài khoản <Text style={{ color: 'red' }}>*</Text></Text>
                        <CustomInput
                            placeholder="VD: NguyenVanA123"
                            value={username}
                            onChangeText={(text) => handleChange('username', text, setUsername)}
                            error={errors.username}
                        />
                        {!errors.username && <Text style={styles.hint}>* Chữ hoa, chữ thường và số</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Số điện thoại <Text style={{ color: 'red' }}>*</Text></Text>
                        <CustomInput
                            placeholder="VD: 0901234567"
                            keyboardType="numeric"
                            value={phone}
                            onChangeText={(text) => handleChange('phone', text, setPhone)}
                            error={errors.phone}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Mật khẩu <Text style={{ color: 'red' }}>*</Text></Text>
                        <CustomInput
                            placeholder="••••••••"
                            secureTextEntry
                            value={password}
                            onChangeText={(text) => handleChange('password', text, setPassword)}
                            error={errors.password}
                        />
                        {!errors.password && <Text style={styles.hint}>* Chữ, số và ký tự đặc biệt (@$!%*?&)</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nhập lại mật khẩu <Text style={{ color: 'red' }}>*</Text></Text>
                        <CustomInput
                            placeholder="••••••••"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={(text) => handleChange('confirmPassword', text, setConfirmPassword)}
                            error={errors.confirmPassword}
                        />
                    </View>

                    {/* SỬ DỤNG CUSTOM BUTTON */}
                    <CustomButton
                        title="ĐĂNG KÝ"
                        onPress={handleRegister}
                        style={{ marginTop: 10 }}
                    />
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Đã có tài khoản? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate(ROUTES.LOGIN)}>
                        <Text style={styles.loginLink}>Đăng nhập</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    backBtn: { padding: 5, marginRight: 10 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E293B' },
    content: { padding: 25 },
    subtitle: { fontSize: 14, color: '#64748B', marginBottom: 30 },
    form: { marginBottom: 20 },
    inputGroup: { marginBottom: 5 }, // Thu nhỏ margin lại vì CustomInput đã tự có khoảng trống
    label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 8 },
    hint: { fontSize: 11, color: '#94A3B8', fontStyle: 'italic', marginTop: -10, marginBottom: 10 }, // Căn chỉnh dòng nhắc nhở
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 10, marginBottom: 30 },
    footerText: { color: '#64748B' },
    loginLink: { color: '#2563EB', fontWeight: 'bold' }
});

export default RegisterScreen;