var Camera = require('regl-camera')
var glsl = require('glslify')
var bunny = require('bunny')
var Regl = require('regl')
var regl = Regl()

var camera = Camera(regl)
var draw = regl({
  frag: glsl`
    precision mediump float;
    void main() {
      gl_FragColor = vec4(1, 1, 1, 1);
    }
  `,
  vert: glsl`
    precision mediump float;
    uniform mat4 projection, view;
    attribute vec3 position;
    void main() {
      gl_Position = projection * view * vec4(position, 1);
    }
  `,
  attributes: {
    position: bunny.positions
  },
  elements: bunny.cells
})

regl.frame(function (props) {
  regl.clear({
    color: [0, 0, 0, 1],
    depth: 1
  })

  camera(function () {
    draw()
  })
})
