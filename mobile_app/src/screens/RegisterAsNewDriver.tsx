import React, { Component } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import { NavigationSwitchScreenProps } from "react-navigation";
import ImagePicker, { ImagePickerResponse, ImagePickerOptions } from 'react-native-image-picker';
import { GoogleSignin } from "@react-native-community/google-signin";
// @ts-ignore
import { GCP_ENDPOINT } from 'react-native-dotenv';

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
    const options: ImagePickerOptions = {
      title: 'Select Drivers License',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      quality: 0.4,
      maxWidth: 400,
      maxHeight: 400
    };

    ImagePicker.showImagePicker(options, async (response: ImagePickerResponse) => {
      const { navigation } = this.props;

      if (response.didCancel) {
        navigation.goBack();
      } else if (response.error) {
        Alert.alert("Unable to select Drivers License", "An unexpected error occurred!", [
          { text: "Cancel", onPress: navigation.goBack },
          { text: "Retry", onPress: this._selectDriversLicense }
        ]);
        console.warn('ImagePicker Error: ', response.error);
      } else {
        const image = response.data;
        try {
          const user = await GoogleSignin.getCurrentUser();
          if (!user) {
            throw new Error("No user!");
          }
          const body = JSON.stringify({
            image
          });
          console.log(body);
          const response = await fetch(`${GCP_ENDPOINT}/driver/join`, {
            method: "POST",
            headers: new Headers({
              Authorization: `Bearer ${user.idToken}`,
              "Content-Type": "application/json"
            }),
            body
          });
          console.log("Upload drivers license:", response.status);
          if (response.status === 200) {
            const { navigation } = this.props;
            navigation.goBack();
          } else {
            Alert.alert("Unable to upload Drivers License", "An unexpected error occurred!", [
              { text: "Okay", onPress: navigation.goBack },
            ]);
          }
        } catch (err) {
          console.warn(err);
        }
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
