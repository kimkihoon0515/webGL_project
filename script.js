var gl;

const {mat2, mat3, mat4, vec2, vec3, vec4} = glMatrix;  // Now we can use function without glMatrix.~~~
function testGLError(functionLastCalled) {
    /* gl.getError returns the last error that occurred using WebGL for debugging */ 
    var lastError = gl.getError();

    if (lastError != gl.NO_ERROR) {
        alert(functionLastCalled + " failed (" + lastError + ")");
        return false;
    }
    return true;
}

function initialiseGL(canvas) {
    try {
        // Try to grab the standard context. If it fails, fallback to experimental
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        gl.viewport(0, 0, canvas.width, canvas.height);
    }
    catch (e) {
    }

    var drag = false;
    var old_x, old_y;

    var Down = function(e) {

        drag = true;
        old_x = e.pageX;
        old_y = e.pageY;
        e.preventDefault();
        return false;
    };

    var Up = function(e) {
        drag = false;
    };

    var Move = function(e) {
        if (!drag) {
            return false;
        }
        var dX = e.pageX - old_x;
        var dY = e.pageY - old_y;

        yRot += dX * 3 / canvas.width;
        xRot += dY*3 / canvas.height;

        old_x = e.pageX;
        old_y = e.pageY;

        e.preventDefault();
    };

    var wheel = function(e) {
        if(e.deltaY > 0) {
            if(scale[0]> 0.3){
                for(i=0;i<3;i++){
                    scale[i] -= 0.2;
                }
            }
        }
        else {
            if(scale[0] < 1.5){
                for(i=0;i<3;i++){
                    scale[i] += 0.2;
                }
            }
        }
        e.preventDefault();
    };

    canvas.addEventListener("mousedown",Down, false);
    canvas.addEventListener("mouseup", Up, false);
    canvas.addEventListener("mouseout", Up, false);
    canvas.addEventListener("mousemove", Move, false);
    canvas.addEventListener("wheel", wheel, false);

    if (!gl) {
        alert("Unable to initialise WebGL. Your browser may not support it");
        return false;
    }
    return true;
}


var shaderProgram;

function makeCube(sx, sy, sz){
    var x = sx/2;
    var y = sy/2;
    var z = sz/2;
    var vertexData = [
         //Back
          -x, -y, -z,  1.0, 0.0, 0.0, 1.0,  0.0,  0.0,
         x,  y, -z,  1.0, 0.0, 0.0, 1.0,  1.0,  1.0,
         x, -y, -z,  1.0, 0.0, 0.0, 1.0,  1.0,  0.0,
         -x, -y, -z,  1.0, 0.0, 0.0, 1.0,  0.0,  0.0,
          -x,  y, -z,  1.0, 0.0, 0.0, 1.0,  0.0,  1.0,
          x,  y, -z,  1.0, 0.0, 0.0, 1.0,  1.0,  1.0,
      // Front (BLUE/WHITE) -> z = 0.5           
          -x, -y,  z,  0.0, 0.0, 1.0, 1.0,  0.0,  0.0,
           x, -y,  z,  0.0, 0.0, 1.0, 1.0,  1.0,  0.0,
          x,  y,  z,  0.0, 0.0, 1.0, 1.0,  1.0,  1.0,
         -x, -y,  z,  0.0, 0.0, 1.0, 1.0,  0.0,  0.0,
          x,  y,  z,  0.0, 0.0, 1.0, 1.0,  1.0,  1.0, 
         -x,  y,  z,  0.0, 0.0, 1.0, 1.0,  0.0,  1.0,
      // LEFT (GREEN/WHITE) -> z = 0.5                       
         -x, -y, -z,  0.0, 1.0, 0.0, 1.0,  0.0,  0.0,
         -x,  y,  z,  0.0, 1.0, 0.0, 1.0,  1.0,  1.0,
         -x,  y, -z,  0.0, 1.0, 0.0, 1.0,  1.0,  0.0,
         -x, -y, -z,  0.0, 1.0, 0.0, 1.0,  0.0,  0.0,
         -x, -y,  z,  0.0, 1.0, 0.0, 1.0,  0.0,  1.0,
        -x,  y,  z,  0.0, 1.0, 0.0, 1.0,  1.0,  1.0, 
      // RIGHT (YELLOW/WHITE) -> z = 0.5         
          x, -y, -z,  1.0, 1.0, 0.0, 1.0,  0.0,  0.0,
         x,  y, -z,  1.0, 1.0, 0.0, 1.0,  1.0,  0.0,
        x,  y,  z,  1.0, 1.0, 0.0, 1.0,  1.0,  1.0,
        x, -y, -z,  1.0, 1.0, 0.0, 1.0,  0.0,  0.0,
         x,  y,  z,  1.0, 1.0, 0.0, 1.0,  1.0,  1.0, 
         x, -y,  z,  1.0, 1.0, 0.0, 1.0,  0.0,  1.0,
      // BOTTON (MAGENTA/WHITE) -> z = 0.5                   
        -x, -y, -z,  1.0, 0.0, 1.0, 1.0,  0.0,  0.0,
        x, -y, -z,  1.0, 0.0, 1.0, 1.0,  1.0,  0.0,
        x, -y,  z,  1.0, 0.0, 1.0, 1.0,  1.0,  1.0,
       -x, -y, -z,  1.0, 0.0, 1.0, 1.0,  0.0,  0.0,
        x, -y,  z,  1.0, 0.0, 1.0, 1.0,  1.0,  1.0, 
       -x, -y,  z,  1.0, 0.0, 1.0, 1.0,  0.0,  1.0,
        // TOP (CYAN/WHITE) -> z = 0.5                         
        -x,  y, -z,  0.0, 1.0, 1.0, 1.0,  0.0,  0.0,
         x,  y,  z,  0.0, 1.0, 1.0, 1.0,  1.0,  1.0,
        x,  y, -z,  0.0, 1.0, 1.0, 1.0,  1.0,  0.0,
       -x,  y, -z,  0.0, 1.0, 1.0, 1.0,  0.0,  0.0,
       -x,  y,  z,  0.0, 1.0, 1.0, 1.0,  0.0,  1.0,
        x,  y,  z,  0.0, 1.0, 1.0, 1.0,  1.0,  1.0
    ];
    return vertexData;
}




