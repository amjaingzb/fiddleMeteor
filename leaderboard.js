console.log("iRevision 0.0004");
PlayersList = new Mongo.Collection('players');
console.log("Hello World");
if(Meteor.isClient){
  console.log("Only within client");

  Template.leaderboard.helpers ({
     'player':function(){
//        return PlayersList.find() ;
 //       return PlayersList.find({}, { sort: {score: -1} });
          return PlayersList.find({}, { sort: {score: -1, name: 1} });


     },
     'selectedClass':function(){
        var playerId = this._id;
        var selectedPlayer = Session.get('selectedPlayer');
        if(playerId == selectedPlayer){
          return "selected";
        }
     }
  });

  Template.leaderboard.events({
     'click .player':function(){
       var playerId = this._id;
       console.log("u clicked a player element");
       Session.set('selectedPlayer',playerId);
//       console.log(selectedPlayer);
     },
     'click .increment':function(){
       var selectedPlayer = Session.get('selectedPlayer');
//       console.log(selectedPlayer);
//       PlayersList.update({ _id: selectedPlayer }, { score: 5 });
//       PlayersList.update({ _id: selectedPlayer }, { $set: {score: 5 }});
         PlayersList.update({ _id: selectedPlayer }, { $inc: {score: 5 }});
     },
     'click .decrement':function(){
       var selectedPlayer = Session.get('selectedPlayer');
         PlayersList.update({ _id: selectedPlayer }, { $inc: {score: -5 }});
     }
  });


}
if(Meteor.isServer){
  console.log("Only within Server");
}
