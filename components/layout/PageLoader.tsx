export default function PageLoader() {
  return (
    <div className="page-loader" id="page-loader">
      <div className="loader">
        {Array.from({ length: 10 }, (_, index) => (
          <span className="loader-item" key={index}></span>
        ))}
      </div>
    </div>
  );
}
