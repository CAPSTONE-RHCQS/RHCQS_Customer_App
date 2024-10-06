import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface AppBarProps {
  nameScreen: string;
}

const AppBar: React.FC<AppBarProps> = ({ nameScreen }) => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
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
      <View style={styles.rightContainer} />
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
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
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
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: 'black',
  },
  rightContainer: {
    width: 24,
  },
});

export default AppBar;
