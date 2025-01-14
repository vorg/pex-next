define(["pex/core/Vec3"], function(Vec3) {
  function HEVertex(x, y, z, edge) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.edge = edge;
    this.selected = 0;
  }

  HEVertex.prototype = new Vec3();

  HEVertex.prototype.getNormal = function() {
    var faces = [];

    var edge = this.edge;
    do {
      faces.push(edge.face);
      edge = edge.pair.next;
    } while (edge != this.edge);

    var n = new Vec3(0, 0, 0);
    for(var i in faces) {
      n.add(faces[i].getNormal());
    }
    n.normalize();

    return n;
  }
  
  HEVertex.prototype.forEachFace = function(callback) {
    var faceEdge = this.edge;
    var face = faceEdge.face; 
    do {
      callback(face);
      faceEdge = faceEdge.pair.next;
      face = faceEdge.face;
    } while(faceEdge != this.edge);    
  }
  
  HEVertex.prototype.forEachEdge = function(callback) {
    var faceEdge = this.edge;
    do {
      callback(faceEdge);
      faceEdge = faceEdge.pair.next;
    } while(faceEdge != this.edge);    
  }  
  
  HEVertex.prototype.clearCaches = function() {
    this.edgesCache = null;
  }
  
  HEVertex.prototype.forEachEdgeWithin = function(r, callback) {
    if (this.edgesCache) {
      this.edgesCache.forEach(callback);
      return;
    }
    
    var edges = [this.edge];
    var visited = 0;
    var r2 = r * r;
    
    while(visited < edges.length) {
      var startEdge = edges[visited++];
      var faceEdge = startEdge;
      do {
        var dist = this.subbed(faceEdge.next.vert).lengthSquared();
        if ((edges.indexOf(faceEdge.next) == -1) && (dist < r2)) {
          edges.push(faceEdge.next);
        }
        faceEdge = faceEdge.pair.next;
      } while(faceEdge != startEdge);         
    }
    
    edges.shift(); //remove self
    
    edges.forEach(callback); //iterate with external function
    
    this.edgesCache = edges;
  }
  
  
  HEVertex.prototype.getNeighbors = function(radius) {
    var neighbors = [];
    this.forEachEdge(function(edge) {
      neighbors.push(edge.next.vert);
    })
    return neighbors;
  }

  return HEVertex;
});
