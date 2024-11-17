import {FONTFAMILY} from '../theme/theme';
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';

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
  const formatTitle = (title: string, maxChars: number) => {
    let formattedTitle = '';
    let currentLine = '';

    title.split(' ').forEach(word => {
      if ((currentLine + word).length > maxChars) {
        formattedTitle += currentLine.trim() + '\n';
        currentLine = word + ' ';
      } else {
        currentLine += word + ' ';
      }
    });

    formattedTitle += currentLine.trim();
    return formattedTitle;
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <View>
          <Text style={styles.title}>{formatTitle(title, 34)}</Text>
          <TouchableOpacity onPress={onDetailPress}>
            <Text style={styles.detailText}>Chi tiết</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.priceGroup}>
          <Text style={styles.price}>{price}</Text>
          <Text style={styles.area}>
            {area}
            {unit}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => onCheckBoxPress(id)}
        style={styles.checkbox}>
        {isChecked ? (
          <Image
            source={require('../assets/image/icon/checkbox/selected.png')}
            style={{width: 20, height: 20}}
          />
        ) : (
          <Image
            source={require('../assets/image/icon/checkbox/circle.png')}
            style={{width: 20, height: 20}}
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
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
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
    flexWrap: 'wrap',
  },
  detailText: {
    fontSize: 12,
    fontFamily: FONTFAMILY.montserat_medium,
    color: '#808080',
  },
  priceGroup: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginRight: 10,
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
    color: '#808080',
  },
  checkbox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Construction;
