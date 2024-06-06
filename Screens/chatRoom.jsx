import React, { useState, useEffect } from 'react'
import {
  SafeAreaView,
  FlatList,
  Text,
  TextInput,
  Button,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  Linking,
} from 'react-native'
import WebSocketManager from '../WebSocketManager'
import {
  useWebSocketState,
  useWebSocketDispatch,
} from '../context/WebSocketContext'
import { useMessageState, useMessageDispatch } from '../context/MessageContext'
import axios from 'axios'
import Checkbox from 'expo-checkbox'

const ChatRoomScreen = ({ navigation, route }) => {
  const userId = route.params.userId
  const [nickname, setNickname] = useState('')
  const [account, setAccount] = useState('')
  const [cheatMsg, setCheatMsg] = useState('')
  const [inputMessage, setInputMessage] = useState('')
  const [modalVisible, setModalVisible] = useState(false)

  const [recommendations, setRecommendations] = useState([])
  const [selected, setSelected] = useState(null)
  const [recModalVisible, setRecModalVisible] = useState(false)
  const [recSubModalVisible, setRecSubModalVisible] = useState(false)

  const { connected } = useWebSocketState()
  const websocketDispatch = useWebSocketDispatch()

  const messages = useMessageState()[route.params.roomId] || []
  const messageDispatch = useMessageDispatch()

  useEffect(() => {
    const initialize = async () => {
      await getAccount()
      await getNickname()
      await getRecommend()

      if (!connected) {
        websocketDispatch({
          type: 'CONNECT',
          payload: 'ws://192.168.200.116:8080/ws/chat',
        })
      }
    }

    initialize()

    const handleOpen = () => {
      sendEnterMessage()
    }

    const handleMessage = (message) => {
      messageDispatch({
        type: 'ADD_MESSAGE',
        roomId: route.params.roomId,
        message,
      })
    }

    WebSocketManager.on('open', handleOpen)
    WebSocketManager.on('message', handleMessage)

    return () => {
      WebSocketManager.off('open', handleOpen)
      WebSocketManager.off('message', handleMessage)
    }
  }, [connected, nickname]) // Add nickname as a dependency

  const getNickname = async () => {
    try {
      const response = await axios.post(
        'http://192.168.200.116:8080/user/userProfile',
        { userId: userId }
      )
      console.log(response.data.nickname)
      setNickname(response.data.nickname)
    } catch (error) {
      console.error('Error getting nickname:', error)
    }
  }

  const sendEnterMessage = () => {
    const enterMessage = {
      type: 'ENTER',
      roomId: route.params.roomId,
      sender: nickname,
      message: '안녕하세요?',
    }
    websocketDispatch({ type: 'SEND', payload: enterMessage })
  }

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const message = {
        type: 'TALK',
        roomId: route.params.roomId,
        sender: nickname,
        message: inputMessage,
      }
      websocketDispatch({ type: 'SEND', payload: message })
      setInputMessage('')
    }
  }

  const getAccount = async () => {
    try {
      const response = await axios.get(
        'http://192.168.200.116:8080/chat/account'
      )
      setCheatMsg(response.data.cheatMsg)
      setAccount(response.data.account)
    } catch (error) {
      console.error('Error getting account:', error)
    }
  }

  const sendAccount = () => {
    const message = {
      type: 'TALK',
      roomId: route.params.roomId,
      sender: nickname,
      message: `${cheatMsg}\n계좌 : ${account}`,
    }
    websocketDispatch({ type: 'SEND', payload: message })
    setInputMessage('')

    setModalVisible(false)
  }

  const getRecommend = async () => {
    try {
      const response = await axios.get(
        'http://192.168.200.116:8080/chat/recommend?postId=1' /*+
          route.params.postId */
      )
      setRecommendations(response.data)
    } catch (error) {
      console.error('Error getRecommend:', error)
    }
  }

  const handleCheckboxClick = (index) => {
    setSelected(index)
    setRecSubModalVisible(true)
  }

  const sendRecommend = () => {
    if (selected !== null) {
      const selectedItem = recommendations[selected]
      const message = {
        type: 'TALK',
        roomId: route.params.roomId,
        sender: nickname,
        message: `${selectedItem.placeName}\nhttps://www.google.com/maps/search/?api=1&query=${selectedItem.placeLat},${selectedItem.placeLong}`,
      }
      websocketDispatch({ type: 'SEND', payload: message })
    }
    setModalVisible(false)
    setRecModalVisible(false)
    setRecSubModalVisible(false)
  }

  const handleCancel = () => {
    setSelected(null)
    setRecSubModalVisible(false)
  }

  const handleViewLocation = (latitude, longitude) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    Linking.openURL(url).catch((err) => console.error('An error occurred', err))
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>X</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat Room</Text>
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.messageSender}>{item.sender}</Text>
            <Text style={styles.messageText}>{item.message}</Text>
          </View>
        )}
        contentContainerStyle={styles.messageList}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.modalItem}>
                <Image
                  source={require('../assets/images/Icon/photo.png')}
                  style={styles.modalIcon}
                />
                <Text>사진</Text>
              </TouchableOpacity>
              {userId === 1 /*현재 post의 userId로 바꾸기*/ ? (
                <>
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={sendAccount}
                  >
                    <Image
                      source={require('../assets/images/Icon/account.png')}
                      style={styles.modalIcon}
                    />
                    <Text>계좌 보내기</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalItem}>
                    <Image
                      source={require('../assets/images/Icon/exit.png')}
                      style={styles.modalIcon}
                    />
                    <Text>강퇴</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setModalVisible(false)
                      navigation.navigate('Progress', {
                        postId: route.params.postId,
                        userId: route.params.userId,
                      })
                    }}
                  >
                    <Image
                      source={require('../assets/images/Icon/manage.png')}
                      style={styles.modalIcon}
                    />
                    <Text>진행 상황 관리</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setModalVisible(false)
                      setRecModalVisible(true)
                    }}
                  >
                    <Image
                      source={require('../assets/images/Icon/location.png')}
                      style={styles.modalIcon}
                    />
                    <Text>장소 추천</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={styles.modalItem}>
                  <Image
                    source={require('../assets/images/Icon/review.png')}
                    style={styles.modalIcon}
                  />
                  <Text>후기 등록</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.modalItem}>
                <Image
                  source={require('../assets/images/Icon/exit-chat.png')}
                  style={styles.modalIcon}
                />
                <Text>채팅방 나가기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={recModalVisible}
        onRequestClose={() => setRecModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>거래 장소 추천</Text>
            {recommendations.map((item, index) => (
              <View key={index} style={styles.item}>
                <Checkbox
                  value={selected === index}
                  onValueChange={() => handleCheckboxClick(index)}
                />
                <Text style={styles.itemText}> {item.placeName}</Text>
                <TouchableOpacity
                  style={styles.viewLocationButton}
                  onPress={() =>
                    handleViewLocation(item.placeLat, item.placeLong)
                  }
                >
                  <Text style={styles.viewLocationText}>위치 보기</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={recSubModalVisible}
          onRequestClose={handleCancel}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>이 장소로 하시겠습니까?</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={sendRecommend}>
                  <Text style={styles.buttonText}>확인</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleCancel}>
                  <Text style={styles.buttonText}>취소</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </Modal>
      <View style={styles.inputRow}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="메시지를 입력하세요"
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4C089',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#F4C089',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  messageList: {
    padding: 10,
  },
  messageContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  messageSender: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#fff',
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  addButtonText: {
    color: '#F4C089',
    fontSize: 24,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#000',
  },
  modalContent: {
    marginTop: 20,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
  },
  viewLocationButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  viewLocationText: {
    color: '#fff',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
})

export default ChatRoomScreen