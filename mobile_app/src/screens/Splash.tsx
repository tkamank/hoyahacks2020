import React, { Component } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Image,
  ImageBackground,
} from 'react-native';
import { NavigationSwitchScreenProps } from "react-navigation";
import { GoogleSignin } from "@react-native-community/google-signin";
import { BackgroundImage, Logo } from "../assets";
import { Sizes } from "../lib/constants";

interface Props extends NavigationSwitchScreenProps { };

export default class SplashScreen extends Component<Props> {
  static navigationOptions = () => {
    return {
      header: () => null
    }
  }

  componentDidMount() {
    this._checkForUser();
  }

  _checkForUser = async () => {
    const { navigation } = this.props;
    try {
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        // TODO: Implement screen
      } else {
        navigation.navigate("Login");
      }
    } catch { }
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
