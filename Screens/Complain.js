import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, Modal } from 'react-native';
import axios from 'axios';

const reasons = {
  CANCEL: '무단 거래 파기',
  DISCOMFORT: '불쾌감 유발',
  NOPAY: '미송금',
  ADVERT: '광고성 게시글',
  BANSALE: '거래 금지 품목 판매',
  OTHERS: '기타'
};

const complainCategories = {
  CANCEL: 'CANCEL',
  DISCOMFORT: 'DISCOMFORT',
  NOPAY: 'NOPAY',
  ADVERT: 'ADVERT',
  BANSALE: 'BANSALE',
  OTHERS: 'OTHERS'
};

const Complain = ({ navigation, route }) => {
  const [otherReason, setOtherReason] = useState('');
  const [selectedReason, setSelectedReason] = useState(null);
  const [userId, setUserId] = useState(route.params?.userId || '');
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [errorModalVisible, setErrorModalVisible] = useState(false); // 신고 사유 미입력 모달 상태

  const handleSubmit = async () => {
    if (!selectedReason || otherReason.trim() === '') {
      setModalMessage('신고 사유를 빈칸없이 작성해주세요.');
      setErrorModalVisible(true); // 신고 사유 미입력 모달 열기
    } else {
      try {
        let selectedCategory = null;
        if (selectedReason) {
          selectedCategory = complainCategories[selectedReason];
        }

        const response = await axios.post('http://192.168.219.45:8080/complain', {
          complainCategory: selectedCategory,
          complainContent: otherReason,
          targetUserId: userId
        });

        console.log('신고 내용 전송 결과:', response.data);

        setModalMessage('신고가 성공적으로 접수되었습니다.');
        setConfirmModalVisible(true);
      } catch (error) {
        console.error('Error submitting complain:', error);
        setModalMessage('신고하기 실패, 오류가 발생했습니다. 다시 시도해주세요.');
        setConfirmModalVisible(true);
      }
    }
  };

  const handleSelectReason = (reason) => {
    setSelectedReason(reason);
    setModalVisible(false);
  };

  const onConfirmDelete = () => {
    setConfirmModalVisible(false);
    navigation.pop();
  };

  const closeErrorModal = () => {
    setErrorModalVisible(false); // 신고 사유 미입력 모달 닫기
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>신고 이유를 {'\n'}작성해주세요</Text>
      <TouchableOpacity style={styles.dropdownButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.dropdownButtonText}>
          {selectedReason ? reasons[selectedReason] : '신고 사유를 선택해주세요'}
        </Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {Object.entries(reasons).map(([key, value]) => (
              <TouchableOpacity
                key={key}
                style={styles.reasonButton}
                onPress={() => handleSelectReason(key)}
              >
                <Text style={styles.reasonButtonText}>{value}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
      <TextInput
        placeholder="신고 사유를 자세히 적어주세요."
        value={otherReason}
        onChangeText={setOtherReason}
        style={styles.input}
        multiline
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>제출</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.closeButton]}
                onPress={onConfirmDelete}
              >
                <Text style={styles.closeButtonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={errorModalVisible}
        onRequestClose={closeErrorModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.closeButton]}
                onPress={closeErrorModal}
              >
                <Text style={styles.closeButtonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  header: {
    marginTop: 50,
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333333',
    marginBottom: 40,
  },
  dropdownButton: {
    padding: 15,
    borderRadius: 15,
    borderColor: '#cccccc',
    borderWidth: 1,
    marginBottom: 15,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333333',
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
  reasonButton: {
    padding: 12,
    borderRadius: 20,
    borderColor: '#cccccc',
    borderWidth: 1,
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    width: '80%',
  },
  reasonButtonText: {
    fontSize: 16,
    color: '#333333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: '#ffcc80',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
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
});

export default Complain;
