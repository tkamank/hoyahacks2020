import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';

export default class AwiatingPickupBar extends Component {
  render() {
    return (
      <View
        style={{
          flex: 0.5,
          flexDirection: 'row',
          backgroundColor: '#BF3668',
          paddingLeft: '10%',
          paddingRight: '10%',
          paddingBottom: '2%',
          alignItems: 'center',
          borderColor: '#D95F76',
          borderStyle: 'solid',
          borderTopWidth: 2
        }}
      >
        <View style={{ flex: 1 }}>
          <Text>Awaiting driver...</Text>
        </View>
      </View>
    );
  }
}
