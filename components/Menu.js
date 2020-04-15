import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

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
    if (gameIndex == null) {
      return <MainScreen {...this.state} setMenuOptions={this.setMenuOptions} />
    } else {
      return <ScoreScreen {...this.state} setMenuOptions={this.setMenuOptions} />
    }
  }
}

const styles = StyleSheet.create({

});

export default Menu;