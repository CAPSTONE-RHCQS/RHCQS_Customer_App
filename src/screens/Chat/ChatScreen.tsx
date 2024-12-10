import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  HubConnectionBuilder,
  LogLevel,
  HubConnection,
} from '@microsoft/signalr';
import 'react-native-url-polyfill/auto';
import {useRoute} from '@react-navigation/native';
import {AppStackParamList} from '../../types/TypeScreen';
import {RouteProp} from '@react-navigation/native';
import {getProfile} from '../../api/Account/Account';
import AppBar from '../../components/Appbar';
import {getChatDetail} from '../../api/Chat/Chat';
import {FONTFAMILY} from '../../theme/theme';
import {ChatDetail} from '@/types/screens/Chat/Chat';

const ChatScreen: React.FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'ChatScreen'>>();
  const {id, roomId} = route.params;
  const [messages, setMessages] = useState<{user: string; message: string}[]>(
    [],
  );
  const [sender, setSender] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [customerName, setCustomerName] = useState<string>('');
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isProfileFetched, setIsProfileFetched] = useState(false);

  const flatListRef = useRef<FlatList<{user: string; message: string}> | null>(null);

  useEffect(() => {
    const fetchChatDetail = async () => {
      const chatDetailResponse = await getChatDetail(roomId);
      console.log('chatDetail', JSON.stringify(chatDetailResponse, null, 2));
      const formattedMessages = chatDetailResponse.MessageRooms.map(msg => ({
        user: msg.UserName,
        message: msg.MessageContext,
        sendAt: new Date(msg.SendAt),
      }));
      formattedMessages.sort((a, b) => a.sendAt.getTime() - b.sendAt.getTime());
      setMessages(formattedMessages);
      setSender(formattedMessages[0].user);
      flatListRef.current?.scrollToEnd({animated: true});
    };
    fetchChatDetail();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        setCustomerName(profile.Username);
        setIsProfileFetched(true);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setIsProfileFetched(true);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!isProfileFetched) return;

    const connection = new HubConnectionBuilder()
      .withUrl(
        'https://rhcqs-b4brchgaeqb9abd5.southeastasia-01.azurewebsites.net/chatHub',
      )
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    const startConnection = async () => {
      try {
        await connection.start();
        console.log('SignalR connected');
        setIsConnected(true);
        setConnection(connection);

        console.log('RoomId - AccountId', roomId, id);

        await connection.invoke('JoinRoom', roomId, customerName);
        console.log('Joined room successfully');
      } catch (err) {
        console.error('SignalR connection or JoinRoom error:', err);
      }
    };

    startConnection();

    connection.on('ReceiveMessage', (user, userId, message, roomId) => {
      console.log('New message received:', user, message, roomId);
      setMessages(prev => {
        const updatedMessages = [...prev, {user, message}];
        flatListRef.current?.scrollToEnd({animated: true});
        return updatedMessages;
      });
    });

    connection.on('UserJoined', () => {
      setMessages(messages => [...messages]);
    });

    return () => {
      connection.stop().then(() => console.log('SignalR disconnected'));
    };
  }, [isProfileFetched]);

  const sendMessage = async () => {
    if (message.trim() && connection) {
      try {
        await connection.invoke(
          'SendMessageToRoom',
          roomId,
          customerName,
          message,
        );
        console.log('Message sent:', message);
        setMessage('');
      } catch (err) {
        console.error('Error sending message:', err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <AppBar nameScreen="Tin nhắn" />
      <View style={styles.content}>
        {isConnected ? (
          <>
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <Text
                  style={[
                    styles.message,
                    item.user === customerName
                      ? styles.sentMessage
                      : styles.receivedMessage,
                  ]}>
                  {item.message}
                </Text>
              )}
            />
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message..."
              />
              <TouchableOpacity onPress={sendMessage}>
                <Image
                  source={require('../../assets/image/icon/send.png')}
                  style={styles.sendButton}
                />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text>Connecting to chat...</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  message: {
    fontSize: 14,
    marginBottom: 8,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
    fontFamily: FONTFAMILY.montserat_medium,
    color: 'black',
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    fontFamily: FONTFAMILY.montserat_medium,
    color: 'black',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
    fontFamily: FONTFAMILY.montserat_medium,
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    fontFamily: FONTFAMILY.montserat_medium,
    color: 'black',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 50,
    fontFamily: FONTFAMILY.montserat_medium,
    color: 'black',
    padding: 8,
    marginRight: 8,
  },
  sendButton: {
    width: 30,
    height: 30,
  },
});

export default ChatScreen;
