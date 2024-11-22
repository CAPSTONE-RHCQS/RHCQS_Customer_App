import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AppBar from '../../components/Appbar';
import InputField from '../../components/InputField';
import CustomButton from '../../components/CustomButton';
import {FONTFAMILY} from '../../theme/theme';
import {useNavigation} from '@react-navigation/native';
import {AuthStackNavigationProp} from '@/types/TypeScreen';
import {registerUser} from '../../api/Auth/Auth';
import {Animated} from 'react-native';
import Dialog from 'react-native-dialog';

const RegisterScreen: React.FC = () => {
  const navigationAuth = useNavigation<AuthStackNavigationProp>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confilmPassword, setConfilmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(phoneNumber)) {
        setErrorMessage('Số điện thoại không hợp lệ');
        setIsLoading(false);
        return;
      }

      await registerUser(email, password, confilmPassword, phoneNumber);
      setErrorMessage(null);
      setIsLoading(false);
      setVisible(true);
    } catch (error: any) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  };

  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      fadeAnim.setValue(1);
    }
  }, [isLoading, fadeAnim]);

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
        <InputField
          name="Số điện thoại"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Số điện thoại"
          keyboardType="numeric"
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
                  ? require('../../assets/image/LoginScreen/Eye-off.png')
                  : require('../../assets/image/LoginScreen/Eye-show.png')
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
                  ? require('../../assets/image/LoginScreen/Eye-off.png')
                  : require('../../assets/image/LoginScreen/Eye-show.png')
              }
              style={styles.eyeImage}
            />
          </TouchableOpacity>
        </View>
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Đăng kí"
          onPress={handleRegister}
          colors={['#53A6A8', '#3C9597', '#1F7F81']}
          loading={isLoading}
        />
      </View>
      <Dialog.Container contentStyle={styles.dialogContainer} visible={visible}>
        <Dialog.Title style={styles.dialogTitle}>
          {errorMessage ? 'Lỗi' : 'Thành công'}
        </Dialog.Title>
        <Dialog.Description style={styles.dialogDescription}>
          {errorMessage || 'Đăng ký thành công!'}
        </Dialog.Description>
        <Dialog.Button
          label="Đăng nhập"
          onPress={() => {
            setVisible(false);
            if (!errorMessage) {
              navigationAuth.navigate('LoginScreen');
            }
          }}
          style={styles.dialogButton}
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
  errorText: {
    color: 'red',
    marginTop: 10,
    fontFamily: FONTFAMILY.montserat_medium,
  },
  dialogContainer: {
    borderRadius: 12,
    marginHorizontal: 20,
  },
  dialogTitle: {
    color: '#1F7F81',
    fontSize: 20,
    fontFamily: FONTFAMILY.montserat_bold,
  },
  dialogDescription: {
    color: '#333',
    fontSize: 16,
    fontFamily: FONTFAMILY.montserat_regular,
  },
  dialogButton: {
    color: '#1F7F81',
    fontFamily: FONTFAMILY.montserat_semibold,
    textTransform: 'none',
  },
});

export default RegisterScreen;
