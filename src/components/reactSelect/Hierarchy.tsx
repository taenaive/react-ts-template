/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState, Component } from 'react';
import Select, { components } from 'react-select';
import styles from './hierarchy.module.css';
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
  disabled?: boolean;
  expandTrigger?: 'click' | 'hover';
  fieldNames?: FieldNames;
  items: Item[];
  onSelect?: (value: string, selectedItems: Omit<Item, 'children'>[]) => void;
  separatorIcon?: string;
  value: string;
}

const Option = (props:any) => {
  console.log(props);
  return (
    // eslint-disable-next-line react/destructuring-assignment
    <div className={classNames({
      [styles['flex-container']]: true,
    })}
    >
      <span className={classNames({
        [styles[`level${props.data.level}`]]: true,
        [styles['flex-child']]: true,
      })}
      >
        <i className="fa fa-chevron-right" />
      </span>
      <components.Option {...props} />
    </div>
  );
};

// eslint-disable-next-line react/require-default-props
const Hierarchy = ({ fieldNames, items }:{fieldNames?:FieldNames,
                                  items: Item[]}): JSX.Element => {
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
    <div>
      <div>
        Identification Type
      </div>
      <Select components={{ Option }} options={flatItems} />
    </div>
  );
};

export default Hierarchy;
