import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, ScrollView, TouchableOpacity, Keyboard, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // FontAwesome 아이콘을 사용합니다.
import axios from 'axios';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const SearchScreen = ({ navigation, route }) => {

    const [userId, setUserId] = useState(route.params?.userId || '');
    const [searchText, setSearchText] = useState('');
    const [recentSearches, setRecentSearches] = useState(['헌터헌터보고싶다', '샌드위치', '롯데리아', '오이김치', '오이김치']);
    const [popularSearches, setPopularSearches] = useState([
        { rank: '1.', term: '요아리', },
        { rank: '2.', term: '컴포즈커피' },
        { rank: '3.', term: '샤넬' },
        { rank: '4.', term: '빙수' },
        { rank: '5.', term: '빙수' },
        { rank: '6.', term: '요아리', },
        { rank: '7.', term: '컴포즈커피' },
        { rank: '8.', term: '샤넬' },
        { rank: '9.', term: '빙수' },
        { rank: '10.', term: '빙수' }
    ]);

    useEffect(() => {
        const fetchRecentSearches = async () => {
            try {
                const response = await axios.post('http://192.168.200.116:8080/posts/recentSearch');
                setRecentSearches(response.data); // 최근 검색어 5개만 설정
            } catch (error) {
                console.error(error);
            }
        };

        fetchRecentSearches();
    }, []);

    const handleSearch = async () => {
        if (searchText) {
            try {
                const response = await axios.get(`http://192.168.200.116:8080/posts/search/${searchText}`);
                console.log(response.data); // 받은 데이터를 콘솔에 출력
                setRecentSearches([...recentSearches, searchText]); // 최근 검색어에 추가
                setSearchText(''); // 검색어 초기화
                Keyboard.dismiss(); // 키보드 닫기

                // 데이터를 다음 화면으로 전달
                navigation.navigate('ListSearchScreen', { posts: response.data });
            } catch (error) {
                console.error(error); // 에러를 콘솔에 출력
            }
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
                        onChangeText={setSearchText} // 입력 값을 searchText 상태에 저장
                        onSubmitEditing={handleSearch} // 엔터 키를 눌렀을 때 검색 수행
                    />
                </View>

                <Text style={styles.recentSearchLabel}>최근검색어</Text>
                <ScrollView horizontal style={styles.recentSearchContainer}>
                    {recentSearches.map((item, index) => (
                        <View key={index} style={styles.recentSearchItem}>
                            <Text style={styles.recentSearchText}>{item}</Text>
                            <TouchableOpacity onPress={() => clearSearch()}>
                                {/* <Text style={styles.clearButton}>X</Text> */}
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>

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
