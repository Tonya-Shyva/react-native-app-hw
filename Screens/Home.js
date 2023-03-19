import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, Pressable, TouchableOpacity, View } from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { ProfileScreen } from "./ProfileScreen";
import { PostsScreen } from "./PostsScreen";
import { CreatePostsScreen } from "./CreatePostsScreen";
const BottomTab = createBottomTabNavigator();

export const Home = () => {
  //   const dispatch = useDispatch();

  //   const logOutHandler = () => {
  //     dispatch(logOut());
  //   };

  return (
    <BottomTab.Navigator
      style={{ paddingTop: 9, height: 83 }}
      screenOptions={({ route }) => ({
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
          headerRight: () => (
            <Pressable onPress="">
              <MaterialCommunityIcons name="logout" size={24} color="black" />
            </Pressable>
          ),
        }}
      />
      <BottomTab.Screen
        name="Створити публикацію"
        component={CreatePostsScreen}
      />
      <BottomTab.Screen name="Профіль" component={ProfileScreen} />
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
});
