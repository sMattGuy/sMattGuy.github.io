//canvas setup
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

//sliders
//boid modifiers
let speedSlider = document.getElementById("maxSpeed");
let speedInfo = document.getElementById("speedDisplay");
speedInfo.innerHTML = speedSlider.value;

//canvas settings
let widthSlider = document.getElementById("maxWidth");
let widthInfo = document.getElementById("widthDisplay");
widthInfo.innerHTML = widthSlider.value;
let heightSlider = document.getElementById("maxHeight");
let heightInfo = document.getElementById("heightDisplay");
heightInfo.innerHTML = heightSlider.value;

//buttons
let startButton = document.getElementById("startGame");
let clearButton = document.getElementById("drawClear");

//radio buttons
let radioButtons = document.getElementById("radios");
let acType = 0;
radioButtons.addEventListener("change", e => {
	acType = e.target.value;
});

//color sliders
let redSlider = document.getElementById("red");
let greenSlider = document.getElementById("green");
let blueSlider = document.getElementById("blue");
let redValue = 255;
let greenValue = 255;
let blueValue = 255;

redSlider.oninput = function(){
	redValue = parseInt(this.value);
}
greenSlider.oninput = function(){
	greenValue = parseInt(this.value);
}
blueSlider.oninput = function(){
	blueValue = parseInt(this.value);
}

//weight array
let weight = [ 0.3,-0.2, 0.7,
				  -0.3, 1.0, 0.2,
				  -0.4, 0.1,-0.6];

//weight inputs
let weight1 = document.getElementById("weight1");
let weight2 = document.getElementById("weight2");
let weight3 = document.getElementById("weight3");
let weight4 = document.getElementById("weight4");
let weight5 = document.getElementById("weight5");
let weight6 = document.getElementById("weight6");
let weight7 = document.getElementById("weight7");
let weight8 = document.getElementById("weight8");
let weight9 = document.getElementById("weight9");
let weightSubmit = document.getElementById("weightSubmit");
let randomizeWeight = document.getElementById("randomWeight");

weight1.value = weight[0];
weight2.value = weight[1];
weight3.value = weight[2];
weight4.value = weight[3];
weight5.value = weight[4];
weight6.value = weight[5];
weight7.value = weight[6];
weight8.value = weight[7];
weight9.value = weight[8];

weightSubmit.onclick = function(){
	weight1.value = weightAssignment(weight1.value, 0);
	weight2.value = weightAssignment(weight2.value, 1);
	weight3.value = weightAssignment(weight3.value, 2);
	weight4.value = weightAssignment(weight4.value, 3);
	weight5.value = weightAssignment(weight5.value, 4);
	weight6.value = weightAssignment(weight6.value, 5);
	weight7.value = weightAssignment(weight7.value, 6);
	weight8.value = weightAssignment(weight8.value, 7);
	weight9.value = weightAssignment(weight9.value, 8);
}
randomizeWeight.onclick = function(){
	for(let i=0;i<9;i++){
		let newVal = Math.random();
		if(Math.random() < 0.5){
			newVal *= -1;
		}
		newVal = Math.round(newVal * 100) / 100;
		weightAssignment(newVal, i);
	}
	weight1.value = weight[0];
	weight2.value = weight[1];
	weight3.value = weight[2];
	weight4.value = weight[3];
	weight5.value = weight[4];
	weight6.value = weight[5];
	weight7.value = weight[6];
	weight8.value = weight[7];
	weight9.value = weight[8];
}
function weightAssignment(newValue, index){
	let value = parseFloat(newValue);
	if(isNaN(value)){
		weight[index] = 0;
		value = 0;
	}
	else{
		if(value < -1){
			weight[index] = -1.0;
		}
		else if(value > 1){
			weight[index] = 1.0;
		}
		else{
			weight[index] = value;
		}
	}
	return value;
}
let fillRandom = document.getElementById("fillRandom");
fillRandom.onclick = function(){
	for(let i=0;i<drawArray.length;i++){
		for(let j=0;j<drawArray[i].length;j++){
			let newVal = Math.random();
			if(Math.random() > 0.5){
				newVal *= -1;
			}
			drawArray[i][j].exists = newVal;
		}
	}
}
//constants
let START = false;
let SPEED = speedSlider.value;
//canvas constants
let FIELDX = canvas.width;
let FIELDY = canvas.height;
//tile size
let TILESIZE = 2;
//canvas listen to get X and Y of mouse click to place flag
let moveDrawing = false;
let removeDrawing = false;
let mouseDown = false;
let drawArray = new Array(Math.floor(FIELDX/TILESIZE));
canvas.addEventListener('mousemove', e => {
	//main drawing code
	if(mouseDown){
		//drawing new tiles
		if(!removeDrawing && (drawArray[Math.floor(e.offsetX/TILESIZE)][Math.floor(e.offsetY/TILESIZE)].exists == 1 || moveDrawing)){
			moveDrawing = true;
			drawArray[Math.floor(e.offsetX/TILESIZE)][Math.floor(e.offsetY/TILESIZE)].exists = 1;
		}
		//removing old tiles
		else if(!moveDrawing){
			removeDrawing = true;
			drawArray[Math.floor(e.offsetX/TILESIZE)][Math.floor(e.offsetY/TILESIZE)].exists = 0;
		}
	}
});
canvas.addEventListener('mouseup', e => {
	mouseDown = false;
	moveDrawing = false;
	removeDrawing = false;
});
//canvas listen to get X and Y of mouse click to place flag
canvas.addEventListener('mousedown', e => {
	mouseDown = true;
	if(drawArray[Math.floor(e.offsetX/TILESIZE)][Math.floor(e.offsetY/TILESIZE)].exists == 1){
		drawArray[Math.floor(e.offsetX/TILESIZE)][Math.floor(e.offsetY/TILESIZE)].exists = 0;
	}
	else{
		drawArray[Math.floor(e.offsetX/TILESIZE)][Math.floor(e.offsetY/TILESIZE)].exists = 1;
	}
});
speedSlider.oninput = function(){
	SPEED = parseInt(this.value);
	speedInfo.innerHTML = this.value;
}

