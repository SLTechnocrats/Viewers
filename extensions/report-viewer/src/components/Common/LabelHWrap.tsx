import React from 'react';
import classNames from 'classnames';
import { FunctionComponent } from 'react';

interface LabelContainerProps {
  label: string;
  children: React.ReactNode;
  bold?: boolean;
  style?: React.CSSProperties;
}

const LabelHWrap: FunctionComponent<LabelContainerProps> = ({ label, children, bold, style }) => {
  return (
    <div className="flex flex-row flex-wrap justify-between">
      <div className="w-[25%]">
        <h3
          style={style}
          className={classNames(
            'min-w-max text-sm font-normal capitalize text-black',
            bold && 'font-bold'
          )}
        >
          {label}
        </h3>
      </div>
      <div className="text-wrap w-[75%] p-1 text-sm capitalize">{children}</div>
    </div>
  );
};

export default LabelHWrap;
