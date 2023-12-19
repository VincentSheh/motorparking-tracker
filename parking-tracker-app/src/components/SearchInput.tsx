export default function SearchInput({destinationRef, onGoClick}) {
  return (
    <div className="flex items-center mx-2">
      <div className="flex border border-purple-200 rounded">
        <input
          type="text"
          className="block w-full px-4 py-2 text-black-700 bg-white-200 border focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
          placeholder="Search..."
          ref={destinationRef}
        />
        <button className="px-2 text-white bg-black border-l rounded" onClick={onGoClick}>
          GO
        </button>
      </div>
    </div>
  );
}
