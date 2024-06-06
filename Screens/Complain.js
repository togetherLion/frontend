import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
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

  const handleSubmit = async () => {
    if (!selectedReason && otherReason.trim() === '') {
      Alert.alert('신고 사유를 선택하거나 입력해주세요.');
    } else {
      try {
        let selectedCategory = null;
        if (selectedReason) {
          selectedCategory = complainCategories[selectedReason];
        }

        // 서버로 POST 요청을 보냅니다.
        const response = await axios.post('http://192.168.200.116:8080/complain', {
          complainCategory: selectedCategory, // 영어 신고 카테고리
          complainContent: otherReason, // 신고 내용
          targetUserId: userId // 대상 사용자 ID
        });
        
        console.log('신고 내용 전송 결과:', response.data);
        
        // 신고 내용 전송 후 PostListScreen으로 이동합니다.
        navigation.navigate('PostListScreen');
      } catch (error) {
        console.error('Error submitting complain:', error);
        Alert.alert('신고하기 실패', '오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleSelectReason = (reason) => {
    setSelectedReason(reason === selectedReason ? null : reason);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>신고 사유 선택</Text>
      {Object.entries(reasons).map(([key, value]) => (
        <TouchableOpacity
          key={key}
          style={[styles.reasonButton, selectedReason === key && { backgroundColor: '#FFF3C1' }]}
          onPress={() => handleSelectReason(key)}
        >
          <Text style={styles.reasonButtonText}>{value}</Text>
        </TouchableOpacity>
      ))}
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333333',
  },
  reasonButton: {
    padding: 15,
    borderRadius: 8,
    borderColor: '#cccccc',
    borderWidth: 1,
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: '#ffffff',
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
    minHeight: 100, // 최소 높이 지정
  },
  submitButton: {
    backgroundColor: '#FFD700', // 짙은 노란색
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Complain;