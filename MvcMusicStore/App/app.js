
var app = angular.module('AppLayout', ['ui.bootstrap']);

app.factory('Navigation', function () {
    return {
        location: '/Home/StartPage',

        loadTemplate: function (url) {
            switch (url) {
               
                case "/ShoppingCart/OrderCart":
                    this.location = url;
                    break;

                case "/StoreManager/Index":
                    this.location = url;
                    break;

                default:
                    this.location = url;
                    break;
            }

        }
    };
});

app.factory("MyService", function () {
    return {
        data: {}
    };
});


app.controller('MainCtrl', function ($scope, Navigation, $log, $modal, $http, MyService) {
    $scope.sidebar = Navigation;
    
    $scope.logout = function () {
        $http
            .post('/Account/LogOut')
            .success(function (response) {
                $scope.response = response;
                $scope.loading = false;
                Navigation.loadTemplate("/Account/LogOn");
            })
            .error(function () {
                alert("Error en la transaccion");
            });
    };

    $scope.loadTemplate = function (url) {
        MyService.data.url = url;
        
        switch (url) {
            case "/ShoppingCart/OrderCart":
                
                $http.post("/Account/VerificaLogeo").success(function (objUser) {
                   
                    if (objUser != "") {
                        MyService.data.UserId = objUser.User_id;
                        
                        $http.get("/ShoppingCart/GetListOdersByUserId", { params: { intUserId: objUser.User_id } })
                            .success(function (response) {
                                $scope.Orders = response;
                                $scope.username = "User: " + objUser.UserName;
                                $scope.Logout = "Logout";
                                Navigation.loadTemplate("/ShoppingCart/OrderCart");
                            })
                            .error(function (data, status) {
                                alert("Error, getlistOrders");
                            });
                    } else {
                        Navigation.loadTemplate("/Account/LogOn");
                    }
                })
               .error(function (data, status) {
                   alert("Error en la transaccion");
               });
                break;
                
            case "/StoreManager/Index":
                $http.post("/Account/VerificaLogeo").success(function (objUser) {
                    
                    if (objUser != "") {
                        $http.post("/StoreManager/ListaAlbum")
                            .success(function (data) {
                            $scope.Albums = data;
                            $scope.username = "User: " + objUser.UserName;
                            $scope.Logout = "Logout";
                            Navigation.loadTemplate("/StoreManager/Index");
                        })
                            .error(function (data, status) {
                                alert("Error en la transaccion");
                            });
                    } else {
                        Navigation.loadTemplate("/Account/LogOn");
                    }
                })
                .error(function (data, status) {
                    alert("Error en la transaccion");
                });
                break;
                
            case "/Checkout/AddressAndPayment":
                $http.post("/Account/VerificaLogeo").success(function (objUser) {
                    
                        MyService.data.UserId = objUser.User_id;
                        $scope.userId = objUser.User_id;

                })
                .error(function (data, status) {
                    alert("Error en la transaccion");
                });
                Navigation.loadTemplate(url);
                break;
            default:
                Navigation.loadTemplate(url);
                break;
        }
    };

    $scope.addToCard = function (id) {
        $http
             .post('/ShoppingCart/AddToCart',
                 {
                     id: id,
                 })
             .success(function (response) {
                 //alert(response);
                 $scope.objAlbum = response;
                 $scope.cartCount = response.Count;
                 
                 $http.post("/Account/VerificaLogeo").success(function (objUser) {

                     if (objUser != "") {
                         MyService.data.UserId = objUser.User_id;
                         Navigation.loadTemplate("/ShoppingCart/Index");

                     } else {
                         Navigation.loadTemplate("/Account/LogOn");
                     }
                 })
              .error(function (data, status) {
                  alert("Error en la transaccion");
              });

             })
             .error(function () {
                 alert("Error en la transaccion");
             });
    };

    $scope.removeCart = function (id) {

        $http
             .post('/ShoppingCart/RemoveFromCart',
                 {
                     id: id,
                 })
             .success(function (response) {

                 $scope.objAlbum = response;
                 //Navigation.loadTemplate("/ShoppingCart/Index");
             })
             .error(function () {
                 alert("Error en la transaccion");
             });
    };
        
    $scope.openCreate = function (size) {
        var modalInstance = $modal.open({
            templateUrl: '/StoreManager/Create',
            controller: ModalControllerCreate,
            size: size,
            resolve: {
                data: function () {//esta es la info enviada al modal si se cargo correctamente
                    return $scope.data;
                }
            }
        });

        modalInstance.result.then(function () {

            $http.post("/StoreManager/ListaAlbum").success(function (data) {
                $scope.Albums = data;
            });
            console.log('Success');
        }, function () {

            $log.info('Modal dismissed at: ' + new Date());

        });

    };

    $scope.openEdit = function (id, size) {
        var modalInstance = $modal.open({
            templateUrl: '/StoreManager/Edit/' + id,
            controller: ModalControllerEdit,
            size: size,
            resolve: {
                data: function () {//esta es la info enviada al modal si se cargo correctamente devuelve la info a la ventana principanl index
                    MyService.data.id = id;
                    return $scope.id = id;
                }
            }
        });

        modalInstance.result.then(function () {
            $http.post("/StoreManager/ListaAlbum").success(function (data) {
                $scope.Albums = data;
            });
            console.log('Success');
        }, function () {

            $log.info('Modal dismissed at: ' + new Date());

        });

    };

    $scope.openDetails = function (id, size) {
        var modalInstance = $modal.open({
            templateUrl: '/StoreManager/Details/' + id,
            controller: ModalControllerDetails,
            size: size,
            resolve: {
                data: function () {//esta es la info enviada al modal si se cargo correctamente devuelve la info a la ventana principanl index
                    MyService.data.id = id;
                    return $scope.id = id;
                }
            }
        });

        modalInstance.result.then(function () {
            $http.post("/StoreManager/ListaAlbum").success(function (data) {
                $scope.Albums = data;
            });
            console.log('Success');
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });

    };

    $scope.openDelete = function (id, size) {
        var modalInstance = $modal.open({
            templateUrl: '/StoreManager/Delete/' + id,
            controller: ModalControllerDelete,
            size: size,
            resolve: {
                data: function () {//esta es la info enviada al modal si se cargo correctamente devuelve la info a la ventana principanl index
                    MyService.data.id = id;
                    return $scope.id = id;
                }
            }
        });

        modalInstance.result.then(function () {
            $http.post("/StoreManager/ListaAlbum").success(function (data) {
                $scope.Albums = data;
            });
            console.log('Success');
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });

    };
    
    $scope.openCreateWizard = function (url, size) {
        var modalInstance = $modal.open({
            templateUrl: '/StoreManager/WizardForm',
            controller: ModalControllerCreateWizard,
            size: size,
            resolve: {
                data: function () {//esta es la info enviada al modal si se cargo correctamente
                    MyService.data.url = url;
                    return $scope.data;
                }
            }
        });

        modalInstance.result.then(function () {

            $http.post("/StoreManager/ListaAlbum").success(function (data) {
                $scope.Albums = data;
            });
            console.log('Success');
        }, function () {

            $log.info('Modal dismissed at: ' + new Date());

        });

    };


    $scope.openDetailsOrder = function (id, size) {
        var modalInstance = $modal.open({
            templateUrl: '/ShoppingCart/Details/',
            controller: ModalControllerDetailsShoppingCart,
            size: size,
            resolve: {
                data: function () {//esta es la info enviada al modal si se cargo correctamente devuelve la info a la ventana principanl index
                    MyService.data.id = id;
                    return $scope.id = id;
                }
            }
        });

        modalInstance.result.then(function () {
            console.log('Success');
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });

    };
});

