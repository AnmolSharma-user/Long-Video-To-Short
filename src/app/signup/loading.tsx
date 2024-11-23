export default function SignupLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        
        {/* Shimmer Logo */}
        <div className="relative z-10 mb-8 text-center">
          <div className="inline-flex items-center space-x-2">
            <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-700" />
            <div className="h-8 w-32 animate-pulse rounded bg-gray-700" />
          </div>
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-700" />
        </div>

        {/* Shimmer Form */}
        <div className="relative z-10 w-full max-w-md">
          <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-75 blur" />
          <div className="relative space-y-6 rounded-lg bg-white/5 p-6 backdrop-blur">
            <div className="space-y-4">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-700" />
              <div className="h-10 w-full animate-pulse rounded bg-gray-700" />
            </div>
            <div className="space-y-4">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-700" />
              <div className="h-10 w-full animate-pulse rounded bg-gray-700" />
            </div>
            <div className="space-y-4">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-700" />
              <div className="h-10 w-full animate-pulse rounded bg-gray-700" />
              <div className="h-24 w-full animate-pulse rounded bg-gray-700" />
            </div>
            <div className="space-y-4">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-700" />
              <div className="h-10 w-full animate-pulse rounded bg-gray-700" />
            </div>
            <div className="h-10 w-full animate-pulse rounded bg-purple-700" />
          </div>
        </div>

        {/* Shimmer Features */}
        <div className="relative z-10 mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-12">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4 text-center">
              <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-gray-700" />
              <div className="h-6 w-32 animate-pulse rounded bg-gray-700 mx-auto" />
              <div className="h-4 w-48 animate-pulse rounded bg-gray-700 mx-auto" />
            </div>
          ))}
        </div>

        {/* Shimmer Footer */}
        <div className="relative z-10 mt-12 text-center">
          <div className="h-4 w-64 animate-pulse rounded bg-gray-700 mx-auto" />
        </div>
      </div>
    </div>
  );
}