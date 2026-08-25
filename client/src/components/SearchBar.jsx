export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      className="search-bar"
      placeholder="Search cards by name..."
      value={value}
      onChange={onChange}
    />
  );
}
