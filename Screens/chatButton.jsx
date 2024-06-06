import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native'
import axios from 'axios'
import { useFocusEffect } from '@react-navigation/native'

const ChatButtonScreen = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [roomName, setRoomName] = useState('')
  const [chatRoomExists, setChatRoomExists] = useState(false) // State to hold the result of checkChatRoom
  const [chatUserData, setChatUserData] = useState([])
  const userId = route.params.userId
  const postId = 1

  useFocusEffect(
    useCallback(() => {
      const checkChatRoom = async () => {
        try {
          const response = await axios.get(
            'http://192.168.200.116:8080/waitingdeal/check-chat-room/1'
          )
          if (response.data.roomId) {
            setChatRoomExists(true)
          } else {
            setChatRoomExists(false)
          }
        } catch (error) {
          setChatRoomExists(false)
        }
      }

      checkChatRoom()
    }, [postId])
  )

  const checkCreateChat = async () => {
    try {
      const response = await axios.get(
        'http://192.168.200.116:8080/waitingdeal/accepted-users?postId=1' /*+ 현재 postId로 바꾸기*/
      )

      const data = response.data
      setChatUserData(data)
      setModalVisible(true)
    } catch (error) {
      console.error('Error checkCreateChat:', error)
    }
  }

  const handleCreateRoom = (roomName) => {
    setModalVisible(false)
    createChat(postId, roomName)
  }

  const createChat = async (postId, roomName) => {
    try {
      const response = await axios.post(
        'http://192.168.200.116:8080/chat/check-and-create-room?' +
          'postId=' +
          postId +
          '&roomName=' +
          roomName
      )

      navigation.navigate('ChatRoom', {
        userId: userId,
        roomId: response.data.roomId,
        chatUserData: chatUserData,
      })
    } catch (error) {
      console.error('Error createChat:', error)
    }
  }

  const joinChatRoom = async () => {
    try {
      const response = await axios.get(
        'http://192.168.200.116:8080/waitingdeal/check-chat-room/1'
      )
      navigation.navigate('ChatRoom', {
        userId: userId,
        roomId: response.data.roomId,
      })
    } catch (error) {
      console.error('Error joinChatRoom:', error)
    }
  }

  const sendWaiting = async () => {
    try {
      await axios.post('http://192.168.200.116:8080/waitingdeal', {
        postId: 1, // 현재 postId로 바꾸기
      })
      Alert.alert('참여가 요청되었습니다!')
    } catch (error) {
      Alert.alert(
        '참여에 실패하였습니다',
        error.response?.data?.message || error.message
      )
    }
  }

  return (
    <View style={styles.container}>
      {userId === 1 /*현재 post의 userId로 바꾸기*/ ? (
        <>
          {chatRoomExists ? (
            <TouchableOpacity style={styles.button} onPress={joinChatRoom}>
              <Text style={styles.buttonText}>채팅방 참가</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={checkCreateChat}>
              <Text style={styles.buttonText}>채팅방 생성</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate('WaitingTable', {
                postId: /*현재 postId로 바꾸기*/ 1,
                userId: userId,
              })
            }
          >
            <Text style={styles.buttonText}>대기테이블 보기</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={sendWaiting}>
            <Text style={styles.buttonText}>참여하기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={joinChatRoom}>
            <Text style={styles.buttonText}>채팅방 참가</Text>
          </TouchableOpacity>
        </>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>방 제목을 입력해주세요</Text>
            <TextInput
              style={styles.input}
              placeholder="방 제목"
              value={roomName}
              onChangeText={setRoomName}
            />
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => handleCreateRoom(roomName)}
            >
              <Text style={styles.buttonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // 배경색을 흰색으로 설정
  },
  button: {
    backgroundColor: '#F4C089',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
  input: {
    height: 40,
    width: 200,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
})

export default ChatButtonScreen