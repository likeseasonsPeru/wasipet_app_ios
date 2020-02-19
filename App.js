import React, {Component} from 'react';
import {Provider} from 'react-redux';
import configureStore from './src/redux/configStore';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
//import firebase from 'react-native-firebase';
//import {Alert} from 'react-native';

// componets

import Registry from './src/components/Registry';
import Login from './src/components/Login';
import Menu from './src/components/Menu';

// Initial route

let store = configureStore();

const AppNavigator = createStackNavigator(
  {
    Registry: {screen: Registry},
    Login: {screen: Login},
    Menu: {screen: Menu},
  },
  {
    initialRouteName: 'Login',
  },
);

const Navigation = createAppContainer(AppNavigator);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Navigation />
      </Provider>
    );
  }
}
