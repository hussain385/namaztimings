import _ from 'lodash';
import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {useSelector} from 'react-redux';
import {
  isEmpty,
  isLoaded,
  populate,
  useFirestore,
  useFirestoreConnect,
} from 'react-redux-firebase';
import {modifyData} from '../store/firebase';
import AdminCard from '../views/AdminCard';
import AdminView from '../views/AdminView';
import HeaderComp from '../views/HeaderComp';

const populates = [
  {child: 'requestList', root: 'requests', childAlias: 'requests'},
  {child: 'adminId', root: 'users', childAlias: 'admin'},
];

const Admin = ({navigation}) => {
  const [notify, setNotify] = React.useState(0);
  const {auth, profile} = useSelector(state => state.firebase);
  const firestore = useSelector(state => state.firestore);
  const Firestore = useFirestore();
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
  // console.log('From admin', snapshot);
  React.useEffect(() => {
    if (isLoaded(snapshot)) {
      setNotify(0);
      _.forEach(snapshot, doc => {
        setNotify(
          prevState =>
            prevState + (doc.requestList?.length ? doc.requestList?.length : 0),
        );
      });
      // Firestore.unsetListeners([{collection: 'Masjid'}]);
      // firestore.unsetListener('Masjid');
    }

    return () => {
      console.log('unsubscribing....');
    };
  }, [snapshot]);

  const adminMasjid = _.map(snapshot, (doc, id) => {
    return {...doc, id};
  });
  console.log(adminMasjid.length, '===> new');
  return (
    <SafeAreaView>
      {adminMasjid.length > 1 && (
        <HeaderComp navigation={navigation} heading="Admin" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 60,
  },
  mncontainer: {
    flex: 1,
    marginTop: 30,
  },
  navigationContainer: {
    backgroundColor: '#1F441E',
  },
  paragraph: {
    padding: 16,
    fontSize: 15,
    textAlign: 'center',
  },
});

export default Admin;
