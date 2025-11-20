// // import React, { useState, useEffect } from 'react';
// // import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Alert, Modal } from 'react-native';
// // import { Avatar } from 'react-native-elements';
// // import { MaterialIcons, Ionicons } from '@expo/vector-icons';
// // import axios from 'axios';

// // const PostListScreen = ({ navigation, route }) => {

// //     const [modalVisible, setModalVisible] = useState(false);
// //     const [modalMessage, setModalMessage] = useState('');
// //     const [townName, setTownName] = useState('');
// //     const [userId, setUserId] = useState(route.params?.userId || '');
// //     const [posts, setPosts] = useState([]);
// //     const [loading, setLoading] = useState(true);

// //     useEffect(() => {
// //         const unsubscribe = navigation.addListener('focus', () => {
// //             getPostList();
// //         });
// //         return unsubscribe;
// //     }, [navigation]);

// //     async function getPostList() {
// //         try {
// //             const resp = await axios.get("http://165.229.169.110:8080/posts/region")

// //             if (resp.data !== null && resp.data !== "") {
// //                 //console.log(resp.data);
// //                 setTownName(resp.data.townName);
// //                 setPosts(resp.data.posts);
// //             }
// //         } catch (err) {
// //             console.log(`에러 메시지: ${err}`);
// //         } finally {
// //             setLoading(false); // 로딩 상태 갱신
// //         }
// //     }

// //     const handleItemPress = (item) => {
// //         Alert.alert('Item Pressed', `You pressed item: ${item.title}`);
// //     };

// //     const handleNotificationPress = () => {
// //         setModalMessage('알림함으로 이동 하시겠습니까?');
// //         setModalVisible(true);
// //     };

// //     const confirmAction = () => {
// //         setModalVisible(false);
// //         navigation.navigate('Alarmlist', {userId : userId});

// //     };

    


// //     const PostListItem = ({ post }) => (
// //         <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { postId: post.postRes.postId, userId: userId })}>
// //             <View style={styles.postItem}>
// //                 <View style={styles.iconContainer}>
// //                     {post.postRes.postPicture ? (
// //                         <Image source={{ uri: post.postRes.postPicture }} style={styles.postImage} />
// //                     ) : (
// //                         <Text>No Image</Text>
// //                     )}
// //                 </View>
// //                 <View style={styles.postContent}>
// //                     <Text style={styles.postTitle}>{post.postRes.productName}</Text>
// //                     <View style={styles.postInfo}>
// //                         <Text style={styles.postAuthor}>{post.postRes.author}</Text>
// //                         <Text style={styles.postLocation}>{post.postRes.location}</Text>
// //                         <Text style={styles.postDeadline}>{post.postRes.deadlineDate}</Text>
// //                     </View>
// //                     {post.additionalInfo && <Text style={styles.additionalInfo}>{post.postRes.additionalInfo}</Text>}
// //                 </View>
 
// //             </View>
// //         </TouchableOpacity>
// //     );

// //     if (loading) {
// //         return null; // 로딩 중일 때는 화면에 아무것도 렌더링하지 않음
// //     }

// //     return (
// //         <View style={styles.container}>
// //             <View style={styles.header}>
// //                 <Image source={require('../assets/balbadag.png')} style={styles.logo} />
// //                 <Text style={styles.title}>  {townName}</Text>
// //                 <TouchableOpacity style={styles.notificationIcon} onPress={() => handleNotificationPress()}>
// //                     <MaterialIcons name="mail-outline" size={30} color="#ffcc80" marginRight={8} marginTop={6} />
// //                 </TouchableOpacity>
// //             </View>
// //             <FlatList
// //                 data={posts}
// //                 renderItem={({ item }) => <PostListItem post={item} />}
// //                 keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
// //                 contentContainerStyle={{ paddingBottom: 47 }} // 하단바 높이만큼 패딩을 추가합니다.
// //             />
// //             <Modal
// //                 animationType="slide"
// //                 transparent={true}
// //                 visible={modalVisible}
// //                 onRequestClose={() => setModalVisible(false)}
// //             >
// //                 <View style={styles.modalBackground}>
// //                     <View style={styles.modalContainer}>
// //                         <Text style={styles.modalText}>{modalMessage}</Text>
// //                         <View style={styles.buttonRow}>
// //                             <TouchableOpacity
// //                                 style={[styles.button, styles.closeButton]}
// //                                 onPress={confirmAction}
// //                             >
// //                                 <Text style={styles.closeButtonText}>예</Text>
// //                             </TouchableOpacity>
// //                             <TouchableOpacity
// //                                 style={[styles.button, styles.closeButton]}
// //                                 onPress={() => setModalVisible(false)}
// //                             >
// //                                 <Text style={styles.closeButtonText}>아니오</Text>
// //                             </TouchableOpacity>
// //                         </View>
// //                     </View>
// //                 </View>
// //             </Modal>

