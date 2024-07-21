import {View} from 'react-native';
import React from 'react';
import {Snackbar as PaperSnackbar} from 'react-native-paper';
import useModalStore from '../zustand/modalStore';
const Snackbar = () => {
  const {snackbarText, snackbarVisible, setSnackbarVisible} = useModalStore();

  return (
    <View>
      <PaperSnackbar
        wrapperStyle={{
          bottom: 96,
        }}
        visible={snackbarVisible}
        duration={3000}
        onDismiss={() => setSnackbarVisible(false)}>
        {snackbarText}
      </PaperSnackbar>
    </View>
  );
};

export default Snackbar;
