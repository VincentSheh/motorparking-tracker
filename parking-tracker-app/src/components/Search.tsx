export default function SearchInput({destinationRef, onGoClick}) {
    return (
      <div className="flex items-center mx-2">
        <div className="flex border border-purple-200 rounded">
          <input
            type="text"
            className="block w-full px-4 py-2 text-purple-700 bg-white border focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
            placeholder="Search..."
            ref={destinationRef}
          />
          <button className="px-2 text-white bg-purple-600 border-l rounded" onClick={onGoClick}>
            GO
          </button>
        </div>
      </div>
    );
  }