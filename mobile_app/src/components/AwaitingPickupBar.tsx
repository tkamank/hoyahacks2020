import React, {Component} from 'react';
import {View, Text, BackHandler, ColorPropType} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

export interface Props {
  status?: 'awaiting_driver' | 'awaiting_pickup';
  onCancelRidePressed?: () => void;
  onPickupRiderPressed?: () => void;
  onCancelDriverPressed?: () => void;
}

export default class AwaitingPickupBar extends Component<Props> {
  render() {
    const {
      status = 'awaiting_driver',
      onCancelRidePressed,
      onPickupRiderPressed,
      onCancelDriverPressed,
    } = this.props;

    return (
      <View
        style={{
          flex: 0.3,
          flexDirection: 'row',
          backgroundColor: '#BF3668',
          paddingLeft: '10%',
          paddingRight: '10%',
          paddingBottom: '2%',
          paddingTop: '2%',
          alignItems: 'center',
          borderColor: '#D95F76',
          borderStyle: 'solid',
          borderTopWidth: 2,
        }}>
        <View style={{flex: 5.5, flexDirection: 'row'}}>
          {onCancelRidePressed && (
            <Text
              style={{
                color: '#f3f3f3',
                fontSize: 26,
                fontWeight: '600',
                textAlign: 'center',
              }}>
              {status === 'awaiting_driver'
                ? 'Looking for driver'
                : 'Waiting for pickup'}
              ...
            </Text>
          )}
          {onPickupRiderPressed && (
            <Text
              style={{
                color: '#f3f3f3',
                fontSize: 26,
                fontWeight: '600',
                textAlign: 'center',
                paddingTop: 25
              }}>
              Rider waiting...
            </Text>
          )}
          <View
            style={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'flex-end',
              alignContent: 'flex-end',
            }}>
            {onPickupRiderPressed && (
              <View>
              <TouchableOpacity
                onPress={() => {
                  if (onPickupRiderPressed) {
                    onPickupRiderPressed();
                  }
                }}>
                <Text
                  style={{
                    textAlign: 'right',
                    color: '#D95F76',
                    fontSize: 22,
                    marginLeft: 40,
                    marginTop: 10,
                    marginBottom: 6,
                    fontWeight: '700',
                    padding: '4%',
                    paddingTop: '2%',
                    backgroundColor: '#f3f3f3',
                    borderRadius: 15,
                    overflow: 'hidden',
                  }}>
                  Arrived
                </Text>
              </TouchableOpacity>
              </View>
            )}
            {onCancelDriverPressed && (
              <View>
              <TouchableOpacity
                onPress={() => {
                  if (onCancelDriverPressed) {
                    onCancelDriverPressed();
                  }
                }}>
                <Text
                  style={{
                    textAlign: 'right',
                    color: '#D95F76',
                    fontSize: 16,
                    marginLeft: 40,
                    fontWeight: '700',
                    paddingTop: '3%',
                    paddingBottom: '3%',
                    padding: '5%',
                    backgroundColor: '#f3f3f3',
                    borderRadius: 15,
                    overflow: 'hidden',
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              </View>
            )}
            {onCancelRidePressed && (
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
            )}
          </View>
        </View>
      </View>
    );
  }
}
