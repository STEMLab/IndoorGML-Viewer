/**
 * @author Hyung-Gyu Ryoo (Pusan National University)
 */

Menubar.Settings = function ( editor ) {

	var signals = editor.signals;

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
	var gridChecked = false;
	var gridrow = new UI.Row();
	gridrow.setClass( 'option' );
	gridrow.setTextContent( 'Grid on' );
			gridrow.onClick( function () {
				if (gridChecked == true) {
					gridrow.setTextContent( 'Grid off' );
					gridChecked = false;
				} else {
					gridrow.setTextContent( 'Grid on' );
					gridChecked = true;
				}
				signals.showGridChanged.dispatch( gridChecked );
			} );

	options.add( gridrow );

	//

	options.add( new UI.HorizontalRule() );

	return container;

};
