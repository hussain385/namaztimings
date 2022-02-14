import React, {useState} from 'react';
import HeaderComp from '../views/HeaderComp';
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DonationModal from '../views/DonationModal';

const Window_Height = Dimensions.get('screen').height;
const Window_Width = Dimensions.get('screen').width;

const Donation = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <HeaderComp navigation={navigation} heading="Donation Info" />
      <ScrollView>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Text style={{fontSize: 25, fontWeight: '600', marginBottom: 10}}>
            Masjid Name
          </Text>
          <Image
            source={require('../assests/image/donation.png')}
            style={{
              width: Window_Width * 0.6,
              height: Window_Height * 0.4,
            }}
          />
          <Text
            style={{
              marginHorizontal: Window_Width * 0.1,
              textAlign: 'center',
              fontSize: 16,
              marginTop: -10,
            }}>
            Various Hadith cite the Prophet (PBUH) saying:{' '}
            <Text style={{fontWeight: '700'}}>
              “Whoever builds a masjid for the sake of Allah, Allah will build
              for him a house in Paradise.”
            </Text>{' '}
            By donating, not only will you be providing a place of worship but
            laying foundations for your own spiritual rewards in this life and
            the next.
          </Text>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              backgroundColor: '#1F441E',
              padding: 10,
              borderRadius: 5,
              width: '70%',
              marginTop: 20,
              marginHorizontal: 10,
            }}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text style={{color: '#CEE6B4', fontSize: 16}}>
              Donation Details
            </Text>
          </TouchableOpacity>
          <DonationModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            editable={false}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default Donation;
