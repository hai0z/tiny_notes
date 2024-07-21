const noteColor = [
  {
    name: 'transparent',
    light: 'rgba(255, 255, 255, 0)',
    dark: 'rgba(255, 255, 255, 0)',
  },
  {
    name: 'red',
    light: '#faafa8',
    dark: '#77172e',
  },
  {
    name: 'orange',
    light: '#f39f76',
    dark: '#692b17',
  },
  {
    name: 'brownSand',
    light: '#fff8b8',
    dark: '#7c4a03',
  },
  {
    name: 'greenMint',
    light: '#e2f6d3',
    dark: '#264d3b',
  },
  {
    name: 'greenGrey',
    light: '#b4ddd3',
    dark: '#0c625d',
  },
  {
    name: 'smokyGreen',
    light: '#d4e4ed',
    dark: '#256377',
  },
  {
    name: 'darkBlue',
    light: '#aeccdc',
    dark: '#284255',
  },
  {
    name: 'purple',
    light: '#d3bfdb',
    dark: '#472e5b',
  },
  {
    name: 'pink',
    light: '#f6e2dd',
    dark: '#6c394f',
  },

  {
    name: 'clayBrown',
    light: '#e9e3d4',
    dark: '#4b443a',
  },

  {
    name: 'greyPastel',
    light: '#efeff1',
    dark: '#232427',
  },
];

const noteColorDarkMapper = new Map<string, string>(
  noteColor.map(item => [item.name, item.dark]),
);

const noteColorLightMapper = new Map<string, string>(
  noteColor.map(item => [item.name, item.light]),
);

export {noteColor, noteColorDarkMapper, noteColorLightMapper};
