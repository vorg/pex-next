// Generated by CoffeeScript 1.6.2
define(function(require) {
  var Color, PI, Quat, Spline3D, Vec3, Window, cos, map, max, randomFloat, seed, sin, _ref, _ref1;

  Window = require('pex/sys').Window;
  map = require('pex/utils/MathUtils').map;
  PI = Math.PI, sin = Math.sin, cos = Math.cos, max = Math.max;
  Color = require('pex/color').Color;
  _ref = require('pex/geom'), Vec3 = _ref.Vec3, Quat = _ref.Quat, Spline3D = _ref.Spline3D;
  _ref1 = require('pex/utils/MathUtils'), map = _ref1.map, randomFloat = _ref1.randomFloat, seed = _ref1.seed;
  return Window.create({
    settings: {
      width: 1280,
      height: 720,
      type: '2d',
      vsync: true,
      multisample: true,
      fullscreen: false,
      center: true
    },
    init: function() {
      var canvas, paint,
        _this = this;

      canvas = this.canvas, paint = this.paint;
      this.spread = 10;
      this.ridges = 1;
      this.ratioChange = 0.1;
      this.numLines = 12;
      this.randomSeedValue = 0;
      this.on('mouseMoved', function(e) {
        if (e.shift) {
          return _this.ridges = map(e.y, _this.height, 0, 0.5, 2);
        } else {
          _this.spread = map(e.x, 0, _this.width, 0, 180 / _this.numLines);
          return _this.ratioChange = map(e.y, 0, _this.height, 0.05, 1 / (_this.numLines + 1));
        }
      });
      return this.on('leftMouseDown', function(e) {
        return _this.randomSeedValue = Math.random() * 1000;
      });
    },
    drawLine: function(from, to, color, scale) {
      this.paint.setColor(color.r * 255, color.g * 255, color.b * 255, 255);
      this.paint.setStroke();
      this.paint.setFlags(this.paint.kAntiAliasFlag);
      return this.canvas.drawLine(this.paint, from.x * scale, scale - from.y * scale, to.x * scale, scale - to.y * scale);
    },
    drawLeaf: function(ratioChange, spread, ridges, size) {
      var axis, expandedLines, from, i, line, lineColor, lineIndex, numSamplePoints, p, points, ratio, rotation, spline, splineControlPoints, startRatio, to, _i, _j, _k, _l, _len, _len1, _m, _n, _ref2, _ref3, _ref4, _results, _results1,
        _this = this;

      startRatio = 1;
      this.lines = [];
      ratio = startRatio;
      lineColor = Color.Yellow;
      for (i = _i = 0, _ref2 = this.numLines; 0 <= _ref2 ? _i < _ref2 : _i > _ref2; i = 0 <= _ref2 ? ++_i : --_i) {
        from = new Vec3(-0.02, 0, 0);
        to = new Vec3(0, ratio, 0);
        if (i % 2 === 1) {
          to.y *= ridges;
        }
        this.lines.push({
          from: from,
          to: to
        });
        ratio -= ratioChange;
      }
      rotation = new Quat();
      axis = new Vec3(0, 0, 1);
      expandedLines = this.lines.map(function(line, lineIndex) {
        var result;

        rotation.setAxisAngle(axis, spread * lineIndex);
        return result = {
          from: line.from.dup(),
          to: line.to.dup().transformQuat(rotation)
        };
      });
      for (lineIndex = _j = 0, _len = expandedLines.length; _j < _len; lineIndex = ++_j) {
        line = expandedLines[lineIndex];
        if (lineIndex % 2 === 1) {
          lineColor = Color.Orange;
        } else {
          lineColor = Color.Yellow;
        }
        this.drawLine(line.from, line.to, lineColor, size);
      }
      splineControlPoints = expandedLines.map(function(line) {
        return line.to;
      });
      splineControlPoints.push(new Vec3(-0.03, -0.01, 0));
      splineControlPoints.push(new Vec3(-0.01, -0.1, 0));
      splineControlPoints.push(new Vec3(0, -0.2, 0));
      spline = new Spline3D(splineControlPoints);
      numSamplePoints = 50;
      points = (function() {
        _results = [];
        for (var _k = 0; 0 <= numSamplePoints ? _k < numSamplePoints : _k > numSamplePoints; 0 <= numSamplePoints ? _k++ : _k--){ _results.push(_k); }
        return _results;
      }).apply(this).map(function(i) {
        return spline.getPoint(i / (numSamplePoints - 1));
      });
      for (i = _l = 0, _ref3 = numSamplePoints - 1; 0 <= _ref3 ? _l < _ref3 : _l > _ref3; i = 0 <= _ref3 ? ++_l : --_l) {
        this.drawLine(points[i], points[i + 1], Color.Red, size);
      }
      for (_m = 0, _len1 = points.length; _m < _len1; _m++) {
        p = points[_m];
        p.x *= -1;
      }
      _results1 = [];
      for (i = _n = 0, _ref4 = numSamplePoints - 1; 0 <= _ref4 ? _n < _ref4 : _n > _ref4; i = 0 <= _ref4 ? ++_n : --_n) {
        _results1.push(this.drawLine(points[i], points[i + 1], Color.Red, size));
      }
      return _results1;
    },
    draw: function() {
      var leafSize, numLeavesX, numLeavesY, x, y, _i, _results;

      this.canvas.drawColor(40, 40, 40, 255);
      this.drawLine(Vec3.Zero, Vec3.Zero, Color.Red, 0);
      seed(this.randomSeedValue);
      leafSize = 200;
      numLeavesX = Math.floor(this.width / leafSize);
      numLeavesY = Math.floor(this.height / leafSize);
      _results = [];
      for (x = _i = 0; 0 <= numLeavesX ? _i < numLeavesX : _i > numLeavesX; x = 0 <= numLeavesX ? ++_i : --_i) {
        _results.push((function() {
          var _j, _results1;

          _results1 = [];
          for (y = _j = 0; 0 <= numLeavesY ? _j < numLeavesY : _j > numLeavesY; y = 0 <= numLeavesY ? ++_j : --_j) {
            this.canvas.save();
            this.canvas.translate(leafSize / 2 + x * leafSize + (this.width - leafSize * numLeavesX) / 2, leafSize / 2 + y * leafSize + (this.height - leafSize * numLeavesY) / 2 - leafSize * 0.4);
            if (x === 0 && y === 0) {
              this.drawLeaf(this.ratioChange, this.spread, this.ridges, leafSize * 0.5);
            } else {
              this.drawLeaf(randomFloat(0.1, 1 / (this.numLines + 1)), randomFloat(5, 180 / this.numLines), randomFloat(0.5, this.ridges), leafSize * 0.5);
            }
            _results1.push(this.canvas.restore());
          }
          return _results1;
        }).call(this));
      }
      return _results;
    }
  });
});

/*
//@ sourceMappingURL=Leaf.map
*/
