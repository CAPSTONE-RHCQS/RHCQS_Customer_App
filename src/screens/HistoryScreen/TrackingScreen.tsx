import React, {useState, useEffect} from 'react';
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
  const [isCancelDialogVisible, setCancelDialogVisible] = useState(false);

  const [trackingPayment, setTrackingPayment] = useState<
    TrackingContructionType[]
  >([]);

  const [cancelReason, setCancelReason] = useState('');

  const [isSuccessDialogVisible, setSuccessDialogVisible] = useState(false);

  const [isReasonDialogVisible, setReasonDialogVisible] = useState(false);

  const fetchData = async () => {
    const data = await getTrackingPaymentContruction(projectId);
    const sortedData = Array.isArray(data) ? data.sort((a, b) => new Date(a.InsDate).getTime() - new Date(b.InsDate).getTime()) : [data];
    setTrackingPayment(sortedData);
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
    if (!cancelReason.trim()) return;

    try {
      await cancelInitialQuotation(projectId, cancelReason);
      setCancelDialogVisible(false);
      setCancelReason('');
      setSuccessDialogVisible(true);
    } catch (error) {
      console.error('Error confirming cancel initial quotation:', error);
    }
  };

  const handleHasDesign = () => {
    navigationApp.navigate('HasDesignScreen', {projectId: projectId});
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
    fetchData();
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

  useEffect(() => {
    if (tracking?.InitialResponse?.Status === 'Canceled') {
      setReasonDialogVisible(true);
    } else {
      setReasonDialogVisible(false);
    }
  }, [tracking]);

  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        await Promise.all([fetchProject(), fetchTracking(), fetchData()]);
      };

      loadData();
    }, [projectId]),
  );

  const handlePressTracking = (title: string, projectId: string) => {
    switch (title) {
      case 'Báo giá sơ bộ':
        navigationApp.navigate('VersionScreen', {projectId: projectId});
        break;
      case 'Thiết kế':
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
      {title: 'Thiết kế', data: tracking.ContractDesignResponse},
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
            tracking?.InitialResponse?.Status === 'Pending' &&
            !tracking?.ContractDesignResponse &&
            !tracking?.FinalAppResponse &&
            project?.Type === 'HAVE_DRAWING' &&
            !project?.IsCustomerUpload
          }
        />
        <View>
          <View style={styles.content}>
            {renderTrackingItems()}
            {(tracking?.ContractDesignResponse || tracking?.ContractProcessingResponse) && (
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
            )}
          </View>
        </View>

        {tracking?.InitialResponse?.Status &&
          tracking.InitialResponse.Status !== 'Finalized' &&
          tracking.InitialResponse.Status !== 'Approved' &&
          tracking.InitialResponse.Status !== 'Reviewing' &&
          tracking.InitialResponse.Status !== 'Processing' &&
          tracking.InitialResponse.Status !== 'Updating' &&
          tracking.InitialResponse.Status !== 'Canceled' &&
          tracking.InitialResponse.Status !== 'Ended' &&
          tracking.InitialResponse.Status !== 'Rejected' && (
            <View style={styles.buttonContainer}>
              <View style={styles.button}>
                <TouchableOpacity onPress={handleCancelInitialQuotation}>
                  <Text style={styles.buttonText}>Hủy dự án</Text>
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
            <Pressable onPress={handleHasDesign}>
              <Text style={styles.modalText}>Gửi bản thiết kế</Text>
            </Pressable>
          </View>
        )}

        <Dialog.Container
          contentStyle={styles.dialogContainer}
          visible={isCancelDialogVisible}>
          <Dialog.Title style={styles.dialogTitle}>Xác nhận</Dialog.Title>
          <Dialog.Description style={styles.dialogDescription}>
            Hãy cho chúng tôi biết lý do hủy dự án !
          </Dialog.Description>
          <Dialog.Input
            style={styles.dialogInput}
            placeholder="Nhập lý do hủy dự án"
            value={cancelReason}
            onChangeText={setCancelReason}
          />
          <Dialog.Button
            label="Hủy"
            onPress={() => {
              setCancelDialogVisible(false);
              setCancelReason('');
            }}
            style={styles.dialogButtonCancel}
          />
          <Dialog.Button
            label="Xác nhận"
            onPress={confirmCancelInitialQuotation}
            style={[
              styles.dialogButton,
              {color: cancelReason.trim() ? 'red' : '#ccc'},
            ]}
            disabled={!cancelReason.trim()}
          />
        </Dialog.Container>

        <Dialog.Container
          contentStyle={styles.dialogContainer}
          visible={isSuccessDialogVisible}>
          <Dialog.Title style={styles.dialogTitle}>Thông báo</Dialog.Title>
          <Dialog.Description style={styles.dialogDescription}>
            Hủy dự án thành công
          </Dialog.Description>
          <Dialog.Button
            label="Đóng"
            onPress={() => {
              setSuccessDialogVisible(false);
              navigationApp.navigate('HistoryScreen');
            }}
            style={styles.dialogButton}
          />
        </Dialog.Container>

        <Dialog.Container
          contentStyle={styles.dialogContainer}
          visible={isReasonDialogVisible}>
          <Dialog.Title style={styles.dialogTitle}>Lý do hủy</Dialog.Title>
          <Dialog.Description style={styles.dialogDescription}>
            {project?.ReasonCanceled || 'Không có lý do nào được cung cấp.'}
          </Dialog.Description>
          <Dialog.Button
            label="Đóng"
            onPress={() => {
              setReasonDialogVisible(false);
              navigationApp.navigate('HistoryScreen');
            }}
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
    backgroundColor: 'white',
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
  dialogInput: {
    marginBottom: 10,
    fontFamily: FONTFAMILY.montserat_regular,
    color: '#333',
  },
});

export default TrackingScreen;