// //             <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('PostCreateScreen')}>
// //                 <Ionicons name="pencil" size={24} color="black" />
// //             </TouchableOpacity>

// //             <View style={styles.bottomBar}>
// //                 <TouchableOpacity onPress={() => navigation.navigate('PostListScreen', { userId: userId })}style={styles.bottomBarItem}>
// //                     <MaterialIcons name="home" size={24} color="#bbb" />
// //                 </TouchableOpacity>
// //                 <TouchableOpacity onPress={() => navigation.navigate('SearchScreen', { userId: userId })} style={styles.bottomBarItem}>
// //                     <MaterialIcons name="search" size={24} color="#bbb" />
// //                 </TouchableOpacity>
// //                 <TouchableOpacity  onPress={() => navigation.navigate('ChatListScreen', { userId: userId })} style={styles.bottomBarItem}>
// //                     <MaterialIcons name="chat" size={24} color="#bbb" />
// //                 </TouchableOpacity>
// //                 <TouchableOpacity onPress={() => navigation.navigate('MyPage', { userId: userId })} style={styles.bottomBarItem}>
// //                     <MaterialIcons name="person" size={24} color="#bbb" />
// //                 </TouchableOpacity>
// //             </View>

// //         </View>
// //     );
// // };

// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //         backgroundColor: 'white',
// //     },
// //     header: {
// //         flexDirection: 'row',
// //         //alignContent: 'center',
        
