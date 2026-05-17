import { Link } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Dog, Zap, FlaskConical, Activity, Shield } from "lucide-react";
import { Button } from "../components/ui/Button";

const features = [
  {
    icon: Zap,
    title: "LangGraph AI Pipeline",
    desc: "5-node agent pipeline scores TCC subtype, enriches ChEMBL data, calculates doses, and generates a printable recipe — all in real time.",
  },
  {
    icon: FlaskConical,
    title: "ChEMBL Compound Enrichment",
    desc: "Automatically pulls IC₅₀, Cmax, and gap ratio for each ranked drug to assess pharmacological achievability.",
  },
  {
    icon: Activity,
    title: "Monitoring Agent",
    desc: "Trend analysis over CBC, chemistry, and imaging history. VCOG-CTCAE grading with severity-based alerts.",
  },
  {
    icon: Shield,
    title: "BRAF-Aware Dosing",
    desc: "Conditional agent logic skips trametinib for BRAF-negative patients. Renal and hepatic adjustments applied automatically.",
  },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Dog className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg">VetOnco</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/how-it-works">
            <Button variant="ghost" size="sm">How it works</Button>
          </Link>
          <SignedOut>
            <Link to="/sign-in">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/sign-up">
              <Button size="sm">Get started</Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link to="/dashboard">
              <Button size="sm">Dashboard</Button>
            </Link>
          </SignedIn>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-8 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-900/40 border border-blue-700 rounded-full px-4 py-1.5 text-sm text-blue-300 mb-6">
          <Zap className="h-3.5 w-3.5" />
          Powered by LangGraph agents
        </div>
        <h1 className="text-5xl font-bold leading-tight mb-6">
          AI-powered oncology decisions
          <br />
          <span className="text-blue-400">for canine TCC</span>
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          VetOnco runs a full LangGraph pipeline — scoring, ChEMBL enrichment, dosing, and recipe generation — with live agent trace visibility. Built for veterinary oncologists.
        </p>
        <div className="flex items-center justify-center gap-4">
          <SignedOut>
            <Link to="/sign-up">
              <Button size="lg">Start free trial</Button>
            </Link>
            <Link to="/sign-in">
              <Button size="lg" variant="outline">Sign in</Button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link to="/dashboard">
              <Button size="lg">Go to dashboard</Button>
            </Link>
          </SignedIn>
          <Link to="/how-it-works">
            <Button size="lg" variant="ghost">See the science →</Button>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
              <div className="h-10 w-10 rounded-lg bg-blue-900/50 flex items-center justify-center mb-4">
                <Icon className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Footer link */}
        <div className="mt-12 text-center">
          <Link to="/how-it-works" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
            How does VetOnco work? Read the science, training sources, and algorithm transparency report →
          </Link>
        </div>
      </div>
    </div>
  );
}
