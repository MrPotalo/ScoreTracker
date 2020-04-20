import _ from 'lodash';
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Dimensions, Keyboard } from 'react-native';
import ScoreLabel from './../ScoreLabel';
import realm from '../realm';
import Icon from 'react-native-vector-icons/MaterialIcons';
import prompt from 'react-native-prompt-android';
import moment from 'moment';
import { Picker } from '@react-native-community/picker';

const DATE_FORMAT = 'MMM D, YYYY LT';

class ScoreScreen extends Component {

  constructor(props) {
    super(props);

    realm.addListener('change', this.updateData);
    Dimensions.addEventListener('change', (dim) => {
      this.setState({
        isLandscape: dim.width > dim.height,
        width: dim.width,
        height: dim.height
      });
    })
    const dim = Dimensions.get('screen');
    this.state = {
      game: realm.objects('Game')[this.props.gameIndex],
      nextScores: [],
      width: dim.width,
      height: dim.height,
      isLandscape: dim.width > dim.height,
      dateStart: moment().startOf('D'),
      dateEnd: moment().endOf('D'),
      selectedDateRange: 'daily'
    };
  }

  DATE_RANGES = {
    daily: {
      label: 'Daily',
      fn: () => {
        this.setState({
          dateStart: moment().startOf('D'),
          dateEnd: moment().endOf('D')
        });
      }
    },
    alltime: {
      label: 'All time',
      fn: () => {
        this.setState({
          dateStart: null,
          dateEnd: null
        });
      }
    }
  }

  componentWillUnmount() {
    realm.removeListener('change', this.updateData);
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

  addRound = () => {
    Keyboard.dismiss();
    if (this.state.nextScores.length === 0) {
      return;
    }
    realm.write(() => {
      const scores = [];
      for (let i = 0; i < this.state.nextScores.length; i++) {
        scores.push(parseInt(this.state.nextScores[i]) || 0);
      }
      realm.objects('Game')[this.props.gameIndex].rounds.push({ ts: new Date(), scores });
    });
    this.setState({
      nextScores: []
    });
  }

  updateData = () => {
    this.setState({
      game: realm.objects('Game')[this.props.gameIndex]
    });
  }

  render() {
    const { game, nextScores, isLandscape, dateStart, dateEnd, selectedDateRange } = this.state;
    if (!game) {
      return null;
    }

    const scoreLabelContent = [];
    let scoresPerRow;
    if (isLandscape) {
      scoresPerRow = 8;
    } else {
      scoresPerRow = 4;
    }
    const rows = Math.ceil(game.players.length / scoresPerRow);
    for (let i = 0; i < rows; i++) {
      const scoreLabels = [];
      for (let j = 0; j < scoresPerRow; j++) {
        const scoreIndex = i * scoresPerRow + j;
        if (!game.players[scoreIndex]) {
          break;
        }
        const score = game.rounds.reduce((acc, curr) => {
          if (dateStart && !moment(curr.ts).isBetween(dateStart, dateEnd)) {
            return acc;
          }
          return acc + (curr.scores[scoreIndex] || 0);
        }, 0);
        scoreLabels.push(
          <ScoreLabel index={scoreIndex} key={j} text={game.players[scoreIndex]} score={score} nextScore={nextScores[scoreIndex] || ""} setNextScore={this.setNextScore} />
        );
      }
      scoreLabelContent.push(
        <View key={-1} style={styles.scoreContainer}>
          {scoreLabels}
        </View>
      )
    }

    const summaryColumns = [];
    const dateColumnContent = [];
    for (let i = 0; i < game.rounds.length; i++) {
      dateColumnContent.push(<View key={i} style={styles.summaryCell}><Text style={!dateStart || moment(game.rounds[i].ts).isBetween(dateStart, dateEnd) ? null : styles.notInDateRange}>{moment(game.rounds[i].ts).format(DATE_FORMAT)}</Text></View>)
    }
    summaryColumns.push(<View key={-1} style={styles.verticalDateSummary}>{dateColumnContent}</View>);
    for (let i = 0; i < game.players.length; i++) {
      const summaryColumn = [];
      summaryColumn.push(<View key={-1} style={styles.summaryCell}><Text>{game.players[i]}</Text></View>);
      for (let j = 0; j < game.rounds.length; j++) {
        summaryColumn.push(<View key={j} style={styles.summaryCell}><Text style={!dateStart || moment(game.rounds[j].ts).isBetween(dateStart, dateEnd) ? null : styles.notInDateRange}>{game.rounds[j].scores[i] || 0}</Text></View>)
      }
      summaryColumns.push(<View key={i} style={styles.verticalSummary}>{summaryColumn}</View>);
    }

    const roundSummaryContent = <ScrollView style={styles.horizontalScroll} horizontal={true}>
      {summaryColumns}
    </ScrollView>;

    return (
      <ScrollView keyboardShouldPersistTaps={'handled'} contentContainerStyle={styles.container}>
        <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'flex-end', height: 25}} onPress={() => {
          prompt('New Player', 'Choose a name for your new player.', [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Add', onPress: (name) => {
              realm.write(() => {
                const game = realm.objects('Game')[this.props.gameIndex];
                game.players.push(name);
              });
            }}
          ]);
        }}>
          <Icon size={25} name="add"></Icon>
        </TouchableOpacity>
        {scoreLabelContent}
        <TouchableOpacity style={styles.applyButton} onPress={this.addRound}>
            <Text>Apply Scores</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => {
            Alert.alert("Delete?", "Are you sure you want to delete " + this.state.game.name + "?", [
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
          <View style={styles.pickerHolder}>
            <Picker style={styles.dateRangePicker} selectedValue={selectedDateRange} onValueChange={(itemValue) => {
              this.setState({
                selectedDateRange: itemValue
              });
              this.DATE_RANGES[itemValue].fn();
            }}>
              {_.map(Object.keys(this.DATE_RANGES), (key, i) => {
                console.log(this.DATE_RANGES[key]);
                return <Picker.Item key={i} label={this.DATE_RANGES[key].label} value={key} />
              })}
            </Picker>
          </View>
          {roundSummaryContent}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  scoreContainer: {
    flexDirection: "row",
    alignContent: "center"
  },
  container: {
    alignItems: 'center',
    paddingBottom: 15
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
  },
  scrollContainer: {
    flex: 1,
    marginTop: 50
  },
  horizontalScroll: {
    alignSelf: 'stretch',
    paddingVertical: 5,
    marginTop: 25
  },
  verticalSummary: {
    flexDirection: 'column',
    flex: 1,
  },
  verticalDateSummary: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'flex-end',
  },
  summaryCell: {
    // flex: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  notInDateRange: {
    color: '#aaaaaa'
  },
  dateRangePicker: {
    width: 120,
    height: 40
  },
  pickerHolder: {
    borderBottomWidth: 1,
    borderColor: '#aaaaaa',
    marginTop: 10
  }
});

export default ScoreScreen;