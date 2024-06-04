import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, StyleSheet, Text, Modal, Pressable } from 'react-native';
import * as Location from 'expo-location';

const Place = ({ navigation, route }) => {

  const [phone, setPhone] = useState(route.params?.phone || '');
  const [mapRegion, setMapRegion] = useState(null);
  const [address, setAddress] = useState(null);
  const [location, setLocation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true); // 위치 정보를 가져오는 중 여부를 나타내는 상태
  //const navigation = useNavigation();

  const confirmAddress = () => {
    navigation.navigate('SignupScreen', { phone:phone, userAddress: address.formattedAddress, userLat: location.coords.latitude, userLong: location.coords.longitude});
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let addressResponse = await Location.reverseGeocodeAsync(location.coords);
      console.log(location);
      console.log(addressResponse);

      setLocation(location);
      setAddress(addressResponse[0]); // 첫 번째 주소만 사용
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
      setLoading(false); // 위치 정보 가져오기가 완료되었음을 표시
    })();
  }, []);

  return (
    <View style={styles.container}>
      {mapRegion && (
        <MapView
          style={styles.map}
          region={mapRegion}
          showsUserLocation={true}
        >
          <Marker coordinate={mapRegion}>
            <Text>{address ? `${address.formattedAddress}` : ''}</Text>
          </Marker>
        </MapView>
      )}
      {!loading && ( // 위치 정보를 가져오는 중이 아닐 때만 버튼 표시
        <View style={styles.addressButton}>
          <Pressable onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>주소 설정</Text>
          </Pressable>
        </View>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>해당 위치로 주소를 설정하시겠습니까?</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={confirmAddress}
            >
              <Text style={styles.closeButton}>확인</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
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
    //justifyContent: 'center',
    //transform: [{ translateX: '-50%' }, { translateY: '-50%' }], // 버튼을 중앙으로 이동
  },
  buttonText: {
    color: 'blue',
    fontSize: 30,
    fontWeight: 'bold',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: 'white',
  },
  closeButton: {
    backgroundColor: '#fff',
    //marginTop: 10,
    width: '50%',
  },
});

export default Place;
