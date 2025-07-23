function Loading() {
    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
        }}>
            <div className="spinner" />
            <p style={{ marginTop: '1rem', fontSize: '1rem', color: '#666' }}>Loading...</p>

            <style jsx>{`
        .spinner {
          width: 48px;
          height: 48px;
          border: 5px solid #ccc;
          border-top-color: #4F46E5; /* Indigo-600 */
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}

export default Loading;