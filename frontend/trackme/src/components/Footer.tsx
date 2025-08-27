export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/60 bg-white/50 backdrop-blur-sm mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-sm text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="font-medium">© {new Date().getFullYear()} TrackMe. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="#features" className="hover:text-slate-800 transition-colors font-medium">Features</a>
          <a href="#insights" className="hover:text-slate-800 transition-colors font-medium">Insights</a>
          <a href="https://nextjs.org" target="_blank" rel="noreferrer" className="hover:text-slate-800 transition-colors font-medium">Built with Next.js</a>
        </div>
      </div>
    </footer>
  );
}


