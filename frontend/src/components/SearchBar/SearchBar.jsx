import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ onSearch, large = false }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const submit = (event) => {
    event.preventDefault();
    if (onSearch) onSearch(query);
    else navigate(`/new-cars?search=${encodeURIComponent(query)}`);
  };

  return (
    <form className="row g-2" onSubmit={submit}>
      <div className="col-12 col-md">
        <input
          className={`form-control ${large ? 'form-control-lg border-0' : ''}`}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search BMW, EV, diesel, Mumbai..."
          aria-label="Search cars"
        />
      </div>
      <div className="col-12 col-md-auto">
        <button className={`btn btn-brand w-100 fw-bold ${large ? 'btn-lg px-4' : ''}`} type="submit">Search Cars</button>
      </div>
    </form>
  );
};

export default SearchBar;
