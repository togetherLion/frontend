import React, { useState } from 'react';
import { Alert, TextInput, StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import axios from 'axios';


const Phone = ({ navigation }) => {
    const [phone, setPhone] = useState('');
    //const [isPhoneAvailable, setIsPhoneAvailable] = useState(null);
    const [reauth, setReauth] = useState('');
    const [auth, setAuth] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
  
    const sendNum = () => {
        if (phone.trim() === "") {
          setModalMessage('번호가 입력되지 않았습니다.');
          setModalVisible(true);
        } else {
          axios.post("http://192.168.200.116:8080/user/phoneAuth", { phone: phone })
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
            .catch(error => {
                console.log(error.response.data.error);
                setModalMessage(error.response.data.error);
                setModalVisible(true);
              });
        }
      };

    const handleSubmit = () => { // 다음으로 넘어갈때
        if (reauth !== auth) {
            setModalMessage('인증번호가 일치하지 않습니다.');
            setModalVisible(true);
          } else {
            navigation.navigate('Place', {phone:phone});
          }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
            </View>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>
                    전화번호를 {'\n'}
                    입력해주세요
                </Text>
            </View>
            
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="전화번호"
                    onChangeText={text => setPhone(text)}
                    value={phone}
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
                            onPress={() => setModalVisible(false)}
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

export default Phone;
