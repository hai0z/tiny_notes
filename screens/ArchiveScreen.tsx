import {View, Text, Animated} from 'react-native';
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
import {Add, Element3, HambergerMenu, RowVertical} from 'iconsax-react-native';
import {useNavigation} from '@react-navigation/native';
import {DrawerActions} from '@react-navigation/native';
import {useQuery, useRealm, useUser} from '@realm/react';
import NoteSchema from '../model/NoteSchema';
import NoteItem from '../components/NoteItem';
import {FlashList, MasonryFlashList} from '@shopify/flash-list';
import {useAppStore} from '../zustand/appStore';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import SelectedModeHeader from '../components/SelectedModeHeader';
import DeviceInfo from 'react-native-device-info';
import useLocalAuthentication from '../hooks/useLocalAuthentication';
const ArchiveScreen = () => {
  const navigation = useNavigation<navigation<'RecycleBin'>>();
  const theme = useTheme();
  const device_id = DeviceInfo.getUniqueID();
  const {
    setSelectedMode,
    selectedMode,
    selectedNotes,
    setSelectedNotes,
    noteViewType,
    setNoteViewType,
    noteOrderBy,
  } = useAppStore();
  const archiveNotes = useQuery(NoteSchema)
    .filtered('is_archived = true ')
    .sorted(noteOrderBy, true);
  const {authenticate} = useLocalAuthentication();

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

  return (
    <View
      className="flex-1 pt-8"
      style={{backgroundColor: theme.colors.background}}>
      <View
        className="absolute w-full h-10"
        style={{
          backgroundColor: selectedMode
            ? theme.colors.surfaceVariant
            : 'transparent',
        }}></View>

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
              Lưu trữ
            </Text>
          </View>
          <View className="flex flex-row items-center mx-1">
            <IconButton
              icon={() => (
                <MaterialCommunityIcons
                  name="magnify"
                  size={24}
                  color={theme.colors.onSurface}
                />
              )}
            />
            <IconButton
              onPress={() => {
                setNoteViewType(noteViewType === 'list' ? 'grid' : 'list');
              }}
              icon={() => {
                return noteViewType === 'list' ? (
                  <Element3 size="20" color={theme.colors.onSurface} />
                ) : (
                  <RowVertical size="20" color={theme.colors.onSurface} />
                );
              }}
            />
          </View>
        </View>
      ) : (
        <View
          className="h-12"
          style={{
            backgroundColor: theme.colors.surfaceVariant,
          }}>
          <SelectedModeHeader />
        </View>
      )}
      {archiveNotes.length > 0 ? (
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
              data={archiveNotes || []}
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
              data={archiveNotes || []}
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
            name="archive-arrow-down"
            size={128}
            color={theme.colors.primary}
          />
          <Text style={{color: theme.colors.onSurfaceVariant}}>
            Không có ghi chú nào được lưu trữ
          </Text>
        </View>
      )}
    </View>
  );
};

export default ArchiveScreen;
