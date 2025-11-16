



// import React, { useState, useEffect } from 'react'
// import {
//   SafeAreaView,
//   FlatList,
//   Text,
//   TextInput,
//   Button,
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   Modal,
//   Image,
//   Linking,
// } from 'react-native'
// import WebSocketManager from '../WebSocketManager'
// import {
//   useWebSocketState,
//   useWebSocketDispatch,
// } from '../context/WebSocketContext'
// import { useMessageState, useMessageDispatch } from '../context/MessageContext'
// import axios from 'axios'
// import Checkbox from 'expo-checkbox'

// const ChatRoomScreen = ({ navigation, route }) => {
//   const userId = route.params.userId
//   const postId = route.params.postId
//   const postUserId = route.params.postUserId

//   const [roomId, setRoomId] = useState(null)
//   const [nickname, setNickname] = useState('')
//   const [account, setAccount] = useState('')
//   const [cheatMsg, setCheatMsg] = useState('')
//   const [inputMessage, setInputMessage] = useState('')
//   const [modalVisible, setModalVisible] = useState(false)

//   const [recommendations, setRecommendations] = useState([])
//   const [selected, setSelected] = useState(null)
//   const [recModalVisible, setRecModalVisible] = useState(false)
//   const [recSubModalVisible, setRecSubModalVisible] = useState(false)

//   const [hasEntered, setHasEntered] = useState(false) // ENTER 중복 방지

//   const { connected } = useWebSocketState()
//   const websocketDispatch = useWebSocketDispatch()

//   const messages = useMessageState()[route.params.roomId] || []
//   const messageDispatch = useMessageDispatch()

//   // ==================== 초기화 ====================
//   useEffect(() => {
//     const initialize = async () => {
//       try {
//         await getAccount()
//         await getNickname()
//         await getRecommend()

//         const response = await axios.get(
//           `http://172.30.1.81:8080/waitingdeal/check-chat-room/${postId}`
//         )
//         console.log('📌 chat room 응답:', response.data)
//         setRoomId(response.data.roomId)

//         if (!connected) {
//           websocketDispatch({
//             type: 'CONNECT',
//             payload: 'ws://172.30.1.81:8080/ws/chat',
//           })
//         }
//       } catch (error) {
//         console.error('Initialization error:', error)
//       }
//     }
//     initialize()
//   }, [postId])

//   // ==================== WebSocket 이벤트 ====================
//   useEffect(() => {
//     if (!WebSocketManager) return

//     const handleOpen = () => {
//       console.log('WebSocket connection opened')
//     }

//     const handleMessage = (message) => {
//       let parsed
//       try {
//         parsed = typeof message === 'string' ? JSON.parse(message) : message
//         messageDispatch({
//           type: 'ADD_MESSAGE',
//           roomId: parsed.roomId,
//           message: parsed,
//         })
//       } catch (err) {
//         console.error('메시지 파싱 오류:', err)
//       }
//     }

//     const handleError = (error) => console.error('WebSocket error:', error)
//     const handleClose = (code, reason) =>
//       console.log(`WebSocket closed with code ${code}, reason: ${reason}`)

//     WebSocketManager.on('open', handleOpen)
//     WebSocketManager.on('message', handleMessage)
//     WebSocketManager.on('error', handleError)
//     WebSocketManager.on('close', handleClose)

//     return () => {
//       WebSocketManager.off('open', handleOpen)
//       WebSocketManager.off('message', handleMessage)
//       WebSocketManager.off('error', handleError)
//       WebSocketManager.off('close', handleClose)
//     }
//   }, [])

//   // ==================== ENTER 메시지 전송 ====================
//   useEffect(() => {
//     if (roomId && nickname && connected && !hasEntered) {
//       console.log('✅ 방 입장:', roomId, nickname)
//       sendEnterMessage()
//       setHasEntered(true)
//     }
//   }, [roomId, nickname, connected, hasEntered])

//   // ==================== API ====================
//   const getNickname = async () => {
//     try {
//       const response = await axios.post(
//         'http://172.30.1.81:8080/user/userProfile',
//         { userId }
//       )
//       setNickname(response.data.nickname)
//     } catch (error) {
//       console.error('Error getting nickname:', error)
//     }
//   }

//   const getAccount = async () => {
//     try {
//       const response = await axios.get('http://172.30.1.81:8080/chat/account')
//       setCheatMsg(response.data.cheatMsg)
//       setAccount(response.data.account)
//     } catch (error) {
//       console.error('Error getting account:', error)
//     }
//   }

