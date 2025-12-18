# VisionLab - Image Processing Studio

VisionLab is a browser-based image processing studio that implements classical computer vision algorithms using OpenCV.js. It provides an intuitive interface for exploring various image enhancement, filtering, and edge detection techniques in real-time.

## Overview

VisionLab is designed as an educational and practical tool for understanding and applying computer vision concepts. The application allows users to upload images and apply various filters while visualizing the effects through side-by-side comparisons and histogram analysis.

## Computer Vision Concepts

### Histogram Equalization

Histogram equalization is a method in image processing that adjusts the contrast of an image by redistributing the intensity values. This technique spreads out the most frequent intensity values, improving the overall contrast of the image. It's particularly useful for images with backgrounds and foregrounds that are both bright or both dark.

**When to use:**
- Low contrast images
- Images where important details are lost due to poor lighting
- Medical imaging, satellite imagery, and underwater photography

### CLAHE (Contrast Limited Adaptive Histogram Equalization)

CLAHE is an advanced variant of histogram equalization that operates on small regions (tiles) in the image rather than the entire image. This adaptive approach prevents the over-amplification of noise that can occur with standard histogram equalization.

**Why CLAHE is Important:**
- **Local Contrast Enhancement**: Unlike global histogram equalization, CLAHE enhances local contrast, making it more effective for images with varying lighting conditions
- **Noise Control**: The clip limit parameter prevents over-amplification of noise in homogeneous regions
- **Adaptive Processing**: By dividing the image into tiles, CLAHE adapts to local statistics, providing better results for complex images

**Parameters:**
- **Clip Limit**: Controls the contrast amplification limit. Higher values allow more contrast enhancement but may amplify noise
- **Tile Grid Size**: Determines the size of the local regions. Smaller tiles provide more localized enhancement but may create block artifacts

**Use Cases:**
- Medical imaging (X-rays, MRI, CT scans)
- Surveillance footage enhancement
- Images with non-uniform lighting
- Underwater and low-light photography

### Gaussian Blur

Gaussian blur applies a smoothing filter based on the Gaussian function. It reduces image noise and detail by averaging pixels with their neighbors, weighted by distance according to a Gaussian distribution.

**Applications:**
- Noise reduction before edge detection
- Creating depth-of-field effects
- Pre-processing for other computer vision algorithms

### Average Blur

Average blur (box filter) replaces each pixel with the average of pixels in a surrounding kernel. It's a simpler smoothing technique compared to Gaussian blur.

**Applications:**
- Quick noise reduction
- Image downsampling preparation
- General purpose smoothing

### Image Sharpening

Sharpening enhances edges and fine details in an image using a convolution kernel. The implemented kernel emphasizes differences between a pixel and its neighbors, making edges more pronounced.

**Convolution Kernel Used:**
```
 0  -1   0
-1   5  -1
 0  -1   0
```

This kernel subtracts weighted neighboring pixels from the central pixel (weighted by 5), enhancing local variations.

### Sobel Edge Detection

The Sobel operator performs edge detection by calculating the gradient magnitude of the image intensity function. It uses two 3×3 kernels to compute horizontal and vertical derivatives separately, then combines them to find edge strength and direction.

**How it works:**
1. Convert image to grayscale
2. Apply horizontal and vertical Sobel kernels
3. Compute gradient magnitude: √(Gx² + Gy²)
4. The result highlights edges where intensity changes rapidly

**Use Cases:**
- Object boundary detection
- Feature extraction for machine learning
- Image segmentation preprocessing

### Canny Edge Detection

Canny is a multi-stage edge detection algorithm that produces clean, thin edges with good localization. It's considered one of the most effective edge detection methods.

**Algorithm Steps:**
1. **Noise Reduction**: Apply Gaussian blur
2. **Gradient Calculation**: Find intensity gradients using Sobel
3. **Non-maximum Suppression**: Thin edges to single-pixel width
4. **Double Threshold**: Classify edges as strong, weak, or non-edges
5. **Edge Tracking**: Connect weak edges to strong edges

**Parameters:**
- **Lower Threshold**: Minimum gradient strength to be considered a weak edge
- **Upper Threshold**: Minimum gradient strength to be considered a strong edge
- Recommended ratio: upper/lower ≈ 2:1 or 3:1

**Advantages:**
- Produces thin, well-defined edges
- Less sensitive to noise than simple gradient methods
- Good edge localization

## Technology Stack

- **React 18**: Modern UI library with hooks for state management
- **TypeScript**: Type-safe development environment
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **OpenCV.js**: JavaScript binding of OpenCV for browser-based computer vision
- **Chart.js**: Flexible charting library for histogram visualization
- **Lucide React**: Beautiful, consistent icons

## Features

### Image Processing
- Real-time filter application
- Multiple filters can be combined
- Adjustable parameters with sliders for fine-tuning
- Reset functionality to restore original settings

### Visualization
- Side-by-side comparison of original and processed images
- RGB histogram display for both images
- Live histogram updates when filters are applied
- Visual feedback showing the distribution of color intensities

### User Interface
- Clean, professional engineering tool aesthetic
- Light and dark mode support
- Responsive layout optimized for desktop
- Intuitive controls with clear visual hierarchy
- Disabled state handling while OpenCV loads

## Project Structure

```
src/
├── components/
│   ├── ImageUpload.tsx       # File upload component
│   ├── ImageCanvas.tsx       # Canvas display for images
│   ├── FilterControls.tsx    # Filter toggles and sliders
│   ├── HistogramDisplay.tsx  # Histogram visualization
│   └── ThemeToggle.tsx       # Dark/light mode toggle
├── utils/
│   └── imageProcessing.ts    # OpenCV processing functions
├── App.tsx                   # Main application component
├── main.tsx                  # Application entry point
└── index.css                 # Global styles
```

## How to Run Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd visionlab
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

### Building for Production

```bash
npm run build
```

The optimized production build will be in the `dist` folder.

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

## Usage Guide

1. **Upload an Image**: Click the "Upload Image" button and select an image from your computer
2. **Apply Filters**: Toggle filters on/off in the left sidebar. Adjust parameters using the sliders
3. **View Results**: Compare the original and processed images side-by-side
4. **Analyze Histograms**: Observe how filters affect the color distribution in the histogram charts
5. **Reset**: Click the "Reset" button to clear all filters and return to the original image
6. **Theme Toggle**: Click the sun/moon icon to switch between light and dark modes

## Learning Objectives

VisionLab serves as an educational tool to:
- Understand how different filters affect image characteristics
- Visualize the relationship between image processing and histogram changes
- Experiment with parameter tuning and observe real-time effects
- Learn classical computer vision concepts through interactive exploration
- Gain intuition about when to apply specific techniques

## Performance Notes

- OpenCV.js is loaded asynchronously from CDN
- First-time load may take a few seconds depending on network speed
- Image processing is performed client-side in the browser
- Large images may take longer to process
- All operations are non-destructive; the original image is preserved

## Browser Compatibility

VisionLab works best on modern browsers that support:
- HTML5 Canvas
- WebAssembly (required for OpenCV.js)
- ES6+ JavaScript features

Recommended browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

Potential features for future development:
- Additional filters (median blur, bilateral filter, morphological operations)
- Batch processing for multiple images
- Image comparison tools (difference maps, metrics)
- Export processed images
- Custom kernel editor for convolution operations
- Real-time webcam processing
- More advanced OpenCV features (feature detection, object tracking)

## License

This project is provided as-is for educational and personal use.

## Acknowledgments

- OpenCV community for the JavaScript bindings
- React and Vite teams for excellent development tools
- Chart.js for histogram visualization capabilities
