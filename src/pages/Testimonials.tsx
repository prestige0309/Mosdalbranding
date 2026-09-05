import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CTABanner from "@/components/features/CTABanner";
import StarRating from "@/components/features/StarRating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getApprovedTestimonials, addTestimonial } from "@/lib/storage";
import { Star, MessageSquarePlus, Loader2 } from "lucide-react";
import { sendEmail, EMAILJS_TEMPLATE_ID_TESTIMONIAL } from "@/lib/emailjs";
import type { Testimonial } from "@/types";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getApprovedTestimonials()
      .then(setTestimonials)
      .catch((err) => {
        console.error("Failed to load testimonials:", err);
        toast.error("Couldn't load testimonials right now.");
      })
      .finally(() => setLoading(false));
  }, []);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRating) {
      toast.error("Please select a star rating.");
      return;
    }
    setSubmitting(true);

    try {
      await addTestimonial({
        name: formData.name,
        company: formData.company,
        message: formData.message,
        rating: selectedRating,
      });
    } catch (error) {
      console.error("Failed to save testimonial:", error);
      toast.error("Something went wrong submitting your review. Please try again.");
      setSubmitting(false);
      return;
    }

    try {
      await sendEmail(EMAILJS_TEMPLATE_ID_TESTIMONIAL, {
        from_name: formData.name,
        company: formData.company || "Not specified",
        rating: selectedRating,
        message: formData.message,
      });
      toast.success("Thank you for your feedback! It will appear after review.");
    } catch (error) {
      console.error("Failed to send testimonial email:", error);
      toast.success("Thank you for your feedback! It will appear after review.");
    } finally {
      setSubmitting(false);
      setShowForm(false);
      setFormData({ name: "", company: "", message: "" });
      setSelectedRating(0);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="bg-brand-black pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-orange" />
        <div className="max-w-7xl mx-auto">
          <span className="text-brand-orange font-semibold text-sm uppercase tracking-widest">Testimonials</span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white mt-3 mb-5 max-w-2xl leading-tight">
            Real Results,<br />
            <span className="text-brand-orange">Real Stories</span>
          </h1>
          <p className="text-white/65 text-lg max-w-xl leading-relaxed">
            Don't take our word for it. Hear from the businesses we've helped build stronger, bolder brands.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-brand-orange py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { value: "500+", label: "Happy Clients" },
            { value: "4.9/5", label: "Average Rating" },
            { value: "98%", label: "Would Recommend" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-display font-bold text-2xl sm:text-3xl text-white">{stat.value}</div>
              <div className="text-white/75 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 bg-brand-gray px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-display font-bold text-2xl text-brand-black">Client Reviews</h2>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-brand-orange hover:bg-orange-600 text-white gap-2"
            >
              <MessageSquarePlus className="w-4 h-4" />
              Leave a Review
            </Button>
          </div>

          {/* Submit Form */}
          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-8 border border-brand-orange/20 shadow-lg mb-10"
            >
              <h3 className="font-display font-bold text-xl text-brand-black mb-6">Share Your Experience</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-brand-black">Your Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Smith"
                    className="mt-1.5 border-gray-200 focus-visible:ring-brand-orange"
                  />
                </div>
                <div>
                  <Label htmlFor="company" className="text-sm font-medium text-brand-black">Company / Business</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Your Business Name"
                    className="mt-1.5 border-gray-200 focus-visible:ring-brand-orange"
                  />
                </div>
              </div>
              <div className="mb-5">
                <Label className="text-sm font-medium text-brand-black">Rating *</Label>
                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setSelectedRating(star)}
                      className="p-0.5"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          star <= (hoverRating || selectedRating)
                            ? "fill-brand-orange text-brand-orange"
                            : "fill-none text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <Label htmlFor="message" className="text-sm font-medium text-brand-black">Your Review *</Label>
                <Textarea
                  id="message"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your experience with Mosdal Branding Solution..."
                  rows={4}
                  className="mt-1.5 border-gray-200 focus-visible:ring-brand-orange resize-none"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-brand-orange hover:bg-orange-600 text-white"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {/* Grid */}
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-6 h-6 text-brand-orange animate-spin" />
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <StarRating rating={t.rating} />
                <p className="text-gray-600 text-sm leading-relaxed mt-4 mb-6">
                  "{t.message}"
                </p>
                <div className="pt-4 border-t border-gray-100">
                  <div className="font-semibold text-brand-black text-sm">{t.name}</div>
                  <div className="text-muted-foreground text-xs">{t.company}</div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>

      <CTABanner />
      <Footer />
    </div>
  );
};

export default Testimonials;
