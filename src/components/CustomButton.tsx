// CustomButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { FONTFAMILY } from '../theme/theme';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  colors: string[];
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, colors, style, disabled }) => {
  return (
    <TouchableOpacity onPress={disabled ? undefined : onPress} style={[styles.buttonContainer, style]} disabled={disabled}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientButton}>
        <Text style={styles.buttonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 15,
  },
  gradientButton: {
    height: 60,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: FONTFAMILY.montserat_semibold,
    color: '#ffffff',
    fontSize: 18,
  },
});

export default CustomButton;
