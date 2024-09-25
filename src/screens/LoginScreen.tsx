import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {
  AuthStackNavigationProp,
  AppStackNavigationProp,
} from '../types/TypeScreen';
import {LinearGradient} from 'react-native-linear-gradient';
import {FONTFAMILY} from '../theme/theme';
import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';
import {useNavigation} from '@react-navigation/native';

const LoginScreen: React.FC = () => {
  //Stack
  const navigationAuth = useNavigation<AuthStackNavigationProp>();
  const navigationApp = useNavigation<AppStackNavigationProp>();

  //State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  //Handle
  const handleForgotPassword = () => {};
  const handleLogin = () =>
    navigationApp.navigate('HomeScreen');
  const handleRegister = () => {
    navigationAuth.navigate('RegisterScreen');
  };

  return (
    <View>
      <LinearGradient
        colors={['#1F7F81', '#3C9597', '#53A6A8']}
        style={styles.gradientView}>
        <Image
          source={require('../assets/image/logo_white.png')}
          style={styles.logobg}
        />
        <View style={styles.brandView}>
          <Image
            source={require('../assets/image/logo_white.png')}
            style={styles.logo}
          />
          <Text style={styles.brandName}>RHCQS</Text>
        </View>
      </LinearGradient>
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
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
        </TouchableOpacity>
      </View>
      <CustomButton
        title="Đăng Nhập"
        onPress={handleLogin}
        colors={['#53A6A8', '#3C9597', '#1F7F81']}
        style={{marginHorizontal: 20}}
      />
      <View style={styles.registerContainer}>
        <Text style={styles.registertext}>Bạn chưa có tài khoản?</Text>
        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.registerclick}>Đăng Ký</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  brandView: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginBottom: 30,
  },
  brandName: {
    fontFamily: FONTFAMILY.montserat_bold,
    color: 'white',
    marginTop: 200,
    fontSize: 40,
  },
  gradientView: {
    height: '50%',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logobg: {
    position: 'absolute',
    left: 0,
    width: '110%',
    opacity: 0.3,
    height: '100%',
    marginLeft: -160,
  },
  logo: {
    position: 'absolute',
    width: '30%',
    height: '30%',
  },
  inputgroup: {
    marginTop: 30,
    marginHorizontal: 20,
  },
  title: {
    fontFamily: FONTFAMILY.montserat_semibold,
    color: 'black',
    marginTop: 20,
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'left',
  },
  input: {
    fontFamily: FONTFAMILY.montserat_medium,
    borderColor: '#B7B3C0',
    maxHeight: 100,
    height: 60,
    borderWidth: 2,
    borderRadius: 15,
    paddingHorizontal: 18,
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
  forgotPassword: {
    fontFamily: FONTFAMILY.montserat_semibold,
    color: 'black',
    textAlign: 'right',
    marginTop: 12,
    marginBottom: 12,
  },
  registerContainer: {
    fontFamily: FONTFAMILY.montserat_semibold,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  registertext: {
    fontFamily: FONTFAMILY.montserat_semibold,
    color: 'black',
    marginLeft: 5,
  },
  registerclick: {
    fontFamily: FONTFAMILY.montserat_semibold,
    color: '#029AA4',
    marginLeft: 5,
  },
});

export default LoginScreen;
