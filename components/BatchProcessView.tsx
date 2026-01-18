
import React, { useState, useRef } from 'react';
import { 
  FolderOpen, 
  Settings, 
  Play, 
  CheckCircle2, 
  Circle, 
  XCircle,
  Clock,
  Filter,
  Trash2,
  FileBox
} from 'lucide-react';

interface BatchItem {
  name: string;
  size: number;
  status: 'pending' | 'processing' | 'success' | 'error';
  progress: number;
}

export const BatchProcessView: React.FC = () => {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [targetFormat, setTargetFormat] = useState('JSON');
  const [extensionFilter, setExtensionFilter] = useState('.csv');
  const [isBatchRunning, setIsBatchRunning] = useState(false);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    const newItems: BatchItem[] = Array.from(fileList)
      .filter(f => f.name.toLowerCase().endsWith(extensionFilter.toLowerCase()))
      .map(f => ({
        name: f.name,
        size: f.size,
        status: 'pending',
        progress: 0
      }));
    
    setItems(newItems);
  };

  const startBatch = async () => {
    if (items.length === 0 || isBatchRunning) return;
    setIsBatchRunning(true);

    for (let i = 0; i < items.length; i++) {
      // Update status to processing
      setItems(prev => {
        const next = [...prev];
        next[i] = { ...next[i], status: 'processing', progress: 10 };
        return next;
      });

      // Simulate file processing
      await new Promise(r => setTimeout(r, 400 + Math.random() * 800));

      setItems(prev => {
        const next = [...prev];
        next[i] = { ...next[i], status: 'success', progress: 100 };
        return next;
      });
    }

    setIsBatchRunning(false);
  };

  const clearList = () => setItems([]);

  return (
    <div className="flex flex-col h-full bg-[#f0f0f0]">
      {/* Batch Toolbar */}
      <div className="bg-[#fcfcfc] border-b border-gray-300 p-1 flex items-center gap-1">
        <ToolbarButton 
          icon={<FolderOpen size={16} className="text-amber-600" />} 
          label="Select Source Folder" 
          onClick={() => folderInputRef.current?.click()}
        />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <ToolbarButton 
          icon={<Play size={16} className="text-green-600" />} 
          label="Run All" 
          onClick={startBatch}
          disabled={isBatchRunning || items.length === 0}
        />
        <ToolbarButton 
          icon={<Trash2 size={16} className="text-red-500" />} 
          label="Clear Queue" 
          onClick={clearList}
          disabled={isBatchRunning}
        />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <div className="flex items-center gap-2 px-2">
          <Filter size={14} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Filter (*.csv)" 
            value={extensionFilter}
            onChange={(e) => setExtensionFilter(e.target.value)}
            className="text-[11px] p-0.5 border border-gray-300 rounded outline-none w-20"
          />
        </div>
        <input 
          ref={folderInputRef}
          type="file" 
          {...({ webkitdirectory: "" } as any)} 
          multiple 
          className="hidden" 
          onChange={handleFolderSelect}
        />
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Process Queue */}
        <div className="flex-1 flex flex-col bg-white m-3 border border-gray-300 rounded shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-300 flex justify-between items-center">
            <span className="font-bold text-gray-700">Batch Processing Queue</span>
            <span className="text-[11px] text-gray-500">{items.length} files found</span>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-300 p-10 text-center">
                <FileBox size={64} className="mb-4 opacity-20" />
                <h3 className="text-lg font-medium">No files selected</h3>
                <p className="text-sm max-w-xs">Select a folder containing files that match your extension filter to begin batch processing.</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-[#f8f8f8] border-b border-gray-200 text-gray-600 select-none">
                  <tr>
                    <th className="px-4 py-2 font-medium">File Name</th>
                    <th className="px-4 py-2 font-medium">Size</th>
                    <th className="px-4 py-2 font-medium">Status</th>
                    <th className="px-4 py-2 font-medium w-48">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/50">
                      <td className="px-4 py-3 font-medium text-gray-800">{item.name}</td>
                      <td className="px-4 py-3 text-gray-500">{(item.size / 1024).toFixed(1)} KB</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${item.status === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Sidebar Configuration */}
        <div className="w-72 flex flex-col m-3 ml-0 gap-3">
          <div className="bg-white border border-gray-300 rounded shadow-sm p-4">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-3 flex items-center gap-1">
              <Settings size={12} /> Global Settings
            </h4>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">Target Format</label>
                <select 
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value)}
                  className="w-full text-xs p-1.5 border border-gray-300 rounded"
                >
                  <option>JSON</option>
                  <option>CSV</option>
                  <option>TXT</option>
                  <option>XML (Beta)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 block mb-1">On Success</label>
                <select className="w-full text-xs p-1.5 border border-gray-300 rounded">
                  <option>Save to Source Folder</option>
                  <option>Prompt for Location</option>
                  <option>Download ZIP (Aggregated)</option>
                </select>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-xs text-gray-600">Overwrite existing</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white border border-gray-300 rounded shadow-sm p-4">
             <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-3">Statistics</h4>
             <div className="space-y-3">
                <StatRow label="Queued" value={items.filter(i => i.status === 'pending').length} />
                <StatRow label="Processing" value={items.filter(i => i.status === 'processing').length} color="text-blue-600" />
                <StatRow label="Success" value={items.filter(i => i.status === 'success').length} color="text-green-600" />
                <StatRow label="Failures" value={items.filter(i => i.status === 'error').length} color="text-red-600" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatRow: React.FC<{ label: string; value: number; color?: string }> = ({ label, value, color }) => (
  <div className="flex justify-between items-center">
    <span className="text-xs text-gray-500">{label}</span>
    <span className={`text-sm font-bold ${color || 'text-gray-800'}`}>{value}</span>
  </div>
);

const StatusBadge: React.FC<{ status: BatchItem['status'] }> = ({ status }) => {
  switch (status) {
    case 'pending': return <span className="flex items-center gap-1.5 text-gray-400"><Circle size={12} /> Pending</span>;
    case 'processing': return <span className="flex items-center gap-1.5 text-blue-600 animate-pulse"><Clock size={12} /> Working</span>;
    case 'success': return <span className="flex items-center gap-1.5 text-green-600 font-medium"><CheckCircle2 size={12} /> Success</span>;
    case 'error': return <span className="flex items-center gap-1.5 text-red-600 font-medium"><XCircle size={12} /> Failed</span>;
    default: return null;
  }
};

const ToolbarButton: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void; disabled?: boolean }> = ({ 
  icon, label, onClick, disabled 
}) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-1.5 px-2 py-1 rounded border border-transparent transition-colors ${
      disabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-200 hover:border-gray-300'
    }`}
  >
    {icon}
    <span className="text-[11px] text-gray-700">{label}</span>
  </button>
);
