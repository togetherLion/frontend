import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'

const FirstScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/balbadag.png')}
          style={styles.logo}
        />
        <View style={styles.textContainer}>
          <Text style={styles.mainText}>같 이 사 자</Text>
          <Text style={styles.subText}>동네 주민과 함께하는 공동구매</Text>
          <Text style={styles.subText}>같이사자</Text>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ChatButton')}
        >
          <Text style={styles.buttonText}>시작하기</Text>
        </TouchableOpacity>
        <View style={styles.bottomTextContainer}>
          <Text style={styles.bottomText}>이미 계정이 있나요?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>로그인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  textContainer: {
    alignItems: 'center',
  },
  mainText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#996B30',
    marginBottom: 5,
  },
  subText: {
    fontSize: 16,
    color: '#996B30',
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 50,
  },
  button: {
    backgroundColor: '#F4C089',
    paddingVertical: 10,
    paddingHorizontal: 60,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  bottomTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 14,
    color: '#666666',
  },
  loginText: {
    fontSize: 14,
    color: '#996B30',
    marginLeft: 5,
  },
})

export default FirstScreen