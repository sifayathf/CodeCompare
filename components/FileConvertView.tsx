
import React, { useState, useRef } from 'react';
import { 
  FileUp, 
  Download, 
  Settings2, 
  Play, 
  RefreshCcw,
  AlertCircle,
  FileCode
} from 'lucide-react';

export const FileConvertView: React.FC = () => {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceContent, setSourceContent] = useState<string>('');
  const [targetFormat, setTargetFormat] = useState<'JSON' | 'CSV' | 'TXT'>('JSON');
  const [convertedContent, setConvertedContent] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSourceFile(file);
      const reader = new FileReader();
      reader.onload = (re) => {
        setSourceContent(re.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const convertLogic = () => {
    if (!sourceContent) return;
    setIsProcessing(true);
    
    // Simulate processing time
    setTimeout(() => {
      try {
        let result = '';
        const inputLines = sourceContent.split('\n').filter(l => l.trim());

        if (targetFormat === 'JSON') {
          // Assume CSV or list input for JSON conversion
          if (inputLines[0].includes(',')) {
            const headers = inputLines[0].split(',');
            const data = inputLines.slice(1).map(line => {
              const values = line.split(',');
              const obj: any = {};
              headers.forEach((h, i) => obj[h.trim()] = values[i]?.trim());
              return obj;
            });
            result = JSON.stringify(data, null, 2);
          } else {
            result = JSON.stringify({ lines: inputLines }, null, 2);
          }
        } else if (targetFormat === 'CSV') {
          // Assume JSON or list for CSV conversion
          try {
            const parsed = JSON.parse(sourceContent);
            const array = Array.isArray(parsed) ? parsed : [parsed];
            const headers = Object.keys(array[0]);
            const csvRows = [
              headers.join(','),
              ...array.map(row => headers.map(h => row[h]).join(','))
            ];
            result = csvRows.join('\n');
          } catch {
            result = "Error: Input must be valid JSON to convert to CSV";
          }
        } else {
          // Plain Text
          result = sourceContent;
        }

        setConvertedContent(result);
      } catch (err) {
        setConvertedContent("Error converting file. Please check format.");
      }
      setIsProcessing(false);
    }, 600);
  };

  const downloadResult = () => {
    if (!convertedContent) return;
    const blob = new Blob([convertedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted_${sourceFile?.name || 'file'}.${targetFormat.toLowerCase()}`;
    a.click();
  };

  return (
    <div className="flex flex-col h-full bg-[#f0f0f0]">
      {/* View Toolbar */}
      <div className="bg-[#fcfcfc] border-b border-gray-300 p-1 flex items-center gap-1 overflow-x-auto">
        <ToolbarButton 
          icon={<FileUp size={16} />} 
          label="Open File" 
          onClick={() => fileInputRef.current?.click()} 
        />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <ToolbarButton 
          icon={<Play size={16} className="text-green-600" />} 
          label="Convert Now" 
          onClick={convertLogic}
          disabled={!sourceContent || isProcessing}
        />
        <ToolbarButton 
          icon={<Download size={16} className="text-blue-600" />} 
          label="Save Result" 
          onClick={downloadResult}
          disabled={!convertedContent}
        />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <ToolbarButton icon={<Settings2 size={16} />} label="Conversion Rules" />
      </div>

      <div className="flex-1 flex overflow-hidden p-3 gap-3">
        {/* Source Section */}
        <div className="flex-1 flex flex-col bg-white border border-gray-300 rounded shadow-sm">
          <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-300 flex justify-between items-center rounded-t">
            <span className="font-semibold text-gray-700 flex items-center gap-2">
              <FileCode size={14} /> Source File
            </span>
            <span className="text-[10px] text-gray-400 uppercase">Input Data</span>
          </div>
          <div className="flex-1 relative">
            {!sourceContent ? (
              <div 
                className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileUp size={40} className="text-gray-300 mb-2" />
                <p className="text-gray-400">Click to load source file</p>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
              </div>
            ) : (
              <textarea 
                readOnly
                className="w-full h-full p-4 font-mono text-[11px] outline-none resize-none custom-scrollbar"
                value={sourceContent}
              />
            )}
          </div>
          {sourceFile && (
            <div className="p-2 border-t border-gray-200 text-[10px] text-gray-500 bg-gray-50 italic">
              Loaded: {sourceFile.name} ({(sourceFile.size / 1024).toFixed(1)} KB)
            </div>
          )}
        </div>

        {/* Settings & Arrow */}
        <div className="flex flex-col justify-center gap-4 px-2">
          <div className="bg-white border border-gray-300 rounded p-4 shadow-sm space-y-4 w-48">
            <div>
              <label className="text-[10px] font-bold text-gray-500 block mb-1">TARGET FORMAT</label>
              <select 
                value={targetFormat}
                onChange={(e) => setTargetFormat(e.target.value as any)}
                className="w-full text-xs p-1 border border-gray-300 rounded outline-none"
              >
                <option value="JSON">JSON (.json)</option>
                <option value="CSV">CSV (.csv)</option>
                <option value="TXT">TEXT (.txt)</option>
              </select>
            </div>
            <button 
              onClick={convertLogic}
              disabled={!sourceContent || isProcessing}
              className={`w-full py-2 rounded text-white text-xs font-bold transition-all shadow-sm ${
                !sourceContent || isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isProcessing ? 'Processing...' : 'Start'}
            </button>
          </div>
          <div className="flex justify-center">
            <RefreshCcw size={24} className={`text-gray-300 ${isProcessing ? 'animate-spin' : ''}`} />
          </div>
        </div>

        {/* Result Section */}
        <div className="flex-1 flex flex-col bg-white border border-gray-300 rounded shadow-sm">
          <div className="bg-gray-50 px-3 py-1.5 border-b border-gray-300 flex justify-between items-center rounded-t">
            <span className="font-semibold text-gray-700 flex items-center gap-2">
              <Download size={14} /> Result Preview
            </span>
            <span className="text-[10px] text-gray-400 uppercase">{targetFormat} Output</span>
          </div>
          <div className="flex-1 relative">
            {isProcessing ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                  <span className="text-xs text-blue-600 font-medium">Transforming...</span>
                </div>
              </div>
            ) : null}
            {!convertedContent ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <AlertCircle size={40} className="text-gray-100 mb-2" />
                <p className="text-gray-300">Run conversion to see output</p>
              </div>
            ) : (
              <textarea 
                readOnly
                className="w-full h-full p-4 font-mono text-[11px] outline-none resize-none custom-scrollbar bg-gray-50"
                value={convertedContent}
              />
            )}
          </div>
          {convertedContent && (
             <div className="p-2 border-t border-gray-200 bg-blue-50 flex justify-between items-center">
               <span className="text-[10px] text-blue-700 font-medium">Conversion Successful</span>
               <button onClick={downloadResult} className="text-[10px] text-blue-600 hover:underline">Download file</button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
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
