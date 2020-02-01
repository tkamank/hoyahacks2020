import React, { Component } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Image,
  ImageBackground,
} from 'react-native';
import { BackgroundImage, Logo } from "../assets";
import { Sizes } from "../lib/constants";

export default class SplashScreen extends Component {
  static navigationOptions = () => {
    return {
      header: () => null
    }
  }

  _checkForUser = async () => {
    // TODO: Implement method
  }

  render() {
    return (
      <>
        <ImageBackground source={BackgroundImage} style={{ width: "100%", height: "100%", position: "absolute", zIndex: -1 }} />
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Image source={Logo} style={{ width: Sizes.SplashScreenLogo, height: Sizes.SplashScreenLogo }} />
          </View>
          <View style={{ flex: 1 }} />
        </SafeAreaView>
      </>
    );
  }
}
