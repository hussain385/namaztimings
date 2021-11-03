import _ from 'lodash';
import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  SafeAreaView,
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
import HeaderComp from '../views/HeaderComp';

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
  console.log(adminMasjid.length, '===> new');
  return (
    <SafeAreaView>
      {adminMasjid.length > 1 && (
        <HeaderComp navigation={navigation} to={'home'} heading="Admin" />
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
                route={{params: {data, masjidId: id}}}
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
