const ReviewCard = ({ review }) => (
  <article className="premium-card hover-lift h-100 overflow-hidden rounded-lg">
    <img className="h-52 w-full object-cover" src={review.image} alt={review.title} loading="lazy" />
    <div className="p-4">
      <span className="badge bg-danger">{review.category}</span>
      <h3 className="mt-3 text-xl font-black">{review.title}</h3>
      <p className="text-slate-600">{review.excerpt}</p>
    </div>
  </article>
);

export default ReviewCard;
