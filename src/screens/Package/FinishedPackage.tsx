import {StyleSheet, Text, View} from 'react-native';
import React, { useEffect, useState } from 'react';
import AppBar from '../../components/Appbar';
import FillterTabs from '../../components/FillterTabs';
import { getPackages } from '../../api/Package/Package';

const FinishedPackage: React.FC = () => {
  const [finishedPackage, setFinishedPackage] = useState<string | null>(null);

  useEffect(() => {
    const fetchFinishedPackage = async () => {
      const data = await getPackages();
      setFinishedPackage(data);
      console.log(data);
    };
    fetchFinishedPackage();
  }, []);

  return (
    <View style={styles.container}>
      <AppBar nameScreen="Gói thi công hoàn thiện" />
      <FillterTabs tabs={['Gói thi công hoàn thiện', 'Gói thi công thô']} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default FinishedPackage;
