import React, { Component } from 'react';
import {
    SafeAreaView,
    StatusBar,
    View,
    Text,
    FlatList,
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

interface Props extends NavigationSwitchScreenProps { };

interface State {
    region?: Region;
    currentPosition?: Geolocation.GeoPosition;
}

const RECENT_LOCATIONS: Location[] = [
    {
        latitude: 38.922406,
        longitude: -77.042154,
        distanceFromUser: null,
        title: "Songbyrd Bar DC"
    },
    {
        latitude: 38.888420,
        longitude: -77.022904,
        distanceFromUser: null,
        title: "Ashleigh's Crib"
    },
    {
        latitude: 38.907582,
        longitude: -77.072351,
        distanceFromUser: null,
        title: "Georgetown University"
    }
];

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
            }
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
    
    _handleMapLongPressed = (event: MapEvent) => {
        const { coordinate } = event.nativeEvent;
        // TODO: Handle coordinates
    };

    render() {
        const { region } = this.state;

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
                />
                <SafeAreaView style={{ flex: 1.6 }}>
                    <View style={{ flex: 0.5, backgroundColor: '#F3F3F3', alignItems: 'center' }}>
                        <Text style={{ paddingTop: "5%", paddingBottom: "8%", shadowColor: '#000000', color: '#D95F76', fontSize: 26, fontWeight: "600" }}>
                            Plans for today?
                            </Text>
                    </View>
                    <View style={{ flex: 1.5, justifyContent: "center" }}>
                        <FlatList
                            data={RECENT_LOCATIONS}
                            renderItem={({ item }: { item: Location }) =>
                                <View style={{ alignItems: 'center' }}><Text style={{ color: '#000000', backgroundColor: '#f5f5f5', borderRadius: 6, overflow: 'hidden', fontWeight: "700", padding: 10, borderColor: '#000000', borderStyle: 'solid', fontSize: 24, margin: '1%', borderWidth: 2 }}>{item.title}</Text></View>}
                            keyExtractor={(_: Location, i: number) => i.toString()}
                        >
                        </FlatList>
                    </View>

                </SafeAreaView>
                <View style={{ flex: 0.5, flexDirection: 'row', backgroundColor: '#BF3668', paddingLeft: '10%', paddingRight: '10%', paddingBottom: '2%', alignItems: 'center', borderColor: '#D95F76', borderStyle: 'solid', borderTopWidth: 2 }}>
                    <View style={{ flex: 1 }}>
                        <Button
                            title="Ride"
                            onPress={this._verifyUserExists}
                            color="#f3f3f3"
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Button
                            title="Drive"
                            onPress={this._verifyIsDriver}
                            color="#f3f3f3"
                        />
                    </View>
                </View>
            </>
        );
    }
}
