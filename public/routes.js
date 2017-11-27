angular.module('app.routes', ['ui.router'])

.config(function($stateProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $stateProvider
    //Page
    .state('home', {
        //Address bar url
        url: '',
        views: {
            'main': {
                templateUrl: 'views/home.html'
            }
        }
    })

    .state('image', {
        url: '/image/:id',
        views: {
            'main': {
                templateUrl: 'views/image.html',
                controller: function($scope, $stateParams) {
                    $scope.id = $stateParams.id
                }
            }
        }
    })

})
