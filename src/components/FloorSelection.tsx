import {FONTFAMILY} from '../theme/theme';
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';

interface FloorSelectionProps {
  selectedFloor: number | null;
  onSelect: (floors: number) => void;
}

const FloorSelection: React.FC<FloorSelectionProps> = ({
  selectedFloor,
  onSelect,
}) => {
  const floors = [1, 2, 3, 4, 5, 6];

  return (
    <View style={styles.container}>
      <FlatList
        data={floors}
        keyExtractor={item => item.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => onSelect(item)}
            style={styles.option}>
            <Text style={styles.optionText}>{item} tầng lầu</Text>
            {selectedFloor === item && <Text style={styles.checkmark}>✔</Text>}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#B7B3C0',
  },
  optionText: {
    fontSize: 16,
    fontFamily: FONTFAMILY.montserat_medium,
    color: 'black'
  },
  checkmark: {
    fontSize: 16,
    color: 'black',
    fontFamily: FONTFAMILY.montserat_bold
  },
});

export default FloorSelection;
