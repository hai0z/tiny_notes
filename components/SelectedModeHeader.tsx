import {View, Text} from 'react-native';
import React from 'react';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeOut,
  FadeOutUp,
} from 'react-native-reanimated';
import {IconButton, useTheme} from 'react-native-paper';
import {Add} from 'iconsax-react-native';
import {MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons';
import {useRealm} from '@realm/react';
import {useAppStore} from '../zustand/appStore';
import checkPinNote from '../utils/checkPinNote';
import NoteSchema from '../model/NoteSchema';
import useModalStore from '../zustand/modalStore';

const SelectedModeHeader = () => {
  const theme = useTheme();
  const realm = useRealm();
  const {setSelectedMode, setSelectedNotes, selectedNotes} = useAppStore();
  const {setChooseColorVisible, showSnackbar} = useModalStore();

  const haveAPin = checkPinNote(selectedNotes);

  const deleteNote = () => {
    if (selectedNotes.length > 0) {
      realm.write(() => {
        selectedNotes.forEach(notes => {
          const note = realm.objectForPrimaryKey(NoteSchema, notes._id);
          if (note) {
            note.is_deleted = true;
            note.deleted_at = new Date();
            note.isPinned = false;
            note.is_archived = false;
          }
        });
      });
      setSelectedNotes([]);
    }
    showSnackbar('Đã chuyển ghi chú vào thùng rác');
  };
  const handlePinNotes = () => {
    const isAllPin = checkPinNote(selectedNotes);
    if (selectedNotes.length > 0) {
      realm.write(() => {
        selectedNotes.forEach(notes => {
          const note = realm.objectForPrimaryKey(NoteSchema, notes._id);
          if (note) {
            note.isPinned = !isAllPin;
            note.is_archived = false;
          }
        });
      });
    }
    if (isAllPin) {
      showSnackbar('Đã bỏ ghim ghi chú');
    } else {
      showSnackbar('Đã ghim ghi chú');
    }
    setSelectedNotes([]);
  };
  const handleArchiveNotes = () => {
    if (selectedNotes.length > 0) {
      realm.write(() => {
        selectedNotes.forEach(notes => {
          const note = realm.objectForPrimaryKey(NoteSchema, notes._id);
          if (note) {
            note.is_archived = true;
            note.isPinned = false;
          }
        });
      });
      setSelectedNotes([]);
      showSnackbar('Đã lưu trữ ghi chú');
    }
  };
  const handleUnArchiveNotes = () => {
    if (selectedNotes.length > 0) {
      realm.write(() => {
        selectedNotes.forEach(notes => {
          const note = realm.objectForPrimaryKey(NoteSchema, notes._id);
          if (note) {
            note.is_archived = false;
            note.isPinned = false;
          }
        });
      });
      setSelectedNotes([]);
      showSnackbar('Đã bỏ lưu trữ ghi chú');
    }
  };
  return (
    <Animated.View
      className="flex-row items-center w-full justify-between h-12"
      entering={FadeInUp.duration(250).delay(250)}>
      <View className="flex-row items-center">
        <IconButton
          icon={() => (
            <Add
              size="32"
              color={theme.colors.onSurface}
              variant="Outline"
              style={{
                transform: [{rotate: '45deg'}],
              }}
            />
          )}
          onPress={() => {
            setSelectedMode(false);
            setSelectedNotes([]);
          }}
        />

        <Text
          className="text-lg font-bold"
          style={{color: theme.colors.onSurface}}>
          {selectedNotes.length}
        </Text>
      </View>
      <Animated.View className="flex-row items-center">
        <IconButton
          onPress={handlePinNotes}
          icon={() => (
            <MaterialCommunityIcons
              name={haveAPin ? 'pin' : 'pin-outline'}
              size={24}
              color={theme.colors.onSurface}
            />
          )}
        />
        <IconButton
          onPress={() => {
            if (selectedNotes[0]?.is_archived) {
              handleUnArchiveNotes();
            } else {
              handleArchiveNotes();
            }
          }}
          icon={() => (
            <MaterialCommunityIcons
              name={
                selectedNotes[0]?.is_archived
                  ? 'archive-arrow-up-outline'
                  : 'archive-arrow-down-outline'
              }
              size={24}
              color={theme.colors.onSurface}
            />
          )}
        />
        <IconButton
          onPress={() => setChooseColorVisible(true)}
          icon={() => (
            <MaterialCommunityIcons
              name="palette-outline"
              size={24}
              color={theme.colors.onSurface}
            />
          )}
        />

        <IconButton
          onPress={deleteNote}
          icon={() => (
            <MaterialIcons
              name="delete-outline"
              size={24}
              color={theme.colors.onSurface}
            />
          )}
        />
      </Animated.View>
    </Animated.View>
  );
};

export default SelectedModeHeader;
