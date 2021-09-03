import React, { useState } from 'react';
import CascadeSelect from './components/CascadeSelect';

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
              label: 'Sub Item A',
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
  const [dropdownValue, setDropdownValue] = useState<string>();
  return (
    <div className="App">
      <header className="App-header">
        Hola
      </header>
      <main>
        <CascadeSelect
          customStyles={{
            dropdown: {
              style: {
                margin: '5px 20px 15px 20px',
              },
            },
          }}
          items={items}
          onSelect={(value, selectedItems) => {
            console.log(value, selectedItems);
            setDropdownValue(value);
          }}
          value={dropdownValue}
        />
      </main>
    </div>
  );
}

export default App;
