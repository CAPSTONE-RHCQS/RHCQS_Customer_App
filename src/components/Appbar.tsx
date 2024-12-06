import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface AppBarProps {
  nameScreen: string;
  onBackPress?: () => void;
  icon?: any;
  onIconPress?: (event: any) => void;
  showIcon?: boolean;
}

const AppBar: React.FC<AppBarProps> = ({nameScreen, onBackPress, icon, onIconPress, showIcon}) => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <Image
          source={require('../assets/image/Arrow-back.png')}
          style={styles.backIcon}
        />
      </TouchableOpacity>
      <Text style={styles.title}>{nameScreen}</Text>
      {icon && showIcon && (
        <TouchableOpacity onPress={(event) => onIconPress && onIconPress(event)} style={styles.iconButton}>
          <Image source={icon} style={styles.icon} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  backButton: {
    padding: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Montserrat-SemiBold',
    color: 'black',
  },
  iconButton: {
    padding: 10,
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export default AppBar;
