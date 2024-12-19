import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {useNavigation, RouteProp, useRoute} from '@react-navigation/native';
import {FONTFAMILY} from '../theme/theme';
import {AppStackNavigationProp, AppStackParamList} from '../types/TypeScreen';

interface SubItemProps {
  id: string;
  subTitle: string;
  subStatus?: string;
  price: string;
  date: string;
  description?: string;
}

interface TrackingBatchPaymentProps {
  title: string;
  status?: string;
  subItems: SubItemProps[];
  onPress: (id: string) => void;
}

const TrackingBatchPayment: React.FC<TrackingBatchPaymentProps> = ({
  title,
  status,
  subItems,
  onPress,
}) => {
  const [expanded, setExpanded] = useState(false);

  const isPressable = status !== 'Paid';

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'Progress':
        return '#FFA500';
      case 'Paid':
        return '#008000';
      case 'Cancel':
        return '#FF0000';
      default:
        return 'black';
    }
  };

  const getStatusText = (status: string | undefined) => {
    switch (status) {
      case 'Progress':
        return 'Chờ thanh toán';
      case 'Paid':
        return 'Đã thanh toán';
      case 'Cancel':
        return 'Đã hủy';
      default:
        return '';
    }
  };

  const handleSubItemPress = (id: string) => {
    onPress(id);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => {
          if (isPressable) {
            setExpanded(!expanded);
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
              onPress={() => handleSubItemPress(item.id)}
              disabled={status === 'Paid'}
            >
              <View>
                <Text
                  style={styles.subItemTitle}
                  numberOfLines={2}
                  ellipsizeMode="tail">
                  {item.subTitle}
                </Text>
                <Text style={styles.subItemPrice}>{item.price}</Text>
              </View>
              <View>
                <Text
                  style={[
                    styles.subItemStatus,
                    {color: getStatusColor(item.subStatus)},
                  ]}>
                  {getStatusText(item.subStatus)}
                </Text>
                <Text style={styles.subItemDate}>{item.date}%</Text>
              </View>
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
    textAlign: 'right',
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
    fontSize: 13,
    marginLeft: 10,
    fontFamily: FONTFAMILY.montserat_semibold,
  },
  subItemPrice: {
    color: '#1F7F81',
    fontSize: 16,
    marginLeft: 10,
    fontFamily: FONTFAMILY.montserat_regular,
  },
  subItemDate: {
    color: 'black',
    fontSize: 16,
    marginLeft: 10,
    fontFamily: FONTFAMILY.montserat_bold,
    textAlign: 'right',
  },
  subItemStatus: {
    fontSize: 13,
    fontFamily: FONTFAMILY.montserat_regular,
    textAlign: 'right',
  },
  subItemDescription: {
    color: 'black',
    fontSize: 16,
    marginLeft: 10,
    fontFamily: FONTFAMILY.montserat_regular,
  },
});

export default TrackingBatchPayment;
