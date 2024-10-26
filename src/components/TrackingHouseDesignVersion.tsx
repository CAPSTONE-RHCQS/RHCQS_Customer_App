import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {useNavigation, RouteProp, useRoute} from '@react-navigation/native';
import {FONTFAMILY} from '../theme/theme';
import {AppStackNavigationProp, AppStackParamList} from '../types/TypeScreen';

interface SubItemProps {
  subTitle: number;
  subStatus?: string;
}

interface TrackingHouseDesignVersionProps {
  title: string;
  status?: string;
  subItems: SubItemProps[];
  onPress: () => void;
}

const TrackingHouseDesignVersion: React.FC<TrackingHouseDesignVersionProps> = ({
  title,
  status,
  subItems,
  onPress,
}) => {
  const [expanded, setExpanded] = useState(false);
  const navigation = useNavigation<AppStackNavigationProp>();

  const route = useRoute<RouteProp<AppStackParamList, 'DetailVersionDesign'>>();
  const {projectId} = route.params;

  const isPressable = status !== 'Pending' && status !== 'Canceled';

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'Pending':
        return '#FFA500';
      case 'Processing':
        return '#0000FF';
      case 'Approved':
        return '#00FF00';
      case 'Finalized':
        return '#008000';
      case 'Finished':
        return '#004000';
      case 'Canceled':
        return '#FF0000';
      default:
        return 'black';
    }
  };

  const getStatusText = (status: string | undefined) => {
    switch (status) {
      case 'Pending':
        return 'Đang chờ xử lý';
      case 'Processing':
        return 'Đang xử lý';
      case 'Approved':
        return 'Đã được duyệt';
      case 'Finalized':
        return 'Đã hoàn tất';
      case 'Finished':
        return 'Đã hoàn thành';
      case 'Canceled':
        return 'Đã hủy';
      default:
        return '';
    }
  };

  const handleSubItemPress = (subTitle: number) => {
    navigation.navigate('DetailVersionDesign', {
      projectId: projectId,
      version: subTitle.toString(),
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => {
          if (isPressable) {
            setExpanded(!expanded);
            onPress();
          }
        }}
        disabled={!isPressable}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={[styles.status, {color: getStatusColor(status)}]}>
            {getStatusText(status)}
          </Text>
        </View>
        <Image
          source={
            expanded
              ? require('../assets/image/icon/chevron/chevron-down.png')
              : require('../assets/image/icon/chevron/chevron-right.png')
          }
          style={styles.icon}
        />
      </TouchableOpacity>
      {expanded && (
        <View>
          {subItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.subItem}
              onPress={() => handleSubItemPress(item.subTitle)}>
              <Text style={styles.subItemTitle}>Phiên bản {item.subTitle}</Text>
              <Text
                style={[
                  styles.subItemStatus,
                  {color: getStatusColor(item.subStatus)},
                ]}>
                {getStatusText(item.subStatus)}
              </Text>
              <Image
                source={require('../assets/image/icon/chevron/chevron-right.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    color: 'black',
    fontSize: 16,
    fontFamily: FONTFAMILY.montserat_bold,
  },
  status: {
    marginRight: 10,
    fontSize: 16,
    fontFamily: FONTFAMILY.montserat_bold,
  },
  icon: {
    width: 18,
    height: 18,
  },
  subItem: {
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  subItemTitle: {
    color: 'black',
    fontSize: 16,
    marginLeft: 10,
    fontFamily: FONTFAMILY.montserat_regular,
  },
  subItemStatus: {
    fontSize: 16,
    fontFamily: FONTFAMILY.montserat_regular,
  },
});

export default TrackingHouseDesignVersion;
