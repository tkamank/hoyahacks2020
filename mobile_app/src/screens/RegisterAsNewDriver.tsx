import React, { Component } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import { NavigationSwitchScreenProps } from "react-navigation";
import ImagePicker, { ImagePickerResponse } from 'react-native-image-picker';

interface Props extends NavigationSwitchScreenProps { };

export default class RegisterAsNewDriver extends Component<Props> {
  static navigationOptions = () => {
    return {
      header: () => null
    }
  }

  componentDidMount() {
    this._selectDriversLicense();
  }

  _selectDriversLicense = () => {
    const options = {
      title: 'Select Drivers License',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response: ImagePickerResponse ) => {
      const { navigation } = this.props;

      if (response.didCancel) {
        navigation.goBack();
      } else if (response.error) {
        Alert.alert("Unable to select Drivers License", "An unexpected error occurred!", [
          { text: "Cancel", onPress: navigation.goBack },
          { text: "Retry", onPress: this._selectDriversLicense }
        ])
        console.warn('ImagePicker Error: ', response.error);
      } else {
        // TODO: Implement a handler for handling selected image
      }
    });
  }

  render() {
    return (
      <>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={{ flex: 1 }}>
        </SafeAreaView>
      </>
    )
  }
}
