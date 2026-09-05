import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

interface CTABannerProps {
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  primaryPath?: string;
  secondaryLabel?: string;
  secondaryPath?: string;
}

const CTABanner = ({
  title = "Ready to Bring Your Brand to Life?",
  subtitle = "Get a free consultation and custom quote tailored to your project. Fast turnaround, premium quality — guaranteed.",
  primaryLabel = "Request a Free Quote",
  primaryPath = "/quote",
  secondaryLabel = "View Our Work",
  secondaryPath = "/portfolio",
}: CTABannerProps) => {
  return (
    <section className="bg-brand-orange py-20 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-black/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <Zap className="w-3.5 h-3.5" />
          Fast Turnaround. Premium Quality.
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-5 leading-tight">
          {title}
        </h2>
        <p className="text-white/85 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to={primaryPath}>
            <Button
              size="lg"
              className="bg-white text-brand-orange hover:bg-white/90 font-semibold text-base px-8 h-12"
            >
              {primaryLabel}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to={secondaryPath}>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/10 bg-transparent font-semibold text-base px-8 h-12"
            >
              {secondaryLabel}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