//   const getRecommend = async () => {
//     try {
//       const response = await axios.get('http://172.30.1.81:8080/chat/recommend', {
//         params: { postId },
//       })
//       setRecommendations(response.data)
//     } catch (error) {
//       console.error('Error getRecommend:', error)
//     }
//   }

//   // ==================== 메시지 전송 ====================
//   const sendEnterMessage = () => {
//     if (!roomId || !connected) return

//     const enterMessage = {
//       type: 'ENTER',
//       roomId,
//       sender: nickname,
//       message: '안녕하세요?',
//     }
//     websocketDispatch({ type: 'SEND', payload: enterMessage })
//   }

//   const sendMessage = () => {
//     if (!inputMessage.trim() || !roomId || !connected) return

//     const message = {
//       type: 'TALK',
//       roomId,
//       sender: nickname,
//       message: inputMessage,
//     }
//     websocketDispatch({ type: 'SEND', payload: message })
//     setInputMessage('')
//   }

//   const sendAccount = () => {
//     if (!roomId || !connected) return

//     const message = {
//       type: 'TALK',
//       roomId,
//       sender: nickname,
//       message: `${cheatMsg}\n계좌 : ${account}`,
//     }
//     websocketDispatch({ type: 'SEND', payload: message })
//     setModalVisible(false)
//     setInputMessage('')
//   }

//   const sendRecommend = () => {
//     if (!roomId || !connected || selected === null) return

//     const selectedItem = recommendations[selected]
//     const message = {
//       type: 'TALK',
//       roomId,
//       sender: nickname,
//       message: `${selectedItem.placeName}\nhttps://www.google.com/maps/search/?api=1&query=${selectedItem.placeLat},${selectedItem.placeLong}`,
//     }
//     websocketDispatch({ type: 'SEND', payload: message })
//     setModalVisible(false)
//     setRecModalVisible(false)
//     setRecSubModalVisible(false)
//     setSelected(null)
//   }

//   // ==================== 추천 장소 ====================
//   const handleCheckboxClick = (index) => {
//     setSelected(index)
//     setRecSubModalVisible(true)
//   }

//   const handleCancel = () => {
//     setSelected(null)
//     setRecSubModalVisible(false)
//   }

//   const handleViewLocation = (latitude, longitude) => {
//     const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
//     Linking.openURL(url).catch((err) => console.error(err))
//   }

//   // ==================== 렌더 ====================
//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}
//         >
//           <Text style={styles.backButtonText}>X</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Chat Room</Text>
//       </View>

//       <FlatList
//         data={messages}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.messageContainer}>
//             <Text style={styles.messageSender}>{item.sender}</Text>
//             <Text style={styles.messageText}>
//               {item.message.split('\n').map((line, idx) =>
//                 line.includes('https://www.google.com/maps/search') ? (
//                   <Text
//                     key={idx}
//                     style={styles.linkText}
//                     onPress={() => Linking.openURL(line)}
//                   >
//                     {line}
//                   </Text>
//                 ) : (
//                   <Text key={idx}>{line}</Text>
//                 )
//               )}
//             </Text>
//           </View>
//         )}
//         contentContainerStyle={styles.messageList}
//       />

//       {/* 모달 */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <TouchableOpacity
//               style={styles.closeButton}
//               onPress={() => setModalVisible(false)}
//             >
//               <Text style={styles.closeButtonText}>X</Text>
//             </TouchableOpacity>

//             <View style={styles.modalContent}>
//               <TouchableOpacity
//                 style={styles.modalItem}
//                 onPress={() => {
//                   setModalVisible(false)
//                   navigation.navigate('Progress', {
//                     postId,
//                     userId,
//                     postUserId,
//                   })
//                 }}
//               >
//                 <Image
//                   source={require('../assets/images/Icon/manage.png')}
//                   style={styles.modalIcon}
//                 />
//                 <Text>진행 상황</Text>
//               </TouchableOpacity>

