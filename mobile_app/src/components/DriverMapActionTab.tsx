import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';

interface Props { };

export default class RiderMapActionTab extends Component<Props> {
  render() {
    return (
      <View style={{ flex: 1.6 }}>
        <View style={{ flex: 0.5, backgroundColor: '#F3F3F3', alignItems: 'center' }}>
          <Text
            style={{ paddingTop: "5%", paddingBottom: "8%", shadowColor: '#000000', color: '#D95F76', fontSize: 26, fontWeight: "600" }}
          >
            Local Riders
              </Text>
        </View>
        <View style={{ flex: 1.5, justifyContent: "center" }}>
        </View>
      </View >
    );
  }
}
