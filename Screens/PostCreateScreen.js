import React, { useState, useEffect } from 'react';
import { TouchableOpacity, ImageBackground, View, StyleSheet, Platform, Text, TextInput, ScrollView, Alert, KeyboardAvoidingView, Button, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
//import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImageManipulator from 'expo-image-manipulator';


const SERVER_URL = 'http://127.0.0.1:8080/posts';

const PostCreateScreen = ({ navigation }) => {
  const [photo, setPhoto] = useState(null);
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [productContent, setProductContent] = useState('');
  const [dealNum, setDealNum] = useState('');
  const [deadlineDate, setDeadlineDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');



  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('죄송합니다. 이 기능을 사용하려면 카메라 롤 권한이 필요합니다!');
        }
      }
    })();
  }, []);

  const selectPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      const base64Image = await compressImageAndConvertToBase64(result.assets[0].uri);
      setPhoto(`data:image/jpeg;base64,${base64Image}`);
    }
  };

  const compressImageAndConvertToBase64 = async (uri) => {
    try {
      // 이미지 압축: 사이즈 조정 및 압축률 설정
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }], // 너비를 800으로 조정하면서 비율 유지
        { compress: 0.5 } // 압축률 설정 (0 ~ 1 사이, 1에 가까울수록 높은 품질)
      );

      // 압축된 이미지를 Base64로 변환
      const base64Image = await FileSystem.readAsStringAsync(manipResult.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return base64Image;
    } catch (error) {
      console.error("Error compressing image and converting to Base64:", error);
      throw error;
    }
  };

  const statusMapping = {
    "모집중": "FIRST",
    "입금 대기중": "SECOND",
    "상품 배송중": "THIRD",
    "상품 전달 대기": "FOURTH",
    "거래 완료": "FIFTH"
  };

  const handleButtonPress = (status) => {
    setSelectedButton(status);
    setSelectedStatus(status);
  };

  const formatPrice = (price) => {
    return price.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handlePriceChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    const formattedValue = formatPrice(numericValue);
    setPrice(formattedValue);
  };

  const removeCommas = (price) => {
    return price.replace(/,/g, '');
  };



  const handleSubmit = async () => {
    if (!productName || !price || !productContent || !dealNum || !deadlineDate || !photo ) {
      setModalMessage('빈칸 없이 모두 입력해 주세요.');
      setModalVisible(true);
      return;
    }

    else {
      axios.post("http://127.0.0.1:8080/posts", {
        productName: productName,
        productContent: productContent,
        dealNum: dealNum,
        deadlineDate: deadlineDate,
        dealState: "FIRST",
        price: removeCommas(price), //앞에서 phone이랑 userAddress받아오기
        postPicture: photo,
      }).then(function (response) {
        console.log(response.data);  // 서버에서 받은 응답을 콘솔에 출력합니다.
        setModalMessage('게시글이 작성되었습니다.');
        setModalVisible(true);
        navigation.navigate('PostListScreen');

      });

    }



  };

  const handleDatePress = () => {
    setShowDatePicker(true);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.header}>게시글 작성</Text>
        </View>
        <View style={styles.imageWrapper}>
          <TouchableOpacity onPress={selectPhoto} style={styles.imageContainer}>
            {photo ? (
              <ImageBackground
                source={{ uri: photo }}
                style={styles.image}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.placeholderContainer}>
                <Icon name="camera-alt" size={28} color="#666" />
                <Text style={styles.placeholderText}>사진 추가(필수)</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>


        <Text style={styles.label}>제목</Text>
        <TextInput
          style={styles.input}
          placeholder="제목을 입력해주세요"
          value={productName}
          onChangeText={setProductName}
        />


        <Text style={styles.label}>진행상황</Text>
        <ScrollView horizontal={true} style={styles.scrollView}>
          {["모집중", "입금 대기중", "상품 배송중", "상품 전달 대기", "거래 완료"].map((status) => (
            <View key={status} style={[
              styles.button,
              status === "모집중" && styles.selectedButton
            ]}>
              <Text style={styles.buttonText}>{status}</Text>
            </View>
          ))}
        </ScrollView>


        <Text style={styles.label}>가격</Text>
        <TextInput
          style={styles.input}
          placeholder="가격을 입력해주세요"
          value={price}
          onChangeText={handlePriceChange}
          keyboardType="numeric"
        />

        <Text style={styles.label}>모집인원</Text>
        <TextInput
          style={styles.input}
          placeholder="모집인원 수를 입력해주세요"
          value={dealNum}
          onChangeText={setDealNum}
          keyboardType="numeric"
        />

        <Text style={styles.label}>상세내용</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="게시글의 내용을 작성해 주세요."
          value={productContent}
          onChangeText={setProductContent}
          multiline
        />

        <Text style={styles.label}>마감일자</Text>
        <TouchableOpacity onPress={handleDatePress}>
          <TextInput
            style={styles.input}
            placeholder="마감 날짜"
            value={deadlineDate.toISOString().split('T')[0]}
            editable={false}
          />
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>{modalMessage}</Text>
              <TouchableOpacity
                style={[styles.okbutton, styles.closeButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>



        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>등록하기</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={deadlineDate}
            mode="date"
            display="spinner"
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date !== undefined) {
                setDeadlineDate(date);
              }
            }}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    //flexGrow: 1,
    justifyContent: 'center',
    //alignItems: 'center',
    padding: 20,
    backgroundColor: 'white', // 밝은 회색 배경으로 설정
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    paddingTop: 10,
    marginLeft: 5,
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
    fontSize: 16, // 작은 글씨 크기
    color: 'black', // 글씨 색상
    marginBottom: 8, // 입력 필드와 라벨 사이의 여백
    marginLeft: 3,
    fontWeight: '700',
  },
  scrollView: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: 'white', // 연한 회색
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20, // 둥근 모서리
    marginRight: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 30,
  },
  selectedButton: {
    backgroundColor: '#ddd',
  },
  buttonText: {
    fontSize: 14,
    color: '#000',
  },
  headerContainer: {
    flexDirection: 'row', // 아이콘과 텍스트가 수평으로 나란히 있도록 설정
    alignItems: 'center', // 수직 방향으로 중앙 정렬
    width: '100%', // 컨테이너 너비를 전체로 설정
    marginTop: 10, // 패딩 추가
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


});

export default PostCreateScreen;
