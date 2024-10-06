import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getPackages } from '../../api/Package/Package';
import Checkbox from '../../components/Checkbox';
import { FONTFAMILY } from '../../theme/theme';
import AppBar from '../../components/Appbar';

const Package: React.FC = () => {
    const [packages, setPackages] = useState<{ PackageName: string; Price: number }[]>([]);
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  
    useEffect(() => {
      const fetchPackages = async () => {
        const data = await getPackages();
        setPackages(data);
      };
  
      fetchPackages();
    }, []);
  
    const handleCheck = (id: string) => {
      setCheckedItems((prev) => {
        const newCheckedItems = new Set(prev);
        if (newCheckedItems.has(id)) {
          newCheckedItems.delete(id);
        } else {
          newCheckedItems.add(id);
        }
        return newCheckedItems;
      });
    };

    // const handleNext = () => {
    //     navigationApp.navigate('ConstructionScreen');
    //   };
  
    return (
      <View>
        <AppBar nameScreen='Chọn gói thi công' />
        {packages.map((pkg, index) => (
          <Checkbox
            key={index}
            id={pkg.PackageName} // Sử dụng PackageName làm id
            label={`${pkg.PackageName} - ${pkg.Price.toLocaleString()} VND`} // Hiển thị PackageName và Price
            isChecked={checkedItems.has(pkg.PackageName)}
            onCheck={handleCheck}
          />
        ))}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 14,
    },
    checkbox: {
      width: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    checkboxImage: {
      width: 20,
      height: 20,
    },
    label: {
      fontFamily: FONTFAMILY.montserat_medium,
      fontSize: 14,
      color: 'black',
    },
  });

export default Package