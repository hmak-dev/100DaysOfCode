function createSteps(selector, steps, stepHeight, data) {
	let elem = document.querySelector(selector);
	elem.innerHTML = "";
	elem.classList.contains("steps") || elem.classList.add("steps");
	elem.style.lineHeight = `${stepHeight}px`;
	elem.style.fontSize = `${stepHeight}px`;

	let step = document.createElement("div");
	step.classList.add("step");

	let propName = `--step${Math.floor(Math.random() * 1000)}translate`;
	document.documentElement.style.setProperty(propName, "0px");

	for (let lineText of data) {
		let line = document.createElement("p");
		line.innerText = lineText;
		line.style.transform = `translateY(var(${propName}))`;

		step.appendChild(line);
	}

	for (let i = 0; i < steps; i++) {
		let stp = step.cloneNode(true);

		stp.style.left = `${i * stepHeight * 0.58}px`;
		stp.style.height = `${stepHeight}px`;
		stp.children[0].style.marginTop = `${(steps - i) * stepHeight}px`;

		elem.appendChild(stp);
	}

	document.addEventListener("mousemove", e => {
		let y = e.pageY || e.clientY;
		let wh = window.innerHeight;

		let ty = (y / wh) * (data.length + steps) * -stepHeight;

		document.documentElement.style.setProperty(propName, `${ty}px`);
	});
}

createSteps("#quick", 5, 70, [
	"The", "Quick", "Brown", "Fox", "Jumps", "Over", "The", "Lazy", "Dog"
]);