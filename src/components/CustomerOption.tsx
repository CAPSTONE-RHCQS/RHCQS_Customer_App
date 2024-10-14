import { useNavigation } from '@react-navigation/native';
import {FONTFAMILY} from '../theme/theme';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AppStackNavigationProp, AppStackParamList } from '@/types/TypeScreen';

const CustomerOptions: React.FC = () => {
  const navigationApp = useNavigation<AppStackNavigationProp>();

  const handlePress = (option: string) => {
    if (option === 'Tính chi phí xây dựng') {
      navigationApp.navigate('Package');
    }
  };

  return (
    <View style={styles.optionContainer}>
      <View style={styles.optionGroup1}>
        {/* Tính chi phí xây dựng */}
        <TouchableOpacity
          onPress={() => handlePress('Tính chi phí xây dựng')}
          activeOpacity={0.7}>
          <LinearGradient
            colors={['#5BABAD', '#3C9597', '#14787A']}
            style={styles.constructionCost}>
            <View style={styles.circleContainer}>
              <Image
                source={require('../assets/image/icon/calculator_icon.png')}
                style={styles.calculatorIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.optionText}>Tính chi phí xây dựng</Text>
            <Image
              source={require('../assets/image/logo_white.png')}
              style={styles.logobgConstructionCost}
              resizeMode="contain"
            />
          </LinearGradient>
        </TouchableOpacity>

        {/* Thư viện mẫu nhà */}
        <TouchableOpacity
          onPress={() => navigationApp.navigate('HouseLibrary')}
          activeOpacity={0.7}>
          <LinearGradient
            colors={['#5BABAD', '#3C9597', '#14787A']}
            style={styles.houseModalLibrary}>
            <View style={styles.circleContainer}>
              <Image
                source={require('../assets/image/icon/home_library_icon.png')}
                style={styles.homeIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.optionText}>Thư viện mẫu nhà</Text>
            <Image
              source={require('../assets/image/logo_white.png')}
              style={styles.logobgHouseModalLibrary}
              resizeMode="contain"
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.optionGroup2}>
        {/* Lịch sử báo giá */}
        <TouchableOpacity
          onPress={() => handlePress('Lịch sử báo giá')}
          activeOpacity={0.7}>
          <LinearGradient
            colors={['#14787A', '#3C9597', '#5BABAD']}
            style={styles.historyQuotation}>
            <View style={styles.circleContainer}>
              <Image
                source={require('../assets/image/icon/todo_icon.png')}
                style={styles.todoIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.optionText}>Lịch sử báo giá</Text>
            <Image
              source={require('../assets/image/logo_white.png')}
              style={styles.logobgHistoryQuotation}
              resizeMode="contain"
            />
          </LinearGradient>
        </TouchableOpacity>

        {/* Ưu đãi khách hàng */}
        <TouchableOpacity
          onPress={() => handlePress('Ưu đãi khách hàng')}
          activeOpacity={0.7}>
          <LinearGradient
            colors={['#14787A', '#3C9597', '#5BABAD']}
            style={styles.Promotion}>
            <View style={styles.circleContainer}>
              <Image
                source={require('../assets/image/icon/discount_icon.png')}
                style={styles.discountIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.optionText}>Ưu đãi khách hàng</Text>
            <Image
              source={require('../assets/image/logo_white.png')}
              style={styles.logobgPromotion}
              resizeMode="contain"
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '5%',
    marginBottom: '5%',
  },
  optionGroup1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  constructionCost: {
    height: 115,
    width: 190,
    borderRadius: 14,
    marginRight: 6,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  logobgConstructionCost: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: '150%',
    width: '150%',
    marginRight: '-75%',
    marginBottom: '-75%',
    opacity: 0.1,
  },
  houseModalLibrary: {
    height: 115,
    width: 190,
    borderRadius: 14,
    marginLeft: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  logobgHouseModalLibrary: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '150%',
    width: '150%',
    marginLeft: '-75%',
    marginBottom: '-75%',
    opacity: 0.1,
  },
  optionGroup2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  historyQuotation: {
    height: 115,
    width: 190,
    borderRadius: 14,
    marginRight: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  logobgHistoryQuotation: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '150%',
    width: '150%',
    marginRight: '-75%',
    marginTop: '-45%',
    opacity: 0.1,
  },
  Promotion: {
    height: 115,
    width: 190,
    borderRadius: 14,
    marginLeft: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  logobgPromotion: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '150%',
    width: '150%',
    marginLeft: '-75%',
    marginTop: '-45%',
    opacity: 0.1,
  },
  circleContainer: {
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  calculatorIcon: {
    width: 30,
    height: 30,
    marginRight: 4,
  },
  homeIcon: {
    width: 30,
    height: 30,
  },
  todoIcon: {
    width: 30,
    height: 30,
  },
  discountIcon: {
    width: 30,
    height: 30,
  },
  optionText: {
    fontFamily: FONTFAMILY.montserat_bold,
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    textShadowColor: '#000',
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 3,
  },
});

export default CustomerOptions;
