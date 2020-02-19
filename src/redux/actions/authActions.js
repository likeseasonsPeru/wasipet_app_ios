/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
import {AUTHENTICATE, DEAUTHENTICATE, USER} from '../types';
import {API} from '../../config';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
// AUTHENTICATE FUNTIONS

export const register = ({name, photo, email, phone, type_user, password}) => {
  return dispatch => {
    let postData = {
      name,
      email,
      phone,
      type_user,
      password,
      provide_services: 'app',
    };

    let data = new FormData();
    data.append('image', {
      name: photo.fileName,
      type: photo.type,
      uri:
        Platform.OS === 'android'
          ? photo.uri
          : photo.uri.replace('file://', ''),
    });

    Object.keys(postData).forEach(key => {
      data.append(key, postData[key]);
    });

    console.log(data);

    fetch(`${API}/register`, {
      method: 'POST',
      headers: {
        // eslint-disable-next-line prettier/prettier
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: data,
    })
      .then(response => response.json())
      .then(response => {
        if (response.msg) {
          console.log(response.msg);
          alert('Este email ya se encuentra registrado');
        } else {
          dispatch({type: AUTHENTICATE, payload: response});
          console.log('User register successfuly');
        }
      })
      .catch(error => {
        console.log('upload error', error);
        alert('Register failed!');
      });
  };
};

export const authenticate = ({email, password}) => {
  return dispatch => {
    let postdata = {
      email,
      password,
    };

    let data = new FormData();
    Object.keys(postdata).forEach(key => {
      data.append(key, postdata[key]);
    });

    fetch(`${API}/login`, {
      method: 'POST',
      headers: {
        // eslint-disable-next-line prettier/prettier
        'Accept': 'application/json',
      },
      body: data,
    })
      .then(response => response.json())
      .then(response => {
        if (response.auth) {
          console.log('lOGIN FAILED');
          alert('Alguien mas a ingresado con esta cuenta');
        } else {
          dispatch({type: AUTHENTICATE, payload: response});
          console.log('User logged successfuly');
        }
      })
      .catch(error => {
        console.log('lOGIN FAILED', error);
        alert('Ha habido un problema al ingresar');
      });
  };
};

export const deauthenticate = token => {
  return dispatch => {
    fetch(`${API}/logout`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // eslint-disable-next-line prettier/prettier
        'Authorization': (token ? `Bearer ${token}` : ''),
      },
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
        dispatch({type: DEAUTHENTICATE});
      })
      .catch(err => {
        console.log(err);
        alert('you already exit');
      });
  };
};

export const reauthenticate = session => {
  return dispatch => {
    dispatch({type: AUTHENTICATE, payload: session});
  };
};
