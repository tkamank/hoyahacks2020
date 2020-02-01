import React, { Component } from 'react';
import {
    SafeAreaView,
    StatusBar,
    View,
    Text,
    FlatList,
    StyleSheet
} from 'react-native';
import { NavigationSwitchScreenProps } from "react-navigation";
import MapView, { Region } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { Location } from '../lib/types';

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

    verifyIsDriver() {

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
                        }} />
                <SafeAreaView style={{flex: 1.6}}>
                    <View style={{ flex: 0.5, backgroundColor: '#F3F3F3', alignItems: 'center'}}>
                            <Text style={{paddingTop: "5%", paddingBottom: "8%",shadowColor: '#000000', color: '#D95F76', fontSize: 26, fontWeight: "600" }}>
                                Plans for today?
                            </Text>
                            </View>
                        <View style={{flex: 1.5, justifyContent: "center"}}>
                                <FlatList
                                    data={RECENT_LOCATIONS}
                                    renderItem={({ item }: { item: Location }) => 
                                    <View style={{alignItems: 'center'}}><Text style={{color: '#f3f3f3', fontWeight: "700", padding: 10, overflow: 'hidden', borderRadius: 6, fontSize: 24, margin: '1%',backgroundColor: '#2C73A6'}}>{item.title}</Text></View>}
                                    keyExtractor={(_: Location, i: number) => i.toString()}
                                >
                                </FlatList>
                        </View>
                    
                </SafeAreaView>
                <View style={{flex: 0.5, flexDirection: 'row', backgroundColor: '#BF3668', paddingLeft: '10%', paddingRight: '10%', paddingBottom: '2%', alignItems: 'center'}}>
                        <Text style={{flex: 1, textAlign: 'center', color: '#f3f3f3', fontWeight: '500', fontSize: 24}}>Ride</Text>
                        <Text style={{flex: 1, textAlign: 'center', color: '#f3f3f3', fontWeight: '500', fontSize: 24}}>Drive</Text>
                        <Text style={{flex: 1, textAlign: 'center', color: '#f3f3f3', fontWeight: '500', fontSize: 24}}>User</Text>
                </View>
            </>
        );
    }
}
