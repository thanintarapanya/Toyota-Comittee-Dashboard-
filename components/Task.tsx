import React, { useState } from 'react';
import { Task as TaskType, TaskStatus, Priority } from '../types';
import { INITIAL_TASKS } from '../constants';
import { Plus, GripVertical, User, Calendar, Paperclip, X, Save, Pencil, Trash2 } from 'lucide-react';

const Task: React.FC = () => {
  const [tasks, setTasks] = useState<TaskType[]>(INITIAL_TASKS);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  
  const [newTask, setNewTask] = useState<Partial<TaskType>>({
      title: '',
      description: '',
      priority: Priority.MEDIUM,
      assignee: 'Eng. Team',
      status: TaskStatus.TODO
  });

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (draggedTaskId) {
      const updatedTasks = tasks.map(t => 
        t.id === draggedTaskId ? { ...t, status } : t
      );
      setTasks(updatedTasks);
      setDraggedTaskId(null);
    }
  };

  const openModal = (task?: TaskType) => {
      if (task) {
          setEditingTaskId(task.id);
          setNewTask({
              title: task.title,
              description: task.description,
              priority: task.priority,
              assignee: task.assignee,
              status: task.status,
              dueDate: task.dueDate,
              attachment: task.attachment
          });
      } else {
          setEditingTaskId(null);
          setNewTask({
              title: '',
              description: '',
              priority: Priority.MEDIUM,
              assignee: 'Eng. Team',
              status: TaskStatus.TODO
          });
      }
      setIsModalOpen(true);
  };

  const saveTask = () => {
      if (!newTask.title) return;

      if (editingTaskId) {
          // Edit existing
          setTasks(tasks.map(t => t.id === editingTaskId ? { ...t, ...newTask } as TaskType : t));
      } else {
          // Add new
          const task: TaskType = {
              id: `t-${Date.now()}`,
              title: newTask.title || 'New Task',
              description: newTask.description || '',
              priority: newTask.priority || Priority.MEDIUM,
              assignee: newTask.assignee || 'Unassigned',
              status: newTask.status || TaskStatus.TODO,
              dueDate: newTask.dueDate,
              attachment: newTask.attachment
          };
          setTasks([...tasks, task]);
      }
      
      setIsModalOpen(false);
  };

  const deleteTask = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setTasks(tasks.filter(t => t.id !== id));
  };

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case Priority.CRITICAL: return 'border-l-isuzu-red shadow-[inset_2px_0_0_0_#FF3333]';
      case Priority.HIGH: return 'border-l-orange-500 shadow-[inset_2px_0_0_0_orange]';
      case Priority.MEDIUM: return 'border-l-yellow-500';
      default: return 'border-l-zinc-700';
    }
  };

  const Column = ({ status, title }: { status: TaskStatus, title: string }) => (
    <div 
      className="flex-1 min-w-[300px] flex flex-col h-full glass-panel rounded-xl overflow-hidden border border-white/5"
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, status)}
    >
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
        <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${status === TaskStatus.TODO ? 'bg-zinc-500' : status === TaskStatus.IN_PROGRESS ? 'bg-blue-500' : 'bg-green-500'}`}></span>
            <h3 className="text-sm font-medium text-zinc-300">{title}</h3>
        </div>
        <span className="text-xs text-zinc-600 font-mono bg-black/30 px-2 py-0.5 rounded">
            {tasks.filter(t => t.status === status).length}
        </span>
      </div>
      
      <div className="p-3 space-y-3 overflow-y-auto flex-1 bg-gradient-to-b from-black/20 to-transparent">
        {tasks.filter(t => t.status === status).map(task => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => handleDragStart(e, task.id)}
            className={`
                bg-[#0F0F0F] hover:bg-[#141414] p-4 rounded border border-white/5 cursor-move transition-all duration-200 group relative
                ${getPriorityColor(task.priority)}
                ${draggedTaskId === task.id ? 'opacity-50 scale-95' : 'opacity-100'}
            `}
          >
            {/* Hover Actions */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#141414] p-1 rounded">
                <button 
                    onClick={() => openModal(task)}
                    className="p-1 text-zinc-500 hover:text-white hover:bg-white/10 rounded"
                >
                    <Pencil className="w-3 h-3" />
                </button>
                <button 
                    onClick={(e) => deleteTask(task.id, e)}
                    className="p-1 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded"
                >
                    <Trash2 className="w-3 h-3" />
                </button>
            </div>

            <div className="flex justify-between items-start mb-2 pr-8">
                <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/5 ${task.priority === Priority.CRITICAL ? 'text-red-500' : 'text-zinc-500'}`}>
                    {task.priority}
                </span>
            </div>
            <h4 className="text-sm text-zinc-200 font-light mb-1">{task.title}</h4>
            <p className="text-xs text-zinc-500 line-clamp-2 mb-3">{task.description}</p>
            
            {/* Metadata row */}
            <div className="flex items-center gap-3 mb-3">
                 {task.dueDate && (
                     <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                         <Calendar className="w-3 h-3" /> {task.dueDate}
                     </div>
                 )}
                 {task.attachment && (
                     <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                         <Paperclip className="w-3 h-3" /> 1 File
                     </div>
                 )}
            </div>

            <div className="flex items-center gap-2 border-t border-white/5 pt-3">
                <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400">
                    {task.assignee.charAt(0)}
                </div>
                <span className="text-[10px] text-zinc-600">{task.assignee}</span>
            </div>
          </div>
        ))}
        {status === TaskStatus.TODO && (
            <button 
                onClick={() => openModal()}
                className="w-full py-2 border border-dashed border-white/10 rounded text-zinc-600 hover:text-zinc-400 hover:border-white/20 hover:bg-white/5 transition-all text-sm flex items-center justify-center gap-2"
            >
                <Plus className="w-3 h-3" /> Add Task
            </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex-1 p-8 h-full overflow-hidden flex flex-col relative">
        <div className="flex justify-between items-end mb-6">
            <div>
                <h2 className="text-2xl font-light text-white tracking-tight">Engineering Tasks</h2>
                <p className="text-zinc-500 text-xs mt-1 font-mono uppercase">SPRINT 12 • TRACKSIDE OPERATIONS</p>
            </div>
            <div className="flex gap-2">
                <div className="flex -space-x-2">
                     <div className="w-8 h-8 rounded-full border border-black bg-zinc-800 flex items-center justify-center text-xs text-white z-10">M</div>
                     <div className="w-8 h-8 rounded-full border border-black bg-zinc-800 flex items-center justify-center text-xs text-white">S</div>
                </div>
                <button 
                    onClick={() => openModal()}
                    className="ml-4 flex items-center gap-2 bg-isuzu-red hover:bg-red-600 text-white px-4 py-1.5 rounded text-sm transition-colors"
                >
                    <Plus className="w-4 h-4" /> New Task
                </button>
            </div>
        </div>
        <div className="flex gap-6 h-full overflow-x-auto pb-4">
            <Column title="Backlog" status={TaskStatus.TODO} />
            <Column title="In Progress" status={TaskStatus.IN_PROGRESS} />
            <Column title="Completed" status={TaskStatus.DONE} />
        </div>

        {/* Create/Edit Task Modal */}
        {isModalOpen && (
            <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-lg glass-panel rounded-xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh]">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center">
                        <h3 className="text-lg font-light text-white">{editingTaskId ? 'Edit Task' : 'Create New Task'}</h3>
                        <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-6 space-y-4 overflow-y-auto">
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Title</label>
                            <input 
                                type="text" 
                                className="w-full bg-zinc-900 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-isuzu-red outline-none"
                                placeholder="e.g. Adjust camber settings"
                                value={newTask.title}
                                onChange={e => setNewTask({...newTask, title: e.target.value})}
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Priority</label>
                                <select 
                                    className="w-full bg-zinc-900 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-isuzu-red outline-none appearance-none"
                                    value={newTask.priority}
                                    onChange={e => setNewTask({...newTask, priority: e.target.value as Priority})}
                                >
                                    {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Assignee</label>
                                <select 
                                    className="w-full bg-zinc-900 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-isuzu-red outline-none appearance-none"
                                    value={newTask.assignee}
                                    onChange={e => setNewTask({...newTask, assignee: e.target.value})}
                                >
                                    <option value="Eng. Team">Eng. Team</option>
                                    <option value="M. Sato">M. Sato</option>
                                    <option value="J. Doe">J. Doe</option>
                                    <option value="Pit Crew A">Pit Crew A</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Description</label>
                            <textarea 
                                className="w-full bg-zinc-900 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-isuzu-red outline-none min-h-[100px]"
                                placeholder="Details about the task..."
                                value={newTask.description}
                                onChange={e => setNewTask({...newTask, description: e.target.value})}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Due Date</label>
                                <input 
                                    type="date"
                                    className="w-full bg-zinc-900 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-isuzu-red outline-none"
                                    value={newTask.dueDate || ''}
                                    onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Attachment</label>
                                <div className="relative">
                                    <input 
                                        type="file"
                                        className="w-full bg-zinc-900 border border-white/10 rounded px-3 py-1.5 text-xs text-zinc-400 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700"
                                        onChange={e => {
                                            if(e.target.files?.[0]) {
                                                setNewTask({...newTask, attachment: e.target.files[0].name})
                                            }
                                        }}
                                    />
                                    <Paperclip className="absolute right-3 top-2 w-4 h-4 text-zinc-600 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border-t border-white/10 flex justify-end gap-2 bg-zinc-900/50">
                        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">Cancel</button>
                        <button onClick={saveTask} className="px-6 py-2 bg-isuzu-red text-white text-sm font-medium rounded hover:bg-red-600 transition-colors flex items-center gap-2">
                            <Save className="w-4 h-4" /> {editingTaskId ? 'Update Task' : 'Save Task'}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default Task;