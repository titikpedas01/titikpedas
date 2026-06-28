import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/layout/Layout'
import AdminRoute from './components/layout/AdminRoute'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import CheckoutPage from './pages/CheckoutPage'
import CartPage from './pages/CartPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/LoginPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import OrderTrackingPage from './pages/OrderTrackingPage'
import NotFoundPage from './pages/NotFoundPage'
import AdminMenuPage from './pages/admin/AdminMenuPage'
import ScrollToTop from './components/ui/ScrollToTop'

// Placeholder sementara – akan diganti bertahap sesuai progres
function ComingSoon({ page }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <p className="font-heading text-5xl text-gray-200 select-none">{page}</p>
      <p className="text-sm text-gray-400">Halaman sedang dalam pengerjaan…</p>
    </div>
  )
}

export default function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <BrowserRouter>
          {/* Toast notifications global */}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: { fontFamily: 'Poppins, sans-serif', fontSize: '14px' },
              success: { iconTheme: { primary: '#A30D0D', secondary: '#fff' } },
            }}
          />

          <ScrollToTop />
          <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <HomePage />
                </Layout>
              }
            />
            <Route
              path="/produk"
              element={
                <Layout>
                  <ProductPage />
                </Layout>
              }
            />
            <Route
              path="/tentang"
              element={
                <Layout>
                  <AboutPage />
                </Layout>
              }
            />
            <Route
              path="/kontak"
              element={
                <Layout>
                  <ContactPage />
                </Layout>
              }
            />
            <Route
              path="/keranjang"
              element={
                <Layout>
                  <CartPage />
                </Layout>
              }
            />
            <Route
              path="/checkout"
              element={
                <Layout>
                  <CheckoutPage />
                </Layout>
              }
            />
            <Route
              path="/konfirmasi"
              element={
                <Layout>
                  <OrderConfirmationPage />
                </Layout>
              }
            />
            <Route
              path="/login"
              element={
                <Layout>
                  <LoginPage />
                </Layout>
              }
            />

          <Route
            path="/riwayat"
            element={
              <Layout>
                <OrderHistoryPage />
              </Layout>
            }
          />
          <Route
            path="/cek-pesanan"
            element={
              <Layout>
                <OrderTrackingPage />
              </Layout>
            }
          />

            {/* ── Admin (hanya email terdaftar) ─────────────────────── */}
            <Route element={<AdminRoute />}>
              <Route
                path="/admin/orders"
                element={
                  <Layout>
                    <AdminOrdersPage />
                  </Layout>
                }
              />
              <Route
                path="/admin/menu"
                element={
                  <Layout>
                    <AdminMenuPage />
                  </Layout>
                }
              />
            </Route>

            {/* ── 404 ───────────────────────────────────────────────── */}
            <Route
              path="*"
              element={
                <Layout>
                  <NotFoundPage />
                </Layout>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </CartProvider>
  )
}
