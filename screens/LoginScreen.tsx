import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {memo, useEffect, useState} from 'react';
import {useAuth} from '@realm/react';
import {Button, Text, useTheme} from 'react-native-paper';
import TextInput from '../components/TextInput';
import {useNavigation} from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import {
  emailValidator,
  passwordValidator,
} from '../utils/emailPasswordValidator';
import {navigation} from '../types/stackParamlist';
const LoginScreen = () => {
  const {logInWithAnonymous, logInWithEmailPassword} = useAuth();

  const [email, setEmail] = useState({value: '', error: ''});
  const [password, setPassword] = useState({value: '', error: ''});

  const theme = useTheme();
  const navigation = useNavigation<navigation<'Login'>>();

  const _onLoginPressed = () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError) {
      setEmail({...email, error: emailError});
      setPassword({...password, error: passwordError});
      return;
    }
    logInWithEmailPassword({email: email.value, password: password.value});
  };

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <View className="p-5 flex-1 justify-center items-center self-center content-center max-w-[340px] w-full">
      <Image
        source={require('../assets/images/logo.png')}
        style={{
          width: 128,
          height: 128,
          marginBottom: 12,
        }}
      />
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={text => setEmail({value: text, error: ''})}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Mật khẩu"
        returnKeyType="done"
        value={password.value}
        onChangeText={text => setPassword({value: text, error: ''})}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity>
          <Text style={{color: theme.colors.primary}}>Quên mật khẩu?</Text>
        </TouchableOpacity>
      </View>

      <Button mode="contained" onPress={_onLoginPressed} className="w-full">
        Đăng nhập
      </Button>
      <Button
        mode="outlined"
        onPress={logInWithAnonymous}
        className="w-full mt-3">
        Đăng nhập với tài khoản khách
      </Button>

      <View style={styles.row}>
        <Text style={{color: theme.colors.secondary}}>Chưa có tài khoản? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={{fontWeight: 'bold', color: theme.colors.primary}}>
            Đăng kí
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 8,
  },
  label: {
    // color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    // color: theme.colors.primary,
  },
});
export default memo(LoginScreen);
