import React, {useEffect, useState} from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {FONTFAMILY} from '../theme/theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-reanimated-carousel';
import BannerSlider from '../components/BannerSlider';
import {newsData, sliderData} from '../model/data';
import {height, width} from '../utils/Dimensions';
import CustomerOptions from '../components/CustomerOption';
import NewsItem from '../components/News';
import BlogItem from '../components/Blog';
import {getProfile} from '../api/Account/Account';
import {getBlog} from '../api/Blog/Blog';
import {Blog} from '../types/screens/Blog/BlogType';
import {useNavigation} from '@react-navigation/native';
import {AppStackNavigationProp} from '../types/TypeScreen';
import messaging from '@react-native-firebase/messaging';
import {sendFCM} from '../api/Notification/Notification';

const viewHeight = height / 6;

const HomeScreen: React.FC = ({}) => {
  const navigationApp = useNavigation<AppStackNavigationProp>();
  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [customerImg, setCustomerImg] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string>('');
  const [blogData, setBlogData] = useState<Blog[]>([]);
  // Render
  const renderBanner = ({item}: {item: any; index: number}) => {
    return <BannerSlider data={item} />;
  };

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await messaging().getToken();
        setFcmToken(token);
      } catch (error) {
        console.error('Failed to get FCM token:', error);
      }
    };

    getToken();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        setCustomerName(profile.Username);
        setCustomerImg(profile.ImageUrl);
        setAccountId(profile.Id);
        setEmail(profile.Email);
        if (fcmToken && email) {
          await sendFCM({deviceToken: fcmToken, email: email});
          console.log('sendFCM success');
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchProfile();
  }, [fcmToken, email]);

  useEffect(() => {
    const fetchBlog = async () => {
      const blog = await getBlog();
      setBlogData(blog);
    };
    fetchBlog();
  }, []);

  // Handle
  const handlePress = (option: string) => {
    console.log(`${option} pressed`);
  };
  const handleBlogListPress = () => {
    navigationApp.navigate('BlogList');
  };
  const handleNewsPress = (id: number) => {
    console.log(`News ID: ${id} pressed`);
  };
  const handleBlogDetailPress = (id: string, heading: string) => {
    navigationApp.navigate('BlogDetail', {id, heading});
  };

  return (
    <SafeAreaView>
      <StatusBar backgroundColor="#1F7F81" barStyle="light-content" />
      <ScrollView style={{backgroundColor: 'white'}}>
        {/* Linear Gradient Header */}
        <View style={styles.container}>
          <LinearGradient
            colors={['#1F7F81', '#3C9597', '#53A6A8']}
            style={[styles.gradientView, {height: viewHeight}]}>
            <Image
              source={require('../assets/image/logo_white.png')}
              style={styles.logobg}
            />

            {/* Profile */}
            <View style={styles.profileContainer}>
              <View style={styles.profileImageContainer}>
                {customerImg ? (
                  <Image
                    source={{uri: customerImg}}
                    style={styles.profileImage}
                  />
                ) : (
                  <Image
                    source={require('../assets/image/data/avatar.jpeg')}
                    style={styles.profileImage}
                  />
                )}
              </View>
              <Text style={styles.profileName}>{customerName} </Text>
              <View style={styles.iconContainer}>
                <TouchableOpacity
                  onPress={() =>
                    navigationApp.navigate('ChatList', {
                      accountId: accountId,
                    })
                  }>
                  <Image
                    source={require('../assets/image/icon/chat_icon.png')}
                    style={styles.chatIcon}
                  />
                </TouchableOpacity>
                <Image
                  source={require('../assets/image/icon/notification_icon.png')}
                  style={styles.notificationIcon}
                />
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Slider Banner */}
        <View style={styles.carouselContainer}>
          <Carousel
            loop
            width={width}
            height={180}
            data={sliderData}
            renderItem={renderBanner}
            onSnapToItem={index => setCurrentIndex(index)}
          />
          <View style={styles.pagination}>
            {sliderData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      currentIndex === index ? 'black' : '#D9D9D9',
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Customer Option */}
        <View style={styles.customerOptionContainer}>
          <CustomerOptions />
        </View>

        {/* News */}
        <View style={styles.newsContainer}>
          <View style={styles.newsTextContainer}>
            <Text style={styles.newsText}>Tin Tức</Text>
            <TouchableOpacity
              onPress={() => handlePress('View all')}
              activeOpacity={0.7}
              style={styles.viewAllButtonText}>
              <Text style={styles.viewAllText}>Xem tất cả</Text>
            </TouchableOpacity>
            <View style={styles.listNewsContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {newsData.map(news => (
                  <NewsItem
                    key={news.id}
                    id={news.id}
                    image={news.image}
                    heading={news.heading}
                    onPress={handleNewsPress}
                  />
                ))}
              </ScrollView>
            </View>
          </View>
        </View>

        {/* Blog */}
        <View style={styles.blogContainer}>
          <View style={styles.newsTextContainer}>
            <Text style={styles.newsText}>Kiến thức xây nhà</Text>
            <TouchableOpacity
              onPress={handleBlogListPress}
              activeOpacity={0.7}
              style={styles.viewAllButtonText}>
              <Text style={styles.viewAllText}>Xem tất cả</Text>
            </TouchableOpacity>
            <View style={styles.listBlogContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {blogData.map(blog => (
                  <BlogItem
                    key={blog.Id}
                    id={blog.Id}
                    image={blog.ImgUrl || ''}
                    heading={blog.Heading}
                    onPress={handleBlogDetailPress}
                  />
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientView: {
    width: '100%',
  },
  logobg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '90%',
    opacity: 0.2,
    height: '100%',
    marginLeft: -160,
  },
  profileContainer: {
    marginTop: '5%',
    marginLeft: '5%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    overflow: 'hidden',
    marginRight: 10,
  },
  profileImage: {
    width: '90%',
    height: '90%',
    borderRadius: 25,
  },
  iconContainer: {
    position: 'absolute',
    right: '8%',
    top: '50%',
    transform: [{translateY: -15}],
    flexDirection: 'row',
  },
  chatIcon: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginLeft: '5%',
  },
  notificationIcon: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginLeft: '20%',
  },
  profileName: {
    fontFamily: FONTFAMILY.montserat_bold,
    color: 'white',
    fontSize: 18,
  },
  carouselContainer: {
    marginTop: '-18%',
    marginLeft: '9.5%',
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '3%',
    marginRight: '10%',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
    justifyContent: 'space-around',
  },
  customerOptionContainer: {
    marginHorizontal: 27,
  },
  newsContainer: {
    marginVertical: 5,
    marginHorizontal: 27,
  },
  newsTextContainer: {
    flexDirection: 'row',
  },
  newsText: {
    fontFamily: FONTFAMILY.montserat_bold,
    color: 'black',
    fontSize: 14,
  },
  viewAllButtonText: {
    position: 'absolute',
    right: 0,
  },
  viewAllText: {
    fontFamily: FONTFAMILY.montserat_bold,
    color: '#57A8AA',
    fontSize: 14,
  },
  listNewsContainer: {
    marginTop: '8%',
    marginLeft: '-14%',
  },
  blogContainer: {
    marginVertical: 5,
    marginHorizontal: 27,
    backgroundColor: 'white',
  },
  listBlogContainer: {
    marginTop: '8%',
    marginLeft: '-34%',
  },
});

export default HomeScreen;
