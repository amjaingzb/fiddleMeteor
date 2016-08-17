PlayersList = new Mongo.Collection('players');

if(Meteor.isClient){
  Meteor.subscribe('thePlayers');

  console.log("Only within client");

  Template.leaderboard.helpers ({
     'player':function(){
          var currentUserId = Meteor.userId();

//        return PlayersList.find() ;
//        return PlayersList.find({}, { sort: {score: -1} });
//        return PlayersList.find({}, { sort: {score: -1, name: 1} });
          console.log("currentUserId = "+currentUserId);
          return PlayersList.find( { createdBy: currentUserId },
                                      { sort: {score: -1, name: 1} });


     },
     'selectedClass':function(){
        var playerId = this._id;
        var selectedPlayer = Session.get('selectedPlayer');
        if(playerId == selectedPlayer){
          return "selected";
        }
     },
     'selectedPlayer': function(){
           var selectedPlayer = Session.get('selectedPlayer');
           return PlayersList.findOne({ _id: selectedPlayer });
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
//       PlayersList.update({ _id: selectedPlayer }, { $inc: {score: 5 }});
         Meteor.call('updateScore', selectedPlayer,5);
     },
     'click .decrement':function(){
       var selectedPlayer = Session.get('selectedPlayer');
//         PlayersList.update({ _id: selectedPlayer }, { $inc: {score: -5 }});
         Meteor.call('updateScore', selectedPlayer,-5);
     },
     'click .remove':function(){
       var selectedPlayer = Session.get('selectedPlayer');
//         PlayersList.remove({ _id: selectedPlayer });
           Meteor.call('removePlayer', selectedPlayer);
     }
  });

  Template.addPlayerForm.events({
        'submit form': function(evt){

              evt.preventDefault();
              var playerNameVar = evt.target.playerName.value;

              console.log(evt.type +"-->"+playerNameVar);
              Meteor.call('createPlayer',playerNameVar);
              evt.target.playerName.value=""; 
         }
  });

}
if(Meteor.isServer){
  console.log("Only within Server");
//  console.log(PlayersList.find().fetch());
 Meteor.publish('thePlayers', function(){
       var currentUserId = this.userId;
//       return PlayersList.find();
       return PlayersList.find({ createdBy: currentUserId });

 });

}

Meteor.methods({
      // methods go here
        'createPlayer': function(playerNameVar){
               console.log("createPlayer method");
               check(playerNameVar, String);
               var currentUserId = Meteor.userId();
               if(currentUserId){
                 PlayersList.insert({
                           name: playerNameVar,
                           score: 0,
                           createdBy: currentUserId
                 });
               }
         },
         'removePlayer': function(selectedPlayer){
               var currentUserId = Meteor.userId();
               if(currentUserId){
                 check(selectedPlayer, String);
//                 PlayersList.remove({ _id: selectedPlayer });
                 PlayersList.remove({ _id: selectedPlayer, createdBy: currentUserId });
               }
         },
         'updateScore': function(selectedPlayer, scoreValue){
               check(selectedPlayer, String);
               check(scoreValue, Number);
               var currentUserId = Meteor.userId();
               if(currentUserId){
                 PlayersList.update( { _id: selectedPlayer, createdBy: currentUserId },
                                     { $inc: {score: scoreValue} });
               }
         }
});
