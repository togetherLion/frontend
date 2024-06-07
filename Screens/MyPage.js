import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Alert, ScrollView, Modal } from 'react-native';
import axios from 'axios';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const data1 = [
  { id: '1', title: '에어팟 맥스 실버', price: '550,000원', image: 'https://example.com/item1.jpg' },
  { id: '2', title: '닌텐도 스위치', price: '120,000원', image: 'https://example.com/item2.jpg' },
];

const data2 = [
  { id: '1', title: '에어팟 미개봉', price: '240,000원', image: 'https://example.com/item3.jpg' },
  { id: '2', title: '닌텐도 스위치', price: '120,000원', image: 'https://example.com/item4.jpg' },
];

const MyPage = ({ navigation, route }) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('');
  const [userId, setUserId] = useState(route.params?.userId || '');
  const [nickname, setNickname] = useState('');
  const [townName, setTownName] = useState('');
  const [profilePicture, setProfilePicture] = useState('default_image_url');
  const [myPost, setMyPost] = useState([]);
  const [likedPost, setLikedPost] = useState([]);
  const [forceRender, setForceRender] = useState(false);
  const [loading, setLoading] = useState(true);
  //const [userData, setUserData] = useState([]);




  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log("마이페이지 진입");
      getMyPage();
    });
    return unsubscribe;
  }, [navigation, forceRender]);

  async function getMyPage() {
    try {
      const responses = await Promise.all([
        axios.post("http://127.0.0.1:8080/user/userProfile", { userId: userId }),
        axios.get("http://127.0.0.1:8080/posts/my"),
        axios.get("http://127.0.0.1:8080/goods/liked"),
      ]);

      const [resp1, resp2, resp3] = responses;


      if (resp1.data !== null && resp1.data !== "") {
        setNickname(resp1.data.nickname);
        setTownName(resp1.data.townName);
        setProfilePicture(resp1.data.profilePicture);
        //setForceRender(prev => !prev);
      }
      // Process responses from other servers if needed
      if (resp2.data) {
        setMyPost(resp2.data);
        console.log(myPost);
      }

      if (resp3.data) {
        // Handle response from third server
        setLikedPost(resp3.data);
      }

    } catch (err) {
      console.log(`에러 메시지: ${err}`);
    } finally {
      setLoading(false); // 로딩 상태 갱신
    }
  }


  const handleItemPress = (item) => {
    Alert.alert('Item Pressed', `You pressed item: ${item.title}`);
    // 여기에 원하는 동작을 추가하세요. 예: 특정 페이지로 네비게이션
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('PostDetail', { postId: item.postId, userId: userId })}>
      <Image style={styles.itemImage} source={{ uri: item.postPicture }} />
      <Text style={styles.itemTitle}>{item.productName}</Text>
      <Text style={styles.itemPrice}>{item.price}원</Text>
    </TouchableOpacity>
  );

  const handleLogout = () => {
    setModalType('logout');
    setModalMessage('로그아웃 하시겠습니까?');
    setModalVisible(true);
  };

  const confirmLogout = () => {
    axios.post("http://127.0.0.1:8080/user/logout")
      .then((resp) => {
        console.log(resp.data);
        if (resp.data !== null && resp.data !== "") {
          setModalVisible(false);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Logout Failed', '로그아웃에 실패했습니다.');
        setModalVisible(false);
      });
  };

  const handleWithdraw = () => {
    setModalType('withdraw');
    setModalMessage('탈퇴 하시겠습니까?');
    setModalVisible(true);
  };

  const handleEditPass = () => {
    setModalType('EditPass');
    setModalMessage('비밀번호를 변경하시겠습니까?');
    setModalVisible(true);
  };

  const confirmAction = () => {
    if (modalType === 'logout') {
      confirmLogout();
    } else if (modalType === 'withdraw') {
      setModalVisible(false);
      navigation.navigate('Withdraw');
    } else if (modalType === 'EditPass') {
      setModalVisible(false);
      navigation.navigate('EditPassword');
    }
  };

  if (loading) {
    return null; // 로딩 중일 때는 화면에 아무것도 렌더링하지 않음
  }

  return (

    <View Style={styles.bigcontainer}>
      <ScrollView style={styles.container}>
        <View style={styles.header}></View>

        <View style={styles.profileContainer}>
          <Image
            style={styles.profileImage}
            source={{ uri: profilePicture }} // 프로필 이미지 URL
          />
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}> {nickname} ({townName})</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('Profile', { userId: userId })}
              >
                <Text style={styles.editButtonText}>내 프로필 보기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('UserInform')}
              >
                <Text style={styles.editButtonText}>회원 정보 보기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>


        <View>
          {myPost && myPost.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>내가 작성한 공구글</Text>
              <FlatList
                horizontal
                data={myPost}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )}
        </View>

        {likedPost && likedPost.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>내가 찜한 공구글</Text>
            <FlatList
              horizontal
              data={likedPost}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}

        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton} onPress={handleEditPass}>
            <Text style={styles.footerButtonText}>비밀번호 변경</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton} onPress={handleLogout}>
            <Text style={styles.footerButtonText}>로그아웃</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton} onPress={handleWithdraw}>
            <Text style={styles.footerButtonText}>회원 탈퇴</Text>
          </TouchableOpacity>
        </View>

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
                <TouchableOpacity
                  style={[styles.button, styles.closeButton]}
                  onPress={confirmAction}
                >
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

        
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => navigation.navigate('PostListScreen', { userId: userId })} style={styles.bottomBarItem}>
          <MaterialIcons name="home" size={24} color="#bbb" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SearchScreen', { userId: userId })} style={styles.bottomBarItem}>
          <MaterialIcons name="search" size={24} color="#bbb" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBarItem}>
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
  bigcontainer: {
    flex: 1,
    backgroundColor: '#fff',
    //position: 'relative', 
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    marginBottom : 49,
    //minHeight: 650,
  },
  header: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 50,
    marginTop: 15,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 30,
  },
  profileTextContainer: {
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row', // 버튼을 수평으로 배치하기 위해 추가
  },
  editButton: {
    marginTop: 10,
    marginRight: 20, // 버튼 사이 간격을 위해 추가
    padding: 8,
    //backgroundColor: '#ffcc80',
    borderRadius: 7,
    borderColor: 'black',
  },
  editButtonText: {
    color: 'black',
    textAlign: 'center',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  subTitle: {
    marginTop: 4,
    color: '#888',
  },
  item: {
    marginRight: 8,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  itemTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemPrice: {
    marginTop: 4,
    color: '#888',
  },
  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    padding: 16,
  },
  footerButton: {
    flex: 1,
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
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



});

export default MyPage;
