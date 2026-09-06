import { Link } from "react-router-dom";
import { Printer, MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  // Define the TikTok icon as a separate component
  const TikTokIcon = () => (
    <span className="font-bold text-sm" style={{ fontFamily: 'Arial, sans-serif' }}>
      T
    </span>
  );

  return (
    <footer className="bg-brand-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-orange rounded flex items-center justify-center">
                <Printer className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-white text-lg">
                Mosdal<span className="text-brand-orange">Branding Solution</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-5">
              We bring brands to life through premium printing, bold design, and meticulous attention to detail.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Instagram, href: "https://www.instagram.com/mosdal_branding_solutions?stkn=MWF0MWZ0ZzJvYjVpZw%3D%3D&utm_source=qr" },
                { icon: Facebook, href: "#" },
                { 
                  icon: TikTokIcon, 
                  href: "https://www.tiktok.com/@mosdal_branding_solution?_r=1&_t=ZS-99UBNJuKuxh" 
                },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 bg-white/10 hover:bg-brand-orange rounded flex items-center justify-center transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-base mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "About Us", path: "/about" },
                { label: "Services", path: "/services" },
                { label: "Portfolio", path: "/portfolio" },
                { label: "Testimonials", path: "/testimonials" },
                { label: "Get a Quote", path: "/quote" },
                { label: "Place an Order", path: "/order" },
                { label: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/60 hover:text-brand-orange text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-bold text-base mb-4">Our Services</h4>
            <ul className="space-y-2">
              {[
                "Graphic Design",
                "Business Cards",
                "Large Format Printing",
                "Banners & Flex",
                "Branded Merchandise",
                "Packaging",
                "Signage",
                "Apparel Printing",
                "Logo & Brand Design",
                "Flyers & Brochures",
                "Office & Event Branding",
                "Car Branding",
                "Bill Board",
                "& More"
              ].map((s) => (
                <li key={s}>
                  <Link
                    to="/services"
                    className="text-white/60 hover:text-brand-orange text-sm transition-colors"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-base mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-white/60">
                <MapPin className="w-4 h-4 text-brand-orange mt-0.5 shrink-0" />
                NO. 12 Alafia Street Mokola Ibadan
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Phone className="w-4 h-4 text-brand-orange shrink-0" />
                +234 703 498 6390
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Mail className="w-4 h-4 text-brand-orange shrink-0" />
                mosdalbranding@gmail.com
              </li>
              <li className="flex items-start gap-3 text-sm text-white/60">
                <Clock className="w-4 h-4 text-brand-orange mt-0.5 shrink-0" />
                Mon – Sat: 8am – 6pm<br />Sat: 9am – 6pm
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © 2026 Mosdal Branding Solution. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-white/40">
            <span className="hover:text-white/70 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white/70 cursor-pointer transition-colors">Terms of Service</span>
            <Link to="/admin" className="hover:text-white/70 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;