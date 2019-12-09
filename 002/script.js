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

let canvas = document.createElement("canvas");
let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

let image = document.querySelector(".glitch");
let imageRect = image.getBoundingClientRect();

document.body.insertBefore(canvas, image);
image.remove();

let ctx = canvas.getContext("2d");
ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0 , w, h);

let orig = cloneCanvas(canvas);
let red = cloneCanvas(canvas, (d, i) => {
	d[i] -= 30;
	d[i + 1] = d[i + 2] = 0;
});
let green = cloneCanvas(canvas, (d, i) => {
	d[i + 1] -= 30;
	d[i] = d[i + 2] = 0;
});
let blue = cloneCanvas(canvas, (d, i) => {
	d[i + 2] -= 30;
	d[i] = d[i + 1] = 0;
});

let channels = [red, green, blue];

function channelDisplace() {
	let displace = rand(30, 70);

	ctx.globalCompositeOperation = "source-over";
	ctx.drawImage(orig, 0, 0);

	ctx.globalCompositeOperation = "screen";
	ctx.drawImage(red, -displace, 0, w + displace, h);
	ctx.drawImage(green, 0, 0, w + displace / 2, h);
	ctx.drawImage(blue, 0, 0, w + displace / 2, h);
}

function imageDistort() {
	let can = cloneCanvas(canvas);
	ctx.globalCompositeOperation = "source-over";

	let y = 0;
	while (y < h) {
		let disX = rand(-20, 20);
		let height = rand(0, 100);

		for (let i = 0; i < height; i++) {
			let sin = Math.sin(i / height * Math.PI) * disX;
			ctx.drawImage(can,0, y + i, w, 1, sin, y + i,w + sin, 1);
		}

		y += height + rand(20, 100);
	}
}

setInterval(() => {
	if (rand(1, 10) > 6) {
		channelDisplace();

		if (rand(1, 10) > 6)
			imageDistort();
	} else {
		ctx.drawImage(orig, 0, 0);
	}
}, 200);