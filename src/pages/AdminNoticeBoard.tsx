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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto"
    >

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Notice Board
          </h1>
          <p className="text-indigo-600 font-semibold mt-1">
            Update announcements for users in real time
          </p>
        </div>

        {/* SAVE BUTTON */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSaveNotice}
          disabled={isSavingNotice}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-7 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-50"
        >
          {isSavingNotice ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {isSavingNotice ? 'Saving...' : 'Save Notice'}
        </motion.button>
      </div>

      {/* MESSAGE */}
      <AnimatePresence>
        {noticeMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              "mb-6 p-4 rounded-2xl border font-semibold shadow-sm",
              noticeMessage.type === 'success'
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            )}
          >
            {noticeMessage.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CARD */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl p-8 relative overflow-hidden"
      >

        {/* glow background */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-200 blur-3xl opacity-30 rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-200 blur-3xl opacity-30 rounded-full" />

        {/* TEXTAREA */}
        <div className="relative z-10">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Announcement Content
          </label>

          <textarea
            rows={18}
            value={noticeContent}
            onChange={(e) => setNoticeContent(e.target.value)}
            placeholder="Write your notice here..."
            className="w-full mt-3 px-6 py-6 rounded-2xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-base leading-relaxed resize-none shadow-inner"
          />

          {/* INFO BOX */}
          <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200">
            <p className="text-sm text-amber-700 font-medium">
              <span className="font-bold">Note:</span> This notice will be visible to all users instantly on the website.
            </p>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
};