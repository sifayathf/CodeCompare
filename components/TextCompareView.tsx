
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  ArrowLeftRight, 
  ChevronDown, 
  ChevronUp, 
  Save, 
  Settings,
  AlignLeft,
  Columns,
  FolderOpen,
  FileUp,
  RotateCcw,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface DiffLine {
  left: string | null;
  right: string | null;
  type: 'same' | 'diff' | 'left-only' | 'right-only';
}

export const TextCompareView: React.FC = () => {
  const [leftText, setLeftText] = useState('// Sample Code\nfunction hello() {\n  console.log("Hello World");\n}\n\n// Extra lines...');
  const [rightText, setRightText] = useState('// Sample Code\nfunction hello() {\n  console.log("Hello Galaxy!");\n  alert("Welcome");\n}\n\n// Final lines...');
  const [leftFileName, setLeftFileName] = useState('source.js');
  const [rightFileName, setRightFileName] = useState('destination.js');
  
  const leftFileInputRef = useRef<HTMLInputElement>(null);
  const rightFileInputRef = useRef<HTMLInputElement>(null);
  
  const leftAreaRef = useRef<HTMLTextAreaElement>(null);
  const rightAreaRef = useRef<HTMLTextAreaElement>(null);
  const leftHighlightRef = useRef<HTMLDivElement>(null);
  const rightHighlightRef = useRef<HTMLDivElement>(null);
  const gutterScrollRef = useRef<HTMLDivElement>(null);

  // Synchronized scrolling for all components
  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollLeft } = e.currentTarget;
    
    if (leftAreaRef.current && leftAreaRef.current !== e.currentTarget) leftAreaRef.current.scrollTop = scrollTop;
    if (rightAreaRef.current && rightAreaRef.current !== e.currentTarget) rightAreaRef.current.scrollTop = scrollTop;
    
    if (leftHighlightRef.current) {
      leftHighlightRef.current.scrollTop = scrollTop;
      leftHighlightRef.current.scrollLeft = scrollLeft;
    }
    if (rightHighlightRef.current) {
      rightHighlightRef.current.scrollTop = scrollTop;
      rightHighlightRef.current.scrollLeft = scrollLeft;
    }
    if (gutterScrollRef.current) {
      gutterScrollRef.current.scrollTop = scrollTop;
    }
  };

  const diffLines = useMemo((): DiffLine[] => {
    const lLines = leftText.split('\n');
    const rLines = rightText.split('\n');
    const max = Math.max(lLines.length, rLines.length);
    const result: DiffLine[] = [];

    for (let i = 0; i < max; i++) {
      const l = lLines[i] !== undefined ? lLines[i] : null;
      const r = rLines[i] !== undefined ? rLines[i] : null;
      
      let type: DiffLine['type'] = 'same';
      if (l !== r) {
        if (l === null) type = 'right-only';
        else if (r === null) type = 'left-only';
        else type = 'diff';
      }
      
      result.push({ left: l, right: r, type });
    }
    return result;
  }, [leftText, rightText]);

  const handleFileUpload = (side: 'left' | 'right', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (side === 'left') {
        setLeftText(content);
        setLeftFileName(file.name);
      } else {
        setRightText(content);
        setRightFileName(file.name);
      }
    };
    reader.readAsText(file);
  };

  const syncLine = (index: number, direction: 'ltr' | 'rtl') => {
    const lLines = leftText.split('\n');
    const rLines = rightText.split('\n');
    
    if (direction === 'ltr') {
      rLines[index] = lLines[index] || '';
    } else {
      lLines[index] = rLines[index] || '';
    }
    
    setLeftText(lLines.join('\n'));
    setRightText(rLines.join('\n'));
  };

  const handleSwap = () => {
    const tempT = leftText;
    setLeftText(rightText);
    setRightText(tempT);
    const tempN = leftFileName;
    setLeftFileName(rightFileName);
    setRightFileName(tempN);
  };

  // Ensure line counts match for visual consistency in backgrounds
  const lineCount = diffLines.length;

  return (
    <div className="flex flex-col h-full bg-white select-none overflow-hidden">
      {/* View Toolbar */}
      <div className="bg-[#fcfcfc] border-b border-gray-300 p-1 flex items-center gap-1 overflow-x-auto flex-shrink-0">
        <ToolbarButton icon={<FolderOpen size={16} className="text-amber-600" />} label="Open Files" onClick={() => leftFileInputRef.current?.click()} />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <ToolbarButton icon={<Save size={16} />} label="Save" />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <ToolbarButton icon={<ChevronDown size={16} />} label="Next Diff" />
        <ToolbarButton icon={<ChevronUp size={16} />} label="Prev Diff" />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <ToolbarButton icon={<Columns size={16} />} label="Side-by-Side" />
        <ToolbarButton icon={<AlignLeft size={16} />} label="Over-Under" />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <ToolbarButton icon={<ArrowLeftRight size={16} />} label="Swap Sides" onClick={handleSwap} />
        <div className="w-px h-6 bg-gray-300 mx-1"></div>
        <ToolbarButton icon={<Settings size={16} />} label="Rules" />
        
        <input type="file" ref={leftFileInputRef} className="hidden" onChange={(e) => handleFileUpload('left', e)} />
        <input type="file" ref={rightFileInputRef} className="hidden" onChange={(e) => handleFileUpload('right', e)} />
      </div>

      {/* Comparison View */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Pane */}
        <div className="flex-1 flex flex-col border-r border-gray-300 min-w-0 h-full relative">
          <div className="bg-gray-100 px-3 py-1.5 border-b border-gray-300 flex justify-between items-center h-8 flex-shrink-0 z-20">
            <div className="flex items-center gap-2 overflow-hidden">
               <FileUp size={14} className="text-gray-400" />
               <span className="text-[11px] font-mono font-bold text-gray-600 truncate">{leftFileName}</span>
            </div>
            <button onClick={() => leftFileInputRef.current?.click()} className="text-[9px] font-bold bg-white border border-gray-300 px-1.5 py-0.5 rounded hover:bg-gray-50 uppercase shadow-sm">Browse</button>
          </div>
          
          <div className="flex-1 relative overflow-hidden bg-white">
            {/* Highlighting Background Layer */}
            <div 
              ref={leftHighlightRef}
              className="absolute inset-0 pointer-events-none font-mono text-[12px] leading-6 whitespace-pre custom-scrollbar overflow-hidden"
            >
              {diffLines.map((line, i) => (
                <div key={i} className={`h-6 w-full ${
                  line.type === 'diff' ? 'bg-red-100/50' : 
                  line.type === 'left-only' ? 'bg-blue-100/50' : 
                  line.type === 'right-only' ? 'bg-gray-200/30' : ''
                }`}></div>
              ))}
            </div>
            
            {/* Interactive Editor Layer */}
            <textarea
              ref={leftAreaRef}
              onScroll={handleScroll}
              className="absolute inset-0 w-full h-full bg-transparent p-0 pl-12 font-mono text-[12px] leading-6 resize-none outline-none z-10 custom-scrollbar whitespace-pre"
              value={leftText}
              onChange={(e) => setLeftText(e.target.value)}
              spellCheck={false}
            />
            
            {/* Line Numbers Layer */}
            <div className="absolute left-0 top-0 w-10 h-full bg-[#f8f8f8] border-r border-gray-100 pointer-events-none z-10 flex flex-col font-mono text-[10px] text-gray-400 text-right pr-2 select-none">
               {Array.from({ length: lineCount }).map((_, i) => (
                 <div key={i} className="h-6 leading-6">{i + 1}</div>
               ))}
            </div>
          </div>
        </div>

        {/* Sync Gutter (Center Control) */}
        <div 
          ref={gutterScrollRef}
          className="w-12 bg-[#f0f0f0] border-r border-gray-300 flex flex-col pt-8 overflow-y-hidden select-none flex-shrink-0"
        >
          {diffLines.map((line, i) => (
            <div key={i} className={`h-6 flex items-center justify-center gap-0.5 px-0.5 border-b border-transparent transition-colors ${
                line.type !== 'same' ? 'bg-amber-100/50' : ''
            }`}>
              {line.type !== 'same' && line.type !== 'right-only' && (
                <button 
                  onClick={() => syncLine(i, 'ltr')}
                  className="p-0.5 hover:bg-blue-600 hover:text-white rounded shadow-sm bg-white border border-gray-200 text-blue-600 transition-all"
                  title="Move right"
                >
                  <ArrowRight size={10} strokeWidth={3} />
                </button>
              )}
              {line.type !== 'same' && line.type !== 'left-only' && (
                <button 
                  onClick={() => syncLine(i, 'rtl')}
                  className="p-0.5 hover:bg-red-600 hover:text-white rounded shadow-sm bg-white border border-gray-200 text-red-600 transition-all"
                  title="Move left"
                >
                  <ArrowLeft size={10} strokeWidth={3} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Right Pane */}
        <div className="flex-1 flex flex-col min-w-0 h-full relative">
          <div className="bg-gray-100 px-3 py-1.5 border-b border-gray-300 flex justify-between items-center h-8 flex-shrink-0 z-20">
            <div className="flex items-center gap-2 overflow-hidden">
               <FileUp size={14} className="text-gray-400" />
               <span className="text-[11px] font-mono font-bold text-gray-600 truncate">{rightFileName}</span>
            </div>
            <button onClick={() => rightFileInputRef.current?.click()} className="text-[9px] font-bold bg-white border border-gray-300 px-1.5 py-0.5 rounded hover:bg-gray-50 uppercase shadow-sm">Browse</button>
          </div>
          
          <div className="flex-1 relative overflow-hidden bg-white">
            {/* Highlighting Background Layer */}
            <div 
              ref={rightHighlightRef}
              className="absolute inset-0 pointer-events-none font-mono text-[12px] leading-6 whitespace-pre custom-scrollbar overflow-hidden"
            >
              {diffLines.map((line, i) => (
                <div key={i} className={`h-6 w-full ${
                  line.type === 'diff' ? 'bg-green-100/50' : 
                  line.type === 'right-only' ? 'bg-green-100/50' : 
                  line.type === 'left-only' ? 'bg-gray-200/30' : ''
                }`}></div>
              ))}
            </div>
            
            {/* Interactive Editor Layer */}
            <textarea
              ref={rightAreaRef}
              onScroll={handleScroll}
              className="absolute inset-0 w-full h-full bg-transparent p-0 pl-12 font-mono text-[12px] leading-6 resize-none outline-none z-10 custom-scrollbar whitespace-pre"
              value={rightText}
              onChange={(e) => setRightText(e.target.value)}
              spellCheck={false}
            />
            
            {/* Line Numbers Layer */}
            <div className="absolute left-0 top-0 w-10 h-full bg-[#f8f8f8] border-r border-gray-100 pointer-events-none z-10 flex flex-col font-mono text-[10px] text-gray-400 text-right pr-2 select-none">
               {Array.from({ length: lineCount }).map((_, i) => (
                 <div key={i} className="h-6 leading-6">{i + 1}</div>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="h-8 bg-[#f0f0f0] border-t border-gray-300 px-4 flex items-center justify-between text-[11px] text-gray-600 flex-shrink-0 z-30">
        <div className="flex gap-6 items-center">
          <span className="flex items-center gap-1.5 font-bold">
             <span className="w-2 h-2 bg-red-400 rounded-full"></span>
             {diffLines.filter(l => l.type !== 'same').length} Differences
          </span>
          <div className="w-px h-3 bg-gray-300"></div>
          <div className="flex gap-4">
             <span className="text-gray-400">Lines: <b className="text-gray-700">{diffLines.length}</b></span>
             <span className="text-gray-400">Modified: <b className="text-gray-700">{diffLines.filter(l => l.type === 'diff').length}</b></span>
          </div>
        </div>
        <div className="flex items-center gap-2 opacity-50 uppercase tracking-tighter font-bold">
           <span>UTF-8</span>
           <RotateCcw size={12} className="hover:text-gray-900 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

const ToolbarButton: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void }> = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-1.5 px-2 py-1 hover:bg-gray-200 rounded border border-transparent hover:border-gray-300 transition-colors"
  >
    {icon}
    <span className="text-[11px] font-medium text-gray-700">{label}</span>
  </button>
);
