import {View, Text, Alert} from 'react-native';
import React from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
const useLocalAuthentication = () => {
  const [hasHardware, setHasHardware] = React.useState(false);

  const [canAuthenticate, setCanAuthenticate] = React.useState(
    LocalAuthentication.SecurityLevel.NONE,
  );

  React.useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setHasHardware(compatible);
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.getEnrolledLevelAsync();
      setCanAuthenticate(compatible);
    })();
  }, []);

  const authenticate = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Xác thực để mở',
      fallbackLabel: 'Vui lòng nhập mật khẩu',
    });
    return result;
  };

  return {hasHardware, canAuthenticate, authenticate};
};

export default useLocalAuthentication;
