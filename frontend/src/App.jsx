import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import Layout from "./components/Layout";
import ScrollManager from "./components/ScrollManager";
import Home from "./pages/Home";
const Knowledge = lazy(() => import("./knowledge/Knowledge"));
const KnowledgeRoutes = lazy(() => import("./knowledge/KnowledgeRoutes"));
const Products = lazy(() => import("./products/Products"));
const Services = lazy(() => import("./services/Services"));
const ExploreServices = lazy(() => import("./services/ExploreServices"));
const KundliGenerator = lazy(() => import("./services/KundliGenerator"));
const DailyHoroscope = lazy(() => import("./services/DailyHoroscope"));
const AppPage = lazy(() => import("./app/AppPage"));
const CommunityPage = lazy(() => import("./community/CommunityPage"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const AuthPage = lazy(() => import("./auth/AuthPage"));
const CartPage = lazy(() => import("./cart/CartPage"));
const CheckoutPage = lazy(() => import("./cart/CheckoutPage"));
const ProfilePage = lazy(() => import("./account/ProfilePage"));
const WishlistPage = lazy(() => import("./account/WishlistPage"));
const OrdersPage = lazy(() => import("./account/OrdersPage"));
const AddressesPage = lazy(() => import("./account/AddressesPage"));
const CareerPage = lazy(() => import("./pages/carrerpage"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const AdminLogin = lazy(() => import("./admin/AdminLogin"));
const AdminPage = lazy(() => import("./admin/AdminPage"));
const ProductDetail = lazy(() => import("./products/ProductDetail"));
const BundleDetail = lazy(() => import("./products/BundleDetail"));
const PolicyPage = lazy(() => import("./pages/PolicyPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
      <WishlistProvider>
        <ScrollManager />
        <Suspense fallback={null}>
        <Routes>
          {/* Auth page — outside Layout (no navbar/footer) */}
          <Route path="/auth" element={<AuthPage />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/collection/:slug" element={<BundleDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />

            {/* Account pages */}
            <Route path="/account/profile"   element={<ProfilePage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/account/orders"    element={<OrdersPage />} />
            <Route path="/account/addresses" element={<AddressesPage />} />

            <Route path="/services"   element={<Services />} />
            <Route path="/explore-services" element={<ExploreServices />} />
            <Route path="/kundli-generator" element={<KundliGenerator />} />
            <Route path="/daily-horoscope" element={<DailyHoroscope />} />
            <Route path="/app"        element={<AppPage />} />
            <Route path="/community"  element={<CommunityPage />} />
            <Route path="/contact"    element={<ContactUs />} />
            <Route path="/faq"        element={<FAQPage />} />
            <Route path="/shipping-policy" element={<PolicyPage />} />
            <Route path="/returns-refund-policy" element={<PolicyPage />} />
            <Route path="/privacy-policy" element={<PolicyPage />} />
            <Route path="/terms" element={<PolicyPage />} />
            <Route path="/knowledge"  element={<Knowledge />} />
            <Route path="/knowledge/*" element={<KnowledgeRoutes />} />
              <Route path="/career"     element={<CareerPage />} />
            <Route path="/about"      element={<AboutUs />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        </Suspense>
      </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