// //         //justifyContent: 'space-between',
// //         width: '100%',
// //         padding: 7,
// //         marginTop: 25,
// //         marginLeft: 5,
// //         borderBottomWidth: 1,
// //         borderBottomColor: '#eee',
// //     },
// //     iconContainer: {
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         width: 100,
// //         height: 100,
// //         marginRight: 16,
// //         overflow: 'hidden',
// //         //backgroundColor: '#007AFF',
// //     },
// //     postItem: {
// //         flexDirection: 'row',
// //         marginTop: 12,
// //         borderBottomWidth: 1,
// //         borderBottomColor: '#eee',
// //         paddingHorizontal: 16,
// //         paddingBottom: 12,
// //     },
// //     postImage: {
// //         width: '100%',
// //         height: '100%',
// //         resizeMode: 'cover',
// //         borderRadius: 14,
// //     },
// //     postContent: {
// //         flex: 1,
// //     },
// //     postTitle: {
// //         fontSize: 16,
// //         //fontWeight: 'bold',
// //         marginBottom: 4,
// //     },
// //     postInfo: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //     },
// //     postAuthor: {
// //         fontSize: 12,
// //         color: '#bbb',
// //     },
// //     postLocation: {
// //         fontSize: 12,
// //         color: '#bbb',
// //     },
// //     postDeadline: {
// //         fontSize: 12,
// //         color: '#bbb',
// //     },
// //     additionalInfo: {
// //         fontSize: 16,
// //         color: '#F4C293',
// //     },
// //     title: {
// //         fontSize: 27,
// //         fontWeight: 'bold',
// //         //color : '#ffcc80',
// //     },
// //     bottomBar: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-around',
// //         alignItems: 'center',
// //         backgroundColor: 'white',
// //         paddingVertical: 11,
// //         borderTopWidth: 1,
// //         borderTopColor: '#ddd',
// //         position: 'absolute',
// //         bottom: 0,
// //         left: 0,
// //         right: 0,
// //     },
// //     bottomBarItem: {
// //         flex: 1,
// //         alignItems: 'center',
// //         color: '#ffcc80',
// //     },
// //     modalBackground: {
// //         flex: 1,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         backgroundColor: 'rgba(0, 0, 0, 0.5)',
// //     },
// //     modalContainer: {
// //         width: '80%',
// //         backgroundColor: 'white',
// //         borderRadius: 10,
// //         padding: 20,
// //         alignItems: 'center',
// //     },
// //     modalText: {
// //         fontSize: 16,
// //         marginBottom: 10,
// //     },
// //     closeButton: {
// //         backgroundColor: '#fff',
// //         //marginTop: 10,
// //         width: '50%',
// //     },
// //     closeButtonText: {
// //         color: '#000',
// //         fontSize: 17,
// //         fontWeight: 'bold',
// //     },
// //     modalText: {
// //         fontSize: 16,
// //         marginBottom: 10,
// //     },
// //     buttonRow: {
// //         flexDirection: 'row', // 버튼을 수평으로 배치
// //     },
// //     button: {
// //         flex: 1,
// //         padding: 10,
// //         alignItems: 'center',
// //         borderRadius: 5,
// //         marginHorizontal: 5, // 버튼 사이 간격 추가
// //         backgroundColor: '#2196F3',
// //     },
// //     createButton: {
// //         position: 'absolute',
// //         bottom: 70,
// //         right: 20,
// //         backgroundColor: 'white',
// //         width: 60,
// //         height: 60,
// //         borderRadius: 30,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //         elevation: 12,
// //     },
// //     logo: {
// //         width: 40,
// //         height: 40,
// //         //marginBottom: 20,
// //     },
// //     notificationIcon: {
// //         position: 'absolute',
// //         right: 20,
// //         marginTop: 8,
// //     },
// // });

// // export default PostListScreen;

// import React, { useState, useEffect, useCallback, memo } from 'react';
// import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Modal } from 'react-native';
// import { MaterialIcons, Ionicons } from '@expo/vector-icons';
// import axios from 'axios';

// const PostListScreen = ({ navigation, route }) => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalMessage, setModalMessage] = useState('');
//   const [townName, setTownName] = useState('');
//   const [userId, setUserId] = useState(route.params?.userId || '');
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // 날짜 포맷 함수 (YYYY.MM.DD)
//   const formatDate = useCallback((dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return '';
//     const y = date.getFullYear();
//     const m = String(date.getMonth() + 1).padStart(2, '0');
//     const d = String(date.getDate()).padStart(2, '0');
//     return `${y}.${m}.${d}`;
//   }, []);

//   async function getPostList() {
//     const start = Date.now();
//     setLoading(true);
//     try {
//       const resp = await axios.get('http://165.229.169.110:8080/posts/region', { timeout: 8000 });
//       if (resp?.data) {
//         setTownName(resp.data.townName);
//         setPosts(resp.data.posts ?? []);
//       }
//     } catch (err) {
//       console.log('에러 메시지:', err?.message || err);
//     } finally {
//       setLoading(false);
//       console.log('목록 요청 소요(ms):', Date.now() - start);
//     }
//   }

//   // 화면 포커스될 때 데이터 로딩 (빈 리스트일 때만 재호출하여 과도한 호출 방지)
//   useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', () => {
//       if (posts.length === 0) getPostList();
//     });
//     return unsubscribe;
//   }, [navigation, posts.length]);

//   const handleNotificationPress = () => {
//     setModalMessage('알림함으로 이동 하시겠습니까?');
//     setModalVisible(true);
//   };

//   const confirmAction = () => {
//     setModalVisible(false);
//     navigation.navigate('Alarmlist', { userId });
//   };

