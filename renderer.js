"use strict";

function randint(n) {
    return Math.floor(Math.random() * n);
}

function swarm() {
    var shipsprite = new Image();
    shipsprite.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gUNDAQSQKXNegAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAABaElEQVRIx82X663DIAyFj1HWySTskDkYgTm6A5MwkPujdeoS80rbm2upUgXGXzA+xCFmxqgRUdOZmWk01lIGLRdrWIxx+MFqcWR8kUHeXg7MTOKoYeu6NsHaV4Os+MshXdtjUoLUYN57AEBKyXwwWa+hbxmQMxYHuj0WtXbnvd+B+r9lOWeEECCxJdWki0t2OgptjZlwde5vO+5BP7ES7nCRub/YrRRejHGv9mU2gFRzaa0zbl4go1BLGgBAnQI7+AMYSrNA6Va5Lp9zPbgUmRtJp4byZv9kzlpbLa4ZTc5aSsmEu19CW/BrddxLy6dmZdKNnsk3oVUdl44pJdBJOdVqhph5+MpsXiATGjYbgV510hVX5hlAs6qZmUIIyDn/TD7/6308s2tLaj35Wa2P0/0Wb0APXup8qtlTffcuJy0T6TRn29sSCGCH6tjMTAfwPnGiodeZCiHAbOg1+FufMAIb+YShqz7a7vJnTfCXQ3dy";

    var BUGCOUNT = 2500;
    var QCOUNT = 20;

    var PLAYER_MAX_SPEED = 10;

    var canvas = document.getElementById("main_canvas")
    var virtue = canvas.getContext("2d");
    var sim;

    // Insect objects for prototypal inheritance...

    var base_insect = {x: 0, y: 0, speedx: 0, speedy: 0, target: null, avoidance: 4200, margin: 50};

    var base_bug = Object.create(base_insect);
    base_bug.turn_prob = 0.0025;
    base_bug.accel_mod = 0.56;
    base_bug.max_speed = 7;
    base_bug.target_name = "queens";    // What property of sim to use as a target (or array of possible targets).

    var base_queen = Object.create(base_insect);
    base_queen.turn_prob = 0.0015;
    base_queen.accel_mod = 0.7;
    base_queen.max_speed = 5.6;
    base_queen.target_name = "queens";  // What property of sim to use as a target (or array of possible targets).

    // Methods inherited by the critters via "base_bug" and "base_queen"...

    base_insect.move = function () {

        var target;

        if (Math.random() < this.turn_prob || this.target === null || this.target === this) {
            target = sim[this.target_name];
            if (Array.isArray(target)) {
                target = target[randint(target.length)];
            }
            this.target = target;
        }

        // Chase target...

        var vector = this.unit_vector_to_target();
        var vecx = vector[0];
        var vecy = vector[1];

        if (vecx === 0 && vecy === 0) {
            this.speedx += (Math.random() * 2 - 1) * this.accel_mod;
            this.speedy += (Math.random() * 2 - 1) * this.accel_mod;
        } else {
            this.speedx += vecx * Math.random() * this.accel_mod;
            this.speedy += vecy * Math.random() * this.accel_mod;
        }

        // Avoid walls...

        if (this.x < this.margin) {
            this.speedx += Math.random() * 2;
        }
        if (this.x >= this.sim.width - this.margin) {
            this.speedx -= Math.random() * 2;
        }
        if (this.y < this.margin) {
            this.speedy += Math.random() * 2;
        }
        if (this.y >= this.sim.height - this.margin) {
            this.speedy -= Math.random() * 2;
        }

        // Avoid player...

        var dx = (this.sim.player.x - this.x) * 0.75;       // Reduce the distance, to strengthen the effect
        var dy = (this.sim.player.y - this.y) * 0.75;
        var distance_squared = dx * dx + dy * dy;
        var distance = Math.sqrt(distance_squared);
        if (distance > 1) {
            var adjusted_force = this.avoidance / (distance_squared * distance);
            this.speedx -= dx * adjusted_force * Math.random();
            this.speedy -= dy * adjusted_force * Math.random();
        }

        // Throttle speed...

        var speed = Math.sqrt(this.speedx * this.speedx + this.speedy * this.speedy);
        if (speed > this.max_speed) {
            this.speedx *= this.max_speed / speed;
            this.speedy *= this.max_speed / speed;
        }

        // Update position...

        this.x += this.speedx;
        this.y += this.speedy;
    };

    base_insect.unit_vector_to_target = function () {
        var dx = this.target.x - this.x;
        var dy = this.target.y - this.y;

        if (dx < 0.01 && dx > -0.01 && dy < 0.01 && dy > -0.01) {
            return [0, 0];
        }

        var distance = Math.sqrt(dx * dx + dy * dy);
        return [dx / distance, dy / distance];
    };

    // Set up sim...

    sim = Object.create(null);

    sim.width = window.innerWidth;
    sim.height = window.innerHeight;

    sim.iteration = 0;
    sim.bugs = [];
    sim.queens = [];

    // Fill sim arrays...

    var i;

    while (sim.bugs.length < BUGCOUNT) {
        i = Object.create(base_bug);
        i.sim = sim;
        i.x = sim.width / 2;
        i.y = sim.height / 2;
        sim.bugs.push(i);
    }

    while (sim.queens.length < QCOUNT) {
        i = Object.create(base_queen);
        i.sim = sim;
        i.x = sim.width / 2;
        i.y = sim.height / 2;
        sim.queens.push(i);
    }

    // Set up player...

    sim.player = {
        sim: sim,
        x: sim.width / 2,
        y: sim.height / 2,
        speedx: 0,
        speedy: 0,
        max_speed: PLAYER_MAX_SPEED,
        keyboard: {"w": false, "a": false, "s": false, "d": false, " ": false}
    };

    sim.player.move = function () {
        if (this.keyboard.w) {
            this.speedy -= 0.2;
        }
        if (this.keyboard.a) {
            this.speedx -= 0.2;
        }
        if (this.keyboard.s) {
            this.speedy += 0.2;
        }
        if (this.keyboard.d) {
            this.speedx += 0.2;
        }
        if (this.keyboard[" "]) {
            this.speedx *= 0.95;
            if (this.speedx < 0.05 && this.speedx > -0.05) {
                this.speedx = 0;
            }
            this.speedy *= 0.95;
            if (this.speedy < 0.05 && this.speedy > -0.05) {
                this.speedy = 0;
            }
        }

        var speed = Math.sqrt(this.speedx * this.speedx + this.speedy * this.speedy);

        if (speed > this.max_speed) {
            this.speedx *= this.max_speed / speed;
            this.speedy *= this.max_speed / speed;
        }

        if ((this.x < 16 && this.speedx < 0) || (this.x > this.sim.width - 16 && this.speedx > 0)) {
            this.speedx *= -1;
        }
        if ((this.y < 16 && this.speedy < 0) || (this.y > this.sim.height - 16 && this.speedy > 0)) {
            this.speedy *= -1;
        }

        this.x += this.speedx;
        this.y += this.speedy;
    };

    // Main logic functions...

    sim.update = function () {

        var arr;
        var len;
        var n;

        this.iteration += 1;

        arr = this.bugs;
        len = this.bugs.length;
        for (n = 0; n < len; n += 1) {
            arr[n].move();
        }

        arr = this.queens;
        len = this.queens.length;
        for (n = 0; n < len; n += 1) {
            arr[n].move();
        }

        this.player.move();

        var that = this;
        requestAnimationFrame(function () {
            that.frame();
        });
    };

    sim.frame = function () {

        if (this.iteration % 60 === 0) {

            this.width = window.innerWidth;
            this.height = window.innerHeight;

            canvas.width = this.width;
            canvas.height = this.height;

        } else {

            virtue.clearRect(0, 0, this.width, this.height);

        }

        var arr;
        var len;
        var n;

        virtue.fillStyle = "#00ff00";

        arr = this.bugs;
        len = this.bugs.length;
        for (n = 0; n < len; n += 1) {
            virtue.fillRect(Math.floor(arr[n].x), Math.floor(arr[n].y), 1, 1);
        }

        virtue.drawImage(shipsprite, this.player.x - shipsprite.width / 2, this.player.y - shipsprite.height / 2);

        var that = this;
        setTimeout(function () {
            that.update();
        }, 0);
    };

    // Set up the document...

    document.addEventListener("keydown", function (evt) {
        sim.player.keyboard[evt.key] = true;
    });

    document.addEventListener("keyup", function (evt) {
        sim.player.keyboard[evt.key] = false;
    });

    canvas.width = sim.width;
    canvas.height = sim.height;

    // Everything is set...

    return sim;
}

swarm().update();       // One call to update() sets in motion an infinite chain of callbacks.
