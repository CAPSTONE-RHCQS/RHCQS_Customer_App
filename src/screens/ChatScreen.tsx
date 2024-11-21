import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

const ChatScreen: React.FC = () => {
    const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<{ user: string; message: string }[]>([]);
    const [message, setMessage] = useState<string>('');
    const [isConnected, setIsConnected] = useState(false);

    const roomId = '8401DDA8-4779-47F8-A4BD-4ECDB18362DF';
    const accountId = 'BFA97975-1915-46A0-B185-ED881C8C953F';

    useEffect(() => {
        // Create a new WebSocket connection
        const ws = new WebSocket(
            `wss://rhqs-fzbda8gefsh7bnft.southeastasia-01.azurewebsites.net/chatHub`,
        );

        ws.onopen = () => {
            console.log('WebSocket connected');
            setIsConnected(true);

            // Join the room after connecting
            const joinMessage = {
                type: 'join',
                roomId,
                accountId,
            };
            ws.send(JSON.stringify(joinMessage));
        };

        ws.onmessage = (event) => {
            console.log('Received data:', event.data);  // Log dữ liệu nhận được
        
            try {
                const data = JSON.parse(event.data);
        
                // Handle incoming messages
                if (data.type === 'message') {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { user: data.user, message: data.message },
                    ]);
                } else if (data.type === 'system') {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        { user: 'System', message: data.message },
                    ]);
                }
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
            setIsConnected(false);
        };

        setWebSocket(ws);

        return () => {
            // Cleanup WebSocket connection
            ws.close();
        };
    }, []);

    const sendMessage = () => {
        if (webSocket && message.trim()) {
            const messagePayload = {
                type: 'message',
                roomId,
                user: 'Staff',
                message,
            };

            webSocket.send(JSON.stringify(messagePayload));

            setMessages((prevMessages) => [...prevMessages, { user: 'Staff', message }]);
            setMessage('');
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
