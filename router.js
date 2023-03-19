import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { StyleSheet } from "react-native";
import { CreatePostsScreen } from "./Screens/CreatePostsScreen";
import { Home } from "./Screens/Home";
import { Login } from "./Screens/LoginScreen";
import { PostsScreen } from "./Screens/PostsScreen";
import { ProfileScreen } from "./Screens/ProfileScreen";
import { Registration } from "./Screens/RegistrationScreen";

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

export const useRoute = (isAuth) => {
  if (!isAuth) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Реєстрація"
          component={Registration}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Логін"
          component={Login}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }
  return (
    <Stack.Navigator initialRouteName="Home" style={styles.navBox}>
      <Stack.Screen
        name="home"
        component={Home}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen name="Map" component={Map} />
      <Stack.Screen name="CommentsScreen" component={CommentsScreen} />
      <Stack.Screen name="PostItem" component={PostItem} /> */}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  navBox: {
    padding: 16,

    borderColor: "red",
  },
});
