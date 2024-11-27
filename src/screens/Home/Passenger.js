import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert, PermissionsAndroid, Platform, TouchableOpacity, Image } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import Geolocation from 'react-native-geolocation-service';
import coordinatesData from '../../coordinates.json';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BottomSheet from '../../components/BottomSheet';
import useTerminalStore from '../../store/terminalStore';
import vehicleImage from '../../../src/assets/img/vehicle.png';

// const MAPBOX_TOKEN = 'sk.eyJ1IjoianVzdGluZXRvYml0aGUiLCJhIjoiY20zeXQ4NGhmMXBpdzJsc2NmdzM5b2h3ayJ9.Qwk8VK_o0gLtVrXcpOl9aw';

Mapbox.setAccessToken('sk.eyJ1IjoianVzdGluZXRvYml0aGUiLCJhIjoiY20zeXQ4NGhmMXBpdzJsc2NmdzM5b2h3ayJ9.Qwk8VK_o0gLtVrXcpOl9aw');
 
const Passenger = () => {
    const [polylineCoordinates, setPolylineCoordinates] = useState([]);
    const [currentBooking, setCurrentBooking] = useState()
    const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(true);
    const [locationEnabled, setLocationEnabled] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [isRotated, setIsRotated] = useState(false);
    const [selectedTerminals, setSelectedTerminals] = useState([]);
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [cameraSettings, setCameraSettings] = useState({
        centerCoordinate: [125.5800, 7.0650],
        zoomLevel: 12,
        bearing: 0,
        animationMode: 'move',
        animationDuration: 1000,
    });

    const { terminals, fetchTerminals } = useTerminalStore();

    const mapRef = useRef({});
    const [mapReady, setMapReady] = useState(false);

    const handleMapReady = () => {
        setMapReady(true);
    };

    const toggleBottomSheet = () => {
        setIsBottomSheetVisible(!isBottomSheetVisible);
    };

    useEffect(() => {
        Mapbox.setTelemetryEnabled(false);
        checkLocationPermission();
    }, []);

    useEffect(() => {
        fetchTerminals();
    }, [fetchTerminals]);

    useEffect(() => {
        if (polylineCoordinates && polylineCoordinates.length > 0) {
            console.log("polylineCoordinates", polylineCoordinates);

            if (mapRef.current) {
                mapRef.current.setCamera({
                    centerCoordinate: polylineCoordinates[0],
                    zoomLevel: 12,
                    animationMode: 'flyTo',
                    animationDuration: 1000,
                    bearing: 0,
                });
                setIsRotated(false);
            }
        }
    }, [polylineCoordinates]);


    const checkLocationPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Location Access Required",
                    message: "This app needs to access your location to show your current position.",
                    buttonPositive: "OK"
                }
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                getLocation();
            } else {
                Alert.alert("Permission Denied", "Location access is required to show your current location.");
            }
        }
    };

    const getLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCurrentLocation([longitude, latitude]);
                setLocationEnabled(true);
            },
            (error) => {
                Alert.alert("Error", "Unable to retrieve your location. Please enable location services.");
                console.log(error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    const handleRecenter = () => {
        if (currentLocation && mapRef.current) {
            mapRef.current.setCamera({
                centerCoordinate: currentLocation,
                zoomLevel: 12,
                animationMode: 'flyTo',
                animationDuration: 1000,
                bearing: 0,
            });

            setIsRotated(false);
        } else {
            Alert.alert("Location not available", "Your current location is not available yet.");
        }
    };

    const handleRegionDidChange = (region) => {
        const bearing = region.properties.bearing;
        setIsRotated(bearing !== 0);
    };

    // console.log("currentBooking", currentBooking)

    return (
        <View style={styles.container}>

            <Mapbox.MapView
                style={styles.map}
                accessToken={'sk.eyJ1IjoianVzdGluZXRvYml0aGUiLCJhIjoiY20zeXQ4NGhmMXBpdzJsc2NmdzM5b2h3ayJ9.Qwk8VK_o0gLtVrXcpOl9aw'}
                ref={mapRef}
                onMapIdle={handleRegionDidChange}
                onMapReady={handleMapReady}
            >
                <Mapbox.Camera
                    ref={(ref) => { mapRef.current = ref; }}
                    centerCoordinate={polylineCoordinates.length > 0 ? polylineCoordinates[0] : currentLocation}
                    zoomLevel={12}
                    animationMode="move"
                    animationDuration={1000}
                />


                {polylineCoordinates.length > 0 && (
                    <Mapbox.ShapeSource
                        id="routeSource"
                        shape={{
                            type: 'Feature',
                            geometry: {
                                type: 'LineString',
                                coordinates: polylineCoordinates,
                            },
                        }}
                    >
                        <Mapbox.LineLayer
                            id="routeLine"
                            style={{
                                lineColor: '#ff0000',
                                lineWidth: 5,
                            }}
                        />
                    </Mapbox.ShapeSource>
                )}
                {/*  <Mapbox.ShapeSource id="routeSource" shape={{
                    type: "Feature",
                    geometry: {
                        type: "LineString",
                        coordinates: coordinates
                    }
                }}>
                    <Mapbox.LineLayer
                        id="routeLine"
                        style={{
                            lineColor: "#ff0000",
                            lineWidth: 5,
                        }}
                    />
                </Mapbox.ShapeSource> */}

                {terminals.map((terminal) => (
                    <Mapbox.PointAnnotation
                        key={terminal.id}
                        id={`terminal-${terminal.id}`}
                        coordinate={[parseFloat(terminal.longitude), parseFloat(terminal.latitude)]}
                    >
                        <View style={styles.markerContainer}>
                            <View style={styles.marker} />
                        </View>
                        <Mapbox.Callout title={terminal.name} />
                    </Mapbox.PointAnnotation>
                ))}

                {currentLocation && (
                    <Mapbox.PointAnnotation
                        id="currentLocation"
                        coordinate={currentLocation}
                    >
                        <View style={styles.userMarkerContainer}>
                            <View style={styles.userMarker} />

                            {currentBooking && (
                                <Image
                                    source={vehicleImage}
                                    style={styles.markerImage}
                                />
                            )}
                        </View>

                        <Mapbox.Callout title="You are here" />
                    </Mapbox.PointAnnotation>
                )}


            </Mapbox.MapView>

            {isRotated && (
                <TouchableOpacity style={styles.recenterButton} onPress={handleRecenter}>
                    <FontAwesome name="location-arrow" size={22} color={"#000"} />
                </TouchableOpacity>
            )}

            {!locationEnabled && (
                <Text style={styles.enableLocationText}>
                    Please enable location services to show your current location.
                </Text>
            )}

            <BottomSheet
                visible={isBottomSheetVisible}
                toggleVisibility={toggleBottomSheet}
                setPolylineCoordinates={setPolylineCoordinates}
                setCurrentBooking={setCurrentBooking}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    enableLocationText: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 10,
        borderRadius: 5,
    },
    recenterButton: {
        position: 'absolute',
        // top: 150,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        elevation: 5,
        borderRadius: 45,
        height: 45,
        bottom: 280
    },
    recenterButtonText: {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    marker: {
        width: 20,
        height: 20,
        backgroundColor: '#ff0000',
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
    },
    userMarkerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    userMarker: {
        width: 15,
        height: 15,
        backgroundColor: '#0000ff',
        borderRadius: 7.5,
        borderColor: '#fff',
        borderWidth: 2,
    },
    markerImage: {
        width: 30,
        height: 30,
    },
});

export default Passenger;
