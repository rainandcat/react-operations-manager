import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ManagerLayout } from '@/components/layout/ManagerLayout';
import { LoginPage } from '@/features/auth/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { RouteErrorPage } from '@/pages/RouteErrorPage';
import { ProtectedRoute, RequirePermission } from './ProtectedRoute';
const OverviewPage = lazy(() => import('@/features/dashboard/OverviewPage'));
const CustomersPage = lazy(() => import('@/features/customers/CustomersPage'));
const CustomerDetailPage = lazy(() => import('@/features/customers/CustomerDetailPage'));
const ActivitiesPage = lazy(() => import('@/features/activities/ActivitiesPage'));
const ActivityDetailPage = lazy(() => import('@/features/activities/ActivityDetailPage'));
const ReviewsPage = lazy(() => import('@/features/reviews/ReviewsPage'));
export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage />, errorElement: <RouteErrorPage /> },
  {
    path: '/',
    errorElement: <RouteErrorPage />,
    element: (
      <ProtectedRoute>
        <ManagerLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="overview" replace /> },
      { path: 'overview', element: <OverviewPage /> },
      { path: 'customers', element: <CustomersPage /> },
      { path: 'customers/:customerId', element: <CustomerDetailPage /> },
      { path: 'activities', element: <ActivitiesPage /> },
      { path: 'activities/:activityId', element: <ActivityDetailPage /> },
      {
        path: 'reviews',
        element: (
          <RequirePermission permission="review_cases">
            <ReviewsPage />
          </RequirePermission>
        )
      }
    ]
  },
  { path: '*', element: <NotFoundPage />, errorElement: <RouteErrorPage /> }
]);
