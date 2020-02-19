import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, FlatList} from 'react-native';

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      todos: [],
    };
  }
  componentDidMount() {
    fetch('https://www.reddit.com/.json', {
      Accept: 'application/json',
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        this.setState({todos: data.data.children});
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.title}>Login</Text>
          <Image
            style={styles.images}
            source={require('../assets/images/logo.png')}
          />
        </View>
        <View style={styles.middleContainer}>
          <Text style={styles.subTitle}>Lista de Items</Text>
          <View style={styles.container}>
            <FlatList
              style={styles.middleContainer}
              data={this.state.todos}
              renderItem={({item}) => (
                <Text style={styles.item}>
                  {item.data.id} - {item.data.author}
                </Text>
              )}
              keyExtractor={item => item.data.id}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  topContainer: {
    flex: 1,
    backgroundColor: 'skyblue',
    alignItems: 'center',
  },
  middleContainer: {
    flex: 3,
    backgroundColor: '#8aacc8',
  },
  title: {
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
    fontSize: 24,
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
    margin: 5,
    fontSize: 16,
    height: 40,
    borderWidth: 1,
    borderColor: '#232323',
  },
});
