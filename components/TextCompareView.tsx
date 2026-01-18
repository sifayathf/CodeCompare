
import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Save, 
  Settings,
  AlignLeft,
  Columns
} from 'lucide-react';

export const TextCompareView: React.FC = () => {
  const [leftText, setLeftText] = useState('// Sample Code\nfunction hello() {\n  console.log("Hello World");\n}\n\n// Extra lines...');
  const [rightText, setRightText] = useState('// Sample Code\nfunction hello() {\n  console.log("Hello Galaxy!");\n  alert("Welcome");\n}\n\n// Final lines...');

  const leftLines = leftText.split('\n');
  const rightLines = rightText.split('\n');
  const maxLines = Math.max(leftLines.length, rightLines.length);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* View Toolbar */}
      <div className="bg-[#fcfcfc] border-b border-gray-300 p-1 flex items-center gap-1 overflow-x-auto select-none">
        <ToolbarButton icon={<Save size={16} />} label="Save" />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <ToolbarButton icon={<ChevronDown size={16} />} label="Next Diff" />
        <ToolbarButton icon={<ChevronUp size={16} />} label="Prev Diff" />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <ToolbarButton icon={<Columns size={16} />} label="Side-by-Side" />
        <ToolbarButton icon={<AlignLeft size={16} />} label="Over-Under" />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <ToolbarButton icon={<ArrowLeftRight size={16} />} label="Swap Sides" />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <ToolbarButton icon={<Settings size={16} />} label="Rules" />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Side */}
        <div className="flex-1 flex flex-col border-r border-gray-300">
           <div className="bg-gray-50 px-2 py-1 text-xs border-b border-gray-300 flex justify-between items-center">
             <span className="font-mono text-gray-600">source.js</span>
             <span className="text-[10px] text-gray-400">UTF-8</span>
           </div>
           <textarea 
            className="flex-1 p-2 font-mono text-xs outline-none bg-white text-gray-800 leading-relaxed resize-none custom-scrollbar"
            value={leftText}
            onChange={(e) => setLeftText(e.target.value)}
           />
        </div>

        {/* Diff visualization gutter */}
        <div className="w-8 bg-[#f0f0f0] border-r border-gray-300 flex flex-col items-center pt-8 gap-1">
          {Array.from({ length: maxLines }).map((_, i) => (
            <div key={i} className={`h-[1.5rem] w-full ${leftLines[i] !== rightLines[i] ? 'bg-red-200' : ''}`}></div>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex-1 flex flex-col">
           <div className="bg-gray-50 px-2 py-1 text-xs border-b border-gray-300 flex justify-between items-center">
             <span className="font-mono text-gray-600">destination.js</span>
             <span className="text-[10px] text-gray-400">UTF-8</span>
           </div>
           <textarea 
            className="flex-1 p-2 font-mono text-xs outline-none bg-[#fffafa] text-gray-800 leading-relaxed resize-none custom-scrollbar"
            value={rightText}
            onChange={(e) => setRightText(e.target.value)}
           />
        </div>
      </div>

      {/* Comparison Overview */}
      <div className="h-10 bg-gray-100 border-t border-gray-300 px-4 flex items-center text-xs text-gray-600">
        <span className="mr-4"><b className="text-red-600">2</b> differences found</span>
        <span>Line: 3, Col: 14</span>
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
