import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import HeaderComp from '../views/HeaderComp';
import {GetFavMasjidData} from '../store/firebase';
import {ActivityIndicator, Card} from 'react-native-paper';
import moment from 'moment';
import {isEmpty} from 'lodash/lang';

const Announcement = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const {
    masjid: masjidData,
    loading,
    error,
    GetDataFavMasjid: GetData,
  } = GetFavMasjidData();

  useEffect(() => {
    GetData();
  }, []);
  const announcements = [];
  masjidData.forEach(masjid => {
    masjid.announcements.forEach(announcement =>
      announcements.push(announcement),
    );
  });
  return (
    <View>
      <HeaderComp navigation={navigation} heading="Announcements" />
      {!isEmpty(announcements) ? (
        <FlatList
          style={{height: Dimensions.get('screen').height * 0.82}}
          data={announcements}
          renderItem={({item}) => (
            <>
              <Card
                onPress={() => {
                  setModalVisible(true);
                }}
                style={{
                  borderRadius: 5,
                  margin: 10,
                  shadowOpacity: 10,
                  elevation: 5,
                  borderBottomColor: '#229704',
                  borderBottomWidth: 10,
                }}>
                <Card.Actions>
                  <View style={{width: '100%', padding: 10}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View>
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={{
                            fontSize: 17,
                            width: Dimensions.get('screen').width * 0.5,
                          }}>
                          {item.description}
                        </Text>
                      </View>
                      <View>
                        <Text style={{marginTop: 6}}>
                          Dated:{' '}
                          {moment(item.createdAt?.seconds * 1000).format(
                            'DD/MM/YYYY',
                          )}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Card.Actions>
              </Card>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text style={styles.modalText}>Namaz Timings</Text>
                    <View
                      style={{
                        marginBottom: 10,
                        backgroundColor: '#eeee',
                        padding: 10,
                        borderRadius: 5,
                      }}>
                      <ScrollView style={{maxHeight: 200}}>
                        <Text>{item.description}</Text>
                      </ScrollView>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: Dimensions.get('screen').width * 0.7,
                      }}>
                      <Pressable
                        style={[styles.button, styles.buttonOpen]}
                        onPress={() => {
                          setModalVisible(!modalVisible);
                        }}>
                        <Text style={styles.textStyle}>Cancel</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </Modal>
            </>
          )}
        />
      ) : (
        <View
          style={{
            height: Dimensions.get('screen').height * 0.8,
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
          }}>
          <ActivityIndicator color="#1F441E" size="large" />
        </View>
      )}
    </View>
  );
};

export default Announcement;
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6d6d6d6b',
  },
  editTime: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#dddd',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: '40%',
    marginTop: 10,
  },
  buttonOpen: {
    backgroundColor: '#5C5C5C',
    marginRight: 15,
  },
  buttonClose: {
    backgroundColor: 'darkred',
    marginLeft: 15,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textStyle1: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    fontSize: 20,
    textAlign: 'center',
  },
});
