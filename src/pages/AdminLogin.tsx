import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Printer, Lock } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { ok, error } = await adminLogin(password);
    if (ok) {
      navigate("/admin");
    } else {
      toast.error(error ?? "Invalid password. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-orange rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Printer className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white">Mosdal Branding Solution Admin</h1>
          <p className="text-white/50 text-sm mt-1">Enter your password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div>
            <Label htmlFor="admin-pwd" className="text-white/70 text-sm font-medium">
              Admin Password
            </Label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                id="admin-pwd"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="pl-9 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-brand-orange"
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-orange hover:bg-orange-600 text-white font-semibold h-11"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-white/30 text-xs mt-6">
          This area is restricted to authorized staff only.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
