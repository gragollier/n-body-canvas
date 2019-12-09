"use strict";

let WIDTH = 1920;
let HEIGHT = 1080;
const NUM_PARTICLES = 200;
const SPAWN_RATE = 20;

class Particle {
    constructor(x, y, mass, color) {
        this.x = x;
        this.y = y;
        this.mass = mass;
        this.color = color;
        this.aX = 0;
        this.aY = 0;
    }

    update() {
        this.x += this.aX;
        this.y += this.aY;
    }

    getRadius() {
        return Math.sqrt(this.mass) / 2;
    }
}

/**
 * @see https://www.paulirish.com/2009/random-hex-color-code-snippets/
 * @returns {String}
 */
function getRandomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

/**
 *
 * @param {[Particle]} particles
 * @param {Number} num
 */
function generateParticles(particles, num) {
    for (let _ = 0; _ < num; _++) {
        const xPos = Math.round(Math.random() * WIDTH);
        const yPos = Math.round(Math.random() * HEIGHT);
        const mass = Math.round(Math.random() * 100);
        const color = getRandomColor();

        particles.push(new Particle(xPos, yPos, mass, color));
    }
    return particles;
}

/**
 *
 * @param {[Particle]} particles
 * @returns {[Particle]}
 */
function calculateGravity(particles) {
    particles.forEach(currentParticle => {
        currentParticle.aX = 0;
        currentParticle.aY = 0;

        particles.filter(e => e != currentParticle)
            .forEach(otherParticle => {
                const deltaX = otherParticle.x - currentParticle.x;
                const deltaY = otherParticle.y - currentParticle.y;

                const r = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const a = otherParticle.mass / Math.pow(r, 2);
                const angle = Math.atan2(deltaY, deltaX);

                currentParticle.aX += a * Math.cos(angle);
                currentParticle.aY += a * Math.sin(angle);
            });
    });
    return particles;
}

/**
 *
 * @param {[Particle]} particles
 * @returns {[Particle]}
 */
function calculateCollisions(particles) {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const currentParticle = particles[i];
            const otherParticle = particles[j];

            const dx = currentParticle.x - otherParticle.x;
            const dy = currentParticle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < currentParticle.getRadius()) {
                currentParticle.mass += otherParticle.mass;
                currentParticle.aX = 0;
                currentParticle.aY = 0;
                currentParticle.color = "black";
                particles.splice(j, 1);
                j--;
            }
        }
    }
    return particles;
}

function main() {
    const canvas = document.getElementById("main");

    // Scale to size of window
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    /** @type {CanvasRenderingContext2D} */
    const context = canvas.getContext("2d");

    // Handle Retina Displays
    if (window.devicePixelRatio > 1) {
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        canvas.width = canvasWidth * window.devicePixelRatio;
        canvas.height = canvasHeight * window.devicePixelRatio;
        canvas.style.width = canvasWidth;
        canvas.style.height = canvasHeight;

        context.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    WIDTH = canvas.width / window.devicePixelRatio;
    HEIGHT = canvas.height / window.devicePixelRatio;

    /** @type {[Particle]} */
    const particles = [];

    // Make some particles
    generateParticles(particles, NUM_PARTICLES);

    // Event loop
    setInterval(() => {
        context.fillStyle = "white";
        context.fillRect(0, 0, WIDTH, HEIGHT);
        context.clearRect(0, 0, WIDTH, HEIGHT);

        calculateGravity(particles);
        calculateCollisions(particles);

        particles.forEach(particle => {
            particle.update();

            const radius = particle.getRadius();
            const x = Math.round(particle.x);
            const y = Math.round(particle.y);

            // Draw particle
            context.fillStyle = particle.color;
            context.beginPath();
            context.arc(x, y, radius, 0, 2 * Math.PI);
            context.fill();
            context.closePath();
        });
    }, 30);

    setInterval(() => {
        generateParticles(particles, SPAWN_RATE);
    }, 200);
}

window.onload = main;
