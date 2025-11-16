import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const UserInform = ({ navigation }) => {
    const [loginId, setLoginId] = useState('');
    const [userAddress, setUserAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [account, setAccount] = useState('');
    const [name, setName] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedField, setSelectedField] = useState('');
    const [selectedValue, setSelectedValue] = useState('');

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getInform();
        });
        return unsubscribe;
    }, [navigation]);



    async function getInform() {
        try {
            const resp = await axios.post("http://172.30.1.81:8080/user/userInfo");
            if (resp.data) {
                setLoginId(resp.data.loginId);
                setUserAddress(resp.data.userAddress);
                setName(resp.data.name);
                setAccount(resp.data.account);
                setPhone(resp.data.phone);
            }
        } catch (err) {
            console.log(`에러 메시지: ${err}`);
        }
    }

    const EditName = () => {
       navigation.navigate('EditName', {name:name});
    };

    const EditAddress = () => {
        navigation.navigate('EditAddress');
    };

    const EditPhone = () => {
        navigation.navigate('EditPhone', {phone:phone});
    };

    const EditAccount = () => {
        navigation.navigate('EditAccount', {account:account});
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>회원 정보</Text>
            </View>
            <View style={styles.infoItem}>
                <Text style={styles.label}>아이디</Text>
                <Text style={styles.value}>{loginId}</Text>
            </View>
            <TouchableOpacity style={styles.infoItem} onPress={EditName}>
                <Text style={styles.label}>이름</Text>
                <View style={styles.infoRow}>
                    <Text style={styles.value}>{name}</Text>
                    <Ionicons name="chevron-forward" size={20} color="black" />
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.infoItem} onPress={EditAddress}>
                <Text style={styles.label}>주소</Text>
                <View style={styles.infoRow}>
                    <Text style={styles.value}>{userAddress}</Text>
                    <Ionicons name="chevron-forward" size={20} color="black" />
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.infoItem} onPress={EditPhone}>
                <Text style={styles.label}>휴대폰 번호</Text>
                <View style={styles.infoRow}>
                    <Text style={styles.value}>{phone}</Text>
                    <Ionicons name="chevron-forward" size={20} color="black" />
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.infoItem} onPress={EditAccount}>
                <Text style={styles.label}>계좌번호</Text>
                <View style={styles.infoRow}>
                    <Text style={styles.value}>{account}</Text>
                    <Ionicons name="chevron-forward" size={20} color="black" />
                </View>
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
        borderBottomColor: 'white',
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
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export default UserInform;
