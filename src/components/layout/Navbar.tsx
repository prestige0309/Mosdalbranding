import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Portfolio", path: "/portfolio" },
  { label: "Testimonials", path: "/testimonials" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-black/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-orange rounded flex items-center justify-center">
              <Printer className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-white text-lg tracking-tight">
              Mosdal<span className="text-brand-orange">Branding Solution</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? "text-brand-orange"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/quote">
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                Get a Quote
              </Button>
            </Link>
            <Link to="/order">
              <Button size="sm" className="bg-brand-orange hover:bg-orange-600 text-white">
                Place an Order
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-brand-black border-t border-white/10 px-4 py-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded text-sm font-medium ${
                isActive(link.path)
                  ? "text-brand-orange bg-white/5"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <Link to="/quote" onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent">
                Get a Quote
              </Button>
            </Link>
            <Link to="/order" onClick={() => setOpen(false)}>
              <Button className="w-full bg-brand-orange hover:bg-orange-600 text-white">
                Place an Order
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
