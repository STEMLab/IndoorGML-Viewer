var reader = new FileReader();

    function readText(that){

        if(that.files && that.files[0]){
            var reader = new FileReader();
            reader.onload = function (e) {
                var text=e.target.result;

                if (text.length==0) {
                    alert("파일을 선택해주세요")
                    return
                }
                socket.emit('content',text);
               // verticesString = text

            };//end onload()
            reader.readAsText(that.files[0]);
        }//end if html5 filelist support
    }
var socket = io.connect();

$(document).ready(function() {


  socket.once('parse', function(result) {
    indoor=new Indoor();
    indoor.init(result);
    makeWebglGeometry();
     animate();
  });

});
 function makeWebglGeometry(){
        var cells=indoor.primalSpaceFeature;
        //console.log(indoor);
        for(var i=0;i<cells.length;i++){
            var cell=[];
            var surfaces=cells[i].geometry;
            for(var j=0;j<surfaces.length;j++){
                var surface=triangulate(surfaces[j].exterior,surfaces[j].interior);

                //console.log("after return"+surface);
                //surfaces[j].exterior=surface;
                cell.push(surface);
            }

            celldictionary[cells[i].cellid]=cell;

        }


        var graphs=indoor.multiLayeredGraph;

        for(var i=0;i<graphs.length;i++){
            var graph=[];
            var nodes=[];
            var states=graphs[i].stateMember;
            for(var j=0;j<states.length;j++){
                moveToCenter(states[j].position);
                var state=states[j].position;
                nodes.push(state);
            }
            graph.push(nodes);

            var edges=[];
            var trasitions=graphs[i].transitionMember;
            for(var j=0;j<trasitions.length;j++){
                moveToCenter(trasitions[j].line);
                var trasition=trasitions[j].line;
                edges.push(trasition);
            }
            graph.push(edges);

            networkdictionary[graphs[i].graphid]=graph;

        }
        //camera.position.x = (maxx+lowx)/2;
        //camera.position.y = (maxy+lowy)/2;
        camera.position.z = 30;
        camera.lookAt(new THREE.Vector3(1,1,1));
        createMesh();
    }
    var nx;
    var ny;
    var nz;
    var floorx;
    var floory;
    var floorz;
    var floorflag=0;
    var maxx=0;
    var lowx=0;
    var maxy=0;
    var lowy=0;
    var lowz=0;

     function  moveToCenter(myvertices){
                if(floorflag!=1){
                    floorx=Math.floor(myvertices[0]);
                    floory=Math.floor(myvertices[1]);
                    floorz=Math.floor(myvertices[2]);
                    floorflag=1;
                }
                for (var i=0; i<myvertices.length/3; i++) {
                    myvertices[i*3] /= floorx;
                    myvertices[i*3+1] /= floorx;
                    myvertices[i*3+2] /= floorx;
                }

                for (var i=0; i<myvertices.length/3; i++) {
                    myvertices[i*3] =Math.floor( myvertices[i*3]*1000000000)/100000000
                    myvertices[i*3+1] =Math.floor( myvertices[i*3+1]*1000000000)/100000000
                    myvertices[i*3+2] =Math.floor( myvertices[i*3+2]*1000000000)/100000000
                }
            }
            function calVector(myvertices){
                var vecx=[myvertices[3]-myvertices[0],myvertices[6]-myvertices[0]];
                var vecy=[myvertices[4]-myvertices[1],myvertices[7]-myvertices[1]];
                var vecz=[myvertices[5]-myvertices[2],myvertices[8]-myvertices[2]];
                nx=Math.abs(vecy[0]*vecz[1]-vecz[0]*vecy[1]);
                ny=Math.abs(-(vecx[0]*vecz[1]-vecz[0]*vecx[1]));
                nz=Math.abs(vecx[0]*vecy[1]-vecy[0]*vecx[1]);
            }
    function triangulate(myvertices,interior){

        moveToCenter(myvertices);
        moveToCenter(interior);
        var partition=[];
        var newmyvertices=[];
        var newinterior=[];
            calVector(myvertices);

            var max=Math.max(nx,ny,nz);
                if(nz==max){

                    for( var i=0;i<myvertices.length/3;i++){

                        newmyvertices.push(myvertices[i*3]);
                        newmyvertices.push(myvertices[i*3+1]);

                    }
                    for( var i=0;i<interior.length/3;i++){

                        newinterior.push(interior[i*3]);
                        newinterior.push(interior[i*3+1]);

                    }

                }
                else if(nx==max){
                     for(var i=0;i<myvertices.length/3;i++){

                        newmyvertices.push(myvertices[i*3+1]);
                        newmyvertices.push(myvertices[i*3+2]);

                    }
                    for( var i=0;i<interior.length/3;i++){

                        newinterior.push(interior[i*3+1]);
                        newinterior.push(interior[i*3+2]);

                    }

                }
                else{
                     for(var i=0;i<myvertices.length/3;i++){

                        newmyvertices.push(myvertices[i*3]);
                        newmyvertices.push(myvertices[i*3+2]);

                    }
                    for( var i=0;i<interior.length/3;i++){

                        newinterior.push(interior[i*3]);
                        newinterior.push(interior[i*3+2]);

                    }
                }
                var interiorStartIndex=newmyvertices.length/2 - 1;
                var polygonwithhole=newmyvertices.concat(newinterior);
                //var triangle = earcut(newmyvertices);
                var triangle = earcut(polygonwithhole,[interiorStartIndex]);

                    for(var i=0;i<triangle.length;i++){

                        partition.push(myvertices[triangle[i]*3]);
                        partition.push(myvertices[triangle[i]*3+1]);
                        partition.push(myvertices[triangle[i]*3+2]);

                    }

        return partition;

    }
