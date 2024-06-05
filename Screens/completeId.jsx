import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native'

const CompleteIdScreen = ({ navigation, route }) => {
  return (
    <SafeAreaView style={styles.completeId}>
      <View style={styles.completeIdHeader}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.completeIdHeaderBackIcon}
        >
          <Text style={styles.completeIdHeaderBackIconI}>X</Text>
        </TouchableOpacity>
        <Text style={styles.completeIdHeaderSpan}>아이디 찾기</Text>
      </View>
      <View style={styles.completeIdContent}>
        <View style={styles.completeIdContentTitle}>
          <Text style={styles.completeIdContentTitleI}>✔</Text>
          <Text style={styles.completeIdContentTitleH2}>아이디 찾기 완료</Text>
        </View>
        <View style={styles.completeIdContentMain}>
          <Text style={styles.completeIdContentMainSpan}>아이디</Text>

          <Text style={styles.completeIdContentMainUserId}>
            {route.params.loginId}
          </Text>
        </View>
        <View style={styles.completeIdFooter}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.completeIdFooterButton}
          >
            <Text style={styles.completeIdFooterButtonText}>완료</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  completeId: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  completeIdHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  completeIdHeaderBackIcon: {
    marginRight: 10,
  },
  completeIdHeaderBackIconI: {
    fontSize: 20,
  },
  completeIdHeaderSpan: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  completeIdContent: {
    alignItems: 'center',
    marginTop: 50,
  },
  completeIdContentTitle: {
    alignItems: 'center',
    marginBottom: 40,
  },
  completeIdContentTitleI: {
    fontSize: 40,
    color: 'black',
  },
  completeIdContentTitleH2: {
    fontSize: 18,
    color: '#b58500',
    marginTop: 10,
  },
  completeIdContentMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  completeIdContentMainSpan: {
    fontSize: 16,
    color: 'black',
    marginRight: 10,
  },
  completeIdContentMainUserId: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  completeIdFooter: {
    marginTop: 20,
    width: '100%',
  },
  completeIdFooterButton: {
    backgroundColor: '#fbbd08',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  completeIdFooterButtonText: {
    color: '#fff',
    fontSize: 16,
  },
})

export default CompleteIdScreen
