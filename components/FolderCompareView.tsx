
import React, { useState, useRef } from 'react';
import { 
  Home, 
  FolderOpen, 
  ArrowLeftRight, 
  RefreshCw, 
  MinusCircle, 
  PlusCircle, 
  CheckCircle,
  XCircle,
  Hash,
  ArrowRight,
  ArrowLeft,
  Upload,
  Zap,
  ChevronDown
} from 'lucide-react';
import { FileEntry } from '../types';

interface CompareRow extends FileEntry {
  status: 'same' | 'diff' | 'left-only' | 'right-only';
}

type SyncDirection = 'ltr' | 'rtl' | 'both';

export const FolderCompareView: React.FC = () => {
  const [leftPath, setLeftPath] = useState('');
  const [rightPath, setRightPath] = useState('');
  const [rows, setRows] = useState<CompareRow[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSyncMenu, setShowSyncMenu] = useState(false);
  const leftInputRef = useRef<HTMLInputElement>(null);
  const rightInputRef = useRef<HTMLInputElement>(null);

  const handleFolderSelect = (side: 'left' | 'right', event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    const firstFile = fileList[0];
    const folderPath = (firstFile as any).webkitRelativePath.split('/')[0] || 'Selected Folder';

    if (side === 'left') setLeftPath(folderPath);
    else setRightPath(folderPath);

    const mockRows: CompareRow[] = Array.from(fileList).map((f: any, idx) => ({
      name: f.name,
      path: f.webkitRelativePath,
      size: f.size,
      lastModified: f.lastModified,
      isDirectory: false,
      status: idx % 4 === 0 ? 'diff' : idx % 6 === 0 ? 'left-only' : idx % 7 === 0 ? 'right-only' : 'same'
    }));
    
    setRows(prev => [...prev, ...mockRows].slice(0, 30));
  };

  const handleTransfer = (index: number, direction: 'ltr' | 'rtl') => {
    setRows(prev => {
      const next = [...prev];
      // Simulate sync for a single file
      next[index] = { ...next[index], status: 'same' };
      return next;
    });
  };

  const runGlobalSync = async (direction: SyncDirection) => {
    if (rows.length === 0) return;
    setIsSyncing(true);
    setShowSyncMenu(false);

    // Simulate progress
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].status !== 'same') {
        await new Promise(r => setTimeout(r, 50));
        setRows(prev => {
          const next = [...prev];
          next[i] = { ...next[i], status: 'same' };
          return next;
        });
      }
    }
    
    setIsSyncing(false);
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* View Toolbar */}
      <div className="bg-[#fcfcfc] border-b border-gray-300 p-1 flex items-center gap-1 overflow-x-auto select-none">
        <ToolbarButton icon={<Home size={16} />} label="Home" />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <ToolbarButton icon={<CheckCircle size={16} className="text-blue-600" />} label="All" />
        <ToolbarButton icon={<XCircle size={16} className="text-red-600" />} label="Diffs" />
        <ToolbarButton icon={<CheckCircle size={16} className="text-gray-400" />} label="Same" />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        
        {/* Sync Dropdown Button */}
        <div className="relative">
          <button 
            onClick={() => setShowSyncMenu(!showSyncMenu)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded border border-transparent transition-colors ${
              rows.length === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-blue-600 hover:text-white group'
            }`}
            disabled={rows.length === 0}
          >
            <Zap size={16} className={rows.length > 0 ? "text-amber-500 group-hover:text-white" : ""} />
            <span className="text-[11px] font-medium">Sync Folder</span>
            <ChevronDown size={12} />
          </button>

          {showSyncMenu && (
            <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-300 shadow-xl rounded z-50 py-1 select-none">
              <SyncOption 
                icon={<ArrowRight size={14} className="text-blue-600" />} 
                title="Update Right" 
                desc="Copy new/changed from Left to Right"
                onClick={() => runGlobalSync('ltr')}
              />
              <SyncOption 
                icon={<ArrowLeft size={14} className="text-red-600" />} 
                title="Update Left" 
                desc="Copy new/changed from Right to Left"
                onClick={() => runGlobalSync('rtl')}
              />
              <SyncOption 
                icon={<ArrowLeftRight size={14} className="text-purple-600" />} 
                title="Two-way Sync" 
                desc="Keep newest version on both sides"
                onClick={() => runGlobalSync('both')}
              />
              <div className="border-t border-gray-100 mt-1 pt-1 px-3 py-1 text-[10px] text-gray-400">
                Sync settings can be adjusted in Tools > Options
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <ToolbarButton icon={<RefreshCw size={16} />} label="Refresh" />
        <ToolbarButton icon={<ArrowLeftRight size={16} />} label="Swap" />
      </div>

      {/* Path Bars */}
      <div className="flex border-b border-gray-300 bg-[#f5f5f5] p-1 gap-1">
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-300 rounded px-2 py-0.5">
          <Upload size={14} className="text-gray-400" />
          <input 
            type="text" 
            value={leftPath} 
            onChange={(e) => setLeftPath(e.target.value)}
            placeholder="Path to left folder..." 
            className="flex-1 text-xs outline-none bg-transparent" 
          />
          <button 
            onClick={() => leftInputRef.current?.click()} 
            className="p-1 hover:bg-gray-100 rounded text-amber-600 flex items-center gap-1 text-[10px] font-bold"
          >
            <FolderOpen size={14} />
            BROWSE
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

        <div className="flex items-center px-1">
           <ArrowLeftRight size={14} className="text-gray-400" />
        </div>

        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-300 rounded px-2 py-0.5">
          <Upload size={14} className="text-gray-400" />
          <input 
            type="text" 
            value={rightPath} 
            onChange={(e) => setRightPath(e.target.value)}
            placeholder="Path to right folder..." 
            className="flex-1 text-xs outline-none bg-transparent" 
          />
          <button 
            onClick={() => rightInputRef.current?.click()} 
            className="p-1 hover:bg-gray-100 rounded text-amber-600 flex items-center gap-1 text-[10px] font-bold"
          >
            <FolderOpen size={14} />
            BROWSE
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
      <div className="flex bg-[#f0f0f0] border-b border-gray-300 text-[10px] font-bold text-gray-500 uppercase select-none">
        <div className="flex-1 grid grid-cols-[1fr,70px,110px] border-r border-gray-300">
          <div className="px-3 py-1.5 border-r border-gray-300">Left Side Name</div>
          <div className="px-2 py-1.5 border-r border-gray-300 text-right">Size</div>
          <div className="px-2 py-1.5">Modified</div>
        </div>
        
        <div className="w-20 bg-[#e8e8e8] border-r border-gray-300 text-center py-1.5 flex items-center justify-center">
           SYNC STATUS
        </div>

        <div className="flex-1 grid grid-cols-[1fr,70px,110px]">
          <div className="px-3 py-1.5 border-r border-gray-300">Right Side Name</div>
          <div className="px-2 py-1.5 border-r border-gray-300 text-right">Size</div>
          <div className="px-2 py-1.5">Modified</div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
        {isSyncing && (
          <div className="absolute inset-0 bg-white/40 flex items-center justify-center z-40 backdrop-blur-[1px]">
             <div className="bg-white p-6 border border-gray-300 shadow-2xl rounded-lg flex flex-col items-center max-w-sm w-full">
                <Zap size={32} className="text-amber-500 animate-pulse mb-3" />
                <h3 className="font-bold text-gray-800 mb-1">Synchronizing Folders...</h3>
                <p className="text-xs text-gray-500 mb-4 text-center">Applying sync strategy and mirroring file states.</p>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden border border-gray-200">
                   <div className="bg-blue-600 h-full animate-progress-indeterminate"></div>
                </div>
             </div>
          </div>
        )}

        {rows.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-300 italic p-10 text-center">
            <FolderOpen size={48} className="mb-2 opacity-20" />
            <p>Load folders to compare and synchronize content.</p>
          </div>
        ) : (
          rows.map((row, i) => (
            <div key={i} className={`flex text-xs border-b border-gray-100 hover:bg-blue-50/50 group cursor-default ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
              <div className={`flex-1 grid grid-cols-[1fr,70px,110px] border-r border-gray-300 items-center ${row.status === 'right-only' ? 'opacity-30' : ''}`}>
                <div className={`px-3 py-1 truncate flex items-center gap-2 ${row.status === 'diff' ? 'text-red-600 font-bold' : row.status === 'left-only' ? 'text-blue-600 font-bold' : 'text-gray-700'}`}>
                  <Hash size={12} className="opacity-40" />
                  {row.status === 'right-only' ? '—' : row.name}
                </div>
                <div className="px-2 py-1 text-right text-gray-500 font-mono text-[10px]">{row.status === 'right-only' ? '' : (row.size / 1024).toFixed(1) + 'K'}</div>
                <div className="px-2 py-1 text-gray-400 text-[10px]">{row.status === 'right-only' ? '' : new Date(row.lastModified).toLocaleDateString()}</div>
              </div>

              <div className="w-20 bg-[#f8f8f8] border-r border-gray-300 flex items-center justify-center gap-1.5 group-hover:bg-blue-100 transition-colors">
                 {row.status === 'diff' && (
                    <div className="flex gap-0.5">
                      <SyncArrow direction="ltr" onClick={() => handleTransfer(i, 'ltr')} color="text-blue-500" />
                      <SyncArrow direction="rtl" onClick={() => handleTransfer(i, 'rtl')} color="text-red-500" />
                    </div>
                 )}
                 {row.status === 'left-only' && <SyncArrow direction="ltr" onClick={() => handleTransfer(i, 'ltr')} color="text-blue-600" />}
                 {row.status === 'right-only' && <SyncArrow direction="rtl" onClick={() => handleTransfer(i, 'rtl')} color="text-green-600" />}
                 {row.status === 'same' && <CheckCircle size={12} className="text-gray-300" />}
              </div>

              <div className={`flex-1 grid grid-cols-[1fr,70px,110px] items-center ${row.status === 'left-only' ? 'opacity-30' : ''}`}>
                <div className={`px-3 py-1 truncate flex items-center gap-2 ${row.status === 'diff' ? 'text-red-600 font-bold' : row.status === 'right-only' ? 'text-green-600 font-bold' : 'text-gray-700'}`}>
                   <Hash size={12} className="opacity-40" />
                   {row.status === 'left-only' ? '—' : row.name}
                </div>
                <div className="px-2 py-1 text-right text-gray-500 font-mono text-[10px]">{row.status === 'left-only' ? '' : (row.size / 1024).toFixed(1) + 'K'}</div>
                <div className="px-2 py-1 text-gray-400 text-[10px]">{row.status === 'left-only' ? '' : new Date(row.lastModified).toLocaleDateString()}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Log Console */}
      <div className="h-24 bg-[#f8f8f8] border-t border-gray-300 flex flex-col">
        <div className="bg-[#e0e0e0] px-2 py-0.5 text-[10px] text-gray-600 font-bold uppercase border-b border-gray-300">
          Sync Operation Log
        </div>
        <div className="flex-1 p-2 font-mono text-[10px] text-gray-600 overflow-y-auto custom-scrollbar leading-tight bg-black/5">
          {leftPath && `[${new Date().toLocaleTimeString()}] Left path active: ${leftPath}`}
          <br />
          {rightPath && `[${new Date().toLocaleTimeString()}] Right path active: ${rightPath}`}
          <br />
          {rows.length > 0 && `[${new Date().toLocaleTimeString()}] Analysis finished. Press Sync to merge folders.`}
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

const SyncArrow: React.FC<{ direction: 'ltr' | 'rtl'; onClick: () => void; color: string }> = ({ direction, onClick, color }) => (
  <button 
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    title={`Sync ${direction === 'ltr' ? 'Left to Right' : 'Right to Left'}`}
    className={`p-1 hover:bg-white rounded shadow-sm border border-transparent hover:border-gray-200 transition-all ${color}`}
  >
    {direction === 'ltr' ? <ArrowRight size={12} /> : <ArrowLeft size={12} />}
  </button>
);

const SyncOption: React.FC<{ icon: React.ReactNode; title: string; desc: string; onClick: () => void }> = ({ icon, title, desc, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full text-left px-3 py-2 hover:bg-blue-50 flex gap-3 items-start transition-colors"
  >
    <div className="mt-0.5">{icon}</div>
    <div>
      <div className="text-xs font-bold text-gray-800">{title}</div>
      <div className="text-[10px] text-gray-500 leading-tight">{desc}</div>
    </div>
  </button>
);
