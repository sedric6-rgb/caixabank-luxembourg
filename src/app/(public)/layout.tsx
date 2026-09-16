import { BankHeader } from "@/components/BankHeader";
import { BankFooter } from "@/components/BankFooter";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BankHeader />
      <main className="flex-1">{children}</main>
      <BankFooter />
    </>
  );
}
