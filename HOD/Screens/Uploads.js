import React, { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, storage, db } from '../Firebase/FirebaseApp';
import { useAuth } from '../Context/Auth';

export default function Upload({ navigation }) {
  const { user, isStaff } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [msg, setMsg] = useState('');

  if (!user || !isStaff) {
    return (
      <SafeAreaView style={{ flex:1, justifyContent:'center', alignItems:'center', padding:16 }}>
        <Text>Kun personale har adgang til upload.</Text>
      </SafeAreaView>
    );
  }

  const pickAndUpload = async () => {
    console.log('[upload] currentUser', auth.currentUser?.uid);
    setMsg('');
    const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.all, 
        quality: 0.8,
        selectionLimit: 1,
});
    if (res.canceled) return;

    const asset = res.assets[0];
    const isImage = asset.type === 'image';
    const fileUri = asset.uri;
    const ext = isImage ? 'jpg' : 'mp4';
    const year = new Date().getFullYear();
    const uid = user.uid;
    const id = Math.random().toString(36).slice(2, 10);
    const path = `media/${year}/${uid}/${id}.${ext}`;

    try {
      setUploading(true);
      setProgress(0);

      const resp = await fetch(fileUri);
      const blob = await resp.blob();

      console.log('[upload] uid', user?.uid);
    console.log('[upload] path', path);
      const storageRef = ref(storage, path);
      const task = uploadBytesResumable(storageRef, blob);

      task.on('state_changed', (s) => {
        const pct = s.totalBytes ? Math.round((s.bytesTransferred / s.totalBytes) * 100) : 0;
        setProgress(pct);
      });

      await task;
      const downloadURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'media'), {
        downloadURL,
        type: isImage ? 'image' : 'video',
        uploadedAt: serverTimestamp(),
        uploadedByUid: uid,
        uploadedByEmail: user.email || null,
        caption: '',
        consent: true,
        visible: true,
      });

      setMsg('Upload gennemført ✔');
      setUploading(false);
      setProgress(100);
    } catch (e) {
      console.error(e);
      setMsg('Noget gik galt under upload.');
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex:1, padding:16 }}>
      <Text style={{ fontSize:22, fontWeight:'800', marginBottom:12 }}>Upload filer</Text>

      <Pressable
        onPress={pickAndUpload}
        disabled={uploading}
        style={({pressed}) => [{ backgroundColor:'#3E6B39', padding:14, borderRadius:14, alignItems:'center', opacity: uploading ? 0.6 : 1 }, pressed && {opacity:0.9}]}
      >
        <Text style={{ color:'#fff', fontWeight:'800' }}>{uploading ? 'Uploader…' : 'Vælg billede/video'}</Text>
      </Pressable>

      {uploading && (
        <View style={{ marginTop:12, alignItems:'center' }}>
          <ActivityIndicator />
          <Text style={{ marginTop:8 }}>{progress}%</Text>
        </View>
      )}

      {!!msg && <Text style={{ marginTop:12 }}>{msg}</Text>}

      <Pressable
        onPress={() => navigation.goBack()}
        style={({pressed}) => [{ marginTop:24, backgroundColor:'#F28C38', padding:12, borderRadius:12, alignItems:'center' }, pressed && {opacity:0.9}]}
      >
        <Text style={{ color:'#fff', fontWeight:'700' }}>Tilbage</Text>
      </Pressable>
    </SafeAreaView>
  );
}