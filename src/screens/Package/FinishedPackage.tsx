import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppBar from '../../components/Appbar';
import FillterTabs from '../../components/FillterTabs';
import {getPackages, getPackageById} from '../../api/Package/Package';
import {Package} from '../../types/screens/Package/PackageType';
import {FONTFAMILY} from '../../theme/theme';

const FinishedPackage: React.FC = () => {
  const [finishedPackage, setFinishedPackage] = useState<Package[] | null>(
    null,
  );
  const [tabs, setTabs] = useState<{id: string; name: string}[]>([]);
  const [selectedTabId, setSelectedTabId] = useState<string | null>(null);
  const [packageData, setPackageData] = useState<Package | null>(null);

  useEffect(() => {
    const fetchFinishedPackage = async () => {
      const data = await getPackages();
      setFinishedPackage(data);
      const finishedTabs = data
        .filter(pkg => pkg.PackageType === 'FINISHED')
        .map(pkg => ({
          id: pkg.Id,
          name: pkg.PackageName.replace('Gói hoàn thiện', '').trim(),
        }));
      setTabs(finishedTabs);
      if (finishedTabs.length > 0) {
        setSelectedTabId(finishedTabs[0].id);
        const initialPackageData = await getPackageById(finishedTabs[0].id);
        setPackageData(initialPackageData);
      }
    };
    fetchFinishedPackage();
  }, []);

  const handleTabSelect = async (id: string) => {
    setSelectedTabId(id);
    const packageData = await getPackageById(id);
    setPackageData(packageData);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#E4E1E1FF" />
      <AppBar nameScreen="Gói thi công hoàn thiện" />
      <FillterTabs
        tabs={tabs}
        onTabSelect={handleTabSelect}
        selectedTabId={selectedTabId}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Nhân Công</Text>
        {packageData?.PackageLabors && packageData.PackageLabors.length > 0 ? (
          <FlatList
            data={packageData.PackageLabors}
            keyExtractor={item => item.Id}
            renderItem={({item}) => (
              <View style={styles.row}>
                <Text style={styles.cellName}>{item.NameOfLabor}</Text>
                <Text style={styles.cell}>{formatPrice(item.Price)}/ngày</Text>
              </View>
            )}
            style={styles.table}
          />
        ) : (
          <Text style={styles.noDataText}>Không có dữ liệu nhân công</Text>
        )}

        <Text style={styles.title}>Vật Tư</Text>
        {packageData?.PackageMaterials &&
        packageData.PackageMaterials.length > 0 ? (
          <FlatList
            data={packageData.PackageMaterials}
            keyExtractor={item => item.Id}
            renderItem={({item}) => (
              <View style={styles.row}>
                <Text style={styles.cellName}>{item.MaterialName}</Text>
                <Text style={styles.cell}>
                  {formatPrice(item.Price)}/{item.Unit}
                </Text>
              </View>
            )}
            style={styles.table}
          />
        ) : (
          <Text style={styles.noDataText}>Không có dữ liệu vật tư</Text>
        )}
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
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: FONTFAMILY.montserat_bold,
    color: '#1F7F81',
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: 'black',
    fontFamily: FONTFAMILY.montserat_medium,
    padding: 5,
  },
  cellName: {
    flex: 1,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    color: 'black',
    fontSize: 12,
    fontFamily: FONTFAMILY.montserat_bold,
    padding: 5,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  noDataText: {
    textAlign: 'center',
    color: 'red',
    marginVertical: 10,
    fontFamily: FONTFAMILY.montserat_bold,
  },
});

export default FinishedPackage;
