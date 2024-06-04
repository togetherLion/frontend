import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import styles from '../styles.js'

const First = ({ navigation }) => {
  return (
    <View style={styles.first}>
      <View style={styles.firstLogo}>
        <Image
          source={require('../assets/images/Logo.svg')}
          style={styles.firstLogoImg}
        />
        <View style={styles.firstLogoH1}>
          <Text style={styles.firstLogoH1}>같 이 사 자</Text>
          <Text>동네 주민과 함께하는 공동구매</Text>
          <Text>같이사자</Text>
        </View>
      </View>
      <View style={styles.firstBottom}>
        <TouchableOpacity
          style={styles.firstBottomButton}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.firstBottomButtonText}>시작하기</Text>
        </TouchableOpacity>
        <View style={styles.firstBottomText}>
          <Text style={styles.firstBottomTextSpan}>이미 계정이 있나요?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.firstBottomTextButton}>로그인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default First
