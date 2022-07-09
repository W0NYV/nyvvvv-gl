window.addEventListener('DOMContentLoaded', () => {

    init();

}, false);

function init() {

    const canvas = getCanvas('webgl-canvas');
    const gl = getGLContext(canvas);

    gl.clearColor(0, 0, 0, 1);

    const program = createProgram(gl);
    const buffers = createRectBuffers(gl);
    draw(gl, program, buffers);

}

function getCanvas(id) {
    const canvas = document.getElementById(id);
    if(!canvas) {
        return null;
    }

    return canvas;
}

function getGLContext(canvas) {
    return canvas.getContext('webgl2') || console.error('WebGL2 is not available in your browser.');
}

function getShader(gl, type) {

    let shaderString, shader;

    if(type === 'vert') {

        const script = document.getElementById('vertex-shader');
        console.log(script);
        shaderString = script.text.trim();
    
        if(script.type === 'x-shader/x-vertex') {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

    } else if(type === 'frag') {

        const script = editor.getSession().getValue();
        shaderString = script.trim();

        shader = gl.createShader(gl.FRAGMENT_SHADER);
    }

    gl.shaderSource(shader, shaderString);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        return null;
    } else {
        console.log("OK");
    }

    return shader;
}

function createProgram(gl) {
    const vs = getShader(gl, 'vert');
    const fs = getShader(gl, 'frag');

    let program = gl.createProgram();

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);

    gl.linkProgram(program);

    if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Could not initialize shaders');
    }

    gl.useProgram(program);

    program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');

    return program;
}

function createRectBuffers(gl) {
    const vertices = [
        -1.0, 1.0, 0,
        -1.0, -1.0, 0,
        1.0, -1.0, 0,
        1.0, 1.0, 0
    ];

    const indices = [0, 1, 2, 0, 2, 3];

    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return [vertexBuffer, indexBuffer, indices];
}

function draw(gl, program, buffers) {
    
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers[0]);
    gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(program.aVertexPosition);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers[1]);

    gl.drawElements(gl.TRIANGLES, buffers[2].length, gl.UNSIGNED_SHORT, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    
}