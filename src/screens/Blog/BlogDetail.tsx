import {RouteProp, useRoute} from '@react-navigation/native';
import AppBar from '../../components/Appbar';
import React, {useEffect, useState} from 'react';
import {Image, ScrollView, StatusBar, StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {AppStackParamList} from '../../types/TypeScreen';
import {getBlogDetail} from '../../api/Blog/Blog';
import {Blog} from '../../types/screens/Blog/BlogType';
import {FONTFAMILY} from '../../theme/theme';
import RenderHtml from 'react-native-render-html';

const BlogDetail: React.FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'BlogDetail'>>();
  const {id} = route.params;
  const [blogDetail, setBlogDetail] = useState<Blog | null>(null);
  const {width} = useWindowDimensions();

  useEffect(() => {
    const fetchBlog = async () => {
      const data = await getBlogDetail(id);
      setBlogDetail(data);
    };
    fetchBlog();
  }, []);
  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#E4E1E1FF" />
      <AppBar nameScreen="Chia sẻ" />
      <ScrollView>
        {blogDetail && (
          <>
            <Image source={{uri: blogDetail?.ImgUrl}} style={styles.image} />
            <View style={styles.content}>
              <Text style={styles.heading}>{blogDetail?.Heading}</Text>
              <Text style={styles.accountName}>{blogDetail?.AccountName}</Text>
              <Text style={styles.insDate}>
                {formatDate(blogDetail?.InsDate || '')}
              </Text>
              <RenderHtml
                contentWidth={width}
                source={{ html: blogDetail?.Context || '' }}
                tagsStyles={{
                  p: {
                    fontSize: 16,
                    fontFamily: FONTFAMILY.montserat_regular,
                    color: 'black',
                    marginVertical: 20,
                  }
                }}
              />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    paddingHorizontal: 20,
  },
  image: {
    width: '100%',
    height: 200,
  },
  heading: {
    fontSize: 20,
    fontFamily: FONTFAMILY.montserat_bold,
    color: 'black',
    marginVertical: 10,
  },
  accountName: {
    textAlign: 'right',
    fontSize: 12,
    fontFamily: FONTFAMILY.montserat_regular,
    color: 'black',
  },
  insDate: {
    textAlign: 'right',
    fontSize: 10,
    fontFamily: FONTFAMILY.montserat_regular,
    color: 'black',
  },
  context: {
    fontSize: 16,
    fontFamily: FONTFAMILY.montserat_regular,
    color: 'black',
    marginVertical: 20,
  },
});

export default BlogDetail;
