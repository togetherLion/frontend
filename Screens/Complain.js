import React, { useState } from 'react'
import {
  Alert,
  TextInput,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native'
import axios from 'axios'

const Complain = ({ navigation, route }) => {
  const [nowPassword, setNowPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  const handleSubmit = () => {
    if (newPassword !== confirmPassword) {
      setModalMessage('비밀번호 확인이 일치하지 않습니다.')
      setModalVisible(true)
    } else {
      axios
        .post('http://192.168.200.142:8080/user/changePw', {
          nowPassword: nowPassword,
          newPassword: newPassword,
        })
        .then((resp) => {
          console.log(resp.data)
          if (resp.data !== null && resp.data !== '') {
            setModalMessage('비밀번호 변경 성공')
            setModalVisible(true)
          }
        })
        .catch((error) => {
          console.log(error.response.data.error)
          setModalMessage(error.response.data.error)
          setModalVisible(true)
        })
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}></View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          새로운 비밀번호를 {'\n'}
          입력해주세요
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="현재 비밀번호"
          secureTextEntry={true}
          onChangeText={(text) => setNowPassword(text)}
          value={nowPassword}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="변경할 비밀번호"
          secureTextEntry={true}
          onChangeText={(text) => setNewPassword(text)}
          value={newPassword}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="비밀번호 확인"
          secureTextEntry={true}
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false)
          if (modalMessage === '비밀번호 변경 성공') {
            navigation.navigate('MyPage')
          }
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={() => {
                setModalVisible(false)
                if (modalMessage === '비밀번호 변경 성공') {
                  navigation.navigate('MyPage')
                }
              }}
            >
              <Text style={styles.closeButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.bottomSpace}></View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>비밀번호 변경</Text>
      </TouchableOpacity>
    </View>
  )
}

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
})

export default Complain
