import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const MediaProgressBar = ({isMediaUploading, progressPercentence}) => {
  
  const [showProcess, setShowProgress] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (isMediaUploading) {
      setShowProgress(true);
      setAnimatedProgress(progressPercentence);
    } else {
      const timer = setTimeout(() => {
        setShowProgress(false);
      }, 500);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isMediaUploading, progressPercentence]);

  if (!showProcess) return null;
  return (
    <div className="w-full bg-gray-200 rounded-full h-3 mt-5 relative overflow-hidden">
      <motion.div
        className="bg-blue-600 h-3 rounded-full"
        initial={{ width: 0 }}
        animate={{
          width: `${animatedProgress}%`,
          transition: { duration: 0.1, ease: "easeInOut" },
        }}
      >
        {progressPercentence >= 100 && isMediaUploading && (
          <motion.div
            className="absolute w-full top-0 left-0 right-0 bottom-0 bg-blue-200 opacity-50"
            animate={{
              x: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        )}
      </motion.div>
    </div>
  );
};

export default MediaProgressBar;
