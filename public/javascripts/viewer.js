            var container;
            var camera, scene, renderer,controls;
            init();
            function init() {
                container = document.getElementById( 'container' );
                var mouse = new THREE.Vector2();
                camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 3500 );
                camera.position.z = 200;

                controls = new THREE.TrackballControls( camera );
                controls.rotateSpeed = 1.0;
                controls.zoomSpeed = 1.2;
                controls.panSpeed = 0.8;
                controls.noZoom = false;
                controls.noPan = false;
                controls.staticMoving = true;
                controls.dynamicDampingFactor = 0.3;

                scene = new THREE.Scene();
                scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );
                //
                scene.add( new THREE.AmbientLight(0x404040  ) );
                var light1 = new THREE.DirectionalLight( 0xffffff, 0.5 );
                light1.position.set( 1, 1, 1 );
                scene.add( light1 );
                var light2 = new THREE.DirectionalLight( 0xffffff, 1.5 );
                light2.position.set( 0, -1, 0 );
                scene.add( light2 );

                renderer = new THREE.WebGLRenderer( { antialias: false } );
                renderer.setClearColor( scene.fog.color );
                renderer.setPixelRatio( window.devicePixelRatio );
                renderer.setSize( window.innerWidth, window.innerHeight );
                renderer.gammaInput = true;
                renderer.gammaOutput = true;
                container.appendChild( renderer.domElement );


                window.addEventListener( 'resize', onWindowResize, false );
            }
            function onWindowResize() {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize( window.innerWidth, window.innerHeight );
            }
            
            function animate() {
                requestAnimationFrame( animate );
                render();
            }
            function render() {
                controls.update();
                renderer.render( scene, camera );
            }
            function onMouseMove( e ) {
                mouse.x = e.clientX;
                mouse.y = e.clientY;
            }
            
 

    
    var celldictionary={};
    var networkdictionary={};
    var allgeometry={};
    var indoor;
            function select(key){
                for(var k in allgeometry){
                    for(var i=0;i<allgeometry[k].length;i++){
                        console.log(allgeometry[key][i]);
                        allgeometry[k][i].visible=false;
                    }
                }
                for(var i=0;i<allgeometry[key].length;i++){
                    //console.log(allgeometry[key][i]);
                    allgeometry[key][i].visible=true;
                }
            }

        
            function createMesh(){
                for (var key in celldictionary) {
                    var surfaces=celldictionary[key];
                    var cell=[];
                    for(var j=0;j<surfaces.length;j++){
                        var geometry = new THREE.BufferGeometry();
                        var surface=surfaces[j];
                        var vertices = new Float32Array( surface );

                        geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
                        var material = new THREE.MeshStandardMaterial( { color: 0xffff00, opacity:0.3, transparent : true, side: THREE.DoubleSide} );
                        var mesh = new THREE.Mesh( geometry, material );
                        scene.add( mesh );
                        cell.push(mesh);
                        
                    }
                    allgeometry[key]=cell;
                }
                var cells=indoor.primalSpaceFeature;
                for(var i=0;i<cells.length;i++){
                    var surfaces=cells[i].geometry;
                    for(var j=0;j<surfaces.length;j++){
                        var polygon=surfaces[j].exterior;
                        var material = new THREE.LineBasicMaterial({color: 0x0000ff});

                        var geometry = new THREE.Geometry();
                        for(var k=0;k<polygon.length;k+=3){
                            geometry.vertices.push(new THREE.Vector3( polygon[k], polygon[k+1], polygon[k+2]));
                        }

                        var line = new THREE.Line( geometry, material );
                        scene.add( line );
                        allgeometry[cells[i].cellid].push(line);
                        polygon=surfaces[j].interior;
                        if(polygon.length != 0){
                            geometry = new THREE.Geometry();
                            for(var k=0;k<polygon.length;k+=3){
                                geometry.vertices.push(new THREE.Vector3( polygon[k], polygon[k+1], polygon[k+2]));
                            }
                            var line = new THREE.Line( geometry, material );
                            //console.log(polygon);
                            scene.add( line );
                            allgeometry[cells[i].cellid].push(line);
                        }

                    }
                }
                var geometry = new THREE.SphereBufferGeometry( 0.005, 32, 16 );
                var boxGeometry = new THREE.BoxGeometry( 0.5, 0.5, 1 );
                var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
                for(var key in networkdictionary){
                    var nodes=networkdictionary[key][0];
                    var g=[];
                    for(var i=0;i<nodes.length;i++){
                        var mesh = new THREE.Mesh( geometry, material );
                        mesh.position.x=nodes[i][0];
                        mesh.position.y=nodes[i][1];
                        mesh.position.z=nodes[i][2];
                        scene.add( mesh );
                        g.push(mesh);
                    }
                    var edges=networkdictionary[key][1];
                    var material = new THREE.LineBasicMaterial({color: 0x00ffff,linewidth:10});

                    for(var i=0;i<edges.length;i++){
                        geometry = new THREE.Geometry();
                            for(var k=0;k<edges[i].length;k+=3){
                                geometry.vertices.push(new THREE.Vector3( edges[i][k], edges[i][k+1], edges[i][k+2]));
                            }
                            var line = new THREE.Line( geometry, material );
                            //console.log(polygon);
                            scene.add( line );
                            g.push(line);
                    }
                    allgeometry[key]=g;
                }

                
            }
    
   