import React, { useCallback, useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Dimensions, StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { useRoute } from "./router";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const routing = useRoute(true);
  const [fontsLoaded] = useFonts({
    Roboto400: require("./assets/fonts/Roboto/Roboto-Regular.ttf"),
    Roboto500: require("./assets/fonts/Roboto/Roboto-Medium.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  // const [dimentions, setDimentions] = useState(
  //   Dimensions.get("window").width - 20 * 2
  // );

  // useEffect(() => {
  //   const onChange = () => {
  //     const widthScreen = Dimensions.get("window").width - 20 * 2;
  //     setDimentions(widthScreen);
  //   };
  //   Dimensions.addEventListener("change", onChange);
  //   return () => {
  //     Dimensions.removeEventListener("change", onChange);
  //   };
  // }, []);

  return (
    <NavigationContainer>
      <View style={styles.appContainer} onLayout={onLayoutRootView}>
        {routing}
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    // alignItems: "stretch",
  },
});
