
export enum SessionType {
  FOLDER_COMPARE = 'Folder Compare',
  FOLDER_MERGE = 'Folder Merge',
  FOLDER_SYNC = 'Folder Sync',
  TEXT_COMPARE = 'Text Compare',
  TEXT_MERGE = 'Text Merge',
  TEXT_EDIT = 'Text Edit',
  HEX_COMPARE = 'Hex Compare',
  MEDIA_COMPARE = 'Media Compare',
  PICTURE_COMPARE = 'Picture Compare',
  TABLE_COMPARE = 'Table Compare',
  FILE_CONVERT = 'File Convert',
  BATCH_PROCESS = 'Batch Process',
}

export interface FileEntry {
  name: string;
  path: string;
  size: number;
  lastModified: number;
  isDirectory: boolean;
  content?: string;
}

export interface ComparisonResult {
  leftOnly: FileEntry[];
  rightOnly: FileEntry[];
  bothSame: FileEntry[];
  bothDifferent: FileEntry[];
}
