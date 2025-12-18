import { FilterOptions } from '../utils/imageProcessing';

interface FilterControlsProps {
  options: FilterOptions;
  onChange: (options: FilterOptions) => void;
  disabled: boolean;
}

export function FilterControls({ options, onChange, disabled }: FilterControlsProps) {
  const updateOption = <K extends keyof FilterOptions>(
    key: K,
    value: FilterOptions[K]
  ) => {
    onChange({ ...options, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Enhancement Filters
        </h3>

        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={options.histogramEqualization}
              onChange={(e) => updateOption('histogramEqualization', e.target.checked)}
              disabled={disabled}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Histogram Equalization
            </span>
          </label>

          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={options.clahe}
                onChange={(e) => updateOption('clahe', e.target.checked)}
                disabled={disabled}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                CLAHE (Contrast Limited Adaptive Histogram Equalization)
              </span>
            </label>

            {options.clahe && (
              <div className="ml-7 space-y-3 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Clip Limit: {options.claheClipLimit.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={options.claheClipLimit}
                    onChange={(e) => updateOption('claheClipLimit', parseFloat(e.target.value))}
                    disabled={disabled}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Tile Grid Size: {options.claheTileSize}x{options.claheTileSize}
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="16"
                    step="2"
                    value={options.claheTileSize}
                    onChange={(e) => updateOption('claheTileSize', parseInt(e.target.value))}
                    disabled={disabled}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Blur Filters
        </h3>

        <div className="space-y-3">
          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={options.gaussianBlur}
                onChange={(e) => updateOption('gaussianBlur', e.target.checked)}
                disabled={disabled}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Gaussian Blur
              </span>
            </label>

            {options.gaussianBlur && (
              <div className="ml-7 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Kernel Size: {options.gaussianKernelSize}
                </label>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="2"
                  value={options.gaussianKernelSize}
                  onChange={(e) => updateOption('gaussianKernelSize', parseInt(e.target.value))}
                  disabled={disabled}
                  className="w-full"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={options.averageBlur}
                onChange={(e) => updateOption('averageBlur', e.target.checked)}
                disabled={disabled}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Average Blur
              </span>
            </label>

            {options.averageBlur && (
              <div className="ml-7 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Kernel Size: {options.averageKernelSize}
                </label>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="2"
                  value={options.averageKernelSize}
                  onChange={(e) => updateOption('averageKernelSize', parseInt(e.target.value))}
                  disabled={disabled}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Edge Detection
        </h3>

        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={options.sharpen}
              onChange={(e) => updateOption('sharpen', e.target.checked)}
              disabled={disabled}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Sharpen
            </span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={options.sobelEdge}
              onChange={(e) => updateOption('sobelEdge', e.target.checked)}
              disabled={disabled}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Sobel Edge Detection
            </span>
          </label>

          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={options.cannyEdge}
                onChange={(e) => updateOption('cannyEdge', e.target.checked)}
                disabled={disabled}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Canny Edge Detection
              </span>
            </label>

            {options.cannyEdge && (
              <div className="ml-7 space-y-3 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Lower Threshold: {options.cannyThreshold1}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="10"
                    value={options.cannyThreshold1}
                    onChange={(e) => updateOption('cannyThreshold1', parseInt(e.target.value))}
                    disabled={disabled}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Upper Threshold: {options.cannyThreshold2}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="300"
                    step="10"
                    value={options.cannyThreshold2}
                    onChange={(e) => updateOption('cannyThreshold2', parseInt(e.target.value))}
                    disabled={disabled}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
