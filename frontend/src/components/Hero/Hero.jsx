import SearchBar from '../SearchBar/SearchBar.jsx';

const Hero = ({ onSearch }) => (
  <section
    className="relative min-h-[650px] bg-cover bg-center text-white"
    style={{
      backgroundImage: "linear-gradient(90deg, rgba(2,6,23,.92), rgba(15,23,42,.56), rgba(2,6,23,.22)), url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=90')",
    }}
  >
    <div className="container flex min-h-[650px] items-center py-5">
      <div className="max-w-3xl">
        <span className="badge rounded-pill bg-danger px-3 py-2">AI-ready car buying guide</span>
        <h1 className="mt-4 text-5xl font-black leading-tight md:text-6xl">Find your next car with premium clarity.</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-200">Explore new cars, used cars, reviews, compare lists, and buyer-friendly insights from a scalable frontend architecture.</p>
        <div className="mt-5 rounded-lg dark-glass p-3">
          <SearchBar onSearch={onSearch} large />
        </div>
        <div className="mt-5 grid max-w-xl grid-cols-3 gap-3 text-center">
          {['20+ Cars', '7 Brands', 'AI Ready'].map((item) => (
            <div className="rounded-lg bg-white/10 p-3 backdrop-blur" key={item}>{item}</div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
