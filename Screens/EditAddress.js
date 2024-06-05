import React, { useState, useEffect } from 'react'
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location'
import axios from 'axios'

const EditAddress = ({ navigation, route }) => {
  const [phone, setPhone] = useState(route.params?.phone || '')
  const [mapRegion, setMapRegion] = useState(null)
  const [address, setAddress] = useState(null)
  const [location, setLocation] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const handleAddressChange = () => {
    axios
      .post('http://192.168.200.142:8080/user/changeAddr', {
        address: address.formattedAddress,
        userLat: location.coords.latitude,
        userLong: location.coords.longitude,
      })
      .then(function (resp) {
        console.log(resp.data)
        setModalMessage('주소가 변경되었습니다.')
        setConfirmationModalVisible(false)
        setModalVisible(true)
      })
      .catch(function (err) {
        setModalMessage('주소 변경에 실패했습니다.')
        setConfirmationModalVisible(false)
        setModalVisible(true)
        console.log(`에러 메시지: ${err}`)
      })
  }

  useEffect(() => {
    ;(async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        console.log('Permission to access location was denied')
        return
      }

      let location = await Location.getCurrentPositionAsync({})
      let addressResponse = await Location.reverseGeocodeAsync(location.coords)
      console.log(location)
      console.log(addressResponse)

      setLocation(location)
      setAddress(addressResponse[0]) // 첫 번째 주소만 사용
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      })
      setLoading(false) // 위치 정보 가져오기가 완료되었음을 표시
    })()
  }, [])

  return (
    <View style={styles.container}>
      {mapRegion && (
        <MapView style={styles.map} region={mapRegion} showsUserLocation={true}>
          <Marker coordinate={mapRegion}>
            <Text>{address ? `${address.formattedAddress}` : ''}</Text>
          </Marker>
        </MapView>
      )}
      {!loading && (
        <View style={styles.addressButton}>
          <TouchableOpacity onPress={() => setConfirmationModalVisible(true)}>
            <Text style={styles.buttonText}>주소 설정</Text>
          </TouchableOpacity>
        </View>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmationModalVisible}
        onRequestClose={() => setConfirmationModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              해당 위치로 주소를 설정하시겠습니까?
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={handleAddressChange}
            >
              <Text style={styles.closeButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
                setModalVisible(false)
                if (modalMessage === '주소가 변경되었습니다.') {
                  navigation.navigate('UserInform')
                }
              }}
            >
              <Text style={styles.closeButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  addressButton: {
    position: 'absolute',
    top: '55%', // 화면 세로 중앙
    left: '43%', // 화면 가로 중앙
  },
  buttonText: {
    color: 'blue',
    fontSize: 30,
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
  button: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    //elevation: 2,
  },
  closeButton: {
    backgroundColor: '#fff',
    width: '50%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#000',
    fontSize: 17,
    fontWeight: 'bold',
  },
})

export default EditAddress
