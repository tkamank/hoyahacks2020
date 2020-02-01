import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Login from "./screens/Login";

const Navigator = createStackNavigator({
    Login: { screen: Login }
});

export default createAppContainer(Navigator);