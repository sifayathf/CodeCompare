
import React from 'react';
import { 
  FolderSearch, 
  GitMerge, 
  RefreshCw, 
  FileText, 
  FileDiff, 
  Edit3, 
  Binary, 
  Music, 
  Image as ImageIcon, 
  Table,
  Repeat,
  Layers
} from 'lucide-react';
import { SessionType } from '../types';

interface HomeViewProps {
  onSelectSession: (type: SessionType) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onSelectSession }) => {
  const sessionOptions = [
    { type: SessionType.FOLDER_COMPARE, icon: FolderSearch, color: 'text-amber-500' },
    { type: SessionType.TEXT_COMPARE, icon: FileText, color: 'text-blue-500' },
    { type: SessionType.FILE_CONVERT, icon: Repeat, color: 'text-rose-500' },
    { type: SessionType.BATCH_PROCESS, icon: Layers, color: 'text-emerald-500' },
    { type: SessionType.FOLDER_MERGE, icon: GitMerge, color: 'text-amber-600' },
    { type: SessionType.FOLDER_SYNC, icon: RefreshCw, color: 'text-amber-700' },
    { type: SessionType.TEXT_MERGE, icon: FileDiff, color: 'text-blue-600' },
    { type: SessionType.TEXT_EDIT, icon: Edit3, color: 'text-blue-700' },
    { type: SessionType.HEX_COMPARE, icon: Binary, color: 'text-gray-600' },
    { type: SessionType.PICTURE_COMPARE, icon: ImageIcon, color: 'text-green-600' },
    { type: SessionType.TABLE_COMPARE, icon: Table, color: 'text-indigo-600' },
  ];

  return (
    <div className="flex h-full">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-[#f8f8f8] border-r border-gray-300 p-4 select-none">
        <h3 className="font-semibold text-gray-600 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span> Sessions
        </h3>
        <div className="space-y-1">
          <div className="pl-4 text-gray-800 font-medium">New</div>
          <div className="pl-8 space-y-1 text-gray-600">
            {sessionOptions.slice(0, 8).map(opt => (
              <div 
                key={opt.type} 
                className="hover:bg-blue-100 hover:text-blue-700 px-2 py-0.5 rounded cursor-pointer transition-colors"
                onClick={() => onSelectSession(opt.type)}
              >
                {opt.type}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 flex flex-col items-center justify-center p-10 bg-white overflow-y-auto custom-scrollbar">
        <div className="text-center mb-12">
          <h2 className="text-gray-500 mb-2">Select a session type to begin</h2>
          <p className="text-gray-400 text-sm italic underline decoration-dotted">Now supporting File Conversion & Batch Processing</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 max-w-5xl">
          {sessionOptions.map(({ type, icon: Icon, color }) => (
            <button
              key={type}
              onClick={() => onSelectSession(type)}
              className="group flex flex-col items-center gap-3 transition-transform hover:scale-105"
            >
              <div className={`p-6 rounded-xl border border-transparent group-hover:border-blue-200 group-hover:bg-blue-50 transition-all shadow-sm group-hover:shadow-md`}>
                <Icon size={48} className={`${color} group-hover:scale-110 transition-transform`} strokeWidth={1.5} />
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{type}</span>
            </button>
          ))}
        </div>

        <div className="mt-20">
          <button className="px-4 py-1.5 border border-gray-300 rounded bg-gray-50 text-gray-700 hover:bg-white text-xs shadow-sm">
            Configure Defaults
          </button>
        </div>
      </div>
    </div>
  );
};
