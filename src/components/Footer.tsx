export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗑️</span>
            <span className="font-black text-zinc-500">CITYTRASH.EU</span>
          </div>
          <p className="text-zinc-600 text-sm text-center">
            A tongue-in-cheek project. We love all European cities — even the trashy ones. ❤️
          </p>
          <p className="text-zinc-700 text-xs">© 2026</p>
        </div>
      </div>
    </footer>
  );
}
