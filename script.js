document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('mandelbrotCanvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const maxIter = 1000;
    const zoom = 1;
    const panX = -0.5;
    const panY = 0;

    function mandelbrot(cx, cy) {
        let zx = 0;
        let zy = 0;
        let i = 0;
        while (zx * zx + zy * zy < 4 && i < maxIter) {
            let xtemp = zx * zx - zy * zy + cx;
            zy = 2 * zx * zy + cy;
            zx = xtemp;
            i++;
        }
        return i;
    }

    function drawMandelbrot() {
        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const cx = (x / width - 0.5) * 3.5 / zoom + panX;
                const cy = (y / height - 0.5) * 2 / zoom + panY;

                const m = mandelbrot(cx, cy);

                const r = (m % 256);
                const g = ((m * 2) % 256);
                const b = ((m * 5) % 256);

                const pixelIndex = (y * width + x) * 4;
                data[pixelIndex] = m === maxIter ? 0 : r;
                data[pixelIndex + 1] = m === maxIter ? 0 : g;
                data[pixelIndex + 2] = m === maxIter ? 0 : b;
                data[pixelIndex + 3] = 255;
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }

    drawMandelbrot();
});