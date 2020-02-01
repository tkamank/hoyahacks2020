import React, { Component } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
} from 'react-native';
import { NavigationSwitchScreenProps } from "react-navigation";
import MapView, { Region } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

interface Props extends NavigationSwitchScreenProps { };

interface State {
  region?: Region;
  currentPosition?: Geolocation.GeoPosition;
}

export default class SplashScreen extends Component<Props, State> {
  static navigationOptions = () => {
    return {
      header: () => null
    }
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }
    };
  }

  componentDidMount() {
    Geolocation.requestAuthorization();
    Geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          },
          currentPosition: position
        });
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  render() {
    const { region } = this.state;

    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <MapView
            style={{ flex: 1 }}
            showsUserLocation={true}
            region={region || {
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }} />
            <View style={{flex: 0.5, backgroundColor: '#D95F76'}}>
                <View style={{paddingLeft: '5%', paddingTop: '5%'}}>
                <Text style={{color: 'white', fontSize: 26, fontWeight: "500"}}>
                Plans for today?
                </Text>
                </View>
            </View>
        </SafeAreaView>
      </>
    );
  }
}
