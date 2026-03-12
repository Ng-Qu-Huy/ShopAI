import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface CustomButtonProps {
    title: string;
    onPress: () => void;
    type?: 'primary' | 'outline' | 'danger'; // Hỗ trợ nhiều loại nút
    isLoading?: boolean;
    disabled?: boolean;
    style?: any; // Để custom thêm padding/margin bên ngoài nếu cần
}

const CustomButton = ({
    title,
    onPress,
    type = 'primary',
    isLoading = false,
    disabled = false,
    style
}: CustomButtonProps) => {

    // Đổi màu nền tùy theo loại nút
    const getBgColor = () => {
        if (disabled) return '#CBD5E1'; // Màu xám khi bị disable
        if (type === 'outline') return 'transparent';
        if (type === 'danger') return '#EF4444';
        return '#2563EB'; // Mặc định là primary (xanh)
    };

    // Đổi màu chữ
    const getTextColor = () => {
        if (disabled) return '#fff';
        if (type === 'outline') return '#2563EB';
        return '#fff';
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: getBgColor() },
                type === 'outline' && styles.outlineStyle,
                style
            ]}
            onPress={onPress}
            disabled={disabled || isLoading}
            activeOpacity={0.8}
        >
            {isLoading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text style={[styles.text, { color: getTextColor() }]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        paddingHorizontal: 20,
    },
    outlineStyle: {
        borderWidth: 1,
        borderColor: '#2563EB',
        elevation: 0,
        shadowOpacity: 0,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default CustomButton;