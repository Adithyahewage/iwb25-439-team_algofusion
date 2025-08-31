import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SectionHeading from "../components/SectionHeading";
import FeatureCard from "../components/FeatureCard";
import { BellIcon, ChartBarIcon, PhoneIcon, UsersIcon, BoltIcon, ShieldCheckIcon } from "../components/icons";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="relative overflow-hidden pt-40 pb-32 rounded-3xl -mx-4 sm:mx-0 px-6 sm:px-8 bg-gradient-to-b from-indigo-50 via-sky-50 to-white mt-8">
          {/* Decorative color blobs */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-pink-400/20 blur-3xl" />
            <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-violet-400/20 blur-3xl" />
            <div className="absolute top-16 right-1/3 h-80 w-80 rounded-full bg-blue-400/15 blur-3xl" />
            <div className="absolute top-1/2 left-1/4 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-yellow-400/10 blur-3xl" />
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-2 h-20 bg-gradient-to-b from-blue-400 to-transparent rounded-full opacity-30"></div>
          <div className="absolute top-32 right-20 w-1 h-16 bg-gradient-to-b from-violet-400 to-transparent rounded-full opacity-30"></div>
          <div className="absolute bottom-40 left-1/4 w-3 h-24 bg-gradient-to-b from-emerald-400 to-transparent rounded-full opacity-20"></div>
          
          <div className="grid grid-cols-1 gap-16 items-center">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200/60 mb-16 backdrop-blur-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Trusted by 1000+ Courier Services
              </div>
              
              <div className="mb-8">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
                  Transform your <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">courier business</span>
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full mx-auto mb-8"></div>
              </div>
              
              <p className="text-xl text-slate-600 mb-16 leading-relaxed max-w-3xl mx-auto font-medium">
                Streamline parcel management, enhance customer experience, and grow your business with our comprehensive tracking platform.
              </p>
              
              {/* Button section with enhanced visual appeal */}
              <div className="relative mb-24">
                {/* Decorative background for buttons */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-white/50 to-green-50/50 rounded-3xl blur-xl -z-10"></div>
                <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link href="/register" className="inline-flex items-center rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                      Register your service
                    </Link>
                    <Link href="/track" className="inline-flex items-center rounded-full border-2 border-green-200 bg-green-50 px-8 py-4 text-base font-semibold text-green-700 hover:bg-green-100 hover:border-green-300 transition-all duration-200">
                      Track Package
                    </Link>
                    <a href="#features" className="inline-flex items-center rounded-full border-2 border-blue-200 bg-white px-8 py-4 text-base font-semibold text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200">
                      Watch demo
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Enhanced feature highlights */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/30 via-sky-50/30 to-emerald-50/30 rounded-2xl blur-lg -z-10"></div>
                <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-3 rounded-xl bg-white/80 px-6 py-4 ring-1 ring-slate-200/60 backdrop-blur-sm hover:shadow-md transition-all duration-200">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">✓</span>
                      <span className="font-medium">Free setup</span>
                    </div>
                    <div className="inline-flex items-center gap-3 rounded-xl bg-white/80 px-6 py-4 ring-1 ring-slate-200/60 backdrop-blur-sm hover:shadow-md transition-all duration-200">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-50 text-sky-600 text-xs font-bold">24/7</span>
                      <span className="leading-tight font-medium">Support</span>
                    </div>
                    <div className="inline-flex items-center gap-3 rounded-xl bg-white/80 px-6 py-4 ring-1 ring-slate-200/60 backdrop-blur-sm hover:shadow-md transition-all duration-200">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">99.9%</span>
                      <span className="font-medium">Uptime</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-56 mt-24">
          <SectionHeading
            eyebrow="Features"
            title="Everything you need to run a courier service"
            subtitle="Clear benefits your courier team will feel every day."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-24">
            <FeatureCard
              icon={<BellIcon className="h-8 w-8" />}
              title="Real-time Tracking"
              description="Live parcel location and delivery status updates for your customers with precise GPS coordinates and estimated delivery times."
            />
            <FeatureCard
              icon={<PhoneIcon className="h-8 w-8" />}
              title="WhatsApp Integration"
              description="Send tracking updates and delivery notifications automatically via WhatsApp to keep customers informed in real-time."
            />
            <FeatureCard
              icon={<ChartBarIcon className="h-8 w-8" />}
              title="Analytics Dashboard"
              description="Monitor delivery performance and customer satisfaction with comprehensive metrics and actionable insights."
            />
            <FeatureCard
              icon={<UsersIcon className="h-8 w-8" />}
              title="Customer Management"
              description="Manage customer details and communication in one centralized platform with advanced search and filtering."
            />
            <FeatureCard
              icon={<BoltIcon className="h-8 w-8" />}
              title="Fast & Reliable"
              description="Built on modern technology for lightning-fast response times and dependable service that scales with your business."
            />
            <FeatureCard
              icon={<ShieldCheckIcon className="h-8 w-8" />}
              title="Secure & Private"
              description="Enterprise-grade security keeps your data and customer information protected with end-to-end encryption."
            />
            <FeatureCard className="lg:col-start-2 lg:col-span-1"
              icon={<UsersIcon className="h-8 w-8" />}
              title="Multi‑tenant"
              description="Each courier service has its own isolated workspace with complete data separation and custom branding."
            />
          </div>
        </section>

        {/* How It Works */}
        <section className="py-56 mt-24">
          <SectionHeading
            eyebrow="Process"
            title="How it works"
            subtitle="Get started in minutes with four simple steps."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-24">
            <div className="rounded-2xl border border-slate-200/60 p-8 bg-white/80 backdrop-blur-sm text-center hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1">
              <div className="mx-auto mb-6 h-14 w-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 ring-1 ring-blue-100 text-blue-600 font-bold text-lg">1</div>
              <h4 className="font-semibold mb-3 text-lg text-slate-900">Register your service</h4>
              <p className="text-slate-600 leading-relaxed">Create your company profile and brand details in just a few minutes.</p>
            </div>
            <div className="rounded-2xl border border-slate-200/60 p-8 bg-white/80 backdrop-blur-sm text-center hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1">
              <div className="mx-auto mb-6 h-14 w-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 ring-1 ring-blue-100 text-blue-600 font-bold text-lg">2</div>
              <h4 className="font-semibold mb-3 text-lg text-slate-900">Add your parcels</h4>
              <p className="text-slate-600 leading-relaxed">Enter parcels manually or import from a spreadsheet with bulk upload.</p>
            </div>
            <div className="rounded-2xl border border-slate-200/60 p-8 bg-white/80 backdrop-blur-sm text-center hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1">
              <div className="mx-auto mb-6 h-14 w-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 ring-1 ring-blue-100 text-blue-600 font-bold text-lg">3</div>
              <h4 className="font-semibold mb-3 text-lg text-slate-900">Track & update</h4>
              <p className="text-slate-600 leading-relaxed">Update status in real‑time; customers are automatically notified of changes.</p>
            </div>
            <div className="rounded-2xl border border-slate-200/60 p-8 bg-white/80 backdrop-blur-sm text-center hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1">
              <div className="mx-auto mb-6 h-14 w-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 ring-1 ring-blue-100 text-blue-600 font-bold text-lg">4</div>
              <h4 className="font-semibold mb-3 text-lg text-slate-900">Grow your business</h4>
              <p className="text-slate-600 leading-relaxed">See insights and improve delivery performance with data-driven decisions.</p>
            </div>
          </div>
        </section>

        {/* Insights */}
        <section id="insights" className="py-56 mt-24">
          <SectionHeading
            eyebrow="Insights"
            title="Operational metrics at a glance"
            subtitle="Targets for performance, reliability, and user scale."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-24">
            <div className="rounded-2xl border border-slate-200/60 p-8 text-center bg-white/80 backdrop-blur-sm hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1">
              <div className="text-5xl font-bold mb-3 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">99.9%</div>
              <div className="text-slate-700 font-medium text-lg">System uptime</div>
            </div>
            <div className="rounded-2xl border border-slate-200/60 p-8 text-center bg-white/80 backdrop-blur-sm hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1">
              <div className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">500+</div>
              <div className="text-slate-700 font-medium text-lg">Concurrent users</div>
            </div>
            <div className="rounded-2xl border border-slate-200/60 p-8 text-center bg-white/80 backdrop-blur-sm hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1">
              <div className="text-5xl font-bold mb-3 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">{`< 200ms`}</div>
              <div className="text-slate-700 font-medium text-lg">API response</div>
            </div>
          </div>
        </section>

        {/* Customer Tracking Section */}
        <section className="py-56 mt-24">
          <div className="rounded-3xl border border-green-200/60 p-20 pb-32 text-center bg-gradient-to-br from-green-50 to-emerald-50 backdrop-blur-sm">
            <h3 className="text-3xl font-bold mb-8 text-slate-900">Track Your Package</h3>
            <p className="text-xl text-slate-600 mb-12 leading-relaxed max-w-2xl mx-auto">No registration required. Simply enter your tracking number to get real-time updates on your delivery status.</p>
            <Link href="/track" className="inline-flex items-center rounded-full bg-green-600 px-8 py-4 text-base font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Track Package Now
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="py-56 mt-24">
          <div className="rounded-3xl border border-blue-200/60 p-20 pb-32 text-center bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur-sm">
            <h3 className="text-3xl font-bold mb-8 text-slate-900">Ready to modernize your courier service?</h3>
            <p className="text-xl text-slate-600 mb-12 leading-relaxed max-w-2xl mx-auto">Create your admin account and start tracking parcels in minutes.</p>
            <Link href="/register" className="inline-flex items-center rounded-full bg-blue-600 px-8 py-4 text-base font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Get started — it's free
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}


