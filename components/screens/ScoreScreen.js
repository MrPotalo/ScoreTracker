import _ from 'lodash';
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import ScoreLabel from './../ScoreLabel';
import realm from '../realm';

class ScoreScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      game: realm.objects('Game')[this.props.gameIndex],
      nextScores: []
    };
  }

  setNextScore = (i, score) => {
    this.setState((oldState) => {
      let nextScores = [...oldState.nextScores];
      nextScores[i] = score;
      return {
        nextScores
      }
    })
  }

  render() {
    const { game, nextScores } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.scoreContainer}>
          {_.map(game.players, (player, i) => {
            return <ScoreLabel index={i} key={i} text={player} score={game.scores[i]} nextScore={nextScores[i] || ""} setNextScore={this.setNextScore} />
          })}
        </View>
        <TouchableOpacity style={styles.applyButton} onPress={() => {
            realm.write(() => {
              const scores = realm.objects('Game')[this.props.gameIndex].scores;
              for (let i = 0; i < scores.length; i++) {
                scores[i] += parseInt(this.state.nextScores[i]) || 0;
              }
            });
            this.setState({
              game: realm.objects('Game')[this.props.gameIndex],
              nextScores: []
            });
          }}>
            <Text>Apply Scores</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => {
            Alert.alert("Delete?", "Are you sure you want to delete game?", [
              {text: "Cancel", type: 'cancel'},
              {text: 'Confirm', onPress: () => {
                realm.write(() => {
                  realm.delete(realm.objects('Game')[this.props.gameIndex]);
                });
                this.props.setMenuOptions({gameIndex: null});
              }}
            ]);
          }}>
            <Text>Delete Game</Text>
          </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  scoreContainer: {
    flexDirection: "row",
    alignContent: "center"
  },
  container: {
    flex: 1,
    alignItems: 'center'
  },
  applyButton: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 8,
    marginVertical: 15
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'red',
    color: 'white',
    padding: 8
  }
});

export default ScoreScreen;