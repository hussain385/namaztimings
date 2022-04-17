import React, {PureComponent} from 'react';
import {
  Dimensions,
  ImageBackground,
  Linking,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Favbtn from './Favbtn';
import Animated, {Layout, ZoomIn, ZoomOut} from 'react-native-reanimated';
import styled from 'styled-components/native';
import {TouchableOpacity} from 'react-native-gesture-handler';

const Card = styled(Animated.View)`
  margin: 10px;
  background-color: #ffff;
  border-radius: 5px;
`;

export default class MasjidCard extends PureComponent {
  render() {
    return (
      <Card
        key={this.props.masjid.key}
        style={{
          margin: 10,
          backgroundColor: '#ffff',
          borderRadius: 5,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.34,
          shadowRadius: 6.27,
          elevation: 5,
        }}
        entering={ZoomIn}
        exiting={ZoomOut}
        layout={Layout.delay(200)}>
        <TouchableOpacity
          onPress={() =>
            this.props.nav.navigate('More Info', {
              masjid: this.props.masjid,
            })
          }>
          <ImageBackground
            source={{
              uri: `${
                this.props.masjid.pictureURL ||
                'https://www.freepnglogos.com/uploads/masjid-png/masjid-png-clipart-best-3.png'
              }`,
            }}
            style={{
              flex: 1,
              resizeMode: 'cover',
              justifyContent: 'center',
              width: '100%',
              height: 200,
            }}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flexGrow: 1}} />
              <View style={{top: -65, right: 10}}>
                <Favbtn favId={this.props.masjid.key} isBig={true} />
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        <View style={{padding: 5}}>
          <View
            style={{
              flexDirection: 'row',
              margin: 5,
              justifyContent: 'space-between',
            }}>
            <View style={{maxWidth: 250}}>
              <Text style={{fontSize: 17}}>{this.props.masjid.name}</Text>
            </View>
            <View>
              <Text
                onPress={() =>
                  Linking.openURL(
                    `${
                      this.props.masjid.gLink
                        ? this.props.masjid.gLink
                        : `https://maps.google.com/?q=${this.props.masjid.g.geopoint.latitude},${this.props.masjid.g.geopoint.longitude}`
                    }`,
                  )
                }
                style={{color: '#900000', textDecorationLine: 'underline'}}>
                {this.props.masjid.distance}KM AWAY
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              paddingHorizontal: 5,
            }}>
            <TouchableOpacity
              onPress={() =>
                this.props.nav.navigate('More Info', {
                  masjid: this.props.masjid,
                })
              }
              style={[styles.btnStyles, {backgroundColor: '#1F441E'}]}>
              <Text style={{color: '#CEE6B4'}}>More Info</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  `${
                    this.props.masjid.gLink
                      ? this.props.masjid.gLink
                      : `https://maps.google.com/?q=${this.props.masjid.g.geopoint.latitude},${this.props.masjid.g.geopoint.longitude}`
                  }`,
                )
              }
              style={styles.btnStyles}>
              <Text
                style={{
                  color: '#1F441E',
                }}>
                Location
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    );
  }
}
const styles = StyleSheet.create({
  btnStyles: {
    alignItems: 'center',
    backgroundColor: '#CEE6B4',
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: Dimensions.get('screen').width * 0.43,
  },
});
