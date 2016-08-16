// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('game', {
    url: '/',
    templateUrl: 'templates/game.html',
    controller: 'GameCtrl'
  })

  .state('score', {
    url: '/score',
    templateUrl: 'templates/score.html',
    controller: 'ScoreCtrl'
  })

  .state('help', {
    url: '/help',
    templateUrl: 'templates/help.html',
    controller: 'HelpCtrl'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');

})

.controller('HelpCtrl', function($scope) {

})

.controller('ScoreCtrl', function($scope, $stateParams, $window) {
  $scope.points = $window.localStorage['Points'];
  $scope.numPlayedGames = $window.localStorage['numPlayedGames'];
  $scope.numFinishedGames = $window.localStorage['numFinishedGames'];
  $scope.numWonGames = $window.localStorage['numWonGames'];
  $scope.numLostGames = $window.localStorage['numLostGames'];
  $scope.lastScores = JSON.parse($window.localStorage['lastScores']);
})

.controller('GameCtrl', function ($scope, $ionicActionSheet, $state, $window) {

  Array.prototype.last = function () {
    return this[this.length - 1];
  };

  $scope.differentColor = function(suiteA, suiteB) {    
    return (suiteA >= 0 && suiteA <= 1 && suiteB >=2 && suiteB <=3) ||
            (suiteA >= 2 && suiteA <= 3 && suiteB >=0 && suiteB <=1);
  };

  $scope.flip = function(howMany) {
    $scope.selected = null;
    $scope.selectedFrom = null;
    if($scope.stock.length > 0) {
       if($scope.waste.length > 0) {
         $scope.trash.push($scope.waste.pop());
       }
       $scope.waste.push($scope.stock.pop());
    }  
  };

  $scope.selectWasteCard = function(card) {
    if($scope.selected === card) {
      $scope.selectedFrom = null;
      $scope.selected = null;
    } else {
      $scope.selectedFrom = $scope.waste;
      $scope.selected = card;
    }
  };
  
  $scope.selectTrashCard = function(card) {
    if($scope.selected === card) {
      $scope.selectedFrom = null;
      $scope.selected = null;
    } else {
      $scope.selectedFrom = $scope.trash;
      $scope.selected = card;
    }
  };

  $scope.selectPyramidCard = function(cardIndex) {
    var card = $scope.pyramid.cards[cardIndex];
    if(card.face === $scope.face.down) {
      return;
    }
    if($scope.selected === card) {
	  $scope.selected = null;
      $scope.selectedFrom = null;
	  return;
    }
    $scope.selected = card;
    $scope.selectedFrom = $scope.pyramid;
  };

  $scope.moveSelectedToWaste = function() {
    if($scope.selected === null || $scope.selectedFrom === null) {
      return;
    }
    if($scope.selectedFrom === $scope.pyramid) { 
      var idx = $scope.selectedFrom.cards.indexOf($scope.selected);
      if(idx === -1) {
        return;
      }
      $scope.selectedFrom.enabled[idx] = 0;
      $scope.move.push($scope.selected);  
      $scope.selectedFrom.flip();    
    }
    if($scope.selectedFrom === $scope.trash) { 
      $scope.move.push($scope.selectedFrom.pop());
    }

    $scope.move.push($scope.waste.pop());
    $scope.points = $scope.points + 2;
    $scope.selected = null;
    $scope.selectedFrom = null;
  };

  $scope.moveSelectedToTrash = function() {
    if($scope.selected === null || $scope.selectedFrom === null) {
      return;
    }
    if($scope.selectedFrom === $scope.pyramid) { 
      var idx = $scope.selectedFrom.cards.indexOf($scope.selected);
      if(idx === -1) {
        return;
      }
      $scope.selectedFrom.enabled[idx] = 0;
      $scope.move.push($scope.selected);  
      $scope.selectedFrom.flip();    
    }
    if($scope.selectedFrom === $scope.waste) { 
      $scope.move.push($scope.selectedFrom.pop());
    }

    $scope.move.push($scope.trash.pop());
    $scope.selected = null;
    $scope.selectedFrom = null;
  };
  
  $scope.moveSelectedToPyramid = function(CardIndex) {
    if($scope.selected === null || $scope.selectedFrom === null) {
      return;
    }
    if($scope.selectedFrom === $scope.pyramid) {
      var idx = $scope.selectedFrom.cards.indexOf($scope.selected);
      if(idx === -1) {
        return;
      }
      if($scope.selected.val === 10) {
	$scope.selectedFrom.enabled[idx] = 0;	
        $scope.move.push($scope.selected);		
      } else {	 
	$scope.selectedFrom.enabled[idx] = 0;
	$scope.selectedFrom.enabled[CardIndex] = 0;
	  
	$scope.move.push($scope.selected);	  
	$scope.move.push($scope.pyramid.cards[CardIndex]);
      }
    } else {
      $scope.selectedFrom.pop();
      $scope.move.push($scope.selected);
      $scope.pyramid.enabled[CardIndex] = 0;
      $scope.move.push($scope.pyramid.cards[CardIndex]);

    }
	
    $scope.pyramid.flip();
	
    $scope.selected = null;
    $scope.selectedFrom = null; 
  }

  $scope.loadStorage = function() {
    try {
      $scope.numPlayedGames = parseInt($window.localStorage['numPlayedGames']);
      $scope.numFinishedGames = parseInt($window.localStorage['numFinishedGames']);
      $scope.numWonGames = parseInt($window.localStorage['numWonGames']);
      $scope.numLostGames = parseInt($window.localStorage['numLostGames']);
      $scope.lastScores = JSON.parse($window.localStorage['lastScores']);
    }
    catch(err) {
      $scope.numPlayedGames = 0;
      $scope.numFinishedGames = 0;
      $scope.numWonGames = 0;
      $scope.numLostGames = 0;
      $scope.lastScores = [];
    }
  }

  $scope.saveStorage = function() {
  }

  $scope.updateStorage = function() {
    $window.localStorage['Points'] = $scope.move.length;
    $window.localStorage['numPlayedGames'] = $scope.numPlayedGames;
    $window.localStorage['numFinishedGames'] = $scope.numFinishedGames;
    $window.localStorage['numWonGames'] = $scope.numWonGames;
    $window.localStorage['numLostGames'] = $scope.numLostGames;
    $window.localStorage['lastScores'] = JSON.stringify($scope.lastScores.slice(0,10));
  };
  
  $scope.gameOver = function() {
    var result = false;
    var encontrado = false;
    $scope.check = [];
    if($scope.stock.length === 0) {
      if ($scope.waste.length > 0) $scope.check.push($scope.waste.last());
      if ($scope.trash.length > 0) $scope.check.push($scope.trash.last());
      for(var i=0; i < $scope.pyramid.cards.length; i++) {
        if($scope.pyramid.enabled[i] && $scope.pyramid.cards[i].face == 1) 
          $scope.check.push($scope.pyramid.cards[i]);
      }
      for(var k=0; k < $scope.check.length && !encontrado; k++) {
        if($scope.check[k].val === 10)
          encontrado = true;
        else {
          for(var j=k+1; j < $scope.check.length  && !encontrado; j++) {
            if($scope.check[k].val + $scope.check[j].val === 10) {
              encontrado = true;
            }
          }
        }
      }
      if(!encontrado) {
        result = true;
        if ($scope.gaming) {
          $scope.numLostGames = $scope.numLostGames + 1;
          $scope.lastScores.unshift($scope.move.length);
          $scope.numFinishedGames = $scope.numFinishedGames + 1;
          $scope.gaming = false;
        }
      }
      else result = false;
    }

    return result;
  };

  $scope.wellDone = function() { 
    var result = false;
    if ($scope.stock.length === 0 && $scope.waste.length === 0 && $scope.trash.length === 0 && $scope.pyramid.enabled[0] === 0) {
      result = true;
      if ($scope.gaming) {
        $scope.numWonGames = $scope.numWonGames + 1;
        $scope.lastScores.unshift("40");
        $scope.numFinishedGames = $scope.numFinishedGames + 1;
        $scope.gaming = false;
        angular.element('div#firework').fireworks();
      }
    } 
    return result;
  }

  $scope.newGame = function() {
    $scope.state = [];
    $scope.face = {down: 0, up: 1};
    $scope.suites = {clubs: 0, spaids: 1, hearts: 2, diamonds: 3};
    $scope.symbols = ['♣', '♠', '♥', '♦'];
    $scope.deck = [];

    $scope.stock = [];
    $scope.waste = [];
    $scope.trash = [];
    $scope.foundations = [[], [], [], []];
    $scope.tableau = [[], [], [], [], [], [], []];
    $scope.pyramid = {
          cards: [],
          tree: [{left_child: 1, right_child: 2}, {left_child: 3, right_child: 4}, {left_child: 4, right_child: 5}, {left_child: 6, right_child: 7},
		         {left_child: 7, right_child: 8}, {left_child: 8, right_child: 9}, {left_child: 10, right_child: 11}, {left_child: 11, right_child: 12},
				 {left_child: 12, right_child: 13}, {left_child: 13, right_child: 14}, {left_child: 15, right_child: 16}, {left_child: 16, right_child: 17},
				 {left_child: 17, right_child: 18}, {left_child: 18, right_child: 19}, {left_child: 19, right_child: 20}],
		  enabled: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		   flip: function() {
             for(var i = 0; i < this.tree.length; i++) {
				 if(!this.enabled[this.tree[i].left_child] && !this.enabled[this.tree[i].right_child]) {
					 this.cards[i].face = 1;					 
				 }
			 }			   
		   }
        };
    $scope.move = [];
    $scope.check = [];
    $scope.gaming = true;

    $scope.numPlayedGames = $scope.numPlayedGames + 1;

    rendertable();

    $scope.selected = null;
    $scope.selectedFrom = null;
    
    // get a new deck of cards
    for (var suite = 0; suite < 4; suite++) {
      for (var val = 1; val < 11; val++) {
        card = {
          suite: suite,
          val: val, 
          face: $scope.face.down
        };
        $scope.deck.push(card);
      }
    }

    // shuffle the cards
    $scope.deck = shuffle($scope.deck);

    for (var p=0; p<21; p++) {
        card = $scope.deck.shift();
        card.face = p<15 ? $scope.face.down : $scope.face.up;
        $scope.pyramid.cards.push(card);  
    }  

    // put the remaining cards into the stock pile
    while($scope.deck.length > 0) {
      $scope.stock.push($scope.deck.shift());
    };
  };
  
  $scope.undo = function() {
    if($scope.state.length === 0) {
      return;
    }
    var state = $scope.state.pop();
    $scope.deck = angular.copy(state.deck);
    $scope.stock = angular.copy(state.stock);
    $scope.waste = angular.copy(state.waste);
    $scope.foundations = angular.copy(state.foundations);
    $scope.tableau = angular.copy(state.tableau);
    $scope.selected = null;
    $scope.selectedFrom = null;
  };
  
  $scope.saveState = function() {    
    $scope.state.push({
      deck: angular.copy($scope.deck),
      stock: angular.copy($scope.stock),
      waste: angular.copy($scope.waste),
      foundations: angular.copy($scope.foundations),
      tableau: angular.copy($scope.tableau),
    });    
  };
  
  var shuffle = function (o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  };

  var rendertable = function () {

    var ion_content = document.getElementById('content');
    var statusBarHeight = screen.height - window.innerHeight;

    if (ion_content.clientHeight/ion_content.clientWidth > 1) { // Portrait

      $scope.cardWidthPortrait = Math.floor((ion_content.clientWidth-60)/6);
      $scope.cardHeightPortrait = Math.floor(1.53 * $scope.cardWidthPortrait);
      $scope.pyramidTopPortrait = ion_content.clientHeight/4;
      $scope.pyramidLeftPortrait = ion_content.clientWidth/2 - $scope.cardWidthPortrait/2;

    var winc = ($scope.cardWidthPortrait/2)+4;
    var hinc = $scope.cardHeightPortrait/3;
    $scope.locationsPortrait = [{left: 0, top: 0}];
    for(var i=1; i<6; i++) {
      $scope.locationsPortrait.push({left: (-1)*i*winc, top: i*hinc});
      for(var j=1; j<=i; j++) {
        $scope.locationsPortrait.push({left: $scope.locationsPortrait.last().left + winc*2, top: i*hinc});
      }
    }

      $scope.cardHeightLandscape = Math.floor((ion_content.clientWidth-statusBarHeight)/3.5);
      $scope.cardWidthLandscape = Math.floor($scope.cardHeightLandscape/1.53);
      $scope.pyramidTopLandscape = (ion_content.clientWidth)/7; 
      $scope.pyramidLeftLandscape = (ion_content.clientHeight+statusBarHeight)/2 - $scope.cardWidthLandscape/2;

    var winc = ($scope.cardWidthLandscape/2)+4;
    var hinc = $scope.cardHeightLandscape/3;
    $scope.locationsLandscape = [{left: 0, top: 0}];
    for(var i=1; i<6; i++) {
      $scope.locationsLandscape.push({left: (-1)*i*winc, top: i*hinc});
      for(var j=1; j<=i; j++) {
        $scope.locationsLandscape.push({left: $scope.locationsLandscape.last().left + winc*2, top: i*hinc});
      }
    }
    
    } else { // Landscape

      $scope.cardWidthPortrait = Math.floor((ion_content.clientHeight-60+statusBarHeight)/6);
      $scope.cardHeightPortrait = Math.floor(1.53 * $scope.cardWidthPortrait);
      $scope.pyramidTopPortrait = ion_content.clientWidth/4;
      $scope.pyramidLeftPortrait = (ion_content.clientHeight+statusBarHeight)/2 - $scope.cardWidthPortrait/2;

    var winc = ($scope.cardWidthPortrait/2)+4;
    var hinc = $scope.cardHeightPortrait/3;
    $scope.locationsPortrait = [{left: 0, top: 0}];
    for(var i=1; i<6; i++) {
      $scope.locationsPortrait.push({left: (-1)*i*winc, top: i*hinc});
      for(var j=1; j<=i; j++) {
        $scope.locationsPortrait.push({left: $scope.locationsPortrait.last().left + winc*2, top: i*hinc});
      }
    }

      $scope.cardHeightLandscape = Math.floor(ion_content.clientHeight/3.5);
      $scope.cardWidthLandscape = Math.floor($scope.cardHeightLandscape/1.53);
      $scope.pyramidTopLandscape = ion_content.clientHeight/7; 
      $scope.pyramidLeftLandscape = ion_content.clientWidth/2 - $scope.cardWidthLandscape/2;

    var winc = ($scope.cardWidthLandscape/2)+4;
    var hinc = $scope.cardHeightLandscape/3;
    $scope.locationsLandscape = [{left: 0, top: 0}];
    for(var i=1; i<6; i++) {
      $scope.locationsLandscape.push({left: (-1)*i*winc, top: i*hinc});
      for(var j=1; j<=i; j++) {
        $scope.locationsLandscape.push({left: $scope.locationsLandscape.last().left + winc*2, top: i*hinc});
      }
    }
    }
    
  };

  $scope.loadStorage();  
  $scope.newGame();

/*    window.addEventListener("orientationchange", function() {
      //console.log(window.orientation);
      //$scope.rendertable();
      $scope.$apply(rendertable());
    }, false);

/*angular.element(window).bind('orientationchange', function () {
    rendertable();

    $scope.$apply();
});*/

  $scope.showActionsheet = function() {
    
    $ionicActionSheet.show({
      titleText: 'Solitario Pirámide',
      buttons: [
        { text: '<i class="icon ion-refresh"></i> Nueva partida' },
        { text: '<i class="icon ion-pie-graph"></i> Estadísticas' },
        { text: '<i class="icon ion-help-circled"></i> Ayuda' },
        //{ text: '<i class="icon ion-settings"></i> Configuración' },
      ],
      cancelText: 'Cancelar',
      cancel: function() {
        console.log('CANCELLED');
      },
      buttonClicked: function(index) {
        console.log('BUTTON CLICKED', index);
        switch (index) {
          case 0: $scope.newGame(); 
                  break;
          case 1: $scope.updateStorage();
                  $state.go('score');
                  break;
          case 2: $state.go('help');
                  break;
        }

        return true;
      }
    });
  };

});
