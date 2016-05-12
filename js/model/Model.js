
  this.floorflag = 0;

var Polygon = function(){
  this.polyonid;
  this.exterior=[]; //float array[1,2,3,4,5,6]
  this.interior=[];
}
 Polygon.prototype.init = function(jsoncontent,maxmin_xyz) {
  this.polyonid=jsoncontent.id;
  var epoints=jsoncontent.exterior.abstractRing.value.posOrPointPropertyOrPointRep;
  for(var i=0;i<epoints.length;i++){
    var point=[epoints[i].value.value[0],epoints[i].value.value[2],epoints[i].value.value[1]];
    this.exterior=this.exterior.concat(point);
    if(floorflag==0){
      floorflag=1;
      maxmin_xyz=[point[0],point[1],point[2],point[0],point[1],point[2]];
    }
    else{
  
          maxmin_xyz[0]=Math.max(maxmin_xyz[0],point[0]);
          maxmin_xyz[1]=Math.max(maxmin_xyz[1],point[1]);
          maxmin_xyz[2]=Math.max(maxmin_xyz[2],point[2]);
          maxmin_xyz[3]=Math.min(maxmin_xyz[3],point[0]);
          maxmin_xyz[4]=Math.min(maxmin_xyz[4],point[1]);
          maxmin_xyz[5]=Math.min(maxmin_xyz[5],point[2]);
         
    }

    //
  }
  
  var ipoints=jsoncontent.interior;
  if(typeof ipoints !== 'undefined'){
    ipoints=ipoints[0].abstractRing.value.posOrPointPropertyOrPointRep;
    for(var i=0; i<ipoints.length;i++){
      var point=[ipoints[i].value.value[0],ipoints[i].value.value[2],ipoints[i].value.value[1]];
      this.interior=this.interior.concat(point);
    }
  }
  return maxmin_xyz;
};
var CellSpace = function(){
  this.cellid;
  this.cellname;
  this.geometry=[]; //Polygon array
  this.duality;
}
 CellSpace.prototype.init = function(jsoncontent,maxmin_xyz) {
  this.cellid=jsoncontent.id;
  var n=jsoncontent.name;
  if(typeof n !=='undefined'){
    this.cellname=n[0].value;
  }

  //console.log(this.cellname);
  var du=jsoncontent.duality;
  if(typeof du !=='undefined'){
    this.duality=du.href;
  }

  var geod=jsoncontent.geometry3D;
  if(typeof geod !== 'undefined'){
    var surfaces=geod.abstractSolid.value.exterior.shell.surfaceMember;
    for(var i=0;i<surfaces.length;i++){
      var polygon=new Polygon();
      maxmin_xyz=polygon.init(surfaces[i].abstractSurface.value,maxmin_xyz);
      this.geometry.push(polygon);
    }
  }
  else{
    geod=jsoncontent.geometry2D;
  }
  return maxmin_xyz;
};





var State = function(){
  this.stateid;
  //this.statename;
  this.position=[];
  this.connects=[];
  this.duality;
}
 State.prototype.init = function(jsoncontent,maxmin_xyz) {
  //console.log(JSON.stringify(jsoncontent, null, 2));
  this.stateid=jsoncontent.id;
  //statename=jsoncontent.name[0].value;
  var du=jsoncontent.duality;
  if(typeof du !== 'undefined'){
    this.duality=du.href;
  }

  var cons=jsoncontent.connects;
  if(typeof cons !== 'undefined'){
    for(var i=0;i<cons.length;i++){
      this.connects.push(cons[i].href);
    }
  }
  var geometry=jsoncontent.geometry;
  if(typeof geometry !== 'undefined'){
    var point=geometry.point.pos.value;
    this.position=[point[0],point[2],point[1]];
    if(floorflag==0){
      floorflag=1;
      maxmin_xyz=[point[0],point[2],point[1],point[0],point[2],point[1]];
    }
    else{
      maxmin_xyz[0]=Math.max(maxmin_xyz[0],point[0]);
      maxmin_xyz[1]=Math.max(maxmin_xyz[1],point[2]);
      maxmin_xyz[2]=Math.max(maxmin_xyz[2],point[1]);
      maxmin_xyz[3]=Math.min(maxmin_xyz[3],point[0]);
      maxmin_xyz[4]=Math.min(maxmin_xyz[4],point[2]);
      maxmin_xyz[5]=Math.min(maxmin_xyz[5],point[1]);
    }
  }
  return maxmin_xyz;
  //console.log(this.position);
};




