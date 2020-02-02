import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList
} from 'react-native';
import { LocationWithDistance } from '../lib/types';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface Props {
  locations: LocationWithDistance[],
  onLocationPressed?: (location: LocationWithDistance) => void;
  onLocationLongPressed?: (location: LocationWithDistance) => void;
};

export default class RiderMapActionTab extends Component<Props> {
  render() {
    const { locations, onLocationPressed, onLocationLongPressed } = this.props;

    return (
      <View style={{ flex: locations.length > 0 ? 1.6 : 0.0}}>
        <View
          style={{
            backgroundColor: '#e4e3e4',
            shadowColor: '#b4b4b4',
            shadowRadius: 6,
            shadowOpacity: 75,
            alignItems: 'center',
            paddingTop: "5%",
            paddingBottom: "5%"
          }}>
          <Text
            style={{
              shadowColor: '#000000',
              color: '#D95F76',
              fontSize: 26,
              fontWeight: "600"
            }}
          >
            Plans for today?
          </Text>
          {locations.length === 0 &&
            <Text
              style={{
                shadowColor: '#000000',
                color: '#b4b4b4',
                fontSize: 13,
                fontWeight: "600"
              }}
            >
              Tap and hold wherever you'd like to go
            </Text>
          }
        </View>
        <View style={{
          flex: locations.length > 0 ? 2.5 : 0,
          justifyContent: "center"
        }}>
          <FlatList
            data={locations.sort((a, b) => (a.distance || 0) - (b.distance || 0))}
            renderItem={({ item }: { item: LocationWithDistance }) =>
              <TouchableOpacity
                style={{ alignItems: 'center', backgroundColor: '#f5f5f5' }}
                onPress={() => {
                  if (onLocationPressed) {
                    onLocationPressed(item);
                  }
                }}
                onLongPress={() => {
                  if (onLocationLongPressed) {
                    onLocationLongPressed(item);
                  }
                }}
              >
                <Text 
                  style={{
                    color: '#a1a0a0',
                    overflow: 'hidden',
                    fontWeight: "400",
                    padding: 10,
                    fontSize: 22,
                    paddingLeft: 60,
                    paddingRight: 60,
                    textAlign: "center"
                  }}
                >
                  {item.location.formatted_address} ({(item.distance || 0).toFixed(2)} Mi.)
                </Text>
              </TouchableOpacity>
            }
            keyExtractor={(_: LocationWithDistance, i: number) => i.toString()}
          >
          </FlatList>
        </View>
      </View>
    );
  }
}
