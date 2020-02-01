import React, { Component } from 'react';
import {
    StatusBar,
    View,
    Button,
    Alert
} from 'react-native';
import { NavigationSwitchScreenProps } from "react-navigation";
import MapView, { Region, MapEvent } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { GoogleSignin } from "@react-native-community/google-signin";
// @ts-ignore
import { GCP_ENDPOINT } from 'react-native-dotenv';
import { Location, User } from '../lib/types';
import DriverMapActionTab from "../components/DriverMapActionTab";
import RiderMapActionTab from "../components/RiderMapActionTab";

interface Props extends NavigationSwitchScreenProps { };

interface State {
    region?: Region;
    currentPosition?: Geolocation.GeoPosition;
    riderStatus: "rider" | "driver";
    recentLocations: Location[];

}

export default class SplashScreen extends Component<Props, State> {
    static navigationOptions = () => {
        return {
            header: () => null
        }
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            region: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            },
            riderStatus: "rider",
            recentLocations: [{
                latitude: 38.922406,
                longitude: -77.042154,
                title: "Songbyrd Bar DC"
            },
            {
                latitude: 38.888420,
                longitude: -77.022904,
                title: "Ashleigh's Kickback"
            },
            {
                latitude: 38.907582,
                longitude: -77.072351,
                title: "Georgetown University"
            }]
        };
    }

    componentDidMount() {
        Geolocation.requestAuthorization();
        Geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    region: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                    },
                    currentPosition: position
                });
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }

    _createUser = async () => {
        try {
            const user = await GoogleSignin.getCurrentUser();
            if (!user) {
                throw new Error("No user!");
            }
            const response = await fetch(`${GCP_ENDPOINT}/user/create`, {
                method: "POST",
                headers: new Headers({
                    Authorization: `Bearer ${user.idToken}`
                })
            });
            if (!response.ok) {
                Alert.alert(
                    "Unable to create an account!",
                    "An unexpected error occurred!",
                    [
                        {
                            text: "Okay"
                        }
                    ]);
            } else {
                this._verifyIsDriver();
            }
        } catch (err) {
            console.warn(err);
            Alert.alert(
                "Unable to create an account!",
                "An unexpected error occurred!",
                [
                    {
                        text: "Okay"
                    }
                ]);
        }
    }

    _verifyUserExists = async () => {
        this.setState({ riderStatus: "rider" });
        try {
            const { navigation } = this.props;
            const user = await GoogleSignin.getCurrentUser();
            if (!user) {
                throw new Error("No user!");
            }
            const response = await fetch(`${GCP_ENDPOINT}/user`, {
                headers: new Headers({
                    Authorization: `Bearer ${user.idToken}`
                })
            });
            if (response.status === 401) {
                this._createUser();
            }
        } catch (err) {
            console.warn(err);
            Alert.alert(
                "Unable to create an account!",
                "An unexpected error occurred!",
                [
                    {
                        text: "Okay"
                    }
                ]);
        }
    }

    _verifyIsDriver = async () => {
        this.setState({ riderStatus: "driver" });
        try {
            const { navigation } = this.props;
            const user = await GoogleSignin.getCurrentUser();
            if (!user) {
                throw new Error("No user!");
            }
            const response = await fetch(`${GCP_ENDPOINT}/user`, {
                headers: new Headers({
                    Authorization: `Bearer ${user.idToken}`
                })
            });
            if (response.status === 401) {
                this._createUser();
            } else if (response.status === 200) {
                const json = await response.json() as User;
                if (json.verifiedDriver) {
                    // TODO: Implement
                } else {
                    navigation.navigate("RegisterAsNewDriver");
                }
            }
        } catch (err) {
            console.warn(err);
            Alert.alert(
                "Unable to create an account!",
                "An unexpected error occurred!",
                [
                    {
                        text: "Okay"
                    }
                ]);
        }
    }

    _handleMapLongPressed = async (event: MapEvent) => {
        const { coordinate } = event.nativeEvent;
        const { recentLocations } = this.state;
        try {
            const user = await GoogleSignin.getCurrentUser();
            if (!user) {
                throw new Error("No user!");
            }
            const response = await fetch(`${GCP_ENDPOINT}/location?latitude=${coordinate.latitude}&longitude=${coordinate.longitude}`, {
                headers: new Headers({
                    Authorization: `Bearer ${user.idToken}`
                })
            });
            if (response.ok) {
                const json = await response.json() as any;
                const validResult = json["results"].find((element: any) => element["formatted_address"]);
                if (validResult) {
                    const newLocation: Location = { latitude: coordinate.latitude, longitude: coordinate.longitude, title: validResult["formatted_address"] };
                    this.setState({ recentLocations: [newLocation].concat(recentLocations) });
                }
            }
        } catch (err) {
            console.warn(err);
        }
    };

    render() {
        const { region, riderStatus, recentLocations } = this.state;

        return (
            <>
                <StatusBar barStyle="dark-content" />
                <MapView
                    style={{ flex: 2.4 }}
                    showsUserLocation={true}
                    region={region || {
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                    }}
                    onLongPress={this._handleMapLongPressed}
                    onRegionChangeComplete={region => this.setState({ region })}
                />
                {riderStatus === "rider"
                    ? <RiderMapActionTab locations={recentLocations} />
                    : <DriverMapActionTab />
                }
                <View style={{ flex: 0.5, flexDirection: 'row', backgroundColor: '#BF3668', paddingLeft: '10%', paddingRight: '10%', paddingBottom: '2%', alignItems: 'center', borderColor: '#D95F76', borderStyle: 'solid', borderTopWidth: 2 }}>
                    <View style={{ flex: 1 }}>
                        <Button
                            title="Ride"
                            onPress={this._verifyUserExists}
                            color={riderStatus === "rider" ? "#f3f3f3" : "#333"}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Button
                            title="Drive"
                            onPress={this._verifyIsDriver}
                            color={riderStatus === "driver" ? "#f3f3f3" : "#333"}
                        />
                    </View>
                </View>
            </>
        );
    }
}
