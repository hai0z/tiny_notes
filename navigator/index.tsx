import React from 'react';
import {
  DrawerContentScrollView,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import {RootStackParamList} from '../types/stackParamlist';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import AddNoteScreen from '../screens/AddNoteScreen';
import DrawerContent from '../components/DrawerContent';
import {useTheme} from 'react-native-paper';
import NoteDetailScreen from '../screens/NoteDetailScreen';
import RecycleBin from '../screens/RecycleBin';
import ArchiveScreen from '../screens/ArchiveScreen';
import SettingScreen from '../screens/SettingScreen';
import {adaptNavigationTheme} from 'react-native-paper';
import {useAppStore} from '../zustand/appStore';
import SearchScreen from '../screens/SearchScreen';
import {StatusBar} from 'expo-status-bar';
import BottomNavigationBar from './BottomNavigation';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Drawer = createDrawerNavigator<RootStackParamList>();

const Stack = createNativeStackNavigator<RootStackParamList>();

const {LightTheme} = adaptNavigationTheme({reactNavigationLight: DefaultTheme});

const {DarkTheme} = adaptNavigationTheme({
  reactNavigationDark: NavigationDarkTheme,
});

const DrawerNavigator = () => {
  const theme = useTheme();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {backgroundColor: 'transparent'},
      }}
      drawerContent={props => (
        <DrawerContentScrollView
          {...props}
          style={{backgroundColor: theme.colors.background, borderRadius: 20}}>
          <DrawerContent state={props.state} />
        </DrawerContentScrollView>
      )}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="RecycleBin" component={RecycleBin} />
      <Stack.Screen name="Archive" component={ArchiveScreen} />
    </Drawer.Navigator>
  );
};

export const DrawerWrapper = () => {
  const theme = useAppStore(state => state.theme);

  return (
    <>
      <StatusBar
        style={theme === 'dark' ? 'light' : 'dark'}
        backgroundColor="transparent"
      />
      <DrawerNavigator />
    </>
  );
};
const Navigator = () => {
  const theme = useAppStore(state => state.theme);

  return (
    <NavigationContainer theme={theme === 'dark' ? DarkTheme : LightTheme}>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Drawer">
        <Stack.Screen name="Drawer" component={DrawerWrapper} />
        <Stack.Screen
          name="AddNote"
          component={AddNoteScreen}
          options={{animation: 'slide_from_right'}}
        />
        <Stack.Screen
          name="Setting"
          component={SettingScreen}
          options={{
            animation: 'fade_from_bottom',
          }}
        />
        <Stack.Screen
          name="NoteDetail"
          component={NoteDetailScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
