import React, { useEffect, useState } from "react";
import { AuthUser } from "./context/AuthContext";
import Loading from "./screens/LoadingScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SignInScreen from "./screens/auth/SignInScreen";
import SignUpScreen from "./screens/auth/SignUpScreen";
import firebase from "./context/firebase";
import HomeScreen from "./screens/Home/HomeScreen";
import ProfileScreen from "./screens/Home/ProfileScreen";
import SettingScreen from "./screens/Home/SettingScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const AuthStack = createStackNavigator();
const AuthStackScreen = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name='Sign In'
        component={SignInScreen}
        options={{ title: null, headerTransparent: "true" }}
      />
      <AuthStack.Screen
        name='Sign Up'
        component={SignUpScreen}
        options={{ headerTransparent: "true", title: null }}
      />
    </AuthStack.Navigator>
  );
};

const BottomNavigator = createBottomTabNavigator();
const BottomNavigatorScreen = () => {
  return (
    <BottomNavigator.Navigator
      tabBarOptions={{ inactiveTintColor: "grey", activeTintColor: "#0af" }}
    >
      <BottomNavigator.Screen
        name='Home Screen'
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name='home' color={color} size={size} />
          )
        }}
      />

      <BottomNavigator.Screen
        name='Profile Screen'
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name='account' color={color} size={size} />
          )
        }}
      />

      <BottomNavigator.Screen
        name='Settings Screen'
        component={SettingScreen}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name='settings' color={color} size={size} />
          )
        }}
      />
    </BottomNavigator.Navigator>
  );
};

export default function App() {
  const [isLoading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  const authContext = { displayName, setDisplayName, isLogin, setIsLogin };

  useEffect(() => {
    checkLogin();
  });

  const checkLogin = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setDisplayName(user.displayName);
        setIsLogin(true);
      } else {
        setDisplayName("");
        setIsLogin(false);
      }
    });
  };

  if (isLoading) {
    return <Loading />;
  } else {
    return (
      <AuthUser.Provider value={authContext}>
        <NavigationContainer>
          {isLogin ? <BottomNavigatorScreen /> : <AuthStackScreen />}
        </NavigationContainer>
      </AuthUser.Provider>
    );
  }
}
