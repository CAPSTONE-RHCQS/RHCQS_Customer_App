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
  isRequired?: boolean;
  editable?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  isRequired = false,
  editable = true,
}) => {
  return (
    <View>
      <View style={styles.labelContainer}>
        <Text style={styles.title}>{name}</Text>
        {isRequired && <Text style={styles.requiredAsterisk}>*</Text>}
      </View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#B7B3C0"
        keyboardType={keyboardType}
        editable={editable}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: FONTFAMILY.montserat_semibold,
    fontSize: 14,
    color: 'black',
    marginBottom: 10,
    textAlign: 'left',
  },
  requiredAsterisk: {
    color: 'red',
    marginLeft: 4,
    marginBottom: 10,
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
