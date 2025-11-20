import React, { useState, useEffect } from 'react';
import { TouchableOpacity, ImageBackground, View, StyleSheet, Platform, Text, TextInput, ScrollView, Alert, KeyboardAvoidingView, Button, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImageManipulator from 'expo-image-manipulator';

const SERVER_URL = 'http://165.229.169.110:8080/posts';

const PostEditScreen = ({ navigation, route }) => {
  const { post } = route.params; // 전달받은 post 객체
  const [photo, setPhoto] = useState(post.postPicture);
  const [productName, setProductName] = useState(post.productName);
  const [price, setPrice] = useState(post.price.toString());
  const [productContent, setProductContent] = useState(post.productContent);
  const [dealNum, setDealNum] = useState(post.dealNum.toString());
  const [deadlineDate, setDeadlineDate] = useState(new Date(post.deadlineDate));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedButton, setSelectedButton] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {

    setSelectedButton(statusMapping2[post.dealState]);
    setSelectedStatus(post.dealState);


    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('죄송합니다. 이 기능을 사용하려면 카메라 롤 권한이 필요합니다!');
        }
      }
    })();
  }, []);

  // const selectPhoto = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: false,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   if (!result.cancelled && result.assets && result.assets.length > 0) {
  //     const base64Image = await compressImageAndConvertToBase64(result.assets[0].uri);
  //     setPhoto(`data:image/jpeg;base64,${base64Image}`);
  //   }
  // };

  // const compressImageAndConvertToBase64 = async (uri) => {
  //   try {
  //     const manipResult = await ImageManipulator.manipulateAsync(
  //       uri,
  //       [{ resize: { width: 800 } }],
  //       { compress: 0.5 }
  //     );
  //     const base64Image = await FileSystem.readAsStringAsync(manipResult.uri, {
  //       encoding: FileSystem.EncodingType.Base64,
  //     });
  //     return base64Image;
  //   } catch (error) {
  //     console.error("Error compressing image and converting to Base64:", error);
  //     throw error;
  //   }
  // };

  const selectPhoto = async () => {
    try {
      // 권한 체크
      const perm = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (perm.status !== 'granted') {
        const req = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (req.status !== 'granted') {
          Alert.alert('알림', '사진 접근 권한이 필요합니다.');
          return;
        }
      }
  
      // ✅ SDK 54: 'images' (문자열) 사용
      // ✅ SDK 53: MediaTypeOptions.Images 사용
      const supportsNew = !!ImagePicker.MediaType; // 54+면 true, 53이면 false
      const pickOptions = {
        mediaTypes: supportsNew ? 'images' : ImagePicker.MediaTypeOptions.Images,
        base64: true,
        quality: 0.8,
        allowsEditing: false,
      };
  
      const result = await ImagePicker.launchImageLibraryAsync(pickOptions);
  
      // SDK마다 필드 이름이 다름: canceled(54) / cancelled(53)
      const canceled = supportsNew ? result?.canceled : result?.cancelled;
      if (canceled) return;
  
      const asset = result?.assets?.[0];
      if (!asset) return;
  
      const mime = asset.mimeType || 'image/jpeg';
      if (!asset.base64) {
        Alert.alert('알림', '이미지 Base64가 비어 있습니다.');
        return;
      }
      setPhoto(`data:${mime};base64,${asset.base64}`);
    } catch (e) {
      console.error('[pick] error', e);
      Alert.alert('에러', '이미지 선택 중 오류가 발생했습니다.');
    }
  };
  
  const statusMapping = {
    "모집중": "FIRST",
    "입금 대기중": "SECOND",
    "상품 배송중": "THIRD",
    "상품 전달 대기": "FOURTH",
    "거래 완료": "FIFTH"
  };

  const statusMapping2 = {
    "FIRST": "모집중",
    "SECOND": "입금 대기중",
    "THIRD": "상품 배송중",
    "FOURTH": "상품 전달 대기",
    "FIFTH": "거래 완료"
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
    if (!productName || !price || !productContent || !dealNum || !deadlineDate || !photo || !selectedStatus) {
      setModalMessage('빈칸 없이 모두 입력해 주세요.');
      setModalVisible(true);
      return;
    } else {
      axios.put(`${SERVER_URL}/${post.postId}`, {
        productName: productName,
        productContent: productContent,
        dealNum: dealNum,
        deadlineDate: deadlineDate,
        dealState: statusMapping[selectedStatus],
        price: removeCommas(price),
        postPicture: photo,
      }).then(function (response) {
        console.log(response.data);
        if (response.data) {
          setModalMessage('게시글이 수정되었습니다.');
          setModalVisible(true);
          navigation.navigate('PostDetail', { postId: post.postId });
        } else {
          setModalMessage('게시글 수정에 실패했습니다.');
          setModalVisible(true);
        }
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
          <Text style={styles.header}>게시글 수정</Text>
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
            <TouchableOpacity
              key={status}
              style={[
                styles.button,
                selectedButton === status && styles.selectedButton
              ]}
              onPress={() => handleButtonPress(status)}
            >
              <Text style={styles.buttonText}>{status}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>가격</Text>
        <TextInput
          style={styles.input}
          placeholder="가격을 입력해주세요"
          value={formatPrice(price)}
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
          <Text style={styles.submitButtonText}>수정하기</Text>
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
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
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
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1.5,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  placeholderText: {
    color: '#888',
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
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    color: 'black',
  },
  multilineInput: {
    height: 150,
    textAlignVertical: 'top',
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#ffcc80',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  label: {
    fontSize: 16,
    color: 'black',
    marginBottom: 8,
    marginLeft: 3,
    fontWeight: '700',
  },
  scrollView: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
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
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
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

export default PostEditScreen;
