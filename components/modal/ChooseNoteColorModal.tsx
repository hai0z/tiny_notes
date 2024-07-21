import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Portal, Text, Dialog, useTheme} from 'react-native-paper';
import useModalStore from '../../zustand/modalStore';
import {noteColor} from '../../constants/noteColor';
import {useAppStore} from '../../zustand/appStore';
import {useRealm} from '@realm/react';
import NoteSchema from '../../model/NoteSchema';
import areAllFieldsEqual from '../../utils/allFieldEqual';
import {MaterialCommunityIcons} from '@expo/vector-icons';

const ChooseNoteColorModal = () => {
  const realm = useRealm();
  const [visible, setVisible] = useModalStore(state => [
    state.chooseColorVisible,
    state.setChooseColorVisible,
  ]);

  const {selectedNotes, setSelectedNotes} = useAppStore();

  const theme = useTheme();
  const themeMode = useAppStore(state => state.theme);

  const hideModal = () => setVisible(false);

  const allNoteIsSameColor = areAllFieldsEqual(selectedNotes, 'color');

  const borderWidth = (item: (typeof noteColor)[0]) =>
    allNoteIsSameColor && selectedNotes[0]?.color === item.name ? 3 : 0.75;

  const borderColor = (item: (typeof noteColor)[0]) =>
    allNoteIsSameColor && selectedNotes[0]?.color === item.name
      ? theme.colors.primary
      : theme.colors.onBackground;

  const updateNoteColor = (color: string) => {
    if (selectedNotes.length > 0) {
      selectedNotes.forEach(notes => {
        const note = realm.objectForPrimaryKey(NoteSchema, notes._id);
        realm.write(() => {
          if (note) {
            note.color = color;
          }
        });
      });

      hideModal();
      setSelectedNotes([]);
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideModal}>
        <Dialog.Title>Màu ghi chú</Dialog.Title>
        <Dialog.Content>
          <View className="flex flex-wrap w-full flex-row gap-2 justify-center items-center">
            {noteColor.map(item => (
              <TouchableOpacity
                className="justify-center items-center flex flex-col"
                activeOpacity={1}
                key={item.name}
                onPress={() => updateNoteColor(item.name)}
                style={{
                  backgroundColor:
                    themeMode === 'dark' ? item.dark : item.light,
                  width: 50,
                  height: 50,
                  borderRadius: 9999,
                  borderWidth: borderWidth(item),
                  borderColor: borderColor(item),
                }}>
                <View>
                  {allNoteIsSameColor &&
                    selectedNotes[0]?.color === item.name && (
                      <Text>
                        <MaterialCommunityIcons
                          name="check-bold"
                          size={24}
                          color={theme.colors.primary}
                        />
                      </Text>
                    )}
                </View>
                <View>
                  {item.name === 'transparent' &&
                    allNoteIsSameColor &&
                    selectedNotes[0]?.color !== item.name && (
                      <Text>
                        <MaterialCommunityIcons
                          name="water-off-outline"
                          size={32}
                          color={theme.colors.onBackground}
                        />
                      </Text>
                    )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

export default ChooseNoteColorModal;
