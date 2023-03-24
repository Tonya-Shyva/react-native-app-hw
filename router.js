import { createStackNavigator } from "@react-navigation/stack";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { refreshUser } from "./redux/auth/sliceAuth";
import { PostItem } from "./components/PostItem";
import { MainScreen } from "./Screens/MainScreen";
import { Login } from "./Screens/LoginScreen";
import { Map } from "./Screens/MapScreen";
import { Registration } from "./Screens/RegistrationScreen";
import { CommentsScreen } from "./Screens/CommentsScreen";

const Stack = createStackNavigator();

export const Routing = () => {
  const dispatch = useDispatch();
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      //   console.log(user);
      if (user) {
        const { displayName, email, uid, accessToken } = user;
        dispatch(
          refreshUser({
            name: displayName,
            email: email,
            id: uid,
            token: accessToken,
          })
        );
      } else {
        console.log("User is signed out");
      }
    });
  }, []);

  const isAuth = useSelector((state) => state.auth.isAuth);

  if (!isAuth) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Логін"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Реєстрація"
          component={Registration}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }
  return (
    <Stack.Navigator initialRouteName="MainScreen" style={styles.navBox}>
      <Stack.Screen
        name="MainScreen"
        component={MainScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="PostItem" component={PostItem} />
      <Stack.Screen name="Map" component={Map} />
      <Stack.Screen name="CommentsScreen" component={CommentsScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  navBox: {
    padding: 16,

    borderColor: "red",
  },
});
