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

	this.floorflag = 0;
	this.floorx = 0;
	this.floory = 0;
	this.floorz = 0;
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

	makeGeometry : function(indoor) {

		var cells = indoor.primalSpaceFeature;
        //console.log(indoor);
    for(var i = 0; i < cells.length; i++) {
        var cell = [];
        var surfaces = cells[i].geometry;
        for(var j = 0; j < surfaces.length; j++){

						this.transformCoordinates(surfaces[j].exterior);
						this.transformCoordinates(surfaces[j].interior);

            var surface = this.triangulate(surfaces[j].exterior, surfaces[j].interior);
            cell.push(surface);
        }
        CellDictionary[ cells[i].cellid ] = cell;
    }

	},

	createObject : function(indoor) {

		var group = new THREE.Object3D;

		//Add mesh for surfaces of CellSpace
		for (var key in CellDictionary) {
        var surfaces = CellDictionary[key];
        var cell = [];
        for(var j = 0; j < surfaces.length; j++){
            var geometry = new THREE.BufferGeometry();
            var surface = surfaces[j];
            var vertices = new Float32Array( surface );


            geometry.addAttribute('position', new THREE.BufferAttribute( vertices, 3 ) );
						var material = new THREE.MeshStandardMaterial( { color: 0xffff00, opacity:0.3, transparent : true, side: THREE.DoubleSide} );
						var mesh = new THREE.Mesh( geometry, material );

						mesh.name = 'Mesh ' + (key) + (j);

            group.add( mesh );
            cell.push(mesh);
        }
        AllGeometry[key] = cell;
    }


		//Add line for surfaces of CellSpace
		var cells = indoor.primalSpaceFeature;
    for(var i = 0; i < cells.length; i++){
        var surfaces = cells[i].geometry;
        for(var j = 0; j < surfaces.length; j++){
            var polygon = surfaces[j].exterior;
            var material = new THREE.LineBasicMaterial( {color: 0x0000ff} );

            var geometry = new THREE.Geometry();
            for(var k = 0; k < polygon.length; k += 3){
                geometry.vertices.push(new THREE.Vector3( polygon[k], polygon[k + 1], polygon[k + 2]));
            }

            var line = new THREE.Line( geometry, material );
            group.add( line );
            AllGeometry[ cells[i].cellid ].push(line);
            polygon = surfaces[j].interior;
            if(polygon.length != 0){
                geometry = new THREE.Geometry();
                for(var k = 0; k < polygon.length; k += 3){
                    geometry.vertices.push(new THREE.Vector3( polygon[k], polygon[k + 1], polygon[k + 2]));
                }
                var line = new THREE.Line( geometry, material );
                //console.log(polygon);
                group.add( line );
                AllGeometry[ cells[i].cellid ].push(line);
            }
        }
    }

		return group;
	},

	transformCoordinates : function(myvertices) {
      if(this.floorflag != 1) {
          this.floorx = Math.floor(myvertices[0]);
          this.floory = Math.floor(myvertices[1]);
          this.floorz = Math.floor(myvertices[2]);
          this.floorflag = 1;
      }
      for (var i = 0; i < myvertices.length / 3; i++) {
          myvertices[i * 3] /= this.floorx;
          myvertices[i * 3 + 1] /= this.floorx;
          myvertices[i * 3 + 2] /= this.floorx;
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
