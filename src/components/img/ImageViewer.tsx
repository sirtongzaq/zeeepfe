import { useEffect, useState } from "react";

interface ImageViewerProps {
  src: string;
  alt?: string;
  children: React.ReactNode;
}

export default function ImageViewer({ src, alt, children }: ImageViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const close = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {children}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={close}
        >
          <div
            className="relative flex flex-col items-center gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <img
              src={src}
              alt={alt}
              className="max-h-[80vh] max-w-[90vw] object-contain transition-transform duration-200 rounded-2xl shadow-xl animate-[qrFadeIn_0.25s_ease]"
            />

            {/* Controls */}
            <div className="flex gap-3 z-10">
              <button onClick={close} className="btn btn-ghost btn-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
