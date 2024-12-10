import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface FilterTabsProps {
  tabs: string[];
}

const FilterTabs: React.FC<FilterTabsProps> = ({tabs}) => {
  const [activeTab, setActiveTab] = React.useState(tabs[0]);

  return (
    <View style={styles.tabContainer}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => setActiveTab(tab)}>
          <Text style={styles.tabText}>{tab}</Text>
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
    borderBottomColor: 'blue',
  },
  tabText: {
    fontSize: 16,
  },
});

export default FilterTabs;
