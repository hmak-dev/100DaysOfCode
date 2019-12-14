let maxDeg = 60;

document.addEventListener("mousemove", e => {
	let x = e.pageX || e.clientX, y = e.pageY || e.clientY;
	let w2 = window.innerWidth / 2, h2 = window.innerHeight / 2;

	let xp = (x - w2) / w2, yp = (y - h2) / h2;

	document.documentElement.style.setProperty("--rx", `${-yp * maxDeg}deg`);
	document.documentElement.style.setProperty("--ry", `${xp * maxDeg}deg`);
});