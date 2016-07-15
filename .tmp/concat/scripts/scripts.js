'use strict';

/**
 * @ngdoc overview
 * @name microappsApp
 * @description
 * # microappsApp
 *
 * Main module of the application.
 */

angular.module('microappsApp', ['ngAnimate', 'ngAria', 'ngCookies', 'ngMessages', 'ngResource', 'ngRoute', 'ngSanitize', 'ngTouch', 'ui.bootstrap', //bootstrap angular plugin
'ngValidate' //for form validation
]).config(["$routeProvider", function ($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl',
    controllerAs: 'main'
  }).when('/about', {
    templateUrl: 'views/about.html',
    controller: 'AboutCtrl',
    controllerAs: 'about'
  }).when('/thanks', {
    templateUrl: 'views/thanks.html',
    controller: 'ThanksCtrl',
    controllerAs: 'thanks'
  }).otherwise({
    redirectTo: '/'
  });
}]);

//added custom validator for amout
$().ready(function () {

  $.validator.addMethod("lessThan", function (value, element, param) {
    var i = parseFloat(value);
    var j = parseFloat(param);
    return i < j ? true : false;
  });
});
//added custom validator for text only
jQuery.validator.addMethod("lettersonly", function (value, element) {
  return this.optional(element) || /^[a-z]+$/i.test(value);
}, "Letters only please");
'use strict';

/**
 * @ngdoc functionsavenote.put(JSON.stringify(data1)).$promise.then(function(data) {
 * @name microappsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the microappsApp
 */
angular.module('microappsApp').controller('MainCtrl', ["$scope", "checkout", "countrylist", "$http", "$location", function ($scope, checkout, countrylist, $http, $location) {
  this.awesomeThings = ['HTML5 Boilerplate', 'AngularJS', 'Karma'];
  $scope.today = function () {
    //iniate date
    $scope.bankAccountmandatedateOfSignature = new Date();
    $scope.transactionDueDate = new Date();
  };
  $scope.today();
  $scope.payment = false; //variable for toggle 2 forms
  $scope.clear = function () {
    //empty data
    $scope.bankAccountmandatedateOfSignature = null;
    $scope.transactionDueDate = null;
  };
  $scope.validationOptions = { //form validation
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
      "bankAccount.number": {
        required: true,
        minlength: 3,
        maxlength: 12
      },
      "bankAccount.iban": {
        required: true,
        minlength: 11,
        maxlength: 27,
        iban: true
      },
      "bankAccount.bankCode": {
        required: true,
        maxlength: 12
      },
      "bankAccount.bic": {
        required: true,
        minlength: 11,
        maxlength: 11,
        bic: true
      },
      "bankAccount.country": {
        required: true,
        minlength: 1
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
      "bankAccount.country": {
        required: "Country is required",
        minlength: "BIC must be 11 character long"
      }
    }
  };
  $scope.validatAmmount = {
    rules: {
      "amount": {
        required: true,
        maxlength: 3,
        lessThan: 101
      },
      "currency": {
        required: true,
        minlength: 1
      }
    },
    messages: {
      "amount": {
        required: "Please add ammount",
        maxlength: "amount should not be more then 100",
        lessThan: "Ammount should not be more then 100"
      },
      "currency": {
        required: "Please select currency",
        minlength: "select any 1 currency"
      }
    }
  };
  $scope.open1 = function () {
    //open first datepicker
    $scope.popupopen = true;
  };
  $scope.open2 = function () {
    //open second datepicker
    $scope.popupopen2 = true;
  };
  var timeDiff = function timeDiff() {
    var d1 = new Date(localStorage.getItem("time"));
    var d2 = new Date();
    var diff = Math.abs(d1 - d2);
    if (Math.floor(diff / 1000 / 60) > 60) {
      localStorage.clear();
      return false;
    } else {
      return true;
    }
  };
  var session = localStorage.getItem('session');
  if (session == "yes") {
    //if someone has donated
    if (timeDiff()) {
      $location.path('/thanks');
    }
  } else if (session == "bank") {
    //if basic amount form is filled and someone refreshed
    $scope.payment = true;
  }
  $scope.countrieslist = countrylist.list(); //get all countries list
  $scope.amoutSubmit = function (form) {
    $scope.amtdisabled = true;
    if (form.validate()) {
      (function () {
        var alldata = {
          "amount": $scope.amount,
          "currency": $scope.currency
        };
        checkout.put(alldata).$promise.then(function (data) {
          //prepared checkout
          localStorage.setItem("buildNumber", data.buildNumber);
          localStorage.setItem("id", data.id);
          localStorage.setItem("ndc", data.ndc);
          $scope.amtdisabled = false;
          $scope.payment = true;
          localStorage.setItem("session", "bank");
          localStorage.setItem("amount", alldata.amount);
          localStorage.setItem("currency", alldata.currency);
        });
      })();
    }
  };
  $scope.formSubmit = function (form) {
    if (form.validate()) {
      $scope.submitting = true;
      $http({
        url: 'https://test.oppwa.com/v1/checkouts/' + localStorage.getItem("id") + '/payment',
        dataType: 'jsonp',
        data: JSON.stringify({ "bankAccount.holder": $scope.accountholder,
          "bankAccount.bankName": $scope.bankAccountbankName,
          "bankAccount.number": $scope.bankAccountnumber,
          "bankAccount.iban": $scope.bankAccountiban,
          "bankAccount.country": $scope.country,
          "bankAccount.bankCode": $scope.bankcode,
          "bankAccount.bic": $scope.bankAccountbic,
          "bankAccount.mandate.id": $scope.bankAccountmandateid,
          "bankAccount.mandate.dateOfSignature": $scope.bankAccountmandatedateOfSignature,
          "transactionDueDate": $scope.transactionDueDate
        })
      }).success(function (data, status, headers, config) {
        //get successfull data
        localStorage.setItem("session", "yes");
        localStorage.setItem("time", data.timestamp);
        $scope.submitting = false;
        $location.path('/thanks');
      }).error(function (data, status, headers, config) {
        //ooopss error occured
        $scope.submitting = false;
      });
    }
  };
}]);