//               {userId === postUserId && (
//                 <>
//                   <TouchableOpacity style={styles.modalItem} onPress={sendAccount}>
//                     <Image
//                       source={require('../assets/images/Icon/account.png')}
//                       style={styles.modalIcon}
//                     />
//                     <Text>계좌 보내기</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={styles.modalItem}
//                     onPress={() => {
//                       setModalVisible(false)
//                       setRecModalVisible(true)
//                     }}
//                   >
//                     <Image
//                       source={require('../assets/images/Icon/location.png')}
//                       style={styles.modalIcon}
//                     />
//                     <Text>장소 추천</Text>
//                   </TouchableOpacity>
//                 </>
//               )}
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* 장소 추천 모달 */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={recModalVisible}
//         onRequestClose={() => setRecModalVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.modalTitle}>거래 장소 추천</Text>
//             {recommendations.map((item, index) => (
//               <View key={index} style={styles.item}>
//                 <Checkbox
//                   value={selected === index}
//                   onValueChange={() => handleCheckboxClick(index)}
//                 />
//                 <Text style={styles.itemText}> {item.placeName}</Text>
//                 <TouchableOpacity
//                   style={styles.viewLocationButton}
//                   onPress={() => handleViewLocation(item.placeLat, item.placeLong)}
//                 >
//                   <Text style={styles.viewLocationText}>위치 보기</Text>
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </View>
//         </View>

//         {/* 추천 확인 모달 */}
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={recSubModalVisible}
//           onRequestClose={handleCancel}
//         >
//           <View style={styles.centeredView}>
//             <View style={styles.modalView}>
//               <Text style={styles.modalText}>이 장소로 하시겠습니까?</Text>
//               <View style={styles.buttonContainer}>
//                 <TouchableOpacity style={styles.button} onPress={sendRecommend}>
//                   <Text style={styles.buttonText}>확인</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity style={styles.button} onPress={handleCancel}>
//                   <Text style={styles.buttonText}>취소</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>
//       </Modal>

//       {/* 입력창 */}
//       <View style={styles.inputRow}>
//         <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
//           <Text style={styles.addButtonText}>+</Text>
//         </TouchableOpacity>
//         <TextInput
//           style={styles.input}
//           value={inputMessage}
//           onChangeText={setInputMessage}
//           placeholder="메시지를 입력하세요"
//         />
//         <Button title="Send" onPress={sendMessage} />
//       </View>
//     </SafeAreaView>
//   )
// }

// // ==================== 스타일 ====================
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F4C089' },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 10,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   backButton: { backgroundColor: '#fff', borderRadius: 5, padding: 10 },
//   backButtonText: { fontSize: 16, color: '#F4C089' },
//   headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
//   messageList: { padding: 10 },
//   messageContainer: {
//     marginBottom: 10,
//     padding: 10,
//     backgroundColor: '#fff',
//     borderRadius: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 2,
//   },
//   messageSender: { fontWeight: 'bold', marginBottom: 5 },
//   messageText: { fontSize: 16 },
//   addButton: {
//     backgroundColor: '#fff',
//     borderRadius: 50,
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 10,
//   },
//   addButtonText: { color: '#F4C089', fontSize: 24 },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContainer: { width: '80%', backgroundColor: '#fff', borderRadius: 10, padding: 20 },
//   closeButton: { alignSelf: 'flex-end' },
//   closeButtonText: { fontSize: 18, color: '#000' },
//   modalContent: { marginTop: 20 },
//   modalItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
//   modalIcon: { width: 30, height: 30, marginRight: 10 },
//   inputRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderTopWidth: 1,
//     borderTopColor: '#ddd',
//     padding: 10,
//     backgroundColor: '#fff',
//   },
//   input: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//     padding: 10,
//     marginRight: 10,
//     backgroundColor: '#fff',
//   },
//   item: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
//   itemText: { flex: 1, fontSize: 16 },
//   viewLocationButton: { padding: 10, backgroundColor: '#007bff', borderRadius: 5 },
//   viewLocationText: { color: '#fff' },
//   centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
//   modalView: { width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' },
//   modalText: { fontSize: 18, marginBottom: 20 },
//   buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
//   button: { flex: 1, marginHorizontal: 10, padding: 10, backgroundColor: '#007bff', borderRadius: 5, alignItems: 'center' },
//   buttonText: { color: '#fff' },
//   modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
//   linkText: { color: 'blue', textDecorationLine: 'underline' },
// })

