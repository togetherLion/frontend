import React, { useState, useEffect } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import axios from 'axios'

const WaitingTableScreen = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState('pending')

  const [pendingUserData, setPendingUserData] = useState([])
  const [acceptedUserData, setAcceptedUserData] = useState([])
  // const postId = route.params.postId
  // const pendingURL = 'http://localhost:8080/waitingdeal/userpending/' + postId // 상품 상세 페이지에서 postId 받아오기

  useEffect(() => {
    // 페이지가 로드될 때 닉네임을 불러오는 함수 호출
    fetchPendingUser()
    fetchAcceptedUser()
  }, [])

  const fetchPendingUser = async () => {
    try {
      const response = await axios.get(
        'http://192.168.200.142:8080/waitingdeal/userpending/1' /* + postId*/
      )

      const data = response.data
      setPendingUserData(data)
    } catch (error) {
      console.error('Error fetching nickname:', error)
    }
  }

  const fetchAcceptedUser = async () => {
    try {
      const response = await axios.get(
        'http://192.168.200.142:8080/waitingdeal/useraccepted/1' /* + postId*/
      )

      const data = response.data
      setAcceptedUserData(data)
    } catch (error) {
      console.error('Error fetching nickname:', error)
    }
  }

  const acceptDeal = async (userId, postId) => {
    try {
      console.log(userId)
      console.log(postId)
      await axios.put(
        'http://192.168.200.142:8080/waitingdeal/accept?' +
          'userId=' +
          userId +
          '&postId=' +
          postId
      )
      // 요청이 성공하면 상태 업데이트
      const acceptedUser = pendingUserData.find(
        (user) => user.userId === userId
      )
      setPendingUserData(
        pendingUserData.filter((user) => user.userId !== userId)
      )
      setAcceptedUserData([...acceptedUserData, acceptedUser])
    } catch (error) {
      console.error('Error sending acceptDeal:', error)
    }
  }

  const rejectDeal = async (userId, postId) => {
    try {
      console.log(userId)
      console.log(postId)
      await axios.put(
        'http://192.168.200.142:8080/waitingdeal/reject?' +
          'userId=' +
          userId +
          '&postId=' +
          postId
      )
      // 요청이 성공하면 상태 업데이트
      setPendingUserData(
        pendingUserData.filter((user) => user.userId !== userId)
      )
    } catch (error) {
      console.error('Error sending rejectDeal:', error)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ChatButton', { userId: route.params.userId })
          }
          style={styles.backIcon}
        >
          <Text style={styles.backIconText}>X</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'pending' && styles.activeTabText,
            ]}
          >
            대기중인 사용자
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'accepted' && styles.activeTab]}
          onPress={() => setActiveTab('accepted')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'accepted' && styles.activeTabText,
            ]}
          >
            수락된 사용자
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>
        {activeTab === 'pending' &&
          pendingUserData.map((user, index) => (
            <View style={styles.scrollViewItem} key={index}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('UserProfile', { userId: user.userId })
                }
              >
                <Text style={styles.waitingItem}>{user.nickname}</Text>
              </TouchableOpacity>
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => acceptDeal(user.userId, 1)}
                >
                  <Text style={styles.acceptButtonText}>수락</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => rejectDeal(user.userId, 1)}
                >
                  <Text style={styles.acceptButtonText}>거절</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        {activeTab === 'accepted' &&
          acceptedUserData.map((user, index) => (
            <View style={styles.scrollViewItem} key={index}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('UserProfile', { userId: user.userId })
                }
              >
                <Text style={styles.waitingItem}>{user.nickname}</Text>
              </TouchableOpacity>
              {/* 필요한 경우 '수락 취소' 버튼 등을 여기에 추가 */}
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF4E1', // 연한 배경색
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F4C089', // 테마 색상
  },
  backIcon: {
    padding: 10,
  },
  backIconText: {
    color: '#fff',
    fontSize: 18,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#FFE5B4', // 연한 배경색
  },
  tabItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20, // 둥근 모서리
  },
  activeTab: {
    backgroundColor: '#F4C089', // 테마 색상
  },
  tabText: {
    color: '#F4C089',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#FFF4E1', // 밝은 색 텍스트
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  waitingItem: {
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#F4C089',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 5, // 버튼 사이에 공간이 없도록 설정
  },
  rejectButton: {
    backgroundColor: '#D1180B',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 14,
  },
})

export default WaitingTableScreen