'use strict';

/**
 * @ngdoc function
 * @name microappsApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the microappsApp
 */
angular.module('microappsApp').controller('AboutCtrl', function () {
  this.awesomeThings = ['HTML5 Boilerplate', 'AngularJS', 'Karma'];
});

'use strict';

/**
 * @ngdoc service
 * @name microappsApp.checkout
 * @description
 * # checkout
 * Service in the microappsApp.
 */
angular.module('microappsApp').service('checkout', ["$http", "$resource", function ($http, $resource) {
  // AngularJS will instantiate a singleton by calling "new" on this function
  var url = 'http://www.doma1n.tk/php/checkout.php',
      data;
  return $resource(url, {}, {
    put: {
      method: 'POST',
      data: JSON.stringify(data)
    },
    create: {
      method: 'POST'
    }
  });
}]);

'use strict';

/**
 * @ngdoc service
 * @name microappsApp.countrylist
 * @description
 * # countrylist
 * Factory in the microappsApp.
 */
angular.module('microappsApp').factory('countrylist', function () {
  var isoCountries = {
    'AF': 'Afghanistan',
    'AX': 'Aland Islands',
    'AL': 'Albania',
    'DZ': 'Algeria',
    'AS': 'American Samoa',
    'AD': 'Andorra',
    'AO': 'Angola',
    'AI': 'Anguilla',
    'AQ': 'Antarctica',
    'AG': 'Antigua And Barbuda',
    'AR': 'Argentina',
    'AM': 'Armenia',
    'AW': 'Aruba',
    'AU': 'Australia',
    'AT': 'Austria',
    'AZ': 'Azerbaijan',
    'BS': 'Bahamas',
    'BH': 'Bahrain',
    'BD': 'Bangladesh',
    'BB': 'Barbados',
    'BY': 'Belarus',
    'BE': 'Belgium',
    'BZ': 'Belize',
    'BJ': 'Benin',
    'BM': 'Bermuda',
    'BT': 'Bhutan',
    'BO': 'Bolivia',
    'BA': 'Bosnia And Herzegovina',
    'BW': 'Botswana',
    'BV': 'Bouvet Island',
    'BR': 'Brazil',
    'IO': 'British Indian Ocean Territory',
    'BN': 'Brunei Darussalam',
    'BG': 'Bulgaria',
    'BF': 'Burkina Faso',
    'BI': 'Burundi',
    'KH': 'Cambodia',
    'CM': 'Cameroon',
    'CA': 'Canada',
    'CV': 'Cape Verde',
    'KY': 'Cayman Islands',
    'CF': 'Central African Republic',
    'TD': 'Chad',
    'CL': 'Chile',
    'CN': 'China',
    'CX': 'Christmas Island',
    'CC': 'Cocos (Keeling) Islands',
    'CO': 'Colombia',
    'KM': 'Comoros',
    'CG': 'Congo',
    'CD': 'Congo, Democratic Republic',
    'CK': 'Cook Islands',
    'CR': 'Costa Rica',
    'CI': 'Cote D\'Ivoire',
    'HR': 'Croatia',
    'CU': 'Cuba',
    'CY': 'Cyprus',
    'CZ': 'Czech Republic',
    'DK': 'Denmark',
    'DJ': 'Djibouti',
    'DM': 'Dominica',
    'DO': 'Dominican Republic',
    'EC': 'Ecuador',
    'EG': 'Egypt',
    'SV': 'El Salvador',
    'GQ': 'Equatorial Guinea',
    'ER': 'Eritrea',
    'EE': 'Estonia',
    'ET': 'Ethiopia',
    'FK': 'Falkland Islands (Malvinas)',
    'FO': 'Faroe Islands',
    'FJ': 'Fiji',
    'FI': 'Finland',
    'FR': 'France',
    'GF': 'French Guiana',
    'PF': 'French Polynesia',
    'TF': 'French Southern Territories',
    'GA': 'Gabon',
    'GM': 'Gambia',
    'GE': 'Georgia',
    'DE': 'Germany',
    'GH': 'Ghana',
    'GI': 'Gibraltar',
    'GR': 'Greece',
    'GL': 'Greenland',
    'GD': 'Grenada',
    'GP': 'Guadeloupe',
    'GU': 'Guam',
    'GT': 'Guatemala',
    'GG': 'Guernsey',
    'GN': 'Guinea',
    'GW': 'Guinea-Bissau',
    'GY': 'Guyana',
    'HT': 'Haiti',
    'HM': 'Heard Island & Mcdonald Islands',
    'VA': 'Holy See (Vatican City State)',
    'HN': 'Honduras',
    'HK': 'Hong Kong',
    'HU': 'Hungary',
    'IS': 'Iceland',
    'IN': 'India',
    'ID': 'Indonesia',
    'IR': 'Iran, Islamic Republic Of',
    'IQ': 'Iraq',
    'IE': 'Ireland',
    'IM': 'Isle Of Man',
    'IL': 'Israel',
    'IT': 'Italy',
    'JM': 'Jamaica',
    'JP': 'Japan',
    'JE': 'Jersey',
    'JO': 'Jordan',
    'KZ': 'Kazakhstan',
    'KE': 'Kenya',
    'KI': 'Kiribati',
    'KR': 'Korea',
    'KW': 'Kuwait',
    'KG': 'Kyrgyzstan',
    'LA': 'Lao People\'s Democratic Republic',
    'LV': 'Latvia',
    'LB': 'Lebanon',
    'LS': 'Lesotho',
    'LR': 'Liberia',
    'LY': 'Libyan Arab Jamahiriya',
    'LI': 'Liechtenstein',
    'LT': 'Lithuania',
    'LU': 'Luxembourg',
    'MO': 'Macao',
    'MK': 'Macedonia',
    'MG': 'Madagascar',
    'MW': 'Malawi',
    'MY': 'Malaysia',
    'MV': 'Maldives',
    'ML': 'Mali',
    'MT': 'Malta',
    'MH': 'Marshall Islands',
    'MQ': 'Martinique',
    'MR': 'Mauritania',
    'MU': 'Mauritius',
    'YT': 'Mayotte',
    'MX': 'Mexico',
    'FM': 'Micronesia, Federated States Of',
    'MD': 'Moldova',
    'MC': 'Monaco',
    'MN': 'Mongolia',
    'ME': 'Montenegro',
    'MS': 'Montserrat',
    'MA': 'Morocco',
    'MZ': 'Mozambique',
    'MM': 'Myanmar',
    'NA': 'Namibia',
    'NR': 'Nauru',
    'NP': 'Nepal',
    'NL': 'Netherlands',
    'AN': 'Netherlands Antilles',
    'NC': 'New Caledonia',
    'NZ': 'New Zealand',
    'NI': 'Nicaragua',
    'NE': 'Niger',
    'NG': 'Nigeria',
    'NU': 'Niue',
    'NF': 'Norfolk Island',
    'MP': 'Northern Mariana Islands',
    'NO': 'Norway',
    'OM': 'Oman',
    'PK': 'Pakistan',
    'PW': 'Palau',
    'PS': 'Palestinian Territory, Occupied',
    'PA': 'Panama',
    'PG': 'Papua New Guinea',
    'PY': 'Paraguay',
    'PE': 'Peru',
    'PH': 'Philippines',
    'PN': 'Pitcairn',
    'PL': 'Poland',
    'PT': 'Portugal',
    'PR': 'Puerto Rico',
    'QA': 'Qatar',
    'RE': 'Reunion',
    'RO': 'Romania',
    'RU': 'Russian Federation',
    'RW': 'Rwanda',
    'BL': 'Saint Barthelemy',
    'SH': 'Saint Helena',
    'KN': 'Saint Kitts And Nevis',
    'LC': 'Saint Lucia',
    'MF': 'Saint Martin',
    'PM': 'Saint Pierre And Miquelon',
    'VC': 'Saint Vincent And Grenadines',
    'WS': 'Samoa',
    'SM': 'San Marino',
    'ST': 'Sao Tome And Principe',
    'SA': 'Saudi Arabia',
    'SN': 'Senegal',
    'RS': 'Serbia',
    'SC': 'Seychelles',
    'SL': 'Sierra Leone',
    'SG': 'Singapore',
    'SK': 'Slovakia',
    'SI': 'Slovenia',
    'SB': 'Solomon Islands',
    'SO': 'Somalia',
    'ZA': 'South Africa',
    'GS': 'South Georgia And Sandwich Isl.',
    'ES': 'Spain',
    'LK': 'Sri Lanka',
    'SD': 'Sudan',
    'SR': 'Suriname',
    'SJ': 'Svalbard And Jan Mayen',
    'SZ': 'Swaziland',
    'SE': 'Sweden',
    'CH': 'Switzerland',
    'SY': 'Syrian Arab Republic',
    'TW': 'Taiwan',
    'TJ': 'Tajikistan',
    'TZ': 'Tanzania',
    'TH': 'Thailand',
    'TL': 'Timor-Leste',
    'TG': 'Togo',
    'TK': 'Tokelau',
    'TO': 'Tonga',
    'TT': 'Trinidad And Tobago',
    'TN': 'Tunisia',
    'TR': 'Turkey',
    'TM': 'Turkmenistan',
    'TC': 'Turks And Caicos Islands',
    'TV': 'Tuvalu',
    'UG': 'Uganda',
    'UA': 'Ukraine',
    'AE': 'United Arab Emirates',
    'GB': 'United Kingdom',
    'US': 'United States',
    'UM': 'United States Outlying Islands',
    'UY': 'Uruguay',
    'UZ': 'Uzbekistan',
    'VU': 'Vanuatu',
    'VE': 'Venezuela',
    'VN': 'Viet Nam',
    'VG': 'Virgin Islands, British',
    'VI': 'Virgin Islands, U.S.',
    'WF': 'Wallis And Futuna',
    'EH': 'Western Sahara',
    'YE': 'Yemen',
    'ZM': 'Zambia',
    'ZW': 'Zimbabwe'
  };

  // Public API here
  return {
    list: function list() {
      return isoCountries;
    }
  };
});

