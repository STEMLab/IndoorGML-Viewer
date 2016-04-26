  var gl;

    function initGL(canvas) {
        
        try {
            gl = canvas.getContext("experimental-webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) {
        }
        if (!gl) {
            alert("Could not initialise WebGL, sorry :-(");
        }
    }


    function getShader(gl, id) {
        
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }


    var shaderProgram;

    function initShaders() {
        
        var fragmentShader = getShader(gl, "shader-fs");
        var vertexShader = getShader(gl, "shader-vs");

        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        gl.useProgram(shaderProgram);

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
        

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    }


    var mvMatrix = mat4.create();
    var mvMatrixStack = [];
    var pMatrix = mat4.create();

    function mvPushMatrix() {
        var copy = mat4.create();
        mat4.set(mvMatrix, copy);
        mvMatrixStack.push(copy);
    }

    function mvPopMatrix() {
        if (mvMatrixStack.length == 0) {
            throw "Invalid popMatrix!";
        }
        mvMatrix = mvMatrixStack.pop();
    }

    function setMatrixUniforms() {
        
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);


        var normalMatrix = mat3.create();
        mat4.toInverseMat3(mvMatrix, normalMatrix);
        mat3.transpose(normalMatrix);
        gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
    }

  

    

    function  moveToCenter(myvertices){
        if(floorflag!=1){
            floorx=Math.floor(myvertices[0]);
            floory=Math.floor(myvertices[1]);
            floorz=Math.floor(myvertices[2]);
            floorflag=1;
        }
         for (var i=0; i<myvertices.length/3; i++) {
            myvertices[i*3] -= floorx;
            myvertices[i*3+1] -= floory;
            myvertices[i*3+2] -= floorz;
        }
        
        for (var i=0; i<myvertices.length/3; i++) {
            myvertices[i*3] =Math.floor( myvertices[i*3]*1000000000)/1000000000
            myvertices[i*3+1] =Math.floor( myvertices[i*3+1]*1000000000)/1000000000
            myvertices[i*3+2] =Math.floor( myvertices[i*3+2]*1000000000)/1000000000
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
 

    var nx;
    var ny;
    var nz;
    var floorx;
    var floory;
    var floorz;
    var floorflag=0;
    var celldictionary={};

    function triangulate(myvertices){

        moveToCenter(myvertices);
        var partition=[];
        var newmyvertices=[];
            calVector(myvertices);
            
            var max=Math.max(nx,ny,nz);
                if(nz==max){

                    for( var i=0;i<myvertices.length/3;i++){
     
                        newmyvertices.push(myvertices[i*3]);
                        newmyvertices.push(myvertices[i*3+1]);
                       
                    }  

                }
                else if(nx==max){
                     for(var i=0;i<myvertices.length/3;i++){
     
                        newmyvertices.push(myvertices[i*3+1]);
                        newmyvertices.push(myvertices[i*3+2]);

                    }   
                    
                }
                else{
                     for(var i=0;i<myvertices.length/3;i++){
     
                        newmyvertices.push(myvertices[i*3]);
                        newmyvertices.push(myvertices[i*3+2]);

                    }  
                }
                var triangle = earcut(newmyvertices);

                    for(var i=0;i<triangle.length;i++){
     
                        partition.push(myvertices[triangle[i]*3]);
                        partition.push(myvertices[triangle[i]*3+1]);
                        partition.push(myvertices[triangle[i]*3+2]);

                    }   
        return partition;
        
    }
    function makeWebglGeometry(){
        var cells=indoor.primalSpaceFeature;
        //console.log(indoor);
        for(var i=0;i<cells.length;i++){
            var cell=[];
            var surfaces=cells[i].geometry;
            for(var j=0;j<surfaces.length;j++){
                var surface=triangulate(surfaces[j].exterior);
                //console.log("after return"+surface);
                //surfaces[j].exterior=surface;
                cell.push(surface);
            }
    
            celldictionary[cells[i].cellid]=cell;
            
        }
        //console.log(celldictionary);
        //console.log(indoor);
        addNewVertices([1.0, 0.3, 0.3, 0.3]);

        var graphs=indoor.multiLayeredGraph;
        //console.log(indoor);
        for(var i=0;i<graphs.length;i++){
            var graph=[];
            var nodes=[];
            var states=graphs[i].stateMember;
            for(var j=0;j<states.length;j++){
                moveToCenter(states[j].position);
                var state=states[j].position;
                //console.log(states[j].position);
                //surfaces[j].exterior=surface;
                nodes.push(state);
            }
            graph.push(nodes);

            var edges=[];
            var trasitions=graphs[i].transitionMember;
            for(var j=0;j<trasitions.length;j++){
                moveToCenter(trasitions[j].line);
                var trasition=trasitions[j].line;
                //console.log("after return"+surface);
                //surfaces[j].exterior=surface;
                edges.push(trasition);
            }
            graph.push(edges);

            networkdictionary[graphs[i].graphid]=graph;
            
        }
        addState();
    }
    var vertexPositionBufferArray = [];
    var vertexLineBufferArray = [];



    var vertexColorBufferArray = [];
    var vertexLineColorBufferArray = [];

    var networkdictionary={};
    

    var verticesAverageArray = [];

    var indoor;
    var sphereVertexPositionBuffer;//
    var sphereVertexColorBuffer;//
    var sphereVertexIndexBuffer;
    var sphereNormalBuffer;//
    function addState(){
         var latitudeBands = 30; //위도 구간수
        var longitudeBands = 30; //경도 구간수
        var radius = 0.5; //반지름 
        var vertexPositionData = []; //정점 위치 정보 

    for (var latNumber = 0; latNumber <= latitudeBands; latNumber++) {
            //위도별 각도 계산
        var theta = latNumber * Math.PI / latitudeBands;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);
        for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
                //경도별 각도 계산 
            var phi = longNumber * 2 * Math.PI / longitudeBands;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;
            //uv 좌표 계산 
            var u = 1 - (longNumber / longitudeBands);
            var v = 1 - (latNumber / latitudeBands);
        
            vertexPositionData.push(radius * x);
            vertexPositionData.push(radius * y);
            vertexPositionData.push(radius * z);
        }
    }
 //인덱스 계산 
    var indexData = [];
    for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
        for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
            var first = (latNumber * (longitudeBands + 1)) + longNumber;
            var second = first + longitudeBands + 1;
            indexData.push(first);
            indexData.push(second);
            indexData.push(first + 1);

            indexData.push(second);
            indexData.push(second + 1);
            indexData.push(first + 1);
        }
    }

         sphereVertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
        sphereVertexPositionBuffer.itemSize = 3;
        sphereVertexPositionBuffer.numItems = vertexPositionData.length/3;

        sphereVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer);

        var unpackedColors = [];
        for (var i=0; i<vertexPositionData.length/3; i++)
        for(var j=0; j<4; j++)
            unpackedColors.push(1.0);
    
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
        sphereVertexColorBuffer.itemSize = 4;
        sphereVertexColorBuffer.numItems = vertexPositionData.length/3;

        sphereVertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);
    
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
    sphereVertexIndexBuffer.itemSize = 1;
    sphereVertexIndexBuffer.numItems = indexData.length;  
    }
    function addNewVertices (drawcolor) {
        
       
        
       /* var vertexLineBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexLineBuffer);
        
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(myvertices), gl.STATIC_DRAW);
        vertexLineBuffer.itemSize = 3;
        vertexLineBuffer.numItems = myvertices.length/vertexLineBuffer.itemSize;

        vertexLineBufferArray.push(vertexLineBuffer);*/
        //var surfaces=indoor.primalSpaceFeature[0].geometry;
        
        for (var key in celldictionary) {
            var surfaces=celldictionary[key];
            for(var j=0;j<surfaces.length;j++){


                var vertexPositionBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
        
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(surfaces[j]), gl.STATIC_DRAW);
                vertexPositionBuffer.itemSize = 3;
                vertexPositionBuffer.numItems = surfaces[j].length/vertexPositionBuffer.itemSize;

                vertexPositionBufferArray.push(vertexPositionBuffer);


                calcCameraTargetPosition(surfaces[j]);

                var vertexColorBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
                color = drawcolor;
                colors = []
                for (var i=0; i < vertexPositionBuffer.numItems; i++) {
                    colors = colors.concat(color);
            
                }
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
                vertexColorBuffer.itemSize = 4;
                vertexColorBuffer.numItems = vertexPositionBuffer.numItems;

                vertexColorBufferArray.push(vertexColorBuffer);
   
            }
            
       
        }

        

        


       /* var vertexLineColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexLineColorBuffer);
        colors = []
        color = [1.0, 0.0, 0.0, 0.3]; // red 비슷한 색
        // color[color.length-1] = 1.0;
        for (var i=0; i < vertexLineBuffer.numItems; i++) {
             colors = colors.concat(color);
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        vertexLineColorBuffer.itemSize = 4;
        vertexLineColorBuffer.numItems = vertexLineBuffer.numItems;

        vertexLineColorBufferArray.push(vertexLineColorBuffer);*/



        
        

    }
    var xdeg = 0.0;
    var ydeg = 0.0;
    var zdeg = 0.0;

    var dis = 15.0;
    function drawScene() {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

        mat4.identity(mvMatrix);

        
        calcCameraPositionAnimation();

        
        // mat4.translate(mvMatrix, [-currentCameraX*Math.sin(degToRad(ydeg)), -currentCameraY, -35.0*Math.cos(degToRad(ydeg))]);  // 화면 보는 시점


        mat4.translate(mvMatrix, [
            0.0,
            0.0, 
            -dis
        ]);  // 화면 보는 시점
        mat4.multiply(mvMatrix, moonRotationMatrix);
        mat4.translate(mvMatrix, [
            -currentCameraX,
            -currentCameraY, 
            0.0
        ]);  // 화면 보는 시점


        
        




        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        gl.enable(gl.BLEND);
        gl.disable(gl.DEPTH_TEST);
        gl.uniform1f(shaderProgram.alphaUniform, 0.5);


        gl.uniform3f(
            shaderProgram.ambientColorUniform,
            0.2,
            0.2,
            0.2
        );

        var lightingDirection = [
            -0.25,
            -0.25,
            -1.0
        ];
        var adjustedLD = vec3.create();
        vec3.normalize(lightingDirection, adjustedLD);
        vec3.scale(adjustedLD, -1);
        gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);

        gl.uniform3f(
            shaderProgram.directionalColorUniform,
            0.8,
            0.8,
            0.8
        );

        

        for (var i=0; i<vertexPositionBufferArray.length; i++) {

            mvPushMatrix();

            gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBufferArray[i]);
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionBufferArray[i].itemSize, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBufferArray[i]);
            gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, vertexColorBufferArray[i].itemSize, gl.FLOAT, false, 0, 0);

            setMatrixUniforms();
            gl.drawArrays(gl.TRIANGLES, 0, vertexPositionBufferArray[i].numItems);
            // gl.drawArrays(gl.QUAD_STRIP, 0, vertexPositionBufferArray[i].numItems);

            mvPopMatrix();
        }

         for (var key in networkdictionary) {
            var graph=networkdictionary[key];
            var nodes=graph[0];
            for(var i=0; i<nodes.length;i++){
                //mvMatrix = translate(0.0, 0.0, 0.0);
                mat4.identity(mvMatrix);

                mat4.translate(mvMatrix, [
                    0.0,
                    0.0, 
                    -dis
                ]);  // 화면 보는 시점
                mat4.multiply(mvMatrix, moonRotationMatrix);
                mat4.translate(mvMatrix, [
                    -currentCameraX,
                    -currentCameraY, 
                    0.0
                ]);
                var translateLoc=nodes[i];
                //console.log(networkdictionary);
                mvPushMatrix();
                mat4.translate(mvMatrix, translateLoc);
                gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexPositionBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    

                gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexColorBuffer);
                gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, sphereVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
        
                gl.uniform1i(shaderProgram.samplerUniform, 0);

                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereVertexIndexBuffer);
                setMatrixUniforms();
                //gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, flatten(mvMatrix));
                gl.drawElements(gl.TRIANGLES, sphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
                //console.log(gl);
                mvPopMatrix();
            }
        }
        /*for (var i=0; i<vertexLineBufferArray.length; i++) {

            mvPushMatrix();

            gl.bindBuffer(gl.ARRAY_BUFFER, vertexLineBufferArray[i]);
            gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexLineBufferArray[i].itemSize, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexLineColorBufferArray[i]);
            gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, vertexLineColorBufferArray[i].itemSize, gl.FLOAT, false, 0, 0);

            setMatrixUniforms();
            gl.drawArrays(gl.LINE_STRIP, 0, vertexLineBufferArray[i].numItems);

            mvPopMatrix();
        }*/
        
    }
    /*function flatten( v )
{
    if ( v.matrix === true ) {
        v = transpose( v );
    }

    var n = v.length;
    var elemsAreArrays = false;

    if ( Array.isArray(v[0]) ) {
        elemsAreArrays = true;
        n *= v[0].length;
    }

    var floats = new Float32Array( n );

    if ( elemsAreArrays ) {
        var idx = 0;
        for ( var i = 0; i < v.length; ++i ) {
            for ( var j = 0; j < v[i].length; ++j ) {
                floats[idx++] = v[i][j];
            }
        }
    }
    else {
        for ( var i = 0; i < v.length; ++i ) {
            floats[i] = v[i];
        }
    }

    return floats;
}*/
/*function mult( u, v )
{
    var result = [];

    if ( u.matrix && v.matrix ) {
        if ( u.length != v.length ) {
            throw "mult(): trying to add matrices of different dimensions";
        }

        for ( var i = 0; i < u.length; ++i ) {
            if ( u[i].length != v[i].length ) {
                throw "mult(): trying to add matrices of different dimensions";
            }
        }

        for ( var i = 0; i < u.length; ++i ) {
            result.push( [] );

            for ( var j = 0; j < v.length; ++j ) {
                var sum = 0.0;
                for ( var k = 0; k < u.length; ++k ) {
                    sum += u[i][k] * v[k][j];
                }
                result[i].push( sum );
            }
        }

        result.matrix = true;

        return result;
    }
    else {
        if ( u.length != v.length ) {
            throw "mult(): vectors are not the same dimension";
        }

        for ( var i = 0; i < u.length; ++i ) {
            result.push( u[i] * v[i] );
        }

        return result;
    }
}*/
/*function translate( x, y, z )
{
    if ( Array.isArray(x) && x.length == 3 ) {
        z = x[2];
        y = x[1];
        x = x[0];
    }

    var result = mat4.create();
    result[0][3] = x;
    result[1][3] = y;
    result[2][3] = z;

    return result;
}*/


