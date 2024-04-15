const canvas = document.getElementById("playfield");
const ctx = canvas.getContext("2d");

let time_passed = 0;
let weight = [ 0.3,-0.2, 0.7,-0.3, 1.0, 0.2,-0.4, 0.1,-0.6];

// activation information
let activation_type = 0;
let max_activation = 7;
let activation_names = ['Identity','Sine','Power','Absolute','Tangent','Gaussian','Inv Gaussian']
document.addEventListener('keypress', e => {
    const keyname = e.code
    if(keyname == 'Digit1'){
        activation_type = (activation_type - 1 + max_activation) % max_activation;
        document.getElementById('activation_text').innerHTML = `Type: ${activation_names[activation_type]}`;
        fadeOut();
    }
    else if(keyname == 'Digit2'){
        activation_type = (activation_type + 1 + max_activation) % max_activation;
        document.getElementById('activation_text').innerHTML = `Type: ${activation_names[activation_type]}`;
        fadeOut();
    }
});
function fadeOut(){
    let text = document.getElementById('activation_text')
    text.style.opacity = 1;
    let time = 0;
    let total_time = 1000;
    let fade_interval = setInterval(fade, 200);
    function fade(){
        let text = document.getElementById('activation_text');
        let time_change = time/total_time;
        let new_opacity = Math.pow(-time_change,3)+1;
        text.style.opacity = new_opacity;
        time += 200;
        if(new_opacity <= 0){
            clearInterval(fade_interval);
        }
    }
}
// color information
let current_rgb = {
    'r':Math.floor(Math.random()*255),
    'g':Math.floor(Math.random()*255),
    'b':Math.floor(Math.random()*255)
}
let current_bg = {
    'r':Math.floor(Math.random()*255),
    'g':Math.floor(Math.random()*255),
    'b':Math.floor(Math.random()*255)
}
let target_rgb = {
    'r':current_rgb.r,
    'g':current_rgb.g,
    'b':current_rgb.b
}
let target_bg = {
    'r':current_bg.r,
    'g':current_bg.g,
    'b':current_bg.b
}

// changes the color stored in global variable
function change_color(){
    target_rgb.r = Math.floor(Math.random()*255);
    target_rgb.g = Math.floor(Math.random()*255);
    target_rgb.b = Math.floor(Math.random()*255);
    target_bg.r = 255 - target_rgb.r;
    target_bg.g = 255 - target_rgb.g;
    target_bg.b = 255 - target_rgb.b;
}
function tween_color(){
    if (current_rgb.r != target_rgb.r) current_rgb.r += ((target_rgb.r - current_rgb.r)/Math.abs(target_rgb.r - current_rgb.r));
    if (current_rgb.g != target_rgb.g) current_rgb.g += ((target_rgb.g - current_rgb.g)/Math.abs(target_rgb.g - current_rgb.g));
    if (current_rgb.b != target_rgb.b) current_rgb.b += ((target_rgb.b - current_rgb.b)/Math.abs(target_rgb.b - current_rgb.b));
    if (current_bg.r != target_bg.r) current_bg.r += ((target_bg.r - current_bg.r)/Math.abs(target_bg.r - current_bg.r));
    if (current_bg.g != target_bg.g) current_bg.g += ((target_bg.g - current_bg.g)/Math.abs(target_bg.g - current_bg.g));
    if (current_bg.b != target_bg.b) current_bg.b += ((target_bg.b - current_bg.b)/Math.abs(target_bg.b - current_bg.b));
    document.body.style.backgroundColor = `rgb(${current_bg.r},${current_bg.g},${current_bg.b})`;
}
// randomizes current weights
function change_weight(){
    for(let i=0;i<weight.length;i++){
        weight[i] = (Math.random()*2)-1;
    }
}

// field parameters
const SPEED = 1;
const FIELD_X = canvas.width;
const FIELD_Y = canvas.height;
let tile_size = 2;

// cell array
const cells = new Array(Math.floor(FIELD_X/tile_size));
function generate_cells(){
    for(let i=0;i<cells.length;i++){
        cells[i] = new Array(FIELD_Y/tile_size);
        for(let j=0;j<cells[i].length;j++){
            let value = (Math.random()*2)-1;
            cells[i][j] = {'value':value,'next':0};
        }
    }
}

function init(){
    generate_cells();
    frame();
}

function update_cells(){
    for(let i=0;i<cells.length;i++){
        for(let j=0;j<cells[i].length;j++){
            let value = 0;
            value += cells[(i-1+cells.length)%cells.length][(j-1+cells.length)%cells.length].value * weight[0] // top left
            value += cells[i][(j-1+cells.length)%cells.length].value * weight[1] // top center
            value += cells[(i+1+cells.length)%cells.length][(j-1+cells.length)%cells.length].value * weight[2] // top right
            value += cells[(i-1+cells.length)%cells.length][j].value * weight[3] // right
			value += cells[i][j].value * weight[4] // mid
            value += cells[(i+1+cells.length)%cells.length][j].value * weight[5] //left
            value += cells[(i-1+cells.length)%cells.length][(j+1+cells.length)%cells.length].value * weight[6] // bottom left
            value += cells[i][(j+1+cells.length)%cells.length].value * weight[7] // bottom center
            value += cells[(i+1+cells.length)%cells.length][(j+1+cells.length)%cells.length].value * weight[8] // bottom right
            
            value = activate(value, activation_type);

            if(value > 1) value = 1;
            else if(value < 0) value = 0;
            value = Math.round(value*100)/100;
            cells[i][j].next = value;
        }
    }
    let solid_screen = true;
    let last = cells[0][0].next;
    for(let i=0;i<cells.length;i++){
        for(let j=0;j<cells[i].length;j++){
            cells[i][j].value = cells[i][j].next
            if(solid_screen && last != cells[i][j].value){
                solid_screen = false;
            }
        }
    }
    if(solid_screen){
        generate_cells();
        change_weight();
        change_color();
    }
}

function draw(){
    ctx.fillStyle = `rgb(${current_bg.r},${current_bg.g},${current_bg.b})`;
    ctx.fillRect(0,0,FIELD_X,FIELD_Y);
    for(let i=0;i<cells.length;i++){
        for(let j=0;j<cells[i].length;j++){
            // this might be interesting to modify
            if(cells[i][j].value > 0){
                ctx.fillStyle = `rgba(${current_rgb.r},${current_rgb.g},${current_rgb.b},${cells[i][j].value + 0.3})`;
                ctx.fillRect(i*tile_size,j*tile_size,tile_size,tile_size);
            }
        }
    }
}
// call animation frame
function frame(){
    update_cells();
    tween_color();
    draw();
    time_passed++;
    if(time_passed>Math.floor(Math.random()*300)+300){
        change_color();
        change_weight();
        time_passed = 0;
    }
    window.requestAnimationFrame(frame);
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