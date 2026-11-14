import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigationType } from "react-router-dom";
import Navbar from "./Navbar";
import PageBack from "./PageBack";
import AskBhavaFab from "./AskBhavaFab";
import Footer from "./Footer";
import GuruChat from "./GuruChat";
import BhavaOptionDialog from "./BhavaOptionDialog";
import BhavaVoiceCall from "./BhavaVoiceCall";
import { warmupVoiceBackend } from "../utils/voiceBackendWarmup";

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
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const openDialog = () => {
      warmupVoiceBackend();
      setDialogOpen(true);
    };
    window.addEventListener("bhava:dialog:open", openDialog);
    return () => window.removeEventListener("bhava:dialog:open", openDialog);
  }, []);

  const handleSelectChat = () => {
    setDialogOpen(false);
    window.dispatchEvent(new Event("guru:open"));
  };

  const handleSelectCall = () => {
    warmupVoiceBackend();
    setDialogOpen(false);
    window.dispatchEvent(new Event("bhava:call:open"));
  };

  return (
    <>
      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && <PageBack />}
      <ScrollToTopOnPush />
      <Outlet />
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && (
        <>
          <AskBhavaFab />
          <GuruChat />
          <BhavaVoiceCall />
          <BhavaOptionDialog
            isOpen={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onSelectChat={handleSelectChat}
            onSelectCall={handleSelectCall}
          />
        </>
      )}
    </>
  );
}

export default Layout;