import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export interface Props {
  status?: 'awaiting_driver' | 'awaiting_pickup';
  onCancelRidePressed?: () => void;
  onPickupRiderPressed?: () => void;
}

export default class AwaitingPickupBar extends Component<Props> {
  render() {
    const { status = 'awaiting_driver', onCancelRidePressed } = this.props;

    return (
      <View
        style={{
          flex: 0.3,
          flexDirection: 'row',
          backgroundColor: '#BF3668',
          paddingLeft: '10%',
          paddingRight: '15%',
          paddingBottom: '2%',
          paddingTop: '2%',
          alignItems: 'center',
          borderColor: '#D95F76',
          borderStyle: 'solid',
          borderTopWidth: 2,
        }}>
        <View style={{ flex: 5.5, flexDirection: 'row' }}>
          <Text
            style={{
              color: '#f3f3f3',
              fontSize: 26,
              fontWeight: '600',
              textAlign: 'center',
            }}>
            {status === 'awaiting_driver' ? 'Looking for driver' : 'Awaiting pickup'}...
          </Text>
          <View
            style={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'flex-end',
              alignContent: 'flex-end',
            }}>
            {onCancelRidePressed &&
              <TouchableOpacity
                onPress={() => {
                  if (onCancelRidePressed) {
                    onCancelRidePressed();
                  }
                }}>
                <Text
                  style={{
                    textAlign: 'right',
                    color: '#f3f3f3',
                    fontSize: 30,
                    fontWeight: '800',
                    paddingRight: '0%',
                  }}>
                  X
              </Text>
              </TouchableOpacity>
            }
          </View>
        </View>
      </View>
    );
  }
}