var verticesString;


    function clickClear () {
        vertexPositionBufferArray = [];
        vertexPositionArray = [];
        vertexLineBufferArray=[];
        floorflag=0;
    }




    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }


    var mouseDown = false;
    var lastMouseX = null;
    var lastMouseY = null;

    var moonRotationMatrix = mat4.create();
    mat4.identity(moonRotationMatrix);

    function handleMouseDown(event) {
        mouseDown = true;
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
    }


    function handleMouseUp(event) {
        mouseDown = false;
    }


    function handleMouseMove(event) {
        if (!mouseDown) {
            return;
        }
        var newX = event.clientX;
        var newY = event.clientY;

        var deltaX = newX - lastMouseX
        var newRotationMatrix = mat4.create();
        mat4.identity(newRotationMatrix);
        mat4.rotate(newRotationMatrix, degToRad(deltaX / 10), [0, 1, 0]);

        var deltaY = newY - lastMouseY;
        mat4.rotate(newRotationMatrix, degToRad(deltaY / 10), [1, 0, 0]);

        mat4.multiply(newRotationMatrix, moonRotationMatrix, moonRotationMatrix);

        lastMouseX = newX
        lastMouseY = newY;
    }




    var currentlyPressedKeys = {};

    function handleKeyDown (event) {
        currentlyPressedKeys[event.keyCode] = true;
    }


    function handleKeyUp (event) {
        currentlyPressedKeys[event.keyCode] = false;
    }

    function handleKeys () {
        if (currentlyPressedKeys[87]) {
            dis -= 0.3;
        } else if (currentlyPressedKeys[83]) {
            dis += 0.3;
        }


        if (dis<0.0) dis = 0.0;
        else if (dis>300.0) dis = 300.0;
    }





    function initBuffers() {
        

        
    }


    var tempCameraStartX = 0.0;
    var tempCameraEndX = 0.0;
    var tempCameraStartY = 0.0;
    var tempCameraEndY = 0.0;
    var currentCameraX = 0.0;
    var currentCameraY = 0.0;

    // var 
    var dt = 100;             
    var maxdt = 100;        // 300 mili second

    function calcCameraTargetPosition (vertices) {

        if (vertices.length<6) return;
        // dt = 0;
        // tempCameraStartX = currentCameraX;
        // tempCameraStartY = currentCameraY;

        var x = 0.0;
        var y = 0.0;
        var z = 0.0;
        for (var i=0; i<vertices.length/3; i++) {
            
            x += vertices[i*3];
            y += vertices[i*3+1];
            z += vertices[i*3+2];
        }

        x/=vertices.length/3;
        y/=vertices.length/3;
        z/=vertices.length/3;

        verticesAverageArray.push(x);
        verticesAverageArray.push(y);
        verticesAverageArray.push(z);
    }
    function setTargetPosition () {
        if (verticesAverageArray.length<6) return;
        dt = 0;
        tempCameraStartX = currentCameraX;
        tempCameraStartY = currentCameraY;

        var x = 0.0;
        var y = 0.0;
        var z = 0.0;
        for (var i=0; i<verticesAverageArray.length/3; i++) {
            
            x += verticesAverageArray[i*3];
            y += verticesAverageArray[i*3+1];
            z += verticesAverageArray[i*3+2];


        }

        x/=verticesAverageArray.length/3;
        y/=verticesAverageArray.length/3;
        z/=verticesAverageArray.length/3;



        tempCameraEndX = x;
        tempCameraEndY = y;

    }
    function calcCameraPositionAnimation () {
        if (dt>=maxdt) return;

        currentCameraX = tempCameraStartX + ((tempCameraEndX-tempCameraStartX)*dt/maxdt);
        currentCameraY = tempCameraStartY + ((tempCameraEndY-tempCameraStartY)*dt/maxdt);

        dt++;
    }


    
    

    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }





    var rTri = 0;
    var rSquare = 0;

    var lastTime = 0;

    function animate() {
        /*
        var timeNow = new Date().getTime();
        if (lastTime != 0) {
            var elapsed = timeNow - lastTime;

            rTri += (90 * elapsed) / 1000.0;
            rSquare += (75 * elapsed) / 1000.0;
        }
        lastTime = timeNow;
        */

        // 주기적으로 호출됨

    }

    function tick() {
        
        requestAnimFrame(tick);
        handleKeys();
        drawScene();
        animate();

    }


    function webGLStart() {
        
        var canvas = document.getElementById("lesson01-canvas");
        initGL(canvas);
        initShaders();
        initBuffers();

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);

        canvas.onmousedown = handleMouseDown;
        document.onmouseup = handleMouseUp;
        document.onmousemove = handleMouseMove;


        document.onkeydown = handleKeyDown;
        document.onkeyup = handleKeyUp;
        
    }

    



    
