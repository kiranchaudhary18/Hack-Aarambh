import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, CheckCircle2, AlertTriangle, RefreshCw, Play } from 'lucide-react';
import Button from './Button';

const Upload = ({
  onUploadComplete,
  accept = { 'application/pdf': ['.pdf'] },
  maxSize = 5242880, // 5MB
  loading = false,
  error = null,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleStartAnalysis = () => {
    if (selectedFile && onUploadComplete) {
      onUploadComplete(selectedFile);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false
  });

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`
            border border-dashed rounded-30px p-10 flex flex-col items-center justify-center cursor-pointer
            transition-all duration-500 min-h-[220px] bg-cyber-navy/40 backdrop-blur-xl relative overflow-hidden group
            ${isDragActive 
              ? 'border-cyber-blue bg-cyber-blue/5 shadow-[0_0_30px_rgba(0,242,254,0.15)]' 
              : 'border-cyber-border/80 hover:border-cyber-blue/40 hover:bg-[#070b14]/50'
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="p-4 bg-[#050811] border border-cyber-border rounded-2xl text-cyber-blue mb-4 group-hover:scale-105 transition-transform duration-300">
            <UploadCloud className="w-8 h-8 animate-bounce text-cyber-glow" />
          </div>
          <p className="text-base font-bold text-white text-center uppercase tracking-tight">
            {isDragActive ? "Deposit document here..." : "Deposit Contract PDF"}
          </p>
          <p className="text-xs text-cyber-gray mt-1.5 text-center font-medium">
            Drag and drop or click to browse files
          </p>
          <p className="text-[10px] text-cyber-gray/60 mt-3 font-mono">
            SECURE SANDBOX: PDF OR DOCX (MAX 5MB)
          </p>
        </div>
      ) : (
        <div className="border border-cyber-border rounded-30px p-6 bg-[#050811] backdrop-blur-xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#03060c] border border-cyber-border rounded-xl text-cyber-blue">
                <FileText className="w-6 h-6 text-cyber-glow" />
              </div>
              <div className="max-w-[200px] sm:max-w-md">
                <p className="text-xs font-bold text-white truncate">{selectedFile.name}</p>
                <p className="text-[10px] text-cyber-gray font-mono">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="text-xs font-bold text-cyber-pink hover:text-red-500 hover:underline cursor-pointer"
            >
              Remove
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-xs text-cyber-pink bg-cyber-pink/5 border border-cyber-pink/20 p-3 rounded-xl">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && (
            <div className="flex flex-col gap-4 border-t border-cyber-border/40 pt-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-cyber-glow bg-cyber-glow/5 border border-cyber-glow/20 p-3 rounded-xl uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Payload validation check passed. Ready to inspect.</span>
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={handleStartAnalysis} 
                  variant="primary" 
                  size="sm"
                  icon={Play}
                >
                  Analyze Offer Letter
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Upload;
