export default function Loader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 0',
      color: '#999',
      fontSize: '0.95rem',
    }}>
      {text}
    </div>
  );
}