// export default ChatRoomScreen




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
  const postId = route.params.postId
  const postUserId = route.params.postUserId

  const [roomId, setRoomId] = useState(null)
  const [nickname, setNickname] = useState('')
  const [account, setAccount] = useState('')
  const [cheatMsg, setCheatMsg] = useState('')
  const [inputMessage, setInputMessage] = useState('')
  const [modalVisible, setModalVisible] = useState(false)

  const [recommendations, setRecommendations] = useState([])
  const [selected, setSelected] = useState(null)
  const [recModalVisible, setRecModalVisible] = useState(false)
  const [recSubModalVisible, setRecSubModalVisible] = useState(false)

  const [hasEntered, setHasEntered] = useState(false)

  const { connected } = useWebSocketState()
  const websocketDispatch = useWebSocketDispatch()

  const messages = useMessageState()[route.params.roomId] || []
  const messageDispatch = useMessageDispatch()

  // ==================== 초기화 ====================
  useEffect(() => {
    const initialize = async () => {
      try {
        await getAccount()
        await getNickname()
        await getRecommend()

        const response = await axios.get(
          `http://172.30.1.81:8080/waitingdeal/check-chat-room/${postId}`
        )
        setRoomId(response.data.roomId)

        if (!connected) {
          websocketDispatch({
            type: 'CONNECT',
            payload: 'ws://172.30.1.81:8080/ws/chat',
          })
        }
      } catch (error) {
        console.error('Initialization error:', error)
      }
    }
    initialize()
  }, [postId])

  // ==================== WebSocket 이벤트 ====================
  useEffect(() => {
    if (!WebSocketManager) return

    const handleOpen = () => console.log('WebSocket connection opened')

    const handleMessage = (message) => {
      let parsed
      try {
        parsed = typeof message === 'string' ? JSON.parse(message) : message
        messageDispatch({
          type: 'ADD_MESSAGE',
          roomId: parsed.roomId,
          message: parsed,
        })
      } catch (err) {
        console.error('메시지 파싱 오류:', err)
      }
    }

    const handleError = (error) => console.error('WebSocket error:', error)
    const handleClose = (code, reason) =>
      console.log(`WebSocket closed with code ${code}, reason: ${reason}`)

    WebSocketManager.on('open', handleOpen)
    WebSocketManager.on('message', handleMessage)
    WebSocketManager.on('error', handleError)
    WebSocketManager.on('close', handleClose)

    return () => {
      WebSocketManager.off('open', handleOpen)
      WebSocketManager.off('message', handleMessage)
      WebSocketManager.off('error', handleError)
      WebSocketManager.off('close', handleClose)
    }
  }, [])

  // ==================== ENTER 메시지 전송 ====================
  useEffect(() => {
    if (roomId && nickname && connected && !hasEntered) {
      sendEnterMessage()
      setHasEntered(true)
    }
  }, [roomId, nickname, connected, hasEntered])

  // ==================== API ====================
  const getNickname = async () => {
    try {
      const response = await axios.post(
        'http://172.30.1.81:8080/user/userProfile',
        { userId }
      )
      setNickname(response.data.nickname)
    } catch (error) {
      console.error('Error getting nickname:', error)
    }
  }

  const getAccount = async () => {
    try {
      const response = await axios.get('http://172.30.1.81:8080/chat/account')
      setCheatMsg(response.data.cheatMsg)
      setAccount(response.data.account)
    } catch (error) {
      console.error('Error getting account:', error)
    }
  }

  const getRecommend = async () => {
    try {
      const response = await axios.get('http://172.30.1.81:8080/chat/recommend', {
        params: { postId },
      })
      setRecommendations(response.data)
    } catch (error) {
      console.error('Error getRecommend:', error)
    }
  }

  // ==================== 메시지 전송 ====================
  const sendEnterMessage = () => {
    if (!roomId || !connected) return

    const enterMessage = {
      type: 'ENTER',
      roomId,
      sender: nickname,
      message: '안녕하세요?',
    }
    websocketDispatch({ type: 'SEND', payload: enterMessage })
  }

  const sendMessage = () => {
    if (!inputMessage.trim() || !roomId || !connected) return

    const message = {
      type: 'TALK',
      roomId,
      sender: nickname,
      message: inputMessage,
    }
    websocketDispatch({ type: 'SEND', payload: message })
    setInputMessage('')
  }

  const sendAccount = () => {
    if (!roomId || !connected) return

    const message = {
      type: 'TALK',
      roomId,
      sender: nickname,
      message: `${cheatMsg}\n계좌 : ${account}`,
    }
    websocketDispatch({ type: 'SEND', payload: message })
    setModalVisible(false)
    setInputMessage('')
  }

  const sendRecommend = () => {
    if (!roomId || !connected || selected === null) return

    const selectedItem = recommendations[selected]
    const message = {
      type: 'TALK',
      roomId,
      sender: nickname,
      message: `${selectedItem.placeName}\nhttps://www.google.com/maps/search/?api=1&query=${selectedItem.placeLat},${selectedItem.placeLong}`,
    }
    websocketDispatch({ type: 'SEND', payload: message })
    setModalVisible(false)
    setRecModalVisible(false)
    setRecSubModalVisible(false)
    setSelected(null)
  }

  // ==================== 추천 장소 ====================
  const handleCheckboxClick = (index) => {
    setSelected(index)
    setRecSubModalVisible(true)
  }

  const handleCancel = () => {
    setSelected(null)
    setRecSubModalVisible(false)
  }

  const handleViewLocation = (latitude, longitude) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    Linking.openURL(url).catch((err) => console.error(err))
  }

  // ==================== 렌더 ====================
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
  renderItem={({ item }) => {
    const isMine = item.sender === nickname
    return (
      <View
        style={[
          styles.bubbleContainer,
          isMine ? styles.myBubbleContainer : styles.otherBubbleContainer,
        ]}
      >
        {!isMine && <Text style={styles.senderName}>{item.sender}</Text>}
        <View style={[styles.bubble, isMine ? styles.myBubble : styles.otherBubble]}>
          {item.message.split('\n').map((line, idx) =>
            line.includes('https://www.google.com/maps/search') ? (
              <Text
                key={idx}
                style={styles.linkText}
                onPress={() => Linking.openURL(line)}
              >
                {line}
              </Text>
            ) : (
              <Text key={idx} style={styles.messageText}>{line}</Text>
            )
          )}

          {/* 꼬리 */}
          {!isMine && (
            <View style={styles.otherBubbleTail} />
          )}
          {isMine && (
            <View style={styles.myBubbleTail} />
          )}
        </View>
      </View>
    )
  }}
  contentContainerStyle={{ padding: 10 }}
