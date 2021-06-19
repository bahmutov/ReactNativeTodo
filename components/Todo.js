import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
// https://docs.expo.io/guides/icons/
import {MaterialCommunityIcons} from '@expo/vector-icons';

import {Colors, Fonts, FontSizes} from './Styles';
import {Checkbox} from './Checkbox';

import * as Actions from '../actions';

export const Todo = ({id, text, done, progress}) => {
  const dispatch = useDispatch();
  const deleteSelf = () => dispatch(Actions.deleteTodo(id));
  const toggle = checked => dispatch(Actions.toggleTodo(id, checked));

  return (
    <View
      style={styles.container}
      testID="todo"
      accessibilityLabel={done ? 'completed' : 'incomplete'}>
      <Checkbox
        testID="toggle"
        checked={done}
        disabled={progress}
        onChange={toggle}
      />
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={[styles.text, done && styles.done]}>
        {text}
      </Text>
      <MaterialCommunityIcons
        testID="delete"
        name="trash-can"
        size={32}
        color={Colors.buttonActive}
        disabled={progress}
        onPress={deleteSelf}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 60,
    paddingHorizontal: 20,
  },
  text: {
    color: Colors.todoActive,
    fontFamily: Fonts.medium,
    fontSize: FontSizes.body,
    marginLeft: 10,
    flex: 1,
  },
  done: {
    textDecorationLine: 'line-through',
    color: Colors.todoDone,
  },
  progress: {
    marginRight: 10,
  },
});
