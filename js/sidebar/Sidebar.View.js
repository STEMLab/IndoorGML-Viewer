/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.View = function ( editor ) {

	var signals = editor.signals;

	
	var viewcontainer = new UI.Panel();
	viewcontainer.setBorderTop( '0' );
	viewcontainer.setPaddingTop( '5px' );
	viewcontainer.setDisplay( 'none' );
	// Actions
	

	var objectVisibleRow = new UI.Row();
	var objectVisible = new UI.Checkbox().onChange( update );
	objectVisibleRow.add( new UI.Text( 'Visibility' ).setWidth( '90px' ) );
	objectVisibleRow.add( objectVisible );

	viewcontainer.add( objectVisibleRow );

	// user data
	var objectSizeRow = new UI.Row();

	var objectSize = new  UI.Select().setFontSize( '11px' );
 	objectSize.setOptions( {
 		'0.03': '0.03',
 		'0.1': '0.1',
 		'0.5': '0.5',
 	} );
 	objectSize.onClick( function ( event ) {
 
 		event.stopPropagation(); // Avoid panel collapsing

 	} );
 	objectSize.onChange( function ( event ) {
 
 		//var object = editor.selected;
 		var geometry = new THREE.SphereBufferGeometry( this.getValue(), 32, 16 );
 		
 		editor.execute( new SetGeometryListCommand( geometry ) );	
 		
 		this.setValue( 'Size' );
 
 	} );
 	objectSizeRow.add(new UI.Text('StateSize').setWidth( '90px' ));
 	objectSizeRow.add(objectSize);
 	viewcontainer.add(objectSizeRow);

	
	

	
	function updatetree(object) {
	
			//editor.execute( new SetValueCommand( object, 'visible', objectVisible.getValue() ) );
			//objectVisible.setValue(null)
			tree.change(object);
			editor.signals.objectChanged.dispatch( object );

	}
	function update() {

		var object = editor.selected;

		if ( object !== null ) {


			if ( object.color !== undefined && object.color.getHex() !== objectColor.getHexValue() ) {

				editor.execute( new SetColorCommand( object, 'color', objectColor.getHexValue() ) );

			}

			if ( object.visible !== objectVisible.getValue() ) {

				editor.execute( new SetValueCommand( object, 'visible', objectVisible.getValue() ) );
				updatetree(object);
			}

		}

	}

	

	

	// events

	signals.objectSelected.add( function ( object ) {

		if ( object !== null ) {
			viewcontainer.setDisplay( 'block' );

			
			updateUI( object );

		} else {

			viewcontainer.setDisplay( 'none' );

		}

	} );

	signals.objectChanged.add( function ( object ) {

		if ( object !== editor.selected ) return;

		updateUI( object );

	} );

	signals.refreshSidebarObject3D.add( function ( object ) {

		if ( object !== editor.selected ) return;

		updateUI( object );

	} );

	function updateUI( object ) {
		if(object.visible == null) {
			objectVisible.indeterminate = true;
			objectVisible.checked = false;
		}
	

		if ( object.color !== undefined ) {

			objectColor.setHexValue( object.color.getHexString() );

		}

		objectVisible.setValue( object.visible );

		

	}

	return viewcontainer;

};
