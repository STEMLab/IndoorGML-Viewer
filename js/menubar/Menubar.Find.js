/**
 * @author Hyung-Gyu Ryoo (Pusan National University)
 */

Menubar.Find = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Find' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	// New
  var findById = new UI.Row();
	findById.setClass( 'option' );
	findById.setTextContent( 'Find Object by GML ID' );
			findById.onClick( function () {
        
			} );
	options.add( findById );

	//

	options.add( new UI.HorizontalRule() );

	return container;

};
