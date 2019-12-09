const pi2 = Math.PI * 2;

// Control variables
const gap = 6;
const minSize = 1.5, maxSize = 4;
const minSpeed = -0.05, maxSpeed = 0.05;
const minBounce = 50, maxBounce = 150;
const minBounceSpeed = 0.03, maxBounceSpeed = 0.1;

// Asset Functions
function getImageData(image, rect) {
	let can = document.createElement("canvas");
	let w = can.width = rect.width;
	let h = can.height = rect.height;

	let ctx = can.getContext("2d");
	ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, w, h);

	return ctx.getImageData(0, 0, w, h);
}
function rand(l, h) {
	return Math.random() * (h - l) + l;
}

// Dot class to hold each dot data
class Dot {
	constructor(x, y, z, s, a) {
		this.cx = x;
		this.cy = y;
		this.z = z;
		this.s = s;
		this.a = a;

		this.bx = 0;
		this.by = 0;
		this.bs = 0;

		this.isAnimating = false;
		this.ai = 0;

		this.calcPos();
	}
	calcPos() {
		this.x = this.cx + Math.cos(this.a) * 3;
		this.y = this.cy + Math.sin(this.a) * 3;

		if (this.isAnimating) {
			this.x += this.bx * Math.sin(this.ai);
			this.y += this.by * Math.sin(this.ai);
		}
	}
}

// Dots collection
let dots = [];

// Get the image
let img = document.querySelector(".particlize");
let imgRect = img.getBoundingClientRect();

// Create a canvas and replace image
let canvas = document.createElement("canvas");
document.body.insertBefore(canvas, img);
img.remove();

// Resize new canvas
let w = canvas.width = imgRect.width;
let h = canvas.height = imgRect.height;

let ctx = canvas.getContext("2d");

// get Image data
let data = getImageData(img, imgRect).data;

// Generate Dots
for (let y = 0; y < h; y += gap) {
	for (let x = 0; x < w; x += gap) {
		// Calculate index of pixel in data array
		let i = (y * w + x) * 4;

		// If average of rgb was greater than 60...
		let avg = data.slice(i, i +  3).reduce((a, b) => a + b) / 3;
		if (avg > 60) {
			// Generate a dot on that position
			dots.push(new Dot(x, y, rand(minSize, maxSize), rand(minSpeed, maxSpeed), rand(0, pi2)));
		}
	}
}

// Draw dots on the canvas
function redraw() {
	// Fill all with a dark rectangle
	ctx.globalAlpha = 1;
	ctx.fillStyle = "#09090c";
	ctx.fillRect(0,0, w, h);

	// Draw each dot with 0.6 opacity and white color
	ctx.globalAlpha = 0.6;
	ctx.fillStyle = "white";
	let i = 0;
	for (let d of dots) {
		ctx.beginPath();
		ctx.arc(d.x, d.y, d.z, 0, pi2);
		ctx.closePath();
		ctx.fill();
		i++;
	}
}
redraw();

// Process mouse movement and bounce the dots
canvas.addEventListener("mousemove", e => {
	// Get mouse position based on canvas bounds
	let r = canvas.getBoundingClientRect();
	let x = (e.pageX || e.clientX) - r.left, y = (e.pageY || e.clientY) - r.top;

	// Iterate over dots
	for (let d of dots) {
		// If the dot was not animating...
		if (!d.isAnimating) {
			// Get distance from dot position to mouse position
			let dx = x - d.cx, dy = y - d.cy;
			let dist = Math.sqrt(dx ** 2 + dy ** 2);

			// If distance was lower than 50 pixels...
			if (dist <= 50) {
				// Calculate angle between dot and mouse position
				let angle = -Math.atan2(dy, dx);

				// Generate random bounce distance
				let r = rand(minBounce, maxBounce);

				// Add bounce parameters to the dot
				d.bx = -Math.cos(angle) * r;
				d.by = Math.sin(angle) * r;
				d.bs = rand(minBounceSpeed, maxBounceSpeed);

				// Start dot animating
				d.isAnimating = true;
			}
		}
	}
});

// Each animation frame process
function animate() {
	// Iterate over dots
	for (let d of dots) {
		// Dot angle increased by dot Step
		d.a += d.s;

		// If the angle went over 2PI, decrease it to 0
		if (d.a >= pi2) d.a = 0;

		// If the dot is animating...
		if (d.isAnimating) {
			// Dot animation index is increased by dot bounce speed
			d.ai += d.bs;

			// If the animation index has reached PI, decrease it to 0 and stop animation
			if (d.ai >= Math.PI) {
				d.ai = 0;
				d.isAnimating = false;
			}
		}

		// Calculate new position for the dot
		d.calcPos();
	}

	// Redraw all dots on the canvas
	redraw();
	anim = window.requestAnimationFrame(animate);
}
let anim = window.requestAnimationFrame(animate);