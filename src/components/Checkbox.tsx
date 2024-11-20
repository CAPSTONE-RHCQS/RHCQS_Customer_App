import { FONTFAMILY } from '../theme/theme';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

interface CheckboxProps {
  id: string;
  label: string;
  isChecked: boolean;
  onCheck: (id: string) => void;
  isRequired?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  isChecked,
  onCheck,
  isRequired,
}) => {
  return (
    <TouchableOpacity onPress={() => onCheck(id)} style={styles.container}>
      <View style={styles.checkbox}>
        {isChecked ? (
          <Image
            source={require('../assets/image/icon/checkbox/selected.png')}
            style={styles.checkboxImage}
          />
        ) : (
          <Image
            source={require('../assets/image/icon/checkbox/circle.png')}
            style={styles.checkboxImage}
          />
        )}
      </View>
      <Text style={styles.label}>{label}</Text>
      {isRequired && <Text style={styles.required}> *</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  checkbox: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxImage: {
    width: 20,
    height: 20,
  },
  label: {
    fontFamily: FONTFAMILY.montserat_medium,
    fontSize: 14,
    color: 'black',
  },
  required: {
    color: 'red',
  },
});

export default Checkbox;
