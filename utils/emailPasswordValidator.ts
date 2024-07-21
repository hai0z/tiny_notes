export const emailValidator = (email: string) => {
  const re = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) return 'Email không được để trống.';
  if (!re.test(email)) return 'Ooops! Địa chỉ email không hợp lệ.';

  return '';
};

export const passwordValidator = (password: string) => {
  if (!password || password.length <= 0) return 'Mật khẩu không được để trống.';

  return '';
};

export const rePasswordValidator = (rePassword: string, password: string) => {
  if (!rePassword || rePassword.length <= 0)
    return 'Mật khẩu nhập lại không được trống';
  if (rePassword !== password) return 'Mật khẩu nhap lại không trùng khớp';
  return '';
};

export const nameValidator = (name: string) => {
  if (!name || name.length <= 0) return 'Name cannot be empty.';

  return '';
};
