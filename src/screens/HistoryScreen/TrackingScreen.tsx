import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import Dialog from 'react-native-dialog';
import AppBar from '../../components/Appbar';
import Tracking from '../../components/Tracking';
import {
  cancelInitialQuotation,
  getProjectById,
  getTracking,
  getTrackingPaymentContruction,
  requestDesign,
} from '../../api/Project/project';
import {
  useRoute,
  RouteProp,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import {
  AppStackNavigationProp,
  AppStackParamList,
} from '../../types/TypeScreen';
import {FONTFAMILY} from '../../theme/theme';
import {
  TrackingContructionType,
  ProjectHistory,
  TrackingType,
} from '../../types/screens/History/HistoryType';
import TrackingBatchPayment from '../../components/TrackingBatchPayment';

const TrackingScreen: React.FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'TrackingScreen'>>();
  const {projectId} = route.params;

  const navigationApp = useNavigation<AppStackNavigationProp>();
  const [project, setProject] = useState<ProjectHistory | null>(null);
  const [tracking, setTracking] = useState<TrackingType | null>(null);

  const [modalPosition, setModalPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isRequestDesignDialogVisible, setRequestDesignDialogVisible] =
    useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [isCancelDialogVisible, setCancelDialogVisible] = useState(false);

  const [trackingPayment, setTrackingPayment] = useState<
    TrackingContructionType[]
  >([]);

  const fetchData = async () => {
    const data = await getTrackingPaymentContruction(projectId);
    setTrackingPayment(Array.isArray(data) ? data : [data]);
  };

  const fetchProject = async () => {
    try {
      const projectData: ProjectHistory = await getProjectById(projectId);
      setProject(projectData);
    } catch (error) {
      console.error('Error fetching project data:', error);
    }
  };

  const fetchTracking = async () => {
    try {
      const trackingData: TrackingType = await getTracking(projectId);
      setTracking(trackingData);
    } catch (error) {
      console.error('Error fetching tracking data:', error);
    }
  };

  const handleCancelInitialQuotation = async () => {
    setCancelDialogVisible(true);
  };

  const confirmCancelInitialQuotation = async () => {
    await cancelInitialQuotation(projectId);
    navigationApp.navigate('HistoryScreen');
    setCancelDialogVisible(false);
  };

  const handleHasDesign = () => {
    navigationApp.navigate('HasDesignScreen', {projectId: projectId});
  };

  const handleRequestDesign = async () => {
    try {
      await requestDesign(projectId);
      setDialogMessage('Yêu cầu bản vẽ thiết kế đã được gửi thành công.');
    } catch (error) {
      console.error('Error requesting design:', error);
      setDialogMessage('Đã xảy ra lỗi khi gửi yêu cầu bản vẽ thiết kế.');
    } finally {
      setRequestDesignDialogVisible(true);
    }
  };

  const handleIconPress = (event: any) => {
    const {pageX, pageY} = event.nativeEvent;
    const screenWidth = Dimensions.get('window').width;
    const modalWidth = 200;

    const xPosition =
      pageX + modalWidth > screenWidth ? screenWidth - modalWidth - 10 : pageX;
    setModalPosition({x: xPosition, y: pageY});
  };

  const closeModal = () => {
    setModalPosition(null);
    setRequestDesignDialogVisible(false);
    fetchProject();
    fetchTracking();
  };

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

  useFocusEffect(
    React.useCallback(() => {
      fetchProject();
      fetchTracking();
      fetchData();
    }, [projectId]),
  );

  const handlePressTracking = (title: string, projectId: string) => {
    switch (title) {
      case 'Báo giá sơ bộ':
        navigationApp.navigate('VersionScreen', {projectId: projectId});
        break;
      case 'Hợp đồng thiết kế':
        navigationApp.navigate('TrackingDesignContact', {projectId: projectId});
        break;
      case 'Báo giá chi tiết':
        navigationApp.navigate('VersionFinalScreen', {projectId: projectId});
        break;
      case 'Hợp đồng thi công':
        navigationApp.navigate('ContactContructionScreen', {
          projectId: projectId,
        });
        break;
      default:
        console.log('Title:', title);
        break;
    }
  };

  const renderTrackingItems = () => {
    if (!tracking) return null;

    const items = [
      {title: 'Báo giá sơ bộ', data: tracking.InitialResponse},
      {title: 'Hợp đồng thiết kế', data: tracking.ContractDesignResponse},
      {title: 'Báo giá chi tiết', data: tracking.FinalAppResponse},
      {title: 'Hợp đồng thi công', data: tracking.ContractProcessingResponse},
    ];

    const allStatusesNull = items.every(item => !item.data);

    if (allStatusesNull) {
      return (
        <View style={styles.centeredMessage}>
          <Text style={styles.centeredText}>Dự án đang được khởi tạo</Text>
        </View>
      );
    }

    return items.map((item, index) => {
      if (item.data) {
        return (
          <Tracking
            key={index}
            title={item.title}
            status={item.data.Status}
            onPress={() => {
              handlePressTracking(item.title, projectId);
            }}
          />
        );
      }
      return null;
    });
  };

  return (
    <TouchableWithoutFeedback onPress={closeModal}>
      <View style={styles.container}>
        <AppBar
          nameScreen="Lịch sử báo giá sơ bộ"
          icon={require('../../assets/image/icon/plus-icon.png')}
          onIconPress={handleIconPress}
          showIcon={
            tracking?.InitialResponse?.Status === 'Finalized' &&
            !tracking?.ContractDesignResponse &&
            !tracking?.FinalAppResponse &&
            project?.Type !== 'TEMPLATE'
          }
        />
        <View>
          <View style={styles.content}>
            {renderTrackingItems()}
            <TrackingBatchPayment
              title="Đợt thanh toán"
              onPress={(id: string) => {
                const selectedItem = subItems.find(item => item.id === id);
                if (
                  selectedItem &&
                  selectedItem.subStatus !== 'Paid' &&
                  selectedItem.subStatus !== 'Cancel'
                ) {
                  navigationApp.navigate('UploadBill', {
                    projectId: projectId,
                    paymentId: id,
                  });
                }
              }}
              subItems={subItems}
            />
          </View>
        </View>

        {tracking?.InitialResponse?.Status &&
          tracking.InitialResponse.Status !== 'Finalized' &&
          tracking.InitialResponse.Status !== 'Approved' &&
          tracking.InitialResponse.Status !== 'Reviewing' &&
          tracking.InitialResponse.Status !== 'Processing' &&
          tracking.InitialResponse.Status !== 'Updating' &&
          tracking.InitialResponse.Status !== 'Canceled' &&
          tracking.InitialResponse.Status !== 'Ended' && (
            <View style={styles.buttonContainer}>
              <View style={styles.button}>
                <TouchableOpacity onPress={handleCancelInitialQuotation}>
                  <Text style={styles.buttonText}>Hủy báo giá sơ bộ</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

        {modalPosition && (
          <View
            style={[
              styles.customModal,
              {top: modalPosition.y, left: modalPosition.x},
            ]}>
            {!project?.IsDrawing && (
              <Pressable onPress={handleRequestDesign}>
                <Text style={styles.modalText}>Yêu cầu bản vẽ thiết kế</Text>
              </Pressable>
            )}

            {project?.IsDrawing && (
              <Pressable onPress={handleHasDesign}>
                <Text style={styles.modalText}>Gửi bản thiết kế</Text>
              </Pressable>
            )}
          </View>
        )}

        <Dialog.Container
          contentStyle={styles.dialogContainer}
          visible={isRequestDesignDialogVisible}>
          <Dialog.Title style={styles.dialogTitle}>Thông báo</Dialog.Title>
          <Dialog.Description style={styles.dialogDescription}>
            {dialogMessage}
          </Dialog.Description>
          <Dialog.Button
            style={styles.dialogButtonClose}
            label="Đóng"
            onPress={closeModal}
          />
        </Dialog.Container>

        <Dialog.Container
          contentStyle={styles.dialogContainer}
          visible={isCancelDialogVisible}>
          <Dialog.Title style={styles.dialogTitle}>Xác nhận</Dialog.Title>
          <Dialog.Description style={styles.dialogDescription}>
            Bạn có chắc chắn muốn hủy báo giá sơ bộ?
          </Dialog.Description>
          <Dialog.Button
            label="Hủy"
            onPress={() => setCancelDialogVisible(false)}
            style={styles.dialogButtonCancel}
          />
          <Dialog.Button
            label="Xác nhận"
            onPress={confirmCancelInitialQuotation}
            style={styles.dialogButton}
          />
        </Dialog.Container>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    marginHorizontal: 20,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    height: 60,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'red',
  },
  buttonText: {
    fontFamily: FONTFAMILY.montserat_medium,
    color: 'red',
    fontSize: 18,
  },
  customModal: {
    position: 'absolute',
    width: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
  },
  modalText: {
    fontFamily: FONTFAMILY.montserat_medium,
    color: '#808080FF',
    fontSize: 16,
    marginVertical: 12,
    marginHorizontal: 10,
    textAlign: 'center',
  },
  dialogContainer: {
    borderRadius: 12,
    marginHorizontal: 20,
  },
  dialogTitle: {
    color: '#1F7F81',
    fontSize: 20,
    fontFamily: FONTFAMILY.montserat_bold,
  },
  dialogDescription: {
    color: '#333',
    fontSize: 16,
    fontFamily: FONTFAMILY.montserat_regular,
  },
  dialogButtonClose: {
    color: '#1F7F81',
    fontFamily: FONTFAMILY.montserat_semibold,
    textTransform: 'none',
  },
  dialogButtonCancel: {
    color: '#1F7F81',
    fontFamily: FONTFAMILY.montserat_semibold,
    textTransform: 'none',
  },
  dialogButton: {
    color: '#1F7F81',
    fontFamily: FONTFAMILY.montserat_semibold,
    textTransform: 'none',
  },
  centeredMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredText: {
    fontFamily: FONTFAMILY.montserat_medium,
    fontSize: 18,
    color: 'gray',
  },
});

export default TrackingScreen;
