import React, { useState } from 'react';
import { Alert, TextInput, StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import axios from 'axios';


const EditName = ({ navigation, route }) => {

    const [postId, setPostId] = useState(route.params?.postId || '');
    const [roomName, setRoomName] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');



    const handleSubmit = () => { // 다음으로 넘어갈때
        if (roomName == '') {
            setModalMessage('채팅방 이름이 입력되지 않았습니다.');
            setModalVisible(true);
        } else {
            try {
                axios.post("http://192.168.200.116:8080/chat/check-and-create-room", null, {
                    params: {
                        postId: postId,
                        roomName: roomName
                    }
                })

                setModalMessage('채팅방이 생성되었습니다.');
                setModalVisible(true);
            } catch (error) {
                console.error('Error createChat:', error)
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
            </View>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>
                    채팅방 이름을 {'\n'}
                    입력해주세요
                </Text>
            </View>

            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => setRoomName(text)}
                    value={roomName}
                />
            </View>


            <View style={styles.bottomSpace}></View>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>채팅방 생성하기</Text>
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
                            style={[styles.button, styles.closeButton]}
                            onPress={() => {
                                setModalVisible(false);
                                // 확인 버튼을 클릭하면 이름이 변경되고 UserInform으로 이동
                                if (modalMessage === '이름이 변경되었습니다.') {
                                    navigation.navigate('UserInform');
                                }
                            }}
                        >
                            <Text style={styles.closeButtonText}>확인</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>


    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 20,
        paddingTop: 60,
        marginLeft: 10,
        marginRight: 5,
    },
    header: {
        width: '100%',
        alignItems: 'flex-start',
        marginBottom: 50,
    },
    titleContainer: {
        width: '100%',
        alignItems: 'flex-start',
        marginBottom: 40,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'left',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 15,
    },
    inputRow: {
        width: '100%',
        marginBottom: 15,
    },
    input: {
        width: '70%',
        height: 40,
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
        paddingHorizontal: 10,
    },
    checkButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#000',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    checkButtonText: {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
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
    bottomSpace: {
        height: 20,
        marginTop: 10,
    },
});

export default EditName
