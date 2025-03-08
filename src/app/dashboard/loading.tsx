export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center">
        <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent animate-spin rounded-full"></div>
        <p className="mt-4 text-gray-700 text-lg">Loading dashboard...</p>
      </div>
    </div>
  );
}
