import React from 'react';
import {Button, Dialog, Portal, Text} from 'react-native-paper';
import NoteSchema from '../../model/NoteSchema';
import dayjs from 'dayjs';
import {View} from 'react-native';

interface Props {
  visible: boolean;
  hideDialog: () => void;
  note: NoteSchema;
}

const NoteInfoDialog = ({visible, hideDialog, note}: Props) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title>Thông tin ghi chú</Dialog.Title>
        <Dialog.Content>
          <View className="gap-y-1">
            <Text variant="bodyMedium">
              Thời gian tạo: {dayjs(note.created_at).format('DD/MM/YYYY HH:mm')}
            </Text>
            <Text variant="bodyMedium">
              Cập nhật gần nhất:{' '}
              {dayjs(note.updated_at).format('DD/MM/YYYY HH:mm')}
            </Text>
            <Text variant="bodyMedium">
              Số kí tự: {note.title.trim().length + note.content.trim().length}
            </Text>
            <Text variant="bodyMedium">
              Trạng thái: {note.isLocked ? 'Đã khoá' : 'Mở khoá'}
            </Text>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>Đóng</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default NoteInfoDialog;
