import React from 'react'
import { Route, Routes, Navigate } from 'react-router';
import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import CallPage from './pages/CallPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';
import FriendsPage from './pages/FriendsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

import { axiosInstance } from './lib/axios.js';
import PageLoader from './components/PageLoader.jsx';
import Layout from './components/Layout.jsx';

import { useThemeStore } from './store/useThemeStore.js';

const App = () => {
  const { theme } = useThemeStore();
  const { data: authData, isLoading } = useQuery({

    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");

      return res.data;
    },
    retry: false,
  });
  const authUser = authData?.user;
  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-[100dvh]" data-theme={theme}>

      <Routes>
        <Route path="/" element={authUser ? (authUser.isOnboarded ? <Layout showSidebar><HomePage /></Layout> : <Navigate to="/onboarding" />) : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/notifications" element={authUser ? <Layout showSidebar><NotificationsPage /></Layout> : <Navigate to="/login" />} />
        <Route path="/call/:id" element={authUser ? <CallPage /> : <Navigate to="/login" />} />
        <Route path="/chat/:id" element={authUser ? <Layout showNavbar={false}><ChatPage /></Layout> : <Navigate to="/login" />} />
        <Route path="/friends" element={authUser ? <Layout showSidebar><FriendsPage /></Layout> : <Navigate to="/login" />} />
        <Route path="/profile" element={authUser ? <Layout showSidebar><ProfilePage /></Layout> : <Navigate to="/login" />} />
        <Route path="/profile/:id" element={authUser ? <Layout showSidebar><ProfilePage /></Layout> : <Navigate to="/login" />} />
        <Route path="/onboarding" element={authUser ? (!authUser.isOnboarded ? <OnboardingPage /> : <Navigate to="/" />) : <Navigate to="/login" />} />


      </Routes>
      <Toaster />

    </div>
  );
};

export default App;
