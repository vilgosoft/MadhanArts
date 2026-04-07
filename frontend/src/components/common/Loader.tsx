import '../../styles/components/_loader.scss';

export default function Loader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="loader">
      <div className="loader__spinner">
        <div className="loader__brush" />
      </div>
      <span className="loader__text">{text}</span>
    </div>
  );
}
