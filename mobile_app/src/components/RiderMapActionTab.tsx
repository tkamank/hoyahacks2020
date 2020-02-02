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
};

export default class RiderMapActionTab extends Component<Props> {
  render() {
    const { locations, onLocationPressed } = this.props;

    return (
      <View style={{ flex: locations.length > 0 ? 1.6 : 0.4 }}>
        <View
          style={{
            flex: 0.5,
            backgroundColor: '#F3F3F3',
            alignItems: 'center',
            paddingTop: "5%",
            paddingBottom: "8%"
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
                color: '#ccc',
                fontSize: 13,
                fontWeight: "600"
              }}
            >
              Long press on the map to get started
            </Text>
          }
        </View>
        <View style={{
          flex: locations.length > 0 ? 1.5 : 0,
          justifyContent: "center"
        }}>
          <FlatList
            data={locations.sort((a, b) => (a.distance || 0) - (b.distance || 0))}
            renderItem={({ item }: { item: LocationWithDistance }) =>
              <TouchableOpacity
                style={{ alignItems: 'center' }}
                onPress={() => {
                  if (onLocationPressed) {
                    onLocationPressed(item);
                  }
                }}
              >
                <Text
                  style={{
                    color: '#000000',
                    backgroundColor: '#f5f5f5',
                    borderRadius: 6,
                    overflow: 'hidden',
                    fontWeight: "700",
                    padding: 10,
                    borderColor: '#000000',
                    borderStyle: 'solid',
                    fontSize: 24,
                    margin: '1%',
                    borderWidth: 2
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
