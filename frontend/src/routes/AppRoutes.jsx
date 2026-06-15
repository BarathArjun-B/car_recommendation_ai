import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Loader from '../components/Loader/Loader.jsx';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute.jsx';
import MainLayout from '../layouts/MainLayout.jsx';

const Home = lazy(() => import('../pages/Home.jsx'));
const NewCars = lazy(() => import('../pages/NewCars.jsx'));
const UsedCars = lazy(() => import('../pages/UsedCars.jsx'));
const CarDetails = lazy(() => import('../pages/CarDetails.jsx'));
const Reviews = lazy(() => import('../pages/Reviews.jsx'));
const Login = lazy(() => import('../pages/Login.jsx'));
const Register = lazy(() => import('../pages/Register.jsx'));
const Profile = lazy(() => import('../pages/Profile.jsx'));
const Wishlist = lazy(() => import('../pages/Wishlist.jsx'));
const Compare = lazy(() => import('../pages/Compare.jsx'));
const NotFound = lazy(() => import('../pages/NotFound.jsx'));
const AiRecommendations = lazy(() => import('../pages/AiRecommendations.jsx'));

const AppRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/new-cars" element={<NewCars />} />
        <Route path="/used-cars" element={<UsedCars />} />
        <Route path="/cars/:id" element={<CarDetails />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/ai-recommend" element={<AiRecommendations />} />
        <Route path="/account" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </Suspense>
);

export default AppRoutes;
