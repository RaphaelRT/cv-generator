export const validateFile = (file: any): string | null => {
    const maxSize = 1 * 1024 * 1024;
  
    if (file.size > maxSize) {
      return 'File must not exceed 1MB.';
    }
  
    if (file.mimetype !== 'application/json') {
      return 'Please upload a valid JSON file.';
    }
  
    return null;
  };
  