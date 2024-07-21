import {View, TouchableOpacity} from 'react-native';
import React, {memo} from 'react';
import {
  noteColorDarkMapper,
  noteColorLightMapper,
} from '../constants/noteColor';
import Note from '../model/NoteSchema';
import {Text, useTheme} from 'react-native-paper';
import NoteSchema from '../model/NoteSchema';
import Animated, {FadeIn} from 'react-native-reanimated';
import {
  noteBackgroundDarkMapper,
  noteBackgroundLightMapper,
} from '../constants/noteBackground';
import {useAppStore} from '../zustand/appStore';

interface Props {
  onItemLongPress: (note: NoteSchema) => void;
  onItemPress: (note: NoteSchema) => void;
  note: Note;
  isSelected: boolean;
}

const ButtonAnimated = Animated.createAnimatedComponent(TouchableOpacity);
const NoteItem = ({onItemLongPress, note, onItemPress, isSelected}: Props) => {
  const theme = useTheme();
  console.log('renderItem');
  const themeMode = useAppStore(state => state.theme);
  return (
    <ButtonAnimated
      entering={FadeIn.duration(250).springify()}
      style={{
        borderWidth: isSelected
          ? 3
          : note.color === 'transparent'
          ? 0.75
          : 0.75,
        borderColor: isSelected
          ? theme.colors.primary
          : note.color === 'transparent'
          ? theme.colors.onSurfaceDisabled
          : themeMode === 'dark'
          ? noteColorDarkMapper.get(note.color)
          : noteColorLightMapper.get(note.color),
        marginVertical: 4,
        borderRadius: 6,
        backgroundColor:
          themeMode === 'dark'
            ? noteColorDarkMapper.get(note.color)
            : noteColorLightMapper.get(note.color),
        overflow: 'hidden',
      }}
      className={'mx-1'}
      onLongPress={() => onItemLongPress(note)}
      delayLongPress={150}
      activeOpacity={0.85}
      onPress={() => onItemPress(note)}>
      <View
        style={{
          padding: isSelected ? 17 : 16,
        }}>
        <Text
          variant="titleMedium"
          style={{
            marginBottom: 8,
            fontWeight: 'bold',
          }}>
          {!note.isLocked ? note.title : 'Tiêu đề đã khoá'}
        </Text>
        <Text style={{color: theme.colors.onBackground}} variant="bodyMedium">
          {!note.isLocked
            ? note?.content?.split(' ').length > 100
              ? note?.content?.split(' ').slice(0, 100).join(' ') + '...'
              : note?.content
            : 'Nội dung đã khoá'}
        </Text>
      </View>
      {note.image !== '' && note.color !== 'transparent' && (
        <View
          className="mt-3"
          style={{
            padding: 16,
          }}>
          <View
            className="w-6 h-6 rounded-full"
            style={{
              backgroundColor:
                themeMode === 'dark'
                  ? noteColorDarkMapper.get(note.color)
                  : noteColorLightMapper.get(note.color),
              borderWidth: 0.75,
              borderColor: theme.colors.secondary,
            }}
          />
        </View>
      )}
      {note.image && (
        <Animated.Image
          style={{
            borderRadius: 6,
            height: '100%',
            bottom: 0,
          }}
          className="absolute -z-10 w-full"
          resizeMode={'cover'}
          source={
            themeMode === 'dark'
              ? noteBackgroundDarkMapper.get(note.image)
              : noteBackgroundLightMapper.get(note.image)
          }
        />
      )}
    </ButtonAnimated>
  );
};

export default memo(NoteItem);
