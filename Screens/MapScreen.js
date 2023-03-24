import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";

export const Map = ({ route }) => {
  console.log(route.params);
  let latitude = 50.1276217;
  let longitude = 13.8839722;
  if (route.params.location) {
    latitude = route.params.location.latitude;
    longitude = route.params.location.longitude;
  }
  return (
    <View style={styles.container}>
      <MapView
        style={mapStyle}
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.006,
        }}
        mapType="standard"
        minZoomLevel={15}
        onMapReady={() => console.log("Map is ready")}
        onRegionChange={() => console.log("Region change")}
      >
        <Marker
          description="Hello"
          title="Place on photo"
          coordinate={{ latitude: latitude, longitude: longitude }}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
