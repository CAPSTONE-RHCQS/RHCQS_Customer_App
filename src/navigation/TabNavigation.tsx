import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image} from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import {FONTFAMILY} from '../theme/theme';

const Tab = createBottomTabNavigator();

function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {backgroundColor: 'white', height: 55},
        tabBarLabelStyle: {fontSize: 12, fontFamily: FONTFAMILY.montserat_bold},
        tabBarInactiveTintColor: '#D9D9D9',
        tabBarActiveTintColor: '#5BABAC',
        tabBarIcon: ({focused}) => {
          let iconName;

          if (route.name === 'Trang chủ') {
            iconName = focused
              ? require('../assets/image/icon/TabNav/home.png')
              : require('../assets/image/icon/TabNav/home-outline-grey.png');
          } else if (route.name === 'Cá nhân') {
            iconName = focused
              ? require('../assets/image/icon/TabNav/user-outline.png')
              : require('../assets/image/icon/TabNav/user-outline-grey.png');
          }
          return <Image source={iconName} style={{width: 20, height: 20}} />;
        },
      })}>
      <Tab.Screen name="Trang chủ" component={HomeScreen} />
      <Tab.Screen name="Cá nhân" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default TabNavigation;
