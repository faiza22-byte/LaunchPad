import React, { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [open, setOpen] = useState(true);

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      <div className="flex">{children}</div>
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}

export function Sidebar({ children, className = "" }) {
  const { open } = useSidebar();

  return (
    <aside
      className={`h-screen border-r bg-white transition-all ${
        open ? "w-72" : "w-16"
      } ${className}`}
    >
      {children}
    </aside>
  );
}

export function SidebarTrigger() {
  const { open, setOpen } = useSidebar();

  return (
    <button
      onClick={() => setOpen(!open)}
      className="p-2 m-2 border rounded-md hover:bg-gray-100"
    >
      {open ? "Close" : "Open"}
    </button>
  );
}

export function SidebarHeader({ children, className = "" }) {
  return <div className={`border-b ${className}`}>{children}</div>;
}

export function SidebarContent({ children, className = "" }) {
  return <div className={`flex-1 overflow-y-auto ${className}`}>{children}</div>;
}

export function SidebarFooter({ children, className = "" }) {
  return <div className={`border-t ${className}`}>{children}</div>;
}

export function SidebarGroup({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function SidebarGroupLabel({ children, className = "" }) {
  return (
    <div className={`px-4 text-xs font-semibold uppercase text-gray-500 ${className}`}>
      {children}
    </div>
  );
}

export function SidebarMenu({ children }) {
  return <ul className="space-y-1">{children}</ul>;
}

export function SidebarMenuItem({ children }) {
  return <li>{children}</li>;
}

export function SidebarMenuButton({ children, isActive, asChild }) {
  const classes = `block w-full text-left px-3 py-2 rounded-lg transition ${
    isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
  }`;

  if (asChild) {
    return React.cloneElement(children, { className: classes });
  }

  return <button className={classes}>{children}</button>;
}