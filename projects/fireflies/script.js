//canvas setup
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//speed at which stars will travel on screen
let TIME = 0.1;
const fireflies = [];
let BUGCOUNT = 200;
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
	else if(keyname === 'ArrowLeft'){
		BUGCOUNT--;
		if(BUGCOUNT < 1)
			BUGCOUNT = 1;
	}
	else if(keyname === 'ArrowRight'){
		BUGCOUNT++;
		if(BUGCOUNT > 10000)
			BUGCOUNT = 10000;
	}
});
//available colors
const colors = [
	{'r':171,'g':240,'b':64},
	{'r':208,'g':217,'b':48},
	{'r':248,'g':232,'b':55},
	{'r':55,'g':248,'b':70},
	{'r':90,'g':217,'b':38},
]
//firefly class
/*
	pos, vel, acc all control movement
	size scales glow
	color controls glow color
	vision is how far it can see another glow in radius
*/
class FireFly{
	constructor(){
		this.position = {'x':0,'y':0};
		this.velocity = {'x':0,'y':0};
		this.acceleration = {'x':0,'y':0};
		this.targetPoint = {'x':0,'y':0};
		this.size = 1;
		this.glowing = false;
		this.glowTimer = 0;
		this.glowTime = 100;
		this.brightness = 20;
		this.color = colors[0];
		this.vision = 50;
		this.speed = 10;
		this.cooldown = 0;
	}
}
//updates the canvas size and origin when resizing screen
window.addEventListener('resize', e => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});
function createBugs(){
	for(let i=0;i<BUGCOUNT;i++){
		fireflies.push(createNewBug());
	}
}
function createNewBug(){
	let newBug = new FireFly();
	newBug.position.x = Math.floor(Math.random()*canvas.width);
	newBug.position.y = Math.floor(Math.random()*canvas.height);
	newBug.targetPoint.x = Math.floor(Math.random()*canvas.width);
	newBug.targetPoint.y = Math.floor(Math.random()*canvas.height);
	newBug.size = (Math.random() * 2)+1;
	newBug.brightness = newBug.brightness * newBug.size;
	newBug.color = colors[Math.floor(Math.random()*colors.length)];
	return newBug;
}
function init(){
	//called only once
	createBugs();
	frame();
}
function frame(){
	draw();
	updateBugs();
	moveBugs();
	if(fireflies.length != BUGCOUNT){
		while(fireflies.length < BUGCOUNT)
			fireflies.push(createNewBug());
		while(fireflies.length > BUGCOUNT)
			fireflies.pop();
	}
	window.requestAnimationFrame(frame);
}
function updateBugs(){
	let noGlow = true;
	for(let i=0;i<fireflies.length;i++){
		//handle lighting up
		if(fireflies[i].glowing){
			noGlow = false;
			if(fireflies[i].glowTimer >= fireflies[i].glowTime){
				//turn off glowing
				fireflies[i].glowing = false;
				fireflies[i].cooldown = 100;
			}
			else{
				//continue glowing
				fireflies[i].glowTimer += 1;
			}
		}
		else if(fireflies[i].glowTimer >= 0){
			fireflies[i].glowTimer -= 1;
		}
		//check if witnessing a glow TODO
		//temp, just randomly start glowing
		if(!fireflies[i].glowing && fireflies[i].glowTimer <= 0 && fireflies[i].cooldown > 0){
			fireflies[i].cooldown -= 1;
		}
		else if(!fireflies[i].glowing && Math.random() < 0.01 && fireflies[i].glowTimer <= 0){
			for(let j=0; j<fireflies.length;j++){
				if(i != j){
					let dx = fireflies[j].position.x - fireflies[i].position.x;
					let dy = fireflies[j].position.y - fireflies[i].position.y;
					let d = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
					if(d < 1){
						d = 1;
					}
					if(d <= (fireflies[i].vision + fireflies[j].brightness) && (fireflies[j].glowing || fireflies[j].glowTimer > 0)){
						fireflies[i].glowing = true;
						break;
					}
				}
			}
		}
		//update target position randomly
		
		if(Math.random() < 0.001){
			fireflies[i].targetPoint.x = Math.floor(Math.random()*canvas.width);
			fireflies[i].targetPoint.y = Math.floor(Math.random()*canvas.height);
		}
		
		//set acc towards target point with some random jitter
		let dx = fireflies[i].position.x - fireflies[i].targetPoint.x;
		let dy = fireflies[i].position.y - fireflies[i].targetPoint.y;
		let d = Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
		if(d < 1){
			d = 1;
		}
		
		fireflies[i].acceleration.x = (-dx/d) + Math.floor(Math.random()*3)-1;
		fireflies[i].acceleration.y = (-dy/d) + Math.floor(Math.random()*3)-1;
	}
	if(noGlow)
		fireflies[Math.floor(Math.random() * fireflies.length)].glowing = true;
}
function moveBugs(){
	for(let i=0;i<fireflies.length;i++){
		fireflies[i].velocity.x += fireflies[i].acceleration.x * TIME;
		fireflies[i].velocity.y += fireflies[i].acceleration.y * TIME;
		
		if(Math.abs(fireflies[i].velocity.x) > fireflies[i].speed){
			fireflies[i].velocity.x = (Math.abs(fireflies[i].velocity.x)/fireflies[i].velocity.x) * fireflies[i].speed;
		}
		if(Math.abs(fireflies[i].velocity.y) > fireflies[i].speed){
			fireflies[i].velocity.y = (Math.abs(fireflies[i].velocity.y)/fireflies[i].velocity.y) * fireflies[i].speed;
		}
		
		fireflies[i].position.x += fireflies[i].velocity.x * TIME;
		fireflies[i].position.y += fireflies[i].velocity.y * TIME;
		
		if(fireflies[i].position.x < 0){
			fireflies[i].position.x = 0;
			fireflies[i].velocity.x *= -1;
		}
		if(fireflies[i].position.x >= canvas.width){
			fireflies[i].position.x = canvas.width;
			fireflies[i].velocity.x *= -1;
		}
		
		if(fireflies[i].position.y < 0){
			fireflies[i].position.y = 0;
			fireflies[i].velocity.y *= -1;
		}
		if(fireflies[i].position.y >= canvas.height){
			fireflies[i].position.y = canvas.height;
			fireflies[i].velocity.y *= -1;
		}
	}
}
function draw(){
	ctx.fillStyle = 'black';
	ctx.fillRect(0,0,canvas.width,canvas.height);
	for(let i=0;i<fireflies.length;i++){
		//draw glow
		let circleSize = Math.min(fireflies[i].brightness, fireflies[i].glowTimer);
		if(circleSize <= 0)
			circleSize = 1;
		let glowGrad = ctx.createRadialGradient(fireflies[i].position.x, fireflies[i].position.y,1,fireflies[i].position.x, fireflies[i].position.y, circleSize);
		glowGrad.addColorStop(0, `rgba(${fireflies[i].color.r}, ${fireflies[i].color.g}, ${fireflies[i].color.b}, 1)`);
		glowGrad.addColorStop(1, `rgba(0,0,0,0)`);
		ctx.fillStyle = glowGrad;
		ctx.fillRect(fireflies[i].position.x - fireflies[i].brightness, fireflies[i].position.y - fireflies[i].brightness, fireflies[i].brightness * 2, fireflies[i].brightness * 2);
		//draw firefly	
		ctx.fillStyle = `rgba(${fireflies[i].color.r}, ${fireflies[i].color.g}, ${fireflies[i].color.b}, 0.3)`;
		ctx.fillRect(fireflies[i].position.x - fireflies[i].size, fireflies[i].position.y - fireflies[i].size, fireflies[i].size * 2, fireflies[i].size * 2);
	}
}