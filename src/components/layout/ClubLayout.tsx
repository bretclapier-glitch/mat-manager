import { Link, Outlet, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, Menu, X } from "lucide-react";
import { useState } from "react";

// Mock club data — in production this would come from the database
const clubs: Record<string, { name: string; tagline: string; logo?: string }> = {
  sanderson: {
    name: "Sanderson Wrestling",
    tagline: "Building Champions On and Off the Mat",
  },
  thunder: {
    name: "Thunder Wrestling Club",
    tagline: "Strength. Discipline. Victory.",
  },
};

export function useClubData() {
  const { clubSlug } = useParams();
  return clubs[clubSlug || ""] || { name: "Wrestling Club", tagline: "" };
}

export default function ClubLayout() {
  const { clubSlug } = useParams();
  const club = useClubData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const basePath = `/club/${clubSlug}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Club Header */}
      <header className="border-b bg-navy text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to={basePath} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold flex items-center justify-center">
              <Trophy className="h-6 w-6 text-navy" />
            </div>
            <span className="font-display text-xl">{club.name.toUpperCase()}</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to={`${basePath}/programs`}
              className="text-white/70 hover:text-gold transition-colors text-sm font-medium"
            >
              Programs
            </Link>
            <Link
              to={`${basePath}/schedule`}
              className="text-white/70 hover:text-gold transition-colors text-sm font-medium"
            >
              Schedule
            </Link>
            <Link
              to={`${basePath}/store`}
              className="text-white/70 hover:text-gold transition-colors text-sm font-medium"
            >
              Shop
            </Link>
            <Link to={`${basePath}/login`}>
              <Button
                variant="outline"
                size="sm"
                className="border-gold text-gold hover:bg-gold hover:text-navy"
              >
                Parent Login
              </Button>
            </Link>
          </nav>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 px-4 py-4 space-y-3">
            <Link
              to={`${basePath}/programs`}
              className="block text-white/70 hover:text-gold py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Programs
            </Link>
            <Link
              to={`${basePath}/schedule`}
              className="block text-white/70 hover:text-gold py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Schedule
            </Link>
            <Link
              to={`${basePath}/store`}
              className="block text-white/70 hover:text-gold py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              to={`${basePath}/login`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button
                variant="outline"
                className="w-full border-gold text-gold hover:bg-gold hover:text-navy"
              >
                Parent Login
              </Button>
            </Link>
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-navy text-white/60 py-8 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} {club.name}. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Powered by{" "}
            <Link to="/" className="text-gold hover:underline">
              HomeTeam
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
