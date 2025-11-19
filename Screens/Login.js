import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert, Modal} from 'react-native';
import axios from 'axios';

const Login = ({ navigation }) => {

    const [loginId, setloginId] = useState('')
    const [password, setPassword] = useState('')

    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');


    function handleLogin() {
        if (loginId.trim() === "") {
            setModalMessage('아이디가 입력되지 않았습니다.');
            setModalVisible(true);
        } else if (password.trim() === "") {
            setModalMessage('비밀번호가 입력되지 않았습니다.');
            setModalVisible(true);
        } else {
            axios.post("http://172.30.1.56:8080/user/login", {
                loginId: loginId,
                password: password,
            }).then(function (resp) {
                console.log(resp.data);
                if (resp.data !== null && resp.data !== "") {
                    console.log("로그인 성공");
                    const userId = resp.data.userId || '';
                    navigation.navigate('PostListScreen', { userId: userId });
                }
            }).catch(error => {
                console.log(error.response.data.error);
                setModalMessage(error.response.data.error);
                setModalVisible(true);
              });
        }
    }


    return (
        <View style={styles.container}>
            <Image source={require('../assets/balbadag.png')} style={styles.logo} />
            <Text style={styles.title}>LOGIN</Text>
            <TextInput
                style={styles.input}
                placeholder="아이디"
                placeholderTextColor="#888"
                onChangeText={(text) => setloginId(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="비밀번호"
                placeholderTextColor="#888"
                secureTextEntry={true}
                onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>로그인</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {navigation.navigate('FindId') }}>
                <Text style={styles.link}>아이디를 잊으셨나요?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {navigation.navigate('FindPw') }}>
                <Text style={styles.link}>비밀번호를 잊으셨나요?</Text>
            </TouchableOpacity>
            <View style={styles.footer}>
                <Text style={styles.footerText}>계정이 없으신가요? </Text>
                <TouchableOpacity onPress={() => { navigation.navigate('Phone') }}>
                    <Text style={[styles.footerText, styles.footerLink]}>회원가입</Text>
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



        </View>


    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        width: 130,
        height: 130,
        marginBottom: 30,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black', // 텍스트 색상 (갈색)
        marginBottom: 30,
        //textShadowColor: 'rgba(139, 69, 19, 0.75)',
        //textShadowOffset: { width: -1, height: 1 }, // 그림자 오프셋
        //textShadowRadius: 10, // 그림자 반경
    },
    input: {
        width: '95%',
        height: 40,
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
        marginBottom: 30,
        fontSize: 15,
        paddingHorizontal: 10,
    },
    loginButton: {
        width: '100%',
        backgroundColor: '#ffcc80',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 30,
    },
    loginButtonText: {
        color: '#ffffff', // 버튼 텍스트 색상
        fontSize: 18,
        fontWeight: 'bold',
    },
    link: {
        color: 'black', // 링크 색상
        fontSize: 16,
        marginBottom: 10,
    },
    footer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    footerText: {
        fontSize: 16,
        color: 'black',
    },
    footerLink: {
        color: 'black', // 링크 색상
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
    
});

export default Login;
