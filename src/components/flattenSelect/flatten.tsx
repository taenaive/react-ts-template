import React, { useEffect, useState } from 'react';
import styles from './flatten.module.css';
import { classNames } from '../helpers';

interface FieldNames {
  value: string;
  label: string;
  children: string;
}

interface Item {
  value?: string | number;
  label?: React.ReactText;
  disabled?: boolean;
  children?: Item[];
  [key: string]: any;
}

interface NormalizeItem extends Item {
  value: string;
  label: string;
  children?: NormalizeItem[];
  level?: number
}

interface Props {
  customInput?: React.ComponentType<any>;
  customInputProps?: { [key: string]: any }; // Generic Object;
  // customStyles?: {
  //   dropdown?: {
  //     className?: string;
  //     style?: React.CSSProperties;
  //   }
  //   dropdownMenu?: {
  //     className?: string;
  //     style?: React.CSSProperties;
  //   };
  //   dropdownMenuItem?: {
  //     className?: string;
  //     style?: React.CSSProperties;
  //   };
  //   dropdownSubitem?: {
  //     className?: string;
  //     style?: React.CSSProperties;
  //   };
  // };
  disabled?: boolean;
  expandTrigger?: 'click' | 'hover';
  fieldNames?: FieldNames;
  items: Item[];
  onSelect?: (value: string, selectedItems: Omit<Item, 'children'>[]) => void;
  separatorIcon?: string;
  value: string;
}

const flatten = ({ fieldNames, items }:{fieldNames?:FieldNames, items: Item[]}): JSX.Element => {
  const [flatItems, setFlatItems] = useState<NormalizeItem[]>([]);

  const normalizeItem = (item: Item): NormalizeItem => {
    const fieldNameTransform = fieldNames || { value: 'value', label: 'label', children: 'children' };
    const {
      value: valueKey,
      label: labelKey,
      children: childrenKey,
    } = fieldNameTransform;
    return {
      // eslint-disable-next-line prefer-object-spread
      ...Object.assign({}, item, {
        [valueKey]: undefined,
        [labelKey]: undefined,
        [childrenKey]: undefined,
        value: item[valueKey],
        label: item[labelKey],
        children: item[childrenKey],
      }),
    };
  };
  const flattenItems = (itemsIn: Item[],
    level: number): NormalizeItem[] => itemsIn.reduce((accum: NormalizeItem[],
    curr): NormalizeItem[] => {
    const {
      children,
      label,
      value,
    } = normalizeItem(curr);
    accum.push({ label, value, level });
    if (children) {
      accum.push(...flattenItems(children, level + 1));
    }

    return accum;
  }, []);
  useEffect(() => {
    setFlatItems(flattenItems(items, 0));
  }, []);
  return (
    <div className={styles.selectdiv}>
      <label htmlFor="#select">
        Identification Type
        <select>
          <option selected> Enter Identification Type </option>
          {flatItems.map((itemN) => (
            <option>
              {Array(itemN.level).fill('=').join('')}
              {'>'}
              {itemN.label}
            </option>
          ))}

        </select>
      </label>
    </div>
  );
};

export default flatten;
