import React, { useState } from 'react';
import { Alert, TextInput, StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import axios from 'axios';

const SignupScreen = ({ navigation, route }) => {

  const [phone, setPhone] = useState(route.params?.phone || '');
  const [userAddress, setUserAddress] = useState(route.params?.userAddress || '');
  const [userLat, setUserlat] = useState(route.params?.userLat || '');
  const [userLong, setUserlong] = useState(route.params?.userLong || '');
  const [loginId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setUserName] = useState('');
  const [nickName, setNickName] = useState('');
  const [isIdAvailable, setIsIdAvailable] = useState(null);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');



  const checkId = () => {
    if (loginId.trim() === "") {
      setModalMessage('ID가 입력되지 않았습니다.');
      setModalVisible(true);
    } else {
      axios.post("http://172.30.1.56:8080/user/idCheck", {
        loginId: loginId
      }).then(function (response) {
        console.log(response.data);  // 서버에서 받은 응답을 콘솔에 출력합니다.
        if (response.data.idCheck == true) {
          setModalMessage('사용 중인 ID입니다. 다른 ID를 시도하세요.');
          setIsIdAvailable(false);
          setModalVisible(true);
        } else {
          setModalMessage('사용 가능한 ID입니다.');
          setIsIdAvailable(true);
          setModalVisible(true);
        }
      })
    }
  };

  const checkNickname = () => {
    if (nickName.trim() === "") {
      setModalMessage('닉네임이 입력되지 않았습니다.');
    } else {
      axios.post("http://172.30.1.56:8080/user/nicknameCheck", {
        nickname: nickName,
      }).then(function (response) {
        console.log(response.data);  // 서버에서 받은 응답을 콘솔에 출력합니다.
        if (response.data.nicknameCheck == true) {
          setModalMessage('사용 중인 닉네임입니다. 다른 닉네임 시도하세요.');
          setIsNicknameAvailable(false);
        } else {
          setModalMessage('사용 가능한 닉네임입니다.');
          setIsNicknameAvailable(true);
        }
        setModalVisible(true);
      })
    }
  };

  const handleSubmit = () => { // 회원가입할때
    if (!isIdAvailable) {
      setModalMessage('사용할 수 없는 ID입니다.');
      setModalVisible(true);
    } else if (password !== confirmPassword) {
      setModalMessage('비밀번호가 일치하지 않습니다.');
      setModalVisible(true);
    } else if (name.trim() === "") { //이름입력x
      setModalMessage('이름이 입력되지 않았습니다.');
      setModalVisible(true);
    } else if (!isNicknameAvailable) {
      setModalMessage('사용할 수 없는 닉네임입니다.');
      setModalVisible(true);
    } else {
      axios.post("http://172.30.1.56:8080/user/signup", {
        loginId: loginId,
        password: password,
        name: name,
        nickname: nickName,
        phone: phone,
        userAddress: userAddress, //앞에서 phone이랑 userAddress받아오기
        userLat: userLat,
        userLong: userLong,
      }).then(function (response) {
          console.log(response.data);  // 서버에서 받은 응답을 콘솔에 출력합니다.
          if (response.data.loginId == loginId) {
            setModalMessage('회원가입이 완료되었습니다.');
            setModalVisible(true);
            navigation.navigate('Login');
          } else {
            setModalMessage('회원가입에 실패했습니다.');
            setModalVisible(true);
          }
        });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          회원 정보를 {'\n'}
          입력해주세요
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="아이디"
          onChangeText={text => setUserId(text)}
          value={loginId}
        />
        <TouchableOpacity style={styles.checkButton} onPress={checkId}>
          <Text style={styles.checkButtonText}>중복 확인</Text>
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
          placeholder="비밀번호"
          onChangeText={text => setPassword(text)}
          secureTextEntry={true}
          value={password}
        />
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="비밀번호 확인"
          onChangeText={text => setConfirmPassword(text)}
          secureTextEntry={true}
          value={confirmPassword}
        />
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="이름"
          onChangeText={text => setUserName(text)}
          value={name}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="닉네임"
          onChangeText={text => setNickName(text)}
          value={nickName}
        />
        <TouchableOpacity style={styles.checkButton} onPress={checkNickname}>
          <Text style={styles.checkButtonText}>중복 확인</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpace}></View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>회원가입</Text>
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

export default SignupScreen;
