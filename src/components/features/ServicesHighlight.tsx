import { Link } from "react-router-dom";
import {
  CreditCard, Layout, Gift, Package, MapPin, Shirt, Palette, FileText
} from "lucide-react";
import { SERVICES } from "@/constants/data";

const ICON_MAP: Record<string, React.ElementType> = {
  CreditCard, Layout, Gift, Package, MapPin, Shirt, Palette, FileText,
};

const ServicesHighlight = () => {
  return (
    <section className="py-20 bg-white px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-brand-orange font-semibold text-sm uppercase tracking-widest">What We Do</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-brand-black mt-2">
              Services Built for<br />Bold Brands
            </h2>
          </div>
          <Link
            to="/services"
            className="text-brand-orange font-semibold hover:underline text-sm flex items-center gap-1 shrink-0"
          >
            See all services →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((service) => {
            const Icon = ICON_MAP[service.icon] ?? CreditCard;
            return (
              <div
                key={service.id}
                className="group p-6 rounded-xl border border-gray-100 hover:border-brand-orange/30 hover:shadow-lg hover:shadow-orange-50 transition-all duration-300 cursor-pointer"
              >
                <div className="w-12 h-12 bg-brand-orange/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-orange transition-colors duration-300">
                  <Icon className="w-5 h-5 text-brand-orange group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-display font-bold text-base text-brand-black mb-2">
                  {service.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  {service.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-brand-orange font-semibold text-sm">
                    From {service.startingPrice}
                  </span>
                  <Link
                    to="/quote"
                    className="text-xs text-muted-foreground hover:text-brand-orange transition-colors"
                  >
                    Quote →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesHighlight;
