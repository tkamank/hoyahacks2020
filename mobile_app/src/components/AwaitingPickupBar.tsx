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
        <View style={{ flex: 1 }}>
          <Text>
            Awaiting {status === "awaiting_driver" ? "driver" : "pickup"}...
          </Text>
        </View>
      </View>
    );
  }
}
