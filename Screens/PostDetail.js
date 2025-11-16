import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, TextInput, FlatList } from 'react-native';
//import Modal from 'react-native-modal';
import { Avatar } from 'react-native-elements';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // 추가
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/ko';

moment.locale('ko');


const PostDetail = ({ route }) => { // navigation 제거

    const scrollViewRef = useRef(null);

    const navigation = useNavigation();

    const [postId, setPostId] = useState(route.params?.postId || '');
    const [userId, setUserId] = useState(route.params?.userId || '');

    const [forceRender, setForceRender] = useState(false);
    const [loading, setLoading] = useState(true); // 로딩 상태 추가

    const [post, setPost] = useState([]);

    const [postuserId, setPostUserId] = useState('');
    const [profilePicture, setProfilePicture] = useState('default_image_url');
    const [nickname, setNickname] = useState('');
    const [hisPosts, setHisPosts] = useState([]);

    const [isgood, setIsgood] = useState(false);
    const [waitingDeals, setWaitingDeals] = useState('');


    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState('');




    const statusMapping = {
        "FIRST": "모집중",
        "SECOND": "입금 대기중",
        "THIRD": "상품 배송중",
        "FOURTH": "상품 전달 대기",
        "FIFTH": "거래 완료"
    };

    const formatPrice = (price) => {
        return price.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const handleHeartPress = () => {
        if (!isgood) {
            axios.post("http://192.168.219.45:8080/goods/postlike", { postId: postId });
        }
        else {
            axios.delete("http://192.168.219.45:8080/goods", {
                params: {
                    postId: postId
                }
            });
        }
        setIsgood(!isgood);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.item} onPress={() => navigateToPostDetail(item.postId)}>
            <Image style={styles.itemImage} source={{ uri: item.postPicture }} />
            <Text style={styles.itemTitle}>{item.productName}</Text>
            <Text style={styles.itemPrice}>{item.price}원</Text>
        </TouchableOpacity>
    );

    const navigateToPostDetail = (postId) => {
        console.log(postId);
        setPostId(postId);
    };

    const handlePostIdChange = (newPostId) => {
        setPostId(newPostId);
    };




    useEffect(() => {
        const fetchData = async () => {
            try {
                await getPostDetail();
                setForceRender(prev => !prev);  // 강제 리렌더링 유도
                scrollViewRef.current?.scrollTo({ y: 0, animated: true });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

        const unsubscribe = navigation.addListener('focus', fetchData);

        return unsubscribe;
    }, [postId, navigation]);



    async function getPostDetail() {
        try {
            const responses = await Promise.all([
                axios.get(`http://192.168.219.45:8080/posts/${postId}`),
                axios.get(`http://192.168.219.45:8080/posts/user-posts/${postId}`),
            ]);

            const [resp1, resp2] = responses;

            if (resp1.data !== null && resp1.data !== "") {
                //console.log(resp1.data);
                //console.log(resp1.data.post.postPicture);

                setPost(resp1.data.post);


                setIsgood(resp1.data.isgood);
                setWaitingDeals(resp1.data.waitingDeals);

                setPostUserId(resp1.data.user.userId);
                setProfilePicture(resp1.data.user.profilePicture);
                setNickname(resp1.data.user.nickname);
                //console.log(resp1.data.isgood);

            }
            // Process responses from other servers if needed
            if (resp2.data) {
                setHisPosts(resp2.data);
                //console.log(resp2.data);
            }

        } catch (err) {
            console.log(`에러 메시지: ${err}`);
        } finally {
            setLoading(false); // 로딩 상태 갱신
        }
    }

    const handleComplain = () => {
        setModalType('complain');
        setModalMessage('신고하시겠습니까?');
        setModalVisible(true);
    };

    const handlePar = () => {
        setModalType('participate');
        setModalMessage('참여 신청하시겠습니까?');
        setModalVisible(true);
    };

    const handleDelete = () => {
        setModalType('delete');
        setModalMessage('삭제하시겠습니까?');
        setModalVisible(true);
    };

    const handleEdit = () => {
        setModalType('edit');
        setModalMessage('수정하시겠습니까?');
        setModalVisible(true);
    };



    const confirmParticipate = () => {
        axios.post("http://192.168.219.45:8080/waitingdeal", { postId: postId })
            .then((resp) => {
                console.log(resp.data);
                if (resp.data !== null && resp.data !== "") {
                    setModalType('okay');
                    setModalMessage('참여 신청 완료');
                    setModalVisible(true);
                }
            })
            .catch((error) => {
                setModalType('okay');
                setModalMessage('이미 신청한 게시글입니다.');
                setModalVisible(true);
            });
    };

    const onConfirmDelete = () => {
        setModalVisible(false); // 모달 숨기기
        navigation.navigate('PostListScreen'); // PostListScreen으로 이동
    };

    const confirmDelete = () => {
        axios.delete(`http://192.168.219.45:8080/posts/${postId}`)
            .then((resp) => {
                setModalType('deleteconfirm');
                setModalMessage('삭제 완료');
                setModalVisible(true);
            }
            );
    };






    const confirmAction = () => {
        if (modalType === 'participate') {
            confirmParticipate();
        } else if (modalType === 'complain') {
            setModalVisible(false);
            navigation.navigate('Complain', { userId: postuserId });
        } else if (modalType === 'delete') {
            setModalVisible(false);
            confirmDelete();
        } else if (modalType === 'edit') {
            setModalVisible(false);
            navigation.navigate('PostEditScreen', { post: post });
        }
    };

    const handleAvatarPress = () => {
        navigation.navigate('Profile', { userId: postuserId });
    };

    const handleWaitlist = () => {
        navigation.navigate('WaitingTable', { postId: post.postId });
    };


    const handleChatCreation = () => {
        navigation.navigate('CreateChat', { postId: post.postId });
    };



    if (loading) {
        return null;
    }




    return (

        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={30} color="black" />
                </TouchableOpacity>

                <View style={styles.iconsContainer}>

                    {userId === postuserId ? (
                        <>
                            <TouchableOpacity style={styles.editButton} onPress={handleEdit}  >
                                <MaterialIcons name="edit" size={30} color="#bbb" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} >
                                <MaterialIcons name="delete" size={30} color="#bbb" />
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity style={styles.reportButton} onPress={handleComplain}>
                            <Ionicons name="notifications-outline" size={30} color="#ff6666" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContainer}>
                <View style={styles.headerContainer}>
                    <Image source={{ uri: post.postPicture }} style={styles.headerImage} />
                </View>
                {/* 여기에 스크롤이 필요한 다른 컨텐츠들을 추가하세요. */}

                <View style={styles.infoContainer}>
                    <View style={styles.DDoContainer}>
                        <Text style={styles.dealState}>{statusMapping[post.dealState]}</Text>
                        <Text style={styles.productName}>{post.productName}</Text>
                        <View style={styles.iconWithText}>
                            <Ionicons name="people-outline" size={30} color="black" />
                            <Text style={styles.dealNum}>  {waitingDeals}  /  {post.dealNum}</Text>
                        </View>
                    </View>
                    <Text style={styles.uploadDate}>{moment(post.uploadDate).fromNow()}</Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.label}>모집기간{'   '}</Text>
                        <Text style={styles.deadlineDate}>~ {post.deadlineDate}</Text>
                    </View>



                    <Text style={styles.productContent}>{post.productContent}</Text>


                </View>
                <TouchableOpacity onPress={handleAvatarPress}>
                    <View style={styles.profileItem}>
                        <Avatar
                            size={50}
                            rounded
                            source={{ uri: profilePicture }}
                            containerStyle={styles.avatar}
                        />
                        <Text style={styles.nickname}>{nickname}</Text>
                    </View>
                </TouchableOpacity>

                <View>
                    {hisPosts && hisPosts.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>작성자의 다른글</Text>
                            <FlatList
                                horizontal
                                data={hisPosts}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.id}
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                    )}
                </View>








            </ScrollView>



            <View style={styles.bottomBar}>
                <TouchableOpacity onPress={handleHeartPress}>
                    <Ionicons name={isgood ? "heart" : "heart-outline"} size={33} color="pink" style={styles.heartIcon} />
                </TouchableOpacity>
                <Text style={styles.price}>{formatPrice(post.price.toString())}원</Text>
                {userId !== postuserId ? (
                    <TouchableOpacity style={styles.wantbutton} onPress={handlePar}>
                        <Text style={styles.buttonText}>참여하기</Text>
                    </TouchableOpacity>
                ) : post.dealNum === waitingDeals ? (
                    <TouchableOpacity style={styles.wantbutton} onPress={handleChatCreation}>
                        <Text style={styles.buttonText}>채팅방 생성</Text>
                    </TouchableOpacity>
                    
                ) : (
                    <TouchableOpacity style={styles.wantbutton} onPress={handleWaitlist}>
                        <Text style={styles.buttonText}>대기테이블 보기</Text>
                        
                    </TouchableOpacity>
                )}
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
                        {modalType === 'okay' || modalType === 'deleteconfirm' ? (
                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    style={[styles.button, styles.closeButton]}
                                    onPress={modalType === 'okay' ? () => setModalVisible(false) : onConfirmDelete}
                                >
                                    <Text style={styles.closeButtonText}>확인</Text>
                                </TouchableOpacity>
                            </View>) : (<View style={styles.buttonRow}>
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
                            </View>)}
                    </View>
                </View>
            </Modal>


        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
        //alignItems: 'center',
        //padding: 20,
        backgroundColor: 'white', // 밝은 회색 배경으로 설정
    },
    scrollContainer: {
        flexGrow: 1,
        //flexDirection: 'column',
        //paddingBottom: 60,
    },
    iconsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end', // 오른쪽 정렬
    },
    editButton: {
        marginLeft: 10, // 아이콘 간의 간격 조정
    },
    deleteButton: {
        marginLeft: 10,
    },
    DDoContainer: {
        flexDirection: 'row',
        //justifyContent: 'space-between',
    },
    headerContainer: {
        width: '100%',
        height: 300,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row', // 아이콘과 텍스트가 수평으로 나란히 있도록 설정
        //marginTop: 10, // 패딩 추가

    },
    headerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        padding: 14,
        marginTop: 15,
        //marginLeft: 5,
        //borderBottomWidth: 1,
        //borderBottomColor: '#eee',
    },
    imageWrapper: {
        width: '100%',
        marginBottom: 20,
    },
    imageContainer: {
        width: 90,
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white', // 이미지 선택 영역을 구분하기 위한 색상
        borderRadius: 10, // 모서리를 둥글게
        borderColor: '#ddd',
        borderWidth: 1.5, // 테두리 두께

    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10, // 이미지 모서리를 둥글게
    },
    placeholderText: {
        color: '#888', // 플레이스홀더 텍스트 색상
        fontSize: 13,
    },
    placeholderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        padding: 10,
        marginBottom: 30,
        backgroundColor: '#fff', // 입력 필드 배경 색상
        borderRadius: 5, // 입력 필드 모서리 둥글게
        borderWidth: 1,
        borderColor: '#ddd', // 입력 필드 테두리 색상
        color: 'black',
    },
    multilineInput: {
        height: 150, // 다중 행 입력 필드 높이
        textAlignVertical: 'top', // 텍스트 입력 시작 위치를 위로
    },
    submitButton: {
        width: '100%',
        backgroundColor: '#ffcc80',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff', // 버튼 텍스트 색상
        fontWeight: 'bold',
        fontSize: 17,
    },
    label: {
        fontSize: 20, // 작은 글씨 크기
        color: 'black', // 글씨 색상
        //marginBottom: 8, // 입력 필드와 라벨 사이의 여백
        marginLeft: 3,
        fontWeight: '700',
    },
    scrollView: {
        flexDirection: 'row',
    },

    wantbutton: {
        //width: '100%',
        backgroundColor: '#ffcc80',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        position: 'absolute',
        right: 15,

    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    selectedButton: {
        backgroundColor: '#ddd',
    },


    okbutton: {
        width: '100%',
        backgroundColor: '#ffcc80',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButton: {
        backgroundColor: '#fff',
        //marginTop: 10,
        width: '50%',
    },
    closeButtonText: {
        color: '#000',
        fontSize: 14,
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
    infoContainer: {
        padding: 20,
        borderBottomWidth: 1.2,
        borderBottomColor: '#eee',
    },
    productName: {
        fontSize: 23,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    price: {
        fontSize: 25,
        color: 'black',
        marginBottom: 10,
        fontWeight: 'bold',
        marginLeft: 20,
    },
    productContent: {
        fontSize: 16,
        //marginBottom: 25,
        marginTop: 20,
        minHeight: 150,
    },
    dealNum: {
        fontSize: 20,
        marginBottom: 10,


    },
    deadlineDate: {
        fontSize: 17,
        //marginBottom: 10,
    },
    dealState: {
        fontSize: 20,
        marginTop: 4,
        color: '#ffcc80',
        fontWeight: 'bold',
        marginRight: 10,
    },
    uploadDate: {
        fontSize: 13,
        marginBottom: 10,
        color: "grey",
        marginTop: 5,
    },
    iconWithText: {
        position: 'absolute',
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,

    },
    bottomBar: {
        flexDirection: 'row',
        //justifyContent: 'space-around',
        alignItems: 'center',
        height: 60, // bottom bar의 높이 지정
        borderTopWidth: 1, // 상단 경계선 추가
        borderColor: '#ddd', // 경계선 색
    },
    heartIcon: {
        marginLeft: 10, // 여기서 원하는 marginLeft 값을 설정하세요
    },
    profileItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingTop: 10,
    },
    nickname: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 20,
    },
    sellerlabel: {
        marginLeft: 15,
        fontSize: 14,
        marginBottom: 5,
        fontWeight: 'bold',
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
    section: {
        padding: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
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
export default PostDetail;