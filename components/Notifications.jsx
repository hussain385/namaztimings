import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Header} from 'react-native-elements';
import {
  isEmpty,
  isLoaded,
  populate,
  useFirestoreConnect,
} from 'react-redux-firebase';
import {useSelector} from 'react-redux';
import _ from 'lodash';

const Notification = ({navigation, route: {params}}) => {
  console.log(params);
  const {masjidId} = params;
  const populates = [
    {
      child: 'announcementList',
      root: 'announcement',
      childAlias: 'announcement',
    },
    {child: 'requestList', root: 'requests', childAlias: 'requests'},
  ];
  useFirestoreConnect([
    {
      collection: 'Masjid',
      doc: masjidId,
      populates,
      storeAs: 'tempAnnouncement',
    },
  ]);

  const firestore = useSelector(state => state.firestore);
  console.log(firestore);
  const masjidData = populate(firestore, 'tempAnnouncement', populates);

  console.log(masjidData);

  const data = _.map(masjidData?.announcement, (rawData, id) => {
    return {
      ...rawData,
      // createdAt: Date.parse(rawData.createdAt),
    };
  });

  console.log(data);

  return (
    <View>
      <Header
        containerStyle={{
          shadowOpacity: 50,
          elevation: 50,
        }}
        leftComponent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
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
              Notification
            </Text>
          </View>
        }
        rightComponent={
          <Icon
            name="shopping-cart"
            color="#ffff"
            size={26}
            style={{paddingRight: 10}}
          />
        }
        backgroundColor="#1F441E"
      />
      {isLoaded(masjidData) && !isEmpty(data) ? (
        _.map(data, (d, id) => {
          return <Text key={id}>{d.description}</Text>;
        })
      ) : isLoaded(masjidData) && isEmpty(data) ? (
        <Text>... Empty ...</Text>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default Notification;
