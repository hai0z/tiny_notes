import {
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Image,
  useColorScheme,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {IconButton, Portal, useTheme} from 'react-native-paper';
import {useObject, useRealm} from '@realm/react';
import {BSON, UpdateMode} from 'realm';
import NoteSchema from '../model/NoteSchema';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {navigation, route} from '../types/stackParamlist';
import AddNoteBottomTab from '../components/AddNoteBottomTab';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {useAppStore} from '../zustand/appStore';
import {
  noteColorDarkMapper,
  noteColorLightMapper,
} from '../constants/noteColor';
import {
  noteBackgroundDarkMapper,
  noteBackgroundLightMapper,
} from '../constants/noteBackground';
import Animated, {SharedTransition, withSpring} from 'react-native-reanimated';
import useKeyBoardStatus from '../hooks/useKeyBoardState';
import useModalStore from '../zustand/modalStore';
import NoteInfoDialog from '../components/modal/NoteInfoDialog';
import RichEditors from '../components/RichEditor';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;
const NoteDetailScreen = ({route}: {route: route<'NoteDetail'>}) => {
  const theme = useTheme();
  const realm = useRealm();
  const navigation = useNavigation<navigation<'AddNote'>>();
  const noteContentRef = React.useRef<TextInput>(null);

  const themeMode = useAppStore(state => state.theme);
  const {showSnackbar} = useModalStore();
  const {_id} = route.params;

  const noteId = new BSON.ObjectId(_id);

  const noteDetail = useObject<NoteSchema>(NoteSchema, noteId);

  const [noteState, setNoteState] = useState<NoteSchema | null>(noteDetail);

  const noteScrollViewRef = useRef<ScrollView>(null);

  const keyboardVisible = useKeyBoardStatus();

  const [updateCount, setUpdateCount] = useState(0);

  const [noteInfoVisible, setNoteInfoVisible] = useState(false);

  const hideNoteInfo = () => {
    setNoteInfoVisible(false);
  };

  const handleUpdateNote = () => {
    setUpdateCount(updateCount + 1);
    const noteToUpdate = realm.objectForPrimaryKey<NoteSchema>('Note', noteId);
    realm.write(() => {
      if (noteToUpdate) {
        noteToUpdate.title = noteState?.title!;
        noteToUpdate.content = noteState?.content!;
        noteToUpdate.color = noteState?.color!;
        noteToUpdate.image = noteState?.image;
      }
      if (updateCount > 1 && noteToUpdate) {
        noteToUpdate.updated_at = new Date();
      }
    });
  };
  const handleChooseColor = (color: string) => {
    setNoteState({...noteState, color: color} as NoteSchema);
  };

  const handleChooseBackground = (background: string) => {
    setNoteState({...noteState, image: background} as NoteSchema);
  };

  useEffect(() => {
    handleUpdateNote();
  }, [noteState]);

  useEffect(() => {
    if (keyboardVisible) {
      noteScrollViewRef.current?.scrollToEnd({animated: true});
    }
  }, [keyboardVisible]);

  const handleArchiveNote = () => {
    realm.write(() => {
      const noteToUpdate = realm.objectForPrimaryKey<NoteSchema>(
        'Note',
        noteId,
      );
      if (noteToUpdate) {
        noteToUpdate.is_archived = !noteToUpdate.is_archived;
      }
    });
    if (noteDetail?.is_archived) {
      navigation.navigate('Home');
      setTimeout(() => {
        showSnackbar('Đã lưu trữ ghi chú');
      }, 500);
    }
  };

  const handlePinNote = () => {
    realm.write(() => {
      const noteToUpdate = realm.objectForPrimaryKey<NoteSchema>(
        'Note',
        noteId,
      );
      if (noteToUpdate) {
        noteToUpdate.isPinned = !noteToUpdate.isPinned;
      }
    });
  };
  const handleLockNote = () => {
    realm.write(() => {
      const noteToUpdate = realm.objectForPrimaryKey<NoteSchema>(
        'Note',
        noteId,
      );
      if (noteToUpdate) {
        noteToUpdate.isLocked = !noteToUpdate.isLocked;
      }
    });
    if (noteDetail?.isLocked) {
      navigation.navigate('Home');
      setTimeout(() => {
        showSnackbar('Đã khoá ghi chú');
      }, 500);
    }
  };
  return (
    <GestureHandlerRootView
      className="flex-1"
      style={{
        backgroundColor:
          themeMode === 'dark'
            ? noteColorDarkMapper.get(noteDetail?.color as string)
            : noteColorLightMapper.get(noteDetail?.color as string),
      }}>
      {noteDetail?.image && (
        <Animated.Image
          source={
            themeMode === 'light'
              ? noteBackgroundLightMapper.get(noteDetail?.image as string)
              : noteBackgroundDarkMapper.get(noteDetail?.image as string)
          }
          resizeMode="cover"
          style={{
            width: SCREEN_WIDTH * 2.5,
            height: SCREEN_HEIGHT + 100,
            left: -SCREEN_WIDTH * 1.45,
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
                color={theme.colors.onSurface}
              />
            )}
          />
          <View className="flex flex-row items-center">
            <IconButton
              onPress={handlePinNote}
              icon={() => (
                <MaterialCommunityIcons
                  name={!noteDetail?.isPinned ? 'pin-outline' : 'pin'}
                  size={24}
                  color={theme.colors.onSurface}
                />
              )}
            />
            <IconButton
              onPress={handleArchiveNote}
              icon={() => (
                <MaterialCommunityIcons
                  name={
                    !noteDetail?.is_archived
                      ? 'archive-arrow-down-outline'
                      : 'archive-arrow-up-outline'
                  }
                  size={24}
                  color={theme.colors.onSurface}
                />
              )}
            />
            <IconButton
              onPress={handleLockNote}
              icon={() => (
                <MaterialCommunityIcons
                  name={noteDetail?.isLocked ? 'lock' : 'lock-open-outline'}
                  size={24}
                  color={theme.colors.onSurface}
                />
              )}
            />
            <IconButton
              onPress={() => setNoteInfoVisible(true)}
              icon={() => (
                <MaterialCommunityIcons
                  name="information-outline"
                  size={24}
                  color={theme.colors.onSurface}
                />
              )}
            />
          </View>
        </View>
        <ScrollView ref={noteScrollViewRef}>
          <View className="px-4 py-2">
            <TextInput
              value={noteState?.title}
              onChangeText={text => {
                setNoteState({...noteState, title: text} as NoteSchema);
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
              value={noteState?.content}
              onChangeText={text => {
                setNoteState({...noteState, content: text} as NoteSchema);
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
          </View>
          {noteDetail?.image !== '' && noteDetail?.color !== 'transparent' && (
            <View className="px-4 py-2">
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  backgroundColor:
                    themeMode === 'light'
                      ? noteColorLightMapper.get(noteState?.color as string)
                      : noteColorDarkMapper.get(noteState?.color as string),
                  borderWidth: 0.75,
                  borderColor: theme.colors.primary,
                }}
              />
            </View>
          )}
        </ScrollView>
        {/* <RichEditors /> */}
        <AddNoteBottomTab
          chooseNoteBackground={handleChooseBackground}
          chooseNoteColor={handleChooseColor}
          note={noteState}
        />
      </BottomSheetModalProvider>
      <NoteInfoDialog
        visible={noteInfoVisible}
        hideDialog={hideNoteInfo}
        note={noteDetail!}
      />
    </GestureHandlerRootView>
  );
};

export default NoteDetailScreen;
