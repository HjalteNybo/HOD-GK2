import React, { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, Alert, Linking, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../Firebase/FirebaseApp';
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
    setMsg('');
    console.log('[UPLOAD-DIAG] === START UPLOAD (REST) ===');
    try {
      // --- 1) Permissions ---
      const existing = await ImagePicker.getMediaLibraryPermissionsAsync();
      console.log('[UPLOAD-DIAG] perm existing:', existing);
      let granted = existing?.granted === true;
      if (!granted) {
        const req = await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log('[UPLOAD-DIAG] perm requested:', req);
        granted = req?.granted === true;
      }
      if (!granted) {
        Alert.alert('Adgang nødvendig', 'Giv adgang til Fotos for at vælge billede/video.', [
          { text: 'Annullér', style: 'cancel' },
          { text: 'Åbn indstillinger', onPress: () => Linking.openSettings() },
        ]);
        return;
      }

      // --- 2) Vælg medie (brug ny API hvis muligt) ---
      let mediaTypes;
      if (ImagePicker?.MediaType) {
        // ny API
        const img = ImagePicker.MediaType.images ?? ImagePicker.MediaType.image;
        const vid = ImagePicker.MediaType.videos ?? ImagePicker.MediaType.video;
        mediaTypes = [img, vid];
        console.log('[UPLOAD-DIAG] using NEW MediaType API:', mediaTypes);
      } else {
        // fallback (kan give warning, men fungerer)
        mediaTypes = ImagePicker.MediaTypeOptions.All;
        console.log('[UPLOAD-DIAG] using OLD MediaTypeOptions API: All');
      }

      console.log('[UPLOAD-DIAG] opening picker…');
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes, quality: 0.85 });
      if (!res || res.canceled || !res.assets?.length) {
        setMsg('Ingen fil valgt.');
        console.log('[UPLOAD-DIAG] picker canceled/empty');
        return;
      }

      const asset = res.assets[0];
      console.log('[UPLOAD-DIAG] asset:', {
        uri: asset.uri,
        type: asset.type,
        mimeType: asset.mimeType,
        width: asset.width,
        height: asset.height,
        fileSize: asset.fileSize,
      });

      // --- 3) Metadata / sti ---
      const isImage = asset.type === 'image';
      const fileUri = asset.uri;
      const mime = asset.mimeType || (isImage ? 'image/jpeg' : 'video/mp4');

      let ext = 'bin';
      if (mime.includes('jpeg') || mime.includes('jpg')) ext = 'jpg';
      else if (mime.includes('png')) ext = 'png';
      else if (mime.includes('heic')) ext = 'heic';
      else if (mime.includes('mp4')) ext = 'mp4';
      else if (mime.includes('quicktime') || mime.includes('mov')) ext = 'mov';

      const year = new Date().getFullYear();
      const uid  = user.uid;
      const id   = Math.random().toString(36).slice(2, 10);
      const path = `media/${year}/${uid}/${id}.${ext}`;

      console.log('[UPLOAD-DIAG] asset size from picker:', asset.fileSize);
      console.log('[UPLOAD-DIAG] computed path:', path, 'mime=', mime);

      // --- 4) Forbered REST-upload ---
      const bucket = 'hod-festival-93df0.firebasestorage.app';
      const url = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o?name=${encodeURIComponent(path)}`;

      const currentUser = auth.currentUser;
      if (!currentUser) {
        setMsg('Ingen bruger er logget ind.');
        console.log('[UPLOAD-DIAG] no auth.currentUser');
        return;
      }

      setUploading(true);
      setProgress(1);

      const token = await currentUser.getIdToken();
      console.log('[UPLOAD-DIAG] got idToken len=', token?.length);

      const options = {
        httpMethod: 'POST',
        headers: {
          'Content-Type': mime,
          // VIGTIGT: Firebase Storage REST accepterer ID Token i dette format
          'Authorization': `Firebase ${token}`,
        },
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      };

      console.log('[UPLOAD-DIAG] REST upload →', url, 'mime=', mime);

      // Brug createUploadTask for at få progress callbacks
      const task = FileSystem.createUploadTask(
        url,
        fileUri,
        options,
        (p) => {
          try {
            const pct = p.totalBytesExpectedToSend
              ? Math.max(1, Math.round((p.totalBytesSent / p.totalBytesExpectedToSend) * 100))
              : 0;
            setProgress(pct);
            if (pct % 10 === 0) {
              console.log(`[UPLOAD-DIAG] REST progress ${pct}% (${p.totalBytesSent}/${p.totalBytesExpectedToSend})`);
            }
          } catch {}
        }
      );

      const up = await task.uploadAsync();
      console.log('[UPLOAD-DIAG] REST status=', up.status);

      if (up.status < 200 || up.status >= 300) {
        console.log('[UPLOAD-DIAG] REST body (err)=', up.body?.slice(0, 400));
        throw new Error(`REST upload fejlede (status ${up.status})`);
      }

      // --- 5) Parse svar & lav downloadURL ---
      const meta = JSON.parse(up.body);
      console.log('[UPLOAD-DIAG] REST meta keys=', Object.keys(meta));

      let downloadURL;
      if (meta.downloadTokens) {
        downloadURL = `https://firebasestorage.googleapis.com/v0/b/${meta.bucket}/o/${encodeURIComponent(meta.name)}?alt=media&token=${meta.downloadTokens}`;
      } else {
        // fallback – kræver at filen må læses (ellers hent via SDK senere)
        downloadURL = `https://firebasestorage.googleapis.com/v0/b/${meta.bucket}/o/${encodeURIComponent(meta.name)}?alt=media`;
      }

      setProgress(90);

      // --- 6) Gem metadata i Firestore ---
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

      setProgress(100);
      setMsg('Upload gennemført ✔');
      console.log('[UPLOAD-DIAG] DONE. downloadURL=', downloadURL);
    } catch (e) {
      console.log('[UPLOAD-DIAG] ERROR:', e?.message || e);
      setMsg('Noget gik galt under upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex:1, padding:16 }}>
      <Text style={{ fontSize:22, fontWeight:'800', marginBottom:12 }}>Upload filer</Text>

      <Pressable
        onPress={pickAndUpload}
        disabled={uploading}
        style={({pressed}) => [
          { backgroundColor:'#3E6B39', padding:14, borderRadius:14, alignItems:'center', opacity: uploading ? 0.6 : 1 },
          pressed && { opacity:0.9 }
        ]}
      >
        <Text style={{ color:'#fff', fontWeight:'800' }}>
          {uploading ? `Uploader… ${progress}%` : 'Vælg billede/video'}
        </Text>
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
        style={({pressed}) => [
          { marginTop:24, backgroundColor:'#F28C38', padding:12, borderRadius:12, alignItems:'center' },
          pressed && { opacity:0.9 }
        ]}
      >
        <Text style={{ color:'#fff', fontWeight:'700' }}>Tilbage</Text>
      </Pressable>
    </SafeAreaView>
  );
}