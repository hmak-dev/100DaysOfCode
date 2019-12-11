let audioContext, audioSource, audioAnalyzer, frequencyArray;
let initialized = false;
let anim;

let canvas = document.querySelector(".visualizer");
const audioSrc = canvas.getAttribute("data-audio");
const coverSrc = canvas.getAttribute("data-cover");
let buttons = document.querySelector(".buttons");

let w = h = canvas.width = canvas.height = 600;

let ctx = canvas.getContext("2d");
ctx.fillStyle = "white";
ctx.strokeStyle = "white";
ctx.lineJoin = "round";
ctx.lineCap = "round";

const coverSize = 300;
const startRadius = 165;
const cx = w / 2, cy = h / 2;
const lineCount = 100;
const pi2 = Math.PI * 2;
const rads = pi2 / lineCount;

let cover = new Image();
cover.src = coverSrc;
cover.onload = () => {
	drawCover();

	drawEqualizer(frequencyArray);
};

function initAudioStuff() {
	audioContext = new (window.AudioContext || window.webkitAudioContext)();
	audioSource = audioContext.createMediaElementSource(audio);
	audioAnalyzer = audioContext.createAnalyser();

	audioSource.connect(audioAnalyzer);
	audioAnalyzer.connect(audioContext.destination);

	frequencyArray = new Uint8Array(audioAnalyzer.frequencyBinCount);

	initialized = true;
}

let audio = new Audio();
audio.src = audioSrc;

document.querySelector("#btnPlay").addEventListener("click", function() {
	if (!initialized)
		initAudioStuff();

	audio.play();

	buttons.classList.add("isPlaying");

	anim = window.requestAnimationFrame(animation);
});
document.querySelector("#btnPause").addEventListener("click", function() {
	audio.pause();

	buttons.classList.remove("isPlaying");
});

function RGBColor(color) {
	let d = document.createElement("div");
	d.style.color = color;
	d.style.display = "none";
	document.body.appendChild(d);
	let c = window.getComputedStyle(d).color;
	d.remove();

	let comps = c.substr(c.indexOf('(') + 1, c.length - 5).split(",").map(comp => parseFloat(comp));
	comps[3] = comps[3] || 1;

	return comps;
}

function drawCover() {
	ctx.save();
	ctx.beginPath();
	ctx.arc(cx, cy, coverSize / 2, 0, pi2);
	ctx.closePath();
	ctx.clip();
	ctx.drawImage(cover, 0, 0, cover.width, cover.height, cx - coverSize / 2, cy - coverSize / 2, coverSize, coverSize);
	ctx.restore();
}

function drawDuration() {
	let duration = audio.duration;
	let currentTime = audio.currentTime;

	let progress = currentTime / duration;

	ctx.strokeStyle = "#21D4FD";
	ctx.lineWidth = 3;
	ctx.beginPath();
	ctx.arc(cx, cy, startRadius - 10, -Math.PI / 2, pi2 * progress - Math.PI / 2);
	ctx.stroke();
}

function drawEqualizer() {
	ctx.lineWidth = 7;
	let radius1 = startRadius;
	let radius2 = startRadius;

	let color1 = RGBColor("#21D4FD"), color2 = RGBColor("#B721FF");
	let colorDiff = color1.map((comp, i) => color2[i] - comp);

	for (let i = 0; i < lineCount; i++) {
		let h = Math.max((frequencyArray ? frequencyArray[i] : 0), 5);
		let h1 = h * 0.2;
		let h2 = h * 0.7;

		let sin = Math.sin(i * rads), cos = Math.cos(i * rads);

		let sx1 = cx + cos * radius1, sy1 = cy + sin * radius1;
		let ex1 = cx + cos * (radius1 + h1), ey1 = cy + sin * (radius1 + h1);

		let sx2 = cx + cos * radius2, sy2 = cy + sin * radius2;
		let ex2 = cx + cos * (radius2 + h2), ey2 = cy + sin * (radius2 + h2);

		let color = `rgba(${ color1.map((comp, i) => comp + colorDiff[i] * sin).join(",")})`;

		let gradient = ctx.createLinearGradient(sx2, sy2, ex2, ey2);
		gradient.addColorStop(0, color);
		gradient.addColorStop(1, "transparent");
		ctx.strokeStyle = gradient;

		ctx.beginPath();
		ctx.moveTo(sx2, sy2);
		ctx.lineTo(ex2, ey2);
		ctx.closePath();
		ctx.stroke();

		ctx.strokeStyle = color;

		ctx.beginPath();
		ctx.moveTo(sx1, sy1);
		ctx.lineTo(ex1, ey1);
		ctx.closePath();
		ctx.stroke();
	}

	ctx.globalAlpha = 1;
}

function animation() {
	ctx.clearRect(0, 0, w, h);

	audioAnalyzer.getByteFrequencyData(frequencyArray);

	drawCover();
	drawEqualizer();
	drawDuration();

	anim = window.requestAnimationFrame(animation);
}