/>


      {/* 모달 */}
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
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setModalVisible(false)
                  navigation.navigate('Progress', {
                    postId,
                    userId,
                    postUserId,
                  })
                }}
              >
                <Image
                  source={require('../assets/images/Icon/manage.png')}
                  style={styles.modalIcon}
                />
                <Text>진행 상황</Text>
              </TouchableOpacity>

              {userId === postUserId && (
                <>
                  <TouchableOpacity style={styles.modalItem} onPress={sendAccount}>
                    <Image
                      source={require('../assets/images/Icon/account.png')}
                      style={styles.modalIcon}
                    />
                    <Text>계좌 보내기</Text>
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
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* 장소 추천 모달 */}
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
                  onPress={() => handleViewLocation(item.placeLat, item.placeLong)}
                >
                  <Text style={styles.viewLocationText}>위치 보기</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* 추천 확인 모달 */}
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

      {/* 입력창 */}
      <View style={styles.inputRow}>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
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

// ==================== 스타일 ====================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4C089' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: { backgroundColor: '#fff', borderRadius: 5, padding: 10 },
  backButtonText: { fontSize: 16, color: '#F4C089' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },

  // 말풍선 스타일
  bubbleContainer: { marginVertical: 5, maxWidth: '70%' },
  myBubbleContainer: { alignSelf: 'flex-end' },
  otherBubbleContainer: { alignSelf: 'flex-start' },
  senderName: { fontSize: 12, fontWeight: 'bold', marginBottom: 2 },
  bubble: { padding: 10, borderRadius: 15 },
  myBubble: { backgroundColor: '#fff', borderTopRightRadius: 0 },
  otherBubble: { backgroundColor: '#fff', borderTopLeftRadius: 0 },
  messageText: { fontSize: 16 },
  linkText: { color: 'blue', textDecorationLine: 'underline' },

  addButton: {
    backgroundColor: '#fff',
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  addButtonText: { color: '#F4C089', fontSize: 24 },

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

  // 모달
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: { width: '80%', backgroundColor: '#fff', borderRadius: 10, padding: 20 },
  closeButton: { alignSelf: 'flex-end' },
  closeButtonText: { fontSize: 18, color: '#000' },
  modalContent: { marginTop: 20 },
  modalItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  modalIcon: { width: 30, height: 30, marginRight: 10 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },

  item: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  itemText: { flex: 1, fontSize: 16 },
  viewLocationButton: { padding: 10, backgroundColor: '#007bff', borderRadius: 5 },
  viewLocationText: { color: '#fff' },

  centeredView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalView: { width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' },
  modalText: { fontSize: 18, marginBottom: 20 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  button: { flex: 1, marginHorizontal: 10, padding: 10, backgroundColor: '#007bff', borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#fff' },
})

export default ChatRoomScreen
