import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { GoogleSignin } from '@react-native-community/google-signin';
// @ts-ignore
import { CLIENT_ID, IOS_CLIENT_ID } from 'react-native-dotenv';
import Login from './screens/Login';
import Splash from './screens/Splash';
import Home from './screens/Home';

GoogleSignin.configure({
  scopes: [], // what API you want to access on behalf of the user, default is email and profile
  webClientId: CLIENT_ID, // client ID of type WEB for your server (needed to verify user ID and offline access)
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  iosClientId: IOS_CLIENT_ID, // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
});

const Navigator = createStackNavigator({
    Login: { screen: Login },
    Splash: { screen: Splash },
    Home: { screen: Home }
}, {
    initialRouteName: 'Splash'
});

export default createAppContainer(Navigator);