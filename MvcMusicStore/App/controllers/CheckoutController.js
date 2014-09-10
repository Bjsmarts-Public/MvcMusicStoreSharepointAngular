function AddressAndPaymentController($scope, $http, $rootScope, Navigation, MyService) {
    $scope.submitPayment = function () {
        
        $http
            .post('/Checkout/AddressAndPayment',
                {
                    UserId: this.userId,
                    FirstName: this.payment.firstName,
                    LastName: this.payment.lastName,
                    Address: this.payment.address,
                    City: this.payment.city,
                    State: this.payment.state,
                    PostalCode: this.payment.postalCode,
                    Country: this.payment.country,
                    Phone: this.payment.phone,
                    Email: this.payment.emailAddress,
                    promoCodeForm: "FREE"
                })
            .success(function (order) {

                $rootScope.OrderId = order.OrderId;
                Navigation.loadTemplate("/Checkout/Complete/" + order.OrderId);
            })
            .error(function () {
                alert("Error en la transaccion");
            });
    };
    
    var httpGetCountries = $http
               .get("/Checkout/GetListCountries")
               .success(function (response, status) {
                   
                   //console.log(data);
                   $scope.LstCountries = response;
               })
                
               .error(function (err, data) {
                  // alert("Error, CheckoutController/GetCountries");
                   console.log('Error:' + data);
                   
               });

   //$scope.colours = [
   //   { name: 'black', shade: 'dark' },
   //   { name: 'white', shade: 'light' },
   //   { name: 'red', shade: 'dark' },
   //   { name: 'blue', shade: 'dark' },
   //   { name: 'yellow', shade: 'light' }
   // ];

   // $scope.things = [];
   // $scope.selectedThing = null;

   // $scope.message = "Ready.";

   // $scope.selectedColour = $scope.colours[2]; // red.

   // $scope.disconnectedColour = { name: 'blue', shade: 'dark' };
    
   // $scope.getColours = function(callback) {
   //     callback($scope.colours);
   // };

   // $scope.colourChanged = function(value) {
   //     var colourName = value ? value.name : "none";
   //     $scope.message = "ac-change event fired for colour. New colour: " + colourName;
   // };

   // $scope.ngSwitchValue = "value";
    //$http({
    //    method: 'GET',
    //    url: '/Checkout/GetListCountries'
    //    //params: {
    //    //    api_key: 'abc'
    //    //}
    //}).then(function(obj) {
    //    $scope.data = obj.data;
    //});

    //$http.get("/Checkout/GetListCountries").then(
    //    function(response) {
    //        console.log('get', response);
    //    },
    //    function(data) {
    //        // Handle error here
    //    });
}