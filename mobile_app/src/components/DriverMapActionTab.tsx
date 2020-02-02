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
    const { rides, onRidePressed } = this.props;

    const localRides = rides
      .filter(ride => (ride.distance || 0) <= 50)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));

    return (
      <View style={{ flex: 1.6 }}>
        <View style={{
            backgroundColor: '#e4e3e4',
            shadowColor: '#b4b4b4',
            shadowRadius: 6,
            shadowOpacity: 75,
            alignItems: 'center',
            paddingTop: "5%",
            paddingBottom: "5%"}}>
          <Text
            style={{ 
              shadowColor: '#000000',
              color: '#D95F76',
              fontSize: 26,
              fontWeight: "600" 
            }}
          >
            Its a great day to drive!
              </Text>
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
        </View>
        <View style={{ flex: 2.5, justifyContent: "center" }}>
          <FlatList
            data={localRides}
            renderItem={({ item }: { item: DetailedRideWithDistance }) =>
              <TouchableOpacity
                style={{ alignItems: 'center', backgroundColor: '#f5f5f5'  }}
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
                  {item.ride.formatted_address} ({(item.distance || 0).toFixed(2)} Mi.)
                </Text>
              </TouchableOpacity>
            }
            keyExtractor={(_: DetailedRideWithDistance, i: number) => i.toString()}
          >
          </FlatList>
        </View>
      </View >
    );
  }
}
