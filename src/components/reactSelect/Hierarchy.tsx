/* eslint-disable react/require-default-props */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState, Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
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

export interface NormalizeItem extends Item {
  value: string;
  label: string;
  children?: NormalizeItem[];
  level?: number
  parent?: string;
  haschildren?: boolean;
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
/** Helper recursive func to find all the decendents */
const findDecendents = (flatItems:NormalizeItem[], val:string, toggle:boolean,
  firstStrikeIndex:number) => {
  // out of index protection
  if (firstStrikeIndex >= flatItems.length) return {};
  // initial return value
  let result: {[key: string]: boolean} = { [val]: toggle };
  // Ok, this one has chinren let's add all the decendents
  if (flatItems[firstStrikeIndex].haschildren) {
    // search downward the array for a match
    for (let i = firstStrikeIndex + 1; i < flatItems.length; i += 1) {
      // find child of val using parent pointer
      if (flatItems[i].parent === val) {
        // any child that has this parent gets registered also and repeat til end
        result = { ...result, ...findDecendents(flatItems, flatItems[i].value, toggle, i + 1) };
      }
    }
  }
  return result;
};
const findChildren = (flatItems:NormalizeItem[], val:string, toggle:boolean) => {
  const firstStrikeIndex = flatItems.findIndex((r) => r.value === val);
  return findDecendents(flatItems, val, toggle, firstStrikeIndex);
};

const Hierarchy = ({
  fieldNames, items, closeMenuOnSelect, onChange, defaultValue, dropdownValue,
}:{fieldNames?:FieldNames,
    items: Item[],
    closeMenuOnSelect:boolean,
    onChange : (...args: any[])=>void,
    defaultValue: string,
    dropdownValue: NormalizeItem}): JSX.Element => {
  const [flatItems, setFlatItems] = useState<NormalizeItem[]>([]);
  const [showList, setShowList] = useState<{[key: string]: boolean; }>({});
  const [defaultObj, setDefaultObj] = useState<NormalizeItem>();
  const handleExpand = (val:string) => {
    const toggle = !showList[val];
    // check children and hide them all if parent folds
    // if (toggle/* not show */) {
    findChildren(flatItems, val, toggle);
    // return}

    setShowList({ ...showList, ...findChildren(flatItems, val, toggle) });
  };

  const Option = (props:any) => (
    <div className={classNames({
      [styles['flex-container']]: true,
      [styles['hide-display']]: showList[props.data.parent],
    })}
    >
      <div
        aria-hidden
        className={classNames({
          [styles[`level${props.data.level}`]]: true,
          [styles['flex-child']]: true,
        })}
        onClick={(e) => handleExpand(props.data.value)}
      >
        <FontAwesomeIcon
          icon={showList[props.data.value] ? faChevronRight : faChevronDown}
        />
      </div>
      <components.Option {...props} />
    </div>
  );

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
    level: number, parent: string): NormalizeItem[] => itemsIn.reduce((accum: NormalizeItem[],
    curr): NormalizeItem[] => {
    const {
      children,
      label,
      value,
    } = normalizeItem(curr);
    accum.push({
      label, value, level, parent, haschildren: !!children,
    });
    if (children) {
      accum.push(...flattenItems(children, level + 1, value));
    }

    return accum;
  }, []);
  useEffect(() => {
    const transFormedItems = flattenItems(items, 0, null);
    setFlatItems(transFormedItems);
    const initItem:NormalizeItem = transFormedItems.find((r) => r.value === defaultValue);
    setDefaultObj(initItem);
    onChange(initItem);
  }, []);
  return (
    <div>
      <div>
        Identification Type
      </div>
      <Select
        closeMenuOnSelect={closeMenuOnSelect}
        onChange={onChange}
        components={{ Option }}
        options={flatItems}
        value={dropdownValue}
      />
    </div>
  );
};

export default Hierarchy;
