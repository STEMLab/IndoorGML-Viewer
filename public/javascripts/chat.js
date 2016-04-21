

var Polygon = function(){
  this.polyonid;
  this.exterior=[]; //float array[1,2,3,4,5,6]
  this.interior=[];
}
 Polygon.prototype.init = function(jsoncontent) {
  this.polyonid=jsoncontent.id;
  var epoints=jsoncontent.exterior.abstractRing.value.posOrPointPropertyOrPointRep;
  for(var i=0;i<epoints.length;i++){
    this.exterior=this.exterior.concat(epoints[i].value.value);
    //console.log(epoints[i].value.value+" : "+this.exterior);
  }
  var ipoints=jsoncontent.interior;
  if(typeof ipoints !== 'undefined'){
    ipoints=ipoints[0].abstractRing.value.posOrPointPropertyOrPointRep;
    for(var i=0; i<ipoints.length;i++){
      this.interior=this.interior.concat(ipoints[i].value.value);
    }
  }
};
var CellSpace = function(){
  this.cellid;
  this.cellname;
  this.geometry=[]; //Polygon array
  this.duality;
}
 CellSpace.prototype.init = function(jsoncontent) {
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
      polygon.init(surfaces[i].abstractSurface.value);
      this.geometry.push(polygon);
    }
  }
  else{
    geod=jsoncontent.geometry2D;
  }

};





var State = function(){
  this.stateid;
  //this.statename;
  this.position=[];
  this.connects=[]; 
  this.duality;
}
 State.prototype.init = function(jsoncontent) {
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
    this.position=geometry.point.pos.value;
  }
  
  //console.log(this.position);
};




var Transition=function(){
  this.transitionid;
  this.weight;
  //this.transitionname;
  this.connects=[]; //array of size 2
  this.line=[]; //point array
}
 Transition.prototype.init = function(jsoncontent) {
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
      this.line.push(geometry[i].value.value);
    }
  }
  
  //console.log(this.line);
};






var Graph = function(){
  this.graphid;
  this.graphname;
  this.stateMember=[]; //State array
  this.transitionMember=[]; //Transition array
}
 Graph.prototype.init = function(jsoncontent) {
  //console.log(JSON.stringify(jsoncontent, null, 2));
 
  this.graphid=jsoncontent.id;
  this.graphname=jsoncontent.name;
  if(typeof this.graphname == 'undefined'){
    this.graphname=this.graphid;
  }

  var states=jsoncontent.nodes[0].stateMember;
  if(typeof states !== 'undefined'){
    for(var i=0;i<states.length;i++){
      var state=new State();
      state.init(states[i].state);
      this.stateMember.push(state);
    }
  }


  var trans=jsoncontent.edges[0].transitionMember;
  if(typeof trans !== 'undefined'){
    for(var i=0;i<trans.length;i++){
      var transition=new Transition();
      transition.init(trans[i].transition);
      this.transitionMember.push(transition);
    }
  }

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
  var cells=jsoncontent.value.primalSpaceFeatures.primalSpaceFeatures.cellSpaceMember;
  for(var i=0;i<cells.length;i++){
    var c=new CellSpace();
    c.init(cells[i].abstractFeature.value);
    this.primalSpaceFeature.push(c);
  }

  var layers=jsoncontent.value.multiLayeredGraph.spaceLayers;
  for(var i=0;i<layers.length;i++){
    var g=new Graph();
    g.init(layers[i].spaceLayerMember[0].spaceLayer);
    this.multiLayeredGraph.push(g);
  }

};