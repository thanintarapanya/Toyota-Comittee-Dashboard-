import React, { useState, useRef } from 'react';
import { Folder, FileText, Video, ChevronRight, Download, Upload, Search, Scissors, ClipboardPaste, Film, FileSpreadsheet, Trash2, Edit2, Lock, CheckSquare, Square, X } from 'lucide-react';
import { FileItem } from '../types';

interface FilesProps {
    files: FileItem[];
    setFiles: (files: FileItem[]) => void;
}

const FileAndVideo: React.FC<FilesProps> = ({ files, setFiles }) => {
    const [path, setPath] = useState<Array<{id: string, name: string}>>([{ id: 'root', name: 'Drive' }]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [clipboard, setClipboard] = useState<{ids: Set<string>, action: 'move'} | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Modal States
    const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, password: string, error: boolean}>({ isOpen: false, password: '', error: false });
    const [renameId, setRenameId] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState('');

    const currentFolderId = path[path.length - 1].id;

    // Derived Items
    const displayedItems = searchQuery 
        ? files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : files.filter(f => f.parentId === currentFolderId);

    // Navigation
    const handleNavigate = (folderId: string, folderName: string) => {
        setPath([...path, { id: folderId, name: folderName }]);
        setSelectedIds(new Set()); // Clear selection on nav
        setSearchQuery('');
    };

    const handleBreadcrumbClick = (index: number) => {
        setPath(path.slice(0, index + 1));
        setSelectedIds(new Set());
    };

    // Selection
    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    // Import CSV
    const handleImportClick = () => fileInputRef.current?.click();
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const newFile: FileItem = {
                id: `import-${Date.now()}`,
                parentId: currentFolderId,
                name: file.name,
                type: 'csv',
                size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                date: new Date().toLocaleString()
            };
            setFiles([...files, newFile]);
        }
    };

    // Export Zip
    const handleExport = () => {
        const count = selectedIds.size;
        if (count === 0) return;
        alert(`Compressing ${count} items into archive.zip... Download starting.`);
        setSelectedIds(new Set());
    };

    // Rename
    const startRename = (id: string, currentName: string) => {
        setRenameId(id);
        setRenameValue(currentName);
    };
    const submitRename = () => {
        if (renameId && renameValue) {
            setFiles(files.map(f => f.id === renameId ? { ...f, name: renameValue } : f));
            setRenameId(null);
        }
    };

    // Move Logic
    const handleMoveStart = () => {
        setClipboard({ ids: new Set(selectedIds), action: 'move' });
        setSelectedIds(new Set());
    };
    const handlePaste = () => {
        if (clipboard && clipboard.action === 'move') {
            setFiles(files.map(f => clipboard.ids.has(f.id) ? { ...f, parentId: currentFolderId } : f));
            setClipboard(null);
        }
    };

    // Delete Logic
    const confirmDelete = () => {
        if (deleteModal.password === 'admin') { // Mock Password
            // Recursive delete logic for folders
            const findChildren = (parentId: string): string[] => {
                return files.filter(f => f.parentId === parentId).map(f => f.id);
            };

            const allIdsToDelete = new Set(selectedIds);
            
            // Simple recursion to find sub-files
            const queue: string[] = Array.from(selectedIds);
            while(queue.length > 0) {
                const currentId = queue.pop()!;
                const children = findChildren(currentId);
                children.forEach(c => {
                    if (!allIdsToDelete.has(c)) {
                        allIdsToDelete.add(c);
                        queue.push(c);
                    }
                });
            }

            setFiles(files.filter(f => !allIdsToDelete.has(f.id)));
            setDeleteModal({ isOpen: false, password: '', error: false });
            setSelectedIds(new Set());
        } else {
            setDeleteModal({ ...deleteModal, error: true });
        }
    };

    const FileIcon = ({ type }: { type: string }) => {
        switch(type) {
            case 'folder': return <Folder className="w-10 h-10 text-isuzu-red fill-isuzu-red/20" />;
            case 'csv': return <FileSpreadsheet className="w-10 h-10 text-green-500" />;
            case 'mp4': return <Film className="w-10 h-10 text-blue-500" />;
            default: return <FileText className="w-10 h-10 text-zinc-500" />;
        }
    };

    return (
        <div className="flex-1 p-8 h-full flex flex-col overflow-hidden bg-gradient-to-br from-[#050505] to-[#0a0a0a] relative">
            {/* Header */}
            <div className="flex justify-between items-end mb-6 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-light text-white tracking-tight">Data Archives</h2>
                    <p className="text-zinc-500 text-xs mt-1 font-mono uppercase">CLOUD STORAGE • {path.length === 1 ? 'ROOT' : path[path.length-1].name.toUpperCase()}</p>
                </div>
                <div className="flex gap-3">
                    <input type="file" ref={fileInputRef} accept=".csv" className="hidden" onChange={handleFileUpload} />
                    <button 
                        onClick={handleImportClick}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm border border-white/5 transition-all"
                    >
                        <Upload className="w-4 h-4" /> Import CSV
                    </button>
                    <button 
                        onClick={handleExport}
                        disabled={selectedIds.size === 0}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${selectedIds.size > 0 ? 'bg-isuzu-red hover:bg-red-600 text-white shadow-[0_0_15px_rgba(255,51,51,0.3)]' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}
                    >
                        <Download className="w-4 h-4" /> Export Zip {selectedIds.size > 0 && `(${selectedIds.size})`}
                    </button>
                </div>
            </div>

            {/* Main Interface */}
            <div className="flex-1 glass-panel rounded-xl border border-white/5 flex flex-col overflow-hidden relative">
                
                {/* Toolbar */}
                <div className="h-16 border-b border-white/10 flex items-center px-6 bg-white/5 justify-between">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                        {path.map((item, index) => (
                            <React.Fragment key={item.id}>
                                {index > 0 && <ChevronRight className="w-4 h-4 text-zinc-600" />}
                                <button 
                                    onClick={() => handleBreadcrumbClick(index)}
                                    className={`hover:text-white transition-colors ${index === path.length - 1 ? 'text-white font-bold' : ''}`}
                                >
                                    {item.name}
                                </button>
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Action Buttons */}
                        {selectedIds.size > 0 && (
                            <div className="flex items-center gap-2 mr-4 border-r border-white/10 pr-4">
                                <button onClick={handleMoveStart} className="p-2 hover:bg-white/10 rounded text-zinc-300 hover:text-white" title="Cut/Move">
                                    <Scissors className="w-4 h-4" />
                                </button>
                                <button onClick={() => setDeleteModal({...deleteModal, isOpen: true})} className="p-2 hover:bg-red-500/20 rounded text-red-500" title="Delete">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        {clipboard && (
                            <button onClick={handlePaste} className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-xs mr-4 hover:bg-blue-500/30">
                                <ClipboardPaste className="w-3 h-3" /> Paste {clipboard.ids.size} Items
                            </button>
                        )}

                        <div className="relative">
                            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                            <input 
                                type="text" 
                                placeholder="Search archives..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-black/40 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-white focus:border-isuzu-red outline-none w-64"
                            />
                        </div>
                    </div>
                </div>

                {/* File Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    {displayedItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                            <Folder className="w-16 h-16 mb-4 opacity-20" />
                            <p>No items found</p>
                            {searchQuery && <button onClick={() => setSearchQuery('')} className="text-isuzu-red text-sm mt-2 hover:underline">Clear Search</button>}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {displayedItems.map((item) => (
                                <div 
                                    key={item.id}
                                    onClick={(e) => {
                                        // If clicking the card body (not check/actions)
                                        if (renameId === item.id) return;
                                        if (item.type === 'folder') handleNavigate(item.id, item.name);
                                    }}
                                    className={`
                                        group relative p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-3
                                        ${selectedIds.has(item.id) 
                                            ? 'bg-isuzu-red/10 border-isuzu-red' 
                                            : 'border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/20'
                                        }
                                    `}
                                >
                                    {/* Selection Checkbox */}
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleSelection(item.id);
                                        }}
                                        className="absolute top-3 left-3 z-10 text-zinc-500 hover:text-white"
                                    >
                                        {selectedIds.has(item.id) ? <CheckSquare className="w-4 h-4 text-isuzu-red" /> : <Square className="w-4 h-4" />}
                                    </button>

                                    <div className="flex justify-end items-start h-10">
                                        {/* Icon Centered implicitly via layout or custom placement */}
                                        <div className="w-full flex justify-center mt-2">
                                            <FileIcon type={item.type} />
                                        </div>
                                        
                                        {/* Context Menu Trigger (Mock) */}
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                             <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    startRename(item.id, item.name);
                                                }}
                                                className="p-1.5 bg-black/50 hover:bg-zinc-700 rounded-full text-zinc-300"
                                             >
                                                 <Edit2 className="w-3 h-3" />
                                             </button>
                                        </div>
                                    </div>
                                    
                                    <div className="text-center mt-2">
                                        {renameId === item.id ? (
                                            <input 
                                                autoFocus
                                                value={renameValue}
                                                onChange={(e) => setRenameValue(e.target.value)}
                                                onBlur={submitRename}
                                                onKeyDown={(e) => e.key === 'Enter' && submitRename()}
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-full bg-black border border-isuzu-red text-xs text-white text-center rounded px-1"
                                            />
                                        ) : (
                                            <h3 className="text-sm text-zinc-200 font-medium truncate px-1" title={item.name}>{item.name}</h3>
                                        )}
                                        <div className="flex items-center justify-center gap-2 mt-1 text-[10px] text-zinc-500">
                                            <span>{item.date}</span>
                                            {item.size && <span>• {item.size}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Footer Status */}
                <div className="h-10 border-t border-white/10 bg-black/40 flex items-center justify-between px-6 text-[10px] text-zinc-500 font-mono">
                    <span>{displayedItems.length} ITEMS</span>
                    <span className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="w-[70%] h-full bg-isuzu-red"></div>
                        </div>
                        70% STORAGE USED
                    </span>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModal.isOpen && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-full max-w-sm glass-panel p-6 rounded-xl border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center gap-3 mb-4 text-white">
                            <Lock className="w-5 h-5 text-isuzu-red" />
                            <h3 className="text-lg font-bold">Security Verification</h3>
                        </div>
                        <p className="text-sm text-zinc-400 mb-4">
                            Deleting {selectedIds.size} items permanently requires administrator authorization.
                        </p>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] uppercase font-bold text-zinc-500">Password</label>
                                <input 
                                    type="password" 
                                    className={`w-full bg-black/50 border rounded px-3 py-2 text-white outline-none mt-1 ${deleteModal.error ? 'border-red-500' : 'border-white/10 focus:border-isuzu-red'}`}
                                    placeholder="Enter admin password..."
                                    value={deleteModal.password}
                                    onChange={(e) => setDeleteModal({...deleteModal, password: e.target.value, error: false})}
                                />
                                {deleteModal.error && <span className="text-red-500 text-xs mt-1">Incorrect password. Try 'admin'.</span>}
                            </div>
                            <div className="flex justify-end gap-2">
                                <button 
                                    onClick={() => setDeleteModal({isOpen: false, password: '', error: false})}
                                    className="px-4 py-2 text-sm text-zinc-400 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-isuzu-red hover:bg-red-600 text-white rounded text-sm font-medium"
                                >
                                    Confirm Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileAndVideo;