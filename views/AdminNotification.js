import firestore from '@react-native-firebase/firestore';
import _ from 'lodash';
import React from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Header} from 'react-native-elements';
import {Card} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useSelector} from 'react-redux';
import {
  isEmpty,
  isLoaded,
  populate,
  useFirestoreConnect,
} from 'react-redux-firebase';
import Edit from './Edit';

const markAsRead = async reqId => {
  await firestore().collection('requests').doc(reqId).update({
    isRead: true,
  });
};

const deleteFunc = (masjidId, reqId) => {
  console.log(masjidId, reqId);
  firestore()
    .collection('Masjid')
    .doc(masjidId)
    .update({
      requestList: firestore.FieldValue.arrayRemove(reqId),
    })
    .then(() => {
      firestore()
        .collection('requests')
        .doc(reqId)
        .delete()
        .then(value1 => {
          console.log('deleted', value1);
        });
    });
};

const Item = ({
  fajar,
  zohar,
  asar,
  magrib,
  isha,
  id,
  MasjidId,
  admin,
  userName,
  userContact,
}) => (
  <Card
    style={{
      borderRadius: 5,
      margin: 10,
      shadowOpacity: 10,
      elevation: 5,
    }}>
    <Card.Actions>
      <View style={{width: '100%'}}>
        <View style={{flexDirection: 'row', margin: 5}}>
          <View style={{flexGrow: 1}}>
            <Text style={{fontSize: 17}}>User Name: {userName}</Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', margin: 5}}>
          <View style={{flexGrow: 1}}>
            <Text style={{fontSize: 17}}>User Contact: {userContact}</Text>
          </View>
        </View>
        <View style={{backgroundColor: '#eeee', padding: 5, borderRadius: 8}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{flexGrow: 1}} />
            <View>
              <Edit
                fajar={fajar}
                zohar={zohar}
                asar={asar}
                magrib={magrib}
                isha={isha}
                uid={MasjidId}
                isRequest={false}
                userInfo={false}
                value="View"
              />
            </View>
          </View>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <View style={{flexGrow: 5}}>
              <Text style={{textAlign: 'center', fontSize: 14}}>Fajar</Text>
              <Text style={{textAlign: 'center', fontSize: 14}}>{fajar}</Text>
            </View>
            <View style={{flexGrow: 5}}>
              <Text style={{textAlign: 'center', fontSize: 14}}>Zohar</Text>
              <Text style={{textAlign: 'center', fontSize: 14}}>{zohar}</Text>
            </View>
            <View style={{flexGrow: 5}}>
              <Text style={{textAlign: 'center', fontSize: 14}}>Asar</Text>
              <Text style={{textAlign: 'center', fontSize: 14}}>{asar}</Text>
            </View>
            <View style={{flexGrow: 5}}>
              <Text style={{textAlign: 'center', fontSize: 14}}>Magrib</Text>
              <Text style={{textAlign: 'center', fontSize: 14}}>{magrib}</Text>
            </View>
            <View style={{flexGrow: 5}}>
              <Text style={{textAlign: 'center', fontSize: 14}}>Isha</Text>
              <Text style={{textAlign: 'center', fontSize: 14}}>{isha}</Text>
            </View>
          </View>
        </View>

        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            padding: 10,
          }}>
          <TouchableOpacity onPress={() => markAsRead(id)}>
            <Text style={{fontSize: 15, color: 'green'}}>Mark As Read</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => deleteFunc(MasjidId, id)}>
            <Text style={{fontSize: 15, color: 'red'}}>Delete Message</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Card.Actions>
  </Card>
);

const populates = [
  {child: 'requestList', root: 'requests', childAlias: 'requests'},
  {child: 'adminId', root: 'users', childAlias: 'admin'},
];

const AdminNotification = ({navigation}) => {
  // const [data, setData] = useState([]);
  // const {myMasjids} = useSelector(state => state.firestore.ordered);
  // const {auth} = useSelector(state => state.firebase);
  const {profile, auth} = useSelector(state => state.firebase);
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

  const snapshot = populate(
    useSelector(state => state.firestore),
    'myMasjids',
    populates,
  );

  const tempData = [];
  if (isLoaded(snapshot)) {
    console.log(snapshot);
    _.map(snapshot, (doc, id) => {
      if (doc.requests) {
        doc.requests.map(d => {
          tempData.push({
            ...d,
            createdAt: Date.parse(d.createdAt),
            masjidId: id,
            admin: doc.admin,
          });
        });
      }
    });
  }
  const data = _.sortBy(
    _.filter(tempData, function (o) {
      return !o.isRead;
    }),
    'createdAt',
  );

  const renderItem = ({item}) => {
    console.log(item);
    if (!_.isUndefined(item.timing)) {
      return (
        <Item
          fajar={item.timing.fajar}
          zohar={item.timing.zohar}
          asar={item.timing.asar}
          magrib={item.timing.magrib}
          isha={item.timing.isha}
          id={item.id} //Own ID
          MasjidId={item.masjidId}
          admin={item.admin}
          userName={item.timing.userName}
          userContact={item.timing.userContact}
        />
      );
    }
  };

  return (
    <SafeAreaView>
      <Header
        containerStyle={{
          shadowOpacity: 50,
          elevation: 50,
        }}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.navigate('Admin view')}>
            <Icon
              name="arrow-left"
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
                marginTop: 5,
                textAlign: 'center',
              }}>
              Requests
            </Text>
          </View>
        }
        backgroundColor="#1F441E"
      />
      <FlatList
        data={data}
        inverted={true}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={{
          height: Dimensions.get('window').height - 80,
        }}
        initialScrollIndex={data.length - 1}
        initialNumToRender={5}
      />
    </SafeAreaView>
  );
};

export default AdminNotification;
