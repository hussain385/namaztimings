import React, {useEffect, useState} from 'react';
import {Dimensions, FlatList, StyleSheet, Text, View} from 'react-native';
import HeaderComp from '../views/HeaderComp';
import {GetFavMasjidData} from '../store/firebase';
import {ActivityIndicator} from 'react-native-paper';
import {isEmpty} from 'lodash/lang';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AnnoucmentCard from '../views/AnnoucmentCard';
import _ from 'lodash';

const Announcement = ({navigation}) => {
  const [announcements, setAnnoucements] = useState(null);
  const announcements1 = [];
  const {
    masjid: masjidData,
    loading,
    error,
    GetDataFavMasjid: GetData,
  } = GetFavMasjidData();

  useEffect(() => {
    let isSubscribed = true;

    async function fetchData() {
      await GetData();
    }

    fetchData().then(r => {
      // if (announcements === undefined) {
      //   setNoAnnoucement(true);
      // }
      console.log(r);
    });
    return () => (isSubscribed = false);
  }, []);

  useEffect(() => {
    masjidData.map(masjid => {
      if (masjid.announcements) {
        masjid.announcements.map(announcement =>
          announcements1.push({
            name: masjid.name,
            createdAt: announcement.createdAt,
            description: announcement.description,
          }),
        );
        setAnnoucements(announcements1);
      }
    });
  }, [masjidData]);

  return (
    <View>
      <HeaderComp navigation={navigation} heading="Announcements" />
      {!loading && isEmpty(announcements) ? (
        <View
          style={{
            alignItems: 'center',
            marginVertical: '50%',
          }}>
          <AntDesign name="folder1" size={50} />
          <Text>No Favourites</Text>
        </View>
      ) : (
        <>
          {!isEmpty(announcements) ? (
            <FlatList
              style={{height: Dimensions.get('screen').height * 0.82}}
              data={_.orderBy(announcements, 'createdAt', 'desc')}
              renderItem={({item}, key) => (
                <View key={key}>
                  <AnnoucmentCard item={item} />
                </View>
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
        </>
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
