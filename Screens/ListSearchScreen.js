import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Alert, Modal, TextInput } from 'react-native';
import axios from 'axios';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';

const ListSearchScreen = ({ navigation, route }) => {
    const { posts, searchText } = route.params;

    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [userId, setUserId] = useState(route.params?.userId || '');
    const [recentSearches, setRecentSearches] = useState([]);

    const handleNotificationPress = () => {
        setModalMessage('알림함으로 이동 하시겠습니까?');
        setModalVisible(true);
    };

    const confirmAction = () => {
        setModalVisible(false);
        navigation.navigate('Alarmlist');
    };

    const addRecentSearch = (text) => {
        if (text && !recentSearches.includes(text)) {
            setRecentSearches([...recentSearches, text]);
        }
    };

    const toggleFavorite = (postId) => {
        // 즐겨찾기 토글 로직 추가
    };

    const PostListItem = ({ post }) => (
        <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { postId: post.postId, userId })}>
            <View style={styles.postItem}>
                <View style={styles.iconContainer}>
                    {post.postPicture ? (
                        <Image source={{ uri: post.postPicture }} style={styles.postImage} />
                    ) : (
                        <Text>No Image</Text>
                    )}
                </View>
                <View style={styles.postContent}>
                    <Text style={styles.postTitle}>{post.productName}</Text>
                    <View style={styles.postInfo}>
                        <Text style={styles.postAuthor}>{post.author}</Text>
                        <Text style={styles.postLocation}>{post.location}</Text>
                        <Text style={styles.postDeadline}>{post.deadlineDate}</Text>
                    </View>
                    {post.additionalInfo && <Text style={styles.additionalInfo}>{post.additionalInfo}</Text>}
                </View>
                <TouchableOpacity onPress={() => toggleFavorite(post.id)}>
                    <Text>Favorite</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={{ marginVertical: 20 }}></View>

            <View style={styles.header}>
                <Text style={styles.title}>
                    <Text style={styles.searchText}>{searchText}</Text>
                    <Text style={styles.normalText}> 검색하셨어요.</Text>
                </Text>
                <TouchableOpacity style={styles.notificationIcon} onPress={handleNotificationPress}>
                    <Image source={require('../assets/balbadag.png')} style={styles.logo} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={posts}
                renderItem={({ item }) => <PostListItem post={item} />}
                keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
                contentContainerStyle={{ paddingBottom: 47 }}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>{modalMessage}</Text>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={confirmAction}>
                                <Text style={styles.closeButtonText}>예</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={() => setModalVisible(false)}>
                                <Text style={styles.closeButtonText}>아니오</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={styles.bottomBar}>
                <TouchableOpacity onPress={() => navigation.navigate('PostListScreen', { userId })} style={styles.bottomBarItem}>
                    <MaterialIcons name="home" size={24} color="#bbb" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('SearchScreen', { userId })} style={styles.bottomBarItem}>
                    <MaterialIcons name="search" size={24} color="#bbb" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('ChatListScreen', { userId })} style={styles.bottomBarItem}>
                    <MaterialIcons name="chat" size={24} color="#bbb" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('MyPage', { userId })} style={styles.bottomBarItem}>
                    <MaterialIcons name="person" size={24} color="#bbb" />
                </TouchableOpacity>
            </View>
        </View>
    );

}

const styles = StyleSheet.create({

    header: {
        flexDirection: 'row',
        //alignContent: 'center',

        //justifyContent: 'space-between',
        width: '100%',
        padding: 7,
        marginTop: 25,
        marginLeft: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },

    logo: {
        width: 40,
        height: 40,
        //marginBottom: 20,
    },
    title: {

    },

    searchText: {
        color: 'black', // 검색어에 대한 스타일
        fontWeight: 'bold',
        fontSize: 40,

    },

    colorText: {
        color: '#ffcc80',
        fontWeight: 'bold',
        fontSize: 40,

    },
    normalText: {
        color: 'black', // "를 검색하셨어요"에 대한 스타일
        fontSize: 22,
        color: '#555'
    },

    container2: {
        flexDirection: 'row', // 아이콘과 입력 필드를 가로로 정렬
        alignItems: 'center', // 요소들을 세로로 가운데 정렬
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
        marginLeft: 10
    },

    icon: {
        marginRight: 10, // 아이콘과 입력 필드 사이의 간격
    },
    searchInput: {
        flex: 1, // 남은 공간을 모두 차지
        fontSize: 15,
    },


    container: {
        padding: 5,
        flex: 1,
        backgroundColor: 'white',

    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        padding: 15,
        marginTop: 10,
        marginLeft: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 100,
        marginRight: 16,
        overflow: 'hidden',
        backgroundColor: 'white',
    },
    postItem: {
        flexDirection: 'row',
        marginTop: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    postImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 14,
    },
    postContent: {
        flex: 1,
    },
    postTitle: {
        fontSize: 16,
        //fontWeight: 'bold',
        marginBottom: 4,
    },
    postInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    postAuthor: {
        fontSize: 12,
        color: '#bbb',
    },
    postLocation: {
        fontSize: 12,
        color: '#bbb',
    },
    postDeadline: {
        fontSize: 12,
        color: '#bbb',
    },
    additionalInfo: {
        fontSize: 16,
        color: '#F4C293',
    },
    title: {
        fontSize: 27,
        fontWeight: 'bold',
        //color : '#ffcc80',
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
        bottom: 0,
        left: 0,
        right: 0,
    },

    bottomBarItem: {
        flex: 1,
        alignItems: 'center',
        color: '#ffcc80',
    },

    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
    },
    closeButton: {
        backgroundColor: '#fff',
        //marginTop: 10,
        width: '50%',
    },
    closeButtonText: {
        color: '#000',
        fontSize: 17,
        fontWeight: 'bold',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: 'row', // 버튼을 수평으로 배치
    },
    button: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        marginHorizontal: 5, // 버튼 사이 간격 추가
        backgroundColor: '#2196F3',
    },
    createButton: {
        position: 'absolute',
        bottom: 70,
        right: 20,
        backgroundColor: 'white',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 12,
    },

    divider: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 13,
        marginBottom: 20,
    },

});




export default ListSearchScreen;