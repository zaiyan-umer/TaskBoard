"use client";
import { usePathname } from "next/navigation";
import { SheetComponent } from "@/components/SheetComponent";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideOnAuth = pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register");
  return (
    <>
      {!hideOnAuth && <SheetComponent />}
      {children}
    </>
  );
}