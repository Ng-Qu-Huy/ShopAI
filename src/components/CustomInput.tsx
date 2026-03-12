import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface CustomInputProps extends TextInputProps {
    iconName?: string;
    error?: string;
}

const CustomInput = ({ iconName, error, ...props }: CustomInputProps) => {
    return (
        <View style={styles.container}>
            <View style={[styles.inputContainer, error ? styles.inputError : null]}>
                {iconName && (
                    <Ionicons name={iconName} size={20} color="#64748B" style={styles.icon} />
                )}
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#94A3B8"
                    {...props} // Truyền tất cả các props còn lại vào TextInput
                />
            </View>
            {/* Hiển thị lỗi nếu có */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 50,
        backgroundColor: '#F8FAFC'
    },
    inputError: {
        borderColor: '#EF4444',
        backgroundColor: '#FEF2F2'
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: '#333',
        fontSize: 15,
    },
    errorText: {
        color: '#EF4444',
        fontSize: 12,
        marginTop: 5,
        marginLeft: 4,
    }
});

export default CustomInput;