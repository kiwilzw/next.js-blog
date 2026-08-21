import { Navbar } from "@/components/web/navbar";

export default function ShareLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}