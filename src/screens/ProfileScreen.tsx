import React, { useContext } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import storage from '../utils/storage';

const ProfileScreen: React.FC = () => {
const {logout} = useContext(AuthContext)!;

  const handleLogout = async () => {
    await logout();
    await storage.clear();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Button title="Đăng xuất" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default ProfileScreen;