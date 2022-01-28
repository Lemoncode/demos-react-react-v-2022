import React from "react";

export const AppLayout: React.FC = ({ children }) => (
  <div className="layout-app-container">
    <div className="layout-app-header">User Logged in</div>
    {children}
  </div>
);
