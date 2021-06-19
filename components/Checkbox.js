import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';

import {Colors} from './Styles';

export const Checkbox = ({onChange, checked, disabled, testID}) => (
  <TouchableOpacity
    testID={testID}
    disabled={disabled}
    onPress={() => onChange(!checked)}>
    {checked ? (
      <MaterialIcons
        name="radio-button-checked"
        size={32}
        color={Colors.buttonActive}
      />
    ) : (
      <MaterialIcons
        name="radio-button-unchecked"
        size={32}
        color={Colors.buttonActive}
      />
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  icon: {
    color: Colors.buttonActive,
    fontSize: 32,
  },
  disabled: {
    color: Colors.buttonDisabled,
  },
});