function ModalControllerCreate($scope, $rootScope, Navigation, $modalInstance, $log, $http) {

    $scope.submit = function () {

        $http
            .post('/StoreManager/Create',
                {
                    GenreId: this.data.GenreId,
                    ArtistId: this.data.ArtistId,
                    Title: this.data.Title,
                    Price: this.data.Price,
                    AlbumArtUrl: this.data.AlbumArtUrl,
                })
            .success(function (response) {

                $scope.response = response;
                $scope.loading = false;
                $modalInstance.close();
                $http.post("/StoreManager/ListaAlbum").success(function (data) {
                    $rootScope.Albums = data;
                });
            })
            .error(function () {
                alert("Error en la transaccion");
            });

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

function ModalControllerCreateWizard($scope, Navigation, $modalInstance, $log, $http, MyService) {
    if (MyService.data.url == "first") {
        $scope.locationWizard = '/StoreManager/WizardGenreArtist';
        //MyService.data.url = null;
    }
    $scope.locationWizards = function (url) {
        $scope.locationWizard = url;
    };

    var httpLstGenre = $http
               .post("/StoreManager/ObtenerListaGenre")

               .success(function (data, status) {
                   $scope.LstGenre = data;
               })
               .error(function (data, status) {
                   alert("Error en la transaccion");
               });

    var httpLstArtist = $http
               .post("/StoreManager/ObtenerListaArtist")

               .success(function (data, status) {
                   $scope.LstArtist = data;
               })
               .error(function (data, status) {
                   alert("Error en la transaccion");
               });

    $scope.Album = {};
    $scope.processForm = function () {

        $http
            .post('/StoreManager/Create',
                {
                    GenreId: this.Album.GenreId,
                    ArtistId: this.Album.ArtistId,
                    Title: this.Album.Title,
                    Price: this.Album.Price,
                    AlbumArtUrl: this.Album.AlbumArtUrl,
                })
            .success(function (response) {

                $scope.response = response;
                $scope.loading = false;
                $modalInstance.close();
            })
            .error(function () {
                alert("Error en la transaccion");
            });

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

function ModalControllerEdit($scope, Navigation, $modalInstance, $log, $http, MyService) {

    var httpObjAlbum = $http
        .post("/StoreManager/ObtenerAlbumByAlbumId", {
            intAlbumId: MyService.data.id
        })

        .success(function (data, status) {
            $scope.Album = data;
        })
        .error(function (data, status) {
            alert("Error en la transaccion");
        });

    var httpLstGenre = $http
           .post("/StoreManager/ObtenerListaGenre")

           .success(function (data, status) {
               $scope.LstGenre = data;
           })
           .error(function (data, status) {
               alert("Error en la transaccion");
           });

    var httpLstArtist = $http
               .post("/StoreManager/ObtenerListaArtist")

               .success(function (data, status) {
                   $scope.LstArtist = data;
               })
               .error(function (data, status) {
                   alert("Error en la transaccion");
               });

    //};

    $scope.submit = function () {

        $http
            .post('/StoreManager/Edit',
                {
                    AlbumId: this.Album.AlbumId,
                    GenreId: this.Album.GenreId,
                    ArtistId: this.Album.ArtistId,
                    Title: this.Album.Title,
                    Price: this.Album.Price,
                    AlbumArtUrl: this.Album.AlbumArtUrl,
                })
            .success(function (response) {

                $scope.response = response;
                $scope.loading = false;

                $modalInstance.close();
            })
            .error(function () {
                alert("Error en la transaccion");
            });

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

function ModalControllerDelete($scope, Navigation, $modalInstance, $log, $http, MyService) {
    var httpObjAlbum = $http
    .post("/StoreManager/ObtenerAlbumCompletoByAlbumId", {
        intAlbumId: MyService.data.id
    })
    .success(function (data, status) {
        $scope.Album = data;
    })
    .error(function (data, status) {
        alert("Error en la transaccion");
    });

    $scope.submit = function () {

        $http
            .post('/StoreManager/Delete',
                {
                    id: this.Album.AlbumId
                })
            .success(function (response) {
                $scope.response = response;
                $scope.loading = false;
                $modalInstance.close();
            })
            .error(function () {
                alert("Error en la transaccion");
            });

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

function ModalControllerDetails($scope, Navigation, $modalInstance, $log, $http, MyService) {

    var httpObjAlbum = $http
        .post("/StoreManager/ObtenerAlbumCompletoByAlbumId", {
            intAlbumId: MyService.data.id
        })
        .success(function (data, status) {
            $scope.Album = data;
        })
        .error(function (data, status) {
            alert("Error en la transaccion");
        });

    $scope.cancel = function () {
        $modalInstance.close();
    };
};

function ModalControllerDetailsShoppingCart($scope, Navigation, $modalInstance, $log, $http, MyService) {

    var httpObjAlbum = $http
        .get("/ShoppingCart/GetListOderDetailsByOrderId", { params: { intOrderId: MyService.data.id }})
        .success(function (orderDetailsData, status) {
            $scope.OrderDetails = orderDetailsData;
        })
        .error(function (data, status) {
            alert("Error en la transaccion");
        });

    $scope.cancel = function () {
        $modalInstance.close();
    };
};




