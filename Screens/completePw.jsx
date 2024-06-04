import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

const CompletePwScreen = ({ navigation }) => {
  return (
    <View style={styles.completePw}>
      <View style={styles.completePwHeader}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.completePwHeaderBackIcon}
        >
          <Text style={styles.completePwHeaderBackIconI}>X</Text>
        </TouchableOpacity>
        <Text style={styles.completePwHeaderSpan}>임시 비밀번호 받기</Text>
      </View>
      <View style={styles.completePwContent}>
        <View style={styles.completePwContentTitle}>
          <Text style={styles.completePwContentTitleI}>✔</Text>
          <Text style={styles.completePwContentTitleH2}>
            임시 비밀번호 전송 완료
          </Text>
          <Text style={styles.completePwContentTitleSpan}>
            휴대폰 번호로 임시 비밀번호를 발송하였습니다
          </Text>
        </View>
        <View style={styles.completePwFooter}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.completePwFooterButton}
          >
            <Text style={styles.completePwFooterButtonText}>완료</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  completePw: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  completePwHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  completePwHeaderBackIcon: {
    marginRight: 10,
  },
  completePwHeaderBackIconI: {
    fontSize: 20,
  },
  completePwHeaderSpan: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  completePwContent: {
    alignItems: 'center',
    marginTop: 50,
  },
  completePwContentTitle: {
    alignItems: 'center',
    marginBottom: 40,
  },
  completePwContentTitleI: {
    fontSize: 40,
    color: 'black',
  },
  completePwContentTitleH2: {
    fontSize: 18,
    color: '#b58500',
    marginTop: 10,
  },
  completePwContentTitleSpan: {
    fontSize: 14,
    color: '#333',
    marginTop: 10,
  },
  completePwFooter: {
    marginTop: 20,
    width: '100%',
  },
  completePwFooterButton: {
    backgroundColor: '#fbbd08',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  completePwFooterButtonText: {
    color: '#fff',
    fontSize: 16,
  },
})

export default CompletePwScreen
