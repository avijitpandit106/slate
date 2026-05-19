'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({
  children,
  isOpen,
  onClose,
}: {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-3xl rounded-2xl shadow-xl max-h-[90vh] mx-4"
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 12,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.96,
              y: 12,
            }}
            transition={{
              duration: 0.2,
              ease: 'easeOut',
            }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}