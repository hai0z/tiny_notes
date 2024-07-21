import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {Surface, useTheme} from 'react-native-paper';
import {MaterialCommunityIcons} from '@expo/vector-icons';

const BottomTab = () => {
  const theme = useTheme();
  return (
    <Surface
      className="absolute bottom-0 left-0 right-0 h-14 items-center flex-row"
      elevation={2}>
      <View className="flex flex-row items-center mx-4">
        <TouchableOpacity className="mr-4">
          <MaterialCommunityIcons
            name="checkbox-outline"
            size={24}
            color={theme.colors.onSurface}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialCommunityIcons
            name="image-outline"
            size={24}
            color={theme.colors.onSurface}
          />
        </TouchableOpacity>
      </View>
    </Surface>
  );
};

export default BottomTab;
