// Generated by CoffeeScript 1.6.2
define(function(require) {
  var Arcball, CameraOrbiterTouch, Color, Config, Context, Cube, Cylinder, Diffuse, Dodecahedron, Edge, Fruit, Gene, Geometry, HexSphere, Icosahedron, Instance, LineBuilder, Mat4, MathUtils, Mesh, Octahedron, PI, PerspectiveCamera, Platform, Quat, RenderTarget, Scene, ScreenImage, ShowDepth, ShowNormals, SolidColor, Sphere, Spline3D, Texture2D, Time, Vec3, Viewport, Window, abs, cos, exp, floor, gh, hem, log, map, max, min, pex, random, randomVec3, seed, sin, sqrt, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;

  pex = require('pex');
  _ref = pex.sys, Window = _ref.Window, Platform = _ref.Platform;
  _ref1 = pex.scene, PerspectiveCamera = _ref1.PerspectiveCamera, Arcball = _ref1.Arcball, Scene = _ref1.Scene;
  _ref2 = pex.materials, SolidColor = _ref2.SolidColor, Diffuse = _ref2.Diffuse, ShowDepth = _ref2.ShowDepth, ShowNormals = _ref2.ShowNormals;
  _ref3 = pex.gl, Mesh = _ref3.Mesh, Texture2D = _ref3.Texture2D, RenderTarget = _ref3.RenderTarget, Viewport = _ref3.Viewport, ScreenImage = _ref3.ScreenImage, Context = _ref3.Context;
  _ref4 = pex.geom, hem = _ref4.hem, Vec3 = _ref4.Vec3, Geometry = _ref4.Geometry, Edge = _ref4.Edge, Mat4 = _ref4.Mat4, Spline3D = _ref4.Spline3D, Quat = _ref4.Quat;
  _ref5 = pex.geom.gen, Cube = _ref5.Cube, Octahedron = _ref5.Octahedron, Sphere = _ref5.Sphere, Dodecahedron = _ref5.Dodecahedron, Icosahedron = _ref5.Icosahedron, LineBuilder = _ref5.LineBuilder, HexSphere = _ref5.HexSphere;
  Color = pex.color.Color;
  _ref6 = pex.utils, Time = _ref6.Time, MathUtils = _ref6.MathUtils;
  map = MathUtils.map, randomVec3 = MathUtils.randomVec3, seed = MathUtils.seed;
  cos = Math.cos, sin = Math.sin, PI = Math.PI, sqrt = Math.sqrt, abs = Math.abs, random = Math.random, floor = Math.floor, min = Math.min, max = Math.max, exp = Math.exp, log = Math.log;
  CameraOrbiterTouch = require('utils/CameraOrbiterTouch');
  Cylinder = require('geom/gen/Cylinder');
  Config = require('flora/game/Config');
  Gene = require('flora/plants/Gene');
  Instance = require('flora/plants/Instance');
  gh = require('geom/gh');
  return Fruit = (function() {
    Fruit.prototype.type = 'fruit';

    function Fruit(app) {
      var _i, _j, _k, _l, _ref10, _ref7, _ref8, _ref9, _results, _results1, _results2, _results3;

      this.app = app;
      this.type = 'fruit';
      this.gl = Context.currentContext.gl;
      this.camera = new PerspectiveCamera(60, this.app.width / this.app.height);
      if (this.app.on) {
        this.cameraController = new CameraOrbiterTouch(this.app, this.camera, 2.5, 45);
      }
      this.genes = {
        bunchiness: new Gene('bunchiness', 0, 0, 3),
        size: new Gene('size', 1, 0.3, 1),
        seeds: new Gene('seeds', 1, 0, 10),
        layers: new Gene('layers', 0, 0, 0.6),
        thickness: new Gene('thickness', 1, 4, 10)
      };
      this.material = new SolidColor({
        color: Config.colors.orange
      });
      this.materialFill = new SolidColor({
        color: Color.Black
      });
      this.darkGoldMaterial = new SolidColor({
        color: Config.secondaryColors.orange
      });
      this.layerMaterial = new SolidColor({
        color: Config.colors.pink
      });
      this.seedMaterial = new SolidColor({
        color: Config.colors.yellow.clone(),
        diffuseColor: Config.colors.yellow.clone(),
        ambientColor: Config.colors.orange,
        wrap: 0
      });
      this.geom = hem().fromGeometry(new Cube(0.6, 0.6, 1)).subdivide().subdivide().subdivide().toFlatGeometry();
      this.mesh = new Mesh(this.geom, this.material, {
        useEdges: true
      });
      this.meshFill = new Mesh(this.geom, this.materialFill);
      this.layerGeom = hem().fromGeometry(new Cube(0.6, 0.6, 1)).subdivide().subdivide().subdivide().toFlatGeometry();
      this.layerMesh = new Mesh(this.layerGeom, this.layerMaterial);
      this.maxFruitsPerBunch = 6;
      this.maxSeedsPerFruit = this.genes.seeds.max;
      this.fruitInstances = (function() {
        _results = [];
        for (var _i = 0, _ref7 = this.genes.bunchiness.max * (5 + this.maxFruitsPerBunch); 0 <= _ref7 ? _i < _ref7 : _i > _ref7; 0 <= _ref7 ? _i++ : _i--){ _results.push(_i); }
        return _results;
      }).apply(this).map(function() {
        return new Instance();
      });
      this.fruitLayerInstances = (function() {
        _results1 = [];
        for (var _j = 0, _ref8 = this.genes.bunchiness.max * (5 + this.maxFruitsPerBunch); 0 <= _ref8 ? _j < _ref8 : _j > _ref8; 0 <= _ref8 ? _j++ : _j--){ _results1.push(_j); }
        return _results1;
      }).apply(this).map(function() {
        return new Instance();
      });
      this.fruitLayerInstances2 = (function() {
        _results2 = [];
        for (var _k = 0, _ref9 = this.genes.bunchiness.max * (5 + this.maxFruitsPerBunch); 0 <= _ref9 ? _k < _ref9 : _k > _ref9; 0 <= _ref9 ? _k++ : _k--){ _results2.push(_k); }
        return _results2;
      }).apply(this).map(function() {
        return new Instance();
      });
      this.seedInstances = (function() {
        _results3 = [];
        for (var _l = 0, _ref10 = this.genes.bunchiness.max * (5 + this.maxFruitsPerBunch) * this.maxSeedsPerFruit; 0 <= _ref10 ? _l < _ref10 : _l > _ref10; 0 <= _ref10 ? _l++ : _l--){ _results3.push(_l); }
        return _results3;
      }).apply(this).map(function() {
        return new Instance();
      });
      this.globeGeom = new HexSphere(6);
      this.globeGeom = hem().fromGeometry(this.globeGeom).triangulate().toFlatGeometry();
      this.globeGeom.computeEdges();
      this.globe = new Mesh(this.globeGeom, this.darkGoldMaterial, {
        useEdges: true
      });
      this.seedGeom = hem().fromGeometry(new Cube(0.3, 0.3, 0.4)).subdivide().subdivide().toFlatGeometry();
      this.seedMesh = new Mesh(this.seedGeom, this.seedMaterial);
      this.genes.thickness.currValue = 0;
      this.genes.layers.currValue = 0;
    }

    Fruit.prototype.rebuild = function() {
      var bunch, bunchFruit, bunchScale, bunchSpreadScaleR, bunchSpreadScaleY, distScale, fruit, fruitIndex, fruitLayer, fruitPositions, fruitScale, fruitTargets, fruitsPerBunch, i, numSeedsPerFruit, offset, seedInstance, seedInstanceIndex, seedScale, _i, _j, _k, _l, _len, _ref10, _ref7, _ref8, _ref9, _results;

      seed(0);
      fruitScale = this.genes.size.value;
      bunchScale = map(fruitScale, this.genes.size.min, this.genes.size.max, 1, 0);
      bunchSpreadScaleR = map(fruitScale, this.genes.size.min, this.genes.size.max, 0.4, 1);
      bunchSpreadScaleY = map(fruitScale, this.genes.size.min, this.genes.size.max, 0.4, 1);
      fruitsPerBunch = 5 + floor(bunchScale * this.maxFruitsPerBunch);
      fruit = this.fruitInstances[0];
      fruit.targetPosition = new Vec3(0, 0, 0);
      fruit.targetRotation.copy(Quat.fromDirection(new Vec3(0, 1, 0)));
      fruit.targetScale.set(fruitScale, fruitScale, fruitScale);
      fruitIndex = 1;
      for (bunch = _i = 0, _ref7 = this.genes.bunchiness.max; 0 <= _ref7 ? _i < _ref7 : _i > _ref7; bunch = 0 <= _ref7 ? ++_i : --_i) {
        fruitPositions = gh.flatten(gh.divide(gh.circle(gh.point(0, 0.2 + 0.4 * bunch * bunchSpreadScaleY - 0.3 * bunchScale, 0), 0.5 * bunchSpreadScaleR), fruitsPerBunch));
        fruitTargets = gh.flatten(gh.divide(gh.circle(gh.point(0, -2 * bunchSpreadScaleR + 0.4 * bunch * bunchSpreadScaleY - 0.3 * bunchScale, 0), 1.5), fruitsPerBunch));
        for (bunchFruit = _j = 0, _ref8 = 5 + this.maxFruitsPerBunch; 0 <= _ref8 ? _j < _ref8 : _j > _ref8; bunchFruit = 0 <= _ref8 ? ++_j : --_j) {
          fruit = this.fruitInstances[fruitIndex++];
          if (!fruit) {
            continue;
          }
          if (bunchFruit > fruitsPerBunch || bunch >= this.genes.bunchiness.intValue) {
            fruit.targetScale.set(0, 0, 0);
          } else {
            fruit.targetRotation.copy(Quat.fromDirection(fruitTargets[(fruitIndex - 1) % fruitsPerBunch]));
            fruit.targetPosition.copy(fruitPositions[(fruitIndex - 1) % fruitsPerBunch]);
            fruit.targetScale.set(fruitScale, fruitScale, fruitScale);
          }
        }
      }
      for (i = _k = 0, _ref9 = this.fruitLayerInstances.length; 0 <= _ref9 ? _k < _ref9 : _k > _ref9; i = 0 <= _ref9 ? ++_k : --_k) {
        fruit = this.fruitInstances[i];
        fruitLayer = this.fruitLayerInstances[i];
        fruitLayer.targetPosition.copy(fruit.targetPosition);
        fruitLayer.targetRotation.copy(fruit.targetRotation);
        fruitLayer.targetScale.copy(fruit.targetScale).scale(0.8);
      }
      seed(0);
      seedInstanceIndex = 0;
      numSeedsPerFruit = this.genes.seeds.intValue;
      _ref10 = this.fruitInstances;
      _results = [];
      for (_l = 0, _len = _ref10.length; _l < _len; _l++) {
        fruit = _ref10[_l];
        _results.push((function() {
          var _m, _ref11, _results1;

          _results1 = [];
          for (i = _m = 0, _ref11 = this.genes.seeds.max; 0 <= _ref11 ? _m < _ref11 : _m > _ref11; i = 0 <= _ref11 ? ++_m : --_m) {
            seedInstance = this.seedInstances[seedInstanceIndex++];
            offset = randomVec3();
            if (i > numSeedsPerFruit || fruit.targetScale.x < 0.001) {
              _results1.push(seedInstance.targetScale.set(0, 0, 0));
            } else {
              distScale = 0;
              seedScale = fruitScale * 1 / numSeedsPerFruit;
              if (this.genes.seeds.normalizedValue > 0.5) {
                distScale = 1;
              }
              seedScale = max(0.1, seedScale * fruit.scale.x);
              seedInstance.targetScale.set(seedScale, seedScale, seedScale);
              seedInstance.targetPosition.copy(fruit.targetPosition).add(offset.scale(fruitScale * 0.7 * distScale));
              _results1.push(seedInstance.targetRotation.copy(fruit.targetRotation));
            }
          }
          return _results1;
        }).call(this));
      }
      return _results;
    };

    Fruit.prototype.animateInstances = function(instances) {
      var instance, instanceIndex, _i, _len, _results;

      _results = [];
      for (instanceIndex = _i = 0, _len = instances.length; _i < _len; instanceIndex = ++_i) {
        instance = instances[instanceIndex];
        _results.push(instance.update());
      }
      return _results;
    };

    Fruit.prototype.update = function() {
      if (this.cameraController) {
        this.cameraController.update();
      }
      this.rebuild();
      this.genes.thickness.currValue += (this.genes.thickness.value - this.genes.thickness.currValue) * 0.1;
      this.genes.layers.currValue += (this.genes.layers.value - this.genes.layers.currValue) * 0.1;
      this.animateInstances(this.fruitInstances);
      this.animateInstances(this.seedInstances);
      return this.animateInstances(this.fruitLayerInstances);
    };

    Fruit.prototype.draw = function(projectionCamera) {
      var camera;

      this.update();
      camera = projectionCamera || this.camera;
      this.gl.enable(this.gl.DEPTH_TEST);
      this.gl.lineWidth(2);
      this.gl.disable(this.gl.BLEND);
      this.globe.draw(camera);
      this.gl.lineWidth(this.genes.thickness.currValue);
      this.material.uniforms.color = Config.colors.yellow;
      this.mesh.drawInstances(camera, this.fruitInstances);
      this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
      this.material.uniforms.color = Config.colors.orange;
      this.gl.lineWidth(2);
      this.meshFill.drawInstances(camera, this.fruitInstances);
      this.gl.depthMask(0);
      this.gl.disable(this.gl.DEPTH_TEST);
      this.gl.lineWidth(5);
      this.layerMesh.material.uniforms.color.a = this.genes.layers.currValue;
      this.seedMaterial.uniforms.color.a = 0.1 + 0.5 * this.genes.seeds.normalizedValue;
      this.gl.enable(this.gl.BLEND);
      this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
      this.layerMesh.drawInstances(camera, this.fruitLayerInstances);
      this.seedMesh.drawInstances(camera, this.seedInstances);
      this.gl.disable(this.gl.BLEND);
      this.gl.depthMask(1);
      this.gl.enable(this.gl.DEPTH_TEST);
      this.gl.lineWidth(2);
      return this.mesh.drawInstances(camera, this.fruitInstances);
    };

    return Fruit;

  })();
});

/*
//@ sourceMappingURL=Fruit.map
*/
