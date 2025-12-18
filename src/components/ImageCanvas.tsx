import { useEffect, useRef } from 'react';

interface ImageCanvasProps {
  image: HTMLImageElement | HTMLCanvasElement | null;
  title: string;
}

export function ImageCanvas({ image, title }: ImageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (image instanceof HTMLImageElement) {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
    } else {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
    }
  }, [image]);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
      <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800">
        {image ? (
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto block"
          />
        ) : (
          <div className="w-full h-64 flex items-center justify-center text-gray-400 dark:text-gray-500">
            No image loaded
          </div>
        )}
      </div>
    </div>
  );
}
