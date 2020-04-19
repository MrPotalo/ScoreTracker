import _ from 'lodash';
import prompt from 'react-native-prompt-android';
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import realm from '../realm';
import ScoreLabel from '../ScoreLabel';

export class MainScreen extends Component {

  constructor(props) {
    super(props);

    realm.addListener('change', this.updateData);

    this.state = {
      games: _.values(realm.objects('Game'))
    }
  }

  componentWillUnmount() {
    realm.removeListener('change', this.updateData);
  }

  updateData = () => {
    this.setState({
      games: _.values(realm.objects('Game'))
    });
  }

  render() {
    const { games } = this.state;
    return (
      <View style={styles.list}>
        {_.map(games || [], (game, i) => {
          return (
            <TouchableOpacity key={i} style={styles.game} onPress={() => {
              this.props.setMenuOptions({gameIndex: i});
            }}>
              <Text>{game.name}</Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity style={styles.game} onPress={() => {
          prompt('Game Name', 'Enter game name:', [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Create', onPress: (name) => {
              realm.write(() => {
                realm.create('Game', {name, players: [], rounds: []});
              });
            }}
          ]);
        }}>
          <Text>Add New</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    flexDirection: "column"
  },
  game: {
    height: 50,
    borderBottomColor: 'black',
    borderBottomWidth: 1
  }
});