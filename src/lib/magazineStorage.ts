// Magazine PDF Storage Service
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Upload magazine PDF to Firebase Storage
export async function uploadMagazinePDF(file: File, date: string): Promise<string> {
  const fileName = `magazine_${date}_${Date.now()}.pdf`;
  const storageRef = ref(storage, `magazines/${fileName}`);
  
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  
  return downloadURL;
}

// Delete magazine PDF from Firebase Storage
export async function deleteMagazinePDF(url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting magazine PDF:', error);
    throw error;
  }
}

// Get PDF file extension
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

// Validate PDF file
export function isValidPDFFile(file: File): boolean {
  const validTypes = ['application/pdf'];
  const maxSize = 50 * 1024 * 1024; // 50MB
  
  if (!validTypes.includes(file.type)) {
    return false;
  }
  
  if (file.size > maxSize) {
    return false;
  }
  
  return true;
}
