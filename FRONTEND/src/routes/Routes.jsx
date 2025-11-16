import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "../layout/Dashboard";

export function RoutesApp() {
  return (
    <Routes>
      <Route />
      <Route path="/" element={<Dashboard />}>
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}