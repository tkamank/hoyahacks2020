import React, { Component } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text
} from 'react-native';
import { DetailedRideWithDistance } from 'src/lib/types';

interface Props {
  rides: DetailedRideWithDistance[];
  onRidePressed?: (ride: DetailedRideWithDistance) => void;
};

export default class RiderMapActionTab extends Component<Props> {
  render() {
    const { rides: localRides, onRidePressed } = this.props;

    return (
      <View style={{ flex: localRides.length > 0 ? 1.6 : 0 }}>
        <View style={{
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
            {localRides.length > 0 ? "Its a great day to drive!" : "The coast is clear..."}
          </Text>
          {localRides.length > 0 &&
            <Text
              style={{
                shadowColor: '#000000',
                color: '#b4b4b4',
                fontSize: 13,
                fontWeight: "600"
              }}
            >
              Here are riders close to you
            </Text>
          }
          {localRides.length === 0 &&
            <Text
              style={{
                shadowColor: '#000000',
                color: '#b4b4b4',
                fontSize: 13,
                fontWeight: "600"
              }}
            >
              You can check back in a little bit
            </Text>
          }
        </View>
        {localRides.length > 0 &&
          <View style={{ flex: 2.5, justifyContent: "center" }}>
            <FlatList
              data={localRides}
              renderItem={({ item }: { item: DetailedRideWithDistance }) =>
                <TouchableOpacity
                  style={{ alignItems: 'center', backgroundColor: '#f5f5f5' }}
                  onPress={() => {
                    if (onRidePressed) {
                      onRidePressed(item);
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
                    {item.ride.formatted_address} ({(item.distanceToRider || 0).toFixed(2)} Mi.)
                </Text>
                </TouchableOpacity>
              }
              keyExtractor={(_: DetailedRideWithDistance, i: number) => i.toString()}
            >
            </FlatList>
          </View>
        }
      </View >
    );
  }
}
