import _ from 'lodash';
import React from 'react';
import {
  ActivityIndicator,
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
import {modifyData, selectFirebase, selectFirestore} from '../store/firebase';
import AdminCard from '../views/AdminCard';
import AdminView from '../views/AdminView';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Header} from 'react-native-elements';

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
  ]);
  const snapshot = populate(firestore, 'myMasjids', populates);

  const adminMasjid = _.map(snapshot, (doc, id) => {
    return {...doc, id};
  });
  console.log(adminMasjid, '===> new');
  return (
    <SafeAreaView>
      {adminMasjid.length >= 1 && (
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
        <ActivityIndicator color="#1F441E" size="large" />
      )}
      {adminMasjid.length === 1 ? (
        <>
          {_.map(snapshot, (doc, id) => {
            const data = modifyData(doc, id, 0);
            return (
              <AdminView
                route={{params: {Masjid: data, masjidId: id}}}
                navigation={navigation}
                isSingle={true}
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
          keyExtractor={item => item.id}
          style={{
            height: Dimensions.get('window').height - 80,
          }}
          initialNumToRender={5}
        />
      )}
    </SafeAreaView>
  );
};

export default Admin;
