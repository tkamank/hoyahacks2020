import React, { Component } from 'react';
import {
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { NavigationSwitchScreenProps } from "react-navigation";
import MapView from 'react-native-maps';

interface Props extends NavigationSwitchScreenProps { };

export default class SplashScreen extends Component<Props> {
  static navigationOptions = () => {
    return {
      header: () => null
    }
  }

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={{ flex: 1 }}>
          <MapView
            style={{ flex: 1 }}
            region={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }} />
        </SafeAreaView>
      </>
    );
  }
}
