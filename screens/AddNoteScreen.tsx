import {View, TextInput, Image, Dimensions} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {IconButton, Portal, useTheme} from 'react-native-paper';
import {useRealm, useUser} from '@realm/react';
import {BSON, UpdateMode} from 'realm';
import NoteSchema from '../model/NoteSchema';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {navigation} from '../types/stackParamlist';
import AddNoteBottomTab from '../components/AddNoteBottomTab';
import {GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {useAppStore} from '../zustand/appStore';
import {
  noteColorDarkMapper,
  noteColorLightMapper,
} from '../constants/noteColor';
import {
  noteBackgroundDarkMapper,
  noteBackgroundLightMapper,
} from '../constants/noteBackground';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

const AddNoteScreen = () => {
  const theme = useTheme();
  const realm = useRealm();
  const navigation = useNavigation<navigation<'AddNote'>>();
  const noteContentRef = React.useRef<TextInput>(null);

  const user = useUser();
  const themeMode = useAppStore(state => state.theme);
  const {currentNote, setCurrentNote} = useAppStore();

  console.log(user.id);
  const noteId = useMemo(() => {
    return new BSON.ObjectId();
  }, []);

  const handleChooseColor = (color: string) => {
    setCurrentNote({...currentNote, color: color} as NoteSchema);
  };

  const handleChooseBackground = (background: string) => {
    setCurrentNote({...currentNote, image: background} as NoteSchema);
  };

  useEffect(() => {
    noteContentRef.current?.focus();
    return () =>
      setCurrentNote({
        color: 'transparent',
        title: '',
        content: '',
        image: '',
      } as NoteSchema);
  }, []);

  useEffect(() => {
    if (currentNote.title.length > 0 || currentNote.content.length > 0) {
      handleAddNote();
    }
  }, [currentNote]);

  const handleAddNote = () => {
    realm.write(() => {
      realm.create<NoteSchema>(
        'Note',
        {
          _id: noteId,
          title: currentNote.title,
          content: currentNote.content,
          image: currentNote.image,
          color: currentNote.color,
          owner_id: user.id,
        },
        UpdateMode.Modified,
      );
    });
  };
  return (
    <GestureHandlerRootView
      className="flex-1"
      style={{
        backgroundColor:
          currentNote.color === 'transparent'
            ? theme.colors.background
            : themeMode === 'light'
            ? noteColorLightMapper.get(currentNote.color)
            : noteColorDarkMapper.get(currentNote.color),
      }}>
      {currentNote.image && (
        <Image
          source={
            themeMode === 'light'
              ? noteBackgroundLightMapper.get(currentNote.image as string)
              : noteBackgroundDarkMapper.get(currentNote.image as string)
          }
          resizeMode="cover"
          style={{
            width: SCREEN_WIDTH * 2.5,
            height: SCREEN_HEIGHT + 32,
            left: -SCREEN_WIDTH * 1.5,
          }}
          className="-z-10 absolute bottom-0 left-0"
        />
      )}
      <BottomSheetModalProvider>
        <View className="flex flex-row justify-between items-center pt-8 px-2 mb-4">
          <IconButton
            onPress={() => navigation.goBack()}
            icon={() => (
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color={theme.colors.onSurfaceVariant}
              />
            )}
          />
        </View>
        <ScrollView className="px-4 py-2">
          <TextInput
            onChangeText={text => {
              setCurrentNote({...currentNote, title: text} as NoteSchema);
            }}
            multiline
            placeholder="Tiêu đề"
            placeholderTextColor={theme.colors.onSurfaceDisabled}
            style={{
              borderWidth: 0,
              borderColor: 'transparent',
              fontSize: 24,
              color: theme.colors.onBackground,
            }}
          />
          <TextInput
            ref={noteContentRef}
            onChangeText={text => {
              setCurrentNote({...currentNote, content: text} as NoteSchema);
            }}
            multiline
            placeholder="Ghi chú"
            placeholderTextColor={theme.colors.onSurfaceDisabled}
            style={{
              borderWidth: 0,
              borderColor: 'transparent',
              fontSize: 18,
              color: theme.colors.onBackground,
            }}
          />
        </ScrollView>
        <AddNoteBottomTab
          note={currentNote}
          chooseNoteBackground={handleChooseBackground}
          chooseNoteColor={handleChooseColor}
        />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default AddNoteScreen;
