import React from 'react';
import { Text } from 'react-native';

class CoText extends React.Component {
  state = {
    fontLoaded: false,
  };

  render() {
    return (
      <Text numberOfLines={this.props.lines} style={this.props.textStyles}>
        {this.props.text}
      </Text>
    );
  }
}

export default CoText;
