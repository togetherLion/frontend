import React, { useState } from 'react';
import { Alert, TextInput, StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import axios from 'axios';


const EditPhone = ({ navigation, route }) => {
    const [phone, setPhone] = useState(route.params?.phone || '');
    const [newphone, setNewphone] = useState('');
    //const [isPhoneAvailable, setIsPhoneAvailable] = useState(null);
    const [reauth, setReauth] = useState('');
    const [auth, setAuth] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const sendNum = () => {
        if (newphone.trim() === "") {
            setModalMessage('번호가 입력되지 않았습니다.');
            setModalVisible(true);
        } else {
            axios.post("http://172.30.1.56:8080/user/phoneAuth", { phone: newphone })
                .then(function (response) {
                    console.log(response.data);  // 서버에서 받은 응답을 콘솔에 출력합니다.
                    if (response.data.auth !== undefined && response.data.auth !== null) {
                        setModalMessage('인증번호가 전송되었습니다.');
                        setAuth(response.data.auth);
                    } else {
                        setModalMessage('인증번호 전송에 실패했습니다.');
                    }
                    setModalVisible(true);
                })
                .catch(function (error) {
                    console.error('에러 발생:', error);
                    setModalMessage('이미 존재하는 번호입니다.'); // 서버에서 오류가 발생하면 "오류입니다" 메시지를 modalMessage로 설정
                    setModalVisible(true);
                });
        }
    };
    

    const handleSubmit = () => { // 다음으로 넘어갈때
        if (reauth !== auth) {
            setModalMessage('인증번호가 일치하지 않습니다.');
            setModalVisible(true);
        } else {
            axios.post("http://172.30.1.56:8080/user/changePhone", { phone: newphone })
            .then(function (response) {
                console.log(response.data);  // 서버에서 받은 응답을 콘솔에 출력합니다.
                setModalMessage('전화번호가 변경되었습니다.');
                setModalVisible(true);
            })
            .catch(function (error) {
                console.error('에러 발생:', error);
                setModalMessage('전화번호 변경에 실패했습니다.'); // 서버에서 오류가 발생하면 "오류입니다" 메시지를 modalMessage로 설정
                setModalVisible(true);
            });
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
            </View>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>
                    변경할 전화번호를 {'\n'}
                    입력해주세요
                </Text>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={phone}
                    onChangeText={(text) => setNewphone(text)}
                    value={newphone}
                />
                <TouchableOpacity style={styles.checkButton} onPress={sendNum}>
                    <Text style={styles.checkButtonText}>번호 인증</Text>
                </TouchableOpacity>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>{modalMessage}</Text>
                        <TouchableOpacity
                            style={[styles.button, styles.closeButton]}
                            onPress={() => {
                                setModalVisible(false);
                                // 확인 버튼을 클릭하면 이름이 변경되고 UserInform으로 이동
                                if (modalMessage === '전화번호가 변경되었습니다.') {
                                    navigation.navigate('UserInform');
                                }
                            }}
                        >
                            <Text style={styles.closeButtonText}>확인</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="인증번호 입력"
                    onChangeText={text => setReauth(text)}
                    value={reauth}
                />
            </View>


            <View style={styles.bottomSpace}></View>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>인증하기</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 20,
        paddingTop: 60,
        marginLeft: 10,
        marginRight: 5,
    },
    header: {
        width: '100%',
        alignItems: 'flex-start',
        marginBottom: 50,
    },
    titleContainer: {
        width: '100%',
        alignItems: 'flex-start',
        marginBottom: 40,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'left',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 15,
    },
    inputRow: {
        width: '100%',
        marginBottom: 15,
    },
    input: {
        width: '70%',
        height: 40,
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
        paddingHorizontal: 10,
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
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    button: {
        width: '100%',
        backgroundColor: '#ffcc80',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButton: {
        backgroundColor: '#fff',
        //marginTop: 10,
        width: '50%',
    },
    closeButtonText: {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
    },
    bottomSpace: {
        height: 20,
        marginTop: 10,
    },
});

export default EditPhone;
