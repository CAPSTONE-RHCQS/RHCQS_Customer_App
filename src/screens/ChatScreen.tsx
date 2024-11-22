import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { HubConnectionBuilder, LogLevel, HubConnection } from '@microsoft/signalr';
import 'react-native-url-polyfill/auto';

const ChatScreen: React.FC = () => {
    const [messages, setMessages] = useState<{ user: string; message: string }[]>([]);
    const [message, setMessage] = useState<string>('');
    const [isConnected, setIsConnected] = useState(false);
    const [connection, setConnection] = useState<HubConnection | null>(null);

    const roomId = '8401DDA8-4779-47F8-A4BD-4ECDB18362DF';
    const accountId = '277EED22-D3B8-4DCB-81A5-8A0E57C48E7B';
    const username = "nganttk002@gmail.com";

    useEffect(() => {
        const connection = new HubConnectionBuilder()
            .withUrl('https://rhqs-fzbda8gefsh7bnft.southeastasia-01.azurewebsites.net/chatHub')
            .configureLogging(LogLevel.Information)
            .withAutomaticReconnect()
            .build();

        const startConnection = async () => {
            try {
                await connection.start();
                console.log('SignalR connected');
                setIsConnected(true);
                setConnection(connection); // Store the connection in the state

                console.log("RoomId - AccountId", roomId, accountId);

                // Join the room using SignalR
                await connection.invoke("JoinRoom", roomId, username);
                console.log('Joined room successfully');
            } catch (err) {
                console.error('SignalR connection or JoinRoom error:', err);
            }
        };

        startConnection();

        // Listening to incoming messages from the SignalR group
        connection.on("ReceiveMessage", (user, message) => {
            console.log("New message received:", user, message);
            setMessages(prev => [...prev, { user, message }]);
        });

        connection.on("UserJoined", (user) => {
            console.log(`${user} has joined the room`);
            setMessages(messages => [...messages, { user: "System", message: `${user} has joined the room.` }]);
        });

        // Cleanup when component unmounts
        return () => {
            connection.stop().then(() => console.log('SignalR disconnected'));
        };
    }, []);

    // Send a message to the SignalR server
    const sendMessage = async () => {
        if (message.trim() && connection) { 
            try {
                await connection.invoke("SendMessageToRoom", roomId, username, message);
                console.log('Message sent:', message);
                setMessage(''); // Clear input field
            } catch (err) {
                console.error('Error sending message:', err);
            }
        }
    };

    return (
        <View style={styles.container}>
            {isConnected ? (
                <>
                    <FlatList
                        data={messages}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <Text style={styles.message}>
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
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    message: {
        fontSize: 16,
        marginBottom: 8,
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
