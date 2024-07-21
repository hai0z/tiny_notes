import {Dimensions, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Avatar, IconButton, Text, useTheme} from 'react-native-paper';
import {Element3, HambergerMenu, RowVertical} from 'iconsax-react-native';
import {useAppStore} from '../zustand/appStore';
import Animated, {useSharedValue, withTiming} from 'react-native-reanimated';
import {DrawerActions, useNavigation} from '@react-navigation/native';

import SelectedModeHeader from './SelectedModeHeader';
import {navigation} from '../types/stackParamlist';
import {useUser} from '@realm/react';
const ButtonAnimated = Animated.createAnimatedComponent(TouchableOpacity);

const SCREEN_WIDTH = Dimensions.get('screen').width;

const Header = () => {
  const user = useUser();
  console.log(user.profile);
  const theme = useTheme();
  const {
    noteViewType,
    setNoteViewType,
    selectedMode,
    setSelectedMode,
    selectedNotes,
  } = useAppStore();

  const headerW = useSharedValue(SCREEN_WIDTH * 0.9);

  const headerH = useSharedValue(50);

  const headerBorderW = useSharedValue(9999);

  const opacity = useSharedValue(1);

  const navigation = useNavigation<navigation<'Home'>>();

  const handleChangeNoteViewType = () => {
    setNoteViewType(noteViewType === 'list' ? 'grid' : 'list');
  };

  const handleOpenDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  React.useEffect(() => {
    if (selectedMode) {
      headerW.value = withTiming(SCREEN_WIDTH, {
        duration: 250,
      });
      headerH.value = withTiming(60, {
        duration: 250,
      });
      headerBorderW.value = withTiming(0, {
        duration: 250,
      });
      opacity.value = withTiming(0, {
        duration: 250,
      });
    } else {
      headerW.value = withTiming(SCREEN_WIDTH * 0.9, {
        duration: 250,
      });
      headerH.value = withTiming(50, {
        duration: 250,
      });
      headerBorderW.value = withTiming(9999, {
        duration: 250,
      });
      opacity.value = withTiming(1, {
        duration: 250,
      });
    }
  }, [selectedMode, selectedNotes.length]);

  React.useEffect(() => {
    if (selectedNotes.length <= 0) {
      setSelectedMode(false);
    }
  }, [selectedNotes.length]);

  return (
    <ButtonAnimated
      activeOpacity={1}
      className="items-center flex flex-row justify-between self-center"
      style={{
        backgroundColor: theme.colors.surfaceVariant,
        width: headerW,
        height: headerH,
        borderRadius: headerBorderW,
      }}>
      {selectedMode ? (
        <SelectedModeHeader />
      ) : (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            navigation.navigate('Search');
          }}
          className="flex-row items-center justify-between w-full">
          <View className="flex flex-row items-center">
            <IconButton
              icon={() => (
                <HambergerMenu size="24" color={theme.colors.onSurface} />
              )}
              onPress={handleOpenDrawer}></IconButton>
            <Text style={{color: theme.colors.onSurface}}>
              Tìm kiếm ghi chú
            </Text>
          </View>

          <View className="flex flex-row items-center">
            <IconButton
              onPress={handleChangeNoteViewType}
              icon={() => {
                return noteViewType === 'list' ? (
                  <Element3 size="20" color={theme.colors.onSurface} />
                ) : (
                  <RowVertical size="20" color={theme.colors.onSurface} />
                );
              }}
            />
          </View>
        </TouchableOpacity>
      )}
    </ButtonAnimated>
  );
};

export default Header;
