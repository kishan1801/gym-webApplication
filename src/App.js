import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../src/contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Layout
import Layout from './components/Layout/Layout';

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin Pages
import AdminPage from "./pages/AdminPage";
import TrainerList from './components/Trainers/TrainerList';
import AddTrainerForm from './components/Trainers/AddTrainerForm';
import TrainerDetail from "./components/Trainers/TrainerDetail";
import EditTrainerForm from "./components/Trainers/EditTrainerForm";
import MembershipManagement from "./components/Membership/MembershipManagement";
import AddMembershipForm from "./components/Membership/AddMembershipForm";
import EditMembershipForm from "./components/Membership/EditMembershipForm";
import MembershipDetailsModal from "./components/Membership/MembershipDetailsModal";
import ContactManagement from "./components/Contact/ContactManagement";
import UserList from "./components/Users/UserList";
import UserDetail from "./components/Users/UserDetail";
import EditUserForm from "./components/Users/EditUserForm";
import ProductsPage from "./pages/ProductsPage";
import FreeSessionsPage from "./pages/FreeSessionsPage";
import OrdersPage from "./pages/OrdersPage";
import PaymentDashboard from "./pages/PaymentDashboard";
import CoachApplicationsAdmin from "./pages/CoachApplicationsAdmin";

// User Pages
import UserDashboard from "./pages/UserDashboard";
import ShoppingPage from "./pages/ShoppingPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import Coach from "./pages/Coach";
import ProfilePage from "./pages/ProfilePage";

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import MembershipPage from './pages/MembershipPage';
import ServicesPage from './pages/ServicesPage';
import TrainersPage from './pages/TrainersPage';
import GalleryPage from './pages/GalleryPage';
import ContactForm from "./components/Contact/ContactForm";

// Error Pages
import NotFoundPage from "./pages/NotFoundPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes without Layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          {/* All other routes with Layout */}
          <Route element={<Layout />}>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/membership" element={<MembershipPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/trainers" element={<TrainersPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactForm />} />
            <Route path="/store" element={<ShoppingPage />} />
            <Route path="/coach" element={<Coach />} />

            {/* Protected User Routes */}
            <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/profile" element={<ProfilePage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation/:orderId?" element={<OrderConfirmationPage />} />
              
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminPage />} />
              
              {/* Trainer Management */}
              <Route path="/admin/trainers" element={<TrainerList />} />
              <Route path="/admin/trainers/add" element={<AddTrainerForm />} />
              <Route path="/admin/trainers/:id" element={<TrainerDetail />} />
              <Route path="/admin/trainers/edit/:id" element={<EditTrainerForm />} />

              {/* Membership Management */}
              <Route path="/admin/memberships" element={<MembershipManagement />} />
              <Route path="/admin/membership/add" element={<AddMembershipForm />} />
              <Route path="/admin/membership/edit/:id" element={<EditMembershipForm />} />
              <Route path="/admin/membership/view/:id" element={<MembershipDetailsModal />} />

              {/* User Management */}
              <Route path="/admin/users" element={<UserList />} />
              <Route path="/admin/users/:id" element={<UserDetail />} />
              <Route path="/admin/users/edit/:id" element={<EditUserForm />} />

              {/* Contact Management */}
              <Route path="/admin/contact" element={<ContactManagement />} />

              {/* Product Management */}
              <Route path="/admin/products" element={<ProductsPage />} />

              {/* Free Sessions */}
              <Route path="/admin/free-sessions" element={<FreeSessionsPage />} />

              <Route path="/admin/profile" element={<ProfilePage />} />
              

              {/* Orders & Payments */}
              <Route path="/admin/orders" element={<OrdersPage />} />
              <Route path="/admin/payments" element={<PaymentDashboard />} />

              {/* Coach Applications */}
              <Route path="/admin/coach-applications" element={<CoachApplicationsAdmin />} />
            </Route>

            {/* Legacy Routes Redirect */}
            <Route path="/dashboard" element={<Navigate to="/user/dashboard" replace />} />

            {/* 404 - Not Found */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}