//canvas sliders
widthSlider.oninput = function(){
	FIELDX = parseInt(this.value);
	canvas.width = this.value;
	widthInfo.innerHTML = this.value;
	createArray();
}
heightSlider.oninput = function(){
	FIELDY = parseInt(this.value);
	canvas.height = this.value;
	heightInfo.innerHTML = this.value;
	createArray();
}
startButton.oninput = function(){
	START = !START;
}
clearButton.onclick = function(){
	createArray();
};
function createArray(){
	drawArray = new Array(Math.floor(FIELDX/TILESIZE));
	for(let i=0;i<Math.floor(FIELDX/TILESIZE);i++){
		drawArray[i] = new Array(FIELDY/TILESIZE);
		for(let j=0;j<Math.floor(FIELDY/TILESIZE);j++){
			drawArray[i][j] = {'exists':0,'nextFrame':0};
		}
	}
}
//frames
let FPS = 0;
let recentFPS = 0;
let timePassed = 0;
let speedCount = 0;
//this is what loops the frames indefinietly
function doFrames() {
	if(speedCount >= SPEED){
		if(Date.now() - timePassed > 1000){
			recentFPS = FPS;
			FPS = 0;
			timePassed = Date.now();
		}
		FPS++;
		updateGrid();
		draw();
		speedCount = 0;
	}
	speedCount++;
	window.requestAnimationFrame(doFrames);
}

/*
	this is whats called on page load to kick start everything
	it creates the initial units and triggers the frames
*/
function init(){
	createArray();
	doFrames();
}

/*
	the canvas draw function, each section is divided up
	the for loop is what draws the actual units
*/
function draw(){
	ctx.fillStyle = '#000000';
	ctx.fillRect(0,0,FIELDX,FIELDY);
	//draw array
	for(let i=0;i<Math.floor(FIELDX/TILESIZE);i++){
		for(let j=0;j<Math.floor(FIELDY/TILESIZE);j++){
			if(drawArray[i][j].exists > 0.0){
				ctx.fillStyle = `rgba(${redValue},${greenValue},${blueValue},${drawArray[i][j].exists})`;
				ctx.fillRect(i*TILESIZE,j*TILESIZE,TILESIZE,TILESIZE);
			}
		}
	}
	//write fps
	ctx.font = `12px Tahoma`;
	ctx.fillStyle = 'red';
	ctx.fillText(`FPS:${recentFPS}`,0,10);
}
function updateGrid(){
	for(let i=0;i<drawArray.length;i++){
		for(let j=0;j<drawArray[i].length;j++){
			//update for wrapping and using weights
			let value = 0;

			value += drawArray[(i-1+drawArray.length)%drawArray.length][(j-1+drawArray[i].length)%drawArray[i].length].exists * weight[0]; // top left
			value += drawArray[i][(j-1+drawArray[i].length)%drawArray[i].length].exists * weight[1]; // top mid
			value += drawArray[(i+1+drawArray.length)%drawArray.length][(j-1+drawArray[i].length)%drawArray[i].length].exists * weight[2]; // top right
			value += drawArray[(i-1+drawArray.length)%drawArray.length][j].exists * weight[3]; // right
			value += drawArray[i][j].exists * weight[4]
			value += drawArray[(i+1+drawArray.length)%drawArray.length][j].exists * weight[5]; // left
			value += drawArray[(i-1+drawArray.length)%drawArray.length][(j+1+drawArray[i].length)%drawArray[i].length].exists * weight[6]; // bot left
			value += drawArray[i][(j+1+drawArray[i].length)%drawArray[i].length].exists * weight[7]; // bot mid
			value += drawArray[(i+1+drawArray.length)%drawArray.length][(j+1+drawArray[i].length)%drawArray[i].length].exists * weight[8]; // bot right

			//end of cell
			value = activate(value, acType);
			if(value > 1.0){
				value = 1.0;
			}
			else if(value < 0){
				value = 0.0;
			}
			drawArray[i][j].nextFrame = value;
		}
	}
	for(let i=0;i<drawArray.length;i++){
		for(let j=0;j<drawArray[i].length;j++){
			drawArray[i][j].exists = drawArray[i][j].nextFrame;
		}
	}
}

function activate(x, type){
	if(type == 0){
		return x;
	}
	else if(type == 1){
		return Math.sin(x);
	}
	else if(type == 2){
		return Math.pow(x,2.0);
	}
	else if(type == 3){
		return Math.abs(x);
	}
	else if(type == 4){
		return Math.tanh(x);
	}
	else if(type == 5){
		return 1.0/Math.pow(2.0,(Math.pow(x,2.0)));
	}
	else if(type == 6){
		return -1.0/Math.pow(2.0,(0.6 * Math.pow(x,2.0)))+1.0;
	}
}
