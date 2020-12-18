"use strict";

// Globals...
let canvas = document.getElementById("main_canvas");
let ctx = canvas.getContext("2d");

function NewSim() {

	let sim = {
		i: 0,
	};

	sim.spin = function() {
		this.update();
		this.clearcanvas();
		this.draw();
		window.requestAnimationFrame(() => {
			this.spin();
		});
	};

	sim.update = function() {
		this.i += 1;
	};

	sim.clearcanvas = function() {
		if (this.i % 60 === 1) {					// Every 60 frames, update the canvas size...
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		} else {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}
	};

	sim.draw = function() {
		ctx.font = "30px Arial";
		ctx.fillStyle = "red";
		ctx.textBaseline = "top";
		ctx.fillText(`${canvas.width} x ${canvas.height} (i: ${this.i})`, 20, 20);
	};

	return sim;
}


let sim = NewSim();
sim.spin();
