export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gold/30 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-gold rounded-full animate-spin border-t-transparent border-b-transparent" />
      </div>
    </div>
  );
}