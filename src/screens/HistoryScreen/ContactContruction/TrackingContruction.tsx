import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {AppStackNavigationProp, AppStackParamList} from '@/types/TypeScreen';
import {useRoute} from '@react-navigation/native';
import {TrackingContructionType} from '../../../types/screens/History/HistoryType';
import {getTrackingPaymentContruction} from '../../../api/Project/project';
import Appbar from '../../../components/Appbar';
import Tracking from '../../../components/Tracking';
import TrackingBatchPayment from '../../../components/TrackingBatchPayment';

interface FormattedDesignData {
  title: string;
  status: string;
  subItems: {
    subTitle: number;
    subStatus: string;
    description?: string;
  }[];
}

const TrackingContruction: React.FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'TrackingContruction'>>();
  const {projectId} = route.params;

  const navigationApp = useNavigation<AppStackNavigationProp>();

  const [trackingPayment, setTrackingPayment] = useState<
    TrackingContructionType[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTrackingPaymentContruction(projectId);
      setTrackingPayment(Array.isArray(data) ? data : [data]);
      console.log('trackingPayment', JSON.stringify(trackingPayment, null, 2));
    };
    fetchData();
  }, [projectId]);

  // cập nhật lại dữ liệu
  useEffect(() => {}, [trackingPayment]);

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('vi-VN');
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN');
  };

  const subItems = trackingPayment.map(item => ({
    subTitle: 'Thanh toán',
    price: formatPrice(item.TotalPrice),
    date: formatDate(item.InsDate),
    subStatus: 'Pending',
  }));

  return (
    <View style={styles.container}>
      <Appbar nameScreen="Hợp đồng thi công" />
      <View style={styles.content}>
        <Tracking
          title="Hợp đồng tư vấn và thiết kế kiến trúc"
          onPress={() => {
            navigationApp.navigate('ContactContructionScreen', {
              projectId: projectId,
            });
          }}
        />

        <TrackingBatchPayment
          title="Thanh toán"
          onPress={() => {}}
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
