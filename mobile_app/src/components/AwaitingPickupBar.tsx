import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';

export interface Props {
  status?: "awaiting_driver" | "awaiting_pickup";
  onCancelRidePressed?: () => void;
}

export default class AwaitingPickupBar extends Component<Props> {
  render() {
    const { status = "awaiting_driver", onCancelRidePressed } = this.props;

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
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 5.5 }}>
          <Text style={{ color: '#f3f3f3', fontSize: 30, fontWeight: '700' }}>
            Awaiting {status === "awaiting_driver" ? "driver" : "pickup"}...
          </Text>
          </View>
        
        <View style={{ flex: 0.5, flexDirection: 'row', backgroundColor: '#a1a1a1'}}>
          <Text style={{ textAlign: 'right', color: '#f3f3f3', fontSize: 30, fontWeight: '700' }}>X</Text>
        </View>
      </View>
      </View>
    );
  }
}
