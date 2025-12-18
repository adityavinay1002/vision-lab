export interface FilterOptions {
  histogramEqualization: boolean;
  clahe: boolean;
  claheClipLimit: number;
  claheTileSize: number;
  gaussianBlur: boolean;
  gaussianKernelSize: number;
  averageBlur: boolean;
  averageKernelSize: number;
  sharpen: boolean;
  sobelEdge: boolean;
  cannyEdge: boolean;
  cannyThreshold1: number;
  cannyThreshold2: number;
}

export const defaultFilterOptions: FilterOptions = {
  histogramEqualization: false,
  clahe: false,
  claheClipLimit: 2.0,
  claheTileSize: 8,
  gaussianBlur: false,
  gaussianKernelSize: 5,
  averageBlur: false,
  averageKernelSize: 5,
  sharpen: false,
  sobelEdge: false,
  cannyEdge: false,
  cannyThreshold1: 50,
  cannyThreshold2: 150,
};

export function isOpenCVReady(): boolean {
  return typeof window !== 'undefined' && window.cv && window.cv.Mat;
}

export function calculateHistogram(imageData: ImageData): number[][] {
  const histograms: number[][] = [
    new Array(256).fill(0),
    new Array(256).fill(0),
    new Array(256).fill(0),
  ];

  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    histograms[0][data[i]]++;
    histograms[1][data[i + 1]]++;
    histograms[2][data[i + 2]]++;
  }

  return histograms;
}

export function processImage(
  sourceCanvas: HTMLCanvasElement,
  options: FilterOptions
): HTMLCanvasElement | null {
  if (!isOpenCVReady()) {
    console.error('OpenCV is not ready');
    return null;
  }

  const cv = window.cv;
  let src = cv.imread(sourceCanvas);
  let dst = src.clone();

  try {
    if (options.histogramEqualization) {
      dst = applyHistogramEqualization(src, cv);
      src.delete();
      src = dst.clone();
    }

    if (options.clahe) {
      dst = applyCLAHE(src, cv, options.claheClipLimit, options.claheTileSize);
      src.delete();
      src = dst.clone();
    }

    if (options.gaussianBlur) {
      dst = applyGaussianBlur(src, cv, options.gaussianKernelSize);
      src.delete();
      src = dst.clone();
    }

    if (options.averageBlur) {
      dst = applyAverageBlur(src, cv, options.averageKernelSize);
      src.delete();
      src = dst.clone();
    }

    if (options.sharpen) {
      dst = applySharpen(src, cv);
      src.delete();
      src = dst.clone();
    }

    if (options.sobelEdge) {
      dst = applySobelEdge(src, cv);
      src.delete();
      src = dst.clone();
    }

    if (options.cannyEdge) {
      dst = applyCannyEdge(src, cv, options.cannyThreshold1, options.cannyThreshold2);
      src.delete();
      src = dst.clone();
    }

    const outputCanvas = document.createElement('canvas');
    cv.imshow(outputCanvas, dst);

    src.delete();
    dst.delete();

    return outputCanvas;
  } catch (error) {
    console.error('Error processing image:', error);
    src.delete();
    dst.delete();
    return null;
  }
}

function applyHistogramEqualization(src: any, cv: any): any {
  const gray = new cv.Mat();
  const dst = new cv.Mat();

  if (src.channels() === 1) {
    cv.equalizeHist(src, dst);
  } else {
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    cv.equalizeHist(gray, dst);
    cv.cvtColor(dst, dst, cv.COLOR_GRAY2RGBA);
  }

  gray.delete();
  return dst;
}

function applyCLAHE(src: any, cv: any, clipLimit: number, tileSize: number): any {
  const gray = new cv.Mat();
  const dst = new cv.Mat();

  const clahe = new cv.CLAHE(clipLimit, new cv.Size(tileSize, tileSize));

  if (src.channels() === 1) {
    clahe.apply(src, dst);
  } else {
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    clahe.apply(gray, dst);
    cv.cvtColor(dst, dst, cv.COLOR_GRAY2RGBA);
  }

  gray.delete();
  return dst;
}

function applyGaussianBlur(src: any, cv: any, kernelSize: number): any {
  const dst = new cv.Mat();
  const ksize = new cv.Size(kernelSize, kernelSize);
  cv.GaussianBlur(src, dst, ksize, 0, 0, cv.BORDER_DEFAULT);
  return dst;
}

function applyAverageBlur(src: any, cv: any, kernelSize: number): any {
  const dst = new cv.Mat();
  const ksize = new cv.Size(kernelSize, kernelSize);
  cv.blur(src, dst, ksize, new cv.Point(-1, -1), cv.BORDER_DEFAULT);
  return dst;
}

function applySharpen(src: any, cv: any): any {
  const kernel = cv.matFromArray(3, 3, cv.CV_32F, [
    0, -1, 0,
    -1, 5, -1,
    0, -1, 0,
  ]);

  const dst = new cv.Mat();
  cv.filter2D(src, dst, cv.CV_8U, kernel);
  kernel.delete();
  return dst;
}

function applySobelEdge(src: any, cv: any): any {
  let gray = new cv.Mat();
  const gradX = new cv.Mat();
  const gradY = new cv.Mat();
  const absGradX = new cv.Mat();
  const absGradY = new cv.Mat();
  const dst = new cv.Mat();

  if (src.channels() !== 1) {
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  } else {
    gray = src.clone();
  }

  cv.Sobel(gray, gradX, cv.CV_16S, 1, 0, 3, 1, 0, cv.BORDER_DEFAULT);
  cv.Sobel(gray, gradY, cv.CV_16S, 0, 1, 3, 1, 0, cv.BORDER_DEFAULT);

  cv.convertScaleAbs(gradX, absGradX);
  cv.convertScaleAbs(gradY, absGradY);

  cv.addWeighted(absGradX, 0.5, absGradY, 0.5, 0, dst);

  if (src.channels() !== 1) {
    cv.cvtColor(dst, dst, cv.COLOR_GRAY2RGBA);
  }

  gray.delete();
  gradX.delete();
  gradY.delete();
  absGradX.delete();
  absGradY.delete();

  return dst;
}

function applyCannyEdge(src: any, cv: any, threshold1: number, threshold2: number): any {
  let gray = new cv.Mat();
  const dst = new cv.Mat();

  if (src.channels() !== 1) {
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  } else {
    gray = src.clone();
  }

  cv.Canny(gray, dst, threshold1, threshold2, 3, false);

  if (src.channels() !== 1) {
    cv.cvtColor(dst, dst, cv.COLOR_GRAY2RGBA);
  }

  gray.delete();
  return dst;
}
