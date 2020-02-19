/* eslint-disable no-alert */
import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  ImageBackground,
} from 'react-native';

import {API} from '../config';
import LoginFacebook from './LoginFacebook';
import LoginGoogle from './LoginGoogle';
//import firebase from 'react-native-firebase';

import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import {
  authenticate,
  deauthenticate,
  reauthenticate,
} from '../redux/actions/authActions';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: null,
      password: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getStoreData = this.getStoreData.bind(this);
    this.setStoreData = this.setStoreData.bind(this);
    //this.checkPermission = this.checkPermission.bind(this);
    //this.requestPermission = this.requestPermission.bind(this);
    //this.getToken = this.getToken.bind(this);
  }

  async componentDidMount() {
    const token = await this.getStoreData('token');
    const user = await this.getStoreData('user');

    if (token && user) {
      let session = {
        token,
        id: user,
      };
      this.checkPermission();
      this.props.reauthenticate(session);
    }
    //AsyncStorage.getItem('token').then(value => (session.token = value));
    //AsyncStorage.getItem('user').then(value => (session.user = value));
  }

  async componentDidUpdate() {
    if (this.props.session.token && this.props.session.user) {
      this.setStoreData('token', this.props.session.token);
      this.setStoreData('user', this.props.session.user);
      //this.checkPermission();
      this.props.navigation.navigate('Menu');
    }
  }

  setStoreData = async (key, value) => {
    //console.log(key, value);
    try {
      await AsyncStorage.setItem(key, value);
    } catch (err) {
      console.log(err);
    }
  };

  getStoreData = async key => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        return value;
      }
      return value;
    } catch (err) {
      console.log(err);
    }
    return null;
  };

  /*async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log(fcmToken);
    // console.log(fcmToken);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await this.setStoreData('fcmToken', fcmToken);
        this.updatefcmToken(fcmToken);
      } else {
        console.log('no se puedo obtener fcmtoken de firebase');
      }
    }
  }

  //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }

  async updatefcmToken(token) {
    let data = new FormData();
    data.append('id', this.props.session.user);
    data.append('tokenfcm', token);

    fetch(`${API}/tokenfcm`, {
      method: 'PUT',
      headers: {
        // eslint-disable-next-line prettier/prettier
          'Accept': 'application/json',
      },
      body: data,
    })
      .then(response => response.json())
      .then(response => {
        console.log(`update token : ${response.auth}`);
      })
      .catch(err => {
        console.log(err);
      });
  }*/

  async handleSubmit() {
    const {email, password} = this.state;
    if (email && password) {
      this.props.authenticate(this.state);
    } else {
      alert('Complete todos los campos');
    }
  }

  render() {
    return (
      <ImageBackground
        source={require('../assets/images/pruebaback.jpg')}
        style={styles.containerImage}>
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <Text style={styles.title}>Login</Text>
            <Image
              style={styles.images}
              source={require('../assets/images/logo.png')}
            />
          </View>
          <View style={styles.middleContainer}>
            <Text style={styles.subTitle}>Formulario</Text>
            <View style={styles.container}>
              <TextInput
                style={styles.item}
                label="Correo electrónico"
                name="email"
                placeholder="Correo electrónico"
                autoCompleteType="email"
                textContentType="emailAddress"
                value={this.state.email}
                onChangeText={text => this.setState({email: text})}
              />
              <TextInput
                style={styles.item}
                label="Contraseña"
                name="password"
                placeholder="Contraseña"
                autoCompleteType="password"
                secureTextEntry={true}
                value={this.state.password}
                onChangeText={text => this.setState({password: text})}
              />
              <TouchableOpacity
                style={styles.button}
                touchSoundDisabled={false}
                onPress={() => this.handleSubmit()}>
                <Text style={styles.texto}>Ingresar</Text>
              </TouchableOpacity>
              <LoginFacebook />
              <LoginGoogle />
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => {
  return {
    session: state.authentication, // session.token , session.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    authenticate: user => {
      return dispatch(authenticate(user));
    },
    deauthenticate: token => {
      return dispatch(deauthenticate(token));
    },
    reauthenticate: session => {
      return dispatch(reauthenticate(session));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);

/*readPermissions={['email', 'public_profile']}*/

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  containerImage: {
    width: '100%',
    height: height,
    flex: 1,
  },
  topContainer: {
    flex: 1,
    alignItems: 'center',
  },
  middleContainer: {
    flex: 3,
  },
  title: {
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
    fontSize: width * 0.07,
    padding: 15,
  },
  subTitle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 21,
    padding: 15,
  },
  images: {
    width: 80,
    height: 80,
  },
  item: {
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    height: 40,
    borderWidth: 1,
    borderRadius: 25,
    width: '90%',
    alignSelf: 'center',
    borderColor: '#232323',
  },
  button: {
    backgroundColor: '#232323',
    color: 'white',
    width: '80%',
    fontSize: 22,
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 35,
    paddingTop: 10,
    paddingBottom: 10,
  },
  texto: {
    color: 'white',
    fontSize: 20,
  },
  btnFacebook: {
    marginTop: 25,
    backgroundColor: 'blue',
  },
});
