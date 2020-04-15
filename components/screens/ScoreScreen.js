import _ from 'lodash';
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import ScoreLabel from './../ScoreLabel';
import realm from '../realm';
import Icon from 'react-native-vector-icons/MaterialIcons';
import prompt from 'react-native-prompt-android';

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

  updateData = () => {
    this.setState({
      game: realm.objects('Game')[this.props.gameIndex]
    });
  }

  render() {
    const { game, nextScores } = this.state;
    return (
      <View style={styles.container}>
        <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'flex-end', height: 25}} onPress={() => {
          prompt('New Player', 'Choose a name for your new player.', [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Add', onPress: (name) => {
              realm.write(() => {
                const game = realm.objects('Game')[this.props.gameIndex];
                console.log(game.players);
                game.scores.push(0);
                game.players.push(name);
                console.log(game.players);
              });
              this.updateData();
            }}
          ]);
        }}>
          <Icon size={25} name="add"></Icon>
        </TouchableOpacity>
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
            this.updateData();
            this.setState({
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
            <Text style={styles.deleteText}>Delete Game</Text>
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
    borderRadius: 8,
    marginVertical: 15
  },
  deleteButton: {
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'red',
    borderRadius: 8,
    padding: 8
  },
  deleteText: {
    color: 'white'
  }
});

export default ScoreScreen;