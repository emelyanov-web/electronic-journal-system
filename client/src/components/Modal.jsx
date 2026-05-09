export default function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[1400px] max-h-[90vh] overflow-y-auto rounded-3xl p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-2xl text-gray-400 hover:text-black"
        >
          ×
        </button>

        {children}
      </div>
    </div>
  );
}
