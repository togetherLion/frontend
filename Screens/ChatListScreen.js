import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';

const ChatListScreen = ({ navigation, route }) => {

    const [userId, setUserId] = useState(route.params?.userId || '');



    const [chatData, setChatData] = useState([]); // 서버로부터 받아온 채팅 데이터를 저장할 상태

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://165.229.169.110:8080/chat/my');
                // 서버로부터 받아온 데이터를 상태에 저장
                setChatData(response.data.map(item => ({
                    ...item,
                    name: item.chatroomName // 예를 들어, 받아온 데이터의 chatroomName을 name으로 매핑
                })));
            } catch (error) {
                console.error("데이터를 가져오는 데 실패했습니다.", error);
            }
        };

        fetchData();
    }, []); // 컴포넌트가 마운트될 때 단 한 번 실행



    // const renderItem = ({ item }) => (


    //     <View style={styles.chatItem}>
    //         <Image source={require('../assets/balbadag.png')} style={styles.chatImage} />
    //         <View style={styles.chatDetails}>
    //             <Text style={styles.chatName}>{item.name}</Text>
    //             <Text style={styles.chatTime}>{item.time}</Text>

    //         </View>
    //     </View>
    // );




    const renderItem = ({ item }) => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ChatRoom', {
              userId: userId,          // 현재 사용자 id
              postId: item.postId,     // 게시글 id
              postUserId: item.userId, // 게시글 작성자 id
              roomId: item.roomId,     // 채팅방 uuid
              chatRoomId: item.ChatRoomId, // DB pk
            })
          }
        >
          <View style={styles.chatItem}>
            <Image source={require('../assets/balbadag.png')} style={styles.chatImage} />
            <View style={styles.chatDetails}>
              <Text style={styles.chatName}>{item.chatroomName}</Text>
              
            </View>
          </View>
        </TouchableOpacity>
      )
      

    return (


        <View style={styles.container}>


            {/* 여기에 빈 공간을 추가합니다. */}
            <View style={{ marginVertical: 20 }}></View>

            {/* 여기에 빈 공간을 추가합니다. */}
            <View style={{ marginVertical: 13 }}></View>


            <View style={styles.header}>
                <Text style={styles.headerTitle}>채팅</Text>

                {/* <TouchableOpacity>
          <MaterialIcons name="add" size={24} color="black" />
        </TouchableOpacity> */}

            </View>

            <View style={styles.tabBar}>
                <TouchableOpacity style={styles.tabItemActive}>
                    <Text style={styles.tabTextActive}>참여 중</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.tabItem}>
          <Text style={styles.tabText}>Participated</Text>
        </TouchableOpacity> */}
            </View>

            <FlatList
                data={chatData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                style={styles.chatList}
            />

            <View style={styles.bottomBar}>
                <TouchableOpacity onPress={() => navigation.navigate('PostListScreen', { userId: userId })} style={styles.bottomBarItem}>
                    <MaterialIcons name="home" size={24} color="#bbb" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('SearchScreen', { userId: userId })} style={styles.bottomBarItem}>
                    <MaterialIcons name="search" size={24} color="#bbb" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('ChatListScreen', { userId: userId })} style={styles.bottomBarItem}>
                    <MaterialIcons name="chat" size={24} color="#bbb" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('MyPage', { userId: userId })} style={styles.bottomBarItem}>
                    <MaterialIcons name="person" size={24} color="#bbb" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        marginLeft: 10,
        marginBottom: 5
    },
    tabBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    tabItem: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    tabItemActive: {
        paddingHorizontal: 16,
        paddingVertical: 7,
        borderBottomWidth: 3,
        borderBottomColor: '#ffb445ff',
    },
    tabText: {
        fontSize: 16,
        color: 'gray',
    },
    tabTextActive: {
        fontSize: 18,
        color: '#ffb445ff',
        //fontWeight: 'bold',
    },
    chatList: {
        flex: 1,
        padding: 16,
    },
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 15,
    },
    chatImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    chatDetails: {
        flex: 1,
    },
    chatName: {
        fontSize: 18,
        //fontWeight: 'bold',
        marginBottom: 11,
    },
    chatTime: {
        fontSize: 14,
        color: 'gray',
    },
    chatParticipants: {
        fontSize: 14,
        color: 'gray',
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 11,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        position: 'absolute',
        bottom: 15,
        left: 0,
        right: 0,
    },
    bottomBarItem: {
        alignItems: 'center',
    },
});

export default ChatListScreen;
