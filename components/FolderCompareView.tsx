
import React, { useState, useRef } from 'react';
import { 
  Home, 
  FolderOpen, 
  Search, 
  ArrowLeftRight, 
  RefreshCw, 
  MinusCircle, 
  PlusCircle, 
  CheckCircle,
  XCircle,
  Hash
} from 'lucide-react';
import { FileEntry } from '../types';

export const FolderCompareView: React.FC = () => {
  const [leftPath, setLeftPath] = useState('');
  const [rightPath, setRightPath] = useState('');
  const [files, setFiles] = useState<FileEntry[]>([]);
  const leftInputRef = useRef<HTMLInputElement>(null);
  const rightInputRef = useRef<HTMLInputElement>(null);

  const handleFolderSelect = (side: 'left' | 'right', event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    const firstFile = fileList[0];
    // Cast to any to access webkitRelativePath which is non-standard
    const folderPath = (firstFile as any).webkitRelativePath.split('/')[0] || 'Selected Folder';

    if (side === 'left') setLeftPath(folderPath);
    else setRightPath(folderPath);

    // Mock comparison logic:
    // Explicitly type f as any to resolve "Property does not exist on type 'unknown'" errors
    const mockFiles: FileEntry[] = Array.from(fileList).map((f: any) => ({
      name: f.name,
      path: f.webkitRelativePath,
      size: f.size,
      lastModified: f.lastModified,
      isDirectory: false,
    }));
    
    setFiles(prev => [...prev, ...mockFiles].slice(0, 20));
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* View Toolbar */}
      <div className="bg-[#fcfcfc] border-b border-gray-300 p-1 flex items-center gap-1 overflow-x-auto select-none">
        <ToolbarButton icon={<Home size={16} />} label="Home" />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <ToolbarButton icon={<CheckCircle size={16} className="text-blue-600" />} label="All" />
        <ToolbarButton icon={<XCircle size={16} className="text-red-600" />} label="Diffs" />
        <ToolbarButton icon={<CheckCircle size={16} className="text-gray-400" />} label="Same" />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <ToolbarButton icon={<PlusCircle size={16} className="text-green-600" />} label="Expand" />
        <ToolbarButton icon={<MinusCircle size={16} className="text-amber-600" />} label="Collapse" />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <ToolbarButton icon={<RefreshCw size={16} />} label="Refresh" />
        <ToolbarButton icon={<ArrowLeftRight size={16} />} label="Swap" />
      </div>

      {/* Path Bars */}
      <div className="flex border-b border-gray-300 bg-[#f5f5f5]">
        <div className="flex-1 border-r border-gray-300 p-1 flex items-center gap-2">
          <input 
            type="text" 
            value={leftPath} 
            onChange={(e) => setLeftPath(e.target.value)}
            placeholder="Enter path here" 
            className="flex-1 px-2 py-0.5 border border-gray-300 text-xs outline-none focus:border-blue-400" 
          />
          <button onClick={() => leftInputRef.current?.click()} className="p-1 hover:bg-gray-200 rounded">
            <FolderOpen size={14} className="text-amber-600" />
          </button>
          <input 
            ref={leftInputRef}
            type="file" 
            {...({ webkitdirectory: "" } as any)} 
            multiple 
            className="hidden" 
            onChange={(e) => handleFolderSelect('left', e)}
          />
        </div>
        <div className="flex-1 p-1 flex items-center gap-2">
          <input 
            type="text" 
            value={rightPath} 
            onChange={(e) => setRightPath(e.target.value)}
            placeholder="Enter path here" 
            className="flex-1 px-2 py-0.5 border border-gray-300 text-xs outline-none focus:border-blue-400" 
          />
          <button onClick={() => rightInputRef.current?.click()} className="p-1 hover:bg-gray-200 rounded">
            <FolderOpen size={14} className="text-amber-600" />
          </button>
          <input 
            ref={rightInputRef}
            type="file" 
            {...({ webkitdirectory: "" } as any)} 
            multiple 
            className="hidden" 
            onChange={(e) => handleFolderSelect('right', e)}
          />
        </div>
      </div>

      {/* Grid Header */}
      <div className="flex bg-[#f0f0f0] border-b border-gray-300 text-[11px] font-medium text-gray-700 uppercase select-none">
        <div className="flex-1 grid grid-cols-[1fr,80px,120px] border-r border-gray-300">
          <div className="px-2 py-1 border-r border-gray-300">Name</div>
          <div className="px-2 py-1 border-r border-gray-300 text-right">Size</div>
          <div className="px-2 py-1">Modified</div>
        </div>
        <div className="flex-1 grid grid-cols-[1fr,80px,120px]">
          <div className="px-2 py-1 border-r border-gray-300">Name</div>
          <div className="px-2 py-1 border-r border-gray-300 text-right">Size</div>
          <div className="px-2 py-1">Modified</div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
        {files.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 italic">
            Select folders to compare files...
          </div>
        ) : (
          files.map((file, i) => (
            <div key={i} className={`flex text-xs border-b border-gray-100 hover:bg-blue-50 cursor-default ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
              <div className="flex-1 grid grid-cols-[1fr,80px,120px] border-r border-gray-300 items-center">
                <div className="px-2 py-1 truncate flex items-center gap-2">
                  <Hash size={12} className="text-gray-400" />
                  {file.name}
                </div>
                <div className="px-2 py-1 text-right text-gray-500">{(file.size / 1024).toFixed(1)} KB</div>
                <div className="px-2 py-1 text-gray-500">{new Date(file.lastModified).toLocaleDateString()}</div>
              </div>
              <div className="flex-1 grid grid-cols-[1fr,80px,120px] items-center">
                <div className="px-2 py-1 truncate flex items-center gap-2 text-red-600 font-medium">
                   <Hash size={12} className="text-red-400" />
                   {file.name}
                </div>
                <div className="px-2 py-1 text-right text-gray-500">{(file.size / 1024).toFixed(1)} KB</div>
                <div className="px-2 py-1 text-gray-500">{new Date(file.lastModified).toLocaleDateString()}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Log Console */}
      <div className="h-24 bg-[#f8f8f8] border-t border-gray-300 flex flex-col">
        <div className="bg-[#e0e0e0] px-2 py-0.5 text-[10px] text-gray-600 font-bold uppercase border-b border-gray-300">
          Operation Log
        </div>
        <div className="flex-1 p-2 font-mono text-[10px] text-gray-600 overflow-y-auto custom-scrollbar leading-tight">
          {leftPath && `[${new Date().toLocaleTimeString()}] Left path set to: ${leftPath}`}
          <br />
          {rightPath && `[${new Date().toLocaleTimeString()}] Right path set to: ${rightPath}`}
          <br />
          {files.length > 0 && `[${new Date().toLocaleTimeString()}] Found ${files.length} comparison candidates`}
        </div>
      </div>
    </div>
  );
};

const ToolbarButton: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <button className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-200 rounded border border-transparent hover:border-gray-300 transition-colors">
    {icon}
    <span className="text-[11px] text-gray-700">{label}</span>
  </button>
);
