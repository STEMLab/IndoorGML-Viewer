/**
 * @author Hyung-Gyu Ryoo (Pusan National University)
 */

Menubar.Settings = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Settings' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	// New

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Style' );
	option.onClick( function () {

		if ( confirm( 'Style change test' ) ) {
		}

	} );
	options.add( option );

	//

	options.add( new UI.HorizontalRule() );
  
	return container;

};
