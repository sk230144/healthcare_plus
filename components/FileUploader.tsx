"use client";

import React, { useCallback } from 'react'


type FileUploaderProps = {
    files: File[] | undefined;
    onChange: (files: File[]) => void;
  };

  export const FileUploader = ({ files, onChange }: FileUploaderProps) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
      onChange(acceptedFiles);
    }, []);
  
   
  
    return (
      <div className="file-upload">
         Uplaod File
      </div>
    );
  };