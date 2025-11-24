import * as FileSystemLegacy from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { getAllEmotionRecords } from './database';

export const exportDataToJSON = async () => {
  try {
    const records = await getAllEmotionRecords();
    
    if (records.length === 0) {
      alert('No data to export!');
      return null;
    }
    
    const jsonData = JSON.stringify(records, null, 2);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `emogo_data_${timestamp}.json`;
    const filePath = `${FileSystemLegacy.documentDirectory || ''}${fileName}`;
    
    await FileSystemLegacy.writeAsStringAsync(filePath, jsonData);
    
    console.log('Data exported to:', filePath);
    return filePath;
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
};

export const shareExportedData = async (filePath: string) => {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    
    if (!isAvailable) {
      alert('Sharing is not available on this device');
      return false;
    }
    
    await Sharing.shareAsync(filePath, {
      mimeType: 'application/json',
      dialogTitle: 'Export EmoGo Data',
      UTI: 'public.json',
    });
    
    return true;
  } catch (error) {
    console.error('Error sharing data:', error);
    return false;
  }
};

export const exportAndShareData = async () => {
  try {
    const filePath = await exportDataToJSON();
    if (filePath) {
      await shareExportedData(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error in export and share:', error);
    alert('Failed to export data: ' + (error as Error).message);
    return false;
  }
};

export const createDataFolder = async () => {
  try {
    const dataFolderPath = `${FileSystemLegacy.documentDirectory || ''}data/`;
    const folderInfo = await FileSystemLegacy.getInfoAsync(dataFolderPath);
    
    if (!folderInfo.exists) {
      await FileSystemLegacy.makeDirectoryAsync(dataFolderPath, { intermediates: true });
      console.log('Data folder created at:', dataFolderPath);
    }
    
    return dataFolderPath;
  } catch (error) {
    console.error('Error creating data folder:', error);
    throw error;
  }
};

export const saveDataToFolder = async () => {
  try {
    const records = await getAllEmotionRecords();
    
    if (records.length === 0) {
      alert('No data to save!');
      return null;
    }
    
    const dataFolderPath = await createDataFolder();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `emogo_export_${timestamp}.json`;
    const filePath = `${dataFolderPath}${fileName}`;
    
    const jsonData = JSON.stringify(records, null, 2);
    await FileSystemLegacy.writeAsStringAsync(filePath, jsonData);
    
    console.log('Data saved to folder:', filePath);
    return filePath;
  } catch (error) {
    console.error('Error saving data to folder:', error);
    throw error;
  }
};
