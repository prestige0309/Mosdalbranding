import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CTABanner from "@/components/features/CTABanner";
import { NOTABLE_BRANDS } from "@/constants/data";
import { Target, Eye, Heart } from "lucide-react";
import workshopImage from "@/assets/photo_2026-09-05_19-51-26.jpg";
import workshopImage1 from "@/assets/YAQC5542.jpg";
import workshopImage2 from "@/assets/PCON4774.jpg";
import workshopImage3 from "@/assets/NWGZ6665.jpg";
import notable1 from "@/assets/notable1.jpg";
import notable2 from "@/assets/notable2.jpg";
import notable3 from "@/assets/notable3.jpg";
import notable4 from "@/assets/notable4.jpg";
import notable5 from "@/assets/notable5.jpg";
import notable6 from "@/assets/notable6.jpg";
import notable7 from "@/assets/notable7.jpg";
import notable8 from "@/assets/notable8.jpg";

const VALUES = [
  {
    icon: Target,
    title: "Results-Driven",
    desc: "Every project we take on has a clear goal — to make your brand stand out and drive real results for your business.",
  },
  {
    icon: Eye,
    title: "Attention to Detail",
    desc: "From color accuracy to finishing touches, we obsess over every detail so your brand always looks its absolute best.",
  },
  {
    icon: Heart,
    title: "Client-First Culture",
    desc: "Your satisfaction is our benchmark. We listen, collaborate, and iterate until you love what we've created.",
  },
];

// Map brand indices to their respective images
const BRAND_IMAGES = [notable1, notable2, notable3, notable4, notable5, notable6, notable7, notable8];

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="bg-brand-black pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-orange" />
        <div className="absolute -right-32 top-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto">
          <span className="text-brand-orange font-semibold text-sm uppercase tracking-widest">Our Story</span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white mt-3 mb-6 max-w-3xl leading-tight">
            We're the Office Behind<br />
            <span className="text-brand-orange">Iconic Brands</span>
          </h1>
          <p className="text-white/65 text-lg max-w-2xl leading-relaxed">
            Founded in 2018, Mosdal Branding Solution started as a small Ibadan print shop with big ambitions. Today, we're a full-service printing and branding powerhouse trusted by over 500 businesses across Nigeria.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-brand-orange font-semibold text-sm uppercase tracking-widest">The Journey</span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-brand-black mt-2 mb-6">
                From a Single Printer to a Full-Service Studio
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Mosdal Branding Solution was born out of a simple observation: Nigerian businesses deserved world-class print and branding quality. In 2018, founder Moshood Alola invested in a single large-format printer and a small workspace in Victoria Island. Within six months, word spread fast.
                </p>
                <p>
                  By 2020, we had outgrown our first studio. We relocated to a 3,000 sqft facility, expanded our team to 12, and invested in industry-leading equipment — from UV flatbed printers to embroidery machines and laser cutters.
                </p>
                <p>
                  Today, Mosdal Branding Solution is the go-to branding partner for startups, corporates, events, and everything in between. Our mission remains the same: to give every brand the visual identity it deserves.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src={workshopImage}
                alt="Mosdal Branding Solution Workshop"
                className="rounded-xl w-full aspect-square object-cover"
              />
              <img
                src={workshopImage1}
                alt="Team at work"
                className="rounded-xl w-full aspect-[3/4] object-cover mt-8"
              />
              <img
                src={workshopImage2}
                alt="Printing equipment"
                className="rounded-xl w-full aspect-[3/4] object-cover -mt-8"
              />
              <img
                src={workshopImage3}
                alt="Finished products"
                className="rounded-xl w-full aspect-square object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-brand-gray px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-brand-orange font-semibold text-sm uppercase tracking-widest">Our Mission & Values</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-brand-black mt-2">
              What Drives Everything We Do
            </h2>
          </div>

          {/* Mission Statement */}
          <div className="bg-brand-black rounded-2xl p-10 text-center mb-12">
            <div className="w-1 h-12 bg-brand-orange mx-auto mb-6 rounded-full" />
            <p className="font-display font-bold text-2xl sm:text-3xl text-white max-w-3xl mx-auto leading-snug">
              "We don't just brand businesses; we build identities that command attention, inspire confidence, and leave a lasting impression."
            </p>
            <p className="text-white/50 mt-4 text-sm">— Moshood Alola, Founder</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-7 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-brand-orange/10 rounded-xl flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-brand-orange" />
                </div>
                <h3 className="font-display font-bold text-lg text-brand-black mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notable Brands */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-brand-orange font-semibold text-sm uppercase tracking-widest">Our Clients</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-brand-black mt-2">
              Notable Brands We Have Worked With
            </h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              We've had the privilege of working with these amazing brands across various industries
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {NOTABLE_BRANDS.map((brand, index) => {
              const brandImage = BRAND_IMAGES[index % BRAND_IMAGES.length];
              
              return (
                <div
                  key={brand.name}
                  className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={brandImage}
                      alt={brand.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CTABanner
        title="Let's Build Something Incredible Together"
        subtitle="Join over 500 businesses that trust Mosdal Branding Solution to deliver print and branding excellence."
        primaryLabel="Start Your Project"
        primaryPath="/quote"
      />
      <Footer />
    </div>
  );
};

export default About;