import React, { useState } from 'react';
import { Alert, TextInput, StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import axios from 'axios';

const Withdraw = ({ navigation, route }) => {

  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  



  const withdraw = () => {
    axios.delete("http://172.30.1.62:8080/user/unregister", {
      data: { password: password }
    })
      .then((resp) => {
        console.log(resp.data);
        if (resp.data !== null && resp.data !== "") {
          setModalVisible(false);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }
      })
      .catch(error => {
        console.log(error.response.data.error);
        setModalMessage(error.response.data.error);
        setModalVisible(true);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          확인을 위해 {'\n'}
          비밀번호를 입력해주세요
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="현재 비밀번호"
          secureTextEntry={true}
          onChangeText={text => setPassword(text)}
          value={password}
        />
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
                if (modalMessage === '비밀번호 변경 성공') {
                    navigation.navigate('MyPage');
                }
            }}
            >
              <Text style={styles.closeButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    
      <View style={styles.bottomSpace}></View>
      <TouchableOpacity style={styles.button} onPress={withdraw}>
        <Text style={styles.buttonText}>회원 탈퇴</Text>
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

export default Withdraw;
