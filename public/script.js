var myApp = angular.module('myApp', ['app.routes']);

myApp.controller('mainController', ($scope, $http, $location) => {
//Get Images:
    console.log("something");
    $http.get('/images')
    .then((response) => {
        $scope.images = response.data;
    });

//Upload images:
    $scope.title = '';
    $scope.username = '';
    $scope.description = '';
    $scope.file = {};

    $scope.submit = () => {
        var file = $('input[type="file"]').get(0).files[0];
        var username = $scope.username;
        var title = $scope.title;
        var description = $scope.description;
        var formData = new FormData();
        formData.append('file', file);
        formData.append('username', username);
        formData.append('title', title);
        formData.append('description', description);
        $http({
            url: '/upload',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': undefined
            },
            transformRequest: angular.identity
        }).then(() => {

            console.log('Success!');
        });
    }

//Form functionality:
    $scope.upload = () => {
        if ($scope.username && $scope.title && $scope.description && $scope.file) {
            setTimeout(() => {
                $http.get('/images')
                .then((response) => {
                    $scope.images = response.data;
                    $scope.username = ""
                    $scope.title = ""
                    $scope.file = {}
                    $scope.description = ""
                });
            }, 3500)
        }
    }
});

//Single image view:
myApp.controller('clickedImage', ($scope, $http, $location, $stateParams) => {
    var imageUrl = '/image/' + $location.path().split('/').pop();
    console.log(imageUrl);
    $http.get(imageUrl)
    .then((response) => {
        console.log(response);
        console.log(response.data[0]);
        console.log(response.data[1]);
        $scope.singleImage = response.data[0];
        $scope.comments = response.data[1];
    });

//Add a comment:
    $scope.commentNow = function() {
        var username = $scope.username;
        var comment = $scope.comment;
        var id = $stateParams.id;

        console.log('Form data: ', username, comment, id);
        console.log('here');
        $http({
            url: '/post-comment/' + $stateParams.id,
            method: 'POST',
            data: {
                username,
                comment,
                id
            }
        })
        .then(() => {
            console.log('POSTED!');
        })
    }

//Refresh comments when user posts a new one:
    $scope.refresh = function() {
        setTimeout(()=> {
            $http.get(imageUrl)
            .then((response) => {
                console.log(response.data[1]);
                $scope.comments = response.data[1];
                $scope.comment =""
                $scope.username =""
            });
        }, 1000)
    }

//Show & hide comments:
    let message = 'See';
    $scope.message = message;
    $scope.toggle = function() {
        if (message === 'See') {
            message = 'Hide';
            $scope.message = message;
        } else if (message === 'Hide') {
            message = 'See';
            $scope.message = message;
        }
        $('#comments').slideToggle();
    }
})