//   // 아이템 컴포넌트 (메모이제이션)
//   const PostListItem = memo(({ post, onPress }) => (
//     <TouchableOpacity onPress={onPress}>
//       <View style={styles.postItem}>
//         <View style={styles.iconContainer}>
//           {post?.postRes?.postPicture ? (
//             <Image source={{ uri: post.postRes.postPicture }} style={styles.postImage} />
//           ) : (
//             <Text>No Image</Text>
//           )}
//         </View>
//         <View style={styles.postContent}>
//           <Text style={styles.postTitle}>{post?.postRes?.productName ?? ''}</Text>
//           <View style={styles.postInfo}>
//             <Text style={styles.postAuthor}>{post?.postRes?.author ?? ''}</Text>
//             <Text style={styles.postLocation}>{post?.postRes?.location ?? ''}</Text>
//             <Text style={styles.postDeadline}>{formatDate(post?.postRes?.deadlineDate)}</Text>
//           </View>
//           {post?.additionalInfo && (
//             <Text style={styles.additionalInfo}>{post.postRes.additionalInfo}</Text>
//           )}
//         </View>
//       </View>
//     </TouchableOpacity>
//   ));

//   // renderItem 메모이제이션
//   const renderItem = useCallback(
//     ({ item }) => (
//       <PostListItem
//         post={item}
//         onPress={() =>
//           navigation.navigate('PostDetail', {
//             postId: item?.postRes?.postId,
//             userId,
//           })
//         }
//       />
//     ),
//     [navigation, userId, formatDate]
//   );

//   // 고정 높이(대략치)로 getItemLayout 제공 → 스크롤 성능 향상
//   const getItemLayout = useCallback((data, index) => {
//     const ITEM_HEIGHT = 124; // 이미지(100) + 상하 패딩/마진 대략값
//     return { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index };
//   }, []);

//   if (loading) return null;

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Image source={require('../assets/balbadag.png')} style={styles.logo} />
//         <Text style={styles.title}>  {townName}</Text>
//         <TouchableOpacity style={styles.notificationIcon} onPress={handleNotificationPress}>
//           <MaterialIcons name="mail-outline" size={30} color="#ffcc80" marginRight={8} marginTop={6} />
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         data={posts}
//         renderItem={renderItem}
//         keyExtractor={(item, index) => {
//           const stable =
//             item?.postRes?.postId ??
//             item?.id ??
//             index; // 반드시 고정된 값 사용 (Math.random() 금지)
//           return String(stable);
//         }}
//         initialNumToRender={8}
//         maxToRenderPerBatch={8}
//         windowSize={10}
//         removeClippedSubviews
//         getItemLayout={getItemLayout}
//         contentContainerStyle={{ paddingBottom: 47 }}
//       />

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalBackground}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.modalText}>{modalMessage}</Text>
//             <View style={styles.buttonRow}>
//               <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={confirmAction}>
//                 <Text style={styles.closeButtonText}>예</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.button, styles.closeButton]}
//                 onPress={() => setModalVisible(false)}
//               >
//                 <Text style={styles.closeButtonText}>아니오</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('PostCreateScreen')}>
//         <Ionicons name="pencil" size={24} color="black" />
//       </TouchableOpacity>

