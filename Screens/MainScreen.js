import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, Pressable, View } from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";

import { ProfileScreen } from "./ProfileScreen";
import { PostsScreen } from "./PostsScreen";
import { CreatePostsScreen } from "./CreatePostsScreen";
import { logOut } from "../redux/auth/authOperations";

const BottomTab = createBottomTabNavigator();

export const MainScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const logOutHandler = () => {
    dispatch(logOut());
  };

  return (
    <BottomTab.Navigator
      style={{ paddingTop: 9, height: 83 }}
      screenOptions={({ route }) => ({
        headerTitleStyle: styles.headerTitleStyle,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "";

          if (route.name === "Публікації") {
            iconName = "appstore-o";
          } else if (route.name === "Створити публикацію") {
            iconName = "plus";
          } else if (route.name === "Профіль") {
            iconName = "user";
          }

          return (
            <View
              style={{
                ...styles.container,
                backgroundColor: focused ? "#FF6C00" : "#fff",
              }}
            >
              <AntDesign name={iconName} color={color} size={24} />
            </View>
          );
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <BottomTab.Screen
        name="Публікації"
        component={PostsScreen}
        options={{
          headerTitleAlign: "center",
          headerRight: () => (
            <Pressable onPress={logOutHandler}>
              <MaterialCommunityIcons name="logout" size={24} color="#BDBDBD" />
            </Pressable>
          ),
        }}
      />
      <BottomTab.Screen
        name="Створити публикацію"
        component={CreatePostsScreen}
        options={{
          headerTitleAlign: "center",
          headerLeft: () => (
            <Pressable onPress={() => navigation.navigate("Публікації")}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color="#BDBDBD"
              />
            </Pressable>
          ),
        }}
      />
      <BottomTab.Screen
        name="Профіль"
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
    </BottomTab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 70,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleStyle: {
    fontSize: 19,
  },
});
