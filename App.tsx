import React, {useEffect, useMemo} from 'react';
import {AppProvider, RealmProvider, UserProvider, useUser} from '@realm/react';
import NoteSchema from './model/NoteSchema';
import {MD3DarkTheme, MD3LightTheme, PaperProvider} from 'react-native-paper';
import Navigator from './navigator';
import {View} from 'react-native';
import {enableScreens} from 'react-native-screens';
import Snackbar from './components/Snackbar';
import {useAppStore} from './zustand/appStore';
import LoginScreen from './screens/LoginScreen';
import {useMaterial3Theme} from '@pchmn/expo-material3-theme';
import SplashScreen from 'react-native-splash-screen';
import {Realm} from '@realm/react';
import TaskSchema from './model/TaskSchema';
import {NavigationContainer} from '@react-navigation/native';
import LoginNavigation from './navigator/LoginNavigation';
enableScreens();

const App = () => {
  const themeMode = useAppStore(state => state.theme);
  const {theme} = useMaterial3Theme();
  const paperTheme = useMemo(
    () =>
      themeMode === 'dark'
        ? {...MD3DarkTheme, colors: theme.dark}
        : {...MD3LightTheme, colors: theme.light},
    [themeMode, theme],
  );
  const realmAccessBehavior: Realm.OpenRealmBehaviorConfiguration = {
    type: Realm.OpenRealmBehaviorType.DownloadBeforeOpen,
    timeOutBehavior: Realm.OpenRealmTimeOutBehavior.OpenLocalRealm,
    timeOut: 3000,
  };

  return (
    <PaperProvider theme={paperTheme}>
      <AppProvider id="application-0-fugswke">
        <UserProvider fallback={<LoginNavigation />}>
          <RealmProvider
            sync={{
              existingRealmFileBehavior: realmAccessBehavior,
              newRealmFileBehavior: realmAccessBehavior,
              flexible: true,
              initialSubscriptions: {
                update(subs, realm) {
                  subs.add(realm.objects('Note'));
                  subs.add(realm.objects('Task'));
                },
                rerunOnOpen: true,
              },
              partitionValue: undefined,
              onError: (_serverSession, error) => {
                console.log(error);
              },
            }}
            path="realm"
            schemaVersion={0}
            schema={[NoteSchema, TaskSchema]}
            closeOnUnmount={false}>
            <View style={{flex: 1}}>
              <Navigator />
              <Snackbar />
            </View>
          </RealmProvider>
        </UserProvider>
      </AppProvider>
    </PaperProvider>
  );
};

export default App;
