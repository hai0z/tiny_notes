import {View} from 'react-native';
import React from 'react';
import {Button, Dialog, Portal, Text} from 'react-native-paper';
import {useUser} from '@realm/react';
interface Props {
  visible: boolean;
  hideDialog: () => void;
}
const LogoutDialog: React.FC<Props> = ({visible, hideDialog}) => {
  const user = useUser();
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title>Cảnh báo</Dialog.Title>
        <Dialog.Content>
          {!user.profile.email ? (
            <Text>
              Bạn đang đăng nhập bằng tài khoản khách sau khi đăng xuất sẽ mất
              hết dữ liệu.
            </Text>
          ) : (
            <Text>Bạn có muốn đăng xuất không?</Text>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>Huỷ</Button>

          <Button onPress={() => user.logOut()}>Đăng xuất</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default LogoutDialog;
