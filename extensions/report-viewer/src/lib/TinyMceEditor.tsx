import React, { useRef, useLayoutEffect } from 'react';
import BundledEditor from './BundledEditor'; // Make sure this path is correct
import { Editor } from 'tinymce';
import './index.css'; // Your component-specific styles
import axios from 'axios';

// Define the props for your component
export interface EditorProps {
  onChange?: (content: string) => void;
  initialValue?: string;
  minWidth?: number;
  width?: string | number;
  minHeight?: number;
  height?: string | number;
}

export function TinyMceEditor(props: EditorProps) {
  const editorRef = useRef<Editor | null>(null);

  // Ref to store the last two scroll positions
  const scrollPositionsRef = useRef<number[]>(
    JSON.parse(sessionStorage.getItem('reportPanelScrolls') || '[]')
  );

  // Helper to add new scroll positions and keep the array size at 2
  const addScrollPosition = (pos: number) => {
    scrollPositionsRef.current.push(pos);
    if (scrollPositionsRef.current.length > 2) {
      scrollPositionsRef.current.shift();
    }
    sessionStorage.setItem('reportPanelScrolls', JSON.stringify(scrollPositionsRef.current));
  };

  useLayoutEffect(() => {
    const panel = document.getElementById('report-panel');
    if (!panel) return;

    // On initial load, restore the "true" last position
    const lastValidPosition =
      scrollPositionsRef.current.length > 0 ? scrollPositionsRef.current[0] : 0;
    panel.scrollTop = lastValidPosition;

    const handleScroll = () => {
      addScrollPosition(panel.scrollTop);
    };

    panel.addEventListener('scroll', handleScroll);

    return () => {
      panel.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // --- Image Upload Logic (unchanged) ---
  const uploadImageHandler = async (
    blobInfo: any,
    _progress: any,
    resolve: (value: string | PromiseLike<string>) => void,
    reject: (reason?: any) => void
  ) => {
    try {
      const url = await imageUploadFn(blobInfo.blob());
      if (url) {
        resolve(url);
      } else {
        reject('Error during image upload');
      }
    } catch (error) {
      console.error('Upload handler failed:', error);
      reject('Upload handler failed');
    }
  };

  const imageUploadFn = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const API_URL = `/${1}`;
      const headers = { 'Content-Type': 'multipart/form-data' };
      const { status: apiStatus, data: apiData } = await axios.post(API_URL, formData, { headers });

      if (apiStatus === 200) {
        const { statusCode, data } = apiData;
        if (statusCode === 200) {
          return 'AWS_BUCKET_URL' + '/' + data;
        }
      }
      return null;
    } catch (error) {
      console.error('API call for image upload failed:', error);
      return null;
    }
  };

  return (
    <BundledEditor
      onEditorChange={(content: string) => props.onChange && props.onChange(content)}
      onInit={(_: any, editor: Editor | null) => (editorRef.current = editor)}
      value={props.initialValue}
      init={{
        // --- TinyMCE Configuration (unchanged) ---
        plugins: [
          'advlist',
          'autolink',
          'lists',
          'link',
          'image',
          'charmap',
          'preview',
          'hr',
          'anchor',
          'pagebreak',
          'searchreplace',
          'wordcount',
          'visualblocks',
          'visualchars',
          'code',
          'insertdatetime',
          'media',
          'nonbreaking',
          'table',
          'contextmenu',
          'directionality',
          'emoticons',
          'template',
          'paste',
          'textcolor',
          'colorpicker',
          'textpattern',
          'imagetools',
          'codesample',
          'autoresize',
        ],
        toolbar:
          'insertfile undo redo | blocks | fontfamily | fontsizeinput | bold italic underline | ' +
          'forecolor backcolor emoticons | lineheight | ' +
          'checklist numlist bullist outdent indent | alignleft aligncenter alignright alignjustify | ' +
          'link image | table',
        menubar: false,
        autoresize_min_height: 400,
        autoresize_max_height: 600,
        browser_spellcheck: true,
        autoresize_bottom_margin: 10,
        min_height: 400,
        images_upload_handler: (blobInfo: any, progress: any) =>
          new Promise((resolve, reject) => uploadImageHandler(blobInfo, progress, resolve, reject)),

        // *** FINAL FIX FOR SCROLL ANIMATION ***
        setup: (editor: Editor) => {
          editor.on('focus', () => {
            setTimeout(() => {
              const panel = document.getElementById('report-panel');
              if (panel) {
                const positionToRestore =
                  scrollPositionsRef.current.length > 1
                    ? scrollPositionsRef.current[0]
                    : panel.scrollTop;

                // 1. Temporarily disable smooth scrolling
                panel.style.scrollBehavior = 'auto';

                // 2. Set the scroll position instantly
                panel.scrollTop = positionToRestore;

                // 3. Reset the style so it returns to its previous state (e.g., 'smooth')
                panel.style.scrollBehavior = '';
              }
            }, 1);
          });
        },
      }}
    />
  );
}
