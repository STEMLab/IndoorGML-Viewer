/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param scene containing children to import
 * @constructor
 */

var SetIndoorGMLCommand = function () {

	this.type = 'SetIndoorGMLCommand';
	this.name = 'Set IndoorGML';

	this.scale = 0;
	this.translate = [];
};
 
SetIndoorGMLCommand.prototype = {

	execute: function () {

		this.editor.signals.sceneGraphChanged.active = false;

		for ( var i = 0; i < this.cmdArray.length; i ++ ) {

			this.cmdArray[ i ].execute();

		}

		this.editor.signals.sceneGraphChanged.active = true;
		this.editor.signals.sceneGraphChanged.dispatch();

	},

  calCenter : function(maxmin_xyz) {
      var boundingBoxLength = [maxmin_xyz[0] - maxmin_xyz[3], maxmin_xyz[1] - maxmin_xyz[4], maxmin_xyz[2] - maxmin_xyz[5]];
      var maxLength = Math.max(boundingBoxLength[0], boundingBoxLength[1], boundingBoxLength[2]);
      this.scale = 20 / maxLength;
      this.translate = [-(boundingBoxLength[0] / 2) - maxmin_xyz[3], -(boundingBoxLength[1] / 2) - maxmin_xyz[4], -maxmin_xyz[5]];
 
  },

	makeGeometry : function(indoor, maxmin_xyz) {

		var cells = indoor.primalSpaceFeature;
    
    this.calCenter(maxmin_xyz);
    for(var i = 0; i < cells.length; i++) {
        var cell = [];
        var surfaces = cells[i].geometry;
        for(var j = 0; j < surfaces.length; j++) {

						this.transformCoordinates(surfaces[j].exterior);
						this.transformCoordinates(surfaces[j].interior);

            var surface = this.triangulate(surfaces[j].exterior, surfaces[j].interior);
            //cell.push(surface);
            cell = cell.concat(surface);
        }
        CellDictionary[ cells[i].cellid ] = cell;
    }

    var cellboundary = indoor.cellSpaceBoundaryMember;
    
      for(var j = 0; j < cellboundary.length; j++) {
        if(cellboundary[0].geometry.length == 1) {
          this.transformCoordinates(cellboundary[j].geometry[0].exterior);
          var surface = this.triangulate(cellboundary[j].geometry[0].exterior, []);
        }
        else {
          this.transformCoordinates(cellboundary[j].geometry);
          var surface = this.triangulate(cellboundary[j].geometry, []);
        }
        BoundaryDictionary[ cellboundary[j].cellBoundaryid ] = surface;
        BoundaryInformation[ cellboundary[j].cellBoundaryid ] = cellboundary[j];
      }
    

   
    
    
    var graphs = indoor.multiLayeredGraph;

    for(var i = 0; i < graphs.length; i++){
        var graph = [];
        var nodes = {};
        var states = graphs[i].stateMember;
        for(var j = 0; j < states.length; j++){
            this.transformCoordinates(states[j].position);
            var state = states[j].position;
            nodes[states[j].stateid] = state;
            StateInformation[states[j].stateid] = states[j];
        }
        graph.push(nodes);

        var edges = {};
        var trasitions = graphs[i].transitionMember;
        for(var j = 0; j < trasitions.length; j++){
            this.transformCoordinates(trasitions[j].line);
            var trasition = trasitions[j].line;
            edges[trasitions[j].transitionid] = trasition;
            TransitionInformation[trasitions[j].transitionid] = trasitions[j];
        }
        graph.push(edges);

        NetworkDictionary[graphs[i].graphid] = graph;

    }
    //console.log(CellDictionary);
	},

	createObject : function(indoor) {

		var group = new THREE.Object3D;
    group.name = 'IndoorFeatures';

    var primalSpaceFeatures = new THREE.Object3D;
    primalSpaceFeatures.name = 'PrimalSpaceFeatures';

    var cellSpace = new THREE.Object3D;
    cellSpace.name = 'CellSpace';
    //console.log(indoor);
		var cells = indoor.primalSpaceFeature;
    for(var i = 0; i < cells.length; i++){        
        var key = cells[i].cellid;
        var cellgroup = new THREE.Object3D;
        cellgroup.name = key;
        var cell = CellDictionary[key];


        var geometry = new THREE.BufferGeometry();
        var vertices = new Float32Array( cell );


        geometry.addAttribute('position', new THREE.BufferAttribute( vertices, 3 ) );
        var material = new THREE.MeshStandardMaterial( { color: 0xffff00, opacity:0.3, transparent : true, side: THREE.DoubleSide} );
        var mesh = new THREE.Mesh( geometry, material );

        cellgroup.add(mesh);

        var surfaces = cells[i].geometry;
        for(var j = 0; j < surfaces.length; j++){
            var polygon = surfaces[j].exterior;
            var material = new THREE.LineBasicMaterial( {color: 0x0000ff} );

            var geometry = new THREE.Geometry();
            for(var k = 0; k < polygon.length; k += 3){
                geometry.vertices.push(new THREE.Vector3( polygon[k], polygon[k + 1], polygon[k + 2]));
            }

            var line = new THREE.Line( geometry, material );
            cellgroup.add(line);
            polygon = surfaces[j].interior;
            if(polygon.length != 0){
                geometry = new THREE.Geometry();
                for(var k = 0; k < polygon.length; k += 3){
                    geometry.vertices.push(new THREE.Vector3( polygon[k], polygon[k + 1], polygon[k + 2]));
                }
                var line = new THREE.Line( geometry, material );
                cellgroup.add(line);
            }
        }
        cellSpace.add(cellgroup);
        AllGeometry[key] = cellgroup;
        Information[cells[i].cellid] = cells[i];
    }
    primalSpaceFeatures.add(cellSpace);
    
    var cellSpaceBoundary = new THREE.Object3D;
    cellSpaceBoundary.name = 'CellSpaceBoundary';
    for(var key in BoundaryDictionary) {
      var cellSpaceBoundaryMember = new THREE.Object3D;
      cellSpaceBoundaryMember.name = key;
      var geometry = new THREE.BufferGeometry();
      var vertices = new Float32Array( BoundaryDictionary[key] );
      geometry.addAttribute('position', new THREE.BufferAttribute( vertices, 3 ) );
      var material = new THREE.MeshBasicMaterial( { color: 0x00ffff, opacity:0.3, transparent : true, side: THREE.DoubleSide} );
      var mesh = new THREE.Mesh( geometry, material );

      cellSpaceBoundaryMember.add( mesh );
      AllGeometry[key] = cellSpaceBoundaryMember;
      cellSpaceBoundary.add( cellSpaceBoundaryMember );
    }
    primalSpaceFeatures.add( cellSpaceBoundary );
    group.add( primalSpaceFeatures );
    var MultiLayeredGraph = new THREE.Object3D;
    MultiLayeredGraph.name = 'MultiLayeredGraph';
    

    var geometry = new THREE.SphereBufferGeometry( 0.03, 32, 16 );
    var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    for(var key in NetworkDictionary){
      var spaceLayers = new THREE.Object3D;
      spaceLayers.name = "SpaceLayer : " + key;
      //var g=[];
      var nodes = NetworkDictionary[key][0];
      var node = new THREE.Object3D;
      node.name = "nodes";
      for(var i in nodes){
          var mesh = new THREE.Mesh( geometry, material );
          mesh.position.x = nodes[i][0];
          mesh.position.y = nodes[i][1];
          mesh.position.z = nodes[i][2];
          var stategroup = new THREE.Object3D;
          stategroup.name = i;
          stategroup.add( mesh );
          //mesh.name = i;
          node.add( stategroup );
          AllGeometry[i] = stategroup;
          //spaceLayers.add(mesh);
          //g.push(mesh);
      }
      spaceLayers.add(node);
      var edges = NetworkDictionary[key][1];
      var edge = new THREE.Object3D;
      edge.name = "edges";
      var linematerial = new THREE.LineBasicMaterial( { color: 0x00ffff, linewidth:1 } );

      for(var i in edges) {
          geometry = new THREE.Geometry();
          for(var k = 0; k < edges[i].length; k += 3){
              geometry.vertices.push(new THREE.Vector3( edges[i][k], edges[i][k + 1], edges[i][k + 2]));
          }
          var line = new THREE.Line( geometry, linematerial );
          //line.name = i;
          //spaceLayers.add(line);
          var edgegroup = new THREE.Object3D;
          edgegroup.name = i;
          edgegroup.add(line);
          AllGeometry[i] = edgegroup;
          edge.add(edgegroup);
          //g.push(line);
      }
      spaceLayers.add(edge);
      AllGeometry[key] = spaceLayers;
      MultiLayeredGraph.add(spaceLayers);
    }
    group.add(MultiLayeredGraph);
    //console.log(group);

		return group;
	},

	transformCoordinates : function(myvertices) {
        for (var i = 0; i < myvertices.length / 3; i++) {
          myvertices[i * 3] = (myvertices[i * 3] +this.translate[0]) * this.scale;
          myvertices[i * 3 + 1] = (myvertices[i * 3 + 1] +this.translate[1]) * this.scale;
          myvertices[i * 3 + 2] = (myvertices[i * 3 + 2] +this.translate[2]) * this.scale;
      }

      for (var i = 0; i < myvertices.length / 3; i++) {
          myvertices[i * 3] = Math.floor( myvertices[i * 3] * 1000000000) / 1000000000
          myvertices[i * 3 + 1] = Math.floor( myvertices[i * 3 + 1] * 1000000000) / 1000000000
          myvertices[i * 3 + 2] = Math.floor( myvertices[i * 3 + 2] * 1000000000) / 1000000000
      }
  },

	calVector : function (myvertices) {
      var vecx = [myvertices[3] - myvertices[0] , myvertices[6] - myvertices[0]];
      var vecy = [myvertices[4] - myvertices[1] , myvertices[7] - myvertices[1]];
      var vecz = [myvertices[5] - myvertices[2] , myvertices[8] - myvertices[2]];

			var nx = Math.abs(vecy[0] * vecz[1] - vecz[0] * vecy[1]);
      var ny = Math.abs(-(vecx[0] * vecz[1] - vecz[0] * vecx[1]));
      var nz = Math.abs(vecx[0] * vecy[1] - vecy[0] * vecx[1]);

			return [nx, ny, nz];
  },

	triangulate :  function (myvertices, interior) {
			var partition = [];
      var newmyvertices = [];
      var newinterior = [];

			var vector = this.calVector(myvertices);

			var nx = vector[0];
			var ny = vector[1];
			var nz = vector[2];

			var max = Math.max(nx, ny, nz);

			if(nz == max){
          for(var i = 0; i < myvertices.length / 3; i++) {
              newmyvertices.push(myvertices[i * 3]);
              newmyvertices.push(myvertices[i * 3 + 1]);
          }

          for(var i = 0; i < interior.length / 3; i++) {
              newinterior.push(interior[i * 3]);
              newinterior.push(interior[i * 3 + 1]);
          }
      }
      else if(nx == max){
          for(var i = 0; i < myvertices.length / 3; i++) {
              newmyvertices.push(myvertices[i * 3 + 1]);
              newmyvertices.push(myvertices[i * 3 + 2]);
          }
          for(var i = 0; i < interior.length / 3; i++) {
              newinterior.push(interior[i * 3 + 1]);
              newinterior.push(interior[i * 3 + 2]);
          }
      }
      else {
          for(var i = 0; i < myvertices.length / 3; i++) {
              newmyvertices.push(myvertices[i * 3]);
              newmyvertices.push(myvertices[i * 3 + 2]);
          }
          for(var i = 0; i < interior.length / 3; i++) {
              newinterior.push(interior[i * 3]);
              newinterior.push(interior[i * 3 + 2]);
          }
      }

			var interiorStartIndex = (newmyvertices.length / 2) - 1;
      var polygonwithhole = newmyvertices.concat(newinterior);

			var triangle = earcut(polygonwithhole, [interiorStartIndex]);

			var concatVertices = myvertices.concat(interior);


      for(var i = 0; i < triangle.length; i++) {
          partition.push(concatVertices[triangle[i] * 3]);
          partition.push(concatVertices[triangle[i] * 3 + 1]);
          partition.push(concatVertices[triangle[i] * 3 + 2]);
      }
			
			return partition;
	}

};
