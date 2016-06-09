/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Object = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setBorderTop( '0' );
	container.setPaddingTop( '5px' );
	container.setDisplay( 'none' );
	

	// type

	var objectTypeRow = new UI.Row();
	var objectType = new UI.Text();
	var property1=new UI.Text( 'ID' ).setWidth( '90px' );
	objectTypeRow.add( property1 );
	objectTypeRow.add( objectType );

	container.add( objectTypeRow );

	// uuid

	var objectNameRow = new UI.Row();
	var objectName = new UI.Text().setWidth( '115px' );
	var property2 = new UI.Text( 'Name' ).setWidth( '90px' );

	objectNameRow.add( property2 );
	objectNameRow.add( objectName );

	container.add( objectNameRow );

	var objectWeightRow = new UI.Row();
	var objectWeight = new UI.Text().setWidth( '115px' );

	objectWeightRow.add( new UI.Text( 'Weight' ).setWidth( '90px' ) );
	objectWeightRow.add( objectWeight );

	container.add( objectWeightRow );

	var objectConnectsRow = new UI.Row();
	var objectConnects = new  UI.Select().setFontSize( '11px' );
	objectConnects.onClick( function ( event ) {
 
 		event.stopPropagation(); // Avoid panel collapsing

 	} );
	objectConnects.onChange( function ( event ) {
 
		var id = this.getValue();
		id = id.substr( 1, id.length );
		var object = AllGeometry[id];
		editor.select(object);
		signals.sceneGraphChanged.dispatch();
 
 	} );
	objectConnectsRow.add( new UI.Text( 'Connects' ).setWidth( '90px' ) );
	objectConnectsRow.add( objectConnects );

	container.add( objectConnectsRow );


 	



	var objectDualityRow = new UI.Row();
	var property3 = new UI.Text( 'Duality' ).setWidth( '90px' );
	var objectDuality = new UI.Button( ).onClick( function () {
		var id = this.getLabel();
		id = id.substr( 1, id.length );
		var object = AllGeometry[id];
		editor.select(object);
		signals.sceneGraphChanged.dispatch();
		//substr( 1, property.length )
	} );

	
	objectDualityRow.add( property3 );
	objectDualityRow.add( objectDuality );

	container.add( objectDualityRow );

	
	/*var objectActions = new UI.Select().setPosition( 'absolute' ).setRight( '8px' ).setFontSize( '11px' );
	objectActions.setOptions( {

		'Actions': 'Actions',
		'Reset Position': 'Reset Position',
		'Reset Rotation': 'Reset Rotation',
		'Reset Scale': 'Reset Scale'

	} );
	objectActions.onClick( function ( event ) {

		event.stopPropagation(); // Avoid panel collapsing

	} );
	objectActions.onChange( function ( event ) {

		var object = editor.selected;

		switch ( this.getValue() ) {

			case 'Reset Position':
				editor.execute( new SetPositionCommand( object, new THREE.Vector3( 0, 0, 0 ) ) );
				break;

			case 'Reset Rotation':
				editor.execute( new SetRotationCommand( object, new THREE.Euler( 0, 0, 0 ) ) );
				break;

			case 'Reset Scale':
				editor.execute( new SetScaleCommand( object, new THREE.Vector3( 1, 1, 1 ) ) );
				break;

		}

		this.setValue( 'Actions' );

	} );*/
	 //container.addStatic( objectActions );
	//container.add( objectActions );
	/*
	// parent

	var objectParentRow = new UI.Row();
	var objectParent = new UI.Select().setWidth( '150px' ).setFontSize( '12px' ).onChange( update );

	objectParentRow.add( new UI.Text( 'Parent' ).setWidth( '90px' ) );
	objectParentRow.add( objectParent );

	container.add( objectParentRow );
	*/

	// position

	var objectPositionRow = new UI.Row();
	var objectPositionX = new UI.Number().setWidth( '50px' ).onChange( update );
	var objectPositionY = new UI.Number().setWidth( '50px' ).onChange( update );
	var objectPositionZ = new UI.Number().setWidth( '50px' ).onChange( update );

	objectPositionRow.add( new UI.Text( 'Position' ).setWidth( '90px' ) );
	objectPositionRow.add( objectPositionX, objectPositionY, objectPositionZ );

	//container.add( objectPositionRow );

	// rotation

	var objectRotationRow = new UI.Row();
	var objectRotationX = new UI.Number().setWidth( '50px' ).onChange( update );
	var objectRotationY = new UI.Number().setWidth( '50px' ).onChange( update );
	var objectRotationZ = new UI.Number().setWidth( '50px' ).onChange( update );

	objectRotationRow.add( new UI.Text( 'Rotation' ).setWidth( '90px' ) );
	objectRotationRow.add( objectRotationX, objectRotationY, objectRotationZ );

	//container.add( objectRotationRow );

	// scale

	var objectScaleRow = new UI.Row();
	var objectScaleLock = new UI.Checkbox( true ).setPosition( 'absolute' ).setLeft( '75px' );
	var objectScaleX = new UI.Number( 1 ).setRange( 0.01, Infinity ).setWidth( '50px' ).onChange( updateScaleX );
	var objectScaleY = new UI.Number( 1 ).setRange( 0.01, Infinity ).setWidth( '50px' ).onChange( updateScaleY );
	var objectScaleZ = new UI.Number( 1 ).setRange( 0.01, Infinity ).setWidth( '50px' ).onChange( updateScaleZ );

	objectScaleRow.add( new UI.Text( 'Scale' ).setWidth( '90px' ) );
	objectScaleRow.add( objectScaleLock );
	objectScaleRow.add( objectScaleX, objectScaleY, objectScaleZ );

	//container.add( objectScaleRow );

	// fov

	var objectFovRow = new UI.Row();
	var objectFov = new UI.Number().onChange( update );

	objectFovRow.add( new UI.Text( 'Fov' ).setWidth( '90px' ) );
	objectFovRow.add( objectFov );

	container.add( objectFovRow );

	// near

	var objectNearRow = new UI.Row();
	var objectNear = new UI.Number().onChange( update );

	objectNearRow.add( new UI.Text( 'Near' ).setWidth( '90px' ) );
	objectNearRow.add( objectNear );

	container.add( objectNearRow );

	// far

	var objectFarRow = new UI.Row();
	var objectFar = new UI.Number().onChange( update );

	objectFarRow.add( new UI.Text( 'Far' ).setWidth( '90px' ) );
	objectFarRow.add( objectFar );

	container.add( objectFarRow );

	// intensity

	var objectIntensityRow = new UI.Row();
	var objectIntensity = new UI.Number().setRange( 0, Infinity ).onChange( update );

	objectIntensityRow.add( new UI.Text( 'Intensity' ).setWidth( '90px' ) );
	objectIntensityRow.add( objectIntensity );

	container.add( objectIntensityRow );

	// color

	var objectColorRow = new UI.Row();
	var objectColor = new UI.Color().onChange( update );

	objectColorRow.add( new UI.Text( 'Color' ).setWidth( '90px' ) );
	objectColorRow.add( objectColor );

	container.add( objectColorRow );

	// ground color

	var objectGroundColorRow = new UI.Row();
	var objectGroundColor = new UI.Color().onChange( update );

	objectGroundColorRow.add( new UI.Text( 'Ground color' ).setWidth( '90px' ) );
	objectGroundColorRow.add( objectGroundColor );

	container.add( objectGroundColorRow );

	// distance

	var objectDistanceRow = new UI.Row();
	var objectDistance = new UI.Number().setRange( 0, Infinity ).onChange( update );

	objectDistanceRow.add( new UI.Text( 'Distance' ).setWidth( '90px' ) );
	objectDistanceRow.add( objectDistance );

	container.add( objectDistanceRow );

	// angle

	var objectAngleRow = new UI.Row();
	var objectAngle = new UI.Number().setPrecision( 3 ).setRange( 0, Math.PI / 2 ).onChange( update );

	objectAngleRow.add( new UI.Text( 'Angle' ).setWidth( '90px' ) );
	objectAngleRow.add( objectAngle );

	container.add( objectAngleRow );

	// penumbra

	var objectPenumbraRow = new UI.Row();
	var objectPenumbra = new UI.Number().setRange( 0, 1 ).onChange( update );

	objectPenumbraRow.add( new UI.Text( 'Penumbra' ).setWidth( '90px' ) );
	objectPenumbraRow.add( objectPenumbra );

	container.add( objectPenumbraRow );

	// decay

	var objectDecayRow = new UI.Row();
	var objectDecay = new UI.Number().setRange( 0, Infinity ).onChange( update );

	objectDecayRow.add( new UI.Text( 'Decay' ).setWidth( '90px' ) );
	objectDecayRow.add( objectDecay );

	container.add( objectDecayRow );

	// shadow

	var objectShadowRow = new UI.Row();

	objectShadowRow.add( new UI.Text( 'Shadow' ).setWidth( '90px' ) );

	var objectCastShadow = new UI.THREE.Boolean( false, 'cast' ).onChange( update );
	objectShadowRow.add( objectCastShadow );

	var objectReceiveShadow = new UI.THREE.Boolean( false, 'receive' ).onChange( update );
	objectShadowRow.add( objectReceiveShadow );

	var objectShadowRadius = new UI.Number( 1 ).onChange( update );
	objectShadowRow.add( objectShadowRadius );

	//container.add( objectShadowRow );

	
	var timeout;

	var objectUserDataRow = new UI.Row();
	var objectUserData = new UI.TextArea().setWidth( '150px' ).setHeight( '40px' ).setFontSize( '12px' ).onChange( update );
	objectUserData.onKeyUp( function () {

		try {

			JSON.parse( objectUserData.getValue() );

			objectUserData.dom.classList.add( 'success' );
			objectUserData.dom.classList.remove( 'fail' );

		} catch ( error ) {

			objectUserData.dom.classList.remove( 'success' );
			objectUserData.dom.classList.add( 'fail' );

		}

	} );

	objectUserDataRow.add( new UI.Text( 'User data' ).setWidth( '90px' ) );
	objectUserDataRow.add( objectUserData );

	//container.add( objectUserDataRow );


	//

	function updateScaleX() {

		var object = editor.selected;

		if ( objectScaleLock.getValue() === true ) {

			var scale = objectScaleX.getValue() / object.scale.x;

			objectScaleY.setValue( objectScaleY.getValue() * scale );
			objectScaleZ.setValue( objectScaleZ.getValue() * scale );

		}

		update();

	}

	function updateScaleY() {

		var object = editor.selected;

		if ( objectScaleLock.getValue() === true ) {

			var scale = objectScaleY.getValue() / object.scale.y;

			objectScaleX.setValue( objectScaleX.getValue() * scale );
			objectScaleZ.setValue( objectScaleZ.getValue() * scale );

		}

		update();

	}

	function updateScaleZ() {

		var object = editor.selected;

		if ( objectScaleLock.getValue() === true ) {

			var scale = objectScaleZ.getValue() / object.scale.z;

			objectScaleX.setValue( objectScaleX.getValue() * scale );
			objectScaleY.setValue( objectScaleY.getValue() * scale );

		}

		update();

	}
	
	function update() {

		var object = editor.selected;

		if ( object !== null ) {

			/*
			if ( object.parent !== null ) {

				var newParentId = parseInt( objectParent.getValue() );

				if ( object.parent.id !== newParentId && object.id !== newParentId ) {

					editor.execute( new MoveObjectCommand( object, editor.scene.getObjectById( newParentId ) ) );

				}

			}
			*/

			var newPosition = new THREE.Vector3( objectPositionX.getValue(), objectPositionY.getValue(), objectPositionZ.getValue() );
			if ( object.position.distanceTo( newPosition ) >= 0.01 ) {

				editor.execute( new SetPositionCommand( object, newPosition ) );

			}

			var newRotation = new THREE.Euler( objectRotationX.getValue(), objectRotationY.getValue(), objectRotationZ.getValue() );
			if ( object.rotation.toVector3().distanceTo( newRotation.toVector3() ) >= 0.01 ) {

				editor.execute( new SetRotationCommand( object, newRotation ) );

			}

			var newScale = new THREE.Vector3( objectScaleX.getValue(), objectScaleY.getValue(), objectScaleZ.getValue() );
			if ( object.scale.distanceTo( newScale ) >= 0.01 ) {

				editor.execute( new SetScaleCommand( object, newScale ) );

			}

			if ( object.fov !== undefined && Math.abs( object.fov - objectFov.getValue() ) >= 0.01 ) {

				editor.execute( new SetValueCommand( object, 'fov', objectFov.getValue() ) );
				object.updateProjectionMatrix();

			}

			if ( object.near !== undefined && Math.abs( object.near - objectNear.getValue() ) >= 0.01 ) {

				editor.execute( new SetValueCommand( object, 'near', objectNear.getValue() ) );

			}

			if ( object.far !== undefined && Math.abs( object.far - objectFar.getValue() ) >= 0.01 ) {

				editor.execute( new SetValueCommand( object, 'far', objectFar.getValue() ) );

			}

			if ( object.intensity !== undefined && Math.abs( object.intensity - objectIntensity.getValue() ) >= 0.01 ) {

				editor.execute( new SetValueCommand( object, 'intensity', objectIntensity.getValue() ) );

			}

			if ( object.color !== undefined && object.color.getHex() !== objectColor.getHexValue() ) {

				editor.execute( new SetColorCommand( object, 'color', objectColor.getHexValue() ) );

			}

			if ( object.groundColor !== undefined && object.groundColor.getHex() !== objectGroundColor.getHexValue() ) {

				editor.execute( new SetColorCommand( object, 'groundColor', objectGroundColor.getHexValue() ) );

			}

			if ( object.distance !== undefined && Math.abs( object.distance - objectDistance.getValue() ) >= 0.01 ) {

				editor.execute( new SetValueCommand( object, 'distance', objectDistance.getValue() ) );

			}

			if ( object.angle !== undefined && Math.abs( object.angle - objectAngle.getValue() ) >= 0.01 ) {

				editor.execute( new SetValueCommand( object, 'angle', objectAngle.getValue() ) );

			}

			if ( object.penumbra !== undefined && Math.abs( object.penumbra - objectPenumbra.getValue() ) >= 0.01 ) {

				editor.execute( new SetValueCommand( object, 'penumbra', objectPenumbra.getValue() ) );

			}

			if ( object.decay !== undefined && Math.abs( object.decay - objectDecay.getValue() ) >= 0.01 ) {

				editor.execute( new SetValueCommand( object, 'decay', objectDecay.getValue() ) );

			}

			/*if ( object.visible !== objectVisible.getValue() ) {

				editor.execute( new SetValueCommand( object, 'visible', objectVisible.getValue() ) );
				updatetree(object);
			}*/

			if ( object.castShadow !== undefined && object.castShadow !== objectCastShadow.getValue() ) {

				editor.execute( new SetValueCommand( object, 'castShadow', objectCastShadow.getValue() ) );

			}

			if ( object.receiveShadow !== undefined && object.receiveShadow !== objectReceiveShadow.getValue() ) {

				editor.execute( new SetValueCommand( object, 'receiveShadow', objectReceiveShadow.getValue() ) );
				object.material.needsUpdate = true;

			}

			if ( object.shadow !== undefined ) {

				if ( object.shadow.radius !== objectShadowRadius.getValue() ) {

					editor.execute( new SetValueCommand( object.shadow, 'radius', objectShadowRadius.getValue() ) );

				}

			}

			try {

				var userData = JSON.parse( objectUserData.getValue() );
				if ( JSON.stringify( object.userData ) != JSON.stringify( userData ) ) {

					editor.execute( new SetValueCommand( object, 'userData', userData ) );

				}

			} catch ( exception ) {

				console.warn( exception );

			}

		}

	}

	function updateRows( object ) {

		var properties = {
			// 'parent': objectParentRow,
			'fov': objectFovRow,
			'near': objectNearRow,
			'far': objectFarRow,
			'intensity': objectIntensityRow,
			'color': objectColorRow,
			'groundColor': objectGroundColorRow,
			'distance' : objectDistanceRow,
			'angle' : objectAngleRow,
			'penumbra' : objectPenumbraRow,
			'decay' : objectDecayRow,
			'castShadow' : objectShadowRow,
			'receiveShadow' : objectReceiveShadow,
			'shadow': objectShadowRadius
		};

		for ( var property in properties ) {

			properties[ property ].setDisplay( object[ property ] !== undefined ? '' : 'none' );

		}

	}

	function updateTransformRows( object ) {

		if ( object instanceof THREE.Light ||
		   ( object instanceof THREE.Object3D && object.userData.targetInverse ) ) {

			objectRotationRow.setDisplay( 'none' );
			objectScaleRow.setDisplay( 'none' );

		} else {

			objectRotationRow.setDisplay( '' );
			objectScaleRow.setDisplay( '' );

		}

	}

	// events

	signals.objectSelected.add( function ( object ) {

		if ( object !== null ) {

			
			container.setDisplay( 'block' );
			updateRows( object );
			updateUI( object );

		} else {

			container.setDisplay( 'none' );

		}

	} );

	/*
	signals.sceneGraphChanged.add( function () {

		var scene = editor.scene;
		var options = {};

		scene.traverse( function ( object ) {

			options[ object.id ] = object.name;

		} );

		objectParent.setOptions( options );

	} );
	*/

	signals.objectChanged.add( function ( object ) {

		if ( object !== editor.selected ) return;

		updateUI( object );

	} );

	signals.refreshSidebarObject3D.add( function ( object ) {

		if ( object !== editor.selected ) return;

		updateUI( object );

	} );

	function updateUI( object ) {
		objectDualityRow.setDisplay('none');
		objectWeightRow.setDisplay('none');
		objectConnectsRow.setDisplay('none');
		objectNameRow.setDisplay('none');
		
		if(typeof Information[object.name] != 'undefined') {
			objectType.setValue( Information[object.name].cellid );
			if(Information[object.name].cellname !== 'undefined'){
				objectName.setValue( Information[object.name].cellname);
				objectNameRow.setDisplay('block');
			}
				
			if(Information[object.name].duality != "") {
				objectDuality.setLabel( Information[object.name].duality );
				objectDualityRow.setDisplay('block');
			}
			
		}
		else if(typeof StateInformation[object.name] != 'undefined') {
			objectType.setValue( StateInformation[object.name].stateid );
			if(StateInformation[object.name].statename != 'undefined'){
				objectName.setValue(StateInformation[object.name].statename);
				objectNameRow.setDisplay('block');
			}
				
			var con = StateInformation[object.name].connects;
			
			if(con.length != 0) {
				var constring={};
				for(var i=0;i<con.length;i++) {
					constring[con[i]]=con[i];
				}
				objectConnects.setOptions( constring );
				objectConnectsRow.setDisplay('block');
			}
			console.log(StateInformation[object.name].duality);
			if(StateInformation[object.name].duality != ""){
				objectDuality.setLabel( StateInformation[object.name].duality );
				objectDualityRow.setDisplay('block');
			}
		}
		else if(typeof TransitionInformation[object.name] != 'undefined') {
			objectType.setValue( TransitionInformation[object.name].transitionid );
			if(TransitionInformation[object.name].transitionname != 'undefined'){
				objectName.setValue( TransitionInformation[object.name].transitionname );
				objectNameRow.setDisplay('block');
			}
				
			var con = TransitionInformation[object.name].connects;
			
			if(con.length != 0) {
				var constring={};
				for(var i=0;i<con.length;i++) {
					constring[con[i]]=con[i];
				}
				objectConnects.setOptions( constring );
				objectConnectsRow.setDisplay('block');
			}
			if(TransitionInformation[object.name].weight != 'undefined'){
				objectWeight.setValue( TransitionInformation[object.name].weight );
				objectWeightRow.setDisplay('block');
			}
			
			var td = TransitionInformation[object.name].duality;
			if(td !== ""){
				objectDuality.setLabel( td );
				objectDualityRow.setDisplay('block');
			}
		}
		else if(typeof BoundaryInformation[object.name] != 'undefined') {
			objectType.setValue( BoundaryInformation[object.name].cellBoundaryid );
			if(BoundaryInformation[object.name].cellBoundaryname != 'undefined'){
				objectName.setValue(BoundaryInformation[object.name].cellBoundaryname);
				objectNameRow.setDisplay('block');
			}
			if(BoundaryInformation[object.name].duality != ""){
				objectDuality.setLabel( BoundaryInformation[object.name].duality);
				objectDualityRow.setDisplay('block');
			}
			
		}
		else {
			objectType.setValue( '' );
		}


		/*
		if ( object.parent !== null ) {

			objectParent.setValue( object.parent.id );

		}
		*/

		objectPositionX.setValue( object.position.x );
		objectPositionY.setValue( object.position.y );
		objectPositionZ.setValue( object.position.z );

		objectRotationX.setValue( object.rotation.x );
		objectRotationY.setValue( object.rotation.y );
		objectRotationZ.setValue( object.rotation.z );

		objectScaleX.setValue( object.scale.x );
		objectScaleY.setValue( object.scale.y );
		objectScaleZ.setValue( object.scale.z );

		if ( object.fov !== undefined ) {

			objectFov.setValue( object.fov );

		}

		if ( object.near !== undefined ) {

			objectNear.setValue( object.near );

		}

		if ( object.far !== undefined ) {

			objectFar.setValue( object.far );

		}

		if ( object.intensity !== undefined ) {

			objectIntensity.setValue( object.intensity );

		}

		if ( object.color !== undefined ) {

			objectColor.setHexValue( object.color.getHexString() );

		}

		if ( object.groundColor !== undefined ) {

			objectGroundColor.setHexValue( object.groundColor.getHexString() );

		}

		if ( object.distance !== undefined ) {

			objectDistance.setValue( object.distance );

		}

		if ( object.angle !== undefined ) {

			objectAngle.setValue( object.angle );

		}

		if ( object.penumbra !== undefined ) {

			objectPenumbra.setValue( object.penumbra );

		}

		if ( object.decay !== undefined ) {

			objectDecay.setValue( object.decay );

		}

		if ( object.castShadow !== undefined ) {

			objectCastShadow.setValue( object.castShadow );

		}

		if ( object.receiveShadow !== undefined ) {

			objectReceiveShadow.setValue( object.receiveShadow );

		}

		if ( object.shadow !== undefined ) {

			objectShadowRadius.setValue( object.shadow.radius );

		}

		

		try {

			objectUserData.setValue( JSON.stringify( object.userData, null, '  ' ) );

		} catch ( error ) {

			console.log( error );

		}

		objectUserData.setBorderColor( 'transparent' );
		objectUserData.setBackgroundColor( '' );

		updateTransformRows( object );

	}

	return container;

};
