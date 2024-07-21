import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {navigation} from '../types/stackParamlist';
import {
  Button,
  Dialog,
  IconButton,
  Menu,
  Portal,
  useTheme,
} from 'react-native-paper';
import {Add, HambergerMenu} from 'iconsax-react-native';
import {useNavigation} from '@react-navigation/native';
import {DrawerActions} from '@react-navigation/native';
import {useQuery, useRealm, useUser} from '@realm/react';
import NoteSchema from '../model/NoteSchema';
import NoteItem from '../components/NoteItem';
import {FlashList, MasonryFlashList} from '@shopify/flash-list';
import {useAppStore} from '../zustand/appStore';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import Animated, {FadeInUp, FadeOutUp} from 'react-native-reanimated';
import useModalStore from '../zustand/modalStore';
import DeviceInfo from 'react-native-device-info';
import useLocalAuthentication from '../hooks/useLocalAuthentication';
interface DialogProps {
  visible: boolean;
  hideDialog: () => void;
  content: string;
  onConfirm: () => void;
}
const RemoveAlertDialog = ({
  visible,
  hideDialog,
  content,
  onConfirm,
}: DialogProps) => {
  return (
    <View>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Cảnh báo</Dialog.Title>
          <Dialog.Content>
            <Text>{content}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Huỷ</Button>
            <Button onPress={onConfirm}>Đồng ý</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};
const RecycleBin = () => {
  const navigation = useNavigation<navigation<'RecycleBin'>>();
  const theme = useTheme();
  const device_id = DeviceInfo.getUniqueID();
  const {
    setSelectedMode,
    selectedMode,
    selectedNotes,
    setSelectedNotes,
    noteViewType,
    noteOrderBy,
  } = useAppStore();

  const notes = useQuery(NoteSchema)
    .filtered('is_deleted = true')
    .sorted(noteOrderBy, true);

  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const [dialogVisible, setDialogVisible] = React.useState(false);

  const [dialogContent, setDialogContent] = React.useState('');

  const [dialogType, setDialogType] = React.useState<'clear' | 'clearAll'>(
    'clear',
  );

  const realm = useRealm();

  const {authenticate} = useLocalAuthentication();
  const {showSnackbar} = useModalStore();
  const onItemLongPress = (note: NoteSchema) => {
    setSelectedMode(true);
    if (selectedNotes.some(notes => notes._id.equals(note._id))) {
      setSelectedNotes(
        selectedNotes.filter(notes => !note._id.equals(notes._id)),
      );
    } else {
      setSelectedNotes([...selectedNotes, note]);
    }
  };

  const onItemPress = async (note: NoteSchema) => {
    if (selectedMode) {
      if (selectedNotes.some(notes => notes._id.equals(note._id))) {
        setSelectedNotes(
          selectedNotes.filter(notes => !notes._id.equals(note._id)),
        );
      } else {
        setSelectedNotes([...selectedNotes, note]);
      }
    } else {
      if (note.isLocked) {
        const result = await authenticate();
        if (!result.success) {
          return;
        }
      }
      navigation.navigate('NoteDetail', {
        _id: note._id.toHexString(),
        noteColor: note.color,
      });
    }
  };

  const handleRestoreNote = () => {
    if (selectedNotes.length > 0) {
      realm.write(() => {
        selectedNotes.forEach(notes => {
          const note = realm.objectForPrimaryKey(NoteSchema, notes._id);
          if (note) {
            note.is_deleted = false;
          }
        });
        setSelectedNotes([]);
      });
    }
    showSnackbar('Đã khôi phục ghi chú');
  };

  const handleClearAll = () => {
    realm.write(() => {
      realm.delete(realm.objects(NoteSchema).filtered('is_deleted = true'));
    });
    setSelectedNotes([]);
    showSnackbar('Đã xóa toàn bộ ghi chú');
  };
  const handleClear = () => {
    realm.write(() => {
      selectedNotes.forEach(notes => {
        const note = realm.objectForPrimaryKey(NoteSchema, notes._id);
        realm.delete(note);
      });
    });
    setSelectedNotes([]);
    showSnackbar('Đã xóa ghi chú');
  };
  useEffect(() => {
    if (selectedNotes.length <= 0) {
      setSelectedMode(false);
    }
  }, [selectedNotes.length]);

  return (
    <View
      className="flex-1 pt-8"
      style={{backgroundColor: theme.colors.background}}>
      <View
        className="absolute w-full h-12 top-0 left-0 right-0"
        style={{
          backgroundColor: selectedMode
            ? theme.colors.surfaceVariant
            : 'transparent',
        }}></View>
      <RemoveAlertDialog
        onConfirm={() => {
          dialogType === 'clear' ? handleClear() : handleClearAll();
          setDialogVisible(false);
        }}
        content={dialogContent}
        visible={dialogVisible}
        hideDialog={() => setDialogVisible(false)}
      />
      {!selectedMode ? (
        <View className="h-12 flex flex-row items-center justify-between">
          <View className="flex flex-row items-center mx-1">
            <IconButton
              onPress={() => {
                navigation.dispatch(DrawerActions.openDrawer());
              }}
              icon={() => (
                <HambergerMenu size="24" color={theme.colors.onSurface} />
              )}
            />
            <Text
              style={{
                color: theme.colors.onSurface,
                fontWeight: '500',
                fontSize: 18,
              }}>
              Thùng rác
            </Text>
          </View>
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <IconButton
                icon={() => (
                  <MaterialCommunityIcons
                    name="dots-vertical"
                    size={24}
                    color={theme.colors.onSurface}
                  />
                )}
                onPress={openMenu}
              />
            }>
            <Menu.Item
              onPress={() => {
                closeMenu();
                setDialogVisible(true);
                setDialogContent(
                  'Tất cả các ghi chú trong Thùng rác sẽ bị xoá vĩnh viễn.',
                );
                setDialogType('clearAll');
              }}
              title="Dọn sạch thùng rác"
            />
          </Menu>
        </View>
      ) : (
        <Animated.View
          entering={FadeInUp.duration(300)}
          exiting={FadeOutUp.duration(300)}
          className="h-12 flex flex-row items-center justify-between"
          style={{
            backgroundColor: theme.colors.surfaceVariant,
          }}>
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
              }}></IconButton>
            <Text
              className="text-lg font-bold"
              style={{color: theme.colors.onSurface}}>
              {selectedNotes.length}
            </Text>
          </View>
          <Animated.View className="flex-row items-center">
            <IconButton
              onPress={handleRestoreNote}
              icon={() => (
                <MaterialCommunityIcons
                  name="backup-restore"
                  size={24}
                  color={theme.colors.onSurface}
                />
              )}
            />
            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <IconButton
                  icon={() => (
                    <MaterialCommunityIcons
                      name="dots-vertical"
                      size={24}
                      color={theme.colors.onSurface}
                    />
                  )}
                  onPress={openMenu}
                />
              }>
              <Menu.Item
                onPress={() => {
                  closeMenu();
                  setDialogVisible(true);
                  setDialogContent('Xoá vĩnh viễn ghi chú?');
                  setDialogType('clear');
                }}
                title="Xoá vĩnh viễn"
              />
            </Menu>
          </Animated.View>
        </Animated.View>
      )}
      {notes.length > 0 ? (
        <View
          className="flex-1 w-full"
          style={{backgroundColor: theme.colors.background}}>
          {noteViewType === 'list' ? (
            <FlashList
              ListHeaderComponent={<View className="h-4"></View>}
              contentContainerStyle={{
                paddingHorizontal: 6,
                paddingBottom: 80,
              }}
              showsVerticalScrollIndicator={false}
              data={notes || []}
              extraData={selectedNotes}
              renderItem={({item}: {item: NoteSchema}) => (
                <NoteItem
                  note={item}
                  isSelected={selectedNotes.some(notes =>
                    notes._id.equals(item._id),
                  )}
                  onItemLongPress={onItemLongPress}
                  onItemPress={onItemPress}
                />
              )}
              estimatedItemSize={200}
              keyExtractor={(item: NoteSchema) => item._id.toHexString()}
            />
          ) : (
            <MasonryFlashList
              ListHeaderComponent={<View className="h-4"></View>}
              contentContainerStyle={{
                paddingHorizontal: 6,
                paddingBottom: 80,
              }}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              data={notes || []}
              extraData={selectedNotes}
              renderItem={({item}: {item: NoteSchema}) => (
                <NoteItem
                  note={item}
                  isSelected={selectedNotes.some(notes =>
                    notes._id.equals(item._id),
                  )}
                  onItemLongPress={onItemLongPress}
                  onItemPress={onItemPress}
                />
              )}
              estimatedItemSize={200}
              keyExtractor={(item: NoteSchema) => item._id.toHexString()}
            />
          )}
        </View>
      ) : (
        <View
          className="flex-1 w-full items-center justify-center"
          style={{backgroundColor: theme.colors.background}}>
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={128}
            color={theme.colors.primary}
          />
          <Text style={{color: theme.colors.onSurfaceVariant}}>
            Không có ghi chú nào trong thùng rác
          </Text>
        </View>
      )}
    </View>
  );
};

export default RecycleBin;
