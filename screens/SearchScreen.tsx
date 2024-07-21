import {TextInput, View} from 'react-native';
import React from 'react';
import {IconButton, Text, useTheme} from 'react-native-paper';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {navigation} from '../types/stackParamlist';
import {useQuery} from '@realm/react';
import NoteSchema from '../model/NoteSchema';
import {FlashList, MasonryFlashList} from '@shopify/flash-list';
import NoteItem from '../components/NoteItem';
import {useAppStore} from '../zustand/appStore';
import useLocalAuthentication from '../hooks/useLocalAuthentication';
const SearchScreen = () => {
  const theme = useTheme();
  const noteViewType = useAppStore(state => state.noteViewType);
  const noteOrderBy = useAppStore(state => state.noteOrderBy);
  const navigation = useNavigation<navigation<'Search'>>();
  const [searchQuery, setSearchQuery] = React.useState('');
  const {selectedMode, selectedNotes, setSelectedNotes} = useAppStore();
  const {authenticate} = useLocalAuthentication();

  const onChangeSearch = (query: string) => setSearchQuery(query);

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

  const notes = useQuery(NoteSchema)
    .filtered('title CONTAINS[c] $0 OR content CONTAINS[c] $0', searchQuery)
    .sorted(noteOrderBy, true);

  return (
    <View
      className="flex-1 pt-8"
      style={{backgroundColor: theme.colors.background}}>
      <View
        style={{backgroundColor: theme.colors.surfaceVariant}}
        className="absolute top-0 left-0 w-full h-10"
      />
      <View
        className="flex flex-row items-center"
        style={{
          backgroundColor: theme.colors.surfaceVariant,
        }}>
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
        <TextInput
          value={searchQuery}
          onChangeText={onChangeSearch}
          autoFocus
          placeholder="Tìm ghi chú"
          className="flex-1"
          placeholderTextColor={theme.colors.onSurfaceVariant}
          style={{
            color: theme.colors.onSurface,
            backgroundColor: theme.colors.surfaceVariant,
          }}
        />
      </View>
      {searchQuery.length > 0 && notes.length > 0 && (
        <View className="flex-1">
          {noteViewType === 'list' ? (
            <FlashList
              contentContainerStyle={{
                paddingBottom: 100,
                paddingHorizontal: 6,
                paddingTop: 6,
              }}
              estimatedItemSize={200}
              data={notes}
              renderItem={({item}: {item: NoteSchema}) => (
                <NoteItem
                  note={item}
                  onItemPress={() => null}
                  onItemLongPress={() => null}
                  isSelected={false}
                />
              )}
            />
          ) : (
            <MasonryFlashList
              numColumns={2}
              contentContainerStyle={{
                paddingBottom: 100,
                paddingHorizontal: 6,
                paddingTop: 6,
              }}
              estimatedItemSize={200}
              data={notes}
              renderItem={({item}: {item: NoteSchema}) => (
                <NoteItem
                  note={item}
                  onItemPress={onItemPress}
                  onItemLongPress={() => null}
                  isSelected={false}
                />
              )}
            />
          )}
        </View>
      )}
      {notes.length <= 0 && (
        <View className="h-full items-center justify-center">
          <MaterialCommunityIcons
            name="magnify"
            color={theme.colors.primary}
            size={120}
          />
          <Text
            style={{color: theme.colors.onSurfaceVariant}}
            variant="bodyLarge">
            Không có kết quả
          </Text>
        </View>
      )}
    </View>
  );
};

export default SearchScreen;
