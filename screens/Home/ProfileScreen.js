import React, { useContext } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import firebase from "../../context/firebase";
import { AuthUser } from "../../context/AuthContext";

const ProfileScreen = () => {
  const { displayName } = useContext(AuthUser);
  const logout = () => {
    firebase.auth().signOut();
  };
  return (
    <View
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Text>ProfileScreen</Text>
      <Text>{displayName}</Text>
      <Button title='logout' onPress={logout} />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
