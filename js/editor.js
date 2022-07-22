let defaultFrag = `precision highp float;

uniform vec2 resolution;
uniform float time;
uniform sampler2D sampler;

out vec4 fragColor;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  uv.y += sin(uv.x*20.0+time)*0.1;
  fragColor = texture(sampler, uv);
}`;

let editor = ace.edit("editor");
// editor.setTheme("ace/theme/terminal");
editor.$blockScrolling = Infinity;
editor.setOptions({
    enableSnippets: true,

    // enableBasicAutocompletion: true,
    // enableLiveAutocompletion: true,
    
    fontSize: "10.5pt"
});

editor.setValue(defaultFrag, 1);
editor.getSession().setTabSize(2);
editor.getSession().setMode("ace/mode/glsl");
editor.setOption("showInvisibles", true);

// editor.getSession().on('change', function() {
//     execution();
// });
