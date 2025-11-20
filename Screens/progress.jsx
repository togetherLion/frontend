import React, { useState, useEffect } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native'
import Checkbox from 'expo-checkbox'
import axios from 'axios'

let i = 0

const steps = ['모집', '송금', '상품 배송', '상품 전달']

const ProgressScreen = ({ navigation, route }) => {
  const [chatRoomId, setChatRoomId] = useState('')
  const [chatStatus, setChatStatus] = useState('')

  const [stepStatus, setStepStatus] = useState([
    '진행중',
    ...Array(steps.length - 1).fill('대기'),
  ])

  useEffect(() => {
    // 이 부분에서 axios를 사용하여 chatid와 chatstatus를 받아옵니다.
    // 예시로 아래와 같이 구현할 수 있습니다. 실제로 사용할 때는 서버와의 통신이 이루어져야 합니다.
    const fetchChatStatus = async () => {
      try {
        const response = await axios
          .get('http://165.229.169.110:8080/posts/1' /*+ route.params.postId*/)
          .then((response) => {
            setChatStatus(response.data.dealState)
            updateProgress(response.data.dealState)
          })
      } catch (error) {
        console.error('Error fetching chat status:', error)
      }
    }

    fetchChatStatus() // 컴포넌트가 마운트될 때 chatstatus를 받아옵니다.

    // chatid나 chatstatus가 변경될 때마다 chatstatus를 업데이트합니다.
  }, [chatRoomId, chatStatus])

  const updateProgress = (chatStatus) => {
    // let i = 0
    const newStatus = [...stepStatus]
    // for (i = 0; i < (chatStatus + 1) / 4; i++) {
    //   newStatus[i] = '진행완료'
    // }
    // if ((chatStatus + 1) % 3 == 1) {
    //   newStatus[i] = '대기'
    // } else if ((chatStatus + 1) % 3 == 2) {
    //   newStatus[i] = '진행중'
    // } else {
    //   newStatus[i] = '진행완료'
    // }

    if (chatStatus === 'FIRST') {
      newStatus[0] = '진행중'
      newStatus[1] = '대기'
      newStatus[2] = '대기'
      newStatus[3] = '대기'
    } else if (chatStatus === 'SECOND') {
      newStatus[0] = '진행완료'
      newStatus[1] = '진행중'
      newStatus[2] = '대기'
      newStatus[3] = '대기'
    } else if (chatStatus === 'THIRD') {
      newStatus[0] = '진행완료'
      newStatus[1] = '진행완료'
      newStatus[2] = '진행중'
      newStatus[3] = '대기'
    } else if (chatStatus === 'FOURTH') {
      newStatus[0] = '진행완료'
      newStatus[1] = '진행완료'
      newStatus[2] = '진행완료'
      newStatus[3] = '진행중'
    } else if (chatStatus === 'FIFTH') {
      newStatus[0] = '진행완료'
      newStatus[1] = '진행완료'
      newStatus[2] = '진행완료'
      newStatus[3] = '진행완료'
    }

    setStepStatus(newStatus)
  }

  const toggleStep = (index) => {
    const newStatus = [...stepStatus]
    if (newStatus[index] === '진행중') {
      newStatus[index] = '진행완료'
      if (index < steps.length - 1) {
        newStatus[index + 1] = '진행중'
      }
    } else if (newStatus[index] === '진행완료') {
      i = index
      newStatus[index] = '진행중'
      while (i < steps.length - 1) {
        newStatus[i + 1] = '대기'
        i++
      }
    }

    setStepStatus(newStatus)
    updateChatStatus(newStatus)
  }

  const updateChatStatus = (newStatus) => {
    let i = 0
    let newChatStatus = ''

    console.log(newStatus)

    while (newStatus[i] != '진행중' && i <= 4) {
      i++
    }

    if (i == 0) {
      newChatStatus = 'FIRST'
    } else if (i == 1) {
      newChatStatus = 'SECOND'
    } else if (i == 2) {
      newChatStatus = 'THIRD'
    } else if (i == 3) {
      newChatStatus = 'FOURTH'
    } else if (i == 4) {
      newChatStatus = 'FIFTH'
    }

    // for (i = 0; newStatus[i] == '진행완료'; i++) {
    //   newChatStatus += 3
    // }
    // if ((newStatus[i] = '진행중')) {
    //   newChatStatus += 1
    // } else if ((newStatus[i] = '진행완료')) {
    //   newChatStatus += 2
    // }

    setChatStatus(newChatStatus)
    // 변경된 chatStatus를 서버로 전달
    sendChatStatusToServer(newChatStatus)
  }

  const sendChatStatusToServer = async (chatStatus) => {
    try {
      await axios.put(
        'http://165.229.169.110:8080/posts/1' /*+ route.params.postId*/,
        {
          dealState: chatStatus,
        }
      )
      console.log(chatStatus), console.log('put 성공')
    } catch (error) {
      console.error('Error sending chat status:', error)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backIcon}
        >
          <Text style={styles.backIconI}>X</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.progressBar}>
        <View
          style={{
            ...styles.progress,
            width: `${
              ((stepStatus.filter((status) => status === '진행완료').length +
                stepStatus.filter((status) => status === '진행중').length) /
                steps.length) *
              100
            }%`,
          }}
        />
        {steps.map((step, index) => (
          <View key={index} style={styles.stepContainer}>
            <View
              style={
                stepStatus[index] !== '대기' ? styles.stepActive : styles.step
              }
            >
              <Text style={styles.stepText}>{step}</Text>
              <Text style={styles.stepStatus}>{stepStatus[index]}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.checkboxContainer}>
        {steps.map((step, index) => (
          <View key={index} style={styles.checkboxWrapper}>
            <Checkbox
              value={stepStatus[index] === '진행완료'}
              onValueChange={() => toggleStep(index)}
              disabled={stepStatus[index] === '대기'}
            />
          </View>
        ))}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  header: {
    display: 'flex',
    alignSelf: 'flex-start',
    height: 40,
    marginBottom: 24,
  },
  backIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  backIconI: {
    fontSize: 24,
  },
  headerText: {
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: -0.01,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    marginTop: 100,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    width: '80%',
    marginBottom: 20,
  },
  progress: {
    position: 'absolute',
    top: '50%',
    left: 0,
    height: 4,
    backgroundColor: '#725201',
    zIndex: -1,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
  },
  step: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#725201',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepText: {
    position: 'absolute',
    top: 30,
    width: 80,
    textAlign: 'center',
    fontSize: 12,
  },
  stepStatus: {
    position: 'absolute',
    top: 50,
    width: 80,
    textAlign: 'center',
    fontSize: 10,
    color: '#555',
  },
  checkboxContainer: {
    marginTop: 30,
    width: '80%',
    flexDirection: 'row', // 가로 방향으로 요소들을 정렬합니다.
    flexWrap: 'wrap', // 요소들이 너비를 초과하면 다음 줄로 넘어갑니다.
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '25%', // 4개의 체크박스가 한 줄에 나오도록 너비를 조정합니다.
  },
})

export default ProgressScreen