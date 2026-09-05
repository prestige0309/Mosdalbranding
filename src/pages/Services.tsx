import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CTABanner from "@/components/features/CTABanner";
import { SERVICES } from "@/constants/data";
import { Button } from "@/components/ui/button";
import {
  CreditCard, Layout, Gift, Package, MapPin, Shirt, Palette, FileText, ArrowRight
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  CreditCard, Layout, Gift, Package, MapPin, Shirt, Palette, FileText,
};

const PROCESS = [
  { step: "01", title: "Consult", desc: "Tell us about your project, goals, and budget. We'll advise on the best approach." },
  { step: "02", title: "Design", desc: "Our designers create artwork for your approval. We revise until you're thrilled." },
  { step: "03", title: "Print & Produce", desc: "We produce your order on premium equipment with rigorous quality checks." },
  { step: "04", title: "Deliver", desc: "Fast, safe delivery to your door. Most orders ship within 48–72 hours." },
];

const Services = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="bg-brand-black pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-orange" />
        <div className="max-w-7xl mx-auto">
          <span className="text-brand-orange font-semibold text-sm uppercase tracking-widest">Services</span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white mt-3 mb-5 max-w-2xl leading-tight">
            Everything Your Brand Needs
          </h1>
          <p className="text-white/65 text-lg max-w-xl leading-relaxed">
            From business cards to full brand identities — we offer a complete suite of printing and branding services for businesses of all sizes.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICES.map((service) => {
              const Icon = ICON_MAP[service.icon] ?? CreditCard;
              return (
                <div
                  key={service.id}
                  className="group flex gap-5 p-7 rounded-2xl border border-gray-100 hover:border-brand-orange/30 hover:shadow-xl hover:shadow-orange-50 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-brand-orange/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-brand-orange transition-colors duration-300">
                    <Icon className="w-6 h-6 text-brand-orange group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-display font-bold text-lg text-brand-black">{service.name}</h3>
                      <span className="text-brand-orange font-bold text-sm shrink-0 mt-0.5">
                        From {service.startingPrice}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {service.description}
                    </p>
                    <Link to={`/quote?service=${encodeURIComponent(service.name)}`}>
                      <Button
                        size="sm"
                        className="bg-brand-orange hover:bg-orange-600 text-white text-xs h-8"
                      >
                        Request a Quote
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-brand-black px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-brand-orange font-semibold text-sm uppercase tracking-widest">How It Works</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mt-2">
              Our Simple 4-Step Process
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS.map(({ step, title, desc }) => (
              <div key={step} className="relative">
                <div className="text-brand-orange/20 font-display font-bold text-6xl leading-none mb-3">{step}</div>
                <h3 className="font-display font-bold text-white text-xl mb-2">{title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
      <Footer />
    </div>
  );
};

export default Services;
