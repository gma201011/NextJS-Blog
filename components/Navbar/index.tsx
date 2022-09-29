import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Avatar, Dropdown, Menu, message } from 'antd';
import { UserOutlined, HomeOutlined, LoginOutlined } from '@ant-design/icons';
import { useStore } from '../../store';
import { navs } from './config';
import request from '../../service/fetch';
import Login from '../Login';
import styles from './index.module.scss';

const Navbar: NextPage = () => {
  const store = useStore();
  const { nickname, userId } = store.user.userInfo;
  const { pathname, push } = useRouter();
  const [displayLogin, setDisplayLogin] = useState(false);

  const handleGoToEditorPage = () => {
    if (userId) {
      push('/editor/new');
    } else {
      message.warning('請先登入');
    }
  };

  const handleLogin = () => {
    setDisplayLogin(true);
  };

  const handleLoginClose = () => {
    setDisplayLogin(false);
  };

  const handleGoToPersonalPage = () => {
    push(`/user/${userId}`);
  };

  const handleLogout = () => {
    request.post('./api/user/userLogout').then((res: any) => {
      if (res?.code === 0) {
        return store.user.setUserInfo({});
      }
    });
  };

  const renderDropdownMenu = () => {
    const menuItems = [
      {
        key: 'personal',
        label: (
          <div onClick={handleGoToPersonalPage}>
            <HomeOutlined /> &ensp;個人頁面
          </div>
        ),
      },
      {
        key: 'logout',
        label: (
          <div onClick={handleLogout}>
            <LoginOutlined /> &ensp;退出系統
          </div>
        ),
      },
    ];
    return <Menu items={menuItems} />;
  };

  return (
    <div className={styles.navbar}>
      <section className={styles.logoArea}>BLOG</section>
      <section className={styles.linkArea}>
        {navs.map((nav) => {
          return (
            <Link key={nav?.label} href={nav?.value}>
              <a className={pathname === nav?.value ? styles.active : ''}>
                {nav?.label}
              </a>
            </Link>
          );
        })}
      </section>
      <section className={styles.operationArea}>
        <Button onClick={handleGoToEditorPage}>寫文章</Button>
        {nickname ? (
          <>
            <Dropdown overlay={renderDropdownMenu} placement='bottomLeft'>
              <Avatar icon={<UserOutlined />} size={32} />
            </Dropdown>
          </>
        ) : (
          <Button type='primary' onClick={handleLogin}>
            登入
          </Button>
        )}
      </section>
      <Login isShow={displayLogin} onClose={handleLoginClose} />
    </div>
  );
};

export default observer(Navbar);
