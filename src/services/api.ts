/**
 * API service for communicating with the backend
 */

// Using Vite's proxy feature to avoid CORS issues in development
const API_BASE_URL = '/api';

/**
 * Upload and validate a file
 * @param file The file to upload
 * @returns Promise with the validation results
 */
export const uploadAndValidateFile = async (file: File): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload-data`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload file');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
