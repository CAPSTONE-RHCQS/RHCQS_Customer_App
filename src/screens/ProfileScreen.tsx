import React, {useContext, useEffect} from 'react';
import {Text, View, Button, StyleSheet} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import storage from '../utils/storage';
import {getProfile} from '../api/Account/Account';
import {useSelector} from 'react-redux';
import {PackageSelector} from '../redux/selectors/PackageSelector/PackageSelector';
import {ContructionSelector} from '../redux/selectors/ContructionSelector/ContructionSelector';

const ProfileScreen: React.FC = () => {
  // Lấy dữ liệu các mục tiện ích
  const ultilitiesData = useSelector((state: any) => state.detailUltilities);
  console.log('ultilitiesData', ultilitiesData);
  // Lấy dữ liệu chi tiết các mục tiện ích
  const detailUltilitiesData = useSelector(
    (state: any) => state.detailUltilities,
  );
  console.log('detailUltilitiesData', detailUltilitiesData);
  // Lấy dữ liệu package
  const packageData = useSelector(PackageSelector);
  console.log('packageData', packageData);
  // Lấy dữ liệu construction
  const constructionData = useSelector(ContructionSelector);
  console.log('constructionData', constructionData);

  const {logout} = useContext(AuthContext)!;

  useEffect(() => {
    getProfile();
  }, []);

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
