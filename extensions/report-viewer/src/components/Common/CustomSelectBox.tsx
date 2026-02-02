import React, { useEffect, useState } from 'react';
import Select, { StylesConfig } from 'react-select';
import * as _ from 'lodash';
import Colors from '../../theme/Colors';

interface OwnProps {
  label: string;
  value: string | number | null;
  setValue: (val: any) => void;
  options: any[];
  disabled?: boolean;
}

type Props = OwnProps;

const CustomSelectBox: React.FC<Props> = ({
  label,
  value,
  setValue,
  options,
  disabled = false,
}) => {
  const selectStyles: StylesConfig<{ label: string; value: string; color: string }, true> = {
    option: baseStyles => {
      return {
        ...baseStyles,
        color: 'black',
      };
    },
    container: baseStyles => {
      return {
        ...baseStyles,
        width: '100%',
        backgroundColor: Colors.white,
      };
    },
    singleValue: baseStyle => {
      return {
        ...baseStyle,
        paddingLeft: '10px',
        paddingRight: '10px',
      };
    },
    menu: baseStyles => {
      return {
        ...baseStyles,
        zIndex: 1000,
      };
    },
  };

  const [selected, setSelected] = useState<any>({
    value: '',
    label: label,
    color: 'black',
  });

  useEffect(() => {
    if (_.isArray(options)) {
      const item = options.find(item => item.value === value);
      if (item !== undefined && item !== null) {
        setSelected(item);
      } else {
        setSelected({ color: '', label: label, value: '' });
      }
    }
  }, [options, value]);

  return (
    <Select
      isDisabled={disabled}
      value={selected}
      styles={selectStyles}
      onChange={item => setValue(item)}
      options={options}
      className="bg-white text-xs font-normal text-black"
      placeholder={label}
    />
  );
};

export default CustomSelectBox;
