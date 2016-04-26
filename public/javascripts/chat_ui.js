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
