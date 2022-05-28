import _ from 'lodash';
import React, {useMemo, useState} from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {
  isEmpty,
  isLoaded,
  populate,
  useFirestoreConnect,
} from 'react-redux-firebase';
import {modifyData, selectFirebase, selectFirestore} from '../../store/firebase';
import AdminCard from './AdminCard';
import AdminView from './AdminView';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Header} from 'react-native-elements';
import {ActivityIndicator} from 'react-native-paper';

const populates = [
  {child: 'requestList', root: 'requests', childAlias: 'requests'},
  {child: 'adminId', root: 'users', childAlias: 'admin'},
];

const Admin = ({navigation}) => {
  const {auth, profile} = useSelector(selectFirebase);
  const firestore = useSelector(selectFirestore);
  useFirestoreConnect([
    {
      collection: 'Masjid',
      where: !profile.isAdmin && [
        ['adminId', '==', isLoaded(auth) && !isEmpty(auth) ? auth.uid : ''],
      ],
      storeAs: 'myMasjids',
      populates,
    },
    {
      collection: 'requests',
    },
  ]);
  const snapshot = populate(firestore, 'myMasjids', populates);

  const adminMasjid = useMemo(
    () =>
      _.map(snapshot, (doc, id) => {
        return {...doc, id};
      }),
    [snapshot],
  );

  return (
    <SafeAreaView>
      {adminMasjid.length > 1 && (
        <Header
          containerStyle={{
            shadowOpacity: 50,
            elevation: 50,
          }}
          leftComponent={
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Icon
                name="bars"
                color="#ffff"
                size={26}
                style={{paddingLeft: 10}}
              />
            </TouchableOpacity>
          }
          centerComponent={
            <View style={{textAlign: 'center'}}>
              <Text
                style={{
                  color: '#ffff',
                  fontSize: 22,
                  marginBottom: 5,
                  textAlign: 'center',
                }}>
                Admin
              </Text>
            </View>
          }
          backgroundColor="#1F441E"
        />
      )}
      {!isLoaded(snapshot) && (
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
      {adminMasjid.length === 1 ? (
        <>
          {_.map(snapshot, (doc, id) => {
            const data = modifyData(doc, id, 0);
            return (
              <AdminView
                route={{
                  params: {Masjid: data, masjidId: id, isSingle: true},
                }}
                navigation={navigation}
              />
            );
          })}
        </>
      ) : (
        <FlatList
          data={adminMasjid}
          renderItem={item => (
            <AdminCard nav={navigation} masjid={item.item} key={item.item.id} />
          )}
          initialNumToRender={5}
          keyExtractor={item => item.id}
          style={{
            height: Dimensions.get('window').height - 80,
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default Admin;
