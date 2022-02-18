import React, {useState} from 'react';
import {Dimensions, Image, Linking, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Favbtn from './Favbtn';
import AdminRequest from './AdminRequest';

const TopPart = ({masjidData}) => {
  const [more, setMore] = useState(false);
  return (
    <View style={styles.mainView1}>
      <View style={styles.mainView2}>
        <View style={[styles.elementStyle, {paddingTop: 0}]}>
          <Icon
            style={styles.iconStyle}
            name="mosque"
            color="#5C5C5C"
            size={20}
          />
          <Text>{masjidData.name}</Text>
        </View>
        <View style={styles.elementStyle}>
          <Icon
            style={styles.iconStyle}
            name="map-marker-alt"
            color="#5C5C5C"
            size={20}
          />
          <View>
            <Text
              style={{width: Dimensions.get('screen').width * 0.45}}
              numberOfLines={more ? undefined : 1}>
              {masjidData.address}
            </Text>
            <Text
              onPress={() => {
                setMore(!more);
              }}
              style={{color: '#1F441E'}}>
              View {!more ? 'more' : 'less'}
            </Text>
          </View>
        </View>
        {masjidData.user.name !== 'No Admin' ? (
          <>
            <View style={styles.elementStyle}>
              <Icon
                style={styles.iconStyle}
                name="user-alt"
                color="#5C5C5C"
                size={20}
              />
              <Text>{masjidData.user.name || 'hussain'}</Text>
            </View>
            <View style={styles.elementStyle}>
              <Icon
                style={styles.iconStyle}
                name="phone-alt"
                color="#5C5C5C"
                size={20}
              />
              <Text>{masjidData.user.phone || '+920000000000'}</Text>
            </View>
          </>
        ) : (
          <View style={styles.elementStyle}>
            <Icon
              style={styles.iconStyle}
              name="user-alt"
              color="#1F441E"
              size={20}
            />
            <AdminRequest id={masjidData.key} />
          </View>
        )}
      </View>
      <View style={styles.mainView4}>
        <View style={{alignItems: 'flex-end'}}>
          <Favbtn favId={masjidData.key} isBig={false} />
        </View>
        <View style={styles.direction}>
          <Icon
            name="directions"
            color="#900000"
            size={24}
            style={{marginRight: 5}}
          />
          <Text
            style={{textDecorationLine: 'underline', color: 'darkred'}}
            onPress={async () => {
              await Linking.openURL(`${masjidData.gLink}`);
            }}>
            {masjidData.distance} Km Away
          </Text>
        </View>
        <View style={styles.imageView}>
          <Image
            source={{
              uri: `${
                masjidData.pictureURL ||
                'data:image/jpeg;base64,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'
              }`,
            }}
            style={{
              width: Dimensions.get('screen').width * 0.3,
              height: Dimensions.get('screen').height * 0.12,
              backgroundColor: 'grey',
              borderRadius: 10,
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default TopPart;

const styles = StyleSheet.create({
  mainView1: {
    flexDirection: 'row',
  },
  mainView2: {
    flexDirection: 'column',
  },
  subView1: {
    width: Dimensions.get('screen').width * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  subView2: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    alignContent: 'center',
    width: Dimensions.get('screen').width * 0.5,
  },
  mainView3: {
    flexDirection: 'row',
  },
  mainView4: {
    width: Dimensions.get('screen').width * 0.35,
  },
  imageView: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  direction: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 10,
  },
  elementStyle: {
    flexDirection: 'row',
    width: Dimensions.get('screen').width * 0.6,
    paddingTop: 17,
  },
  iconStyle: {
    alignSelf: 'center',
    textAlign: 'center',
    width: 50,
  },
});
