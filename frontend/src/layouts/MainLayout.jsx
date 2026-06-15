import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer/Footer.jsx';
import Navbar from '../components/Navbar/Navbar.jsx';

const ChatWidget = React.lazy(() => import('../components/chat/ChatWidget.jsx'));

const MainLayout = () => (
  <>
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Suspense fallback={null}>
      <ChatWidget />
    </Suspense>
    <Footer />
  </>
);

export default MainLayout;
