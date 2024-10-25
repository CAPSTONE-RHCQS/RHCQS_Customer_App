import {View, Text, StyleSheet, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppStackNavigationProp} from '@/types/TypeScreen';
import {useNavigation} from '@react-navigation/native';
import {Blog} from '../../types/screens/Blog/BlogType';
import {getBlog} from '../../api/Blog/Blog';
import BlogSlider from '../../components/BlogSlider';
import Carousel from 'react-native-reanimated-carousel';
import AppBar from '../../components/Appbar';
import {width} from '../../utils/Dimensions';
import {FONTFAMILY} from '../../theme/theme';
import BlogCard from '../../components/BlogCard';

const BlogList: React.FC = () => {
  const navigationApp = useNavigation<AppStackNavigationProp>();
  const [blogData, setBlogData] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlog = async () => {
      const blog = await getBlog();
      setBlogData(blog);
    };
    fetchBlog();
  }, []);

  const renderBlog = ({item}: {item: Blog}) => {
    return (
      <BlogSlider
        data={item}
        onPress={() =>
          navigationApp.navigate('BlogDetail', {
            id: item.Id,
            heading: item.Heading,
          })
        }
      />
    );
  };

  const renderBlogList = ({item}: {item: Blog}) => {
    return (
      <BlogCard
        data={item}
        onPress={() =>
          navigationApp.navigate('BlogDetail', {
            id: item.Id,
            heading: item.Heading,
          })
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <AppBar nameScreen="Blog" />
      <View style={styles.carouselContainer}>
        <Carousel
          loop
          width={width}
          height={550}
          data={blogData}
          renderItem={renderBlog}
        />
      </View>
      <View style={styles.blogContainer}>
        <Text style={styles.blogTitle}>Thông tin mới nhất</Text>
        <View style={styles.blogList}>
          <FlatList
            data={blogData}
          renderItem={renderBlogList}
            keyExtractor={item => item.Id.toString()}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  carouselContainer: {
    paddingHorizontal: 20,
    flex: 0.45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blogContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  blogList: {
    flex: 1,
    marginTop: 10,
  },
  blogTitle: {
    fontSize: 18,
    fontFamily: FONTFAMILY.montserat_bold,
    color: 'black',
  },
});
export default BlogList;
