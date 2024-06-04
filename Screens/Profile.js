import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const reviews = [
  { id: 1, text: '안녕하세요반갑습니다기및', rating: 5 },
  { id: 2, text: '매우 친절하과 완전 짱입낟. 다음에 또 하고싶어요', rating: 4 },
  { id: 3, text: 'Would like to use it again.', rating: 1 },
  // 여기에 더 많은 리뷰를 추가할 수 있습니다.
];

const Profile = ({ navigation, route }) => {
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [nickname, setNickname] = useState('');
  const [profileIntro, setProfileIntro] = useState('');
  const [followerCount, setFollowerCount] = useState('');
  const [followingCount, setFollowingCount] = useState('');
  const [townName, setTownName] = useState('');
  const [complainCount, setComplainCount] = useState('');
  const [profilePicture, setProfilePicture] = useState('default_image_url');
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [forceRender, setForceRender] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('');
  const [userId, setUserId] = useState(route.params?.userId || '');







  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getProfile();
    });
    return unsubscribe;
  }, [navigation, forceRender]);

  async function getProfile() {
    try {
      const resp = await axios.post("http://192.168.200.116:8080/user/userProfile", {
        userId: userId,
      });
      if (resp.data !== null && resp.data !== "") {
        //console.log(resp.data.complainCount);
        setNickname(resp.data.nickname)
        setProfileIntro(resp.data.profileIntro)
        setFollowerCount(resp.data.followerCount)
        setFollowingCount(resp.data.followingCount)
        setTownName(resp.data.townName)
        setProfilePicture(resp.data.profilePicture)
        setIsFollowing(resp.data.following)
        setIsMyProfile(resp.data.myProfile)
        setComplainCount(resp.data.complainCount)
        setForceRender(prev => !prev);
      } else {
        console.log("정보 가져오기 실패");
      }
    } catch (err) {
      console.log(`에러 메시지: ${err}`);
    } finally {
      setLoading(false); // 로딩 상태 갱신
    }
  }


  const confirmAction = () => {
    if (modalType === 'follow') {
      confirmFollow();
    } else if (modalType === 'unfollow') {
      confirmUnfollow();
    } else if (modalType === 'complain') {
      setModalVisible(false);
      navigation.navigate('Complain');
    }
  };


  const confirmFollow = () => {
    axios.post("http://192.168.200.116:8080/follow", { userId: userId })
      .then((resp) => {
        console.log(resp.data);
        if (resp.data !== null && resp.data !== "") {
          setModalVisible(false);
          getProfile();
        }
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Logout Failed', '로그아웃에 실패했습니다.');
        setModalVisible(false);
      });
  };

  const confirmUnfollow = () => {
    axios.post("http://192.168.200.116:8080/follow/unfollow", { userId: userId })
      .then((resp) => {
        console.log(resp.data);
        if (resp.data !== null && resp.data !== "") {
          setModalVisible(false);
          getProfile();
        }
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Logout Failed', '로그아웃에 실패했습니다.');
        setModalVisible(false);
      });
  };

  const handleFollow = () => {
    setModalType('follow');
    setModalMessage('팔로우 하시겠습니까?');
    setModalVisible(true);
  };

  const handleUnfollow = () => {
    setModalType('unfollow');
    setModalMessage('언팔로우 하시겠습니까?');
    setModalVisible(true);
  };

  const handleComplain = () => {
    setModalType('complain');
    setModalMessage('신고 하시겠습니까?');
    setModalVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      {loading ? null : (
        <View>
          <View style={styles.header}>
            <Avatar
              size={90}
              rounded
              source={{ uri: profilePicture }}
              containerStyle={styles.avatar}
            />
            {isMyProfile ? (
              <Button
                title="내 프로필 수정"
                buttonStyle={styles.followButton}
                titleStyle={styles.buttonText}
                onPress={() => navigation.navigate('EditProfile', {
                  nickname: nickname,
                  profileIntro: profileIntro,
                  profilePicture: profilePicture
                })}
              />
            ) : isFollowing ? (

              <Button
                title="팔로잉"
                buttonStyle={styles.followButton}
                titleStyle={styles.buttonText}
                onPress={handleUnfollow}
              />
            ) : (
              <Button
                icon={
                  <Icon
                    name="user-plus"
                    size={15}
                    color="black"
                  />
                }
                title=" 팔로우"
                buttonStyle={styles.followButton}
                titleStyle={styles.buttonText}
                onPress={handleFollow}
              />
            )}
          </View>
          <Text style={styles.username}>{nickname}</Text>
          <Text style={styles.location}>{townName}</Text>
          <Text style={styles.bio}>{profileIntro}</Text>
          <View style={styles.followInfo}>
            <TouchableOpacity onPress={() => navigation.navigate('Following', { userId: userId })}>
              <View style={styles.followWrapper}>
                <Text style={styles.followLabel}>팔로잉</Text>
                <Text style={styles.followCount}>   {followingCount}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Follower', { userId: userId })}>
              <View style={styles.followWrapper}>
                <Text style={styles.followLabel}>팔로워</Text>
                <Text style={styles.followCount}>   {followerCount}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.reviewSection}>
            <Text style={styles.reviewTitle}>작성된 후기</Text>
            <Text style={styles.aveTitle}>평점 </Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              {reviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.ratingContainer}>
                    {/* 별점 표시 */}
                    {[...Array(review.rating)].map((_, index) => (
                      <Icon key={index} name="star" size={15} color="#FFD700" />
                    ))}
                    <Text style={styles.ratingText}>{review.rating}</Text>
                  </View>
                  <Text style={styles.reviewText}>{review.text}</Text>
                </View>
              ))}
            </ScrollView>
            {!isMyProfile && (
              <View style={styles.centeredView}>
                <TouchableOpacity onPress={handleComplain}>
                  <Icon name="bell" size={25} color="#ff6666" />
                </TouchableOpacity>
                <Text style={[styles.complainText, { color: 'black', marginLeft: 10 }]}>
                  해당 사용자는 {complainCount}번의 신고를 받았어요!
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    marginTop: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    marginBottom: 20,
  },
  avatar: {
    marginRight: 10,
  },
  followButton: {
    backgroundColor: 'white', // 배경색을 흰색으로
    borderRadius: 30,
    paddingHorizontal: 15,
    borderWidth: 1, // 테두리 추가
    borderColor: 'black', // 테두리 색상을 검은색으로
    marginRight: 20,
  },
  buttonText: {
    color: 'black', // 버튼 텍스트 색상을 검은색으로
  },
  username: {
    fontSize: 25,
    fontWeight: 'bold',
    marginVertical: 5,
    marginLeft: 30,
  },
  location: {
    fontSize: 16,
    color: 'gray',
    marginVertical: 5,
    marginLeft: 30,
  },
  bio: {
    fontSize: 14,
    marginVertical: 10,
    marginLeft: 30,
  },
  followInfo: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  followLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  followCount: {
    fontSize: 17,
  },
  followWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 30,
  },
  reviewSection: {
    marginTop: 20,
    paddingLeft: 15,
    marginLeft: 15,
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  aveTitle: {
    fontSize: 18,
    //fontWeight: 'bold',
    marginBottom: 15,
  },
  reviewCard: {
    width: 200,
    height: 150, // 리뷰 카드 너비 조정
    marginRight: 15,
    padding: 10,
    borderRadius: 15,
    backgroundColor: '#f0f0f0', // 리뷰 카드 배경색
    flexDirection: 'column',
    //justifyContent: 'center', // Center items vertically
  },
  ratingContainer: {
    flexDirection: 'row', // 별점과 별점 수를 가로로 배치
    alignItems: 'center',
    marginBottom: 5, // 별점과 리뷰 텍스트 사이의 마진
  },
  ratingText: {
    marginLeft: 5, // 별점 수와 별 아이콘 사이의 마진
    fontSize: 16,
  },
  reviewText: {
    fontSize: 16,
    marginTop: 15,
  },
  centeredView: {
    marginTop: 30,
    marginLeft: 40,
    //justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  complainText: {
    //fontWeight: 'bold',
    fontSize: 14,
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
});

export default Profile;
