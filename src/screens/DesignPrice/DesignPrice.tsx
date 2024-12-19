import {StyleSheet, Text, View, StatusBar, ImageBackground} from 'react-native';
import AppBar from '../../components/Appbar';
import React, {useEffect, useState} from 'react';
import {getDesignPrice} from '../../api/DesignPrice/DesignPrice';
import {DesignPrice as DesignPriceResponse} from '../../types/screens/DesignPrice/DesignPrice';
import {FONTFAMILY} from '../../theme/theme';

const DesignPrice: React.FC = () => {
  const [designPrices, setDesignPrices] = useState<DesignPriceResponse[]>([]);

  useEffect(() => {
    const fetchDesignPrices = async () => {
      const prices = await getDesignPrice();
      prices.sort((a, b) => a.AreaFrom - b.AreaFrom);
      setDesignPrices(prices);
    };
    fetchDesignPrices();
  }, []);

  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + 'đ';
  };

  return (
    <ImageBackground 
      source={require('../../assets/background.jpg')}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#E4E1E1FF" />
      <AppBar nameScreen="Báo giá thiết kế" />
      <View style={styles.content}>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.cellHeader}>Diện tích từ</Text>
            <View style={styles.verticalLine} />
            <Text style={styles.cellHeader}>Diện tích đến</Text>
            <View style={styles.verticalLine} />
            <Text style={styles.cellHeader}>Giá/m2</Text>
          </View>
          {designPrices.map((price: DesignPriceResponse) => (
            <View style={styles.row} key={price.Id}>
              <Text style={styles.cellFrom}>{price.AreaFrom} m2</Text>
              <View style={styles.verticalLine} />
              <Text style={styles.cellTo}>{price.AreaTo} m2</Text>
              <View style={styles.verticalLine} />
              <Text style={styles.cellPrice}>{formatPrice(price.Price)}</Text>
            </View>
          ))}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    marginBottom: 100,
  },
  table: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    overflow: 'hidden',

  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cellHeader: {
    fontFamily: FONTFAMILY.montserat_bold,
    color: 'black',
    flex: 1,
    textAlign: 'center',
  },
  cellFrom: {
    fontFamily: FONTFAMILY.montserat_bold,
    color: '#1F7F81',
    flex: 1,
    textAlign: 'center',
  },
  cellTo: {
    fontFamily: FONTFAMILY.montserat_bold,
    color: '#1F7F81',
    flex: 1,
    textAlign: 'center',
  },
  cellPrice: {
    fontFamily: FONTFAMILY.montserat_bold,
    color: 'red',
    flex: 1,
    textAlign: 'center',
  },
  verticalLine: {
    width: 1,
    backgroundColor: '#ccc',
    height: '100%',
    marginHorizontal: 5,
  },
});

export default DesignPrice;
