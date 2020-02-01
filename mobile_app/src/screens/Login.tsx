/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  ImageBackground,
} from 'react-native';
// @ts-ignore
import Image from "../assets/polyBackground.png";
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-community/google-signin';
// @ts-ignore
import { CLIENT_ID, IOS_CLIENT_ID } from 'react-native-dotenv';

GoogleSignin.configure({
  scopes: [], // what API you want to access on behalf of the user, default is email and profile
  webClientId: CLIENT_ID, // client ID of type WEB for your server (needed to verify user ID and offline access)
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  iosClientId: IOS_CLIENT_ID, // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
});

const signIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    console.log(userInfo);
  } catch (error) {
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
};

const Login = () => {
  return (
    <>
      <ImageBackground source={Image} style={{ width: "100%", height: "100%", position: "absolute", zIndex: -1 }} />
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <View style={{ paddingTop: "110%", marginLeft: "auto", marginRight: "auto" }}>
          <View />
          <GoogleSigninButton style={{}} onPress={signIn} />
          <View />
        </View>
      </SafeAreaView>
    </>
  );
};

export default Login;
