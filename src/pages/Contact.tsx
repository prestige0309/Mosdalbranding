import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter, Send } from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setForm({ name: "", email: "", subject: "", message: "" });
      toast.success("Message sent! We'll reply within 24 hours.");
    }, 1000);
  };

  const CONTACT_INFO = [
    {
      icon: MapPin,
      title: "Visit Our Office",
      lines: ["NO. 12 Alafia Street Mokola Ibadan, Oyo State, Nigeria"],
    },
    {
      icon: Phone,
      title: "Call or WhatsApp",
      lines: ["+234 703 498 6390"],
    },
    {
      icon: Mail,
      title: "Email Us",
      lines: ["mosdalbranding@gmail.com"],
    },
    {
      icon: Clock,
      title: "Business Hours",
      lines: ["Mon – Fri: 8:00am – 6:00pm", "Saturday: 9:00am – 6:00pm", "Sunday: Closed"],
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="bg-brand-black pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-orange" />
        <div className="max-w-7xl mx-auto">
          <span className="text-brand-orange font-semibold text-sm uppercase tracking-widest">Contact Us</span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mt-3 mb-5 max-w-xl leading-tight">
            Let's Start a<br />Conversation
          </h1>
          <p className="text-white/65 text-lg max-w-lg leading-relaxed">
            Have a project in mind? A question? Or just want to say hello? We're always ready to talk.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              {CONTACT_INFO.map(({ icon: Icon, title, lines }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-10 h-10 bg-brand-orange/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-brand-orange" />
                  </div>
                  <div>
                    <div className="font-semibold text-brand-black text-sm mb-1">{title}</div>
                    {lines.map((line) => (
                      <div key={line} className="text-muted-foreground text-sm">{line}</div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-gray-100">
                <div className="font-semibold text-brand-black text-sm mb-3">Follow Us</div>
                <div className="flex gap-3">
                  {[
                    { icon: Instagram, href: "https://www.instagram.com/mosdal_branding_solutions?stkn=MWF0MWZ0ZzJvYjVpZw%3D%3D&utm_source=qr", label: "Instagram" },
                    { icon: Facebook, href: "#", label: "Facebook" },
                    { icon: Twitter, href: "https://www.tiktok.com/@mosdal_branding_solution?_r=1&_t=ZS-99UBNJuKuxh", label: "Twitter" },
                  ].map(({ icon: SocIcon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      className="w-9 h-9 bg-brand-gray rounded-lg flex items-center justify-center hover:bg-brand-orange hover:text-white text-gray-600 transition-colors"
                      aria-label={label}
                    >
                      <SocIcon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="c-name" className="text-sm font-semibold text-brand-black">Full Name *</Label>
                    <Input
                      id="c-name"
                      required
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="Your full name"
                      className="mt-1.5 focus-visible:ring-brand-orange"
                    />
                  </div>
                  <div>
                    <Label htmlFor="c-email" className="text-sm font-semibold text-brand-black">Email Address *</Label>
                    <Input
                      id="c-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="you@example.com"
                      className="mt-1.5 focus-visible:ring-brand-orange"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="c-subject" className="text-sm font-semibold text-brand-black">Subject</Label>
                  <Input
                    id="c-subject"
                    value={form.subject}
                    onChange={(e) => set("subject", e.target.value)}
                    placeholder="What's this about?"
                    className="mt-1.5 focus-visible:ring-brand-orange"
                  />
                </div>
                <div>
                  <Label htmlFor="c-message" className="text-sm font-semibold text-brand-black">Message *</Label>
                  <Textarea
                    id="c-message"
                    required
                    value={form.message}
                    onChange={(e) => set("message", e.target.value)}
                    placeholder="Tell us how we can help..."
                    rows={6}
                    className="mt-1.5 resize-none focus-visible:ring-brand-orange"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-brand-orange hover:bg-orange-600 text-white font-semibold h-12 px-8 gap-2"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>

          {/* Map Embed */}
          <div className="mt-16">
            <h3 className="font-display font-bold text-xl text-brand-black mb-5">Find Our Studio</h3>
            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 h-72 sm:h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d8009.598689086527!2d3.891100062029259!3d7.4081949702472185!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sng!4v1788606871289!5m2!1sen!2sng"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mosdal Branding Solution Location"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
