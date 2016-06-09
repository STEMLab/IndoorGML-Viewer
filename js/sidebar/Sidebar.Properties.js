/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Properties = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Span();

	var objectTab = new UI.Text( 'PROPERTIES' ).onClick( onClick );
	var geometryTab = new UI.Text( 'GEOMETRY' ).onClick( onClick );
	var materialTab = new UI.Text( 'MATERIAL' ).onClick( onClick );
	var viewTab = new UI.Text('VIEW').onClick(onClick);

	var tabs = new UI.Div();
	tabs.setId( 'tabs' );
	tabs.add( objectTab, viewTab );
	//tabs.add( objectTab, geometryTab, materialTab );
	container.add( tabs );

	function onClick( event ) {

		select( event.target.textContent );

	}

	

	var object = new UI.Span().add(
		new Sidebar.Object( editor )
	);
	container.add( object );

	var view = new UI.Span().add(
		new Sidebar.View( editor )
	);
	container.add( view );
	//var geometry = new UI.Span().add(
	//	new Sidebar.Geometry( editor )
	//);
	//container.add( geometry );

	var material = new UI.Span().add(
		new Sidebar.Material( editor )
	);
	container.add( material );

	function select( section ) {

		objectTab.setClass( '' );
		viewTab.setClass( '' );
		geometryTab.setClass( '' );
		materialTab.setClass( '' );

		object.setDisplay( 'none' );
		view.setDisplay( 'none' );
		//geometry.setDisplay( 'none' );
		material.setDisplay( 'none' );

		switch ( section ) {
			case 'PROPERTIES':
				objectTab.setClass( 'selected' );
				object.setDisplay( '' );
				break;
			case 'VIEW':
				viewTab.setClass( 'selected' );
				view.setDisplay( '' );
				break;
			case 'GEOMETRY':
				geometryTab.setClass( 'selected' );
				geometry.setDisplay( '' );
				break;
			case 'MATERIAL':
				materialTab.setClass( 'selected' );
				material.setDisplay( '' );
				break;
		}

	}

	select( 'PROPERTIES' );

	return container;

};
