const sizeX = 512
const sizeY = 512

let sketch = function(p5) {
  p5.preload = function() {
    img = p5.loadImage('https://firebasestorage.googleapis.com/v0/b/doodling-321e8.appspot.com/o/23_pixel_sorting%2Fimg2.jpg?alt=media&token=35b42094-b6cc-4993-af01-a83e7296a022')
  }

  p5.setup = function() {
    p5.createCanvas(sizeX, sizeY)
    p5.pixelDensity(1)
    img.loadPixels()
    p5.loadPixels()
    p5.noStroke()

    const sampledPixels = []
    for(let i=0; i<sizeX; i++) {
      sampledPixels[i] = new Array(sizeY)
    }

    const sampleScaleX = Math.floor(img.width/sizeX)
    const sampleScaleY = Math.floor(img.height/sizeY)

    // only take pixels to fit into sizeX and sizY
    for (let x=0; x<sizeX; x++) {
      for (let y=0; y<sizeY; y++) {
        const index = 4 * ( (x * sampleScaleX) + ( (y * sampleScaleY) * img.width ) )

        const rgb = { 
          r: img.pixels[index + 0],
          g: img.pixels[index + 1],
          b: img.pixels[index + 2]
        }

        sampledPixels[x][y] = rgb
      }
    }

    // drawImage(p5,sampledPixels)
    const output = process(sampledPixels)
    drawImage(p5, output)
  }

  function process(image) {
    const output = createMatrix(image.length, image[0].length, -1)

    // used to keep track of points already added to candidates
    const visited = createMatrix(image.length, image[0].length, false)

    // used to keep track of pixels not already used from the original image
    const unusedColors = []
    for (let x=0; x<image.length; x++) {
      for (let y=0; y<image[0].length; y++) {
        unusedColors.push(image[x][y])
      }
    }

    const candidates = []

    const startP = { x: getRandomInt(0, sizeX-1), y: getRandomInt(0, sizeY-1) }
    candidates.push(startP)
    output[startP.x][startP.y] = image[startP.x][startP.y]
    visited[startP.x][startP.y] = true

    while (candidates.length != 0) {
      const pIdx = getRandomInt(0, candidates.length-1)
      // const pIdx = getNearestTo(startP, candidates)
      // const pIdx = getFurthestTo(startP, candidates)
      
      const p = candidates[pIdx]

      const avgColor = getAvgSurrandingColor(p, output)
      const color = pickSimilarColor(avgColor, unusedColors)

      output[p.x][p.y] = color

      expandCandidates(candidates, p, pIdx, visited)
    }

    if (unusedColors.length > 0) {
      console.error("unusedColors.length > 0", unusedColors)
    }

    return output
  }
}

new p5(sketch)