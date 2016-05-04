/**
 * @author mrdoob / http://mrdoob.com/
 */

var Loader = function ( editor ) {

	var scope = this;
	var signals = editor.signals;

	this.texturePath = '';

	this.loadFile = function ( file ) {

		var filename = file.name;
		var extension = filename.split( '.' ).pop().toLowerCase();

		var reader = new FileReader();

		reader.addEventListener( 'progress', function ( event ) {

			var size = '(' + Math.floor( event.total / 1000 ).format() + ' KB)';
			var progress = Math.floor( ( event.loaded / event.total ) * 100 ) + '%';
			console.log( 'Loading', filename, size, progress );

		} );

		switch ( extension ) {

			case 'gml': {

				var socket = io.connect();
				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					socket.once('parse', function(result) {

							console.log("receive json!!");
							var indoor = new Indoor();
							var maxmin_xyz=indoor.init(result);
							console.log("init indoorfeature!!");
							var ic = new SetIndoorGMLCommand();
							ic.makeGeometry(indoor,maxmin_xyz);
							console.log("move center & triangulation!!");
							var object = ic.createObject(indoor);
							console.log("create mesh!!");

							editor.execute( new AddObjectCommand( object ) );

							/*
							var geometry = new THREE.BoxGeometry( 1, 1, 1 );
							var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
							mesh.name = 'Box ';

							editor.execute( new AddObjectCommand( mesh ) );
							*/
					});
					console.log("send file to server!!");
          			socket.emit('content', contents);
					//editor.execute( new SetSceneCommand( result ) );

				}, false );
				reader.readAsText( file );

				break;
			}
			default:

				alert( 'Unsupported file format (' + extension +  ').' );

				break;

		}

	};

	function handleJSON( data, file, filename ) {

		if ( data.metadata === undefined ) { // 2.0

			data.metadata = { type: 'Geometry' };

		}

		if ( data.metadata.type === undefined ) { // 3.0

			data.metadata.type = 'Geometry';

		}

		if ( data.metadata.formatVersion !== undefined ) {

			data.metadata.version = data.metadata.formatVersion;

		}

		switch ( data.metadata.type.toLowerCase() ) {

			case 'buffergeometry':

				var loader = new THREE.BufferGeometryLoader();
				var result = loader.parse( data );

				var mesh = new THREE.Mesh( result );

				editor.execute( new AddObjectCommand( mesh ) );

				break;

			case 'geometry':

				var loader = new THREE.JSONLoader();
				loader.setTexturePath( scope.texturePath );

				var result = loader.parse( data );

				var geometry = result.geometry;
				var material;

				if ( result.materials !== undefined ) {

					if ( result.materials.length > 1 ) {

						material = new THREE.MultiMaterial( result.materials );

					} else {

						material = result.materials[ 0 ];

					}

				} else {

					material = new THREE.MeshStandardMaterial();

				}

				geometry.sourceType = "ascii";
				geometry.sourceFile = file.name;

				var mesh;

				if ( geometry.animation && geometry.animation.hierarchy ) {

					mesh = new THREE.SkinnedMesh( geometry, material );

				} else {

					mesh = new THREE.Mesh( geometry, material );

				}

				mesh.name = filename;

				editor.execute( new AddObjectCommand( mesh ) );

				break;

			case 'object':

				var loader = new THREE.ObjectLoader();
				loader.setTexturePath( scope.texturePath );

				var result = loader.parse( data );

				if ( result instanceof THREE.Scene ) {

					editor.execute( new SetSceneCommand( result ) );

				} else {

					editor.execute( new AddObjectCommand( result ) );

				}

				break;

			case 'scene':

				// DEPRECATED

				var loader = new THREE.SceneLoader();
				loader.parse( data, function ( result ) {

					editor.execute( new SetSceneCommand( result.scene ) );

				}, '' );

				break;

			case 'app':

				editor.fromJSON( data );

				break;

		}

	}

};
