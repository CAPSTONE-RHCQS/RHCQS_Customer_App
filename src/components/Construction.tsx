import { FONTFAMILY } from '../theme/theme';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface ConstructionProps {
  id: string;
  title: string;
  price: string;
  area: string;
  unit: string;
  onDetailPress: () => void;
  isChecked: boolean;
  onCheckBoxPress: (id: string) => void;
}

const Construction: React.FC<ConstructionProps> = ({
  id,
  title,
  price,
  area,
  unit,
  onDetailPress,
  isChecked,
  onCheckBoxPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onDetailPress}>
            <Text style={styles.detailText}>Chi tiết</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.priceGroup}>
          <Text style={styles.price}>{price}</Text>
          <Text style={styles.area}>{area}{unit}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => onCheckBoxPress(id)} style={styles.checkbox}>
        {isChecked ? (
          <Image
            source={require('../assets/image/icon/checkbox/selected.png')}
            style={{ width: 20, height: 20 }}
          />
        ) : (
          <Image
            source={require('../assets/image/icon/checkbox/circle.png')}
            style={{ width: 20, height: 20 }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 15,
  },
  title: {
    fontSize: 14,
    color: 'black',
    fontFamily: FONTFAMILY.montserat_medium,
    marginBottom: 5,
  },
  detailText: {
    fontSize: 12,
    fontFamily: FONTFAMILY.montserat_medium,
    marginBottom: 5,
  },
  priceGroup: {
    position: 'absolute',
    paddingVertical: 15,
    right: 0,
    marginRight: 20,
  },
  price: {
    fontFamily: FONTFAMILY.montserat_medium,
    fontSize: 14,
    color: '#02A9A3',
    marginBottom: 5,
  },
  area: {
    fontFamily: FONTFAMILY.montserat_medium,
    fontSize: 12,
  },
  checkbox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Construction;