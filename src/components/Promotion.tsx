import {FONTFAMILY} from '../theme/theme';
import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Checkbox from './Checkbox';

interface PromotionData {
  Id: string;
  Code: string;
  Value: number;
  InsDate: string;
  StartTime: string;
  Name: string;
  ExpTime: string;
  IsRunning: boolean;
}

interface ExpandableListProps {
  id: string;
  title: string;
  promotions: Array<PromotionData>;
  onDetailPress: (id: string) => void;
}

const Promotion: React.FC<ExpandableListProps> = ({
  id,
  title,
  promotions,
  onDetailPress,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedPromotionId, setSelectedPromotionId] = useState<string | null>(null);

  useEffect(() => {
    if (promotions.length > 0) {
      setSelectedPromotionId(promotions[0].Id);
    }
  }, [promotions]);

  const handleCheckboxPress = (id: string) => {
    setSelectedPromotionId(prevId => (prevId === id ? null : id));
  };

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
            {promotions.map(promotion => (
              <View key={promotion.Id} style={styles.promotionItem}>
                <Text style={styles.promotionName} numberOfLines={2}>
                  {promotion.Name}
                </Text>
                <Text style={styles.promotionValue}>{promotion.Value}</Text>
                <Checkbox
                  id={promotion.Id}
                  label=""
                  isChecked={selectedPromotionId === promotion.Id}
                  onCheck={handleCheckboxPress}
                />
              </View>
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
  promotionItem: {
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  promotionName: {
    flex: 1,
    fontSize: 14,
    color: 'black',
    fontFamily: FONTFAMILY.montserat_medium,
    flexWrap: 'wrap',
    width: '60%',
  },
  promotionValue: {
    fontSize: 14,
    color: '#02A9A3',
    fontFamily: FONTFAMILY.montserat_medium,
    marginRight: 10,
    width: '20%',
    textAlign: 'right',
  },
});

export default Promotion;
