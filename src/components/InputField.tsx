import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {FONTFAMILY} from '../theme/theme';

interface InputFieldProps {
  name: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
}) => {
  return (
    <View>
      <Text style={styles.title}>{name}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#B7B3C0"
        keyboardType={keyboardType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: FONTFAMILY.montserat_semibold,
    fontSize: 14,
    color: 'black',
    marginBottom: 10,
    textAlign: 'left',
  },
  input: {
    fontFamily: FONTFAMILY.montserat_medium,
    borderColor: '#B7B3C0',
    borderWidth: 2,
    borderRadius: 15,
    paddingHorizontal: 18,
    height: 60,
    marginBottom: 10,
  },
});

export default InputField;
