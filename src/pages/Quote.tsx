import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { addQuoteRequest } from "@/lib/storage";
import { SERVICES, BUDGET_RANGES } from "@/constants/data";
import { CheckCircle2, Upload } from "lucide-react";
import { sendEmail, EMAILJS_TEMPLATE_ID_QUOTE } from "@/lib/emailjs";

const Quote = () => {
  const [searchParams] = useSearchParams();
  const defaultService = searchParams.get("service") ?? "";

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: defaultService,
    details: "",
    budget: "",
    deadline: "",
    filename: "",
  });

  const set = (key: string, val: string) => setFormData((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await addQuoteRequest({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        details: formData.details,
        budget: formData.budget,
        deadline: formData.deadline,
      });
    } catch (error) {
      console.error("Failed to save quote request:", error);
      toast.error("Something went wrong saving your request. Please try again.");
      setSubmitting(false);
      return;
    }

    try {
      await sendEmail(EMAILJS_TEMPLATE_ID_QUOTE, {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        service: formData.service,
        budget: formData.budget || "Not specified",
        deadline: formData.deadline || "Not specified",
        details: formData.details,
        filename: formData.filename || "No file attached",
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to send quote request email:", error);
      toast.error("Your request was saved, but the notification email failed to send. We'll still review it.");
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-brand-gray px-4 pt-16">
          <div className="max-w-md text-center">
            <div className="w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-display font-bold text-2xl text-brand-black mb-3">Quote Request Received!</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Thank you, {formData.name}! We've received your request and will get back to you within 24 hours with a detailed quote.
            </p>
            <Button
              onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", phone: "", service: "", details: "", budget: "", deadline: "", filename: "" }); }}
              className="bg-brand-orange hover:bg-orange-600 text-white"
            >
              Submit Another Request
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="bg-brand-black pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-orange" />
        <div className="max-w-7xl mx-auto">
          <span className="text-brand-orange font-semibold text-sm uppercase tracking-widest">Get a Quote</span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mt-3 mb-5 max-w-xl leading-tight">
            Request a Free,<br />Custom Quote
          </h1>
          <p className="text-white/65 text-lg max-w-lg leading-relaxed">
            Tell us about your project and we'll provide a detailed, no-obligation quote within 24 hours.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 bg-brand-gray px-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="q-name" className="text-sm font-semibold text-brand-black">Full Name *</Label>
                <Input
                  id="q-name"
                  required
                  value={formData.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Your full name"
                  className="mt-1.5 focus-visible:ring-brand-orange"
                />
              </div>
              <div>
                <Label htmlFor="q-email" className="text-sm font-semibold text-brand-black">Email Address *</Label>
                <Input
                  id="q-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1.5 focus-visible:ring-brand-orange"
                />
              </div>
              <div>
                <Label htmlFor="q-phone" className="text-sm font-semibold text-brand-black">Phone Number *</Label>
                <Input
                  id="q-phone"
                  required
                  value={formData.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+234 800 000 0000"
                  className="mt-1.5 focus-visible:ring-brand-orange"
                />
              </div>
              <div>
                <Label htmlFor="q-service" className="text-sm font-semibold text-brand-black">Service Needed *</Label>
                <select
                  id="q-service"
                  required
                  value={formData.service}
                  onChange={(e) => set("service", e.target.value)}
                  className="mt-1.5 w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-brand-orange"
                >
                  <option value="">Select a service</option>
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="q-budget" className="text-sm font-semibold text-brand-black">Budget Range</Label>
                <select
                  id="q-budget"
                  value={formData.budget}
                  onChange={(e) => set("budget", e.target.value)}
                  className="mt-1.5 w-full border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-brand-orange"
                >
                  <option value="">Select a budget range</option>
                  {BUDGET_RANGES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="q-deadline" className="text-sm font-semibold text-brand-black">Deadline</Label>
                <Input
                  id="q-deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => set("deadline", e.target.value)}
                  className="mt-1.5 focus-visible:ring-brand-orange"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="q-details" className="text-sm font-semibold text-brand-black">Project Details *</Label>
              <Textarea
                id="q-details"
                required
                value={formData.details}
                onChange={(e) => set("details", e.target.value)}
                placeholder="Describe your project in detail — quantities, sizes, materials, colors, any special requirements..."
                rows={5}
                className="mt-1.5 resize-none focus-visible:ring-brand-orange"
              />
            </div>

            <div>
              <Label className="text-sm font-semibold text-brand-black">Attach Design Reference</Label>
              <label className="mt-1.5 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 hover:border-brand-orange rounded-xl py-8 px-4 cursor-pointer transition-colors group">
                <input
                  type="file"
                  accept="image/*,.pdf,.ai,.eps,.psd"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) set("filename", file.name);
                  }}
                />
                <Upload className="w-8 h-8 text-gray-400 group-hover:text-brand-orange transition-colors" />
                <span className="text-sm text-muted-foreground">
                  {formData.filename || "Click to upload or drag & drop"}
                </span>
                <span className="text-xs text-muted-foreground/60">PNG, JPG, PDF, AI, EPS, PSD up to 20MB</span>
              </label>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-orange hover:bg-orange-600 text-white font-semibold h-12 text-base"
            >
              {submitting ? "Sending Request..." : "Submit Quote Request"}
            </Button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Quote;
