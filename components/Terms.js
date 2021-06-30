import * as React from 'react';
import {Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {NavigationContainer} from '@react-navigation/native';
import {Header} from 'react-native-elements';

const Terms = ({ navigation }) => {

    return (
        <View>
            <Header
                containerStyle={{
                    shadowOpacity: 50,
                    elevation: 50,
                }}
                leftComponent={
                    <Icon name="bars" color="#ffff" size={26} style={{paddingLeft: 10}} />
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
                            Terms
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
        </View>
    );
};

export default Terms;
