import React, { useState } from 'react';
import { MdEdit } from 'react-icons/md';
import { FaEye } from 'react-icons/fa';
import { ReportAnalysisTypes } from '../../types/ReportAnalysisTypes';
import { TinyMceEditor } from '../../lib/TinyMceEditor';
import { formatContent } from '../../utils/utils';

interface OwnProps {
  sectionName: string;
  value: string;
  dataName: string;
  isEditEnabled: boolean;
  onChangeValue: (dataName: string, diagnosisText: string) => void;
   onDraftChange?: (draftContent: string) => void;
}

type Props = OwnProps;

const DiagnosisSection: React.FC<Props> = ({ ...props }) => {
  const [isEdit, setIsEdit] = useState(true);

  const onChangeValue = (encodedHtml: string) => {
    props.onChangeValue(props.dataName, encodedHtml);
     if(props.onDraftChange){
      props.onDraftChange(encodedHtml)
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between text-black">
        <strong>{props.sectionName}</strong>
        <div>
          {props.isEditEnabled && !isEdit && (
            <MdEdit
              className="fill-green-600"
              size={20}
              onClick={() => setIsEdit(true)}
            />
          )}
          {props.isEditEnabled && isEdit && (
            <FaEye
              className="fill-blue-600"
              size={20}
              onClick={() => setIsEdit(false)}
            />
          )}
        </div>
      </div>

      {isEdit && props.isEditEnabled ? (
        <div>
          <br />
          <TinyMceEditor
           key={String(isEdit)}
            height="500px"
            initialValue={formatContent(props.value)}
            onChange={onChangeValue}
          />
        </div>
      ) : (
        <div
          className="text-black"
          dangerouslySetInnerHTML={{ __html: formatContent(props.value) }}
        />
      )}
      <br />
    </div>
  );
};

export default DiagnosisSection;
