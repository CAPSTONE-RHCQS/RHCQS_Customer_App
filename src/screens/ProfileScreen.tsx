import React, {useContext, useEffect, useState} from 'react';
import {Text, View, Button, StyleSheet} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import storage from '../utils/storage';
import {getProfile} from '../api/Account/Account';
import {useSelector} from 'react-redux';

const ProfileScreen: React.FC = () => {
  const [customerName, setCustomerName] = useState('');
  const [customerImg, setCustomerImg] = useState('');

  const {logout} = useContext(AuthContext)!;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        setCustomerName(profile.Username);
        setCustomerImg(profile.ImageUrl);
        console.log('profile', profile);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchProfile();
  }, []);;

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
