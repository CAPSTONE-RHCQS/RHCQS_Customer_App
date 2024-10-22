import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {FONTFAMILY} from '../theme/theme';

interface SimpleExpandableListProps {
  title: string;
  date: string;
}

const Project: React.FC<SimpleExpandableListProps> = ({
  title,
  date,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <Image
          source={
           require('../assets/image/icon/chevron/chevron-right.png')
          }
          style={styles.icon}
        />
      </TouchableOpacity>
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
  titleContainer: {
    flexDirection: 'column',
  },
  title: {
    color: 'black',
    fontSize: 16,
    fontFamily: FONTFAMILY.montserat_bold,
  },
  date: {
    color: 'black',
    fontSize: 12,
    fontFamily: FONTFAMILY.montserat_regular,
  },
  icon: {
    width: 18,
    height: 18,
  },
});

export default Project;
