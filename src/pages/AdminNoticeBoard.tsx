// src/components/AdminNoticeBoard.tsx
import React from 'react';
import { Save, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface AdminNoticeBoardProps {
  noticeContent: string;
  setNoticeContent: (content: string) => void;
  isSavingNotice: boolean;
  noticeMessage: { type: 'success' | 'error', text: string } | null;
  handleSaveNotice: () => void;
}

export const AdminNoticeBoard: React.FC<AdminNoticeBoardProps> = ({
  noticeContent,
  setNoticeContent,
  isSavingNotice,
  noticeMessage,
  handleSaveNotice
}) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Notice Board</h1>
          <p className="text-indigo-600 font-bold italic tracking-wide text-sm">Update the announcement displayed on the Contact page</p>
        </div>
        <button 
          onClick={handleSaveNotice}
          disabled={isSavingNotice}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
        >
          {isSavingNotice ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span>{isSavingNotice ? 'Saving...' : 'Save Notice'}</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {noticeMessage && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={cn(
              "mb-8 p-4 rounded-2xl border flex items-center space-x-3",
              noticeMessage.type === 'success' ? "bg-green-50 border-green-100 text-green-700" : "bg-red-50 border-red-100 text-red-700"
            )}
          >
            <div className={cn(
              "w-2 h-2 rounded-full",
              noticeMessage.type === 'success' ? "bg-green-500" : "bg-red-500"
            )} />
            <span className="font-bold text-sm">{noticeMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Announcement Content</label>
              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-50 px-2 py-1 rounded-full uppercase tracking-tighter">Supports Any Language</span>
            </div>
            <textarea 
              rows={20}
              value={noticeContent}
              onChange={(e) => setNoticeContent(e.target.value)}
              placeholder="Enter the notice board content here... Use new lines for spacing."
              className="w-full px-8 py-8 rounded-[2rem] bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-lg leading-relaxed resize-none"
            />
          </div>
          
          <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
            <p className="text-sm text-amber-700">
              <span className="font-black">Note:</span> This content will be displayed on the SafarSathi Notice Board on the contact page. You can paste unlimited text and use any language support (Hindi, Marathi, etc.).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};