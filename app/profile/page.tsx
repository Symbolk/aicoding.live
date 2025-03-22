"use client";

import React, { useState } from "react";
import { Dashboard } from "@/components/ui/dashboard";
import { Profile } from "@/components/ui/profile";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/i18n/context";

export default function ProfilePage() {
  const [activePage, setActivePage] = useState("profile");

  const handlePageChange = (page: string) => {
    if (page === "home") {
      window.location.href = "/";
      return;
    }
    setActivePage(page);
  };

  return (
    <ThemeProvider>
      <I18nProvider>
        <Dashboard activePage={activePage} onPageChange={handlePageChange}>
          <Profile />
        </Dashboard>
      </I18nProvider>
    </ThemeProvider>
  );
} 