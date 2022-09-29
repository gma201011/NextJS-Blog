import type { NextPage } from 'next';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { ReactNode } from 'react';

type ILayoutProps = {
  children: ReactNode;
};

const Layout: NextPage<ILayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