//       <View style={styles.bottomBar}>
//         <TouchableOpacity onPress={() => navigation.navigate('PostListScreen', { userId })} style={styles.bottomBarItem}>
//           <MaterialIcons name="home" size={24} color="#bbb" />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => navigation.navigate('SearchScreen', { userId })} style={styles.bottomBarItem}>
//           <MaterialIcons name="search" size={24} color="#bbb" />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => navigation.navigate('ChatListScreen', { userId })} style={styles.bottomBarItem}>
//           <MaterialIcons name="chat" size={24} color="#bbb" />
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => navigation.navigate('MyPage', { userId })} style={styles.bottomBarItem}>
//           <MaterialIcons name="person" size={24} color="#bbb" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: 'white' },
//   header: {
//     flexDirection: 'row',
//     width: '100%',
//     padding: 7,
//     marginTop: 25,
//     marginLeft: 5,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   iconContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: 100,
//     height: 100,
//     marginRight: 16,
//     overflow: 'hidden',
//   },
//   postItem: {
//     flexDirection: 'row',
//     marginTop: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//     paddingHorizontal: 16,
//     paddingBottom: 12,
//   },
//   postImage: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//     borderRadius: 14,
//   },
//   postContent: { flex: 1 },
//   postTitle: { fontSize: 16, marginBottom: 4 },
//   postInfo: { flexDirection: 'row', justifyContent: 'space-between' },
//   postAuthor: { fontSize: 12, color: '#bbb' },
//   postLocation: { fontSize: 12, color: '#bbb' },
//   postDeadline: { fontSize: 12, color: '#bbb' },
//   additionalInfo: { fontSize: 16, color: '#F4C293' },
//   title: { fontSize: 27, fontWeight: 'bold' },
//   bottomBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     paddingVertical: 11,
//     borderTopWidth: 1,
//     borderTopColor: '#ddd',
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//   },
//   bottomBarItem: { flex: 1, alignItems: 'center' },
//   modalBackground: {
//     flex: 1, justifyContent: 'center', alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContainer: {
//     width: '80%', backgroundColor: 'white', borderRadius: 10,
//     padding: 20, alignItems: 'center',
//   },
//   modalText: { fontSize: 16, marginBottom: 10 },
//   closeButton: { backgroundColor: '#fff', width: '50%' },
//   closeButtonText: { color: '#000', fontSize: 17, fontWeight: 'bold' },
//   buttonRow: { flexDirection: 'row' },
//   button: {
//     flex: 1, padding: 10, alignItems: 'center',
//     borderRadius: 5, marginHorizontal: 5, backgroundColor: '#2196F3',
//   },
//   createButton: {
//     position: 'absolute',
//     bottom: 70, right: 20, backgroundColor: 'white',
//     width: 60, height: 60, borderRadius: 30,
//     justifyContent: 'center', alignItems: 'center', elevation: 12,
//   },
//   logo: { width: 40, height: 40 },
//   notificationIcon: { position: 'absolute', right: 20, marginTop: 8 },
// });

// export default PostListScreen;

import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Modal, RefreshControl
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const SERVER_URL = 'http://165.229.169.110:8080'; // ✅ 한 곳에서 관리
const REGION_URL = `${SERVER_URL}/posts/region`;

