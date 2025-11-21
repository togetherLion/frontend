import React, { useState } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import axios from 'axios'

const FindPwScreen = ({ navigation }) => {
  const [loginId, setLoginId] = useState('')

  const handleFindPw = async () => {
    try {
        console.log(loginId);
      const response = await axios
        .post('http://172.30.1.56:8080/user/findPw', {
          loginId : loginId,
        })
        .then((response) => {
            console.log(response);
            navigation.navigate('CompletePw');
        
          }
        )
    } catch (error) {
      Alert.alert('아이디 찾기 실패', error.message)
    }
  }

  return (
    <SafeAreaView style={styles.findPw}>
      <View style={styles.findPwHeader}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.findPwHeaderBackIcon}
        >
          <Text style={styles.findPwHeaderBackIconI}>X</Text>
        </TouchableOpacity>
        <Text style={styles.findPwHeaderSpan}>임시 비밀번호 받기</Text>
      </View>

      <View>
        <Text style={styles.findPwContentH2}>아이디를 입력해주세요</Text>
        <View style={styles.findPwContentForm}>
          <TextInput
            style={[styles.findPwContentFormName, styles.findPwContentInput]}
            placeholder="아이디를 입력해주세요"
            onChangeText={(text) => setLoginId(text)}
          />
          <TouchableOpacity
            style={styles.findPwContentButton}
            onPress={handleFindPw}
          >
            <Text style={styles.findPwContentText}>임시 비밀번호 받기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  findPw: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  findPwHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  findPwHeaderBackIcon: {
    marginRight: 10,
  },
  findPwHeaderBackIconI: {
    fontSize: 20,
  },
  findPwHeaderSpan: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  findPwContentH2: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
  findPwContentForm: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  findPwContentInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  findPwContentButton: {
    backgroundColor: '#fbbd08',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  findPwContentText: {
    color: '#fff',
    fontSize: 16,
  },
})

export default FindPwScreen