import { Link, Outlet, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Target, Menu, X } from "lucide-react";
import { useState } from "react";

const clubs: Record<string, { name: string; tagline: string }> = {
  thunder: { name: "Austin Thunder Baseball", tagline: "Swing for the Fences" },
  eagles: { name: "Hill Country Eagles", tagline: "Soar Above the Competition" },
};

export function useBaseballClubData() {
  const { clubSlug } = useParams();
  return clubs[clubSlug || ""] || { name: "Baseball Club", tagline: "" };
}

export default function BaseballClubLayout() {
  const { clubSlug } = useParams();
  const club = useBaseballClubData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const basePath = `/baseball/club/${clubSlug}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-[hsl(150,30%,12%)] text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to={basePath} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[hsl(150,45%,35%)] flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
            <span className="font-display text-xl">{club.name.toUpperCase()}</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to={`${basePath}/programs`} className="text-white/70 hover:text-[hsl(150,45%,45%)] transition-colors text-sm font-medium">Programs</Link>
            <Link to={`${basePath}/schedule`} className="text-white/70 hover:text-[hsl(150,45%,45%)] transition-colors text-sm font-medium">Schedule</Link>
            <Link to={`${basePath}/store`} className="text-white/70 hover:text-[hsl(150,45%,45%)] transition-colors text-sm font-medium">Shop</Link>
            <Link to={`${basePath}/login`}>
              <Button variant="outline" size="sm" className="border-[hsl(150,45%,45%)] text-[hsl(150,45%,45%)] hover:bg-[hsl(150,45%,35%)] hover:text-white">Parent Login</Button>
            </Link>
          </nav>
          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 px-4 py-4 space-y-3">
            <Link to={`${basePath}/programs`} className="block text-white/70 hover:text-[hsl(150,45%,45%)] py-2" onClick={() => setMobileMenuOpen(false)}>Programs</Link>
            <Link to={`${basePath}/schedule`} className="block text-white/70 hover:text-[hsl(150,45%,45%)] py-2" onClick={() => setMobileMenuOpen(false)}>Schedule</Link>
            <Link to={`${basePath}/store`} className="block text-white/70 hover:text-[hsl(150,45%,45%)] py-2" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
            <Link to={`${basePath}/login`} onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full border-[hsl(150,45%,45%)] text-[hsl(150,45%,45%)] hover:bg-[hsl(150,45%,35%)] hover:text-white">Parent Login</Button>
            </Link>
          </div>
        )}
      </header>
      <main className="flex-1"><Outlet /></main>
      <footer className="bg-[hsl(150,30%,12%)] text-white/60 py-8 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} {club.name}. All rights reserved.</p>
          <p className="mt-2 text-sm">Powered by <Link to="/" className="text-[hsl(150,45%,45%)] hover:underline">HomeTeam</Link></p>
        </div>
      </footer>
    </div>
  );
}
