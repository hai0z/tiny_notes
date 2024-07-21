import {create} from 'zustand';

interface ModalStore {
  chooseColorVisible: boolean;
  setChooseColorVisible: (chooseColorVisible: boolean) => void;
  snackbarVisible: boolean;
  setSnackbarVisible: (snackbarVisible: boolean) => void;
  snackbarText: string;
  setSnackbarText: (snackbarText: string) => void;
  showSnackbar: (snackbarText: string) => void;
}
const useModalStore = create<ModalStore>(set => ({
  chooseColorVisible: false,
  setChooseColorVisible: (chooseColorVisible: boolean) =>
    set({chooseColorVisible}),
  snackbarVisible: false,
  setSnackbarVisible: (snackbarVisible: boolean) => set({snackbarVisible}),
  snackbarText: '',
  setSnackbarText: (snackbarText: string) => set({snackbarText}),
  showSnackbar: (snackbarText: string) =>
    set({snackbarText, snackbarVisible: true}),
}));

export default useModalStore;