const PostListScreen = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [townName, setTownName] = useState('');
  const [userId, setUserId] = useState(route.params?.userId || '');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pull-to-refresh
  const [refreshing, setRefreshing] = useState(false);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}.${m}.${d}`;
  }, []);

  const getPostList = useCallback(async () => {
    const start = Date.now();
    setLoading(true);
    try {
      const resp = await axios.get(REGION_URL, { timeout: 8000 });
      if (resp?.data) {
        setTownName(resp.data.townName);
        setPosts(resp.data.posts ?? []);
      }
    } catch (err) {
      console.log('에러 메시지:', err?.message || err);
    } finally {
      setLoading(false);
      console.log('목록 요청 소요(ms):', Date.now() - start);
    }
  }, []);

  // ✅ 화면 포커스될 때마다 항상 재조회
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getPostList();
    });
    return unsubscribe;
  }, [navigation, getPostList]);

  // ✅ 작성화면에서 돌아올 때 파라미터 트리거로도 재조회(옵션)
  useEffect(() => {
    if (route.params?.refreshTs) {
      getPostList();
    }
  }, [route.params?.refreshTs, getPostList]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getPostList();
    setRefreshing(false);
  }, [getPostList]);

  const handleNotificationPress = () => {
    setModalMessage('알림함으로 이동 하시겠습니까?');
    setModalVisible(true);
  };

  const confirmAction = () => {
    setModalVisible(false);
    navigation.navigate('Alarmlist', { userId });
  };

  const PostListItem = memo(({ post, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.postItem}>
        <View style={styles.iconContainer}>
          {post?.postRes?.postPicture ? (
            <Image
              source={{ uri: post.postRes.postPicture }}
              style={styles.postImage}
            />
          ) : (
            <Text>No Image</Text>
          )}
        </View>
        <View style={styles.postContent}>
          <Text style={styles.postTitle}>{post?.postRes?.productName ?? ''}</Text>
          <View style={styles.postInfo}>
            <Text style={styles.postAuthor}>{post?.postRes?.author ?? ''}</Text>
            <Text style={styles.postLocation}>{post?.postRes?.location ?? ''}</Text>
            <Text style={styles.postDeadline}>{formatDate(post?.postRes?.deadlineDate)}</Text>
          </View>
          {post?.additionalInfo && (
            <Text style={styles.additionalInfo}>{post.postRes.additionalInfo}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  ));

  const renderItem = useCallback(
    ({ item }) => (
      <PostListItem
        post={item}
        onPress={() =>
          navigation.navigate('PostDetail', {
            postId: item?.postRes?.postId,
            userId,
          })
        }
      />
    ),
    [navigation, userId]
  );

  const getItemLayout = useCallback((data, index) => {
    const ITEM_HEIGHT = 124;
    return { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index };
  }, []);

  if (loading) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/balbadag.png')} style={styles.logo} />
        <Text style={styles.title}>  {townName}</Text>
        <TouchableOpacity style={styles.notificationIcon} onPress={handleNotificationPress}>
          <MaterialIcons name="mail-outline" size={30} color="#ffcc80" marginRight={8} marginTop={6} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item, index) => {
          const stable = item?.postRes?.postId ?? item?.id ?? index;
          return String(stable);
        }}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={10}
        removeClippedSubviews
        getItemLayout={getItemLayout}
        contentContainerStyle={{ paddingBottom: 47 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <Modal
        animationType="slide"
        transparent
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
              <TouchableOpacity
                style={[styles.button, styles.closeButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>아니오</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('PostCreateScreen')}>
        <Ionicons name="pencil" size={24} color="black" />
      </TouchableOpacity>

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
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    flexDirection: 'row',
    width: '100%',
    padding: 7,
    marginTop: 25,
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
  },
  postItem: {
    flexDirection: 'row',
    marginTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  postImage: { width: '100%', height: '100%', resizeMode: 'cover', borderRadius: 14 },
  postContent: { flex: 1 },
  postTitle: { fontSize: 16, marginBottom: 4 },
  postInfo: { flexDirection: 'row', justifyContent: 'space-between' },
  postAuthor: { fontSize: 12, color: '#bbb' },
  postLocation: { fontSize: 12, color: '#bbb' },
  postDeadline: { fontSize: 12, color: '#bbb' },
  additionalInfo: { fontSize: 16, color: '#F4C293' },
  title: { fontSize: 27, fontWeight: 'bold' },
  bottomBar: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    backgroundColor: 'white', paddingVertical: 11, borderTopWidth: 1, borderTopColor: '#ddd',
    position: 'absolute', bottom: 0, left: 0, right: 0,
  },
  bottomBarItem: { flex: 1, alignItems: 'center' },
  modalBackground: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: { width: '80%', backgroundColor: 'white', borderRadius: 10, padding: 20, alignItems: 'center' },
  modalText: { fontSize: 16, marginBottom: 10 },
  closeButton: { backgroundColor: '#fff', width: '50%' },
  closeButtonText: { color: '#000', fontSize: 17, fontWeight: 'bold' },
  buttonRow: { flexDirection: 'row' },
  button: { flex: 1, padding: 10, alignItems: 'center', borderRadius: 5, marginHorizontal: 5, backgroundColor: '#2196F3' },
  createButton: {
    position: 'absolute', bottom: 70, right: 20, backgroundColor: 'white',
    width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 12,
  },
  logo: { width: 40, height: 40 },
  notificationIcon: { position: 'absolute', right: 20, marginTop: 8 },
});

export default PostListScreen;

