import React from 'react';
import { motion } from 'framer-motion';

export default function Animation({children}) {

  const animations = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  return (
    <motion.div
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 1 }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}
