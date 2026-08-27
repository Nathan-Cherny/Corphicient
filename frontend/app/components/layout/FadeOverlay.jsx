export default function FadeOverlay({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Black Fade Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 margin-0"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Foreground Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none duration-300">
        <div className="pointer-events-auto min-w-1/2">
          {children}
        </div>
      </div>
    </>
  );
}
