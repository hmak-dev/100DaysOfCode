// Some asset functions
function cloneCanvas(can, proc) {
	let canvas = document.createElement("canvas");
	canvas.width = can.width;
	canvas.height = can.height;

	let ctx = canvas.getContext("2d");

	if (proc) {
		let id = can.getContext("2d").getImageData(0,0, can.width, can.height);
		let d = id.data;

		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				let i = (y * w + x) * 4;
				proc(d, i);
			}
		}
		id.data = d;

		ctx.putImageData(id, 0, 0);
	} else {
		ctx.drawImage(can, 0, 0);
	}

	return canvas;
}
function rand(low, high) {
	return Math.random() * (high - low) + low;
}

// Create and resize the canvas
let canvas = document.createElement("canvas");
let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

// Get the image
let image = document.querySelector(".glitch");

// Replace the image with canvas
document.body.insertBefore(canvas, image);
image.remove();

// Get canvas context and draw the image on the canvas
let ctx = canvas.getContext("2d");
ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0 , w, h);

// Get three red, green and blue channels of the image
// And also a darker version of the original image
const darkness = -30;
let orig = cloneCanvas(canvas, (d, i) => {
	d[i] += darkness;
	d[i + 1] += darkness;
	d[i + 2] += darkness;
});
let red = cloneCanvas(canvas, (d, i) => {
	d[i] += darkness;

	// Zero green and blue colors
	d[i + 1] = d[i + 2] = 0;
});
let green = cloneCanvas(canvas, (d, i) => {
	d[i + 1] += darkness;

	// Zero red and blue colors
	d[i] = d[i + 2] = 0;
});
let blue = cloneCanvas(canvas, (d, i) => {
	d[i + 2] += darkness;

	// Zero red and green colors
	d[i] = d[i + 1] = 0;
});

function channelDisplace() {
	// Random displace amount
	let displace = rand(30, 70);

	// Draw the original darker image
	ctx.drawImage(orig, 0, 0);

	// Draw the channels with displacement with screen blending mode
	ctx.globalCompositeOperation = "screen";
	ctx.drawImage(red, -displace, 0, w + displace, h);
	ctx.drawImage(green, 0, 0, w + displace / 2, h);
	ctx.drawImage(blue, 0, 0, w + displace / 2, h);
	ctx.globalCompositeOperation = "source-over";
}


function imageDistort() {
	// Get the current canvas as the sample
	let can = cloneCanvas(canvas);

	// Iterate over height
	let y = 0;
	while (y < h) {
		// Random displace on X axis
		let disX = rand(-20, 20);

		// Random height for displacement
		let height = rand(0, 100);

		// Displace each row of pixels like an arc using Sin math function
		for (let i = 0; i < height; i++) {
			let sin = Math.sin(i / height * Math.PI) * disX;
			ctx.drawImage(can,0, y + i, w, 1, sin, y + i,w + sin, 1);
		}

		// Skip for a random amount and the current height
		y += height + rand(20, 100);
	}
}


// This will loop the effect ever 200 milliseconds
setInterval(() => {
	// Generate random number from 0 to 10 and if it was greater than 6...
	if (rand(0, 10) > 6) {
		channelDisplace();

		// Generate random number from 0 to 10 and if it was greater than 4...
		if (rand(0, 10) > 4)
			imageDistort();
	} else {
		// If the number was lower than 6 draw the original image
		ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0 , w, h);
	}
}, 200);