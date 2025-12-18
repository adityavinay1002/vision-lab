import { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Microscope } from 'lucide-react';
import { ImageUpload } from './components/ImageUpload';
import { ImageCanvas } from './components/ImageCanvas';
import { FilterControls } from './components/FilterControls';
import { HistogramDisplay } from './components/HistogramDisplay';
import { ThemeToggle } from './components/ThemeToggle';
import {
  FilterOptions,
  defaultFilterOptions,
  processImage,
  calculateHistogram,
  isOpenCVReady,
} from './utils/imageProcessing';

function App() {
  const [isDark, setIsDark] = useState(false);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [processedImage, setProcessedImage] = useState<HTMLCanvasElement | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(defaultFilterOptions);
  const [originalHistogram, setOriginalHistogram] = useState<number[][] | null>(null);
  const [processedHistogram, setProcessedHistogram] = useState<number[][] | null>(null);
  const [isOpenCVLoaded, setIsOpenCVLoaded] = useState(false);
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const checkOpenCV = setInterval(() => {
      if (isOpenCVReady()) {
        setIsOpenCVLoaded(true);
        clearInterval(checkOpenCV);
      }
    }, 100);

    return () => clearInterval(checkOpenCV);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleImageUpload = useCallback((image: HTMLImageElement) => {
    setOriginalImage(image);
    setProcessedImage(null);
    setFilterOptions(defaultFilterOptions);

    if (originalCanvasRef.current) {
      const ctx = originalCanvasRef.current.getContext('2d');
      if (ctx) {
        originalCanvasRef.current.width = image.width;
        originalCanvasRef.current.height = image.height;
        ctx.drawImage(image, 0, 0);

        const imageData = ctx.getImageData(0, 0, image.width, image.height);
        setOriginalHistogram(calculateHistogram(imageData));
      }
    }
  }, []);

  const applyFilters = useCallback(() => {
    if (!originalCanvasRef.current || !originalImage || !isOpenCVLoaded) return;

    const processed = processImage(originalCanvasRef.current, filterOptions);
    if (processed) {
      setProcessedImage(processed);

      const ctx = processed.getContext('2d');
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, processed.width, processed.height);
        setProcessedHistogram(calculateHistogram(imageData));
      }
    }
  }, [originalImage, filterOptions, isOpenCVLoaded]);

  useEffect(() => {
    if (originalImage && isOpenCVLoaded) {
      applyFilters();
    }
  }, [filterOptions, originalImage, isOpenCVLoaded, applyFilters]);

  const handleReset = () => {
    setFilterOptions(defaultFilterOptions);
    setProcessedImage(null);
    setProcessedHistogram(null);
  };

  const hasActiveFilters = Object.entries(filterOptions).some(
    ([key, value]) => {
      if (key === 'claheClipLimit' || key === 'claheTileSize' ||
          key === 'gaussianKernelSize' || key === 'averageKernelSize' ||
          key === 'cannyThreshold1' || key === 'cannyThreshold2') {
        return false;
      }
      return value === true;
    }
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <canvas ref={originalCanvasRef} className="hidden" />

      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Microscope size={32} className="text-blue-600 dark:text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  VisionLab
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Image Processing Studio
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ImageUpload onImageUpload={handleImageUpload} disabled={!isOpenCVLoaded} />
              {originalImage && hasActiveFilters && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  <RotateCcw size={20} />
                  <span>Reset</span>
                </button>
              )}
              <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
            </div>
          </div>
        </div>
      </header>

      {!isOpenCVLoaded && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              Loading OpenCV.js... Please wait.
            </p>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Filters
              </h2>
              <FilterControls
                options={filterOptions}
                onChange={setFilterOptions}
                disabled={!originalImage || !isOpenCVLoaded}
              />
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <ImageCanvas image={originalImage} title="Original Image" />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <ImageCanvas image={processedImage} title="Processed Image" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <HistogramDisplay
                  histograms={originalHistogram}
                  title="Original Histogram"
                  isDark={isDark}
                />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <HistogramDisplay
                  histograms={processedHistogram}
                  title="Processed Histogram"
                  isDark={isDark}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
