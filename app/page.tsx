"use client";

import React, { useState } from "react";
import { DashboardComponent } from "@/components/dashboard";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/i18n/context";

export default function Home() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <DashboardComponent />
      </I18nProvider>
    </ThemeProvider>
  );
}