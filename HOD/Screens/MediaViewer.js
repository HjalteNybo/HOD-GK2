import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';

export default function MediaViewer({ route }) {
  const media = route?.params?.media;
  if (!media?.downloadURL) {
    return (
      <View style={s.center}><Text>Intet medie fundet.</Text></View>
    );
  }

  const isVideo = media.type === 'video';

  // Opret videoafspilleren når URL'en ændrer sig
  const player = useVideoPlayer(media.downloadURL, (p) => {
    p.play(); // autoplay i viewer
  });

  const dateStr = media.uploadedAtMillis
    ? new Date(media.uploadedAtMillis).toLocaleString()
    : '';

  return (
    <ScrollView contentContainerStyle={s.container}>
      <View style={s.mediaBox}>
        {isVideo ? (
          <VideoView
            style={s.media}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
            contentFit="contain"
          />
        ) : (
          <Image
            source={{ uri: media.downloadURL }}
            style={s.media}
            resizeMode="contain"
            accessible
            accessibilityLabel={media.caption || 'Billede'}
          />
        )}
      </View>

      {!!media.caption && (
        <Text style={s.caption}>{media.caption}</Text>
      )}
      <Text style={s.meta}>
        {media.uploadedByEmail ? `Uploadet af ${media.uploadedByEmail}` : 'Uploadet'}
        {dateStr ? ` — ${dateStr}` : ''}
      </Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  mediaBox: { borderRadius: 16, overflow: 'hidden', backgroundColor: '#000' },
  media: { width: '100%', height: 320 },
  caption: { marginTop: 12, fontSize: 16 },
  meta: { marginTop: 6, color: '#64748B' },
});