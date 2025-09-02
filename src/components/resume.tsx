'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownToLine, Download, Eye, File, ExternalLink } from 'lucide-react';
import Image from 'next/image';

export function Resume() {
  // Resume details
  const resumeDetails = {
    title: "Edison's Resume",
    description: 'Full Stack Developer • AI/ML Engineer',
    fileType: 'PDF',
    lastUpdated: 'March 2025',
    fileSize: '219 kb',
    previewImageSrc: '/edison_resume_preview.png', // You'll need to add this image
    downloadUrl: 'https://EdisonWhale.github.io/Edison-resume-2025.pdf',
  };

  const handleDownload = () => {
    // For external URLs, open in a new tab
    window.open(resumeDetails.downloadUrl, '_blank');
  };

  return (
    <div className="mx-auto w-full py-8 font-sans">
      {/* Resume Card */}
      <motion.div
        className="group relative overflow-hidden rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200/60 p-0 transition-all duration-300 mb-4 shadow-sm hover:shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.0, ease: 'easeOut' }}
      >
        {/* Details area */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-foreground">
                {resumeDetails.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {resumeDetails.description}
              </p>
              <div className="mt-1 flex text-xs text-muted-foreground">
                <span>{resumeDetails.fileType}</span>
                <span className="mx-2">•</span>
                <span>Updated {resumeDetails.lastUpdated}</span>
                <span className="mx-2">•</span>
                <span>{resumeDetails.fileSize}</span>
              </div>
            </div>

            {/* Download button */}
            <motion.button
              onClick={handleDownload}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Download PDF"
            >
              <Download className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* PDF Preview - Always Visible */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="w-full rounded-xl overflow-hidden border border-gray-200/60 bg-white/85 backdrop-blur-sm shadow-lg"
      >
        <div className="bg-gray-50/90 px-4 py-3 flex items-center justify-between border-b border-gray-200/40">
          <div className="flex items-center gap-2">
            <File className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Resume Preview</span>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-500/90 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md backdrop-blur-sm"
          >
            <ExternalLink className="h-3 w-3" />
            Open Full
          </button>
        </div>
        
        <div className="w-full h-[1000px] bg-gray-50/60">
          <iframe
            src={resumeDetails.downloadUrl}
            width="100%"
            height="100%"
            className="border-0"
            title="Resume Preview"
          />
        </div>
      </motion.div>
    </div>
  );
}

export default Resume;