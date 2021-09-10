import React, { useState } from 'react';
// import CascadeSelect from './components/cascade/CascadeSelect';
// import Flatten from './components/flattenSelect/flatten';
import Hierarchy, { NormalizeItem } from './components/reactSelect/Hierarchy';

function App(): JSX.Element {
  const items = [
    {
      value: '1',
      label: 'Menu 1',
      children: [
        {
          value: '11',
          label: 'Another Item',
        },
        {
          value: '12',
          label: 'More Items',
          children: [
            {
              value: '121',
              label: 'Sub Item AAAAAAAAAAA AAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAAAAAAA AAAAAAAAAAAAAAAAAAAAA',
            },
            {
              value: '122',
              label: 'Sub Item B',
              disabled: true,
            },
            {
              value: '123',
              label: 'Sub Item C',
            },
          ],
        },
      ],
    },
    {
      value: '2',
      label: 'Menu 2',
    },
    {
      value: '3',
      label: 'Menu 3',
      children: [
        {
          value: '31',
          label: 'Hello',
        },
        {
          value: '21',
          label: 'World',
        },
      ],
    },
  ];
  const [dropdownValue, setDropdownValue] = useState<NormalizeItem>();
  return (
    <div className="App">
      <header className="App-header">
        selected:
        {' '}
        {dropdownValue && dropdownValue.label}

      </header>
      <main>
        value:
        {' '}
        {dropdownValue && dropdownValue.value}
        {/* <CascadeSelect
          items={items}
          onSelect={(value, selectedItems) => {
            console.log(value, selectedItems);
            setDropdownValue(value);
          }}
          value={dropdownValue}
        /> */}
        {/* <Flatten items={items} /> */}
        <Hierarchy
          closeMenuOnSelect={false}
          onChange={(v:NormalizeItem) => { setDropdownValue(v); }}
          items={items}
          defaultValue="12"
          dropdownValue={dropdownValue}
        />
      </main>
    </div>
  );
}

export default App;
