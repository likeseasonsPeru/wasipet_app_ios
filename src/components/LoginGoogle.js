import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';

export default class LoginGoogle extends Component {
  constructor() {
    super();
    this.state = {
      user: [],
    };
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.getCurrentUserInfo = this.getCurrentUserInfo.bind(this);
  }

  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.user = userInfo.user;
      console.log(this.user);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log('user cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.log('operation (e.g. sign in) is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log('play services not available or outdated');
      } else {
        console.log(error);
      }
    }
  };

  signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.user = []; // Remember to remove the user from your app's state as well
      console.log('Estas deslogueado');
    } catch (error) {
      console.error(error);
    }
  };

  getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      this.setState({userInfo});
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        // user has not signed in yet
      } else {
        // some other error
      }
    }
  };

  componentDidMount() {
    GoogleSignin.configure();
    this.getCurrentUserInfo();
  }
  render() {
    return (
      <View>
        <GoogleSigninButton
          style={styles.buttonGoogle}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={this.signIn}
          disabled={this.state.isSigninInProgress}
        />
        <TouchableOpacity
          style={styles.button}
          touchSoundDisabled={false}
          onPress={this.signOut}>
          <View style={styles.container}>
            <Text style={styles.texto}>Salir de Google</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  buttonGoogle: {
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 25,
    padding: 15,
    width: width * 0.8,
    marginTop: 25,
  },
  button: {
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    backgroundColor: '#4267B2',
    borderRadius: 25,
    padding: 15,
    width: width * 0.8,
    marginTop: 25,
  },
  texto: {
    color: 'white',
    fontSize: 16,
  },
  facebookLogo: {
    marginRight: 5,
  },
});
