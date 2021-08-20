export function Pagination({ before, after }) {
  return (
    <nav className="mt-8 p-4 border-t border-gray-200">
      <div className="flex justify-center">
        <a
          onClick={before}
          href="#"
          className="relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md text-gray-700 bg-gray-50 hover:border-blue-300"
        >
          Previous
        </a>
        <a
          onClick={after}
          href="#"
          className="ml-3 relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md text-gray-700 bg-gray-50 hover:border-blue-300"
        >
          Next
        </a>
      </div>
    </nav>
  )
}
