/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param object THREE.Object3D
 * @param newGeometry THREE.Geometry
 * @constructor
 */

var SetGeometryListCommand = function ( newGeometry ) {

	Command.call( this );

	this.type = 'SetGeometryListCommand';
	this.name = 'Set Geometry List';
	this.updatable = true;
	this.object = undefined;
	this.oldGeometry = undefined;
	this.newGeometry = newGeometry;

};

SetGeometryListCommand.prototype = {

	execute: function () {
		var i;
		for(i in AllGeometry) {
 			var nodes = AllGeometry[i].children[0].children;
 			for(var j = 0;j < nodes.length;j++){
 				nodes[j].children[0].geometry.dispose();
 				nodes[j].children[0].geometry = this.newGeometry;
 				nodes[j].children[0].geometry.computeBoundingSphere();
 			}

 		}

		this.editor.signals.geometryChanged.dispatch( AllGeometry[i] );
		this.editor.signals.sceneGraphChanged.dispatch();

	},

	undo: function () {

		this.object.geometry.dispose();
		this.object.geometry = this.oldGeometry;
		this.object.geometry.computeBoundingSphere();

		this.editor.signals.geometryChanged.dispatch( this.object );
		this.editor.signals.sceneGraphChanged.dispatch();

	},

	update: function ( cmd ) {

		this.newGeometry = cmd.newGeometry;

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );

		output.objectUuid = this.object.uuid;
		output.oldGeometry = this.object.geometry.toJSON();
		output.newGeometry = this.newGeometry.toJSON();

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.object = this.editor.objectByUuid( json.objectUuid );

		this.oldGeometry = parseGeometry( json.oldGeometry );
		this.newGeometry = parseGeometry( json.newGeometry );

		function parseGeometry ( data ) {

			var loader = new THREE.ObjectLoader();
			return loader.parseGeometries( [ data ] )[ data.uuid ];

		}

	}

};
