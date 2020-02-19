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
import AsyncStorage from '@react-native-community/async-storage';

import {connect} from 'react-redux';
import {deauthenticate} from '../redux/actions/authActions';
import {API} from '../config';

class Menu extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.logout = this.logout.bind(this);
  }

  UNSAFE_componentWillMount() {
    let session = {
      token: null,
      user: null,
    };

    /*AsyncStorage.getItem('token')
      .then(value => (session.token = value))
      .catch(e => console.log(e));
    AsyncStorage.getItem('user')
      .then(value => (session.user = value))
      .catch(e => console.log(e));*/
    const token = this.getStoreData('token');
    const user = this.getStoreData('user');
   // console.log('Token:' + token + 'User:' + user);
  }

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

  handleSubmit() {
    fetch(`${API}/user`, {
      Accept: 'application/json',
      headers: {
        Authorization: `Bearer ${this.props.session.token}`,
      },
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        this.setState({
          name: data.name,
          email: data.email,
        });
      });
  }

  async logout() {
    const token = this.props.session.token;
    if (token) {
      this.props.deauthenticate(token);
      try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
      } catch (err) {
        console.log(err);
      }
    } else {
      alert('you already logout');
    }
    this.props.navigation.navigate('Login');
  }
  render() {
    return (
      <ImageBackground
        source={require('../assets/images/pruebaback.jpg')}
        style={styles.containerImage}>
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <Text style={styles.title}>Menu</Text>
            <Image
              style={styles.images}
              source={require('../assets/images/logo.png')}
            />
          </View>
          <View style={styles.middleContainer}>
            <Text style={styles.subTitle}>Formulario</Text>
            <View style={styles.container}>
              <View>
                <Text style={styles.texto}> {this.state.email} </Text>
                <Text style={styles.texto}> {this.state.name} </Text>
              </View>
              <TouchableOpacity
                style={styles.button}
                touchSoundDisabled={false}
                onPress={() => this.handleSubmit()}>
                <Text style={styles.texto}>Obtener</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                touchSoundDisabled={false}
                onPress={() => this.logout()}>
                <Text style={styles.texto}>Salir</Text>
              </TouchableOpacity>
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
    deauthenticate: token => {
      return dispatch(deauthenticate(token));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Menu);

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
    marginBottom: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  texto: {
    color: 'white',
    fontSize: 20,
  },
});
