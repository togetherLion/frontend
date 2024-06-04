import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native'
import axios from 'axios'

const FindIdScreen = ({ navigation }) => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const handleFindId = async () => {
    try {
      const response = await axios
        .post('http://192.168.200.142:8080/user/findId', {
          name,
          phone,
        })
        .then((response) => {
          console.log(response.status)
          console.log(response.data.loginId)

          if (response.status === 200) {
            navigation.navigate('CompleteId', {
              loginId: response.data.loginId,
            })
          } else {
            Alert.alert(
              '아이디 찾기 실패',
              response.data.message || '아이디 찾기에 실패했습니다.'
            )
          }
        })
    } catch (error) {
      Alert.alert('아이디 찾기 실패', error.message)
    }
  }

  return (
    <View style={styles.findId}>
      <View style={styles.findIdHeader}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.backIcon}
        >
          <Text style={styles.backIconI}>X</Text>
        </TouchableOpacity>
        <Text style={styles.findIdHeaderText}>아이디 찾기</Text>
      </View>
      <View>
        <Text style={styles.findIdContentH2}>
          이름과 휴대폰 번호를 인증해주세요
        </Text>
        <View style={styles.findIdContentForm}>
          <TextInput
            style={[
              styles.findIdContentFormName,
              styles.findIdContentInput,
              styles.findIdContentInputPlaceholder,
            ]}
            placeholder="이름을 입력해주세요"
            onChangeText={(text) => setName(text)}
          />
          <TextInput
            style={[
              styles.findIdContentFormPhone,
              styles.findIdContentInput,
              styles.findIdContentInputPlaceholder,
            ]}
            placeholder="휴대폰 번호를 입력해주세요"
            onChangeText={(text) => setPhone(text)}
          />
          <TouchableOpacity
            style={styles.findIdContentButton}
            onPress={() => handleFindId}
          >
            <Text style={styles.findIdContentText}>아이디 찾기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  findId: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  findIdHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backIcon: {
    marginRight: 10,
  },
  backIconI: {
    fontSize: 18,
  },
  findIdHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  findIdContentH2: {
    fontSize: 16,
    color: '#996B30',
    marginBottom: 20,
  },
  findIdContentForm: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  findIdContentInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  findIdContentButton: {
    backgroundColor: '#F4C089',
    paddingVertical: 10,
    paddingHorizontal: 40,
    alignItems: 'center',
    borderRadius: 5,
  },
  findIdContentButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
})

export default FindIdScreen
