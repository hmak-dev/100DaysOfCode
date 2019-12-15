function rand(l, h) {
	return Math.random() * (h - l) + l;
}


const blobCount = 20;
const blobs = [];

let blobsElem = document.querySelector(".blobs");
let ww = window.innerWidth, wh = window.innerHeight;

for (let i = 0; i < blobCount; i++) {
	let blob = document.createElement("div");
	blob.classList.add("blob");

	blob.speed = { x: rand(-2, 2), y: rand(-2, 2) };
	blob.size = rand(100, 300);
	blob.position = { x: rand(0, ww - blob.size), y: rand(0, wh - blob.size) };

	blob.style.width = blob.style.height = `${blob.size}px`;
	blob.style.position = `absolute`;
	blob.style.left = `${blob.position.x}px`;
	blob.style.top = `${blob.position.y}px`;

	blobsElem.appendChild(blob);
	blobs.push(blob);
}

function anim() {
	for (let blob of blobs) {
		blob.position.x += blob.speed.x;
		blob.position.y += blob.speed.y;

		blob.style.left = `${blob.position.x}px`;
		blob.style.top = `${blob.position.y}px`;

		if (blob.position.x < 0 || blob.position.x > window.innerWidth - blob.size)
			blob.speed.x = -blob.speed.x;

		if (blob.position.y < 0 || blob.position.y > window.innerHeight - blob.size)
			blob.speed.y = -blob.speed.y;
	}

	animID = window.requestAnimationFrame(anim);
}
let animID = window.requestAnimationFrame(anim);