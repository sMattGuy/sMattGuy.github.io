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

//constants
let START = false;
let SPEED = speedSlider.value;
//canvas constants
let FIELDX = canvas.width;
let FIELDY = canvas.height;
//tile size
let TILESIZE = 10;
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
async function doFrames() {
	if(speedCount >= SPEED){
		if(Date.now() - timePassed > 1000){
			recentFPS = FPS;
			FPS = 0;
			timePassed = Date.now();
		}
		FPS++;
		draw();
		if(START && speedCount >= SPEED){
			updateGrid();
		}	
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
	ctx.fillStyle = '#eee';
	ctx.fillRect(0,0,FIELDX,FIELDY);
	//draw gridlines
	ctx.strokeStyle = 'rgba(25,25,25,0.03)';
	ctx.beginPath();
	for(let i=0;i<Math.floor(FIELDX/TILESIZE);i++){
		for(let j=0;j<Math.floor(FIELDY/TILESIZE);j++){
			ctx.rect(i*TILESIZE,j*TILESIZE,TILESIZE,TILESIZE);
		}
	}
	ctx.stroke();
	//draw array
	ctx.fillStyle = "black";
	for(let i=0;i<Math.floor(FIELDX/TILESIZE);i++){
		for(let j=0;j<Math.floor(FIELDY/TILESIZE);j++){
			if(drawArray[i][j].exists == 1){
				ctx.fillRect(i*TILESIZE,j*TILESIZE,TILESIZE,TILESIZE);
			}
		}
	}
	//write fps
	ctx.font = `12px Tahoma`;
	ctx.fillText(`FPS:${recentFPS}`,0,10);
}
function updateGrid(){
	for(let i=0;i<drawArray.length;i++){
		for(let j=0;j<drawArray[i].length;j++){
			let neighbors = 0;
			neighbors += drawArray[(i-1+drawArray.length)%drawArray.length][(j-1+drawArray[i].length)%drawArray[i].length].exists
			neighbors += drawArray[i][(j-1+drawArray[i].length)%drawArray[i].length].exists
			neighbors += drawArray[(i+1+drawArray.length)%drawArray.length][(j-1+drawArray[i].length)%drawArray[i].length].exists
			neighbors += drawArray[(i-1+drawArray.length)%drawArray.length][j].exists
			neighbors += drawArray[(i+1+drawArray.length)%drawArray.length][j].exists
			neighbors += drawArray[(i-1+drawArray.length)%drawArray.length][(j+1+drawArray[i].length)%drawArray[i].length].exists
			neighbors += drawArray[i][(j+1+drawArray[i].length)%drawArray[i].length].exists
			neighbors += drawArray[(i+1+drawArray.length)%drawArray.length][(j+1+drawArray[i].length)%drawArray[i].length].exists
			if(drawArray[i][j].exists == 1){
				//cell is currently alive
				if(neighbors < 2 || neighbors > 3){
					//kill for underpopulation or over population
					drawArray[i][j].nextFrame = 0;
				}
				if(neighbors == 2 || neighbors == 3){
					drawArray[i][j].nextFrame = 1;
				}
			}
			else{
				if(neighbors == 3){
					drawArray[i][j].nextFrame = 1;
				}
				else{
					drawArray[i][j].nextFrame = 0;
				}
			}
		}
	}
	for(let i=0;i<drawArray.length;i++){
		for(let j=0;j<drawArray[i].length;j++){
			drawArray[i][j].exists = drawArray[i][j].nextFrame;
		}
	}
}
