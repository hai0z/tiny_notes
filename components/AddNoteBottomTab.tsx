import {
  View,
  Text,
  Keyboard,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React, {useCallback, useMemo, useRef} from 'react';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import {IconButton, useTheme} from 'react-native-paper';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {
  noteColor,
  noteColorDarkMapper,
  noteColorLightMapper,
} from '../constants/noteColor';
import {
  noteBackground,
  noteBackgroundColorDarkMapper,
  noteBackgroundColorLightMapper,
} from '../constants/noteBackground';
import {FlatList} from 'react-native-gesture-handler';
import {useAppStore} from '../zustand/appStore';
import NoteSchema from '../model/NoteSchema';
import dayjs from 'dayjs';

interface Props {
  chooseNoteColor: (color: string) => void;
  chooseNoteBackground: (background: string) => void;
  note: NoteSchema | null;
}
const AddNoteBottomTab: React.FC<Props> = ({
  chooseNoteColor,
  chooseNoteBackground,
  note,
}) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const theme = useTheme();
  const themeMode = useAppStore(state => state.theme);

  const snapPoints = useMemo(() => ['35%'], []);

  const handlePresentModalPress = useCallback(() => {
    Keyboard.dismiss();
    bottomSheetModalRef.current?.present();
  }, []);

  const RenderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );
  return (
    <View className="h-12  w-full" style={{}}>
      <View className="flex flex-row items-center">
        <IconButton
          icon={() => (
            <MaterialCommunityIcons
              name="plus-box-outline"
              size={24}
              color={theme.colors.onSurfaceVariant}
            />
          )}
        />
        <IconButton
          onPress={handlePresentModalPress}
          icon={() => (
            <MaterialCommunityIcons
              name="palette-outline"
              size={24}
              color={theme.colors.onSurfaceVariant}
            />
          )}
        />
        <Text
          style={{color: theme.colors.onSurfaceVariant}}
          className="ml-2 text-xs">
          Đã chỉnh sửa{' '}
          {dayjs(note?.updated_at).format('DD/MM/YYYY').toString() ===
          dayjs().format('DD/MM/YYYY').toString()
            ? dayjs(note?.updated_at).format('HH:mm').toString()
            : dayjs(note?.updated_at).format('DD/MM/YYYY HH:mm').toString()}
        </Text>
      </View>
      <BottomSheetModal
        backgroundStyle={{
          backgroundColor:
            note?.image !== ''
              ? themeMode === 'dark'
                ? noteBackgroundColorDarkMapper.get(note?.image as string)
                : noteBackgroundColorLightMapper.get(note?.image as string)
              : note?.color === 'transparent'
              ? theme.colors.surfaceVariant
              : themeMode === 'dark'
              ? noteColorDarkMapper.get(note?.color as string)
              : noteColorLightMapper.get(note?.color as string),
          borderRadius: 0,
        }}
        handleIndicatorStyle={{backgroundColor: 'transparent'}}
        backdropComponent={RenderBackdrop}
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}>
        <BottomSheetView
          style={{
            backgroundColor:
              note?.image !== ''
                ? themeMode === 'dark'
                  ? noteBackgroundColorDarkMapper.get(note?.image as string)
                  : noteBackgroundColorLightMapper.get(note?.image as string)
                : note?.color === 'transparent'
                ? theme.colors.surfaceVariant
                : themeMode === 'dark'
                ? noteColorDarkMapper.get(note?.color as string)
                : noteColorLightMapper.get(note?.color as string),
          }}>
          <View className="h-full">
            <Text
              className="px-4 mb-4"
              style={{
                color: theme.colors.onSurfaceVariant,
                fontWeight: 'bold',
              }}>
              Màu
            </Text>
            <FlatList
              contentContainerStyle={{paddingHorizontal: 16}}
              horizontal
              keyExtractor={item => item.name}
              data={noteColor}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => chooseNoteColor(item.name)}
                  className="mr-4 justify-center items-center"
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 999,
                    backgroundColor:
                      themeMode === 'dark' ? item.dark : item.light,
                    borderWidth: note?.color === item.name ? 2 : 0.75,
                    borderColor: theme.colors.primary,
                  }}>
                  {note?.color === item.name && (
                    <Text>
                      <MaterialCommunityIcons
                        name="check-bold"
                        size={24}
                        color={theme.colors.primary}
                      />
                    </Text>
                  )}
                  {item.name === 'transparent' && note?.color !== item.name && (
                    <Text>
                      <MaterialCommunityIcons
                        name="water-off-outline"
                        size={24}
                        color={theme.colors.onBackground}
                      />
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            />
            <Text
              className="px-4 mb-4"
              style={{
                color: theme.colors.onSurfaceVariant,
                fontWeight: 'bold',
              }}>
              Hình nền
            </Text>
            <FlatList
              contentContainerStyle={{paddingHorizontal: 16}}
              horizontal
              data={noteBackground}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => chooseNoteBackground(item.name)}
                  className="mr-4 justify-center items-center"
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 999,
                    borderWidth:
                      note?.image === item.name && note.image !== '' ? 2 : 0.75,
                    borderColor: theme.colors.primary,
                  }}>
                  <ImageBackground
                    className="w-full h-full rounded-full justify-center items-center"
                    imageStyle={{borderRadius: 999}}
                    resizeMode="contain"
                    source={themeMode === 'dark' ? item.dark : item.light}>
                    {note?.image === item.name && (
                      <View
                        className="absolute top-0 right-0 h-6 w-6 rounded-full justify-center items-center"
                        style={{backgroundColor: theme.colors.primary}}>
                        <MaterialCommunityIcons
                          name="check-bold"
                          size={18}
                          color={theme.colors.onPrimary}
                        />
                      </View>
                    )}
                    {item.name === '' && (
                      <Text>
                        <MaterialCommunityIcons
                          name="image-off-outline"
                          size={24}
                          color={theme.colors.onBackground}
                        />
                      </Text>
                    )}
                  </ImageBackground>
                </TouchableOpacity>
              )}
            />
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

export default AddNoteBottomTab;