var texture
var image;


function initialiseBuffer() {

    gl.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
    vertexData = makeCube(1.0, 1.0, 1.0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    texture = gl.createTexture();
    image = new Image();
    image.src = "./data/cat.jpg";
    image.addEventListener('load', function () {
        // Now that the image has loaded make copy it to the texture.
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            // Yes, it's a power of 2. Generate mips.
            gl.generateMipmap(gl.TEXTURE_2D);
         } else {
            // No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
         }
    });

    const selectImage = document.getElementById('userImage');

    selectImage.addEventListener('change', function() {
        image.src ="./data/"+ document.getElementById('userImage').files[0].name;
        image.onload = function() {
            if(!isPowerOf2(image.width)||!isPowerOf2(image.height)) {
                alert('Your image size is ' + this.width + ' ?? ' + this.height + ' pixels.' +
                '\n\nOpenGL ES 2.0 and WebGL have only limited NPOT support.' +
                '\n\nPlease upload an image that meets the size of 128 x 128.');
                location.reload(true);
            }
        }
    });


    return testGLError("initialiseBuffers");
}



function initialiseShaders() {

    var fragmentShaderSource = `
			varying highp vec4 col; 
            varying highp vec2 uv;
            uniform sampler2D texture;
			void main(void) 
			{ 
				gl_FragColor = 0.0 * col + 1.0 * texture2D(texture, uv);
			}`;

    gl.fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(gl.fragShader, fragmentShaderSource);
    gl.compileShader(gl.fragShader);
    // Check if compilation succeeded
    if (!gl.getShaderParameter(gl.fragShader, gl.COMPILE_STATUS)) {
        alert("Failed to compile the fragment shader.\n" + gl.getShaderInfoLog(gl.fragShader));
        return false;
    }

    // Vertex shader code
    var vertexShaderSource = `
			attribute highp vec4 myVertex; 
			attribute highp vec4 myColor;
            attribute highp vec2 myUV; 
			uniform mediump mat4 mMat; 
			uniform mediump mat4 vMat; 
			uniform mediump mat4 pMat; 
			varying  highp vec4 col;
            varying mediump vec2 uv;
			void main(void)  
			{ 
				gl_Position = pMat * vMat * mMat * myVertex; 
				gl_PointSize = 8.0;
				col = myColor; 
                uv = myUV;
			}`;

    gl.vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(gl.vertexShader, vertexShaderSource);
    gl.compileShader(gl.vertexShader);
    // Check if compilation succeeded
    if (!gl.getShaderParameter(gl.vertexShader, gl.COMPILE_STATUS)) {
        alert("Failed to compile the vertex shader.\n" + gl.getShaderInfoLog(gl.vertexShader));
        return false;
    }

    // Create the shader program
    gl.programObject = gl.createProgram();
    // Attach the fragment and vertex shaders to it
    gl.attachShader(gl.programObject, gl.fragShader);
    gl.attachShader(gl.programObject, gl.vertexShader);
    // Bind the custom vertex attribute "myVertex" to location 0
    gl.bindAttribLocation(gl.programObject, 0, "myVertex");
    gl.bindAttribLocation(gl.programObject, 1, "myColor");
    gl.bindAttribLocation(gl.programObject, 2, "myUV");
    // Link the program
    gl.linkProgram(gl.programObject);
    // Check if linking succeeded in a similar way we checked for compilation errors
    if (!gl.getProgramParameter(gl.programObject, gl.LINK_STATUS)) {
        alert("Failed to link the program.\n" + gl.getProgramInfoLog(gl.programObject));
        return false;
    }

    gl.useProgram(gl.programObject);

    return testGLError("initialiseShaders");
}