var Transition=function(){
  this.transitionid;
  this.weight;
  //this.transitionname;
  this.connects=[]; //array of size 2
  this.line=[]; //point array
}
 Transition.prototype.init = function(jsoncontent,maxmin_xyz) {
  this.transitionid=jsoncontent.id;
  this.weight=jsoncontent.weight;
  var cons=jsoncontent.connects;
  for(var i=0;i<cons.length;i++){
    this.connects.push(cons[i].href);
  }
  var geometry=jsoncontent.geometry;
  if(typeof geometry !== 'undefined'){
    geometry=geometry.abstractCurve.value.posOrPointPropertyOrPointRep;
    for(var i=0;i<geometry.length;i++){
      var point=geometry[i].value.value;
      this.line=this.line.concat([point[0],point[2],point[1]]);
      if(floorflag==0){
        floorflag=1;
        maxmin_xyz=[point[0],point[2],point[1],point[0],point[2],point[1]];
      }
      else{
        maxmin_xyz[0]=Math.max(maxmin_xyz[0],point[0]);
        maxmin_xyz[1]=Math.max(maxmin_xyz[1],point[2]);
        maxmin_xyz[2]=Math.max(maxmin_xyz[2],point[1]);
        maxmin_xyz[3]=Math.min(maxmin_xyz[3],point[0]);
        maxmin_xyz[4]=Math.min(maxmin_xyz[4],point[2]);
        maxmin_xyz[5]=Math.min(maxmin_xyz[5],point[1]);
      }
    }
  }
  return maxmin_xyz;
  //console.log(this.line);
};





var graphindex=1;
var Graph = function(){
  this.graphid;
  this.graphname;
  this.stateMember=[]; //State array
  this.transitionMember=[]; //Transition array
}
 Graph.prototype.init = function(jsoncontent,maxmin_xyz) {
  //console.log(JSON.stringify(jsoncontent, null, 2));

  this.graphid=jsoncontent.id;
  if(typeof this.graphid == 'undefined'){
    this.graphid=graphindex;
    graphindex++;
  }
  var name=jsoncontent.name;
  if(typeof name !== 'undefined') {
    this.graphname=name[0].value
    if(typeof this.graphname == 'undefined'){
      this.graphname=this.graphid;
      
    }
  }
  else {
    this.graphname=this.graphid;
  }
  

  var states=jsoncontent.nodes[0].stateMember;
  if(typeof states !== 'undefined'){
    for(var i=0;i<states.length;i++){
      var state=new State();
      maxmin_xyz=state.init(states[i].state,maxmin_xyz);
      this.stateMember.push(state);
    }
  }


  var trans=jsoncontent.edges[0].transitionMember;
  if(typeof trans !== 'undefined'){
    for(var i=0;i<trans.length;i++){
      var transition=new Transition();
      maxmin_xyz=transition.init(trans[i].transition,maxmin_xyz);
      this.transitionMember.push(transition);
    }
  }
  return maxmin_xyz;
};




var InterLayerConnection=function(){
  this.connectId;
  this.topoType;//overlap,contain,equals,within,crosses,intersects
  this.stateConnects=[]; //array of size 2
  this.layerConnects=[]; //array of size 2
}





 var Indoor = function(){
    this.primalSpaceFeature=[]; //CellSpace array
    this.multiLayeredGraph=[]; //Graph array
    this.interLayerConnectionMember=[]; //InterLayerConnection array
 }
 Indoor.prototype.init = function(jsoncontent) {
  var maxmin_xyz=[];
  var cells=jsoncontent.value.primalSpaceFeatures.primalSpaceFeatures.cellSpaceMember;
  if(typeof cells !=='undefined'){
    for(var i=0;i<cells.length;i++){
      var c=new CellSpace();
      maxmin_xyz=c.init(cells[i].abstractFeature.value,maxmin_xyz);
      this.primalSpaceFeature.push(c);
    }
  }


  var layers=jsoncontent.value.multiLayeredGraph.spaceLayers[0].spaceLayerMember;
  //layers[0].space
  //console.log(jsoncontent);
  if(typeof layers !== 'undefined'){
    for(var i=0;i<layers.length;i++){
      var g=new Graph();
      maxmin_xyz=g.init(layers[i].spaceLayer,maxmin_xyz);
      this.multiLayeredGraph.push(g);
      
    }
  }
  return maxmin_xyz;


};
