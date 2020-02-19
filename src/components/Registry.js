/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-alert */
import React, { Component } from 'react';
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
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';

import { connect } from 'react-redux';
import  {register, deauthenticate}  from '../redux/actions/authActions';
import ImagePicker from 'react-native-image-picker';
import { PermissionsAndroid } from 'react-native';

class Registry extends Component {
  constructor() {
    super();
    this.state = {
      name: null,
      email: null,
      phone: null,
      photo: null,
      type_user: 'user',
      provide_services: 'app',
      password: null,
      confirm_password: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.requestCameraPermission = this.requestCameraPermission.bind(this);
    this.handleChoosePhoto = this.handleChoosePhoto.bind(this);
  }

  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
      console.log(granted);
      if (granted['android.permission.CAMERA'] == PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You have permissions for use the camera');
      }
    } catch (err) {
      console.warn('Permisions error', err);
    }
  };
  handleSubmit() {
    const { name, photo, phone, email, password, confirm_password } = this.state;
    if (name && photo && phone && email && password && confirm_password) {
      if (password !== confirm_password) {
        alert('Confima nuevamente tu contraseña');
      } else {
        this.props.register(this.state);
      }
    } else {
      console.log('Complete all the fiels');
      alert('Complete all the fields');
    }
  }

  handleChoosePhoto = async () => {
    const options = {
      noData: true,
      title: 'Seleccione una foto',
      takePhotoButtonTitle: 'Tomar una foto',
      chooseFromLibraryButtonTitle: 'Seleccionar desde el telefono',
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.9,
    };
    await this.requestCameraPermission();
    ImagePicker.showImagePicker(options, (response) => {
      // eslint-disable-next-line no-undef
      console.log(response);
      if (response.didCancel) {
        alert('User cancelled image picker');
      } else if (response.error) {
        alert('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        alert('User tapped custom button: ', response.customButton);
      } else {
        this.setState({ photo: response });
        alert('The image upload successfully');
      }
    });
  };

  render() {
    return (
      <ImageBackground
        source={require('../assets/images/pruebaback.jpg')}
        style={styles.containerImage}>
        <KeyboardAvoidingView style={styles.container}>
          <ScrollView>
            <View style={styles.middleContainer}>
              <Text style={styles.title}>Registro</Text>
              <View style={styles.container}>

                <View style={styles.imageView}>
                  <TouchableOpacity
                    style={styles.imagebutton}
                    onPress={() => this.handleChoosePhoto()}>
                    <Text style={styles.texto}>Eligen una foto</Text>
                  </TouchableOpacity>
                  {this.state.photo && (
                    <Image
                      source={{ uri: this.state.photo.uri }}
                      style={styles.photo}
                      resizeMode="contain"
                    />
                  )}
                </View>

                <TextInput
                  style={styles.item}
                  label="Name"
                  name="name"
                  placeholder="Nombre"
                  autoCompleteType="name"
                  textContentType="name"
                  value={this.state.name}
                  onChangeText={text => this.setState({ name: text })}
                />
                <TextInput
                  style={styles.item}
                  label="Phone"
                  name="phone"
                  placeholder="Telefono"
                  textContentType="telephoneNumber"
                  value={this.state.phone}
                  onChangeText={text => this.setState({ phone: text })}
                />
                <TextInput
                  style={styles.item}
                  label="Correo electrónico"
                  name="email"
                  placeholder="Correo electrónico"
                  autoCompleteType="email"
                  textContentType="emailAddress"
                  value={this.state.email}
                  onChangeText={text => this.setState({ email: text })}
                />
                <TextInput
                  style={styles.item}
                  label="Contraseña"
                  name="password"
                  placeholder="Contraseña"
                  autoCompleteType="password"
                  secureTextEntry={true}
                  value={this.state.password}
                  onChangeText={text => this.setState({ password: text })}
                />
                <TextInput
                  style={styles.item}
                  label="Confirmar_contraseña"
                  name="conf_password"
                  placeholder="Respite tu contraseña"
                  autoCompleteType="password"
                  secureTextEntry={true}
                  value={this.state.confirm_password}
                  onChangeText={text => this.setState({ confirm_password: text })}
                />
                <TouchableOpacity
                  style={styles.button}
                  touchSoundDisabled={false}
                  onPress={() => this.handleSubmit()}>
                  <Text style={styles.texto}>Ingresar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}

const mapStateToProps = state => {
  return {
    session: state.authentication,  // session.token , session.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    register: (user) => {
      return dispatch(register(user));
    },
    deauthenticate: (token) => {
      return dispatch(deauthenticate(token));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Registry);

// ----------------------   Styles ------------------------------

const { width, height } = Dimensions.get('window');

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

  photo: {
    marginTop: 10,
    marginBottom: 10,
    width: width * 0.5,
    height: height * 0.3,
  },
  imagebutton: {
    backgroundColor: '#232323',
    color: 'white',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 35,
    paddingTop: 10,
    paddingBottom: 10,
    width: '50%',
  },
  imageView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginBottom: 15,
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
});
