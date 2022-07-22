let gl,
    texture,
    beginTime,
    nowTime;

window.addEventListener('DOMContentLoaded', () => {

    const canvas = getCanvas('webgl-canvas');
    resize(canvas);
    
    gl = getGLContext(canvas);

    createTexture(gl, './lib/sea.jpg').then(tex => {
        texture = tex;
        execution();
    });

}, false);

window.addEventListener('resize', () => resize(getCanvas('webgl-canvas')), false);

window.addEventListener('dragover', e => {
    e.stopPropagation();
    e.preventDefault();
});

window.addEventListener('dragleave', e => {
    e.stopPropagation();
    e.preventDefault();
})

window.addEventListener('drop', e => {

    e.stopPropagation();
    e.preventDefault();

    let files = e.dataTransfer.files;
    
    if(files.length > 1) return alert('ONLY 1 FLIE');
    
    const reader = new FileReader();

    reader.onload = e => {
        
        createTexture(gl, e.target.result).then(tex => {
            texture = tex;
        });
    }

    reader.readAsDataURL(files[0]);

}, false);

function execution() {

    beginTime = Date.now();

    if(getShader(gl, 'frag')) {

        gl.clearColor(0, 0, 1, 1);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        const program = createProgram(gl);
        
        const buffers = createRectBuffers(gl);

        function render() {
            requestAnimationFrame(render);
            nowTime = (Date.now() - beginTime) / 1000.0;
            draw(gl, program, buffers, texture);
        }
    
        render();

    }

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
        shaderString = script.text.trim();
    
        if(script.type === 'x-shader/x-vertex') {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

    } else if(type === 'frag') {

        const script = editor.getSession().getValue();
        shaderString = "#version 300 es\n" + script;
        shaderString = shaderString.trim();

        shader = gl.createShader(gl.FRAGMENT_SHADER);
    }

    gl.shaderSource(shader, shaderString);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        return null;
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

    program.time = gl.getUniformLocation(program, 'time');
    program.resolution = gl.getUniformLocation(program, 'resolution');
    program.sampler = gl.getUniformLocation(program, 'sampler');

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

function draw(gl, program, buffers, texture) {

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(program.sampler, 0);
    
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.uniform2fv(program.resolution, [gl.canvas.width, gl.canvas.height]);
    gl.uniform1fv(program.time, [nowTime]);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers[0]);
    gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(program.aVertexPosition);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers[1]);

    gl.drawElements(gl.TRIANGLES, buffers[2].length, gl.UNSIGNED_SHORT, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    
}

function createTexture(gl, path) {

    return new Promise((resolve) => {
        const texture = gl.createTexture();
        const image = new Image();
        image.src = path;
    
        image.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.bindTexture(gl.TEXTURE_2D, null);
            resolve(texture);
        }
    });

}

const resize = (canvas) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
