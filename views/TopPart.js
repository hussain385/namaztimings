import React from 'react';
import {Dimensions, Image, Linking, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AdminRequest from '../views/AdminRequest';
import Favbtn from '../views/Favbtn';

const TopPart = ({masjidData}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        width: Dimensions.get('screen').width,
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          flexDirection: 'column',
          width: Dimensions.get('screen').width * 0.5,
        }}>
        <View style={{flexDirection: 'row'}}>
          <Icon
            name="mosque"
            color="#5C5C5C"
            size={20}
            style={{paddingRight: 10, paddingLeft: 10}}
          />
          <Text
            style={{
              fontSize: 17,
              color: '#5C5C5C',
              fontWeight: 'bold',
              maxWidth: 200,
            }}>
            {masjidData.name}
          </Text>
        </View>

        <View style={{flexDirection: 'row'}}>
          <Icon
            name="map-marker-alt"
            color="#5C5C5C"
            size={24}
            style={{
              paddingRight: 16,
              paddingLeft: 15,
              marginTop: 3,
            }}
          />
          <Text numberOfLines={2} style={{maxWidth: '85%'}}>{masjidData.address}</Text>
        </View>

        {masjidData.user.name !== 'No Admin' ? (
          <>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                maxWidth: '96%',
              }}>
              <View style={{flexDirection: 'row'}}>
                <Icon
                  name="user-alt"
                  color="#5C5C5C"
                  size={22}
                  style={{paddingRight: 15, paddingLeft: 13}}
                />
                <Text style={{maxWidth: 280, marginTop: 3}}>
                  {masjidData.user.name || 'hussain'}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Icon
                name="phone-alt"
                color="#5C5C5C"
                size={22}
                style={{
                  paddingRight: 15,
                  paddingLeft: 13,
                  marginTop: 3,
                }}
              />
              <Text
                style={{maxWidth: 280}}
                onPress={async () => {
                  await Linking.openURL(`tel:${masjidData.user.phone}`);
                }}>
                {masjidData.user.phone || '+920000000000'}
              </Text>
            </View>
          </>
        ) : (
          <View
            style={{
              flexDirection: 'row',
            }}>
            <AdminRequest id={masjidData.key} />
          </View>
        )}
      </View>
      <View
        style={{
          flexDirection: 'column',
          width: Dimensions.get('screen').width * 0.5,
          alignItems: 'flex-end',
        }}>
        <View style={{paddingLeft: 100, marginBottom: 5}}>
          <Favbtn favId={masjidData.key} isBig={false} />
        </View>
        <View style={{flexDirection: 'row', marginBottom: 5, marginRight: 10}}>
          <Icon
            name="directions"
            color="#900000"
            size={24}
            style={{paddingRight: 7}}
          />
          <Text
            onPress={async () => {
              await Linking.openURL(`${masjidData.gLink}`);
            }}
            style={{
              color: '#900000',
              fontSize: 17,
              // marginRight: 12,
              fontWeight: 'bold',
              textDecorationLine: 'underline',
            }}>
            {masjidData.distance} Km Away
          </Text>
        </View>
        <Image
          source={{
            uri: `${masjidData.pictureURL}`,
          }}
          style={{
            width: 141,
            height: 76,
            marginRight: 10,
            borderRadius: 10,
          }}
        />
      </View>
    </View>
  );
};

export default TopPart;
