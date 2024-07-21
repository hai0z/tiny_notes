const noteBackground = [
  {
    name: '',
    light: null,
    dark: null,
  },
  {
    name: 'grocery',
    light: require('../assets/images/grocery_light_0609.png'),
    dark: require('../assets/images/grocery_dark_0609.png'),
    lightColor: '#f8f3e0',
    darkColor: '#374b6e',
  },
  {
    name: 'food',
    light: require('../assets/images/food_light_0609.png'),
    dark: require('../assets/images/food_dark_0609.png'),
    lightColor: '#ffe8e0',
    darkColor: '#3a5d63',
  },
  {
    name: 'music',
    light: require('../assets/images/music_light_0609.png'),
    dark: require('../assets/images/music_dark_0609.png'),
    lightColor: '#bad6ec',
    darkColor: '#383838',
  },
  {
    name: 'recipe',
    light: require('../assets/images/recipe_light_0609.png'),
    dark: require('../assets/images/recipe_dark_0609.png'),
    lightColor: '#ffcdb2',
    darkColor: '#511c22',
  },
  {
    name: 'notes',
    light: require('../assets/images/notes_light_0609.png'),
    dark: require('../assets/images/notes_dark_0714.png'),
    lightColor: '#ffe497',
    darkColor: '#392c62',
  },
  {
    name: 'places',
    light: require('../assets/images/places_light_0609.png'),
    dark: require('../assets/images/places_dark_0609.png'),
    lightColor: '#f9F1EE',
    darkColor: '#573a4e',
  },
  {
    name: 'travel',
    light: require('../assets/images/travel_light_0614.png'),
    dark: require('../assets/images/travel_dark_0609.png'),
    lightColor: '#BCDFF2',
    darkColor: '#103258',
  },
  {
    name: 'video',
    light: require('../assets/images/video_light_0609.png'),
    dark: require('../assets/images/video_dark_0609.png'),
    lightColor: '#FFE1B3',
    darkColor: '#424459',
  },
  {
    name: 'celebration',
    light: require('../assets/images/celebration_light_0714.png'),
    dark: require('../assets/images/celebration_dark_0714.png'),
    lightColor: '#FF756B',
    darkColor: '#382c50',
  },
];
const noteBackgroundDarkMapper = new Map<string, any>(
  noteBackground.map(item => [item.name, item.dark]),
);

const noteBackgroundLightMapper = new Map<string, any>(
  noteBackground.map(item => [item.name, item.light]),
);

const noteBackgroundColorLightMapper = new Map<string, any>(
  noteBackground.map(item => [item.name, item.lightColor]),
);

const noteBackgroundColorDarkMapper = new Map<string, any>(
  noteBackground.map(item => [item.name, item.darkColor]),
);

export {
  noteBackground,
  noteBackgroundDarkMapper,
  noteBackgroundLightMapper,
  noteBackgroundColorLightMapper,
  noteBackgroundColorDarkMapper,
};
