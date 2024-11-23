export default function RootLoading() {
  return (
    <div className="relative isolate min-h-screen">
      {/* Background gradient shimmer */}
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 animate-pulse sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>

      {/* Hero section shimmer */}
      <div className="relative px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center space-y-8">
            {/* Title shimmer */}
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse dark:bg-gray-700 mx-auto max-w-xl" />
            
            {/* Description shimmer */}
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-700 mx-auto max-w-md" />
              <div className="h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-700 mx-auto max-w-sm" />
            </div>

            {/* Buttons shimmer */}
            <div className="flex items-center justify-center gap-x-6 mt-10">
              <div className="h-10 w-32 bg-indigo-600/50 rounded-md animate-pulse" />
              <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse dark:bg-gray-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Features section shimmer */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-2xl lg:text-center space-y-6">
          {/* Section title shimmer */}
          <div className="h-8 bg-gray-200 rounded animate-pulse dark:bg-gray-700 mx-auto max-w-xs" />
          <div className="h-6 bg-gray-200 rounded animate-pulse dark:bg-gray-700 mx-auto max-w-sm" />
        </div>

        {/* Feature cards shimmer */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="flex flex-col gap-4 rounded-lg p-6 bg-gray-50 animate-pulse dark:bg-gray-800"
              >
                {/* Icon shimmer */}
                <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-700" />
                
                {/* Title shimmer */}
                <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 w-3/4" />
                
                {/* Description shimmer */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-full" />
                  <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-5/6" />
                  <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-4/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}