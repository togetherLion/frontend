import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';

const EditUserInform = ({ route, navigation }) => {
    const { loginId, userAddress: initialUserAddress, phone: initialPhone, account: initialAccount, name: initialName } = route.params;
    const [userAddress, setUserAddress] = useState(initialUserAddress);
    const [phone, setPhone] = useState(initialPhone);
    const [account, setAccount] = useState(initialAccount);
    const [name, setName] = useState(initialName);
    const [verificationCode, setVerificationCode] = useState('');
    const [inputVerificationCode, setInputVerificationCode] = useState('');

    async function handleChange() {
        try {
            const resp = await axios.post("http://127.0.0.1:8080/user/changeInfo", {
                userAddress,
                phone,
                account,
                name,
            });
            if (resp.data) {
                console.log("정보 변경 성공");
                navigation.goBack();
            } else {
                console.log("정보 변경 실패");
            }
        } catch (err) {
            console.log(`에러 메시지: ${err}`);
        }
    }

    async function sendVerificationCode() {
        try {
            const resp = await axios.post("http://127.0.0.1:8080/user/sendVerificationCode", { phone });
            if (resp.data) {
                console.log("인증번호 전송 성공");
                setVerificationCode(resp.data.verificationCode);
            } else {
                console.log("인증번호 전송 실패");
            }
        } catch (err) {
            console.log(`에러 메시지: ${err}`);
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>정보 수정</Text>
            </View>
            <View style={styles.infoItem}>
                <Text style={styles.label}>아이디</Text>
                <Text style={styles.value}>{loginId}</Text>
            </View>
            <View style={styles.infoItem}>
                <Text style={styles.label}>주소</Text>
                <TextInput
                    style={styles.input}
                    value={userAddress}
                    onChangeText={setUserAddress}
                />
            </View>
            <View style={styles.infoItem}>
                <Text style={styles.label}>휴대폰 번호</Text>
                <View style={styles.phoneContainer}>
                    <TextInput
                        style={styles.input}
                        value={phone}
                        onChangeText={setPhone}
                    />
                    <TouchableOpacity style={styles.checkButton} onPress={sendVerificationCode}>
                        <Text style={styles.checkButtonText}>인증번호 전송</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.infoItem}>
                <Text style={styles.label}>인증번호 입력</Text>
                <TextInput
                    style={styles.input}
                    value={inputVerificationCode}
                    onChangeText={setInputVerificationCode}
                />
            </View>
            <View style={styles.infoItem}>
                <Text style={styles.label}>계좌번호</Text>
                <TextInput
                    style={styles.input}
                    value={account}
                    onChangeText={setAccount}
                />
            </View>
            <View style={styles.infoItem}>
                <Text style={styles.label}>이름</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                />
            </View>
            <TouchableOpacity style={styles.buttonContainer} onPress={handleChange}>
                <Text style={styles.buttonText}>저장하기</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#ffffff',
        padding: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 60,
        marginLeft: 10,
    },
    header: {
        fontSize: 26,
        fontWeight: 'bold',
    },
    infoItem: {
        width: '100%',
        backgroundColor: '#ffffff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
        marginBottom: 20,
    },
    label: {
        fontSize: 12,
        color: '#333333',
    },
    value: {
        fontSize: 16,
        color: 'black',
        marginTop: 5,
        fontWeight: '500',
    },
    input: {
        fontSize: 16,
        color: 'black',
        marginTop: 5,
        fontWeight: '500',
        flex: 1,
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#000',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    checkButtonText: {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
    },
    buttonContainer: {
        width: '100%',
        backgroundColor: '#ffcc80',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default EditUserInform;
