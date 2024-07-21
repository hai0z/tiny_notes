import {View} from 'react-native';
import React from 'react';
import {
  Button,
  Dialog,
  IconButton,
  Portal,
  RadioButton,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useAppStore} from '../zustand/appStore';
import {useNavigation} from '@react-navigation/native';
import {navigation} from '../types/stackParamlist';

const SettingScreen = () => {
  const theme = useTheme();
  const [visible, setVisible] = React.useState(false);
  const [orderVisible, setOrderVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const {
    theme: themeMode,
    setTheme,
    noteOrderBy,
    setNoteOrderBy,
  } = useAppStore();

  const handleChangeTheme = (theme: string) => {
    setTheme(theme as 'light' | 'dark');
  };

  const navigation = useNavigation<navigation<'Setting'>>();
  return (
    <View
      style={{flex: 1, backgroundColor: theme.colors.background}}
      className="pt-8">
      <View className="flex flex-row items-center">
        <IconButton
          icon={() => (
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={theme.colors.onSurface}
            />
          )}
          onPress={() => navigation.goBack()}
        />
        <Text variant="titleLarge">Cài đặt</Text>
      </View>
      <View className="pt-4">
        <Text variant="titleLarge" className="mb-2 px-4">
          Chế độ hiển thị
        </Text>
        <TouchableRipple onPress={() => showDialog()} className="py-3 px-4">
          <View className="flex flex-row justify-between items-center">
            <Text variant="bodyLarge">Giao diện</Text>
            <Text variant="bodyMedium">
              {themeMode === 'dark' ? 'Tối' : 'Sáng'}
            </Text>
          </View>
        </TouchableRipple>
      </View>
      <View>
        <TouchableRipple
          onPress={() => setOrderVisible(true)}
          className="py-3 px-4">
          <View className="flex flex-row justify-between items-center">
            <Text variant="bodyLarge">Sắp xếp theo</Text>
            <Text variant="bodyMedium">
              {noteOrderBy === 'created_at'
                ? 'Thời gian tạo'
                : 'Thời gian cập nhật'}
            </Text>
          </View>
        </TouchableRipple>
      </View>
      <Portal>
        <Dialog visible={orderVisible} onDismiss={() => setOrderVisible(false)}>
          <Dialog.Title>Sắp xếp theo</Dialog.Title>
          <Dialog.Content>
            <TouchableRipple
              className="flex flex-row w-full items-center mb-2"
              onPress={() => setNoteOrderBy('created_at')}>
              <>
                <RadioButton
                  value="created_at"
                  status={
                    noteOrderBy === 'created_at' ? 'checked' : 'unchecked'
                  }
                  onPress={() => setNoteOrderBy('created_at')}
                />
                <Text variant="bodyLarge" className="ml-2">
                  Thời gian tạo
                </Text>
              </>
            </TouchableRipple>
            <TouchableRipple
              className="flex flex-row items-center"
              onPress={() => setNoteOrderBy('updated_at')}>
              <>
                <RadioButton
                  value="updated_at"
                  status={
                    noteOrderBy === 'updated_at' ? 'checked' : 'unchecked'
                  }
                  onPress={() => setNoteOrderBy('updated_at')}
                />
                <Text variant="bodyLarge" className="ml-2">
                  Thời gian cập nhật
                </Text>
              </>
            </TouchableRipple>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setOrderVisible(false)}>Xong</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Chọn giao diên</Dialog.Title>
          <Dialog.Content>
            <TouchableRipple
              className="flex flex-row w-full items-center mb-2"
              onPress={() => handleChangeTheme('light')}>
              <>
                <RadioButton
                  value="light"
                  status={themeMode === 'light' ? 'checked' : 'unchecked'}
                  onPress={() => handleChangeTheme('light')}
                />
                <Text variant="bodyLarge" className="ml-2">
                  Sáng
                </Text>
              </>
            </TouchableRipple>
            <TouchableRipple
              className="flex flex-row items-center"
              onPress={() => handleChangeTheme('dark')}>
              <>
                <RadioButton
                  value="dark"
                  status={themeMode === 'dark' ? 'checked' : 'unchecked'}
                  onPress={() => handleChangeTheme('dark')}
                />
                <Text variant="bodyLarge" className="ml-2">
                  Tối
                </Text>
              </>
            </TouchableRipple>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Huỷ</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default SettingScreen;
