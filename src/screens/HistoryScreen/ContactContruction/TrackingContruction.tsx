import {StyleSheet, Text, View} from 'react-native';
import React, {useState, useCallback} from 'react';
import {RouteProp, useNavigation, useFocusEffect} from '@react-navigation/native';
import {AppStackNavigationProp, AppStackParamList} from '@/types/TypeScreen';
import {useRoute} from '@react-navigation/native';
import {TrackingContructionType} from '../../../types/screens/History/HistoryType';
import {getTrackingPaymentContruction} from '../../../api/Project/project';
import Appbar from '../../../components/Appbar';
import Tracking from '../../../components/Tracking';
import TrackingBatchPayment from '../../../components/TrackingBatchPayment';

const TrackingContruction: React.FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'TrackingContruction'>>();
  const {projectId} = route.params;

  const navigationApp = useNavigation<AppStackNavigationProp>();

  const [trackingPayment, setTrackingPayment] = useState<
    TrackingContructionType[]
  >([]);

  const fetchData = async () => {
    const data = await getTrackingPaymentContruction(projectId);
    setTrackingPayment(Array.isArray(data) ? data : [data]);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [projectId])
  );

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('vi-VN');
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN');
  };

  const insertLineBreak = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      const lastSpaceIndex = text.lastIndexOf(' ', maxLength);
      const breakIndex = lastSpaceIndex > -1 ? lastSpaceIndex : maxLength;
      return text.slice(0, breakIndex) + '\n' + text.slice(breakIndex).trim();
    }
    return text;
  };

  const subItems = trackingPayment.map(item => ({
    id: item.Id,
    subTitle: insertLineBreak(item.Description, 20),
    price: formatPrice(item.TotalPrice) + ' VNĐ',
    date: formatDate(item.InsDate),
    subStatus: item.Status,
  }));

  return (
    <View style={styles.container}>
      <Appbar nameScreen="Hợp đồng thi công" />
      <View style={styles.content}>
        <Tracking
          title="Hợp đồng thi công nhà ở dân dụng"
          onPress={() => {
            navigationApp.navigate('ContactContructionScreen', {
              projectId: projectId,
            });
          }}
        />

        <TrackingBatchPayment
          title="Thanh toán"
          onPress={(id: string) => {
            navigationApp.navigate('UploadBill', {
              projectId: projectId,
              paymentId: id,
            });
          }}
          subItems={subItems}
        />
      </View>
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
});

export default TrackingContruction;
