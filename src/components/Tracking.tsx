import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {FONTFAMILY} from '../theme/theme';

interface SimpleExpandableListProps {
  title: string;
  status?: string;
  onPress: () => void;
}

const Tracking: React.FC<SimpleExpandableListProps> = ({
  title,
  status,
  onPress,
}) => {
  const [expanded, setExpanded] = useState(false);

  const isPressable = status !== 'Pending' && status !== 'Canceled';

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'Pending':
        return '#FFA500';
      case 'Processing':
        return '#0000FF';
      case 'Approved':
        return '#0000FF';
      case 'Reviewing':
        return '#0000FF';
      case 'Rejected':
        return '#0000FF';
      case 'Updating':
        return '#0000FF';
      case 'Ended':
        return '#B96969FF';
      case 'Finalized':
        return '#008000';
      case 'Canceled':
        return '#FF0000';
      case 'Completed':
        return '#27C3C9FF';
      case 'Finished':
        return '#008000';
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
        return 'Đang xử lý';
      case 'Reviewing':
        return 'Đang xử lý';
      case 'Rejected':
        return 'Đang xử lý';
      case 'Updating':
        return 'Đang xử lý';
      case 'Ended':
        return 'Đã đóng';
      case 'Finalized':
        return 'Đã hoàn tất';
      case 'Completed':
        case 'Finished':
        return 'Đã kí hợp đồng';
      case 'Canceled':
        return 'Đã hủy';
      default:
        return '';
    }
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
          source={require('../assets/image/icon/chevron/chevron-right.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
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
});

export default Tracking;
