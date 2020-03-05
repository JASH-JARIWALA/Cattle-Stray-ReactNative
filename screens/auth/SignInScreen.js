import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Alert,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SocialIcon } from "react-native-elements";
import firebase from "../../context/firebase";
import { AuthUser } from "../../context/AuthContext";
import Loading from "../../screens/LoadingScreen";
import * as Google from "expo-google-app-auth";
import * as Facebook from "expo-facebook";

const SignInScreen = ({ navigation }) => {
  const { setDisplayName, setIsLogin } = useContext(AuthUser);
  const [windowHeight, setWindowHeight] = useState(200);
  const [windowWidth, setWindowWidth] = useState(200);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [IsLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setWindowHeight(Dimensions.get("window").height);
    setWindowWidth(Dimensions.get("window").width);
  }, []);

  const loginWithEmail = () => {
    setIsLoading(true);
    try {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(user => {
          console.log(user);
          setIsLoading(false);
          setDisplayName(firebase.auth().currentUser.displayName);
          setIsLogin(true);
        })
        .catch(error => {
          setIsLoading(false);
          Alert.alert(error.toString());
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  function isUserEqual(googleUser, firebaseUser) {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          return true;
        }
      }
    }
    return false;
  }

  function onSignIn(googleUser) {
    console.log("Google Auth Response", googleUser);
    var unsubscribe = firebase
      .auth()
      .onAuthStateChanged(function(firebaseUser) {
        unsubscribe();
        if (!isUserEqual(googleUser, firebaseUser)) {
          var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
          );
          firebase
            .auth()
            .signInWithCredential(credential)
            .then(function() {
              setIsLoading(false);
              setDisplayName(googleUser.user.name);
              setIsLogin(true);
            })
            .catch(function(error) {
              setIsLoading(false);
              console.log(error);
            });
        } else {
          setIsLoading(false);
          console.log("User already signed-in Firebase.");
        }
      });
  }
  const loginWithGoogle = async () => {
    console.log("Google");
    setIsLoading(true);
    try {
      const result = await Google.logInAsync({
        behaviour: "web",
        androidClientId:
          "516153617809-0f1mnh1ipidvonq5mredhhia0o6b6orv.apps.googleusercontent.com",
        iosClientId:
          "516153617809-nbtfb2v75lapnp0rm3dt8ec1n9fnnsvj.apps.googleusercontent.com",
        scopes: ["profile", "email"]
      });
      if (result.type === "success") {
        onSignIn(result);
        return result.accessToken;
      } else {
        setIsLoading(false);
        return { cancelled: true };
      }
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };
  const loginWithFacebook = async () => {
    setIsLoading(true);
    try {
      await Facebook.initializeAsync("1530903700446461");
      const { type, token } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ["public_profile"]
      });
      if (type === "success") {
        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}`
        );
        const cred = firebase.auth.FacebookAuthProvider.credential(token);
        firebase.auth().signInWithCredential(cred);
        setIsLoading(false);
        setDisplayName((await response.json()).name);
        setIsLogin(true);
      }
    } catch (error) {
      setIsLoading(false);
      alert(`Facebook Login Error: ${error}`);
    }
  };

  if (IsLoading) {
    return <Loading />;
  } else {
    return (
      <SafeAreaView style={styles.defaultStyle}>
        <ImageBackground
          source={require("../../images/login_screen.jpg")}
          style={styles.backgroundImage}
          blurRadius={10}
        >
          <ScrollView>
            <View
              style={{
                height: windowHeight,
                display: "flex",
                flex: 1,
                flexDirection: "column",
                justifyContent: "space-evenly"
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 75,
                    fontWeight: "bold",
                    textAlign: "center"
                  }}
                >
                  Hello
                </Text>
                <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                  Sign In To Your Account
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  paddingTop: 50,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    width: windowWidth * 0.8,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    borderWidth: 2,
                    borderRadius: 20,
                    shadowOffset: { width: 5, height: 2 },
                    elevation: 1,
                    shadowColor: "black",
                    shadowOpacity: 0.2
                  }}
                >
                  <Ionicons name='ios-mail' size={30} color='#000' />
                  <TextInput
                    onChangeText={text => setEmail(text)}
                    value={email}
                    style={{
                      width: windowWidth * 0.6,
                      height: 50,
                      fontWeight: "bold"
                    }}
                    placeholder='Email'
                    placeholderTextColor='black'
                    keyboardType='email-address'
                  />
                </View>
                <View
                  style={{
                    width: windowWidth * 0.8,
                    display: "flex",
                    flexDirection: "row",
                    margin: 10,
                    justifyContent: "space-around",
                    alignItems: "center",
                    borderWidth: 2,
                    borderRadius: 20,
                    shadowOffset: { width: 5, height: 2 },
                    elevation: 1,
                    shadowColor: "black",
                    shadowOpacity: 0.2
                  }}
                >
                  <Ionicons name='ios-lock' size={30} color='#000' />
                  <TextInput
                    onChangeText={text => setPassword(text)}
                    value={password}
                    style={{
                      width: windowWidth * 0.6,
                      height: 50,
                      fontWeight: "bold"
                    }}
                    placeholder='Password'
                    placeholderTextColor='black'
                    secureTextEntry={true}
                    keyboardType='default'
                  />
                </View>
              </View>
              <TouchableOpacity onPress={loginWithEmail}>
                <View
                  style={{
                    paddingTop: -20,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    padding: 20
                  }}
                >
                  <Text
                    style={{
                      fontSize: 30,
                      padding: 10,
                      fontWeight: "bold",
                      color: "black"
                    }}
                  >
                    Sign In
                  </Text>
                  <Ionicons
                    name='ios-arrow-dropright-circle'
                    color='#0af'
                    size={50}
                  />
                </View>
              </TouchableOpacity>
              <View>
                <SocialIcon
                  title='Sign In With Google'
                  button
                  type='google'
                  onPress={loginWithGoogle}
                />
                <SocialIcon
                  title='Sign In With Facebook'
                  button
                  type='facebook'
                  onPress={loginWithFacebook}
                />
              </View>
              <TouchableOpacity onPress={() => navigation.push("Sign Up")}>
                <View>
                  <Text
                    style={{
                      fontSize: 15,
                      textAlign: "center",
                      color: "white"
                    }}
                  >
                    Don't have an Account?{" "}
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "bold",
                        textDecorationLine: "underline"
                      }}
                    >
                      Create
                    </Text>
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
    );
  }
};

export default SignInScreen;

const styles = StyleSheet.create({
  defaultStyle: {
    display: "flex",
    flex: 1
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover" // or 'stretch'
  }
});