'use strict';

/**
 * @ngdoc function
 * @name microappsApp.controller:ThanksCtrl
 * @description
 * # ThanksCtrl
 * Controller of the microappsApp
 */
angular.module('microappsApp').controller('ThanksCtrl', ["$scope", "$location", function ($scope, $location) {
  this.awesomeThings = ['HTML5 Boilerplate', 'AngularJS', 'Karma'];
  var timeDiff = function timeDiff() {
    var d1 = new Date(localStorage.getItem("time"));
    var d2 = new Date();
    var diff = Math.abs(d1 - d2);
    if (Math.floor(diff / 1000 / 60) > 60) {
      localStorage.clear();
      return false;
    } else {
      return true;
    }
  };
  if (timeDiff()) {
    $scope.donated = true;
  }
  var session = localStorage.getItem('session');
  if (session != "yes") {
    $location.path("/home");
  }
}]);

angular.module('microappsApp').run(['$templateCache', function ($templateCache) {
  'use strict';

  $templateCache.put('views/about.html', "<p>This is the about view.</p>");

  $templateCache.put('views/main.html', "<div class=\"jumbotron\"> <div id=\"ammount\"> <form method=\"post\" ng-show=\"!payment\" ng-submit=\"amoutSubmit(amountform)\" name=\"amountform\" role=\"form\" id=\"ammount-pay\" ng-validate=\"validatAmmount\" class=\"form-horizontal\"> <fieldset> <legend>Basic Info</legend> <div class=\"form-group\"> <label class=\"col-sm-3 control-label\" for=\"amount\">Ammount</label> <div class=\"col-sm-9\"> <input type=\"number\" class=\"form-control\" ng-model=\"amount\" name=\"amount\" id=\"amount\" placeholder=\"amount\"> </div> </div> <div class=\"form-group\"> <label class=\"col-sm-3 control-label\" for=\"currency\">Currency</label> <div class=\"col-sm-9\"> <select class=\"form-control col-sm-2\" name=\"currency\" ng-model=\"currency\" id=\"country\"> <option value=\"\">Select Currency</option> <option value=\"EUR\">EURO</option> <option value=\"USD\">Dollar</option> </select> </div> </div> <div class=\"form-group\"> <div class=\"col-sm-offset-3 col-sm-9\"> <button type=\"submit\" class=\"btn btn-success\" ng-disabled=\"amtdisabled\">Pay by Bank</button> </div> </div> </fieldset> </form> </div> <div id=\"bank\" ng-show=\"payment\"> <form class=\"form-horizontal\" role=\"form\" method=\"POST\" target=\"cnpIframe\" name=\"bankform\" lang=\"en\" ng-submit=\"formSubmit(bankform)\" ng-validate=\"validationOptions\"> <fieldset> <legend>Payment</legend> <div class=\"form-group\"> <label class=\"col-sm-3 control-label\" for=\"bankAccount.holder\">Account Holder's Name</label> <div class=\"col-sm-9\"> <input type=\"text\" class=\"form-control\" ng-model=\"bankAccountholder\" name=\"bankAccount.holder\" id=\"account-holder\" placeholder=\"Account Holder's Name\"> </div> </div> <div class=\"form-group\"> <label class=\"col-sm-3 control-label\" for=\"bankAccount.bankName\">Bank Name</label> <div class=\"col-sm-9\"> <input type=\"text\" class=\"form-control\" ng-model=\"bankAccountbankName\" name=\"bankAccount.bankName\" id=\"bankname\" placeholder=\"Bank Name\"> </div> </div> <div class=\"form-group\"> <label class=\"col-sm-3 control-label\" for=\"bankAccount.number\">Account Number</label> <div class=\"col-sm-9\"> <input type=\"number\" class=\"form-control\" ng-model=\"bankAccountnumber\" name=\"bankAccount.number\" id=\"account-number\" placeholder=\"Account Number\"> </div> </div> <div class=\"form-group\"> <label class=\"col-sm-3 control-label\" for=\"bankAccount.iban\">IBAN Number</label> <div class=\"col-sm-9\"> <input type=\"text\" class=\"form-control\" ng-model=\"bankAccountiban\" name=\"bankAccount.iban\" id=\"iban-number\" placeholder=\"IBAN Number\"> </div> </div> <div class=\"form-group\"> <label class=\"col-sm-3 control-label\" for=\"bankAccount.bankCode\">Bank Code</label> <div class=\"col-sm-9\"> <input type=\"text\" class=\"form-control\" ng-model=\"bankAccountbankCode\" name=\"bankAccount.bankCode\" id=\"bank-code\" placeholder=\"Bank Code\"> </div> </div> <div class=\"form-group\"> <label class=\"col-sm-3 control-label\" for=\"bankAccount.bic\">BIC/Swift Code</label> <div class=\"col-sm-9\"> <input type=\"text\" class=\"form-control\" ng-model=\"bankAccountbic\" name=\"bankAccount.bic\" id=\"bank-code\" placeholder=\"BIC Code\"> </div> </div> <div class=\"form-group\"> <label class=\"col-sm-3 control-label\" for=\"bankAccount.country\">Country</label> <div class=\"col-sm-9\"> <select class=\"form-control col-sm-2\" name=\"bankAccount.country\" ng-model=\"bankAccountcountry\" id=\"country\"> <option value=\"\">Select country</option> <option ng-repeat=\"(key, value) in countrieslist\" value=\"{{::key}}\">{{::value}}</option> </select> </div> </div> <div class=\"form-group\"> <label class=\"col-sm-3 control-label\" for=\"bankAccount.mandate.id\">Mandate ID</label> <div class=\"col-sm-9\"> <input type=\"text\" class=\"form-control\" ng-model=\"bankAccountmandateid\" name=\"bankAccount.mandate.id\" id=\"bank-code\" placeholder=\"Bank Mandate ID\"> </div> </div> <div class=\"form-group\"> <label class=\"col-sm-3 control-label\" for=\"bankAccountmandatedateOfSignature\">Mandate Signature Date</label> <div class=\"col-sm-9\"> <p class=\"input-group\"> <input type=\"text\" class=\"form-control\" uib-datepicker-popup=\"MM/dd/yyyy\" ng-model=\"bankAccountmandatedateOfSignature\" name=\"bankAccount.mandate.dateOfSignature\" id=\"mandate-date\" is-open=\"popupopen\" ng-required=\"true\" close-text=\"Close\" alt-input-formats=\"altInputFormats\" ng-focus=\"open1()\"> <span class=\"input-group-btn\"> <button type=\"button\" class=\"btn btn-default\" ng-click=\"open1()\"><i class=\"glyphicon glyphicon-calendar\"></i></button> </span> </p> </div> </div> <div class=\"form-group\"> <label class=\"col-sm-3 control-label\" for=\"transactionDueDate\">Due Date</label> <div class=\"col-sm-9\"> <p class=\"input-group\"> <input type=\"text\" class=\"form-control\" uib-datepicker-popup=\"MM/dd/yyyy\" ng-model=\"transactionDueDate\" name=\"transactionDueDate\" id=\"transaction-date\" is-open=\"popupopen2\" ng-required=\"true\" close-text=\"Close\" alt-input-formats=\"altInputFormats\" ng-focus=\"open2()\"> <span class=\"input-group-btn\"> <button type=\"button\" class=\"btn btn-default\" ng-click=\"open2()\"><i class=\"glyphicon glyphicon-calendar\"></i></button> </span> </p> </div> </div> <div class=\"form-group\"> <div class=\"col-sm-offset-3 col-sm-9\"> <button type=\"submit\" class=\"btn btn-success\" ng-disabled=\"submitting\">Pay Now</button> </div> </div> </fieldset> </form> </div> </div> <!-- <script src=\"http://test.oppwa.com/v1/paymentWidgets.js?checkoutId=EC3A98A5E2CCE343EEC655324EC1A794.sbg-vm-tx02\"></script> -->");

  $templateCache.put('views/thanks.html', "<div class=\"jumbotron\"> <h1>Thanks for your donation</h1> <div ng-if=\"donated\">We have received your donation, please come after some time.</div> </div>");
}]);
//# sourceMappingURL=scripts.js.map
