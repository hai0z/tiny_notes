import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Drawer: undefined;
  AddNote: undefined;
  RecycleBin: undefined;
  NoteDetail: {
    _id: string;
    noteColor: string;
  };
  Archive: undefined;
  Setting: undefined;
  Search: undefined;
  Login: undefined;
  Register: undefined;
};

export type navigation<T extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>;

export type route<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>;
