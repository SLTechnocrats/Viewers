import React from 'react';
import { useRef } from 'react';
import BundledEditor from './BundledEditor'; // Import BundledEditor
import { Editor } from 'tinymce';
import './index.css';
import axios from 'axios';

export interface EditorProps {
  onChange?: (content: string) => void;
  initialValue?: string;
  minWidth?: number;
  width?: string | number;
  minHeight?: number;
  height?: string | number;
}

export function TinyMceEditor(props: EditorProps) {
  // Use ref for getting the TinyMCE editor instance
  const editorRef = useRef<Editor | null>(null);
  // Function to upload the image to S3

  // Function to upload the image to S3
  const uploadImageHandler = async (
    blobInfo: any,
    _progress: any,
    resolve: (value: string | PromiseLike<string>) => void,
    reject: (reason?: any) => void
  ) => {
    try {
      const url = await imageUploadFn(blobInfo.blob());
      if (!url) {
        reject('Error while uploading');
      } else {
        resolve(url);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const imageUploadFn = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const API_URL = `${'/'}/${1}`;

      const headers = {
        'Content-Type': 'multipart/form-data',
      };

      const { status: apiStatus, data: apiData } = await axios.post(API_URL, formData, headers);

      if (apiStatus === 200) {
        const { statusCode, data } = apiData;
        if (statusCode === 200) {
          return 'AWS_BUCKET_URL' + '/' + data;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  return (
    <BundledEditor
      onEditorChange={(a: string) => props.onChange && props.onChange(a)}
      onInit={(_: any, editor: Editor | null) => (editorRef.current = editor)}
      value={props.initialValue}
      init={{
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
          'insertfile undo redo | blocks | fontfamily | fontsizeinput fontsize | formatselect fontsizeselect fontselect | bold italic underline | forecolor backcolor emoticons | lineheight | checklist numlist bullist outdent indent | alignleft aligncenter alignright alignjustify | link image | table',
        width: props.width,
        min_width: props.minWidth,
        menubar: false,
        font_size_formats: '8px 10px 12px 14px 16px 18px 24px 36px 48px',
        font_family_formats:
          'Times New Roman=times new roman,times,serif;' +
          'Andale Mono=andale mono,times; ' +
          'Arial=arial,helvetica,sans-serif; ' +
          'Arial Black=arial black,avant garde; ' +
          'Book Antiqua=book antiqua,palatino; ' +
          'Comic Sans MS=comic sans ms,sans-serif; ' +
          'Courier New=courier new,courier,monospace; ' +
          'Georgia=georgia,palatino; ' +
          'Helvetica=helvetica; ' +
          'Impact=impact,chicago; ' +
          'Tahoma=tahoma,arial,helvetica,sans-serif; ' +
          'Terminal=terminal,monaco; ' +
          'Trebuchet MS=trebuchet ms,geneva; ' +
          'Verdana=verdana,geneva; ',
        line_height_formats: '0.5 1 1.2 1.4 1.6 2 2.2 2.4 2.6 2.8 3 3.2 3.4 3.6 3.8 4',
        min_height: props.minHeight ?? 500,
        height: props.height,
        resize: true,
        resize_img_proportional: true,
        font_size_input_default_unit: 'px',
        images_upload_handler: (blobInfo: any, progress: any) =>
          new Promise((resolve, reject) => uploadImageHandler(blobInfo, progress, resolve, reject)),
        autoresize_min_height: 400,
        autoresize_max_height: 600,
        autoresize_bottom_margin: 10,
      }}
    />
  );
}
