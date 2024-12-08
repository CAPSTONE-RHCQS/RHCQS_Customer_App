import AppBar from '../../components/Appbar';
import React, {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, Text, View, StatusBar} from 'react-native';
import {ChatData} from '../../types/screens/Chat/Chat';
import ChatItemList from '../../components/ChatItemList';
import {getChatList} from '../../api/Chat/Chat';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {
  AppStackNavigationProp,
  AppStackParamList,
} from '../../types/TypeScreen';
import {useRoute} from '@react-navigation/native';
import {FONTFAMILY} from '../../theme/theme';

const ChatList: React.FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'ChatList'>>();
  const navigationApp = useNavigation<AppStackNavigationProp>();

  const {accountId} = route.params;
  const [chatList, setChatList] = useState<ChatData[]>([]);

  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const chatList = await getChatList(accountId);
        console.log('chatList', chatList);
        setChatList(chatList);
      } catch (error) {
        console.error('Failed to fetch chat list:', error);
      }
    };
    fetchChatList();
  }, [accountId]);

  const handlePress = (chatId: string, extraId: string) => {
    navigationApp.navigate('ChatScreen', {
      id: extraId,
      roomId: chatId,
    });
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#E4E1E1FF" />
      <AppBar nameScreen="Tin nhắn" />
      <ScrollView style={styles.container}>
        {chatList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Bạn chưa có cuộc trò chuyện nào
            </Text>
          </View>
        ) : (
          <ChatItemList
            data={chatList}
            onPress={handlePress}
            extraId={accountId}
          />
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 2,
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 400,
    fontSize: 20,
    color: 'black',
    fontFamily: FONTFAMILY.montserat_bold,
  },
});

export default ChatList;
