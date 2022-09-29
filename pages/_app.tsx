import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { StoreProvider } from '../store';
import Layout from '../components/layout';
import { NextPage } from 'next';

interface IProps {
  initialValue: Record<any, any>;
  Component: NextPage;
  pageProps: any;
}

function MyApp({ initialValue, Component, pageProps }: IProps) {
  const renderLayout = () => {
    if ((Component as any).layout === null) {
      return <Component {...pageProps} />;
    } else {
      return (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      );
    }
  };
  return (
    <StoreProvider initialValue={initialValue}>{renderLayout()}</StoreProvider>
  );
}

MyApp.getInitialProps = async ({ ctx }: { ctx: any }) => {
  const { email, nickname, userId } = ctx?.req?.cookies || {};
  return {
    initialValue: {
      user: {
        userInfo: {
          nickname,
          email,
          userId,
        },
      },
    },
  };
};

export default MyApp;
