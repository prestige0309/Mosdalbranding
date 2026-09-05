import { CheckCircle2, Award, Clock, Users } from "lucide-react";

const WHY_US = [
  {
    icon: Award,
    title: "Award-Winning Quality",
    desc: "Our prints meet the highest industry standards. We use only premium materials and state-of-the-art equipment.",
  },
  {
    icon: Clock,
    title: "Fast Turnaround",
    desc: "Most projects delivered in 48–72 hours. Rush orders available. We know your deadlines matter.",
  },
  {
    icon: Users,
    title: "Dedicated Support",
    desc: "A dedicated account manager guides you from concept to delivery, every step of the way.",
  },
  {
    icon: CheckCircle2,
    title: "100% Satisfaction",
    desc: "Not happy? We'll redo it. Our quality guarantee means you only pay for what you love.",
  },
];

const WhyUs = () => (
  <section className="py-20 bg-white px-4">
    <div className="max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-brand-orange font-semibold text-sm uppercase tracking-widest">Why Choose Us</span>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-brand-black mt-2">
          The Mosdal Branding Solution Difference
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {WHY_US.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="text-center">
            <div className="w-14 h-14 bg-brand-orange rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-orange-200">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-display font-bold text-base text-brand-black mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyUs;
