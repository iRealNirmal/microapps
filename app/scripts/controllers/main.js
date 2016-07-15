'use strict';

/**
 * @ngdoc functionsavenote.put(JSON.stringify(data1)).$promise.then(function(data) {
 * @name microappsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the microappsApp
 */
angular.module('microappsApp')
  .controller('MainCtrl', function ($scope,checkout,countrylist,$http,$location) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.today = () => {//iniate date
      $scope.bankAccountmandatedateOfSignature = new Date();
      $scope.transactionDueDate = new Date();
    };
    $scope.today();
    $scope.payment = false;//variable for toggle 2 forms
    $scope.clear = () => {//empty data
      $scope.bankAccountmandatedateOfSignature = null;
      $scope.transactionDueDate  = null;
    };
    $scope.validationOptions = {//form validation
        rules: {
            "bankAccount.holder": {
                required: true,
                minlength: 4,
                maxlength: 128
            },
            "bankAccount.bankName": {
                required: true,
                minlength: 1,
                maxlength: 255,
                lettersonly: true
            },
            "bankAccount.number":{
              required: true,
              minlength: 3,
              maxlength: 12,
            },
            "bankAccount.iban":{
              required: true,
              minlength: 11,
              maxlength: 27,
              iban: true
            },
            "bankAccount.bankCode":{
              required: true,
              maxlength: 12
            },
            "bankAccount.bic":{
              required: true,
              minlength: 11,
              maxlength: 11,
              bic: true
            },
            "bankAccount.country":{
              required: true,
              minlength:1
            }
        },
        messages: {
            "bankAccount.holder": {
                required: "We need your name",
                minlength: "Your name must be 4 character long",
                maxlength: "Your name must be less then 128 character long"
            },
            "bankAccount.bankName": {
                required: "You must enter a Bank Name",
                minlength: "Bank Name must be more then 1 character long and text only",
                maxlength: "Bank Name must note be more then 255 character long and text only"
            },
            "bankAccount.number": {
                required: "You must enter a Bank account number",
                minlength: "Account number must be 3 character long",
                maxlength: "Account number must not be more then 64 character long"
            },
            "bankAccount.iban": {
                required: "You must enter a IBAN",
                minlength: "IBAN must be 11 character long",
                maxlength: "IBAN must not be more then 27 character long",
                iban: "IBAN number seems like this BE68539007547034"
            },
            "bankAccount.bankCode": {
                required: "You must enter a bank code",
                maxlength: "Bank code must not be more then 12 character long"
            },
            "bankAccount.bic": {
                required: "You must enter a BIC code",
                minlength: "BIC must be 11 character long",
                maxlength: "BIC must not be more then 11 character long",
                bic: "BIC number seems like this EBILAEADXXX"
            },
            "bankAccount.country":{
                required: "Country is required",
                 minlength: "BIC must be 11 character long"
            }
        }
    }
    $scope.validatAmmount = {
      rules: {
        "amount":{
          required: true,
          maxlength: 3,
          lessThan: 101
        },
        "currency":{
          required: true,
          minlength: 1
        }
      },
      messages: {
        "amount":{
          required: "Please add ammount",
          maxlength: "amount should not be more then 100",
          lessThan: "Ammount should not be more then 100"
        },
        "currency":{
          required: "Please select currency",
          minlength: "select any 1 currency"
        }
      }
    }
     $scope.open1 = () => {//open first datepicker
      $scope.popupopen = true;
    };
    $scope.open2 = () => {//open second datepicker
      $scope.popupopen2 = true;
    };
    var timeDiff = () =>{
      var d1 = new Date(localStorage.getItem("time"));
      var d2 =new Date();
      var diff =  Math.abs(d1 - d2);
      if(Math.floor((diff/1000)/60)>60){
        localStorage.clear();
        return false;
      }else{
        return true;
      }
    }
    var session = localStorage.getItem('session');
    if(session=="yes"){//if someone has donated
      if(timeDiff()){
        $location.path('/thanks');
      }
    }else if(session=="bank"){//if basic amount form is filled and someone refreshed
      $scope.payment=true;
    }
    $scope.countrieslist = countrylist.list();//get all countries list
    $scope.amoutSubmit=(form)=>{
      $scope.amtdisabled=true;
      if(form.validate()) {
        let alldata = {
          "amount":$scope.amount,
          "currency":$scope.currency
        }
        checkout.put(alldata).$promise.then(function(data) {//prepared checkout
          localStorage.setItem("buildNumber",data.buildNumber);
          localStorage.setItem("id",data.id);
          localStorage.setItem("ndc",data.ndc);
          $scope.amtdisabled=false;
          $scope.payment=true;
          localStorage.setItem("session", "bank");
          localStorage.setItem("amount", alldata.amount);
          localStorage.setItem("currency", alldata.currency);
        });
      }
    }
    $scope.formSubmit= (form) =>{
      if(form.validate()) {
        $scope.submitting=true;
        $http({
          url: 'https://test.oppwa.com/v1/checkouts/'+localStorage.getItem("id")+'/payment',
          dataType: 'jsonp',
          data: JSON.stringify({"bankAccount.holder":$scope.accountholder,
            "bankAccount.bankName":$scope.bankAccountbankName,
            "bankAccount.number":$scope.bankAccountnumber,
            "bankAccount.iban":$scope.bankAccountiban,
            "bankAccount.country":$scope.country,
            "bankAccount.bankCode":$scope.bankcode,
            "bankAccount.bic":$scope.bankAccountbic,
            "bankAccount.mandate.id":$scope.bankAccountmandateid,
            "bankAccount.mandate.dateOfSignature":$scope.bankAccountmandatedateOfSignature,
            "transactionDueDate":$scope.transactionDueDate
          }),
        }).success((data, status, headers, config) => {//get successfull data
            localStorage.setItem("session", "yes");
            localStorage.setItem("time", data.timestamp);
            $scope.submitting=false;
            $location.path('/thanks');
        }).error((data, status, headers, config) => {//ooopss error occured
            $scope.submitting=false;
        });
      }
    	
    }
  });
