import {View, Text, Animated} from 'react-native';
import React, {Fragment, memo, useEffect} from 'react';
import {useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useQuery} from '@realm/react';
import {useAppStore} from '../zustand/appStore';
import NoteSchema from '../model/NoteSchema';
import {navigation} from '../types/stackParamlist';
import {FlashList, MasonryFlashList} from '@shopify/flash-list';
import NoteItem from './NoteItem';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Results} from 'realm';

interface Props {
  emptyComponent?: JSX.Element;
  data: Results<NoteSchema>;
}
const NoteList = ({emptyComponent, data}: Props) => {
  const navigation = useNavigation<navigation<'RecycleBin'>>();
  const theme = useTheme();
  const notes = useQuery(NoteSchema)
    .filtered('is_deleted = true')
    .sorted('deleted_at', true);

  const {
    setSelectedMode,
    selectedMode,
    selectedNotes,
    setSelectedNotes,
    noteViewType,
  } = useAppStore();
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

  const onItemPress = (note: NoteSchema) => {
    if (selectedMode) {
      if (selectedNotes.some(notes => notes._id.equals(note._id))) {
        setSelectedNotes(
          selectedNotes.filter(notes => !notes._id.equals(note._id)),
        );
      } else {
        setSelectedNotes([...selectedNotes, note]);
      }
    } else {
      navigation.navigate('NoteDetail', {
        _id: note._id.toHexString(),
        noteColor: note.color,
      });
    }
  };

  useEffect(() => {
    if (selectedNotes.length <= 0) {
      setSelectedMode(false);
    }
  }, [selectedNotes.length]);

  return (
    <View className="w-full pt-10 bg-red-500">
      {noteViewType === 'list' ? (
        <FlashList
          contentContainerStyle={{
            paddingHorizontal: 8,
            paddingBottom: 80,
          }}
          showsVerticalScrollIndicator={false}
          data={data}
          extraData={[selectedMode, selectedNotes]}
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
          estimatedItemSize={64}
          keyExtractor={(item: NoteSchema) => item._id.toHexString()}
        />
      ) : (
        <MasonryFlashList
          contentContainerStyle={{
            paddingHorizontal: 4,
            paddingBottom: 80,
          }}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          data={data || []}
          extraData={[selectedMode, selectedNotes]}
          renderItem={({item}: {item: NoteSchema}) => (
            <Animated.View className="mx-1">
              <NoteItem
                note={item}
                isSelected={selectedNotes.some(notes =>
                  notes._id.equals(item._id),
                )}
                onItemLongPress={onItemLongPress}
                onItemPress={onItemPress}
              />
            </Animated.View>
          )}
          estimatedItemSize={64}
          keyExtractor={(item: NoteSchema) => item._id.toHexString()}
        />
      )}
    </View>
  );
};

export default memo(NoteList);
