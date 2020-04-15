import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { MainScreen } from './screens/MainScreen';
import ScoreScreen from './screens/ScoreScreen';

class Menu extends Component {

  constructor(props) {
    super(props);

    this.state = {
      gameIndex: null
    }
  }

  setMenuOptions = (obj) => {
    this.setState(obj);
  }

  render() {
    const { gameIndex } = this.state;
    let isBackDisplayed = false;
    let screen = <MainScreen {...this.state} setMenuOptions={this.setMenuOptions} />
    if (gameIndex != null) {
      screen = <ScoreScreen {...this.state} setMenuOptions={this.setMenuOptions} />
      isBackDisplayed = true;
    }
    return (
      <View style={styles.mainContainer}>
        <View style={styles.statusBar}>
          {isBackDisplayed &&
          <TouchableOpacity style={styles.backButton} onPress={() => {
            this.setState({gameIndex: null});
          }}>
            <Icon size={25} name="arrow-back" color="white"></Icon>
          </TouchableOpacity>}
        </View>
        {screen}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  statusBar: {
    height: 25,
    backgroundColor: '#33f'
  },
  backButton: {
    alignSelf: 'flex-start',
    height: 25,
    width: 25
  }
});

export default Menu;