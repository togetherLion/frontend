import React, { useState, useEffect } from 'react'
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native'
import { Avatar } from 'react-native-elements'
import axios from 'axios'
// 예시 데이터

const Following = ({ route }) => {
  const [userData, setUserData] = useState([])
  const [userId, setUserId] = useState(route.params?.userId || '')

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://192.168.200.142:8080/user/following/${userId}`
        )
        setUserData(response.data)
        // console.log(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>팔로잉 목록</Text>
      </View>
      <ScrollView>
        {userData.map((user) => (
          <View key={user.userId} style={styles.profileItem}>
            <Avatar
              size={70}
              rounded
              source={{ uri: user.profilePicture }}
              containerStyle={styles.avatar}
            />
            <Text style={styles.nickname}>{user.nickname}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 50,
    flexDirection: 'row',
    //alignItems: 'center',
    //justifyContent: 'space-between',
    //padding: 20,
    marginBottom: 50,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25, // 동그랗게 만들기 위해 반지름을 절반으로 설정
    marginRight: 15,
  },
  nickname: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
  },
})

export default Following
