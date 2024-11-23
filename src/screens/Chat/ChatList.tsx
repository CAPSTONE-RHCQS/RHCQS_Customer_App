import AppBar from '../../components/Appbar';
import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {ChatData} from '../../types/screens/Chat/Chat';
import {chatListData} from '../../model/data';
import ChatItemList from '../../components/ChatItemList';
const ChatList: React.FC = () => {
  const [chatList, setChatList] = useState<ChatData[]>(chatListData);
  return (
    <>
      <AppBar nameScreen="Tin nhắn" />
      <ScrollView style={styles.container}>
        <ChatItemList data={chatList} />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 2,
  },
});

export default ChatList;
