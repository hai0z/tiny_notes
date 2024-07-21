import {View, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import NoteSchema from '../model/NoteSchema';
import {useQuery, useUser} from '@realm/react';
import {Text, useTheme} from 'react-native-paper';
import Header from '../components/Header';
import NoteItem from '../components/NoteItem';
import {FlashList} from '@shopify/flash-list';
import {useAppStore} from '../zustand/appStore';
import {useNavigation} from '@react-navigation/native';
import {navigation} from '../types/stackParamlist';
import {MasonryFlashList} from '@shopify/flash-list';
import {StatusBar} from 'expo-status-bar';
import ChooseNoteColorModal from '../components/modal/ChooseNoteColorModal';
import {Add} from 'iconsax-react-native';
import {Results} from 'realm';
import {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';
import DeviceInfo from 'react-native-device-info';
import SplashScreen from 'react-native-splash-screen';
import useLocalAuthentication from '../hooks/useLocalAuthentication';
import {LocalAuthenticationResult} from 'expo-local-authentication';
const HomeScreen = () => {
  const theme = useTheme();
  const {
    setSelectedMode,
    selectedMode,
    selectedNotes,
    setSelectedNotes,
    noteViewType,
    noteOrderBy,
  } = useAppStore();

  const navigation = useNavigation<navigation<'Home'>>();
  const {authenticate} = useLocalAuthentication();

  const notes = useQuery(NoteSchema)
    .filtered(
      'is_deleted == $0 and is_archived == $1 and isPinned == $2',
      false,
      false,
      false,
    )
    .sorted(noteOrderBy, true);

  const pinNotes = useQuery(NoteSchema)
    .filtered(
      'isPinned == $0 and is_deleted == $1 and is_archived == $2',
      true,
      false,
      false,
    )
    .sorted(noteOrderBy, true);

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

  const renderNotes = [pinNotes, notes];

  useEffect(() => {
    if (selectedNotes.length <= 0) {
      setSelectedMode(false);
    }
  }, [selectedNotes.length]);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const user = useUser();
  console.log(user.profile.name);
  return (
    <View
      className="flex-1 pt-8"
      style={{backgroundColor: theme.colors.background}}>
      <TouchableOpacity
        style={{backgroundColor: theme.colors.elevation.level5, elevation: 5}}
        className="w-14 h-14 rounded-xl justify-center items-center flex z-10  absolute bottom-10 right-8"
        onPress={() => navigation.navigate('AddNote')}>
        <Add size="32" color={theme.colors.onSurfaceVariant} />
      </TouchableOpacity>
      <View
        className="absolute w-full h-10"
        style={{
          backgroundColor: selectedMode
            ? theme.colors.surfaceVariant
            : 'transparent',
        }}></View>

      <View className="h-16 justify-center items-center">
        <Header />
      </View>
      <ChooseNoteColorModal />
      {noteViewType === 'list' ? (
        <FlashList
          contentContainerStyle={{
            paddingHorizontal: 6,
            paddingBottom: 80,
          }}
          showsVerticalScrollIndicator={false}
          data={renderNotes}
          extraData={[selectedMode, selectedNotes]}
          renderItem={({
            item,
            index,
          }: {
            item: Results<NoteSchema>;
            index: number;
          }) => {
            return (
              <View>
                {item.length > 0 && (
                  <FlashList
                    ListHeaderComponent={
                      <View className="mx-4 my-2">
                        {index === 0 && renderNotes[0].length > 0 ? (
                          <Text>Đã ghim</Text>
                        ) : renderNotes[0].length > 0 ? (
                          <Text>Khác</Text>
                        ) : null}
                      </View>
                    }
                    extraData={[selectedMode, selectedNotes]}
                    estimatedItemSize={200}
                    data={item}
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
                  />
                )}
              </View>
            );
          }}
          estimatedItemSize={SCREEN_HEIGHT}
        />
      ) : (
        <FlashList
          contentContainerStyle={{
            paddingHorizontal: 6,
            paddingBottom: 80,
          }}
          showsVerticalScrollIndicator={false}
          data={renderNotes}
          extraData={[selectedMode, selectedNotes]}
          renderItem={({
            item,
            index,
          }: {
            item: Results<NoteSchema>;
            index: number;
          }) => {
            return (
              <View>
                {item.length > 0 && (
                  <MasonryFlashList
                    ListHeaderComponent={
                      <View className="mx-4 my-2">
                        {index === 0 && renderNotes[0].length > 0 ? (
                          <Text>Đã ghim</Text>
                        ) : renderNotes[0].length > 0 ? (
                          <Text>Khác</Text>
                        ) : null}
                      </View>
                    }
                    onLoad={() => console.log('onLoad')}
                    extraData={[selectedMode, selectedNotes]}
                    numColumns={2}
                    estimatedItemSize={200}
                    data={item}
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
                  />
                )}
              </View>
            );
          }}
          estimatedItemSize={SCREEN_HEIGHT}
        />
      )}
    </View>
  );
};

export default HomeScreen;
