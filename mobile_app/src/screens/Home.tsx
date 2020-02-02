import React, { Component } from 'react';
import {
    StatusBar,
    View,
    Button,
    Alert
} from 'react-native';
import { NavigationSwitchScreenProps } from "react-navigation";
import MapView, { Region, MapEvent, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { GoogleSignin } from "@react-native-community/google-signin";
// @ts-ignore
import { GCP_ENDPOINT } from 'react-native-dotenv';
import { Location, User, LocationWithDistance, DetailedRide, DetailedRideWithDistance, Ride } from '../lib/types';
import { distanceBetweenCoordinates } from "../lib/utils";
import DriverMapActionTab from "../components/DriverMapActionTab";
import RiderMapActionTab from "../components/RiderMapActionTab";
import AwaitingPickupBar from '../components/AwaitingPickupBar';
import EnRouteBar from '../components/EnRouteBar';

interface Props extends NavigationSwitchScreenProps { };

interface State {
    region?: Region;
    currentPosition?: Geolocation.GeoPosition;
    riderStatus: "rider" | "driver";
    recentLocations: LocationWithDistance[];
    localRides: DetailedRideWithDistance[];
    rideStatus: "idle" | "awaiting_driver" | "awaiting_pickup" | "riding" | "driving";
}

let watchId: number;
let getLocalRidersListener: number;
let getRideStatusListener: number;
let getDriveStatusListener: number;

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
            recentLocations: [],
            localRides: [],
            rideStatus: "idle"
        };
    }

    async componentDidMount() {
        if (getLocalRidersListener) {
            clearInterval(getLocalRidersListener);
        }
        if (getRideStatusListener) {
            clearInterval(getRideStatusListener);
        }
        if (getDriveStatusListener) {
            clearInterval(getDriveStatusListener);
        }
        console.log(`${GCP_ENDPOINT}`);
        try {
            await GoogleSignin.signInSilently();
        } catch {
            // TODO: Handle error
        } finally {
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
                    this._checkForExistingRide();
                    this._checkForExistingDrive();
                    this._getMyLocations();
                },
                (error) => {
                    // See error code charts below.
                    console.log(error.code, error.message);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
            watchId = Geolocation.watchPosition(
                async (position) => {
                    this.setState({
                        currentPosition: position
                    });
                    this._calculateDistanceToMyLocations();
                    try {
                        const user = await GoogleSignin.getCurrentUser();
                        if (!user) {
                            throw new Error("No user!");
                        }
                        await fetch(`${GCP_ENDPOINT}/user/update-location`, {
                            method: "POST",
                            headers: new Headers({
                                Authorization: `Bearer ${user.idToken}`,
                                "Content-Type": "application/json"
                            }),
                            body: JSON.stringify({
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude
                            })
                        });
                    } catch {
                        // Ignore error
                    }
                },
                (error) => {
                    // See error code charts below.
                    console.log(error.code, error.message);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 })
        }
    }

    componentWillUnmount() {
        Geolocation.clearWatch(watchId);
        if (getLocalRidersListener) {
            clearInterval(getLocalRidersListener);
        }
        if (getRideStatusListener) {
            clearInterval(getRideStatusListener);
        }
        if (getDriveStatusListener) {
            clearInterval(getDriveStatusListener);
        }
    }

    _calculateDistanceToMyLocations = () => {
        const { currentPosition, recentLocations } = this.state;
        if (!currentPosition) {
            return;
        }
        recentLocations.forEach((location: LocationWithDistance) => {
            const locationCoords = {
                latitude: parseFloat(location.location.latitude),
                longitude: parseFloat(location.location.longitude)
            };
            location.distance = distanceBetweenCoordinates(
                currentPosition.coords,
                locationCoords
            );
        });
        this.setState({ recentLocations });
    };

    _calculateDistanceToRides = () => {
        const { currentPosition, localRides: localRiders } = this.state;
        if (!currentPosition) {
            return;
        }
        localRiders.forEach((ride: DetailedRideWithDistance) => {
            const riderLocationCoords = {
                latitude: parseFloat(ride.ride.user_latitude),
                longitude: parseFloat(ride.ride.user_longitude)
            };
            ride.distanceToRider = distanceBetweenCoordinates(
                currentPosition.coords,
                riderLocationCoords
            );
            const locationCoords = {
                latitude: parseFloat(ride.ride.latitude),
                longitude: parseFloat(ride.ride.longitude)
            };
            ride.distanceToDestination = distanceBetweenCoordinates(
                currentPosition.coords,
                locationCoords
            );
        });
        this.setState({ localRides: localRiders });
    };

    _checkForExistingRide = async () => {
        try {
            const user = await GoogleSignin.getCurrentUser();
            if (!user) {
                throw new Error("No user!");
            }
            const response = await fetch(`${GCP_ENDPOINT}/ride`, {
                headers: new Headers({
                    Authorization: `Bearer ${user.idToken}`,
                })
            });
            console.log(response.status);
            if (response.ok) {
                const ride = await response.json() as Ride;
                console.log(getRideStatusListener)
                if (ride !== null) {
                    if (getRideStatusListener === undefined) {
                        getRideStatusListener = setInterval(this._checkForExistingRide, 2500);
                    }
                    console.log(ride.status);
                    switch (ride.status) {
                        case 0:
                            this.setState({ rideStatus: "awaiting_driver" });
                            break;
                        case 1:
                            this.setState({ rideStatus: "awaiting_pickup" });
                            break;
                        case 2:
                            this.setState({ rideStatus: "riding" });
                            break;
                        default:
                            if (getRideStatusListener) {
                                clearInterval(getRideStatusListener);
                            }
                            break;
                    }
                } else {
                    if (getRideStatusListener) {
                        clearInterval(getRideStatusListener);
                    }
                    this.setState({ rideStatus: "idle" });
                }
            } else {
                Alert.alert(
                    "Unable to validate ride status",
                    "An unexpected error occurred!",
                    [{ text: "Okay" }]
                );
                if (getRideStatusListener) {
                    clearInterval(getRideStatusListener);
                }
                this.setState({ rideStatus: "idle" });
            }
        } catch (err) {
            console.warn(err);
            this.setState({ rideStatus: "idle" });
        }
    };

    _checkForExistingDrive = async () => {
        try {
            const user = await GoogleSignin.getCurrentUser();
            if (!user) {
                throw new Error("No user!");
            }
            const response = await fetch(`${GCP_ENDPOINT}/driver`, {
                headers: new Headers({
                    Authorization: `Bearer ${user.idToken}`,
                })
            });
            console.log(response.status);
            if (response.ok) {
                const ride = await response.json() as Ride;
                console.log(ride);
                if (ride !== null) {
                    if (getDriveStatusListener === undefined) {
                        getDriveStatusListener = setInterval(this._checkForExistingDrive, 2500);
                    }
                    console.log("STATUS:", ride.status);
                    switch (ride.status) {
                        case 1:
                            this.setState({ rideStatus: "awaiting_pickup" });
                            break;
                        case 2:
                            this.setState({ rideStatus: "driving" });
                            break;
                        default:
                            if (getDriveStatusListener) {
                                clearInterval(getDriveStatusListener);
                            }
                            break;
                    }
                } else {
                    if (getDriveStatusListener) {
                        clearInterval(getDriveStatusListener);
                    }
                    this.setState({ rideStatus: "idle" });
                }
            } else {
                Alert.alert(
                    "Unable to validate drive status",
                    "An unexpected error occurred!",
                    [{ text: "Okay" }]
                );
                if (getDriveStatusListener) {
                    clearInterval(getDriveStatusListener);
                }
                this.setState({ rideStatus: "idle" });
            }
        } catch (err) {
            console.warn(err);
            this.setState({ rideStatus: "idle" });
        }
    };

    _getMyLocations = async () => {
        try {
            const user = await GoogleSignin.getCurrentUser();
            if (!user) {
                throw new Error("No user!");
            }
            const response = await fetch(`${GCP_ENDPOINT}/location/mine`, {
                method: "GET",
                headers: new Headers({
                    Authorization: `Bearer ${user.idToken}`
                })
            });
            if (response.ok) {
                const myLocations: Location[] = await response.json();
                const recentLocations: LocationWithDistance[] = myLocations.map((location: Location) => {
                    return { location };
                });
                this.setState({ recentLocations });
                this._calculateDistanceToMyLocations();
            }
        } catch (err) {
            console.warn(err);
            Alert.alert(
                "Unable to load recent locations!",
                "An unexpected error occurred!",
                [
                    {
                        text: "Okay"
                    }
                ]);
        }
    };

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

    _getLocalRiders = async () => {
        try {
            const user = await GoogleSignin.getCurrentUser();
            if (!user) {
                throw new Error("No user!");
            }
            const response = await fetch(`${GCP_ENDPOINT}/driver/passengers`, {
                method: "GET",
                headers: new Headers({
                    Authorization: `Bearer ${user.idToken}`
                })
            });
            if (response.ok) {
                const rides = await response.json() as DetailedRide[];
                const localRides: DetailedRideWithDistance[] = rides.map((ride: DetailedRide) => {
                    return { ride };
                });
                this.setState({ localRides });
                console.log(localRides);
                this._calculateDistanceToRides();
            }
        } catch (err) {
            console.warn(err);
            Alert.alert(
                "Unable to load recent locations!",
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
        if (getLocalRidersListener) {
            clearInterval(getLocalRidersListener);
        }
        try {
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
                    this._getLocalRiders();
                    if (getLocalRidersListener === undefined) {
                        getLocalRidersListener = setInterval(this._getLocalRiders, 2500);
                    }
                } else {
                    this.setState({ riderStatus: "rider" });
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
                const newLocation: LocationWithDistance = { location: await response.json() };
                this.setState({ recentLocations: [newLocation].concat(recentLocations) });
                this._calculateDistanceToMyLocations();
            }
        } catch (err) {
            console.warn(err);
        }
    };

    _handleLocationPressForRider = (location: LocationWithDistance) => {
        Alert.alert(
            "Request a ride?",
            `Would you like to request a ride to ${location.location.formatted_address}?`,
            [
                {
                    text: "Okay", onPress: async () => {
                        try {
                            const user = await GoogleSignin.getCurrentUser();
                            if (!user) {
                                throw new Error("No user!");
                            }
                            if (!location.location.id) {
                                this._getMyLocations();
                                return;
                            }
                            const response = await fetch(`${GCP_ENDPOINT}/ride/request`, {
                                method: "POST",
                                headers: new Headers({
                                    Authorization: `Bearer ${user.idToken}`,
                                    "Content-Type": "application/json"
                                }),
                                body: JSON.stringify({
                                    location: location.location.id
                                })
                            });
                            if (response.status === 403) {
                                Alert.alert(
                                    "Unable to request multiple rides at once",
                                    "You are unable to request more than one ride at a single time.",
                                    [{ text: "Okay" }]
                                );
                                this.setState({ rideStatus: "awaiting_pickup" });
                            } else if (response.ok) {
                                this.setState({ rideStatus: "awaiting_pickup" });
                            }
                            this._checkForExistingRide();
                        } catch (err) {
                            console.warn(err);
                        }
                    }
                },
                { text: "Cancel", style: "cancel" }
            ]
        );
    };

    _handleLocationLongPressForRider = (location: LocationWithDistance) => {
        Alert.alert(
            "Delete location",
            `Would you like to delete ${location.location.formatted_address}?`,
            [
                {
                    text: "Delete", style: "destructive", onPress: async () => {
                        try {
                            const user = await GoogleSignin.getCurrentUser();
                            if (!user) {
                                throw new Error("No user!");
                            }
                            console.log(`${GCP_ENDPOINT}/location/delete`);
                            const response = await fetch(`${GCP_ENDPOINT}/location/delete`, {
                                method: "POST",
                                headers: new Headers({
                                    Authorization: `Bearer ${user.idToken}`,
                                    "Content-Type": "application/json"
                                }),
                                body: JSON.stringify({
                                    id: location.location.id
                                })
                            });
                            console.log(response.status);
                            if (response.ok) {
                                this._getMyLocations();
                                Alert.alert(
                                    "Location deleted",
                                    `${location.location.formatted_address} has been deleted.`,
                                    [{ text: "Okay" }]
                                );
                            } else {
                                throw new Error(response.status.toString());
                            }
                        } catch (err) {
                            console.warn(err);
                            Alert.alert(
                                "Unable to delete location",
                                "An unexpected error occurred.",
                                [
                                    {
                                        text: "Okay"
                                    }
                                ]);
                        }
                    }
                },
                { text: "Cancel", style: "cancel" }
            ]
        );
    };

    _handleRidePressForDriver = async (ride: DetailedRideWithDistance) => {
        try {
            const user = await GoogleSignin.getCurrentUser();
            if (!user) {
                throw new Error("No user!");
            }
            if (!ride.ride.id) {
                this._getLocalRiders();
                return;
            }
            const response = await fetch(`${GCP_ENDPOINT}/ride/start`, {
                method: "POST",
                headers: new Headers({
                    Authorization: `Bearer ${user.idToken}`,
                    "Content-Type": "application/json"
                }),
                body: JSON.stringify({
                    ride: ride.ride.id
                })
            });
            if (response.status === 403) {
                Alert.alert(
                    "Unable to start drive",
                    "An unexpected error ocurred.",
                    [{ text: "Okay" }]
                );
            } else if (response.ok) {
                this.setState({ rideStatus: "driving" });
                if (getLocalRidersListener === undefined) {
                    getLocalRidersListener = setInterval(this._getLocalRiders, 2500);
                }
            }
            this._checkForExistingDrive();
        } catch (err) {
            console.warn(err);
        }
    };

    _cancelRide = async () => {
        try {
            const user = await GoogleSignin.getCurrentUser();
            if (!user) {
                throw new Error("No user!");
            }
            const response = await fetch(`${GCP_ENDPOINT}/ride`, {
                headers: new Headers({
                    Authorization: `Bearer ${user.idToken}`
                })
            });
            const ride = await response.json() as Ride;
            if (ride) {
                const cancelResponse = await fetch(
                    `${GCP_ENDPOINT}/ride/cancel`,
                    {
                        method: "POST",
                        headers: new Headers({
                            Authorization: `Bearer ${user.idToken}`,
                            "Content-Type": "application/json"
                        }),
                        body: JSON.stringify({
                            id: ride.id
                        })
                    });
                console.log(cancelResponse.status);
                if (cancelResponse.ok) {
                    if (getRideStatusListener) {
                        clearInterval(getRideStatusListener);
                    }
                    this.setState({ rideStatus: "idle" });
                } else {
                    Alert.alert(
                        "Unable to cancel request",
                        "An unexpected error occurred!",
                        [{ text: "Okay" }]
                    );
                }
            }
        } catch (err) {
            console.warn(err);
        }
    };

    _cancelDrive = async () => {
        try {
            const user = await GoogleSignin.getCurrentUser();
            if (!user) {
                throw new Error("No user!");
            }
            const response = await fetch(`${GCP_ENDPOINT}/driver`, {
                headers: new Headers({
                    Authorization: `Bearer ${user.idToken}`
                })
            });
            const ride = await response.json() as Ride;
            if (ride) {
                const cancelResponse = await fetch(
                    `${GCP_ENDPOINT}/ride/cancel`,
                    {
                        method: "POST",
                        headers: new Headers({
                            Authorization: `Bearer ${user.idToken}`,
                            "Content-Type": "application/json"
                        }),
                        body: JSON.stringify({
                            id: ride.id
                        })
                    });
                console.log(cancelResponse.status);
                if (cancelResponse.ok) {
                    if (getDriveStatusListener) {
                        clearInterval(getDriveStatusListener);
                    }
                    this.setState({ rideStatus: "idle" });
                } else {
                    Alert.alert(
                        "Unable to cancel request",
                        "An unexpected error occurred!",
                        [{ text: "Okay" }]
                    );
                }
            }
        } catch (err) {
            console.warn(err);
        }
    };

    _pickupRider = async () => {
        try {
            const user = await GoogleSignin.getCurrentUser();
            if (!user) {
                throw new Error("No user!");
            }
            const response = await fetch(`${GCP_ENDPOINT}/driver`, {
                headers: new Headers({
                    Authorization: `Bearer ${user.idToken}`
                })
            });
            const ride = await response.json() as Ride;
            if (ride) {
                const cancelResponse = await fetch(
                    `${GCP_ENDPOINT}/ride/pickup`,
                    {
                        method: "POST",
                        headers: new Headers({
                            Authorization: `Bearer ${user.idToken}`,
                            "Content-Type": "application/json"
                        }),
                        body: JSON.stringify({
                            ride: ride.id
                        })
                    });
                console.log(cancelResponse.status);
                if (cancelResponse.ok) {
                    this.setState({ rideStatus: "driving" });
                } else {
                    Alert.alert(
                        "Unable to pickup rider",
                        "An unexpected error occurred!",
                        [{ text: "Okay" }]
                    );
                }
            }
        } catch (err) {
            console.warn(err);
        }
    };

    render() {
        const { region, riderStatus, recentLocations, rideStatus, localRides } = this.state;

        const viableLocalRides = localRides
            .filter(ride => (ride.distanceToRider || 0) <= 10)
            .filter(ride => (ride.distanceToDestination || 0) <= 50)
            .sort((a, b) => (a.distanceToRider || 0) - (b.distanceToRider || 0));

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
                >
                    {riderStatus === "rider" && recentLocations.map((location, i) =>
                        <Marker
                            key={i}
                            coordinate={{
                                latitude: parseFloat(location.location.latitude),
                                longitude: parseFloat(location.location.longitude)
                            }}
                            pinColor="#0000FF"
                            onPress={() => Alert.alert(
                                location.location.formatted_address,
                                `This location is ${(location.distance || 0).toFixed(2)} miles away.`
                            )}
                        />
                    )}
                    {riderStatus === "driver" && viableLocalRides.map((rider, i) =>
                        <Marker
                            key={i}
                            coordinate={{
                                latitude: parseFloat(rider.ride.user_latitude),
                                longitude: parseFloat(rider.ride.user_longitude)
                            }}
                        />
                    )}
                </MapView>
                {riderStatus === "rider"
                    ? rideStatus === "idle"
                        ? <RiderMapActionTab
                            locations={recentLocations}
                            onLocationPressed={this._handleLocationPressForRider}
                            onLocationLongPressed={this._handleLocationLongPressForRider} />
                        : null
                    : rideStatus === "idle"
                        ? <DriverMapActionTab
                            rides={viableLocalRides}
                            onRidePressed={this._handleRidePressForDriver} />
                        : null
                }
                {rideStatus === "idle" &&
                    <View
                        style={{
                            flex: 0.5,
                            flexDirection: 'row',
                            backgroundColor: '#BF3668',
                            paddingLeft: '10%',
                            paddingRight: '10%',
                            paddingBottom: '2%',
                            alignItems: 'center',
                            borderColor: '#D95F76',
                            borderStyle: 'solid',
                            borderTopWidth: 2
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <Button
                                title="RIDE"
                                onPress={this._verifyUserExists}
                                color={riderStatus === "rider" ? "#f3f3f3" : "#333"}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Button
                                title="DRIVE"
                                onPress={this._verifyIsDriver}
                                color={riderStatus === "driver" ? "#f3f3f3" : "#333"}
                            />
                        </View>
                    </View>
                }
                {(rideStatus === "awaiting_driver"
                    || rideStatus === "awaiting_pickup") &&
                    <AwaitingPickupBar
                        status={rideStatus}
                        onCancelRidePressed={riderStatus === "rider" ? this._cancelRide : undefined}
                        onPickupRiderPressed={riderStatus === "driver" ? this._pickupRider : undefined}
                        onCancelDriverPressed={riderStatus === "driver" ? this._cancelDrive : undefined} />
                }
                {(rideStatus === "riding" || rideStatus === "driving") &&
                    <EnRouteBar
                        onCompletion={rideStatus === "riding" ? this._cancelRide : this._cancelDrive} />
                }
            </>
        );
    }
}
