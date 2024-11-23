import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {ChatData} from '../types/screens/Chat/Chat';
import {FONTFAMILY} from '../theme/theme';
import {useNavigation} from '@react-navigation/native';
import {AppStackNavigationProp} from '../types/TypeScreen';

const ChatItem: React.FC<ChatData & {onPress: () => void}> = ({
  Id,
  AvatarStaff,
  StaffName,
  MessageContext,
  SendAt,
  isRead,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <Image source={AvatarStaff} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={[styles.staffName, isRead ? styles.read : styles.unread]}>
          {StaffName}
        </Text>
        <Text
          style={[styles.messageContext, isRead ? styles.read : styles.unread]}>
          {MessageContext}
        </Text>
      </View>
      <Text style={[styles.sendAt, isRead ? styles.read : styles.unread]}>
        {SendAt}
      </Text>
    </TouchableOpacity>
  );
};

const ChatItemList: React.FC<{data: ChatData[]}> = ({data}) => {
  const [chatData, setChatData] = useState(data);
  const navigationApp = useNavigation<AppStackNavigationProp>();

  const handlePress = (id: string) => {
    setChatData(prevData =>
      prevData.map(item => (item.Id === id ? {...item, isRead: true} : item)),
    );
    navigationApp.navigate('ChatScreen', {id});
  };

  return (
    <View>
      {chatData.map(item => (
        <ChatItem
          key={item.Id}
          {...item}
          onPress={() => handlePress(item.Id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  staffName: {
    fontFamily: FONTFAMILY.montserat_bold,
    fontSize: 16,
    color: 'black',
  },
  messageContext: {
    fontFamily: FONTFAMILY.montserat_regular,
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  sendAt: {
    fontFamily: FONTFAMILY.montserat_regular,
    fontSize: 12,
    color: '#999',
  },
  read: {
    fontFamily: FONTFAMILY.montserat_regular,
    color: '#999',
  },
  unread: {
    fontFamily: FONTFAMILY.montserat_bold,
    color: 'black',
  },
});

export default ChatItemList;
