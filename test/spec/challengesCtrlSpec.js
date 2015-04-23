'use strict';

describe('Challenges Controller', function() {
  var $rootScope, scope, user, ctrl, challenges, groups;

  beforeEach(function() {
    module(function($provide) {
      $provide.value('User', {});
    });

    inject(function($rootScope, $controller, Challenges, Groups){
      user = specHelper.newUser();
      user._id = "unique-user-id";

      scope = $rootScope.$new();

      // Load RootCtrl to ensure shared behaviors are loaded
      $controller('RootCtrl',  {$scope: scope, User: {user: user}});

      ctrl = $controller('ChallengesCtrl', {$scope: scope, User: {user: user}});

      challenges = Challenges;

      groups = Groups;
    });
  });

  describe('filters challenges', function() {
    var ownMem, ownNotMem, notOwnMem, notOwnNotMem;

    beforeEach(function() {
       //There are for types of challenges

       //You can be the owner and a member
       ownMem = new challenges.Challenge({
         name: 'test',
         description: 'test',
         habits: [],
         dailys: [],
         todos: [],
         rewards: [],
         leader: user._id,
         group: "test",
         timestamp: +(new Date),
         members: [user],
         official: false,
         _isMember: true
       });

       //You can be the owner and not a member
       ownNotMem = new challenges.Challenge({
         name: 'test',
         description: 'test',
         habits: [],
         dailys: [],
         todos: [],
         rewards: [],
         leader: user._id,
         group: "test",
         timestamp: +(new Date),
         members: [],
         official: false,
         _isMember: false
       });

       //You not be the owner and a member
       notOwnMem = new challenges.Challenge({
         name: 'test',
         description: 'test',
         habits: [],
         dailys: [],
         todos: [],
         rewards: [],
         leader: {_id:"test"},
         group: "test",
         timestamp: +(new Date),
         members: [user],
         official: false,
         _isMember: true
       });

       //You not be the owner and not a member
       notOwnNotMem = new challenges.Challenge({
         name: 'test',
         description: 'test',
         habits: [],
         dailys: [],
         todos: [],
         rewards: [],
         leader: {_id:"test"},
         group: "test",
         timestamp: +(new Date),
         members: [],
         official: false,
         _isMember: false
       });

       scope.search = {
         group: _.transform(groups, function(m,g){m[g._id]=true;})
       };
   });

   it("Membership - either and Owner - either", function() {
     scope.search._isMember = undefined;
     scope.search._isOwner = undefined;
     expect( scope.filterChallenges(ownMem) ).to.eql(true);
     expect( scope.filterChallenges(ownNotMem) ).to.eql(true);
     expect( scope.filterChallenges(notOwnMem) ).to.eql(true);
     expect( scope.filterChallenges(notOwnNotMem) ).to.eql(true);
   });

   it("Membership - either and Owner - true", function() {
     scope.search._isMember = undefined;
     scope.search._isOwner = true;
     expect( scope.filterChallenges(ownMem) ).to.eql(true);
     expect( scope.filterChallenges(ownNotMem) ).to.eql(true);
     expect( scope.filterChallenges(notOwnMem) ).to.eql(false);
     expect( scope.filterChallenges(notOwnNotMem) ).to.eql(false);
   });

   it("Membership - either and Owner - false", function() {
     scope.search._isMember = undefined;
     scope.search._isOwner = false;
     expect( scope.filterChallenges(ownMem) ).to.eql(false);
     expect( scope.filterChallenges(ownNotMem) ).to.eql(false);
     expect( scope.filterChallenges(notOwnMem) ).to.eql(true);
     expect( scope.filterChallenges(notOwnNotMem) ).to.eql(true);
   });

   it("Membership - true and Owner - either", function() {
     scope.search._isMember = true;
     scope.search._isOwner = undefined;
     expect( scope.filterChallenges(ownMem) ).to.eql(true);
     expect( scope.filterChallenges(ownNotMem) ).to.eql(false);
     expect( scope.filterChallenges(notOwnMem) ).to.eql(true);
     expect( scope.filterChallenges(notOwnNotMem) ).to.eql(false);
   });


   it("Membership - true and Owner - true", function() {
     scope.search._isMember = true;
     scope.search._isOwner = true;
     expect( scope.filterChallenges(ownMem) ).to.eql(true);
     expect( scope.filterChallenges(ownNotMem) ).to.eql(false);
     expect( scope.filterChallenges(notOwnMem) ).to.eql(false);
     expect( scope.filterChallenges(notOwnNotMem) ).to.eql(false);
   });

   it("Membership - true and Owner - false", function() {
     scope.search._isMember = true;
     scope.search._isOwner = false;
     expect( scope.filterChallenges(ownMem) ).to.eql(false);
     expect( scope.filterChallenges(ownNotMem) ).to.eql(false);
     expect( scope.filterChallenges(notOwnMem) ).to.eql(true);
     expect( scope.filterChallenges(notOwnNotMem) ).to.eql(false);
   });

   it("Membership - false and Owner - either", function() {
     scope.search._isMember = false;
     scope.search._isOwner = undefined;
     expect( scope.filterChallenges(ownMem) ).to.eql(false);
     expect( scope.filterChallenges(ownNotMem) ).to.eql(true);
     expect( scope.filterChallenges(notOwnMem) ).to.eql(false);
     expect( scope.filterChallenges(notOwnNotMem) ).to.eql(true);
   });

   it("Membership - false and Owner - true", function() {
     scope.search._isMember = false;
     scope.search._isOwner = true;
     expect( scope.filterChallenges(ownMem) ).to.eql(false);
     expect( scope.filterChallenges(ownNotMem) ).to.eql(true);
     expect( scope.filterChallenges(notOwnMem) ).to.eql(false);
     expect( scope.filterChallenges(notOwnNotMem) ).to.eql(false);
   });

   it("Membership - false and Owner - false", function() {
     scope.search._isMember = false;
     scope.search._isOwner = false;
     expect( scope.filterChallenges(ownMem) ).to.eql(false);
     expect( scope.filterChallenges(ownNotMem) ).to.eql(false);
     expect( scope.filterChallenges(notOwnMem) ).to.eql(false);
     expect( scope.filterChallenges(notOwnNotMem) ).to.eql(true);
   });
  });
});
