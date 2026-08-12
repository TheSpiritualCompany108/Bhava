import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import GuruChat from "./GuruChat";
import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import styles from "./Layout.module.css";

function ScrollToTopOnPush() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType !== "PUSH") return;
    // If navigation requested a specific scroll target, don't force-top
    if (location && location.state && location.state.scrollToId) return;

    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    const doScrollTop = () => {
      window.scrollTo(0, 0);
    };
    doScrollTop();

    // Reinforce across a few frames
    let tries = 0;
    const enforce = () => {
      tries += 1;
      window.scrollTo(0, 0);
      if (tries < 6) requestAnimationFrame(enforce);
    };
    requestAnimationFrame(enforce);

    // In case images or other resources load later and push layout, re-apply on load
    const onLoad = () => window.scrollTo(0, 0);
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      html.style.scrollBehavior = prev || "";
    };
  }, [location.key, navigationType, location.state]);

  return null;
}
 
function Layout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && (
        <>
          <div className={styles.betaTag}>BETA</div>
          <Navbar />
        </>
      )}
      <ScrollToTopOnPush />
      <Outlet />
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <GuruChat />}
    </>
  );
}

export default Layout;