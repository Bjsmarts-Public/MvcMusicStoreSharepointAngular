function LogonController($scope, $http, $rootScope, Navigation, MyService) {
    $scope.submit = function () {
        MyService.data.username = this.user.username;
        $http
            .post('/Account/LogOn',
                {
                    UserName: this.user.username,
                    Password: this.user.password,
                })
            .success(function (response) {
                console.log('Success');

                if (response == "0") {
                    $scope.LogonValidate = "Login was unsuccessful. Please correct the errors and try again.";
                } else {
                    $scope.LogonValidate = "";
                    
                    switch (MyService.data.url) {
                        case "/ShoppingCart/OrderCart":
                            $http.post("/Account/VerificaLogeo").success(function (objUser) {
                                if (objUser != "") {
                                    MyService.data.UserId = objUser.User_id;

                                    $http.get("/ShoppingCart/GetListOdersByUserId", { params: { intUserId: MyService.data.UserId } })
                                        .success(function(orders) {
                                            $rootScope.Orders = orders;
                                            $rootScope.username = "User: " + MyService.data.username;
                                            $rootScope.Logout = "Logout";
                                            Navigation.loadTemplate("/ShoppingCart/OrderCart");
                                        })
                                        .error(function(data, status) {
                                            alert("Error, getlistOrders");
                                        });
                                }
                            })
                                .error(function (data, status) {
                   alert("Error en la transaccion");
               });
                                break;

                        case "/StoreManager/Index":
                            $http.post("/StoreManager/ListaAlbum").success(function (data) {
                                $rootScope.Albums = data;
                                $rootScope.username = "User: " + MyService.data.username;
                                $rootScope.Logout = "Logout";
                                Navigation.loadTemplate("/StoreManager/Index");

                            })
                            .error(function (data, status) {
                                alert("Error, GetListAlbums");
                            });
                            break;
                        default:
                            Navigation.loadTemplate(MyService.data.url);
                            break;
                    }
                }
            })
            .error(function () {
                alert("Error en la transaccion");
            });

    };
}

function RegisterController($scope, $http, $rootScope, Navigation, MyService) {
    $scope.submit = function () {
        MyService.data.username = this.register.username;
        if (this.register.password == this.register.confirmPassword) {
            $http
            .post('/Account/Register',
                {
                    UserName: this.register.username,
                    Email: this.register.email,
                    Password: this.register.password,
                })
            .success(function (response) {
                console.log('Success');
                // alert(response);

                if (response == "ok") {
                    $scope.RegisterValidate = "";
                    
                    switch (MyService.data.url) {
                        case "/ShoppingCart/OrderCart":
                            $http.post("/Account/VerificaLogeo").success(function (objUser) {
                                if (objUser != "") {
                                    MyService.data.UserId = objUser.User_id;

                                    $http.get("/ShoppingCart/GetListOdersByUserId", { params: { intUserId: MyService.data.UserId } })
                                        .success(function (orders) {
                                            $rootScope.Orders = orders;
                                            $rootScope.username = "User: " + MyService.data.username;
                                            $rootScope.Logout = "Logout";
                                            Navigation.loadTemplate("/ShoppingCart/OrderCart");
                                        })
                                        .error(function (data, status) {
                                            alert("Error, getlistOrders");
                                        });
                                }
                            })
                                .error(function (data, status) {
                                    alert("Error en la transaccion");
                                });
                            break;

                        case "/StoreManager/Index":
                            $http.post("/StoreManager/ListaAlbum").success(function (data) {
                                $rootScope.Albums = data;
                                $rootScope.username = "User: " + MyService.data.username;
                                $rootScope.Logout = "Logout";
                                Navigation.loadTemplate("/StoreManager/Index");

                            })
                            .error(function (data, status) {
                                alert("Error, GetListAlbums");
                            });
                            break;
                        default:
                            Navigation.loadTemplate(MyService.data.url);
                            break;
                    }

                } else {
                    $scope.RegisterValidate = "Account creation was unsuccessful. Please correct the errors and try again.";
                }
            })
            .error(function () {
                alert("Error en la transaccion");
            });
            $scope.RegisterValidate = "";
        } else {
            $scope.RegisterValidate = "Passwords are not the same";
        }


    };
}