function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
  }


var xRot = 0.0;
var yRot = 0.0;
var zRot = 0.0;
var speedRot = 0.01; 
var scale = [1.0, 1.0, 1.0];

flag_animation = 0; 
function toggleAnimation()
{
	flag_animation ^= 1; 
	console.log("flag_animation=", flag_animation);
}

function speed_scale(a)
{
	speedRot *= a; 
}

var draw_mode = 4; // 4 Triangles, 3 line_strip 0-Points

function fn_draw_mode(a)
{
	draw_mode = a;
}

var fov_degree = 90.0; 
function fn_update_fov(val)
{
	document.getElementById('textFOV').value=val; 
	fov_degree = val; 
}

var mMat, vMat, pMat; 

function renderScene() {

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clearDepth(1);										// Added for depth Test 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);	// Added for depth Test 
	gl.enable(gl.DEPTH_TEST);								// Added for depth Test 

    var mMatLocation = gl.getUniformLocation(gl.programObject, "mMat");
	var vMatLocation = gl.getUniformLocation(gl.programObject, "vMat");
	var pMatLocation = gl.getUniformLocation(gl.programObject, "pMat");
    pMat = mat4.create(); 
	vMat = mat4.create(); 
	mMat = mat4.create(); 
	// mat4.ortho(pMat, -8.0/6.0, 8.0/6.0, -1, 1, -1, 1); 
	// mat4.frustum(pMat, -8.0/6.0, 8.0/6.0, -1, 1, 0.5, 3); 
	mat4.perspective(pMat, fov_degree * 3.141592 / 180.0 , 8.0/6.0 , 0.5, 8); 
	mat4.lookAt(vMat, [0,0,2], [0.0,0.0,0.0], [0,1,0]);
	// console.log(pMat);
	// mat4.translate(mMat, mMat, [0,0,-1]);
	mat4.rotateX(mMat, mMat, xRot);
	mat4.rotateY(mMat, mMat, yRot);
	mat4.rotateZ(mMat, mMat, zRot);
    mat4.scale(vMat, vMat, scale);
	
    var textureLocation = gl.getUniformLocation(gl.programObject, "texture");

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(textureLocation,0);
	
	if (flag_animation == 1)
	{
		xRot = xRot + speedRot;	
		yRot = yRot + speedRot;	
		// zRot = zRot + speedRot;	
    }
	
	gl.uniformMatrix4fv(mMatLocation, gl.FALSE, mMat );
	gl.uniformMatrix4fv(vMatLocation, gl.FALSE, vMat );
	gl.uniformMatrix4fv(pMatLocation, gl.FALSE, pMat );

    if (!testGLError("gl.uniformMatrix4fv")) {
        return false;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 36, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, gl.FALSE, 36, 12);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, gl.FALSE, 36, 28);

    if (!testGLError("gl.vertexAttribPointer")) {
        return false;
    }

	gl.drawArrays(draw_mode, 0, 36); 
	var saveMat = mat4.create();

    if (!testGLError("gl.drawArrays")) {
        return false;
    }

    return true;
}

function main() {
    var canvas = document.getElementById("helloapicanvas");

    if (!initialiseGL(canvas)) {
        return;
    }

    if (!initialiseBuffer()) {
        return;
    }

    if (!initialiseShaders()) {
        return;
    }

	// renderScene();
    // Render loop
    requestAnimFrame = (function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
			function (callback) {
			    window.setTimeout(callback, 1000, 60);
			};
    })();

    (function renderLoop() {
        if (renderScene()) {
            // Everything was successful, request that we redraw our scene again in the future
            requestAnimFrame(renderLoop);
        }
    })();
}