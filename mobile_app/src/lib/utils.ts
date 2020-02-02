import {StackActions, NavigationActions} from 'react-navigation';
import {NavigationStackProp} from 'react-navigation-stack';
import {Coordinate} from './types';

const R = 3958.8; // Radius of the Earth in miles

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

export const distanceBetweenCoordinates = (
  c1: Coordinate,
  c2: Coordinate,
): number => {
  const lat1 = c1.latitude * (Math.PI / 180);
  const lat2 = c2.latitude * (Math.PI / 180);
  const diffLat = lat1 - lat2;
  const diffLng = (c1.longitude - c2.longitude) * (Math.PI / 180);

  return (
    2 *
    R *
    Math.asin(
      Math.sqrt(
        Math.sin(diffLat / 2) * Math.sin(diffLat / 2) +
          Math.cos(lat1) *
            Math.cos(lat1) *
            Math.sin(diffLng / 2) *
            Math.sin(diffLng / 2),
      ),
    )
  );
};
