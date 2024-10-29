import React, {useContext, useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {AuthContext} from '../context/AuthContext';
import storage from '../utils/storage';
import {getProfile, updateProfile} from '../api/Account/Account';
import {height} from '../utils/Dimensions';
import {FONTFAMILY} from '../theme/theme';
import InputField from '../components/InputField';
import Dialog from 'react-native-dialog';
import {launchImageLibrary} from 'react-native-image-picker';
import {UpdateProfile} from '../types/Account/AccountType';
import {uploadImage} from '../api/Upload/UploadImage';
import {ActivityIndicator} from 'react-native';

const ProfileScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [customerImg, setCustomerImg] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [reload, setReload] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const {logout} = useContext(AuthContext)!;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        setCustomerId(profile.Id);
        setCustomerName(profile.Username);
        setCustomerImg(profile.ImageUrl);
        setPhoneNumber(profile.PhoneNumber);
        setEmail(profile.Email);
        setDateOfBirth(profile.DateOfBirth);
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

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updatedProfile: UpdateProfile = {
        username: customerName,
        phoneNumber: phoneNumber,
        email: email,
        imageUrl: customerImg,
        dateOfBirth: dateOfBirth,
      };

      const userId = customerId;

      await updateProfile(userId, updatedProfile);
      setIsEditing(false);
      setReload(!reload);
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoosePhoto = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      try {
        console.log('Uploading image from URI:', imageUri);
        const uploadResponse = await uploadImage(imageUri || '');
        const imageUrl = uploadResponse.url;
        console.log('Image URL:', imageUrl);
        setCustomerImg(imageUrl);
      } catch (error) {
        console.error('Lỗi khi upload ảnh:', error);
      }
    } else {
      console.log('Không có hình ảnh được chọn');
    }
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
        {isEditing && (
          <TouchableOpacity onPress={handleChoosePhoto}>
            <Text style={styles.saveButtonText}>Chọn ảnh đại diện</Text>
          </TouchableOpacity>
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
          name="Ngày sinh"
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
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
            <TouchableOpacity onPress={handleSave} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color="green" />
              ) : (
                <Text style={styles.saveButtonText}>Lưu thông tin</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.button}>
            <TouchableOpacity onPress={() => setShowLogoutDialog(true)}>
              <Text style={styles.buttonText}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Dialog xác nhận đăng xuất */}
      <Dialog.Container visible={showLogoutDialog}>
        <Dialog.Title style={styles.dialogTitle}>
          Xác nhận đăng xuất
        </Dialog.Title>
        <Dialog.Description style={styles.dialogDescription}>
          Bạn có chắc chắn muốn đăng xuất không?
        </Dialog.Description>
        <Dialog.Button
          label="Hủy"
          onPress={() => setShowLogoutDialog(false)}
          style={styles.dialogButtonCancel}
        />
        <Dialog.Button
          label="Đăng xuất"
          onPress={handleLogout}
          style={styles.dialogButtonAccept}
        />
      </Dialog.Container>
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
  dialogTitle: {
    fontFamily: FONTFAMILY.montserat_bold,
    color: '#389294',
  },
  dialogDescription: {
    fontFamily: FONTFAMILY.montserat_medium,
    color: 'black',
  },
  dialogButtonAccept: {
    fontSize: 18,
    fontFamily: FONTFAMILY.montserat_bold,
    color: 'red',
    textTransform: 'none',
  },
  dialogButtonCancel: {
    marginRight: 10,
    fontSize: 18,
    fontFamily: FONTFAMILY.montserat_bold,
    color: '#389294',
    textTransform: 'none',
  },
});

export default ProfileScreen;
