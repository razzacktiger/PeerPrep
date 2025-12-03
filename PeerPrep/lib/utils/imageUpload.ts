/**
 * Image Upload Utility
 * 
 * Handles profile picture uploads to Supabase Storage
 */

import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../supabase';

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
const STORAGE_BUCKET = 'avatars';

/**
 * Check if media library permissions are granted (without requesting)
 */
export async function checkImagePermissions(): Promise<boolean> {
  const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
  return status === 'granted';
}

/**
 * Request camera roll permissions
 */
export async function requestImagePermissions(): Promise<boolean> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  if (status !== 'granted') {
    return false;
  }
  
  return true;
}

/**
 * Request camera permissions
 */
export async function requestCameraPermissions(): Promise<boolean> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  
  if (status !== 'granted') {
    return false;
  }
  
  return true;
}

/**
 * Pick an image from the camera roll
 */
export async function pickImage(): Promise<ImagePicker.ImagePickerResult | null> {
  const hasPermission = await requestImagePermissions();
  
  if (!hasPermission) {
    // Permission was denied - return null to let caller handle it
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: 'images',
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  return result;
}

/**
 * Take a photo with the camera
 */
export async function takePhoto(): Promise<ImagePicker.ImagePickerResult | null> {
  const hasPermission = await requestCameraPermissions();
  
  if (!hasPermission) {
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  return result;
}

/**
 * Validate image file
 */
function validateImage(uri: string, fileSize?: number): { valid: boolean; error?: string } {
  // Check file size if provided
  if (fileSize && fileSize > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds 2MB limit. Please choose a smaller image.`,
    };
  }

  // Extract file extension
  const extension = uri.split('.').pop()?.toLowerCase();
  if (!extension) {
    return { valid: false, error: 'Invalid file format' };
  }

  // Check if extension is allowed
  const mimeType = `image/${extension === 'jpg' ? 'jpeg' : extension}`;
  if (!ALLOWED_TYPES.includes(mimeType)) {
    return {
      valid: false,
      error: 'Invalid file type. Please use JPG, PNG, or GIF.',
    };
  }

  return { valid: true };
}

/**
 * Upload image to Supabase Storage
 */
export async function uploadProfileImage(
  userId: string,
  imageUri: string
): Promise<ImageUploadResult> {
  try {
    // Validate image
    const validation = validateImage(imageUri);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Get file extension
    const extension = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${userId}-${Date.now()}.${extension}`;
    const filePath = `${userId}/${fileName}`;

    // Fetch the image file
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Check blob size
    if (blob.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: 'File size exceeds 2MB limit. Please choose a smaller image.',
      };
    }

    // Convert blob to ArrayBuffer
    const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, arrayBuffer, {
        contentType: blob.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { success: false, error: uploadError.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      return { success: false, error: 'Failed to get public URL' };
    }

    return { success: true, url: urlData.publicUrl };
  } catch (error: any) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload image. Please try again.',
    };
  }
}

/**
 * Delete old profile image from storage
 */
export async function deleteProfileImage(avatarUrl: string): Promise<void> {
  try {
    // Extract file path from URL
    // URL format: https://{project}.supabase.co/storage/v1/object/public/avatars/{path}
    const urlParts = avatarUrl.split('/storage/v1/object/public/avatars/');
    if (urlParts.length !== 2) {
      console.warn('Invalid avatar URL format:', avatarUrl);
      return;
    }

    const filePath = urlParts[1];

    // Delete from storage
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting old avatar:', error);
    }
  } catch (error) {
    console.error('Error deleting old avatar:', error);
  }
}

/**
 * Complete workflow: pick image, upload, and get URL
 */
export async function pickAndUploadProfileImage(
  userId: string,
  oldAvatarUrl?: string | null
): Promise<ImageUploadResult> {
  try {
    // Pick image
    const result = await pickImage();

    if (!result) {
      return { success: false, error: 'Permission denied. Please grant photo library access in your device settings.' };
    }

    if (result.canceled) {
      return { success: false, error: 'Image selection cancelled' };
    }

    const asset = result.assets[0];
    if (!asset.uri) {
      return { success: false, error: 'No image selected' };
    }

    // Upload new image
    const uploadResult = await uploadProfileImage(userId, asset.uri);

    // If upload successful and there's an old avatar, delete it
    if (uploadResult.success && oldAvatarUrl) {
      await deleteProfileImage(oldAvatarUrl);
    }

    return uploadResult;
  } catch (error: any) {
    console.error('Error in pick and upload workflow:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload image',
    };
  }
}
