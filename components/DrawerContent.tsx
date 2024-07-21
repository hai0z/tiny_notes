import {View, Text} from 'react-native';
import React from 'react';
import {Button, Divider, Drawer, useTheme} from 'react-native-paper';
import {
  DrawerActions,
  DrawerNavigationState,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {navigation} from '../types/stackParamlist';
import {useUser} from '@realm/react';
import LogoutDialog from './modal/LogoutDialog';
const DrawerContent = ({
  state,
}: {
  state: DrawerNavigationState<ParamListBase>;
}) => {
  const theme = useTheme();
  const user = useUser();
  const {routes, index} = state;
  const focusedRoute = routes[index].name;
  const navigation = useNavigation<navigation<'Drawer'>>();

  const [logoutDialogVisible, setLogoutDialogVisible] = React.useState(false);

  const hideDialog = () => setLogoutDialogVisible(false);
  return (
    <View className="pt-4">
      <View className="flex flex-row mx-4 mb-4">
        <Text
          style={{
            color: theme.colors.primary,
            fontWeight: 'bold',
            fontSize: 24,
          }}>
          TINY
        </Text>
        <Text
          style={{
            color: theme.colors.onBackground,
            fontSize: 24,
            fontWeight: 'bold',
            marginLeft: 4,
          }}>
          Notes
        </Text>
      </View>
      <Drawer.Item
        onPress={() => {
          navigation.navigate('Home');
        }}
        active={focusedRoute === 'Home'}
        icon={() => (
          <MaterialCommunityIcons
            name="lightbulb-outline"
            size={24}
            color={theme.colors.onBackground}
          />
        )}
        label="Ghi chú"
      />

      <Drawer.Item
        active={focusedRoute === 'Archive'}
        onPress={() => {
          navigation.navigate('Archive');
        }}
        label="Lưu trữ"
        icon={() => (
          <MaterialCommunityIcons
            name="archive-arrow-down-outline"
            size={24}
            color={theme.colors.onBackground}
          />
        )}
      />
      <Drawer.Item
        active={focusedRoute === 'RecycleBin'}
        onPress={() => {
          navigation.navigate('RecycleBin');
        }}
        label="Thùng rác"
        icon={() => (
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={24}
            color={theme.colors.onBackground}
          />
        )}
      />
      <Drawer.Item
        active={focusedRoute === 'Setting'}
        onPress={() => {
          navigation.navigate('Setting');
          navigation.dispatch(DrawerActions.closeDrawer());
        }}
        label="Cài đặt"
        icon={() => (
          <MaterialCommunityIcons
            name="cog-outline"
            size={24}
            color={theme.colors.onBackground}
          />
        )}
      />
      <Divider style={{backgroundColor: theme.colors.surfaceVariant}} />
      <View className="flex flex-row mx-4">
        <Button mode="text" onPress={() => setLogoutDialogVisible(true)}>
          Đăng xuất
        </Button>
      </View>
      <LogoutDialog visible={logoutDialogVisible} hideDialog={hideDialog} />
    </View>
  );
};

export default DrawerContent;
