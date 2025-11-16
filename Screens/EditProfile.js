import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const EditProfile = ({ navigation, route }) => {

    const [nickname, setNickname] = useState(route.params?.nickname || '');
    const [profileIntro, setProfileIntro] = useState(route.params?.profileIntro || '');
    const [profilePicture, setProfilePicture] = useState(route.params?.profilePicture || '');
    //const [base64Image, setBase64Image] = useState('');

    const requestPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('이미지 접근 권한이 필요합니다.');
        }
    };

    React.useEffect(() => {
        requestPermission();
    }, []);

    // const pickImage = async () => {
    //     let result = await ImagePicker.launchImageLibraryAsync({
    //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //         allowsEditing: true,
    //         aspect: [3, 3],
    //         quality: 1,
    //     });

    //     if (!result.canceled) {
    //         const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
    //             encoding: FileSystem.EncodingType.Base64,
    //         });
    //         setProfilePicture(`data:image/jpeg;base64,${base64}`);
    //     }
    // };

    const pickImage = async () => {
        try {
          // 권한 체크/요청
          const perm = await ImagePicker.getMediaLibraryPermissionsAsync();
          if (perm.status !== 'granted') {
            const req = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (req.status !== 'granted') {
              alert('이미지 접근 권한이 필요합니다.');
              return;
            }
          }
      
          const supportsNew = !!ImagePicker.MediaType; // 54+면 true, 53이면 false
      
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: supportsNew ? 'images' : ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 3],
            quality: 0.8,
            base64: true, // ← 옛날처럼 바로 base64 받기
          });
      
          const canceled = supportsNew ? result?.canceled : result?.cancelled;
          if (canceled) return;
      
          const asset = result?.assets?.[0];
          if (!asset) return;
      
          const mime = asset.mimeType || 'image/jpeg';
          if (!asset.base64) {
            alert('이미지 Base64가 비어 있습니다.');
            return;
          }
          setProfilePicture(`data:${mime};base64,${asset.base64}`);
        } catch (e) {
          console.error('[pickImage] error', e);
          alert('이미지 선택 중 오류가 발생했습니다.');
        }
      };
      

    const saveProfile = async () => {
        try {
            const resp = await axios.post("http://172.30.1.81:8080/user/modifyProfile", {
                userId: 15,
                nickname: nickname,
                profileIntro: profileIntro,
                profilePicture: profilePicture,
            });
            //console.log(resp.data);
            if (resp.data) {
                console.log("프로필 수정 성공");
                navigation.goBack();
            } else {
                console.log("프로필 수정 실패");
            }
        } catch (err) {
            console.log(`에러 메시지: ${err}`);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={pickImage}>
                    <Avatar
                        size={90}
                        rounded
                        source={{ uri: profilePicture }}
                        containerStyle={styles.avatar}
                    >
                        <Avatar.Accessory size={24} />
                    </Avatar>
                </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>닉네임</Text>
                <TextInput
                    style={styles.input}
                    value={nickname}
                    onChangeText={setNickname}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>자기소개</Text>
                <TextInput
                    style={styles.input}
                    value={profileIntro}
                    onChangeText={setProfileIntro}
                    multiline
                />
            </View>
            <Button
                title="저장"
                buttonStyle={styles.saveButton}
                onPress={saveProfile}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        marginTop: 100,
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        marginBottom: 20,
    },
    inputContainer: {
        marginVertical: 10,
        marginHorizontal: 30,
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
    },
    input: {
        fontSize: 16,
        height: 40,
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
        paddingHorizontal: 10,
    },
    saveButton: {
        marginTop: 30,
        backgroundColor: '#ffcc80',
        borderRadius: 10,
        paddingHorizontal: 20,
        marginHorizontal: 30,
        marginVertical: 20,
    },
});

export default EditProfile;
