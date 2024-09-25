import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AppBar from '../components/Appbar';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';
import {FONTFAMILY} from '../theme/theme';
import { useNavigation } from '@react-navigation/native';
import { AuthStackNavigationProp } from '@/types/TypeScreen';

const RegisterScreen: React.FC = () => {
  const navigationAuth = useNavigation<AuthStackNavigationProp>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confilmPassword, setConfilmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const handleRegister = () => navigationAuth.navigate('LoginScreen');

  return (
    <View style={styles.container}>
      <AppBar nameScreen="Đăng kí" />
      <View style={styles.inputgroup}>
        <InputField
          name="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
        />
        <Text style={styles.title}>Mật khẩu</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.eyeIcon}>
            <Image
              source={
                isPasswordVisible
                  ? require('../assets/image/LoginScreen/Eye-off.png')
                  : require('../assets/image/LoginScreen/Eye-show.png')
              }
              style={styles.eyeImage}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Xác nhận mật khẩu</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Xác nhận mật khẩu"
            value={confilmPassword}
            onChangeText={setConfilmPassword}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.eyeIcon}>
            <Image
              source={
                isPasswordVisible
                  ? require('../assets/image/LoginScreen/Eye-off.png')
                  : require('../assets/image/LoginScreen/Eye-show.png')
              }
              style={styles.eyeImage}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Đăng kí"
          onPress={handleRegister}
          colors={['#53A6A8', '#3C9597', '#1F7F81']}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  inputgroup: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 20,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontFamily: FONTFAMILY.montserat_semibold,
    color: 'black',
    marginTop: 20,
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'left',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#B7B3C0',
    borderWidth: 2,
    borderRadius: 15,
    paddingHorizontal: 18,
    height: 60,
  },
  passwordInput: {
    flex: 1,
    fontFamily: FONTFAMILY.montserat_medium,
    color: 'black',
  },
  eyeIcon: {
    alignItems: 'center',
  },
  eyeImage: {
    resizeMode: 'cover',
    width: 20,
    height: 20,
  },
});

export default RegisterScreen;
