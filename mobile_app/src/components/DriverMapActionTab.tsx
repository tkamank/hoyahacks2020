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
        <View style={{ flex: 0.5, backgroundColor: '#F3F3F3', alignItems: 'center' }}>
          <Text
            style={{ paddingTop: "5%", paddingBottom: "8%", shadowColor: '#000000', color: '#D95F76', fontSize: 26, fontWeight: "600" }}
          >
            Local Riders
              </Text>
        </View>
        <View style={{ flex: 1.5, justifyContent: "center" }}>
          <FlatList
            data={localRides}
            renderItem={({ item }: { item: DetailedRideWithDistance }) =>
              <TouchableOpacity
                style={{ alignItems: 'center' }}
                onPress={() => {
                  if (onRidePressed) {
                    onRidePressed(item);
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
