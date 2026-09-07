import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { addOrder } from "@/lib/storage";
import { SERVICES } from "@/constants/data";
import { CheckCircle2, Upload, ChevronRight, ChevronLeft } from "lucide-react";

interface FormState {
  service: string;
  quantity: number;
  size: string;
  material: string;
  colorSpec: string;
  artwork: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

const Order = () => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>({
    service: "", quantity: 1, size: "", material: "",
    colorSpec: "", artwork: "", name: "", email: "", phone: "", address: "", notes: ""
  });

  const set = (key: keyof FormState, val: string | number) =>
    setForm((p) => ({ ...p, [key]: val }));

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    try {
      await addOrder({
        name: form.name,
        email: form.email,
        phone: form.phone,
        service: form.service,
        quantity: form.quantity,
        specifications: `Size: ${form.size || "N/A"}, Material: ${form.material || "N/A"}, Colors: ${form.colorSpec || "N/A"}`,
        deliveryAddress: form.address,
      });
      setSubmitted(true);
        } catch (error) {
      console.error("Failed to save order:", error);
      const msg = error instanceof Error ? error.message : String(error);
      toast.error(`DEBUG: ${msg}`, { duration: 15000 });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedService = SERVICES.find((s) => s.name === form.service);

  if (submitted) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-brand-gray px-4 pt-16">
          <div className="max-w-md text-center">
            <div className="w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-display font-bold text-2xl text-brand-black mb-3">Order Placed Successfully!</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Thank you, {form.name}! Your order has been received. Our team will review it and contact you within 24 hours to confirm pricing and timeline.
            </p>
            <Button
              onClick={() => { setSubmitted(false); setStep(1); setForm({ service: "", quantity: 1, size: "", material: "", colorSpec: "", artwork: "", name: "", email: "", phone: "", address: "", notes: "" }); }}
              className="bg-brand-orange hover:bg-orange-600 text-white"
            >
              Place Another Order
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const steps = ["Service & Specs", "Artwork & Files", "Your Details", "Review & Submit"];

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="bg-brand-black pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-orange" />
        <div className="max-w-7xl mx-auto">
          <span className="text-brand-orange font-semibold text-sm uppercase tracking-widest">Place an Order</span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mt-3 mb-5 max-w-xl leading-tight">
            Get Started on<br />Your Project Today
          </h1>
          <p className="text-white/65 text-lg max-w-lg">
            Complete the steps below to place your order. Our team will confirm the details and pricing within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-16 bg-brand-gray px-4">
        <div className="max-w-3xl mx-auto">
          {/* Step Indicator */}
          <div className="flex items-center mb-10">
            {steps.map((label, i) => (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className={`flex items-center gap-2 shrink-0 ${i + 1 <= step ? "text-brand-orange" : "text-gray-400"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                    i + 1 < step ? "bg-brand-orange border-brand-orange text-white" :
                    i + 1 === step ? "border-brand-orange text-brand-orange bg-white" :
                    "border-gray-300 text-gray-400 bg-white"
                  }`}>
                    {i + 1 < step ? "✓" : i + 1}
                  </div>
                  <span className="hidden sm:block text-xs font-medium">{label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${i + 1 < step ? "bg-brand-orange" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            {/* Step 1: Service & Specs */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="font-display font-bold text-xl text-brand-black">Service & Specifications</h2>
                <div>
                  <Label className="text-sm font-semibold text-brand-black">Select Service *</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                    {SERVICES.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => set("service", s.name)}
                        className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                          form.service === s.name
                            ? "border-brand-orange bg-brand-orange/5 text-brand-orange"
                            : "border-gray-200 hover:border-gray-300 text-gray-700"
                        }`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Label className="text-sm font-semibold text-brand-black">Quantity *</Label>
                    <Input
                      type="number"
                      min={1}
                      value={form.quantity}
                      onChange={(e) => set("quantity", parseInt(e.target.value) || 1)}
                      className="mt-1.5 focus-visible:ring-brand-orange"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-brand-black">Size / Dimensions</Label>
                    <Input
                      value={form.size}
                      onChange={(e) => set("size", e.target.value)}
                      placeholder="e.g. 3.5 x 2 inches, A4, etc."
                      className="mt-1.5 focus-visible:ring-brand-orange"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-brand-black">Material / Finish</Label>
                    <Input
                      value={form.material}
                      onChange={(e) => set("material", e.target.value)}
                      placeholder="e.g. Matte laminate, Gloss, Cotton"
                      className="mt-1.5 focus-visible:ring-brand-orange"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-brand-black">Colors</Label>
                    <Input
                      value={form.colorSpec}
                      onChange={(e) => set("colorSpec", e.target.value)}
                      placeholder="e.g. Full color, 2-color, CMYK"
                      className="mt-1.5 focus-visible:ring-brand-orange"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Artwork */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="font-display font-bold text-xl text-brand-black">Upload Artwork & Files</h2>
                <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 hover:border-brand-orange rounded-xl py-12 px-4 cursor-pointer transition-colors group">
                  <input
                    type="file"
                    accept="image/*,.pdf,.ai,.eps,.psd,.zip"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) set("artwork", file.name);
                    }}
                  />
                  <Upload className="w-10 h-10 text-gray-400 group-hover:text-brand-orange transition-colors" />
                  <div className="text-center">
                    <div className="font-medium text-sm text-gray-700 group-hover:text-brand-orange transition-colors">
                      {form.artwork || "Click to upload design file"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      PDF, AI, EPS, PSD, PNG, JPG, ZIP accepted (max 50MB)
                    </div>
                  </div>
                </label>
                <div>
                  <Label className="text-sm font-semibold text-brand-black">Additional Notes for Designer</Label>
                  <Textarea
                    value={form.notes}
                    onChange={(e) => set("notes", e.target.value)}
                    placeholder="Any specific instructions, brand colors, fonts, or references..."
                    rows={4}
                    className="mt-1.5 resize-none focus-visible:ring-brand-orange"
                  />
                </div>
                <p className="text-xs text-muted-foreground bg-brand-orange/5 border border-brand-orange/20 rounded-lg p-3">
                  Don't have a design? No problem — our in-house designers can create one for you. Just include your brief in the notes above.
                </p>
              </div>
            )}

            {/* Step 3: Contact & Delivery */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="font-display font-bold text-xl text-brand-black">Contact & Delivery Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Label className="text-sm font-semibold text-brand-black">Full Name *</Label>
                    <Input
                      required
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="Your full name"
                      className="mt-1.5 focus-visible:ring-brand-orange"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-brand-black">Email Address *</Label>
                    <Input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="you@example.com"
                      className="mt-1.5 focus-visible:ring-brand-orange"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-brand-black">Phone Number *</Label>
                    <Input
                      required
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      placeholder="+234 800 000 0000"
                      className="mt-1.5 focus-visible:ring-brand-orange"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-brand-black">Delivery Address</Label>
                  <Textarea
                    value={form.address}
                    onChange={(e) => set("address", e.target.value)}
                    placeholder="Full delivery address including LGA and state..."
                    rows={3}
                    className="mt-1.5 resize-none focus-visible:ring-brand-orange"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-5">
                <h2 className="font-display font-bold text-xl text-brand-black">Order Summary</h2>
                <div className="bg-brand-gray rounded-xl p-5 space-y-3 text-sm">
                  {[
                    { label: "Service", value: form.service || "Not selected" },
                    { label: "Quantity", value: form.quantity.toString() },
                    { label: "Size / Dimensions", value: form.size || "Not specified" },
                    { label: "Material / Finish", value: form.material || "Not specified" },
                    { label: "Colors", value: form.colorSpec || "Not specified" },
                    { label: "Artwork File", value: form.artwork || "No file uploaded" },
                    { label: "Contact", value: `${form.name} · ${form.email} · ${form.phone}` },
                    { label: "Delivery Address", value: form.address || "Not specified" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-3">
                      <span className="text-muted-foreground w-40 shrink-0">{label}</span>
                      <span className="font-medium text-brand-black">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-brand-orange/5 border border-brand-orange/20 rounded-xl p-4 text-sm text-muted-foreground">
                  <strong className="text-brand-black">Pricing:</strong> Your order total will be calculated and shared within 24 hours based on your specifications. You won't be charged until you approve the quote.
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep((s) => s - 1)}
                disabled={step === 1}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>
              {step < 4 ? (
                <Button
                  type="button"
                  onClick={() => {
                    if (step === 1 && !form.service) {
                      toast.error("Please select a service.");
                      return;
                    }
                    if (step === 3 && (!form.name || !form.email || !form.phone)) {
                      toast.error("Please fill in all required contact fields.");
                      return;
                    }
                    setStep((s) => s + 1);
                  }}
                  className="bg-brand-orange hover:bg-orange-600 text-white gap-2"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleFinalSubmit}
                  disabled={submitting}
                  className="bg-brand-orange hover:bg-orange-600 text-white"
                >
                  {submitting ? "Placing Order..." : "Place Order"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Order;
