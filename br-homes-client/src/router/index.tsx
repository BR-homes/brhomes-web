import { createBrowserRouter } from 'react-router-dom'

import MainLayout from '@/components/layout/MainLayout'
import AuthLayout from '@/components/layout/AuthLayout'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ProtectedRoute from '@/components/common/ProtectedRoute'

// Public pages
import HomePage from '@/pages/public/HomePage'
import ListingsPage from '@/pages/public/ListingsPage'
import PropertyDetailPage from '@/pages/public/PropertyDetailPage'

// Auth pages
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage'
import CompleteProfilePage from '@/pages/auth/CompleteProfilePage'
import OwnerPendingPage from '@/pages/auth/OwnerPendingPage'

// Buyer pages
import SavedPage from '@/pages/buyer/SavedPage'

// Owner pages
import OwnerDashboardPage from '@/pages/owner/OwnerDashboardPage'
import OwnerPropertiesPage from '@/pages/owner/OwnerPropertiesPage'
import AddPropertyPage from '@/pages/owner/AddPropertyPage'
import EditPropertyPage from '@/pages/owner/EditPropertyPage'

// Admin pages
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'
import PendingOwnersPage from '@/pages/admin/PendingOwnersPage'
import PendingPropertiesPage from '@/pages/admin/PendingPropertiesPage'
import ManagePropertiesPage from '@/pages/admin/ManagePropertiesPage'
import ManageUsersPage from '@/pages/admin/ManageUsersPage'
import SettingsPage from '@/pages/admin/SettingsPage'
import AdminSliderPage from '@/pages/admin/AdminSliderPage'
import ContactPage from '@/pages/public/ContactPage'

export const router = createBrowserRouter([
  // Auth pages (no navbar/footer)
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/verify-email', element: <VerifyEmailPage /> },
      { path: '/complete-profile', element: <CompleteProfilePage /> },
      { path: '/owner/pending', element: <OwnerPendingPage /> },
    ],
  },

  // Main pages with navbar/footer
  {
    element: <MainLayout />,
    children: [
      // Public
      { path: '/', element: <HomePage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/properties', element: <ListingsPage /> },
      { path: '/properties/:id', element: <PropertyDetailPage /> },

      // Buyer routes (requires buyer role)
      {
        element: <ProtectedRoute allowedRoles={['buyer']} />,
        children: [
          { path: '/buyer/saved', element: <SavedPage /> },
        ],
      },

      // Owner routes (requires owner role + approved)
      {
        element: <ProtectedRoute allowedRoles={['owner']} requireApproved />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: '/owner/dashboard', element: <OwnerDashboardPage /> },
              { path: '/owner/saved', element: <SavedPage /> },
              { path: '/owner/properties', element: <OwnerPropertiesPage /> },
              { path: '/owner/add-property', element: <AddPropertyPage /> },
              { path: '/owner/edit-property/:id', element: <EditPropertyPage /> },
            ],
          },
        ],
      },

      // Admin routes (requires admin role)
      {
        element: <ProtectedRoute allowedRoles={['admin']} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: '/admin/dashboard', element: <AdminDashboardPage /> },
              { path: '/admin/pending-owners', element: <PendingOwnersPage /> },
              { path: '/admin/pending-properties', element: <PendingPropertiesPage /> },
              { path: '/admin/properties', element: <ManagePropertiesPage /> },
              { path: '/admin/users', element: <ManageUsersPage /> },
              { path: '/admin/settings', element: <SettingsPage /> },
              { path: '/admin/slider', element: <AdminSliderPage /> },
            ],
          },
        ],
      },
    ],
  },
])
