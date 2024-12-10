import {FONTFAMILY} from '../theme/theme';
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface FilterTabsProps {
  tabs: { id: string; name: string }[];
  onTabSelect: (id: string) => void;
  selectedTabId: string | null;
}

const FilterTabs: React.FC<FilterTabsProps> = ({tabs, onTabSelect, selectedTabId}) => {
  return (
    <View style={styles.tabContainer}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, selectedTabId === tab.id && styles.activeTab]}
          onPress={() => onTabSelect(tab.id)}>
          <Text style={[styles.tabText, selectedTabId === tab.id && styles.activeTabText]}>{tab.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  tab: {
    padding: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1F7F81',
  },
  tabText: {
    fontSize: 14,
    fontFamily: FONTFAMILY.montserat_bold,
    color: 'black',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  activeTabText: {
    color: '#1F7F81',
  },
});

export default FilterTabs;
