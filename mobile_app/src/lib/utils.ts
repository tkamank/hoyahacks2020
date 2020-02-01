import {StackActions, NavigationActions} from 'react-navigation';
import {NavigationStackProp} from 'react-navigation-stack';

export const resetToScreen = (
  navigation: NavigationStackProp,
  routeName: string,
) => {
  const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({routeName})],
  });
  navigation.dispatch(resetAction);
};
