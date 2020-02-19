import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import FBSDK,{LoginManager, AccessToken} from 'react-native-fbsdk';

export default class LoginFacebook extends Component {
  constructor() {
    super();
    this.state = {
      user: [],
    };
    this.initUser = this.initUser.bind(this);
    this.handleFacebookLogin = this.handleFacebookLogin.bind(this);
  }

  initUser(token) {
    fetch(
      'https://graph.facebook.com/v5.0/me?fields=name,email,picture.type(large)&access_token=' +
        token,
    )
      .then(response => response.json())
      .then(json => {
        this.user = json;
        console.log(this.user);
      })
      .catch(() => {
        console.log('ERROR GETTING DATA FROM FACEBOOK');
      });
  }

  handleFacebookLogin() {
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      result => {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            const {accessToken} = data;
            this.initUser(accessToken);
          });
        }
      },
      error => {
        console.log('Login fail with error: ' + error);
      },
    );
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          style={styles.button}
          touchSoundDisabled={false}
          onPress={this.handleFacebookLogin}>
          <View style={styles.container}>
            <Image
              style={styles.facebookLogo}
              source={require('../assets/images/facebookLogo.png')}
            />
            <Text style={styles.texto}>Ingresa con Facebook</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
/*readPermissions={['email', 'public_profile']}*/
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
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
/*
<View style={styles.container}>
        <LoginButton
          style={styles.btnFacebook}
          permissions={['email', 'user_friends', 'public_profile']}
          onLoginFinished={(error, result) => {
            if (error) {
              console.log('login has error: ' + result.error);
            } else if (result.isCancelled) {
              console.log('login is cancelled.');
            } else {
              AccessToken.getCurrentAccessToken().then(data => {
                const {accessToken} = data;
                this.initUser(accessToken);
              });
            }
          }}
          onLogoutFinished={() => console.log('logout.')}
        />
      </View>
*/
