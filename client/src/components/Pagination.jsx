export default function Pagination({ page, totalPages, onPrev, onNext }) {
  return (
    <div className="page-btn">
      <button type="button" onClick={onPrev} disabled={page === 1}>
        Prev
      </button>
      <div>
        Page {page} of {totalPages}
      </div>
      <button type="button" onClick={onNext} disabled={page === totalPages}>
        Next
      </button>
    </div>
  );
}
