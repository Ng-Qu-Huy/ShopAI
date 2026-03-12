// Code mẫu (Template)
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SettingsScreen = () => {
    return (
        <View style={styles.container}>
            {/* Sửa text bên dưới thành tên màn hình tương ứng */}
            <Text style={styles.text}>ĐÂY LÀ MÀN HÌNH SETTING </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    }
});

export default SettingsScreen;