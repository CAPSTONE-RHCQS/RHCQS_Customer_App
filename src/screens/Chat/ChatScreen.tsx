import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
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

const ChatScreen: React.FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'ChatScreen'>>();
  const {id, roomId} = route.params;
  const [messages, setMessages] = useState<{user: string; message: string}[]>(
    [],
  );
  const [message, setMessage] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [customerName, setCustomerName] = useState<string>('');
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isProfileFetched, setIsProfileFetched] = useState(false);

  useEffect(() => {
    const fetchChatDetail = async () => {
      const chatDetail = await getChatDetail(roomId);
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
        setConnection(connection); // Store the connection in the state

        console.log('RoomId - AccountId', roomId, id);

        // Join the room using SignalR
        await connection.invoke('JoinRoom', roomId, customerName);
        console.log('Joined room successfully');
      } catch (err) {
        console.error('SignalR connection or JoinRoom error:', err);
      }
    };

    startConnection();

    // Listening to incoming messages from the SignalR group
    connection.on('ReceiveMessage', (user, userId, message, roomId) => {
      console.log('New message received:', user, message, roomId);
      setMessages(prev => [...prev, {user, message}]);
    });

    connection.on('UserJoined', user => {
      console.log(`${user} has joined the room`);
      setMessages(messages => [
        ...messages,
        {user: 'System', message: `${user} has joined the room.`},
      ]);
    });

    // Cleanup when component unmounts
    return () => {
      connection.stop().then(() => console.log('SignalR disconnected'));
    };
  }, [isProfileFetched]);

  // Send a message to the SignalR server
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
        setMessage(''); // Clear input field
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
                  {item.user}: {item.message}
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
              <Button title="Send" onPress={sendMessage} />
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
    fontSize: 16,
    marginBottom: 8,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
});

export default ChatScreen;
