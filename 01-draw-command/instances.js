var createWindow = require('./sys/createWindow');

var Program      = require('./glu/Program');
var VertexArray  = require('./glu/VertexArray');
var Context      = require('./glu/Context');
var ClearCommand = require('./glu/ClearCommand');
var DrawCommand  = require('./glu/DrawCommand');
var Vec3         = require('./geom/Vec3');
var Mat4         = require('./geom/Mat4');
var Quat         = require('./geom/Quat');

var VERT_SRC = '\
attribute vec3 position; \
attribute vec3 normal; \
uniform mat4 projectionMatrix; \
uniform mat4 viewMatrix; \
uniform mat4 modelMatrix; \
varying vec4 vColor; \
void main() { \
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0); \
  vColor = vec4(normal/2.0 + 0.5, 1.0); \
} \
';

var FRAG_SRC = '\
varying vec4 vColor; \
void main() { \
  gl_FragColor = vColor; \
} \
';

createWindow({
  settings: {
    width: 1280,
    height: 720
  },
  init: function() {
    this.framerate(60);

    var gl = this.gl;

    this.context = new Context(gl);
    this.program = new Program(gl, VERT_SRC, FRAG_SRC);

    this.timeStart = Date.now();
    this.eye = new Vec3(0, 0, 3);
    this.target = new Vec3(0, 0, 0);
    this.up = new Vec3(0, 1, 0);

    var projectionMatrix = new Mat4().perspective(60, this.width/this.height, 0.1, 100).toArray();
    var viewMatrix = this.viewMatrix = new Mat4().lookAt(this.eye, this.target, this.up).toArray();
    this.program.bind();
    this.program.uniforms.projectionMatrix(projectionMatrix);
    this.program.uniforms.viewMatrix(viewMatrix);

    this.mesh = new VertexArray(gl);
    this.mesh.addAttribute('position', [
      [-1, -1,  1], [-1,  1,  1], [ 1,  1,  1], [ 1, -1,  1], //front face
      [-1, -1, -1], [-1,  1, -1], [ 1,  1, -1], [ 1, -1, -1], //back face
      [ 1, -1,  1], [ 1,  1,  1], [ 1,  1, -1], [ 1, -1, -1], //right face
      [-1, -1,  1], [-1,  1,  1], [-1,  1, -1], [-1, -1, -1], //left face
      [-1,  1,  1], [-1,  1, -1], [ 1,  1, -1], [ 1,  1,  1], //top face
      [-1, -1,  1], [-1, -1, -1], [ 1, -1, -1], [ 1, -1,  1]  //bottom face
    ], { size: 3 });
    this.mesh.addAttribute('normal', [
      [ 0,  0,  1], [ 0,  0,  1], [ 0,  0,  1], [ 0,  0,  1], //front face
      [ 0,  0, -1], [ 0,  0, -1], [ 0,  0, -1], [ 0,  0, -1], //back face
      [ 1,  0,  0], [ 1,  0,  0], [ 1,  0,  0], [ 1,  0,  0], //right face
      [-1,  0,  0], [-1,  0,  0], [-1,  0,  0], [-1,  0,  0], //left face
      [ 0,  1,  0], [ 0,  1,  0], [ 0,  1,  0], [ 0,  1,  0], //top face
      [ 0, -1,  0], [ 0, -1,  0], [ 0, -1,  0], [ 0, -1,  0]  //bottom face
    ], { size: 3 });
    this.mesh.addIndexBuffer([
      [ 0,  3,  2], [ 0,  2,  1], //front face
      [ 6,  7,  4], [ 5,  6,  4], //back face
      [ 8, 11, 10], [ 8, 10,  9], //right face
      [14, 15, 12], [13, 14, 12], //left face
      [16, 19, 18], [16, 18, 17], //top face
      [22, 23, 20], [21, 22, 20]  //bottom face
    ]);

    this.commands = [];

    this.commands.push(new ClearCommand({
      color: [0.2, 0.2, 0.2, 1.0],
      depth: true
    }));

    for(var i=0; i<5000; i++) {
      var pos = new Vec3(Math.random()*1-0.5, Math.random()*1-0.5, Math.random()*1-0.5)
      var rotation = Quat.fromDirection(pos.dup().normalize());
      var modelMatrix = new Mat4().translate(pos.x, pos.y, pos.z).mul(rotation.toMat4()).scale(0.2, 0.2, 0.2);
      this.commands.push(new DrawCommand({
        vertexArray: this.mesh,
        program: this.program,
        uniforms: {
          modelMatrix: modelMatrix.toArray()
        },
        renderState: {
          depthTest: {
            enabled: true
          }
        }
      }));
    }
  },
  draw: function() {
    var gl = this.gl;

    console.time('frame');
    for(var i=0; i<this.commands.length; i++) {
      this.context.submit(this.commands[i]);
    }
    this.context.render();
    console.timeEnd('frame');
    console.log('est fps', Math.floor(1000/12));
  }
})
