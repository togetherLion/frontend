import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, StyleSheet, Text, ScrollView, TouchableOpacity, Keyboard, Image, Modal, Button } from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/FontAwesome'; // FontAwesome 아이콘을 사용합니다.
import axios from 'axios';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const SearchScreen = ({ navigation, route }) => {

    const [userId, setUserId] = useState(route.params?.userId || '');
    const [searchText, setSearchText] = useState('');
    //const [recentSearches, setRecentSearches] = useState(['헌터헌터보고싶다', '샌드위치', '롯데리아', '오이김치', '오이김치']);
    const [popularSearches, setPopularSearches] = useState([
        { rank: '1.', term: '두바이', },
        { rank: '2.', term: '구두' },
        { rank: '3.', term: '과자' },
        { rank: '4.', term: '쌀10kg' },
        { rank: '5.', term: '훠궈소스' },
        { rank: '6.', term: '요아정', },
        { rank: '7.', term: '컴포즈커피' },
        { rank: '8.', term: '샤넬' },
        { rank: '9.', term: '몬치치인형' },
        { rank: '10.', term: '폰케이스' }
    ]);
    const [sortOption, setSortOption] = useState('이웃추가순'); // Default sorting option
    const [modalVisible, setModalVisible] = useState(false);
    const [emptySearchModalVisible, setEmptySearchModalVisible] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const [priceModalVisible, setPriceModalVisible] = useState(false);
    const [lowPrice, setLowPrice] = useState(0);
    const [highPrice, setHighPrice] = useState(1000000);

    const handleSortChange = (option) => {
        setSortOption(option);
        setModalVisible(false);
        //handleSearch();
        if (option === '가격대설정') {
            setPriceModalVisible(true);
        }

        else {
            handleSearch();
        }
    };



    const fetchRecentSearches = async () => {
        try {
            const response = await axios.post('http://165.229.169.110:8080/posts/recentSearch');
            setRecentSearches(response.data); // 최근 검색어 5개만 설정
        } catch (error) {
            console.error(error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchRecentSearches();
        }, [])
    );



    const handleSearch = async () => {

        if (!searchText) {
            setEmptySearchModalVisible(true);
            return;
        }



        let url = `http://165.229.169.110:8080/posts/search/${searchText}`;

        if (sortOption === '저가순') {
            url = `http://165.229.169.110:8080/posts/search/low/${searchText}`;
        } else if (sortOption === '고가순') {
            url = `http://165.229.169.110:8080/posts/search/high/${searchText}`;
        } else if (sortOption === '최신순') {
            url = `http://165.229.169.110:8080/posts/search/${searchText}`;
        } else if (sortOption === '가격대설정') {
            url = `http://165.229.169.110:8080 /posts/search/${searchText}/${lowPrice}/${highPrice}`;
        }

        try {
            const response = await axios.get(url);
            console.log(response.data); // 받은 데이터를 콘솔에 출력
            setRecentSearches([searchText]); // 최근 검색어에 추가
            setSearchText(''); // 검색어 초기화
            Keyboard.dismiss(); // 키보드 닫기

            // 데이터를 다음 화면으로 전달
            navigation.navigate('ListSearchScreen', { posts: response.data, searchText: searchText });
        } catch (error) {
            console.error(error); // 에러를 콘솔에 출력
        }
    };

    const handleSearch2 = async (searchTerm) => {
        // 사용할 검색어로 searchTerm을 직접 사용
        let url = `http://165.229.169.110:8080/posts/search/${searchTerm}`;

        try {
            const response = await axios.get(url);
            console.log(response.data); // 받은 데이터를 콘솔에 출력
            setSearchText(''); // 검색어 초기화 (필요한 경우에만)

            // 데이터를 다음 화면으로 전달하며 네비게이트
            navigation.navigate('ListSearchScreen', { posts: response.data, searchText: searchTerm });
        } catch (error) {
            console.error(error); // 에러를 콘솔에 출력
        }
    };




    const addRecentSearch = (text) => {
        if (text && !recentSearches.includes(text)) {
            setRecentSearches([...recentSearches, text]);
        }
    };

    const handleSearchSubmit = () => {
        addRecentSearch(searchText);
        setSearchText('');
    };

    const clearSearch = () => {
        setSearchText('');
    };


    const handleRecentSearch = (item) => {
        setSearchText(item);
        handleSearch();
    };

    const handleRecentSearchPress = (item) => {
        console.log(item);
        handleSearch2(item); // handleSearch2에 item 값을 직접 전달
    };

    const handleSearch3 = async (lowPrice, highPrice) => {
        if (!searchText) {
            setEmptySearchModalVisible(true);
            return;
        }

        let url = `http://165.229.169.110:8080/posts/search/${searchText}`;

        if (sortOption === '가격대설정') {
            url = `http://165.229.169.110:8080/posts/search/${searchText}/${lowPrice}/${highPrice}`;
        }

        try {
            const response = await axios.get(url);
            console.log(response.data); // 받은 데이터를 콘솔에 출력
            setRecentSearches([searchText]); // 최근 검색어에 추가
            setSearchText(''); // 검색어 초기화
            Keyboard.dismiss(); // 키보드 닫기

            // 데이터를 다음 화면으로 전달
            navigation.navigate('ListSearchScreen', { posts: response.data, searchText: searchText });
        } catch (error) {
            console.error(error);
        }
    };


    const half = Math.ceil(popularSearches.length / 2);
    const firstHalf = popularSearches.slice(0, half);
    const secondHalf = popularSearches.slice(half);

    return (

        <View style={styles.root}>

            <View style={styles.container}>

                {/* 여기에 빈 공간을 추가합니다. */}
                <View style={{ marginVertical: 20 }}></View>

                {/* 여기에 빈 공간을 추가합니다. */}
                <View style={{ marginVertical: 20 }}></View>

                <View style={styles.container2}>
                    <Icon name="search" size={20} color="#000" style={styles.icon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="검색어를 입력해주세요"
                        value={searchText}
                        onChangeText={setSearchText}
                        onSubmitEditing={handleSearch}
                    />
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Icon name="sort" size={20} color="#000" style={styles.icon} />
                    </TouchableOpacity>


                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={styles.modalContainernew}>
                            <View style={styles.modalViewnew}>
                                <Text style={styles.modalTitlenew}>정렬선택</Text>
                                {['최신순', '고가순', '저가순', '가격대설정'].map((option) => (
                                    <TouchableOpacity key={option} onPress={() => handleSortChange(option)}>
                                        <Text style={styles.modalTextnew}>{option}</Text>
                                    </TouchableOpacity>
                                ))}


                                {/* <Button style={{ color: '#000' }}title="취소" onPress={() => setModalVisible(false)} /> */}

                                <TouchableOpacity onPress={() => setModalVisible(false)} style={{ backgroundColor: '#FFF', padding: 10, borderRadius: 5 }}>
                                    <Text style={{ color: '#000', fontSize: 15 }}>취소</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </Modal>


                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={priceModalVisible}
                        onRequestClose={() => setPriceModalVisible(!priceModalVisible)}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalTitle}>가격대 설정</Text>
                                <Text>최저 가격: {lowPrice}원</Text>
                                <Slider
                                    style={{ width: 300, height: 40 }}
                                    minimumValue={0}
                                    maximumValue={99999}
                                    step={10000}
                                    value={lowPrice}
                                    onValueChange={setLowPrice}
                                    minimumTrackTintColor='#ffcc80'
                                    maximumTrackTintColor="#000000"
                                />
                                <Text>최고 가격: {highPrice}원</Text>
                                <Slider
                                    style={{ width: 300, height: 40 }}
                                    minimumValue={100000}
                                    maximumValue={500000}
                                    step={10000}
                                    value={highPrice}
                                    onValueChange={setHighPrice}
                                    minimumTrackTintColor='#ffcc80'
                                    maximumTrackTintColor="#000000"
                                />


                                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <TouchableOpacity onPress={() => {
                                        setPriceModalVisible(false);
                                        handleSearch3(lowPrice, highPrice);
                                    }} style={{ backgroundColor: '#FFF', padding: 10, borderRadius: 5 }}>
                                        <Text style={{ color: '#000', fontSize: 18 }}>확인</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setPriceModalVisible(false)} style={{ backgroundColor: '#FFF', padding: 10, borderRadius: 5 }}>
                                        <Text style={{ color: '#000', fontSize: 18 }}>취소</Text>
                                    </TouchableOpacity>
                                </View>


                            </View>
                        </View>
                    </Modal>

                </View>

                <View>
                    <Text style={styles.recentSearchLabel}>최근검색어</Text>
                    <ScrollView horizontal style={styles.recentSearchContainer}>
                        {recentSearches.map((item, index) => (
                            <TouchableOpacity key={index} onPress={() => handleRecentSearchPress(item)} style={styles.recentSearchItem}>
                                <Text style={styles.recentSearchText}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Gray divider line */}
                <View style={styles.divider}></View>

                {/* Popular searches section */}
                <View style={styles.container3}>

                    <View style={styles.textContainer}>
                        <Text style={styles.popularSearchLabel}>가장 많이</Text>
                        <Text style={styles.popularSearchLabel2}>검색되었어요</Text>
                    </View>

                    <Image
                        source={require('../assets/backgroundnai.png')} // Replace './path/to/your/image.png' with the actual path
                        style={styles.image}
                    />

                </View>




                <View style={styles.popularSearchRow}>
                    <View style={styles.column}>
                        {firstHalf.map((item, index) => (
                            <View key={index} style={styles.popularSearchItem}>
                                <Text style={styles.rank}>{item.rank}</Text>
                                <Text style={styles.term}>{item.term}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.column}>
                        {secondHalf.map((item, index) => (
                            <View key={index} style={styles.popularSearchItem}>
                                <Text style={styles.rank}>{item.rank}</Text>
                                <Text style={styles.term}>{item.term}</Text>
                            </View>
                        ))}
                    </View>


                </View>
            </View>
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
            <Modal
                animationType="fade"
                transparent={true}
                visible={emptySearchModalVisible}
                onRequestClose={() => setEmptySearchModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>검색어를 입력하세요</Text>

                        <TouchableOpacity onPress={() => setEmptySearchModalVisible(false)} style={{ backgroundColor: '#FFF', padding: 10, borderRadius: 5 }}>
                            <Text style={{ color: '#000' }}>확인</Text>
                        </TouchableOpacity>


                        {/* <Button title="확인" onPress={() => setEmptySearchModalVisible(false)} /> */}
                    </View>
                </View>
            </Modal>

        </View>





    );
};

const styles = StyleSheet.create({

    root: {
        flex: 1,
        backgroundColor: '#fff', // Set the background color to white
    },

    container: {
        padding: 10,
        backgroundColor: '#fff',


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




    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,

    },

    modalTitle: {
        marginBottom: 30,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 25,
    },


    modalText: {
        marginBottom: 10,
        textAlign: 'center',
        //color: 'black',
    },







    modalContainernew: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalViewnew: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,

    },

    modalTitlenew: {
        marginBottom: 30,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 25,
        //color : '#ffcc80',
    },


    modalTextnew: {

        marginBottom: 15,
        textAlign: 'right',
        fontSize: 18,
    },





    recentSearchLabel: {   //최근검색어
        fontSize: 25, // Adjust the font size as desired
        fontWeight: 'bold',
        marginTop: 15,  // Add space above the text
        marginBottom: 15, // Add space below the text
        marginLeft: 10,
        marginRight: 10,
        //color: 'orange', 
    },

    recentSearchContainer: {
        flexDirection: 'row',
    },


    recentSearchItem: {
        flexDirection: 'row',
        backgroundColor: '#ffcc80', // Change background color to orange
        borderRadius: 23, // Make the borders round
        padding: 13,
        marginRight: 1,
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
        marginLeft: 10

    },

    recentSearchText: {
        color: 'white', // Text color to stand out on orange background
        fontWeight: 'bold',
    },

    divider: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 13,
        marginBottom: 20,
    },


    popularSearchContainer: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
    },

    container3: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    popularSearchLabel: {      //가장많이
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 7,
        marginLeft: 10
    },


    popularSearchLabel2: {    //검색하고 있어요
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 25,
        marginLeft: 10
    },

    image: {
        width: 50, // Adjust the width as needed
        height: 100, // Adjust the height so it matches the combined height of the Text components
        marginLeft: 150, // Adjust the space between the image and the text.
        marginBottom: 30

    },

    popularSearchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    column: {
        flex: 1,
    },
    popularSearchItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
    },
    rank: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ffcc80',
        marginRight: 15, // Reduce space between rank and term
        marginLeft: 10
    },
    term: {
        fontSize: 20,
        color: '#333',
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

export default SearchScreen;
