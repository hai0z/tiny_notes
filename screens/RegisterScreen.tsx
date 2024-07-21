import React, {memo, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import TextInput from '../components/TextInput';
import {
  emailValidator,
  nameValidator,
  passwordValidator,
  rePasswordValidator,
} from '../utils/emailPasswordValidator';
import {Button, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {navigation} from '../types/stackParamlist';
import {AuthOperationName, useEmailPasswordAuth} from '@realm/react';

const RegisterScreen = () => {
  const theme = useTheme();
  const [email, setEmail] = useState({value: '', error: ''});
  const [password, setPassword] = useState({value: '', error: ''});
  const [rePassword, setRePassword] = useState({value: '', error: ''});

  const navigation = useNavigation<navigation<'Register'>>();

  const {register, result, logIn} = useEmailPasswordAuth();

  const _onSignUpPressed = () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    const rePasswordError = rePasswordValidator(
      rePassword.value,
      password.value,
    );
    if (emailError || passwordError || rePasswordError) {
      setEmail({...email, error: emailError});
      setPassword({...password, error: passwordError});
      setRePassword({...rePassword, error: rePasswordError});
      return;
    }
    register({email: email.value, password: password.value});
    console.log('12');
  };

  useEffect(() => {
    if (result.success && result.operation === AuthOperationName.Register) {
      logIn({email: email.value, password: password.value});
    }
  }, [result, logIn, email, password, rePassword]);
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

      <TextInput
        label="Nhập lại mật khẩu"
        returnKeyType="done"
        value={rePassword.value}
        onChangeText={text => setRePassword({value: text, error: ''})}
        error={!!rePassword.error}
        errorText={rePassword.error}
        secureTextEntry
      />

      <Button
        className="w-full"
        mode="contained"
        onPress={_onSignUpPressed}
        style={styles.button}>
        Đăng kí
      </Button>

      <View style={styles.row}>
        <Text
          style={{
            color: theme.colors.secondary,
          }}>
          Đã có tài khoản?{' '}
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Login');
          }}>
          <Text style={{...styles.link, color: theme.colors.primary}}>
            Đăng nhập
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    // color: theme.colors.secondary,
  },
  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    // color: theme.colors.primary,
  },
});

export default memo(RegisterScreen);
