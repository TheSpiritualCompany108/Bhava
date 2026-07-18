import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Layout from "./components/Layout";
import ScrollManager from "./components/ScrollManager";
import Home from "./pages/Home";
import Knowledge from "./knowledge/Knowledge";
import KnowledgeRoutes from "./knowledge/KnowledgeRoutes";
import Products from "./products/Products";
import Services from "./services/Services";
import AppPage from "./app/AppPage";
import CommunityPage from "./community/CommunityPage";
import ContactUs from "./pages/ContactUs";
import FAQPage from "./pages/FAQPage";
import AuthPage from "./auth/AuthPage";
import CartPage from "./cart/CartPage";
import ProfilePage from "./account/ProfilePage";
import OrdersPage from "./account/OrdersPage";
import AddressesPage from "./account/AddressesPage";
import CareerPage from "./pages/carrerpage";
import AboutUs from "./pages/AboutUs";
import AdminLogin from "./admin/AdminLogin";
import AdminPage from "./admin/AdminPage";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ScrollManager />
        <Routes>
          {/* Auth page — outside Layout (no navbar/footer) */}
          <Route path="/auth" element={<AuthPage />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<CartPage />} />

            {/* Account pages */}
            <Route path="/account/profile"   element={<ProfilePage />} />
            <Route path="/account/orders"    element={<OrdersPage />} />
            <Route path="/account/addresses" element={<AddressesPage />} />

            <Route path="/services"   element={<Services />} />
            <Route path="/app"        element={<AppPage />} />
            <Route path="/community"  element={<CommunityPage />} />
            <Route path="/contact"    element={<ContactUs />} />
            <Route path="/faq"        element={<FAQPage />} />
            <Route path="/knowledge"  element={<Knowledge />} />
            <Route path="/knowledge/*" element={<KnowledgeRoutes />} />
              <Route path="/career"     element={<CareerPage />} />
            <Route path="/about"      element={<AboutUs />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
