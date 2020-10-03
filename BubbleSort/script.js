class Bar {
    constructor(x,y,width,height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.state = -1; // -1 is for doing nothing, 0 is for currently active, 1 is for swapping, 2 is for sorted
        this.oldX = 0;
        this.oldHeight = 0;
      }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }
    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    getState() {
        return this.state;
    }

    setX(newX) {
        this.oldX = this.x;
        this.x = newX;
    }

    setY(newY) {
        this.y = newY;
    }

    setWidth(newWidth) {
        this.width = newWidth;
    }

    setHeight(newHeight) {
        this.oldHeight = this.height;
        this.height = newHeight;
    }

    setColor(currentState) {
        if(currentState == -1){
            return "black"
        }
        else if (currentState == 0) {
            return "#abcdef"
        }

        else if (currentState == 1) {
            return "#fe4164"
        }
        else if (currentState == 2) {
            return "#009f6b"
        }
        else {
            return "grey"
        }
    }

    updateState(newState) {
        this.state = newState;
        this.redraw();
    }

    clearBar() {
        ctx.clearRect(this.oldX-1, this.y, this.width+1, this.height);
    }

    redraw() {
        ctx.fillStyle = this.setColor(this.state);
        ctx.fillRect(this.x, this.y, this.width-1, this.height);
    }

    draw() {
        ctx.fillStyle = this.setColor(this.state);
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }



}


// Here we are swapping the x position of the bars because bar 2 is bigger then bar 1 in terms of height
function swap_Bar(bar1, bar2) {

    tempX = bar2.getX();
    bar2.setX(bar1.getX());
    bar1.setX(tempX);
    bar2.clearBar()
    bar1.clearBar();
    bar1.updateState(1)
    bar2.updateState(1)
}

function swap_Array_Elements(index1, index2) {
    tempA = randomNumArray[index2];
    randomNumArray[index2] = randomNumArray[index1]
    randomNumArray[index1] = tempA;
}

function set_active(bar1, bar2, newState) {
    bar1.updateState(newState);
    bar2.updateState(newState);
}


function slowSwap() {
    if (checks == 0){
        checks = 1;
        if (randomNumArray[k].getState() == -1 && randomNumArray[k+1].getState() == -1){
            set_active(randomNumArray[k], randomNumArray[k+1],0)

            return;
        }
    }

    else if (checks == 1) {
        checks = 2;
        if (randomNumArray[k].getHeight() > randomNumArray[k+1].getHeight()){
            set_active(randomNumArray[k], randomNumArray[k+1],1)
            swap_Bar(randomNumArray[k], randomNumArray[k+1]);
            swap_Array_Elements(k,k+1);
            return
        }
    }
    //This will increment our counter
    else{
        checks = 0
        if(n < randomNumArray.length){
            set_active(randomNumArray[k], randomNumArray[k+1],-1)
            k = k+1
            if(k >= randomNumArray.length-n-1){
                randomNumArray[k].updateState(2);
                k = 0;
                n= n +1;
            }

        }
        else {
            randomNumArray[k].updateState(2);
            document.getElementById("quickswap").disabled = false;
            clearInterval(slowly)
        }
    }
}


function runSlowSwap() {
    n = 0;
    k = 0;
    document.getElementById("quickswap").disabled = true;
    draw_Bars()
    updateList()
    slowly = setInterval(slowSwap,300)
}

function quickSwap() {
    draw_Bars()
    updateList()
    for (var i = 0; i < randomNumArray.length; i++){
        for (var j = 0; j < randomNumArray.length-1-i; j++) {
            // This is the comparing state

            if (randomNumArray[j].getHeight() > randomNumArray[j+1].getHeight()){
                // This would be the Swapping state
                swap_Bar(randomNumArray[j], randomNumArray[j+1]);
                swap_Array_Elements(j,j+1);

            }
        }
        //This is the sorted state
        randomNumArray[j].updateState(2);
        randomNumArray[j].redraw();
    }
}



function fix_dpi() {
    //get CSS height
    //the + prefix casts it to an integer
    //the slice method gets rid of "px"
    style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
    // //get CSS width
    style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
    //scale the canvas
    canvas.setAttribute('height', style_height * dpi);
    canvas.setAttribute('width', style_width * dpi);
}

// Generates a random number from 70 to 500
function randomNumberGenerator() {
    return num = Math.floor(Math.random() * 500) + 70;
}

// Creates the initial image and fills in our two arrays
function draw_Bars() {
    let barAmount = document.getElementById("randomNumberAmount").value

    updateList()
    fix_dpi()
      randNumArray = [];
      randomNumArray = [];

      let x = 0;
      let y = 0;
      for (i = 0; i < barAmount; i++){
        let num = randomNumberGenerator();
        width = style_width/barAmount
        newBar = new Bar(x,y,width ,num)
        newBar.draw()
        randNumArray.push(num);
        randomNumArray.push(newBar);
        x += width + 1

      }
}

function handleEvent(oEvent) {
    var oTextbox = document.getElementById("randomNumberAmount");
    var key = oEvent.key;
    if (key === 'Enter' || key === 'Enter' || key === 13) {
        runSlowSwap()
    }
}

function updateList() {
    document.getElementById("randomunSortedList").innerHTML = randNumArray;
    document.getElementById("randomSortedList").innerHTML = randNumArray.sort();
}

function showList() {
    updateList()
    var x = document.getElementById("listViews");
    if (x.style.display === "none") {
        x.style.display = "block";
    }
    else {
        x.style.display = "none"
    }
}


//get DPI
let dpi = window.devicePixelRatio;
//get canvas
let canvas = document.getElementById('myCanvas');
//get context
let ctx = canvas.getContext('2d');
let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);

var randomNumArray = [];
var randNumArray = []
var n = 0;
var k = 0;
var slowly;
var checks = 0;
updateList()
