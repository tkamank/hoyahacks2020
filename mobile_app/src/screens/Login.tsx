import React, { Component } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Image,
  ImageBackground,
} from 'react-native';
import { StackActions, NavigationActions, NavigationSwitchScreenProps } from "react-navigation";
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-community/google-signin';
import { BackgroundImage, Logo } from "../assets";
import { Sizes } from "../lib/constants";

interface Props extends NavigationSwitchScreenProps { };

export default class LoginScreen extends Component<Props> {
  static navigationOptions = () => {
    return {
      header: () => null
    }
  }

  _resetToScreen = (routeName: string) => {
    const { navigation } = this.props;
    const resetAction = StackActions.reset({
      index: 0, 
      actions: [NavigationActions.navigate({routeName})]
    });
    navigation.dispatch(resetAction);
  }

  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
      this._resetToScreen("Home");
    } catch (error) {
      console.warn(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  }

  render() {
    return (
      <>
        <ImageBackground source={BackgroundImage} style={{ width: "100%", height: "100%", position: "absolute", zIndex: -1 }} />
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
          <View style={{ flex: 1 }} />
          <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <Image source={Logo} style={{ width: Sizes.LoginScreenLogo, height: Sizes.LoginScreenLogo, marginBottom: 20 }} />
            <GoogleSigninButton style={{ width: "100%" }} onPress={this._signIn} />
          </View>
          <View style={{ flex: 1 }} />
        </SafeAreaView>
      </>
    )
  }
}
