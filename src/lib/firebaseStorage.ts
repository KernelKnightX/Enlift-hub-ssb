import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function uploadImage(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}

export async function uploadPPDTImage(file: File, setId: string, imageIndex: number): Promise<string> {
  const fileName = `${setId}_${imageIndex}_${Date.now()}.${file.name.split('.').pop()}`;
  const path = `ppdt/${setId}/${fileName}`;
  return uploadImage(file, path);
}

export async function uploadTATImage(file: File, setId: string, imageIndex: number): Promise<string> {
  const fileName = `${setId}_${imageIndex}_${Date.now()}.${file.name.split('.').pop()}`;
  const path = `tat/${setId}/${fileName}`;
  return uploadImage(file, path);
}
