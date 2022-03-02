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
                'data:image/jpeg;base64,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'
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
                onPress={() => Linking.openURL(`${this.props.masjid.gLink}`)}
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
              onPress={async () => {
                await Linking.openURL(`${this.props.masjid.gLink}`);
              }}
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
