import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import Construction from './Construction';
import {FONTFAMILY} from '../theme/theme';
import {ScrollView} from 'react-native-gesture-handler';

interface ExpandableListProps {
  id: string;
  title: string;
  ultilities: Array<{
    id: string;
    title: string;
    price: number;
    area: string;
    unit: string;
    isChecked: boolean;
  }>;
  onDetailPress: (id: string) => void;
  onCheckBoxPress: (id: string, price: number) => void;
  formatPrice: (price: number) => string;
}

const Ultilities: React.FC<ExpandableListProps> = ({
  id,
  title,
  ultilities,
  onDetailPress,
  onCheckBoxPress,
  formatPrice,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}>
        <Text style={styles.title}>{title}</Text>
        <Image
          source={
            expanded
              ? require('../assets/image/icon/chevron/chevron-down-blue.png')
              : require('../assets/image/icon/chevron/chevron-right-blue.png')
          }
          style={styles.icon}
        />
      </TouchableOpacity>
      {expanded && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            {ultilities.map(ultility => (
              <Construction
                key={ultility.id}
                id={ultility.id}
                title={ultility.title}
                price={formatPrice(ultility.price)}
                area={ultility.area}
                unit={ultility.unit}
                isChecked={ultility.isChecked}
                onDetailPress={() => onDetailPress(ultility.id)}
                onCheckBoxPress={() =>
                  onCheckBoxPress(ultility.id, ultility.price)
                }
              />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    color: '#02A9A3',
    fontSize: 16,
    fontFamily: FONTFAMILY.montserat_bold,
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export default Ultilities;
