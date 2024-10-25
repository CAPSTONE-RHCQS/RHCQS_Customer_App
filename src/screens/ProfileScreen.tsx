import React, {useContext, useEffect, useState} from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {AuthContext} from '../context/AuthContext';
import storage from '../utils/storage';
import {getProfile} from '../api/Account/Account';
import {useSelector} from 'react-redux';
import {height} from '../utils/Dimensions';
import {FONTFAMILY} from '../theme/theme';
import InputField from '../components/InputField';

const ProfileScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerImg, setCustomerImg] = useState('');
  const [address, setAddress] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [reload, setReload] = useState(false);
  const {logout} = useContext(AuthContext)!;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        setCustomerName(profile.Username);
        setCustomerImg(profile.ImageUrl);
        setPhoneNumber(profile.PhoneNumber);
        setEmail(profile.Email);
        console.log('profile', profile);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchProfile();
  }, [reload]);

  const handleLogout = async () => {
    await logout();
    await storage.clear();
  };

  const handleSave = () => {
    setIsEditing(false);
    setReload(!reload);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#53A6A8', '#3C9597']} style={styles.gradient}>
        <Image
          source={require('../assets/image/logo_white.png')}
          style={styles.logobg}
        />
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(true)}>
          {isEditing ? (
            <Text style={styles.editButtonText}></Text>
          ) : (
            <Text style={styles.editButtonText}>Chỉnh sửa</Text>
          )}
        </TouchableOpacity>
      </LinearGradient>
      {/* Profile */}
      <View style={styles.profileContainer}>
        <View style={styles.logoContainer}>
          {customerImg ? (
            <Image source={{uri: customerImg}} style={styles.logo} />
          ) : (
            <Image
              source={require('../assets/image/data/avatar.jpeg')}
              style={styles.logo}
            />
          )}
        </View>
        {isEditing ? (
          <TextInput
            style={styles.profileNameInput}
            value={customerName}
            onChangeText={setCustomerName}
          />
        ) : (
          <Text style={styles.profileName}>{customerName}</Text>
        )}
      </View>
      {/* Information */}
      <View style={styles.informationContainer}>
        <InputField
          name="Số điện thoại"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder=""
          editable={isEditing}
        />
        <InputField
          name="Email"
          value={email}
          onChangeText={setEmail}
          placeholder=""
          editable={isEditing}
        />
        <InputField
          name="Địa chỉ"
          value={address}
          onChangeText={setAddress}
          placeholder=""
          editable={isEditing}
        />
      </View>
      <View style={styles.buttonContainer}>
        {isEditing ? (
          <View style={styles.buttonSave}>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.saveButtonText}>Lưu thông tin</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.button}>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.buttonText}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  logobg: {
    position: 'absolute',
    top: 0,
    width: '100%',
    opacity: 0.3,
    height: '220%',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height / 5,
    overflow: 'hidden',
  },
  profileContainer: {
    marginTop: '25%',
    alignItems: 'center',
  },
  logoContainer: {
    backgroundColor: 'white',
    borderRadius: 100,
    padding: 10,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  profileName: {
    fontSize: 24,
    marginTop: 10,
    fontFamily: FONTFAMILY.montserat_bold,
    color: '#389294',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  informationContainer: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    height: 60,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'red',
  },
  buttonText: {
    fontFamily: FONTFAMILY.montserat_medium,
    color: 'red',
    fontSize: 18,
  },
  editButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
    fontFamily: FONTFAMILY.montserat_bold,
  },
  buttonSave: {
    height: 60,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'green',
  },
  saveButtonText: {
    fontFamily: FONTFAMILY.montserat_medium,
    color: 'green',
    fontSize: 18,
  },
  profileNameInput: {
    fontSize: 24,
    fontFamily: FONTFAMILY.montserat_bold,
    color: '#389294',
    textAlign: 'center',
  },
});

export default ProfileScreen;
