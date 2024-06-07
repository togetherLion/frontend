import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Alarmlist = ({ navigation }) => {
  const [alarmData, setAlarmData] = useState([]);



  useEffect(() => {
    fetchAlarmData();
  }, []);

  const fetchAlarmData = async () => {
    try {
      const response = await axios.get('http://192.168.200.116:8080/alarm/list');
      const responseData = response.data.map(alarm => ({
        ...alarm,
        isRead: false // Initialize isRead as false
      }));
      setAlarmData(responseData);

      // Check AsyncStorage for saved read statuses
      const savedReadStatuses = await AsyncStorage.getItem('alarmReadStatuses');
      if (savedReadStatuses) {
        const parsedStatuses = JSON.parse(savedReadStatuses);
        // Update alarmData with saved read statuses
        setAlarmData(prevData =>
          prevData.map(item => ({
            ...item,
            isRead: parsedStatuses[item.alarmId] || false
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching alarm data:', error.response ? error.response.data : error.message);
      Alert.alert('알람 데이터 가져오기 실패', '오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const markAlarmAsRead = async (alarmId) => {
    try {
      // POST 요청으로 변경하고 alarmId를 URL에 추가
      await axios.post(`http://192.168.200.116:8080/alarm/check?alarmId=${alarmId}`);
    } catch (error) {
      console.error('Error marking alarm as read:', error.response ? error.response.data : error.message);
    }
  };


  const showAlarmDetails = async (alarmId) => {
    const alarm = alarmData.find(alarm => alarm.alarmId === alarmId);
    if (alarm) {
      const details = `${alarm.alarmMsg.replace(/\n/g, ' ')}\n날짜: ${new Date(alarm.alarmDate).toLocaleString()}`;
      Alert.alert('알람 상세 정보', details);

      // Mark the alarm as read
      const updatedAlarmData = alarmData.map(item =>
        item.alarmId === alarmId ? { ...item, isRead: true } : item
      );
      setAlarmData(updatedAlarmData);

      // Save updated read status to AsyncStorage
      const alarmReadStatuses = updatedAlarmData.reduce((acc, cur) => {
        acc[cur.alarmId] = cur.isRead;
        return acc;
      }, {});
      await AsyncStorage.setItem('alarmReadStatuses', JSON.stringify(alarmReadStatuses));

      // 알람 타입이 'POSTMODIFY', 'REQUEST', 'REQACCEPT', 'REQREJECT'일 때, connetId 대신 postId를 사용하여 게시글 상세 페이지로 이동
      if (['POSTMODIFY', 'REQUEST', 'REQACCEPT', 'REQREJECT', 'NEWPOST'].includes(alarm.alarmType)) {
        console.log('Navigating to PostDetail with postId:', alarm.connectId);
        navigation.navigate('PostDetail', { postId: alarm.connectId, userId : alarm.userId }); // postId 대신에 connectId 사용
      } else if (alarm.alarmType === 'CREATECHAT') {
        try {
            console.log("시도함");
            //console.log(alarm.connectId);
            const response = await axios.get(`http://192.168.200.116:8080/waitingdeal/check-chat-room/${alarm.connectId}`);
            //console.log(response.data);
            //console.log(response.data.roomId);
            //console.log(response.data.post.userId);
            //console.log(response.data.roomId);

            navigation.navigate('ChatRoom', { 
                userId: alarm.userId, 
                roomId: response.data.roomId, // response.data에서 roomId 접근
                postUserId: response.data.post.userId, // response.data에서 post.userId 접근
                postId: alarm.connectId // connectID의 철자 오류 수정
            });
        } catch (error) {
            console.error('Error fetching chat room:', error.response ? error.response.data : error.message);
        }
      }

      // Mark alarm as read on the server
      markAlarmAsRead(alarmId);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => showAlarmDetails(item.alarmId)}>
      <View style={styles.cardContent}>
        <Text style={styles.message}>{item.alarmMsg}</Text>
        {item.isRead ? null : <View style={styles.unreadDot} />}
      </View>
      <Text style={styles.date}>{new Date(item.alarmDate).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>알림함</Text>
      <FlatList
        data={alarmData}
        renderItem={renderItem}
        keyExtractor={(item) => item.alarmId.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  header: {
    marginTop: 15,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    //textAlign: 'center',
    color: '#333333',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
  },
  date: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
  },
});

export default Alarmlist;