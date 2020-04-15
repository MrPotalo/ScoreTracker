import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

class ScoreLabel extends Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <View style={styles.verticalLayout}>
        <Text style={styles.text}>{this.props.text}</Text>
        <Text style={styles.score}>{this.props.score}</Text>
        <TextInput style={styles.numberInput} value={this.props.nextScore} keyboardType="numeric" onChangeText={(text) => {
          this.props.setNextScore(this.props.index, text);
        }} />
      </View>
    );
  }

  static propTypes = {
    text: PropTypes.string,
    score: PropTypes.number
  };
}

const styles = StyleSheet.create({
  text: {
    alignSelf: 'center',
    fontSize: 15
  },
  score: {
    alignSelf: 'center',
    fontSize: 18,
    color: "red"
  },
  verticalLayout: {
    flexDirection: "column",
    alignItems: 'stretch',
    flex: 1,
    padding: 0
  },
  numberInput: {
    marginVertical: 10,
    alignSelf: 'center',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'black',
    height: 40,
    width: 60
  }
});

export default ScoreLabel;