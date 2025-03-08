import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12">
        {/* Hero Section */}
        <section className="text-center max-w-3xl">
          <h1 className="text-4xl font-bold text-gray-900">
            Track Your Bets Like a Pro 🎯
          </h1>
          <p className="text-lg text-gray-600 mt-4">
            Stay on top of your betting history, analyze trends, and make
            smarter decisions with <strong>Track It</strong>.
          </p>
          <Button className="mt-6 px-6 py-3 text-lg">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </section>

        {/* Features Section */}
        <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon="📊"
            title=" Analyze Trends"
            description="Track wins, losses, and performance over time."
          />
          <FeatureCard
            icon="🔒"
            title=" Secure & Private"
            description="Your data is safe and only accessible to you."
          />
          <FeatureCard
            icon="📅"
            title="Easy History Logs"
            description="Save and categorize all your betting activities in one place."
          />
        </section>

        {/* Testimonials Section */}
        <section className="mt-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            What Users Say
          </h2>
          <p className="text-gray-600 mt-2 italic">
            "Track It has helped me keep my betting organized and profitable!" -
            John D.
          </p>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Feature Card Component
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => (
  <div className="p-6 bg-white shadow-md rounded-lg text-center md:text-left flex flex-col gap-4">
    {icon}
    <div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
    </div>
  </div>
);

// Footer Component
const Footer: React.FC = () => (
  <footer className="bg-gray-800 text-gray-300 text-center py-6 mt-12">
    <div className="flex flex-col md:flex-row items-center justify-between max-w-4xl mx-auto px-6">
      <p>© {new Date().getFullYear()} Track It. All rights reserved.</p>
      <nav className="flex space-x-4 mt-2 md:mt-0">
        <Link href="/about" className="hover:text-white">
          About
        </Link>
        <Link href="/contact" className="hover:text-white">
          Contact
        </Link>
        <Link href="/privacy" className="hover:text-white">
          Privacy Policy
        </Link>
      </nav>
    </div>
  </footer>
);
