//canvas setup
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//parameters for the stars
let STARCOUNT  = 1000;
let starPool = [];
//speed at which stars will travel on screen
let TIME = 0.1;
//origin point for stars
let CENTER = {'x':canvas.width/2,'y':canvas.height/2};

//updates the canvas size and origin when resizing screen
window.addEventListener('resize', e => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	CENTER.x = canvas.width/2;
	CENTER.y = canvas.height/2;
});
//star movement, up arrow speeds up, down arrow slows down
window.addEventListener('keydown', e => {
	const keyname = e.code;
	if(keyname === 'ArrowDown'){
		TIME -= 0.01;
		if(TIME <= 0){
			TIME = 0;
		}
	}
	else if(keyname === 'ArrowUp'){
		TIME += 0.01;
		if(TIME >= 0.5){
			TIME = 0.5;
		}
	}
});
//star class, holds information about each pixel
class Star{
	constructor(){
		this.angle = 0;
		this.distance = 0;
		this.speed = 0;
		this.color = {'r':255,'g':255,'b':255,'a':1}
		this.fadeIn = 0;
	}
}
//random helper function to generate a uniform number for the simulation
function random(a,b){
	//creates a random number between b and a
	return (b - a) * Math.random() + a;
}
//init function to start star generation
function createStars(){
	for(let i=0;i<STARCOUNT;i++){
		let newStar = new Star();
		newStar.angle = random(0, 2*Math.PI);
		newStar.speed = random(10, 100);
		newStar.distance = random(20, canvas.width/2 + canvas.height/2);
		//for the color to add varienty in the intensity of the color
		let lum  = random(1, 255);
		newStar.fadeIn = random(0.01, 1);
		newStar.color.r = lum;
		newStar.color.g = lum;
		newStar.color.b = lum;
		//pushes star to array
		starPool.push(newStar);
	}
}
//called every frame to update all stars  in the pool
function updateStars(){
	for(let i=0;i<starPool.length;i++){
		//add to distance based on star speed, time constant, and distance from the center
		starPool[i].distance += starPool[i].speed * TIME * (starPool[i].distance/(canvas.width/2 + canvas.height/2));
		starPool[i].fadeIn += 0.01;
		if(starPool[i].fadeIn > 1){
			starPool[i].fadeIn = 1
		}
		if(starPool[i].distance > canvas.width/2 + canvas.height/2){
			//reset star if out of frame
			starPool[i].angle = random(0, 2*Math.PI);
			starPool[i].speed = random(10, 100);
			starPool[i].distance = random(1, canvas.width/2 + canvas.height/2);
			//color like before
			let lum  = random(1, 255);
			starPool[i].fadeIn = 0;
			starPool[i].color.r = lum;
			starPool[i].color.g = lum;
			starPool[i].color.b = lum;
		}
	}
}
function init(){
	//called only once
	createStars();
	frame();
}
function frame(){
	//updates all stars then draws
	updateStars();
	draw();
	window.requestAnimationFrame(frame);
}
function draw(){
	ctx.fillStyle = 'black';
	ctx.fillRect(0,0,canvas.width,canvas.height);
	for(let i=0;i<starPool.length;i++){
		//defines the start position based on the angle of the star from the origin, then multiplies it by the distance it has traveled + the origin
		let starXPos = Math.cos(starPool[i].angle)*starPool[i].distance + CENTER.x;
		let starYPos = Math.sin(starPool[i].angle)*starPool[i].distance + CENTER.y;
		//controls transparency of the star, getting dim as it comes from the center
		let starTrans = starPool[i].color.a * (starPool[i].distance / 100) * starPool[i].fadeIn;
		ctx.fillStyle = `rgba(${starPool[i].color.r},${starPool[i].color.g},${starPool[i].color.b},${starTrans})`;
		ctx.fillRect(starXPos,starYPos,2,2);
	}
}