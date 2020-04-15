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
  container: {
    flex: 1,
    padding: 15
  },
  text: {
    fontSize: 15
  },
  score: {
    fontSize: 18,
    color: "red"
  },
  verticalLayout: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 20,
    flex: 1,
    padding: 5
  },
  numberInput: {
    borderWidth: 1,
    borderColor: 'black'
  }
});

export default ScoreLabel;