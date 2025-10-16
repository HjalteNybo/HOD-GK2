import React, { useState } from "react";
import { View, Text, TextInput, Pressable, FlatList } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Styles from "../Styles/ForumStyles";

// Forum-komponenten
export default function Forum() {
    // State til at gemme tekst-inputtet
    const [text, setText] = useState('');
    // State til at gemme listen af opslag
    const [posts, setPosts] = useState([]);

    // Funktion til at tilføje et opslag
    const addPost = () => {
        if (!text.trim()) return;
        setPosts([{ id: Date.now().toString(), content: text }, ...posts]);
        setText('');
    };

    return (
        <SafeAreaView style={Styles.container} edges={['top', 'left', 'right']}>
        <View style={Styles.container}>
            {/* Input felt */}
            <TextInput
                style={Styles.input}
                placeholder="Skriv et opslag..."
                value={text}
                onChangeText={setText}
                multiline
                accessibilityLabel="Skriv et opslag"
            />
            {/* Knap til at tilføje opslag */}
            <Pressable style={Styles.button} onPress={addPost} accessibilityRole="button" accessibilityLabel="Tilføj opslag">
                <Text style={Styles.buttonText}>Tilføj opslag</Text>
            </Pressable>

            {/* Liste med opslag */}
            {posts.length === 0 ? (
                <Text style={Styles.empty}>Ingen opslag endnu...</Text>
            ) : (
                // Viser listen af opslag
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={Styles.post}>
                            <Text style={Styles.postText}>{item.content}</Text>
                        </View>
                    )}
                />
            )}
        </View>
        </SafeAreaView>
    );

};