export default function TrackingLoading() {
  return <div className="tracking-shell"><div className="tracking-loading-title" /><div className="tracking-loading-grid">{Array.from({ length: 4 }, (_, index) => <div key={index} className="tracking-loading-card" />)}</div><div className="tracking-loading-chart" /></div>;
}
