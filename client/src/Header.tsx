export default function Header() {
  return (
    <div className="fixed inset-x-0 bg-white border-b">
      <div className="max-w-6xl mx-auto py-2.5 flex justify-between items-center h-14">
        <div>
          <h1 className="text-lg font-semibold">Flog</h1>
          <p className="text-xs text-gray-500">
            A forum style blogging platform
          </p>
        </div>

        <div className="flex gap-2">
          <button className="outline outline-blue-500 hover:bg-blue-500 px-4 py-2 text-sm text-blue-500 hover:text-white transition-colors rounded">
            Login
          </button>
          <button className="bg-green-500 active:bg-green-600 px-4 py-2 text-sm text-white rounded transition-colors">
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
