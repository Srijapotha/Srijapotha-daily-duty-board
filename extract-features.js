import sharp from 'sharp';
import { createCanvas, loadImage } from 'canvas';
import fs from 'fs/promises';

// Function to download the image
async function downloadImage(url, outputPath) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.writeFile(outputPath, buffer);
  return outputPath;
}

// Function to detect red points (electrical outlets) and blue lines
async function extractFeaturesFromDrawing(imagePath) {
  try {
    // Load the image
    const image = await loadImage(imagePath);
    
    // Create a canvas with the same dimensions as the image
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    
    // Draw the image on the canvas
    ctx.drawImage(image, 0, 0);
    
    // Get the image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Extract red points (electrical outlets)
    const redPoints = findRedPoints(data, canvas.width, canvas.height);
    
    // Extract blue lines
    const blueLines = findBlueLines(data, canvas.width, canvas.height);
    
    return {
      redPoints,
      blueLines
    };
  } catch (error) {
    console.error("Error extracting features:", error);
    throw error;
  }
}

// Function to find red points (electrical outlets with cross pattern)
function findRedPoints(imageData, width, height) {
  const redPoints = [];
  const visited = new Set();
  
  // Scan the image for red pixels
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // Check if this is a red pixel (high red, low green and blue)
      if (imageData[idx] > 180 && imageData[idx + 1] < 100 && imageData[idx + 2] < 100) {
        const pointKey = `${x},${y}`;
        
        // Skip if we've already processed this area
        if (visited.has(pointKey)) continue;
        
        // Find the center of this red object
        const redObject = floodFillRedObject(imageData, x, y, width, height, visited);
        
        // If it's large enough to be an electrical outlet symbol
        if (redObject.pixels.length > 5 && redObject.pixels.length < 500) {
          redPoints.push({
            x: Math.round(redObject.centerX),
            y: Math.round(redObject.centerY)
          });
        }
      }
    }
  }
  
  return redPoints;
}

// Function to flood fill and find the center of a red object
function floodFillRedObject(imageData, startX, startY, width, height, visited) {
  const queue = [{x: startX, y: startY}];
  const pixels = [];
  let sumX = 0, sumY = 0;
  
  while (queue.length > 0) {
    const {x, y} = queue.shift();
    const pointKey = `${x},${y}`;
    
    // Skip if out of bounds or already visited
    if (x < 0 || y < 0 || x >= width || y >= height || visited.has(pointKey)) {
      continue;
    }
    
    const idx = (y * width + x) * 4;
    
    // Check if this is a red pixel
    if (imageData[idx] > 180 && imageData[idx + 1] < 100 && imageData[idx + 2] < 100) {
      visited.add(pointKey);
      pixels.push({x, y});
      sumX += x;
      sumY += y;
      
      // Add neighbors to the queue
      queue.push({x: x + 1, y});
      queue.push({x: x - 1, y});
      queue.push({x, y: y + 1});
      queue.push({x, y: y - 1});
    }
  }
  
  return {
    pixels,
    centerX: sumX / pixels.length,
    centerY: sumY / pixels.length
  };
}

// Function to find blue lines
function findBlueLines(imageData, width, height) {
  // First, extract all blue pixels
  const bluePixels = [];
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // Check if this is a blue pixel (high blue, low red and green)
      if (imageData[idx + 2] > 180 && imageData[idx] < 100 && imageData[idx + 1] < 100) {
        bluePixels.push({x, y});
      }
    }
  }
  
  // Group blue pixels into connected components (lines)
  const lines = groupBluePixelsIntoLines(bluePixels);
  
  // Extract start and end points for each line
  return lines.map(line => {
    // Find the two points that are furthest apart to represent start and end
    let maxDistance = 0;
    let startPoint = line[0];
    let endPoint = line[0];
    
    for (let i = 0; i < line.length; i++) {
      for (let j = i + 1; j < line.length; j++) {
        const distance = Math.sqrt(
          Math.pow(line[i].x - line[j].x, 2) + 
          Math.pow(line[i].y - line[j].y, 2)
        );
        
        if (distance > maxDistance) {
          maxDistance = distance;
          startPoint = line[i];
          endPoint = line[j];
        }
      }
    }
    
    return {
      start: { x: startPoint.x, y: startPoint.y },
      end: { x: endPoint.x, y: endPoint.y }
    };
  });
}

// Function to group blue pixels into lines
function groupBluePixelsIntoLines(bluePixels) {
  if (bluePixels.length === 0) return [];
  
  const lines = [];
  const visited = new Set();
  
  // Process each blue pixel
  for (const pixel of bluePixels) {
    const pixelKey = `${pixel.x},${pixel.y}`;
    
    // Skip if already processed
    if (visited.has(pixelKey)) continue;
    
    // Find all connected blue pixels (a line)
    const connectedPixels = findConnectedBluePixels(pixel, bluePixels, visited);
    
    // If we have enough pixels to form a line
    if (connectedPixels.length > 10) {
      lines.push(connectedPixels);
    }
  }
  
  return lines;
}

// Function to find all connected blue pixels
function findConnectedBluePixels(startPixel, allBluePixels, visited) {
  const queue = [startPixel];
  const connectedPixels = [];
  const pixelMap = new Map();
  
  // Create a map for faster lookup
  for (const pixel of allBluePixels) {
    pixelMap.set(`${pixel.x},${pixel.y}`, pixel);
  }
  
  while (queue.length > 0) {
    const pixel = queue.shift();
    const pixelKey = `${pixel.x},${pixel.y}`;
    
    if (visited.has(pixelKey)) continue;
    
    visited.add(pixelKey);
    connectedPixels.push(pixel);
    
    // Check 8 neighboring pixels
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        
        const nx = pixel.x + dx;
        const ny = pixel.y + dy;
        const neighborKey = `${nx},${ny}`;
        
        if (pixelMap.has(neighborKey) && !visited.has(neighborKey)) {
          queue.push(pixelMap.get(neighborKey));
        }
      }
    }
  }
  
  return connectedPixels;
}

// Main function
async function main() {
  try {
    console.log("Starting feature extraction from DWG drawing...");
    
    // Download the image from the provided URL
    const imageUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-AnZExgY4bUOMtyLpNptiKJ4rnBJb2K.png";
    const localImagePath = "./dwg-drawing.png";
    await downloadImage(imageUrl, localImagePath);
    
    console.log("Image downloaded, processing...");
    
    // Extract features from the image
    const features = await extractFeaturesFromDrawing(localImagePath);
    
    // Format the output as JSON
    const result = {
      redPoints: features.redPoints.map((point, index) => ({
        id: `point_${index + 1}`,
        type: "electrical_point",
        coordinates: { x: point.x, y: point.y }
      })),
      blueLines: features.blueLines.map((line, index) => ({
        id: `line_${index + 1}`,
        type: "connection",
        start: { x: line.start.x, y: line.start.y },
        end: { x: line.end.x, y: line.end.y }
      }))
    };
    
    // Output the result
    console.log("Feature extraction complete!");
    console.log(JSON.stringify(result, null, 2));
    
    // Save the result to a file
    await fs.writeFile("extracted_features.json", JSON.stringify(result, null, 2));
    console.log("Results saved to extracted_features.json");
    
  } catch (error) {
    console.error("Error during extraction:", error);
  }
}

main();
