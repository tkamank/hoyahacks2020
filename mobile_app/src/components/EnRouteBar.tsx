import React, {Component} from 'react';
import {View, Text, BackHandler, ColorPropType} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

export interface Props {
  onCompletion?: () => void;
}

export default class EnRouteBar extends Component<Props> {
  render() {
    const {
      onCompletion
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
            <Text
              style={{
                color: '#f3f3f3',
                fontSize: 26,
                fontWeight: '600',
                paddingTop: 15,
                textAlign: 'center',
              }}>
              En route...
            </Text>
          <View
            style={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'flex-end',
              alignContent: 'flex-end',
            }}>
            {onCompletion && (
              <View>
              <TouchableOpacity
                onPress={() => {
                  if (onCompletion) {
                    onCompletion();
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
          </View>
        </View>
      </View>
    );
  }
}
