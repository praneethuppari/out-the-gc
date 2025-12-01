export function AuthLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 lg:px-8">
      {/* Animated Background */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-purple-900/20 to-pink-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Subtle Map Pattern */}
      <div
        className="absolute inset-0 bg-map-pattern opacity-5 [mask-image:linear-gradient(0deg,transparent,black)]"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-sm">
        <div className="rounded-2xl border border-white/10 bg-black/80 backdrop-blur-md p-6 sm:p-8 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
