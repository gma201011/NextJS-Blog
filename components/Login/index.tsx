import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { message, Button } from 'antd';
import styles from './index.module.scss';
import request from '../../service/fetch';
import { useStore } from '../../store';
interface IProps {
  isShow: boolean;
  onClose: Function;
}

const Login = (props: IProps) => {
  const store = useStore();
  const { isShow = false, onClose } = props;
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('admin');
  const [loading, setLoading] = useState(false);
  const handleLoginClose = () => {
    onClose();
  };

  const handleLogin = () => {
    setLoading(true);
    if (!email || !password) {
      setLoading(false);
      return message.warning('請輸入帳號及密碼');
    }
    request
      .post('./api/user/userLogin', {
        email,
        password,
      })
      .then((res: any) => {
        store.user.setUserInfo(res.data);
        setLoading(false);
        onClose();
        message.success('登入成功');
        setEmail('');
        setPassword('');
      })
      .catch(() => {
        setLoading(false);
        message.warning('帳號或密碼錯誤');
      });
  };
  const handleEmailOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePasswordOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  return isShow ? (
    <div className={styles.loginArea}>
      <div className={styles.loginBox}>
        <div className={styles.loginTitle}>
          <div>登入</div>
          <div className={styles.close} onClick={handleLoginClose}>
            x
          </div>
        </div>
        <input
          onChange={handleEmailOnChange}
          value={email}
          type='email'
          placeholder='請輸入電子信箱'
        />

        <input
          value={password}
          onChange={handlePasswordOnChange}
          type='password'
          placeholder='請輸入密碼'
        />

        <Button
          onClick={handleLogin}
          className={styles.loginBtn}
          loading={loading}
        >
          登入
        </Button>
        <div className={styles.loginPrivacy}>
          註冊登入即表示同意
          <a href='https://google.com' target='_blank' rel='noreferrer'>
            隱私政策
          </a>
        </div>
      </div>
    </div>
  ) : null;
};

export default observer(Login);
