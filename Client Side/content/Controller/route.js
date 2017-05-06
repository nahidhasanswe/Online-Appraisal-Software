var myApp = angular.module('myApp', ['ngRoute','AuthApp', 'ui.bootstrap', 'angularUtils.directives.dirPagination', 'chieffancypants.loadingBar', 'angularjs-dropdown-multiselect', 'ngMessages', 'ngPassword', 'fileUploadApp', '720kb.datepicker', 'nvd3ChartDirectives']);

myApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.caseInsensitiveMatch = true;


    $routeProvider
    .when('/', {
        redirectTo: '/home'
    })
    .when('/login', {
        templateUrl: 'View/Authentication/SimplePage.html',
        controller: 'loginController'
    })
    .when('/ResetPassword', {
        templateUrl: 'View/Authentication/ResetSimple.html',
        controller: 'resetController'
    })
    .when('/home', {
        templateUrl: 'View/home.html',
        controller: 'homeController',
        authorize: true
    })
    // Employee Profile Routing
    .when('/jobDescription', {
        templateUrl: 'View/Employee/jobDescription.html',
        controller: 'jobDesController',
        authorize: true
    })
    .when('/jobObjective', {
        templateUrl: 'View/Employee/jobObjective.html',
        controller: 'jobObjectiveController',
        authorize: true
    })
    .when('/selfAppraisal', {
        templateUrl: 'View/Employee/Self_Appraisal.html',
        controller: 'selfAppraisalController',
        authorize: true
    })
    .when('/othersObjectives', {
        templateUrl: 'View/Employee/OthersObjectives.html',
        controller: 'othersObjectiveListController',
        authorize: true
    })
    .when('/MyEmployee', {
        templateUrl: '/View/Employee/MyEmployee.html',
        controller: 'myEmployeeController',
        authorize: true
    })
    //Department Profile Routing
    .when('/DepartmentalOrganogram', {
        templateUrl: 'View/Sub Admin/departmentalOrganogram.html',
        controller: 'departmentOrganogramController',
        authorize: true
    })
    .when('/PerformanceAppraisal', {
        templateUrl: 'View/Sub Admin/PerformanceAppraisal.html',
        controller: 'performanceController',
        authorize: true
    })
    .when('/objectiveList', {
        templateUrl: 'View/Sub Admin/ObjectivesList.html',
        controller: 'objectiveListController',
        authorize: true
    })
    

    /* Admin Profile Section */
    .when('/AllEmployeeList', {
        templateUrl: 'View/Super Admin/EmployeeList.html',
        controller: 'allEmployeeController',
        authorize: true
    })
    .when('/objectiveLists', {
        templateUrl: 'View/Super Admin/ObjectiveLists.html',
        controller: 'objectiveListsController',
        authorize: true
    })
    .when('/DepartmentSection', {
        templateUrl: 'View/Super Admin/DepartmentSection.html',
        controller: 'departmentSectionController',
        authorize: true
    })
    .when('/Settings', {
        templateUrl: 'View/Super Admin/Setting.html',
        controller: 'settingController',
        authorize: true
    })
    .when('/FinalReport', {
        templateUrl: 'View/Super Admin/FinalReport.html',
        controller: 'finalReportController',
        authorize: true
    })
    .when('/DeletedEmployee', {
        templateUrl: 'View/Super Admin/DeletedEmployeeList.html',
        controller: 'allDeletedEmployeeController',
        authorize: true
    })

    /* Total Organogram */
    .when('/TotalOrganogram', {
        templateUrl: 'View/Organogram/TotalOrganogram.html',
        controller: 'totalOrganogram',
        authorize: true
    })
    .when('/TotalNumberofEmployee', {
        templateUrl: 'View/TotalEmployee/EmployeeTable.html',
        controller: 'totalEmployee',
        authorize: true
    })

    .otherwise({
        redirectTo: '/'
    })
}]);

/* Inject the AuthInterceptor Services */
myApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
})

/* directive for Organogram */
myApp.directive('orgChart', function () {
    function link($scope, element, attrs) {
        var chart = new google.visualization.OrgChart(element[0]);
        $scope.$watch('chartData', function (value, oldvalue) {
            if (!value) {
                return;
            }
            var data = google.visualization.arrayToDataTable(value);
            var options = {
                'title': '',
                'allowHtml': true
            }
            chart.draw(data, options);
        })
    }
    return {
        link: link
    };
})

myApp.directive('nvd3RepeatChart', function ($compile) {
    var template = '<nvd3-line-chart data="chartData" id="exampleId" width="800" height="400" showXAxis="true" showYAxis="true" tooltips="true" interactive="true" margin="{left:50,top:50,bottom:50,right:50}" > <svg></svg> </nvd3-line-chart>';
    return {
        restrict: "E",
        rep1ace: true,
        scope: {
            data: '='
        },
        compile: function (element, attrs) {
            scope.chartData = data;
            var x = angular.element('<nvd3-line-chart data="chartData" id="exampleId" width="800" height="400" showXAxis="true" showYAxis="true" tooltips="true" interactive="true" margin="{left:50,top:50,bottom:50,right:50}" > <svg></svg> </nvd3-line-chart>');
            element.append(x);
            $compile(x);
        }
    }
});

myApp.run(function ($rootScope, $location, authService) {
    function getPath(route) {
        if (!!route && typeof (route.originalPath) === "string")
            return "'" + route.originalPath + "'";
        return "[unknown route, using otherwise]";
    }

    $rootScope.$on("$routeChangeStart", function (evt, to, from) {
        if (to.authorize === true) {
            to.resolve = to.resolve || {};
            if (!to.resolve.authorizationResolver) {
                to.resolve.authorizationResolver = function (authService) {
                    return authService.getAuthInfo();

                };
            }
        }

    });

    $rootScope.$on("$routeChangeError", function (evt, to, from, error) {
        $location.path("/login").search("returnTo", to.originalPath);
    });

    // NOT needed in authorization / logging purposes only
    $rootScope.$on("$routeChangeSuccess", function (evt, to, from) {

    });
});


myApp.config(function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = true;
})

/* Global Constant Domain Name for API */

myApp.constant('serviceBasePath', 'http://nahidswe-001-site1.atempurl.com');

myApp.controller('homeController', ['$scope', '$uibModal', '$location', 'authService', 'AdmindataSetting', function ($scope, $uibModal, $location, authService, AdmindataSetting) {

    $scope.initial = function () {
        $scope.changeButton = 'Change Password';
        $scope.isProcessing = false;
    }

    $scope.Dataload = function () {
        AdmindataSetting.getJobDescriptionChartData().then(function (response) {
            $scope.JobChart = response.data;
        })

        AdmindataSetting.getSelfAppraisalChartData().then(function (response) {
            $scope.SelfChart = response.data;
        })

        AdmindataSetting.getPerformanceAppraisalChartData().then(function (response) {
            $scope.PerformanceChart = response.data;
        })
    }

    $scope.Dataload();

    $scope.getAuthorization = function () {
        var auth = authService.getRoleName();
        $scope.Role = auth.Role;
        $scope.Name = auth.Name;
    }

    $scope.getAuthorization();

    $scope.initial();

    $scope.ChangePassword = function () {
        var modalInstance = $uibModal.open({
            templateUrl: '\View/Authentication/changePassword.html',
            controller: 'homeController',
            scope: $scope,
            size: 'md',
        });
    }

    $scope.ChangePasswordRequest = function (invalid) {
        $scope.changeButton = 'Changing...';
        $scope.isProcessing = true;

        if (!invalid) {
            authService.changePassword($scope.changePass).then(function (response) {
                swal('Success', 'Password change successfully', 'success');
                $scope.$dismiss();
            }, function (error) {
                console.log(error);
                swal('Error', 'Something is wrong', 'error');
                $scope.initial();
            })
        } else {
            $scope.initial();
        }
    }

    $scope.logout = function () {
        authService.logOut();
        $location.path('/login');

    }


    $scope.PieChart2 = function (data) {
        var pieData = [{ key: 'Submitted', y: data.submited }, { key: 'UnSubmitted', y: data.unsubmited }]
        return pieData;
    }


    $scope.xFunction = function () {
        return function (d) {
            return d.key;
        };
    }
    $scope.yFunction = function () {
        return function (d) {
            return d.y;
        };
    }

    var colorArray = ['#05860C', '#B2051A'];
    $scope.colorFunction = function () {
        return function (d, i) {
            return colorArray[i];
        };
    }


}])
myApp.controller('loginController', ['$scope', '$uibModal', '$routeParams', '$location', 'authService', 'errorService', '$window', function ($scope, $uibModal, $routeParams, $location, authService, errorService, $window) {
    
    $scope.buttonText = function () {
        $scope.loginButton = 'Login';
        $scope.forgotButton = 'Forgot Password';
        $scope.resetButton = 'Set Password';
        $scope.isProcessing = false;
    }

    $scope.buttonText();
    $scope.loginView = 1;

    $scope.ViewLoginModal = function () {
        $scope.forgotPass = { EmployeeId: '' };
        var modalInstance = $uibModal.open({
            templateUrl: '\View/Authentication/LoginModal.html',
            controller: 'loginController',
            scope: $scope,
            backdrop: 'static',
            backdropClass: 'ModalBackdrop',
            size: 'md',
        });
    }

    $scope.viewForgot = function () {
        $scope.loginView = 2;
    }


    $scope.viewLogin = function () {
        $scope.loginView = 1;
    }

    $scope.logindb = { userName: '', password: '' };
    
    $scope.Login = function (invalid) {
        $scope.loginButton = 'Requesting..';
        $scope.isProcessing = true;

        var loginData = { userName: $scope.logindb.userName, password: $scope.logindb.password };

        var returnUrl = $location.search().returnTo;
        if (!invalid) {
            authService.login(loginData).then(function (response) {
                if (returnUrl != null) {
                    $window.location.reload();
                    $location.path(returnUrl && returnUrl || "/");
                    $location.search({});
                }
                else {
                    $window.location.reload();
                    $location.path('/home');
                }
                    
            }, function (error) {
                console.log(error);
                swal('Error', error.error_description, 'error');
                console.log(error)
                $scope.buttonText();
            })
        } else {
            $scope.buttonText();
        }
    }

    $scope.Forgot = function (invalid) {
        $scope.forgotButton = 'Requesting..';
        $scope.isProcessing = true;

        if (!invalid) {
            authService.ForgotPassword($scope.forgotPass).then(function (response) {
                swal('Success', response.data, 'success');
                $window.location.reload();
            }, function (error) {
                swal('Error', error.data.message, 'error');
                $scope.buttonText();
            })
        } else {
            $scope.buttonText();
        }
    }


    $scope.OpenLoginModal = function () {
            $scope.ViewLoginModal();
    }


}])
myApp.controller('resetController', ['$scope', '$uibModal', '$routeParams', '$location', 'authService', 'errorService', '$window', function ($scope, $uibModal, $routeParams, $location, authService, errorService, $window) {

    $scope.buttonText = function () {
        $scope.resetButton = 'Set Password';
        $scope.isProcessing = false;
    }

    $scope.buttonText();

    $scope.ViewResetModal = function () {
        var modalInstance = $uibModal.open({
            templateUrl: '\View/Authentication/ResetPassword.html',
            controller: 'resetController',
            scope: $scope,
            backdrop: 'static',
            backdropClass: 'ModalBackdrop',
            size: 'md',
        });
    }

    $scope.ResetPass = { id: '', code: '', NewPassword: '', ConfirmPassword: '' };

    $scope.Reset = function (invalid) {
        $scope.resetButton = 'Resetting..';
        $scope.isProcessing = true;

        $scope.ResetPass.id = $routeParams.id;
        $scope.ResetPass.code = $routeParams.code;

        if (!invalid) {
            authService.ResetPassword($scope.ResetPass).then(function (response) {
                swal('Success', response.data, 'success');
                $location.path('/login');
                $location.search({});
            }, function (error) {
                swal('Error', error.data.message, 'error');
                $scope.buttonText();
            })
        } else {
            $scope.buttonText();
        }
    }

    $scope.OpenResetModal = function () {

        $scope.ResetPass.id = $routeParams.id;
        $scope.ResetPass.code = $routeParams.code;

        if ($scope.ResetPass.id == null || $scope.ResetPass.code == null) {
            $location.path('/login');
            $location.search({});
        } else {
            $scope.ViewResetModal();
        }
    }


}])

/* Employee Profile Section  */
myApp.controller('jobDesController', ['$scope', '$uibModal', 'Cascading', '$window', 'CreatePDF', 'EmployeeDataServices', '$route', function ($scope, $uibModal, Cascading, $window, CreatePDF, EmployeeDataServices, $route) {

    $scope.init = function () {
        $scope.AddButton = 'Save';
        $scope.isProcessing = false;
        $scope.UpdateButton = 'Update';
    }

    $scope.buttonHandle = true;

    $scope.getJobDescription = function () {
        EmployeeDataServices.getMyJobDescription('EmployeeId').then(function (response) {
            $scope.account = response.data;
            if ($scope.account.jobPurpose == null)
                $scope.buttonHandle = true;
            else
                $scope.buttonHandle = false;
        })
    }

    $scope.init();
    $scope.getJobDescription();




    //Open Modal for Add Job Description
    $scope.addDescription = function () {

        $scope.jobDescription = {};
        angular.copy($scope.account, $scope.jobDescription);

        var modalInstance = $uibModal.open({
            templateUrl: '\View/Modal View/addJobDescription.html',
            controller: 'jobDesController',
            scope: $scope,
            size: 'lg'
        });
    }

    //Open Modal for Update Job Description
    $scope.updateDescription = function () {
        var modalInstance = $uibModal.open({
            templateUrl: '\View/Modal View/UpdateJobdescription.html',
            controller: 'jobDesController',
            scope: $scope,
            size: 'lg'
        });
    }

    $scope.printJobDes = function (data) {
        var docDefination = CreatePDF.GenerateJobDescription(data);
        pdfMake.createPdf(docDefination).print();
    }
    $scope.downloadJobDes = function (data) {
        var docDefination = CreatePDF.GenerateJobDescription(data);
        pdfMake.createPdf(docDefination).download("myJob.pdf");
    }

    /* Add Job Description */
    $scope.AddJobDescription = function (data) {
        $scope.AddButton = 'Saving..';
        $scope.isProcessing = true;
        if (!data) {
            var EmployeeJobDescription = {
                JobPurposes: $scope.jobDescription.jobPurpose,
                KeyAccountabilities: $scope.jobDescription.keyAccountabilities
            }
            EmployeeDataServices.StoreJobDescription(EmployeeJobDescription).then(function () {
                swal('Successfull', 'Your Job Description is Successfully Store', 'success');
                $scope.getJobDescription();
                $scope.$dismiss();
                $route.reload();
            }, function (error) {
                swal('Error', error.data.message, 'error');
                $scope.init();
            })
        } else
            $scope.init();
    }

    /* Update Job Description */
    $scope.UpdateJobDescription = function (data) {
        $scope.UpdateButton = 'Updating...';
        $scope.isProcessing = true;
        if (!data) {
            var EmployeeJobDescription = {
                Id: $scope.account.jobdescriptionId,
                JobPurposes: $scope.account.jobPurpose,
                KeyAccountabilities: $scope.account.keyAccountabilities
            }
            EmployeeDataServices.UpdateJobDescription(EmployeeJobDescription).then(function () {
                swal('Successfull', 'Your Job Description is Successfully Store', 'success');
                $scope.getJobDescription();
                $scope.$dismiss();
                $route.reload();
            }, function (error) {
                swal('Error', 'Something is error.Try again', 'error');
                $scope.init();
            })
        } else {
            $scope.init();
        }

    }
}])
myApp.controller('jobObjectiveController', ['$scope', '$http', '$uibModal', 'EmployeeObjectiveService', '$routeParams', 'CreatePDF', 'EmployeeDataServices', '$route', function ($scope, $http, $uibModal, EmployeeObjectiveService, $routeParams, CreatePDF, EmployeeDataServices, $route) {

    $scope.init = function () {
        $scope.AddButton = 'Save';
        $scope.isProcessing = false;
        $scope.UpdateButton = 'Update';
    }

    $scope.getMyObjectiveList = function () {
        EmployeeDataServices.getMyObjective().then(function (response) {
            $scope.Objectives = response.data;
        })
    }
   
    $scope.init();
    $scope.getMyObjectiveList();

    //Column Selection 
    EmployeeObjectiveService.GetObjectiveColumnList().then(function (response) { $scope.ColumnList = response.data });
    EmployeeObjectiveService.GetObjectiveSeletedColumnList().then(function (response) { $scope.SelectedColumn = response.data });
    EmployeeObjectiveService.GetObjectiveSeletCol().then(function (response) { $scope.selectCol = response.data});

    //Change Events for Multiple dropdown
    $scope.changeEvents = {
        onItemSelect: function (item) {
            changeColumnViewShow(item);
        },
        onItemDeselect: function (item) {
            changeColumnViewShow(item);
        }
    };

    function changeColumnViewShow(item) {
        if (item.id == 1) {
            $scope.selectCol.Code = !$scope.selectCol.Code;
        } else if (item.id == 2) {
            $scope.selectCol.Title = !$scope.selectCol.Title;
        } else if (item.id == 3) {
            $scope.selectCol.KPI = !$scope.selectCol.KPI;
        } else if (item.id == 4) {
            $scope.selectCol.Target = !$scope.selectCol.Target;
        } else if (item.id == 5) {
            $scope.selectCol.Weight = !$scope.selectCol.Weight;
        } else if (item.id == 6) {
            $scope.selectCol.Note = !$scope.selectCol.Note;
        } else if (item.id == 7) {
            $scope.selectCol.Status = !$scope.selectCol.Status;
        }
    }

    //Multiple Dropsown Config
    $scope.dropConfig = {
        scrollable: true,
        scrollableHeight: '200px',
        showCheckAll: false,
        showUncheckAll: false
    }

    //Group by Pending and Approve
    EmployeeObjectiveService.getGroupItem().then(function (response) { $scope.GroupBy = response.data });

    //Open Modal for Add Objective
    $scope.addObjective = function () {
        var modalInstance = $uibModal.open({
            templateUrl: '\View/Modal View/addObejective.html',
            controller:'jobObjectiveController',
            scope: $scope,
            size: 'lg'
        });
    }

    //Open Modal for View Objective
    $scope.viewObjective = function (data) {
        $scope.objective = data;
        var modalInstance = $uibModal.open({
            templateUrl: '\View/Modal View/ObejectiveModal.html',
            controller: 'jobObjectiveController',
            scope: $scope,
            size: 'lg',
        });
    }

    //Open Modal for Update Objective
    $scope.updateObjective = function (data) {
        $scope.objectiveUpdate = {};
        angular.copy(data, $scope.objectiveUpdate);
        var modalInstance = $uibModal.open({
            templateUrl: '\View/Modal View/updateObejectiveModal.html',
            controller: 'jobObjectiveController',
            scope: $scope,
            size: 'lg'
        });
    }

    //Open Modal for Print Objective
    $scope.ReportPrint = function (data) {
        var docDefinition = CreatePDF.GenerateObjectiveReport(data);
        pdfMake.createPdf(docDefinition).print();
    }

    $scope.ReportDownload = function (data) {
        var docDefinition = CreatePDF.GenerateObjectiveReport(data);
        pdfMake.createPdf(docDefinition).download('EmployeeObjective.pdf');
    }

    $scope.GenerateExcel = function (data) {
        EmployeeDataServices.GenerateMyObjectiveList(data);
    }


    //Add the Objective
    $scope.AddObjective = function (data) {
        $scope.AddButton = 'Saving...';
        $scope.isProcessing = true;

        if (!data) {
            var Objective = {
                Title: $scope.objectiveNew.title,
                KPI: $scope.objectiveNew.kpi,
                Target: $scope.objectiveNew.target,
                Weight: $scope.objectiveNew.weight,
                Note: $scope.objectiveNew.note
            }

            EmployeeDataServices.StoreJobObjective(Objective).then(function (response) {
                swal('Successful', response.data, 'success');
                $scope.$dismiss();
                $scope.init();
                $route.reload();
            }, function (error) {
                swal('Error', error.data.message, 'error');
                $scope.init();
            })
        } else {
            $scope.init();
        } 
    }

    //Update Objective
    $scope.UpdateObjective = function (data) {
        $scope.UpdateButton = 'Updating...';
        $scope.isProcessing = true;

        if (!data) {
            var Objective = {
                Id: $scope.objectiveUpdate.objectiveId,
                Title: $scope.objectiveUpdate.title,
                KPI: $scope.objectiveUpdate.kpi,
                Target: $scope.objectiveUpdate.target,
                Weight: $scope.objectiveUpdate.weight,
                Note: $scope.objectiveUpdate.note
            }
            EmployeeDataServices.UpdateJobObjective(Objective).then(function (response) {
                swal('Updated', 'Your Objective update succeessfully', 'success');
                $scope.$dismiss();
                $route.reload();
            }, function (error) {
                swal('Error', 'Something  went wrong. Please try again', 'error');
                $scope.init();
            })
        } else
            $scope.init();

    }

}])
myApp.controller('selfAppraisalController', ['$scope', '$uibModal', 'EmployeeObjectiveService', 'EmployeeDataServices', '$route', function ($scope, $uibModal, EmployeeObjectiveService, EmployeeDataServices, $route) {
    
    $scope.initial = function () {
        $scope.uploadButton = 'Upload';
        $scope.addButton = 'Submit';
        $scope.isProcess = false;
    }

    $scope.initial();


    $scope.getSelfAppraisalList = function () {
        EmployeeDataServices.getMyAppraisalObjective().then(function (response) {
            if (response.data != null) {
                $scope.ObjectiveList = response.data;
                $scope.Objectives = $scope.ObjectiveList.objectiveSub;
            } else
                $scope.ObjectiveList = null;
        })
    }

    $scope.getSelfAppraisalList();

    $scope.addSelfAppraisal = function () {
        $scope.OverAll = {
            personalDevelopmentPlan: '',
            id: $scope.ObjectiveList.id,
            employeeId: $scope.ObjectiveList.employeeId,
            overallScore: $scope.ObjectiveList.overallScore,
            overallComment: $scope.ObjectiveList.overallComment
        }
        var modalInstance = $uibModal.open({
            templateUrl: '\View/Modal View/addAppraisalModel.html',
            controller: 'selfAppraisalController',
            scope: $scope,
            size: 'lg'
        });
    }

    $scope.selection = [];

    EmployeeObjectiveService.getAppraisalScale().then(function (response) { $scope.selection = response.data;})

    $scope.AddSelfAppraisal = function (data) {
        $scope.addButton = 'Submitting..';
        $scope.isProcess = true;

        var listObjective = [];

        angular.forEach($scope.Objectives, function (objective) {
            var singleObjective = {};
            singleObjective.Id = objective.id;
            singleObjective.SelfAppraisal = objective.selfAppraisal;
            singleObjective.Comments = objective.comments;

            listObjective.push(singleObjective);
        })

        var SelfAppraisal = {
            Id: $scope.OverAll.id,
            OverallScore: $scope.OverAll.overallScore,
            OverallComment: $scope.OverAll.overallComment,
            PersonalDevelopmentPlan: $scope.OverAll.personalDevelopmentPlan,
            ObjectiveSub: listObjective
        }

        if (!data) {
            EmployeeDataServices.postSelfAppraisal(SelfAppraisal).then(function (response) {
                swal('Success',response.data, 'success');
                $scope.$dismiss();
                $route.reload();
            }, function (error) {
                swal('Error', error.data.message, 'error');
                $scope.initial();
            })
        } else {
            $scope.initial();
        }
    }

    /* Open Modal for Upload Evidence File */
    $scope.addEvidenceFile = function (data) {
        $scope.objectiveForm = { objectiveId: data };
        var modalInstance = $uibModal.open({
            templateUrl: '\View/Modal View/fileUpload.html',
            controller: 'selfAppraisalController',
            scope: $scope,
            size: 'md'
        });
    }

    $scope.hasFile = true;

    $scope.getFiles = function ($files) {

        $scope.hasFile = false;
        $scope.imagesrc = [];

        for (var i = 0; i < $files.length; i++) {

            var reader = new FileReader();
            reader.fileName = $files[i].name;

            reader.onload = function (event) {

                var image = {};
                image.Name = event.target.fileName;
                var extn = image.Name.split(".").pop();
                image.Size = (event.total / 1024).toFixed(2);
                image.Src = provideDocImage(extn);
                $scope.imagesrc.push(image);
                $scope.$apply();
            }
            reader.readAsDataURL($files[i]);
        }

        $scope.Files = $files;
    }

    function provideDocImage(extension) {
        if (extension == 'doc' || extension == 'docx'||extension=='dot'||extension=='dotx'||extension=='dotm') {
            return '\assets/img/doc.png';
        } else if (extension == 'xlsx' || extension == 'xlsb' || extension == 'xls' || extension == 'xlsm' || extension == 'xlm') {
            return '\assets/img/excel.png';
        } else if (extension == 'pptx' || extension == 'ppt' || extension == 'pptm' || extension == 'ppsm' || extension == 'potx') {
            return '\assets/img/ppt.png';
        } else if (extension == 'pdf') {
            return '\assets/img/pdf.png';
        } else if (extension == 'rar') {
            return '\assets/img/rar.png';
        } else if (extension == 'zip') {
            return '\assets/img/zip.png';
        } else
             return '\assets/img/document.png';
    }

    $scope.RemoveImage = function () {
        $scope.hasFile = true;
        $scope.imagesrc = [];

    }

    $scope.UploadFile = function () {

        if (!$scope.hasFile) {
            $scope.uploadButton = 'Uploading..';
            $scope.isProcess = true;

            //FILL FormData WITH FILE DETAILS.
            var data = new FormData();

            angular.forEach($scope.Files, function (value, key) {
                data.append(key, value);
            });

            data.append('ObjectiveModel', angular.toJson($scope.objectiveForm))

            EmployeeObjectiveService.AddDeal(data).then(function (response) {
                $scope.initial();
                swal("Success!", "Your file is upload successfully", "success");
                $route.reload();
                $scope.$dismiss();
            }, function () {
                swal("Warning!", "Something is wrong. Please try again", "warning");
                $scope.initial();
            });
        } else
            $scope.initial();
    }

    $scope.GenerateSelfAppraisalExcel = function (data) {
        EmployeeDataServices.GenerateMySelfAppraisalList(data);
    }
    


}])

/*Department Profile Section*/
myApp.controller('othersObjectiveListController', ['$scope', '$uibModal', 'EmployeeObjectiveService', '$routeParams', 'CreatePDF', 'EmployeeDataServices', '$route', '$filter', function ($scope, $uibModal, EmployeeObjectiveService, $routeParams, CreatePDF, EmployeeDataServices, $route, $filter) {

    $scope.getOtherObjectiveList = function () {
        EmployeeDataServices.getOtherObjectiveList().then(function (response) {
            $scope.Objectives = response.data;
        })
    }

    $scope.getOtherObjectiveList();

    EmployeeObjectiveService.getGroupItem().then(function (response) { $scope.StatusBy = response.data });

    //Angular Code for Multiple column show and hide
    $scope.dropConfig = {
        scrollable: true,
        scrollableHeight: '340px',
        showCheckAll: false,
        showUncheckAll: false
    }

    EmployeeObjectiveService.getOtherObjectiveColumnList().then(function (response) { $scope.AllColumn = response.data });
    EmployeeObjectiveService.getOtherSelectedColumn().then(function (response) { $scope.SelectedColumn = response.data });
    EmployeeObjectiveService.getOtherObjectiveSelected().then(function (response) { $scope.SelectCol = response.data });


    function changeColumnViewShow(item) {
        if (item.id == 1) {
            $scope.SelectCol.EmployeeID = !$scope.SelectCol.EmployeeID;
        } else if (item.id == 2) {
            $scope.SelectCol.EmployeeName = !$scope.SelectCol.EmployeeName;
        } else if (item.id == 3) {
            $scope.SelectCol.Code = !$scope.SelectCol.Code;
        } else if (item.id == 4) {
            $scope.SelectCol.Title = !$scope.SelectCol.Title;
        } else if (item.id == 5) {
            $scope.SelectCol.KPI = !$scope.SelectCol.KPI;
        } else if (item.id == 6) {
            $scope.SelectCol.Target = !$scope.SelectCol.Target;
        } else if (item.id == 7) {
            $scope.SelectCol.Weight = !$scope.SelectCol.Weight;
        } else if (item.id == 8) {
            $scope.SelectCol.Note = !$scope.SelectCol.Note;
        } else if (item.id == 9) {
            $scope.SelectCol.Status = !$scope.SelectCol.Status;
        }
    }

    $scope.changeEvents = {
        onItemSelect: function (item) {
            changeColumnViewShow(item);
        },
        onItemDeselect: function (item) {
            changeColumnViewShow(item);
        }
    };
    //End Column hide show function


    // This Section for Pagination for Pending List
    $scope.ViewItems = [{ value: 10, id: 10 }, { value: 20, id: 20 }, { value: 50, id: 50 }, { value: 100, id: 100 }, { value: 200, id: 200 }, { value: 500, id: 500 }];
    $scope.selectItem = $scope.ViewItems[0];
    $scope.ViewPerPage = 10;
    $scope.setitemsPerPage = function (num) {
        $scope.ViewPerPage = num.value;
    }

    //This Section for Modal
    $scope.viewObjectives = function (data) {
        $scope.objective = data;
        var modalInstance = $uibModal.open({
            templateUrl: '\View/Modal View/OtherObjective.html',
            controller: 'othersObjectiveListController',
            scope: $scope,
            size: 'lg',
        });
    }

    //Open Modal for Print Objective
    $scope.ReportPrint = function (data) {
        var docDefinition = CreatePDF.GenerateObjectiveReport(data);
        pdfMake.createPdf(docDefinition).print();
    }

    $scope.ReportDownload = function (data) {
        var docDefinition = CreatePDF.GenerateObjectiveReport(data);
        pdfMake.createPdf(docDefinition).download('EmployeeObjective.pdf');
    }

    $scope.GenerateOtherObjectiveListExcel = function (data) {
        EmployeeDataServices.GenerateOtherObjectiveList(data);
    }

    $scope.ApproveObjective = function (ObjectiveId) {
        swal({
            title: "Warning!",
            text: "Are You sure to approve Objective?",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, I approve",
            cancelButtonText: "No, cancel!",
            closeOnConfirm: false,
            closeOnCancel: false,
            showLoaderOnConfirm: true
        }, function (isConfirm) {
            if (isConfirm) {
                EmployeeDataServices.isApproveObjective(ObjectiveId).then(function (response) {
                    swal({
                        title: 'Success',
                        text: 'The Objective is approve',
                        type: 'success',
                        closeOnConfirm: false
                    }, function (isConfirm) {
                        $route.reload();
                        swal.close();
                    })
                }, function (error) {
                    swal('Error', error.data.message, 'error');
                })
            } else {
                swal.close();
            }
        });
    }

    $scope.ViewObjectiveByParams = function () {
        var objectiveID = $routeParams.id;
        if (objectiveID) {
            setTimeout(function () {
                var data = ($filter('filter')($scope.Objectives, { objectiveId: objectiveID }));
                var SingleData = data[0];
                if (SingleData.objectiveId == null) {
                    swal('Error', 'The id is not exists', 'error');
                } else {
                    $scope.viewObjectives(SingleData);
                }
            }, 3000);

        }
    }

}])
myApp.controller('myEmployeeController', ['$scope', '$http', '$uibModal', 'EmployeeObjectiveService', 'CreatePDF', 'EmployeeDataServices', '$route', '$routeParams', '$filter', function ($scope, $http, $uibModal, EmployeeObjectiveService, CreatePDF, EmployeeDataServices, $route, $routeParams, $filter) {

    $scope.getEmployeeList = function () {
        EmployeeDataServices.getEmployeeList("EmployeeId").then(function (response) {
            $scope.Employees = response.data;
        })
    }

    $scope.getEmployeeList();

    // This Section for Pagination for Pending List
    $scope.ViewItems = [{ value: 10, id: 10 }, { value: 20, id: 20 }, { value: 50, id: 50 }, { value: 100, id: 100 }, { value: 200, id: 200 }];
    $scope.selectItem = $scope.ViewItems[0];
    $scope.ViewPerPage = 10;
    $scope.setitemsPerPage = function (num) {
        $scope.ViewPerPage = num.value;
    }


    $scope.StatusBy = [{ id: 1, value: '', label: 'All' }, { id: 2, value: true, label: 'Approve' }, { id: 3, value: false, label: 'Pending' }];
    $scope.selected = $scope.StatusBy[0];

    //Column Selection 
    EmployeeObjectiveService.getEmployeeColumnList().then(function (response) { $scope.ColumnList = response.data });
    EmployeeObjectiveService.getEmployeeSelectedColumn().then(function (response) { $scope.SelectedColumn = response.data });
    EmployeeObjectiveService.getEmployeeSelected().then(function (response) { $scope.selectCol = response.data });

    //Change Events for Multiple dropdown
    $scope.changeEvents = {
        onItemSelect: function (item) {
            changeColumnViewShow(item);
        },
        onItemDeselect: function (item) {
            changeColumnViewShow(item);
        }
    };

    function changeColumnViewShow(item) {
        if (item.id == 1) {
            $scope.selectCol.EmployeeID = !$scope.selectCol.EmployeeID;
        } else if (item.id == 2) {
            $scope.selectCol.EmployeeName = !$scope.selectCol.EmployeeName;
        } else if (item.id == 3) {
            $scope.selectCol.Designation = !$scope.selectCol.Designation;
        } else if (item.id == 4) {
            $scope.selectCol.Department = !$scope.selectCol.Department;
        } else if (item.id == 5) {
            $scope.selectCol.Section = !$scope.selectCol.Section;
        } else if (item.id == 6) {
            $scope.selectCol.Email = !$scope.selectCol.Email;
        } else if (item.id == 7) {
            $scope.selectCol.JoiningDate = !$scope.selectCol.JoiningDate;
        } else if (item.id == 8) {
            $scope.selectCol.JobPurpose = !$scope.selectCol.JobPurpose;
        } else if (item.id == 9) {
            $scope.selectCol.KeyAccountatibilities = !$scope.selectCol.KeyAccountatibilities;
        } else if (item.id == 10) {
            $scope.selectCol.ReportTo = !$scope.selectCol.ReportTo;
        } else if (item.id == 11) {
            $scope.selectCol.Location = !$scope.selectCol.Location;
        } else if (item.id == 12) {
            $scope.selectCol.Status = !$scope.selectCol.Status;
        }

    }

    //Multiple Dropsown Config
    $scope.dropConfig = {
        scrollable: true,
        scrollableHeight: '350px',
        showCheckAll: false,
        showUncheckAll: false
    }

    $scope.EmployeeDetails = function (data) {
        $scope.Info = data;
        var modalInstance = $uibModal.open({
            templateUrl: '\View/Modal View/MyEmployeeView.html',
            controller: 'myEmployeeController',
            scope: $scope,
            size: 'md',
        });
    }

    //Open Modal for Print Objective
    $scope.ReportPrint = function (data) {
        var docDefinition = CreatePDF.GenerateJobDescription(data);
        pdfMake.createPdf(docDefinition).print();
    }

    $scope.ReportDownload = function (data) {
        var docDefinition = CreatePDF.GenerateJobDescription(data);
        pdfMake.createPdf(docDefinition).download('EmployeeJobDescription.pdf');
    }

    $scope.GenerateOtherEmployeeExcel = function (data) {
        EmployeeDataServices.GenerateOtherEmployeeList(data);
    }

    /* Approve Job Description of Other Employee */
    $scope.ApproveJobDescription = function (EmployeeId) {
        swal({
            title: "Warning!",
            text: "Are You sure to approve Job Description",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, I agree",
            cancelButtonText: "No, cancel!",
            closeOnConfirm: false,
            closeOnCancel: false,
            showLoaderOnConfirm: true
        }, function (isConfirm) {
            if (isConfirm) {
                EmployeeDataServices.isApproveJobDescription(EmployeeId).then(function (response) {
                    swal({
                        title: 'Success',
                        text: 'The job Description is approve',
                        type: 'success',
                        closeOnConfirm: false
                    }, function (isConfirm) {
                        $route.reload();
                        swal.close();
                    })
                }, function (error) {
                    swal('Error', error.data.message, 'error');
                })
            } else {
                swal.close();
            }
        });
    }

    $scope.ViewEmployeeByParams = function () {
        var EmployeeId = $routeParams.id;
        if (EmployeeId) {
            setTimeout(function () {
                var data = ($filter('filter')($scope.Employees, { employeeId: EmployeeId }));
                var SingleData = data[0];
                if (SingleData == undefined) {
                    swal('Error', 'The employee id is not exists', 'error');
                } else {
                    $scope.EmployeeDetails(SingleData);
                }
            }, 5000);

        }
    }

}])
myApp.controller('departmentOrganogramController', ['$scope', 'HOBUdataServices', function ($scope, HOBUdataServices) {


    $scope.GenarateOrganogram = function () {
        $scope.chartData = [['Name', 'ReportsTo', 'tooltip']];

        HOBUdataServices.getOrganogramData().then(function (response) {
            var newobject = [['Name', 'ReportsTo', 'tooltip']];
            angular.forEach(response.data, function (val) {
                newobject.push(
                    [
                        {
                            v: val.employeeName,
                            f: '<div class="customBox"><div>' + (val.employeeName + ' (' + val.employeeId + ')') + '</div><div class="title">' + val.designation + '</div><div class="title">' + val.groupName + '</div></div>'
                        },
                        (val.reportToName),
                        (val.employeeName)
                    ]
                );

            });
            $scope.chartData = newobject;
        })
    }

    $scope.GenarateOrganogram();


}])
myApp.controller('performanceController', ['$scope', '$uibModal', 'HOBUServices', 'CreatePDF', 'HOBUdataServices', '$filter', '$route', function ($scope, $uibModal, HOBUServices, CreatePDF, HOBUdataServices, $filter, $route) {

    $scope.initi = function () {
        HOBUdataServices.getEmployeeListPerformanceAppraisal('EmloyeeId').then(function (response) {
            $scope.Employees = response.data;
        })

        HOBUdataServices.getObjectiveListForAppraisal().then(function (response) {
            $scope.ObjectiveList = response.data;
        })
    }
    $scope.button = function () {
        $scope.submitButton = 'Submit';
        $scope.isProcessign = false;
    }

    $scope.initi();
    $scope.button();



    /*Dropdown list for group by Approve or Pending*/
    $scope.StatusBy = [{ id: 1, value: true, label: 'Approve' }, { id: 2, value: false, label: 'Pending' }];

    /*Column Selection*/
    HOBUServices.GetPerformanceList().then(function (response) { $scope.ColumnList = response.data });
    HOBUServices.GetPerformanceSelectedList().then(function (response) { $scope.SelectedColumn = response.data });
    HOBUServices.GetPerformanceSelectedCol().then(function (response) { $scope.selectCol = response.data });

    /* Get Peformance Scale */
    HOBUServices.getAppraisalScale().then(function (response) { $scope.Scale = response.data });


    /* Change Events for Multiple dropdown */
    $scope.changeEvents = {
        onItemSelect: function (item) {
            changeColumnViewShow(item);
        },
        onItemDeselect: function (item) {
            changeColumnViewShow(item);
        }
    };

    function changeColumnViewShow(item) {
        if (item.id == 1) {
            $scope.selectCol.EmployeeId = !$scope.selectCol.EmployeeId;
        } else if (item.id == 2) {
            $scope.selectCol.EmployeeName = !$scope.selectCol.EmployeeName;
        } else if (item.id == 3) {
            $scope.selectCol.Designation = !$scope.selectCol.Designation;
        } else if (item.id == 4) {
            $scope.selectCol.Department = !$scope.selectCol.Department;
        } else if (item.id == 5) {
            $scope.selectCol.Section = !$scope.selectCol.Section;
        } else if (item.id == 6) {
            $scope.selectCol.Email = !$scope.selectCol.Email;
        } else if (item.id == 7) {
            $scope.selectCol.ReportTo = !$scope.selectCol.ReportTo;
        } else if (item.id == 8) {
            $scope.selectCol.OverallScore = !$scope.selectCol.OverallScore;
        } else if (item.id == 9) {
            $scope.selectCol.Comments = !$scope.selectCol.Comments;
        } else if (item.id == 10) {
            $scope.selectCol.PDP = !$scope.selectCol.PDP;
        } else if (item.id == 11) {
            $scope.selectCol.TotalScore = !$scope.selectCol.TotalScore;
        } else if (item.id == 12) {
            $scope.selectCol.Status = !$scope.selectCol.Status;
        }
    }

    /* Multiple Dropsown Config */
    $scope.dropConfig = {
        scrollable: true,
        scrollableHeight: '320px',
        showCheckAll: false,
        showUncheckAll: false
    }


    /* This Section for Pagination for Pending List */
    $scope.ViewItems = [{ value: 10, id: 10 }, { value: 20, id: 20 }, { value: 50, id: 50 }, { value: 100, id: 100 }, { value: 200, id: 200 }, { value: 500, id: 500 }];
    $scope.selectItem = $scope.ViewItems[0];
    $scope.ViewPerPage = 10;
    $scope.setitemsPerPage = function (num) {
        $scope.ViewPerPage = num.value;
    }

    /* This Section for Modal */
    $scope.addPerformanceAppraisal = function (data) {
        $scope.info = data;
        $scope.Objectives = ($filter('filter')($scope.ObjectiveList, { employeeId: data.employeeId }));
        var modalInstance = $uibModal.open({
            templateUrl: '\View/SubAdmin_Modal/AddPerformanceAppraisal.html',
            controller: 'performanceController',
            scope: $scope,
            size: 'lg',
        });
    }

    $scope.viewPerformanceAppraisal = function (data) {
        $scope.info = data;
        $scope.Objectives = ($filter('filter')($scope.ObjectiveList, { EmployeeId: data.EmployeeId }));
        var modalInstance = $uibModal.open({
            templateUrl: '\View/SubAdmin_Modal/ViewPerformanceAppraisal.html',
            controller: 'performanceController',
            scope: $scope,
            size: 'lg',
        });
    }

    $scope.savePerformanceAppraisal = function (data) {
        $scope.submitButton = 'Submitting..';
        $scope.isProcessign = true;

        var listAppraisal = [];
        

        angular.forEach($scope.Objectives, function (value) {
            var singlePerformanceAppraisal = {};
            singlePerformanceAppraisal.ObjectiveId = value.objectiveId;
            singlePerformanceAppraisal.Weight = value.weight;
            singlePerformanceAppraisal.PerformanceAppraisal = value.performanceAppraisal;

            listAppraisal.push(singlePerformanceAppraisal);
        })

        if (!data) {
            HOBUdataServices.postPerformanceAppraisal(listAppraisal).then(function (response) {
                swal('Success', 'Performance Appraisal submit successfully', 'success');
                $scope.$dismiss();
                $route.reload();
            }, function (error) {
                swal('Error', error.data.message, 'error');
                $scope.button();
            })
        } else {
            $scope.button();
        }
    }


    /* Open Modal for Print Objective */
    $scope.ReportPrint = function (employee,objectiveList) {
        var docDefinition = CreatePDF.GeneratePerformanceReport(employee, objectiveList);
        pdfMake.createPdf(docDefinition).print();
    }

    $scope.ReportDownload = function (employee, objectiveList) {
        var docDefinition = CreatePDF.GeneratePerformanceReport(employee, objectiveList);
        pdfMake.createPdf(docDefinition).download('EmployeePerformanceAppraisal.pdf');
    }

    $scope.GenerateAllEmployeeReport = function (data) {
        HOBUdataServices.GeneratePerformaceAppraissalList(data);
    }

}])
myApp.controller('objectiveListController', ['$scope', '$uibModal', 'HOBUServices', '$routeParams', 'CreatePDF', 'HOBUdataServices', function ($scope, $uibModal, HOBUServices, $routeParams, CreatePDF, HOBUdataServices) {

    $scope.initi = function () {
        HOBUdataServices.getObjectiveList().then(function (response) {
            $scope.Objectives = response.data;
        })
    }

    $scope.initi();


    $scope.StatusBy = [{ id: 1, value: true, label: 'Approve' }, { id: 2, value: false, label: 'Pending' }];


    //Column Selection 
    HOBUServices.GetObjectiveColumnList().then(function (response) { $scope.ColumnList = response.data });
    HOBUServices.GetObjectiveSelectedList().then(function (response) { $scope.SelectedColumn = response.data });
    HOBUServices.GetObjectiveSelectedCol().then(function (response) { $scope.selectCol = response.data });


    //Change Events for Multiple dropdown
    $scope.changeEvents = {
        onItemSelect: function (item) {
            changeColumnViewShow(item);
        },
        onItemDeselect: function (item) {
            changeColumnViewShow(item);
        }
    };

    function changeColumnViewShow(item) {
        if (item.id == 1) {
            $scope.selectCol.EmployeeId = !$scope.selectCol.EmployeeId;
        } else if (item.id == 2) {
            $scope.selectCol.EmployeeName = !$scope.selectCol.EmployeeName;
        } else if (item.id == 3) {
            $scope.selectCol.Code = !$scope.selectCol.Code;
        } else if (item.id == 4) {
            $scope.selectCol.Title = !$scope.selectCol.Title;
        } else if (item.id == 5) {
            $scope.selectCol.KPI = !$scope.selectCol.KPI;
        } else if (item.id == 6) {
            $scope.selectCol.Target = !$scope.selectCol.Target;
        } else if (item.id == 7) {
            $scope.selectCol.Weight = !$scope.selectCol.Weight;
        } else if (item.id == 8) {
            $scope.selectCol.Note = !$scope.selectCol.Note;
        } else if (item.id == 9) {
            $scope.selectCol.Status = !$scope.selectCol.Status;
        } else if (item.id == 10) {
            $scope.selectCol.SelfAppraisal = !$scope.selectCol.SelfAppraisal;
        } else if (item.id == 11) {
            $scope.selectCol.Comments = !$scope.selectCol.Comments;
        } else if (item.id == 12) {
            $scope.selectCol.EvidenceFile = !$scope.selectCol.EvidenceFile;
        } else if (item.id == 13) {
            $scope.selectCol.PerformanceAppraisal = !$scope.selectCol.PerformanceAppraisal;
        }
    }

    //Multiple Dropsown Config
    $scope.dropConfig = {
        scrollable: true,
        scrollableHeight: '320px',
        showCheckAll: false,
        showUncheckAll: false
    }


    // This Section for Pagination for Pending List
    $scope.ViewItems = [{ value: 10, id: 10 }, { value: 20, id: 20 }, { value: 50, id: 50 }, { value: 100, id: 100 }, { value: 200, id: 200 }, { value: 500, id: 500 }];
    $scope.selectItem = $scope.ViewItems[0];
    $scope.ViewPerPage = 10;
    $scope.setitemsPerPage = function (num) {
        $scope.ViewPerPage = num.value;
    }

    //This Section for Modal
    $scope.viewObjectives = function (data) {
        $scope.objective = data;
        var modalInstance = $uibModal.open({
            templateUrl: '\View/SubAdmin_Modal/ObjectiveView.html',
            controller: 'objectiveListController',
            scope: $scope,
            size: 'lg',
        });
    }


    //Open Modal for Print Objective
    $scope.ReportPrint = function (data) {
        var docDefinition = CreatePDF.GenerateOtherObjectiveReport(data);
        pdfMake.createPdf(docDefinition).print();
    }

    $scope.ReportDownload = function (data) {
        var docDefinition = CreatePDF.GenerateOtherObjectiveReport(data);
        pdfMake.createPdf(docDefinition).download('EmployeeObjectiveReport.pdf');
    }

    $scope.GenerateDepartmentObjectiveListExcel = function (data) {
        HOBUdataServices.GenerateObjectiveList(data);
    }

}])

/*Admin Section*/
myApp.controller('allEmployeeController', ['$scope', '$uibModal', 'AdminServices', 'CreatePDF', 'AdmindataServices', 'OtherDataServices', 'AdmindataSetting', '$filter', '$route', function ($scope, $uibModal, AdminServices, CreatePDF, AdmindataServices, OtherDataServices, AdmindataSetting, $filter, $route) {

    $scope.initi = function () {
        AdmindataServices.getEmployeeList('EmloyeeId').then(function (response) {
            $scope.Employees = response.data;
        })
        OtherDataServices.getDepartmentList().then(function (response) {
            $scope.DepartmentList = response.data;
        })
        OtherDataServices.getSectionList().then(function (response) {
            $scope.AllSectionList = response.data;
        })

        OtherDataServices.getDesignationList().then(function (response) {
            $scope.DesignationList = response.data;
        })

        AdmindataServices.getRoles().then(function (response) {
            $scope.Roles = response.data;
        })

        AdmindataSetting.getCompanyList().then(function (response) {
            $scope.companyList = response.data;
        })
    }
    $scope.buttonProcess = function () {
        $scope.AddButton = 'Add Employee';
        $scope.UpdateButton = 'Update Employee';
        $scope.RecoverButton = 'Recover';
        $scope.showHideButton = 'Show';
        $scope.UpdateRole = 'Update Role';
        $scope.UpdateObjectiveDeadlineButton = 'Update';
        $scope.UpdateAppraisalDeadlineButton = 'Update';
        $scope.isProcessing = false;
    }

    $scope.buttonProcess();
    $scope.initi();

    //Dropdown list for group by Approve or Pending
    $scope.StatusBy = [{ id: 1, value: true, label: 'Approve' }, { id: 2, value: false, label: 'Pending' }];

    //Column Selection 
    AdminServices.GetEmployeeColumnList().then(function (response) { $scope.ColumnList = response.data });
    AdminServices.GetEmployeeSelectedColumn().then(function (response) { $scope.SelectedColumn = response.data });
    AdminServices.GetEmployeeSelectedCol().then(function (response) { $scope.selectCol = response.data });


    /* Cascading Section for each department */
    $scope.getSectionList = function (department) {
        if (typeof department === "undefined") {
            $scope.SectionList = [];
        } else {
            $scope.SectionList = ($filter('filter')($scope.AllSectionList, { departmentId: department }));
        }
    }
    

    //Change Events for Multiple dropdown
    $scope.changeEvents = {
        onItemSelect: function (item) {
            changeColumnViewShow(item);
        },
        onItemDeselect: function (item) {
            changeColumnViewShow(item);
        }
    };

    function changeColumnViewShow(item) {
        if (item.id == 1) {
            $scope.selectCol.EmployeeId = !$scope.selectCol.EmployeeId;
        } else if (item.id == 2) {
            $scope.selectCol.EmployeeName = !$scope.selectCol.EmployeeName;
        } else if (item.id == 3) {
            $scope.selectCol.Designation = !$scope.selectCol.Designation;
        } else if (item.id == 4) {
            $scope.selectCol.Department = !$scope.selectCol.Department;
        } else if (item.id == 5) {
            $scope.selectCol.Section = !$scope.selectCol.Section;
        } else if (item.id == 6) {
            $scope.selectCol.Email = !$scope.selectCol.Email;
        } else if (item.id == 7) {
            $scope.selectCol.Location = !$scope.selectCol.Location;
        } else if (item.id == 8) {
            $scope.selectCol.JoiningDate = !$scope.selectCol.JoiningDate;
        } else if (item.id == 9) {
            $scope.selectCol.ReportTo = !$scope.selectCol.ReportTo;
        } else if (item.id == 10) {
            $scope.selectCol.ReportToDesignation = !$scope.selectCol.ReportToDesignation;
        } else if (item.id == 11) {
            $scope.selectCol.ReportToDepartment = !$scope.selectCol.ReportToDepartment;
        } else if (item.id == 12) {
            $scope.selectCol.Status = !$scope.selectCol.Status;
        }
    }

    //Multiple Dropsown Config
    $scope.dropConfig = {
        scrollable: true,
        scrollableHeight: '320px',
        showCheckAll: false,
        showUncheckAll: false
    }


    /* This Section for Pagination for Pending List */
    $scope.ViewItems = [{ value: 10, id: 10 }, { value: 20, id: 20 }, { value: 50, id: 50 }, { value: 100, id: 100 }, { value: 200, id: 200 }, { value: 500, id: 500 }];
    $scope.selectItem = $scope.ViewItems[0];
    $scope.ViewPerPage = 10;
    $scope.setitemsPerPage = function (num) {
        $scope.ViewPerPage = num.value;
    }


    $scope.AddEmployee = function () {
        $scope.EmployeeList = alasql('SELECT employeeId,employeeName,designation,department,section FROM ?', [$scope.Employees]);
        var modalInstance = $uibModal.open({
            templateUrl: '\View/Super Admin Modal/AddEmployee.html',
            controller: 'allEmployeeController',
            scope: $scope,
            size: 'md',
        });
    }

    $scope.ViewEmployee = function (data) {
        $scope.Info = data;
        var modalInstance = $uibModal.open({
            templateUrl: '\View/Super Admin Modal/EmployeeView.html',
            controller: 'allEmployeeController',
            scope: $scope,
            size: 'md',
        });
    }

    $scope.UpdateEmployee = function (data) {
        $scope.EmployeeList = alasql('SELECT employeeId,employeeName,designation,department,section FROM ?', [$scope.Employees]);
        $scope.Info = {};
        angular.copy(data, $scope.Info);
        $scope.Info.joiningDate = new Date($scope.Info.joiningDate);
        $scope.SectionList = $scope.AllSectionList;
        var modalInstance = $uibModal.open({
            templateUrl: '\View/Super Admin Modal/EmployeeUpdate.html',
            controller: 'allEmployeeController',
            scope: $scope,
            size: 'md',
        });
    }

    $scope.RemoveEmployee = function (data) {
        swal({
            title: "Warning!",
            text: "Are You sure remove the Employee "+data.employeeName+ "?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, I do",
            cancelButtonText: "No, cancel!",
            closeOnConfirm: false,
            closeOnCancel: false,
            showLoaderOnConfirm: true
        }, function (isConfirm) {
            if (isConfirm) {
                AdmindataServices.RemoveEmployee(data.employeeId).then(function (response) {
                    swal("Success", "You have successfully remove the Employee " + data.employeeName, "success");
                    $route.reload();
                }, function (error) {
                    swal("Error", error.data.message, "error");
                })

            } else {
                swal.close();
            }
        });
    }

    $scope.ViewObjective = function (EmployeeID) {
        $scope.EmployeeObjectives = [];
        $scope.EmployeeInfo = {};

        AdmindataServices.getSingleEmployee(EmployeeID).then(function (response) {
            $scope.EmployeeInfo = response.data;
            $scope.EmployeeObjectives = $scope.EmployeeInfo.objectiveSub;
            
            var modalInstance = $uibModal.open({
                templateUrl: '\View/Super Admin Modal/ObjectiveView.html',
                controller: 'allEmployeeController',
                scope: $scope,
                size: 'md',
            });
        }, function (error) {
            swal('Warning','The Employee does not set any objective yet','warning');
        })

       
    }

    $scope.Settings = function (data) {
        $scope.Info = data;
        $scope.Recovery = { New: '', Confirm: '' };
        
        $scope.Info.jobObjectiveDeadline = new Date($scope.Info.jobObjectiveDeadline);
        $scope.Info.selfAppraisalDeadline = new Date($scope.Info.selfAppraisalDeadline);

        var modalInstance = $uibModal.open({
            templateUrl: '\View/Super Admin Modal/Settings.html',
            controller: 'allEmployeeController',
            scope: $scope,
            size: 'md',
        });
    }

    $scope.showRecoverPanel = function () {
        $scope.enable = !$scope.enable;
    }
    
    $scope.showDeadLinePanel = function () {
        $scope.enableDeadlinePanel = !$scope.enableDeadlinePanel;
        $scope.showHideButton='Hide';
        if($scope.enableDeadlinePanel)
            $scope.showHideButton = 'Hide';
        else
            $scope.showHideButton = 'Show';

    }

    $scope.RecoverPassword = function (data , employeeId) {
        $scope.RecoverButton = 'Recovering..';
        $scope.isProcessing = true;

        $scope.RecoveryPass = { EmployeeId: employeeId, NewPassword: $scope.Recovery.New, ConfirmPassword: $scope.Recovery.Confirm };
        if (!data) {
            AdmindataServices.RecoverPassword($scope.RecoveryPass).then(function (response) {
                $scope.$dismiss();
                swal('Success', 'Password Set Successfully', 'success');
            }, function (error) {
                swal('Error', 'Something wrong', 'error');
                console.log(error)
                $scope.buttonProcess();

            })
        } else {
            $scope.buttonProcess();
        }
    }

    $scope.LockUser = function (data) {
        if (!data.isLocked) {
            swal({
                title: "Warning!",
                text: "Are You sure Unlock the User",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, Unlock!",
                cancelButtonText: "No, cancel!",
                closeOnConfirm: false,
                closeOnCancel: false,
                showLoaderOnConfirm: true
            }, function (isConfirm) {
                if (isConfirm) {

                    var LockData = {
                        EmployeeId: data.employeeId,
                        isLocked: data.isLocked
                    }

                    AdmindataServices.LockedUser(LockData).then(function (response) {
                        swal("Good News", "You have successfully Unlock the User", "success");
                    }, function (error) {
                        swal("Error", error.data.message, "error");
                        data.isLocked = !data.isLocked;
                        $scope.Info = data;
                        $scope.$apply();
                    })
                } else {
                    data.isLocked = !data.isLocked;
                    $scope.Info = data;
                    $scope.$apply();
                    swal.close();
                }
            });
        } else {
            swal({
                title: "Warning!",
                text: "Are You sure lock the User",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, Lock!",
                cancelButtonText: "No, cancel!",
                closeOnConfirm: false,
                closeOnCancel: false,
                showLoaderOnConfirm: true
            }, function (isConfirm) {
                if (isConfirm) {
                    var LockData = {
                        EmployeeId: data.employeeId,
                        isLocked: data.isLocked
                    }

                    AdmindataServices.LockedUser(LockData).then(function (response) {
                        swal("Good News", "You have successfully lock the User", "success");
                    }, function (error) {
                        swal("Error", error.data.message, "error");
                        data.isLocked = !data.isLocked;
                        $scope.Info = data;
                        $scope.$apply();
                    })

                } else {
                    data.isLocked = !data.isLocked;
                    $scope.Info = data;
                    $scope.$apply();
                    swal.close();
                }
            });
        }
    }


    /* Store Processing */
    $scope.StoreEmployee = function (data) {
        $scope.AddButton = 'Storing..';
        $scope.isProcessing = true;

        if (!data) {
            var Employee = {
                EmployeeId: $scope.New.EmployeeId,
                EmployeeName: $scope.New.EmployeeName,
                Email: $scope.New.Email,
                DesignationId: $scope.New.DesignationId,
                SectionId: $scope.New.SectionId,
                JoiningDate: $filter('date')($scope.New.JoiningDate, "yyyy-MM-dd"),
                Location: $scope.New.Location,
                ReportTo: $scope.New.ReportTo,
                RoleName: $scope.New.RoleName,
                groups: $scope.New.GroupName
            }

            AdmindataServices.saveEmployee(Employee).then(function (response) {
                swal('Success', response.data, 'success');
                $scope.$dismiss();
                $route.reload();
            }, function (error) {
                swal('Error', error.data.message, 'error');
                $scope.buttonProcess();
            })
        } else {
            $scope.buttonProcess();
        }
    }

    $scope.UpdatingEmployee = function (invalid, data) {

        var Employee = {
            EmployeeId: data.employeeId,
            EmployeeName: data.employeeName,
            Email: data.email,
            DesignationId: data.designationId,
            SectionId: data.sectionId,
            JoiningDate: $filter('date')(data.joiningDate, "yyyy-MM-dd"),
            Location: data.location,
            ReportTo: data.reportTo,
            groups: data.groups
        }

        $scope.UpdateButton = 'Updating..';
        $scope.isProcessing = true;
        if (!invalid) {
            AdmindataServices.updateEmployeeInfo(Employee).then(function (response) {
                swal('Success', response.data, 'success');
                $route.reload();
            }, function (error) {
                swal('Error', error.data.message, 'error');
                $scope.buttonProcess();
            })
        } else {
            $scope.buttonProcess();
        }
    }

    $scope.UpdateEmployeeRole=function(invalid,roleName,employeeId){
        $scope.UpdateRole = 'Updating....';
        $scope.isProcessing = true;

        if (!invalid) {
            var data = {
                EmployeeId: employeeId,
                Role:roleName
            }
            swal({
                title: "Warning!",
                text: "Are You sure change Employee Role to "+roleName,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, I do!",
                cancelButtonText: "No, cancel!",
                closeOnConfirm: false,
                closeOnCancel: false,
                showLoaderOnConfirm: true
            }, function (isConfirm) {
                if (isConfirm) {
                    AdmindataSetting.UpdateEmployeeRole(data).then(function (response) {
                        swal('Success', 'You have successfully update Employee Role ' + roleName, 'success');
                        $scope.buttonProcess();
                        $scope.$apply();
                    }, function (error) {
                        swal('Error!!', error.data.message, 'error');
                        $scope.buttonProcess();
                    })
                } else {
                    $scope.buttonProcess();
                    $scope.$apply();
                    swal.close();
                }
            });
        } else {
            $scope.buttonProcess();
        }
    }

    $scope.UpdateEmployeeObjectiveDeadLine = function (invalid,data) {
        $scope.UpdateObjectiveDeadlineButton = 'Updating...';
        $scope.isProcessing = true;
        var storeData = {
            EmployeeId:data.employeeId,
            NewDeadLine: data.jobObjectiveDeadline
        }

        if (!invalid) {
            AdmindataServices.UpdateJobObjectiveDeadlineByEmployee(storeData).then(function (response) {
                swal('Success', 'Successfully Date Change', 'success');
                $scope.buttonProcess();
            }, function (error) {
                swal('Error', error.data.message, 'error');
                $scope.buttonProcess();
                $scope.showDeadLinePanel();
            })
        } else
            $scope.buttonProcess();
    }


    $scope.UpdateAppraisalDeadline = function (invalid,data) {
        $scope.UpdateAppraisalDeadlineButton = 'Updating...';
        $scope.isProcessing = true;

        var storeData = {
            EmployeeId: data.employeeId,
            NewDeadLine: data.selfAppraisalDeadline
        }

        if (!invalid) {
            AdmindataServices.UpdateAppraisalDeadlineByEmployee(storeData).then(function (response) {
                swal('Success', 'Successfully Date Change', 'success');
                $scope.buttonProcess();
            }, function (error) {
                swal('Error', error.data.message, 'error');
                $scope.buttonProcess();
                $scope.showDeadLinePanel();
            })
        } else
            $scope.buttonProcess();
    }

    //Open Modal for Print Objective
    $scope.ReportPrint = function (data) {
        var docDefinition = CreatePDF.GenerateJobDescription(data);
        pdfMake.createPdf(docDefinition).print();
    }

    $scope.ReportDownload = function (data) {
        var docDefinition = CreatePDF.GenerateJobDescription(data);
        pdfMake.createPdf(docDefinition).download('EmployeeInformationReport.pdf');
    }

    $scope.GenerateReport = function (data) {
        AdminServices.GenerateEmployeeListReport(data);
    }

}])
myApp.controller('objectiveListsController', ['$scope', '$uibModal', '$filter', 'HOBUServices', 'AdmindataServices', 'CreatePDF', 'OtherDataServices', function ($scope, $uibModal, $filter, HOBUServices, AdmindataServices, CreatePDF, OtherDataServices) {

    $scope.initi = function () {
        AdmindataServices.getObjectiveList('EmloyeeId').then(function (response) {
            $scope.Objectives = response.data;
        })
        OtherDataServices.getDepartmentList().then(function (response) {
            $scope.DepartmentList = response.data;
        })
        OtherDataServices.getSectionList().then(function (response) {
            $scope.AllSectionList = response.data;
        })
    }

    $scope.initi();


    $scope.StatusBy = [{ id: 1, value: true, label: 'Approve' }, { id: 2, value: false, label: 'Pending' }];


    //Column Selection 
    HOBUServices.GetObjectiveColumnList().then(function (response) { $scope.ColumnList = response.data });
    HOBUServices.GetObjectiveSelectedList().then(function (response) { $scope.SelectedColumn = response.data });
    HOBUServices.GetObjectiveSelectedCol().then(function (response) { $scope.selectCol = response.data });


    /* Cascading Section for each department */
    $scope.getSectionList = function (data) {
        if (data == null) {
            $scope.SectionList = [];
        }
        $scope.SectionList = ($filter('filter')($scope.AllSectionList, { DepartmentId: data }));
    }

    //Change Events for Multiple dropdown
    $scope.changeEvents = {
        onItemSelect: function (item) {
            changeColumnViewShow(item);
        },
        onItemDeselect: function (item) {
            changeColumnViewShow(item);
        }
    };

    function changeColumnViewShow(item) {
        if (item.id == 1) {
            $scope.selectCol.EmployeeId = !$scope.selectCol.EmployeeId;
        } else if (item.id == 2) {
            $scope.selectCol.EmployeeName = !$scope.selectCol.EmployeeName;
        } else if (item.id == 3) {
            $scope.selectCol.Code = !$scope.selectCol.Code;
        } else if (item.id == 4) {
            $scope.selectCol.Title = !$scope.selectCol.Title;
        } else if (item.id == 5) {
            $scope.selectCol.KPI = !$scope.selectCol.KPI;
        } else if (item.id == 6) {
            $scope.selectCol.Target = !$scope.selectCol.Target;
        } else if (item.id == 7) {
            $scope.selectCol.Weight = !$scope.selectCol.Weight;
        } else if (item.id == 8) {
            $scope.selectCol.Note = !$scope.selectCol.Note;
        } else if (item.id == 9) {
            $scope.selectCol.Status = !$scope.selectCol.Status;
        } else if (item.id == 10) {
            $scope.selectCol.SelfAppraisal = !$scope.selectCol.SelfAppraisal;
        } else if (item.id == 11) {
            $scope.selectCol.Comments = !$scope.selectCol.Comments;
        } else if (item.id == 12) {
            $scope.selectCol.EvidenceFile = !$scope.selectCol.EvidenceFile;
        } else if (item.id == 13) {
            $scope.selectCol.PerformanceAppraisal = !$scope.selectCol.PerformanceAppraisal;
        }
    }

    //Multiple Dropsown Config
    $scope.dropConfig = {
        scrollable: true,
        scrollableHeight: '320px',
        showCheckAll: false,
        showUncheckAll: false
    }


    // This Section for Pagination for Pending List
    $scope.ViewItems = [{ value: 10, id: 10 }, { value: 20, id: 20 }, { value: 50, id: 50 }, { value: 100, id: 100 }, { value: 200, id: 200 }, { value: 500, id: 500 }];
    $scope.selectItem = $scope.ViewItems[0];
    $scope.ViewPerPage = 10;
    $scope.setitemsPerPage = function (num) {
        $scope.ViewPerPage = num.value;
    }

    //This Section for Modal
    $scope.viewObjectives = function (data) {
        $scope.objective = data;
        var modalInstance = $uibModal.open({
            templateUrl: '\View/SubAdmin_Modal/ObjectiveView.html',
            controller: 'objectiveListController',
            scope: $scope,
            size: 'lg',
        });
    }


    //Open Modal for Print Objective
    $scope.ReportPrint = function (data) {
        var docDefinition = CreatePDF.GenerateOtherObjectiveReport(data);
        pdfMake.createPdf(docDefinition).print();
    }

    $scope.ReportDownload = function (data) {
        var docDefinition = CreatePDF.GenerateOtherObjectiveReport(data);
        pdfMake.createPdf(docDefinition).download('EmployeeObjectiveReport.pdf');
    }
}]);
myApp.controller('departmentSectionController', ['$scope', '$uibModal', '$filter', 'AdmindataServices', 'OtherDataServices', '$route', function ($scope, $uibModal, $filter, AdmindataServices, OtherDataServices, $route) {


    $scope.initi = function () {

        OtherDataServices.getDepartmentList().then(function (response) {
            $scope.DepartmentList = response.data;
        })
        OtherDataServices.getSectionList().then(function (response) {
            $scope.SectionList = response.data;
        })

        OtherDataServices.getDesignationList().then(function (response) {
            $scope.DesignationList = response.data;
        })

    }
    $scope.storeProcess = function () {
        $scope.SectionButton = 'Add Section';
        $scope.DepartmentButton = 'Add Department';
        $scope.DesignationButton = 'Add Designation';
        $scope.SectionUpdate = 'Update Section';
        $scope.DepartmentUpdate = 'Update Department';
        $scope.DesignationUpdate = 'Update Designation';
        $scope.isProcess = false;
    }

    $scope.initi();
    $scope.storeProcess();

    


    $scope.UpdateSection = function (data) {
        $scope.objSection = {};
        angular.copy(data, $scope.objSection);
        var modalInstance = $uibModal.open({
            templateUrl: '\View/Super Admin Modal/UpdateSection.html',
            controller: 'departmentSectionController',
            scope: $scope,
            size: 'md'
        });

    }
    
    $scope.UpdateDepartment = function (data) {
        $scope.objDepartment = {};
        angular.copy(data, $scope.objDepartment);
        var modalInstance = $uibModal.open({
            templateUrl: '\View/Super Admin Modal/UpdateDepartment.html',
            controller: 'departmentSectionController',
            scope: $scope,
            size: 'md',
        });

    }

    $scope.UpdateDesignation = function (data) {
        $scope.objDesignation = {};
        angular.copy(data, $scope.objDesignation);
        var modalInstance = $uibModal.open({
            templateUrl: '\View/Super Admin Modal/UpdateDesignation.html',
            controller: 'departmentSectionController',
            scope: $scope,
            size: 'md',
        });
    }

    $scope.AddDepartment = function () {
        var modalInstance = $uibModal.open({
            templateUrl: '/View/Super Admin Modal/AddDepartment.html',
            controller: 'departmentSectionController',
            scope: $scope,
            size: 'md',
        });
    }

    $scope.AddSection = function () {
        var modalInstance = $uibModal.open({
            templateUrl: '\View/Super Admin Modal/AddSection.html',
            controller: 'departmentSectionController',
            scope: $scope,
            size: 'md',
        });
    }

    $scope.AddDesignation = function () {
        var modalInstance = $uibModal.open({
            templateUrl: '\View/Super Admin Modal/AddDesignation.html',
            controller: 'departmentSectionController',
            scope: $scope,
            size: 'md',
        });
    }


    $scope.StoreSection = function (data) {
        var newsection = {
            Id: '',
            Name: $scope.newSection.section,
            DeparmentId: $scope.newSection.departmentId
        };

        $scope.SectionButton = 'Storing...';
        $scope.isProcess = true;
        if (!data) {
            AdmindataServices.addSection(newsection).then(function (response) {
                swal('Successfull', 'New Section Added Successfully', 'success');
                $scope.$dismiss();
                $scope.storeProcess();
                $route.reload();
            }, function (error) {
                swal('Error', 'Something is error.Try again', 'error');
            })
        } else {
            $scope.storeProcess();
        }
    }

    $scope.StoreDepartment = function (data) {

        var newdept = {
            Id: '',
            Name: $scope.newDepartment
        };
        $scope.DepartmentButton = 'Storing...';
        $scope.isProcess = true;
        if (!data) {
            AdmindataServices.addDepartment(newdept).then(function (response) {
                $scope.$dismiss();
                $scope.storeProcess();
                swal({
                    title: 'Successful',
                    text: 'New Department Added Successfully',
                    type: 'success',
                    closeOnConfirm: false
                }, function () {
                    $route.reload();
                    swal.close();
                })
               
            }, function (error) {
                swal('Error', 'Something is error.Try again', 'error');
            })
        } else {
            $scope.storeProcess();
        }
    }

    $scope.StoreDesignation = function (data) {

        var newdesig = {
            Id: '',
            Name: $scope.newDesignation
        };

        $scope.DesignationButton = 'Storing...';
        $scope.isProcess = true;
        if (!data) {
            AdmindataServices.addDesignation(newdesig).then(function (response) {
                swal('Successfull', 'New Designation Added Successfully', 'success');
                $scope.$dismiss();
                $scope.storeProcess();
                $route.reload();
            }, function (error) {
                swal('Error', 'Something is error.Try again', 'error');
            })
        } else {
            $scope.storeProcess();
        }
    }

    $scope.UpdatingSection = function (data) {

        var updateSection = {
            Id: $scope.objSection.id,
            Name: $scope.objSection.section,
            DeparmentId: $scope.objSection.departmentId
        };

        $scope.SectionUpdate = 'Updating...';
        $scope.isProcess = true;

        if (!data) {
            AdmindataServices.addSection(updateSection).then(function (response) {
                swal('Updated', 'Section update Successfully', 'success');
                $scope.$dismiss();
                $scope.storeProcess();
                $route.reload();
            }, function (error) {
                swal('Error', 'Something is error.Try again', 'error');
            })
        } else {
            $scope.storeProcess();
        }
    }

    $scope.UpdatingDepartment = function (data) {

        var updateDept = {
            Id: $scope.objDepartment.id,
            Name: $scope.objDepartment.department
        };

        $scope.DepartmentUpdate = 'Updating...';
        $scope.isProcess = true;
        if (!data) {
            AdmindataServices.addDepartment(updateDept).then(function (response) {
                swal('Updated', 'Designation Update Successfully', 'success');
                $scope.$dismiss();
                $scope.storeProcess();
                $route.reload();
            }, function (error) {
                swal('Error', 'Something is error.Try again', 'error');
            })
        } else {
            $scope.storeProcess();
        }
    }

    $scope.UpdatingDesignation = function (data) {

        var updateDesignation = {
            Id: $scope.objDesignation.id,
            Name: $scope.objDesignation.designation
        };

        $scope.DesignationUpdate = 'Updating...';
        $scope.isProcess = true;
        if (!data) {
            AdmindataServices.addDesignation(updateDesignation).then(function (response) {
                swal('Updated', 'Designation update Successfully', 'success');
                $scope.$dismiss();
                $scope.storeProcess();
                $route.reload();
            }, function (error) {
                swal('Error', 'Something is error.Try again', 'error');
            })
        } else {
            $scope.storeProcess();
        }
    }

}]);
myApp.controller('settingController', ['$scope', '$uibModal', '$filter', 'AdmindataSetting', 'OtherDataServices', '$route', function ($scope, $uibModal, $filter, AdmindataSetting, OtherDataServices, $route) {


    $scope.initi = function () {

        OtherDataServices.getDepartmentList().then(function (response) {
            $scope.DepartmentList = response.data;
        })
        AdmindataSetting.getDeadlines().then(function (response) {
            $scope.Deadlines = response.data;
        })
        AdmindataSetting.getIncreamentList().then(function (response) {
            $scope.IncreamentList = response.data;
        })

        AdmindataSetting.getCompanyList().then(function (response) {
            $scope.companyList = response.data;
        })

    }

    $scope.storeProcess = function () {
        $scope.objectiveButton = 'Add Deadline';
        $scope.appraisalButton = 'Add Deadline';
        $scope.updateButton = 'Update Deadline';
        $scope.increamentButton = 'Update Increament';
        $scope.addCompanyButton = 'Add Company Name';
        $scope.updateCompanyButton = 'Update Company Name';
        $scope.isProcess = false;
    }

    $scope.initi();

    $scope.storeProcess();

    $scope.AddObjectivesDeadLine = function () {

        var modalInstance = $uibModal.open({
            templateUrl: '\View/Super Admin Modal/AddObjectiveDeadline.html',
            controller: 'settingController',
            scope: $scope,
            size: 'md'
        });
    }

    $scope.AddAppraisalDeadLine = function () {

        var modalInstance = $uibModal.open({
            templateUrl: '\View/Super Admin Modal/AddAppraisalDeadline.html',
            controller: 'settingController',
            scope: $scope,
            size: 'md'
        });
    }

    $scope.UpdateDeadline = function (data) {
        $scope.singleDeadline = {};
        angular.copy(data, $scope.singleDeadline);

        $scope.singleDeadline.jobObjectiveDeadline = new Date($scope.singleDeadline.jobObjectiveDeadline);
        $scope.singleDeadline.selfAppraisalDeadline = new Date($scope.singleDeadline.selfAppraisalDeadline);
        var modalInstance = $uibModal.open({
            templateUrl: '\View/Super Admin Modal/updateDeadline.html',
            controller: 'settingController',
            scope: $scope,
            size: 'md'
        });
    }

    $scope.UpdateIncreament = function (data) {
        $scope.SingleIncreament = {};
        angular.copy(data, $scope.SingleIncreament);

        var modalInstance = $uibModal.open({
            templateUrl: '\View/Super Admin Modal/updateIncreament.html',
            controller: 'settingController',
            scope: $scope,
            size: 'md'
        });
    }

    $scope.AddCompany = function () {
        $scope.newCompany = {};
        var modalInstance = $uibModal.open({
            templateUrl: '\View/Super Admin Modal/AddCompany.html',
            controller: 'settingController',
            scope: $scope,
            size: 'md'
        });
    }

    $scope.updateCompany = function (data) {
        $scope.newCompany = {};
        angular.copy(data, $scope.newCompany);
        var modalInstance = $uibModal.open({
            templateUrl: '\View/Super Admin Modal/UpdateCompany.html',
            controller: 'settingController',
            scope: $scope,
            size: 'md'
        });
    }

    $scope.StoreCompany = function (invalid, data) {
        $scope.addCompanyButton = 'Adding...';
        $scope.updateCompanyButton = 'Updating...';
        $scope.isProcess = true;

        if (!invalid) {
            AdmindataSetting.saveCompany(data).then(function (response) {
                swal('Success', 'Company Name added successfully', 'success');
                $route.reload();
            }, function (error) {
                swal('Error', error.data.message, 'error');
                $scope.storeProcess();
            })
        } else {
            $scope.storeProcess();
        }
    }

    $scope.StoreObjectiveDeadline = function (invalid,StoreData) {
        $scope.objectiveButton = 'Adding...';
        $scope.isProcess = true;

        StoreData.JobObjectiveDeadline = $filter('date')(StoreData.JobObjectiveDeadline, "yyyy-MM-dd");

        if (!invalid) {
            AdmindataSetting.setObjectiveDeadline(StoreData).then(function (response) {
                swal('Success', 'Job Objective Deadline submit successfully', 'success');
                $route.reload();
            }, function (error) {
                swal('Error', error.data.message, 'error');
                $scope.storeProcess();
            })
        } else {
            $scope.storeProcess();
        }
    }

    $scope.StoreAppraisalDeadline = function (invalid,StoreData) {
        $scope.appraisalButton = 'Adding...';
        $scope.isProcess = true;

        StoreData.SelfAppraisalDeadline = $filter('date')(StoreData.SelfAppraisalDeadline, "yyyy-MM-dd");

        if (!invalid) {
            AdmindataSetting.setAppraisalDeadline(StoreData).then(function (response) {
                swal('Success', 'Self Appraisal Deadline submit successfully', 'success');
                $route.reload();
            }, function (error) {
                swal('Error', error.data.message, 'error');
                $scope.storeProcess();
            })
        } else {
            $scope.storeProcess();
        }
    }

    $scope.UpdateDeadlineInfo = function (invalid, data) {
        $scope.updateButton = 'Updating...';
        $scope.isProcess = true;

        var storeData = {
            DepartmentId: data.departmentId,
            JobObjectiveDeadline: data.jobObjectiveDeadline,
            SelfAppraisalDeadline: data.selfAppraisalDeadline
        }

        if (!invalid) {
            AdmindataSetting.UpdateDeadline(storeData).then(function (response) {
                swal('Success', 'Deadline is updated', 'success');
                $route.reload();
            }, function (error) {
                swal('Error', error.data.message, 'error');
                $scope.storeProcess();
            })
        } else {
            $scope.storeProcess();
        }
    }

    $scope.UpdateIncreamentInfo = function (invalid) {
        $scope.increamentButton = 'Updating...';
        $scope.isProcess = true;

        var UpdateData = {
            Id: $scope.SingleIncreament.id,
            lowerScore:$scope.SingleIncreament.lowerScore,
            upperScore:$scope.SingleIncreament.upperScore,
            Promotion: $scope.SingleIncreament.promotion
        }

        if (!invalid) {
            AdmindataSetting.changeIncreament(UpdateData).then(function (response) {
                swal('Updated', 'The data is update successfully', 'success');
                $scope.$dismiss();
                $route.reload();
            }, function (error) {
                swal('Error', error.data.message, 'error');
                $scope.storeProcess();
            })
        } else {
            $scope.storeProcess();
        }
    }

}]);
myApp.controller('finalReportController', ['$scope', '$uibModal', '$filter', 'AdmindataSetting', 'OtherDataServices', '$route', 'AdminServices', 'AdmindataServices', function ($scope, $uibModal, $filter, AdmindataSetting, OtherDataServices, $route, AdminServices, AdmindataServices) {


    $scope.initi = function () {
        AdmindataServices.getFinalReportList().then(function (response) {
            $scope.Employees = response.data;
        })
        OtherDataServices.getDepartmentList().then(function (response) {
            $scope.DepartmentList = response.data;
        })
        OtherDataServices.getSectionList().then(function (response) {
            $scope.AllSectionList = response.data;
        })

        OtherDataServices.getDesignationList().then(function (response) {
            $scope.DesignationList = response.data;
        })

        AdmindataServices.getRoles().then(function (response) {
            $scope.Roles = response.data;
        })
    }

    $scope.buttonProcess = function () {
        $scope.AddButton = 'Add Employee';
        $scope.UpdateButton = 'Update Employee';
        $scope.RecoverButton = 'Recover';
        $scope.showHideButton = 'Show';
        $scope.UpdateDeadlineButton = 'Update';
        $scope.UpdateRole = 'Update Role';
        $scope.isProcessing = false;
    }

    $scope.buttonProcess();
    $scope.initi();

    //Dropdown list for group by Approve or Pending
    $scope.StatusBy = [{ id: 1, value: true, label: 'Approve' }, { id: 2, value: false, label: 'Pending' }];

    //Column Selection 
    AdminServices.getFinalReportList().then(function (response) { $scope.ColumnList = response.data });
    AdminServices.getFinalReportReportList().then(function (response) { $scope.SelectedColumn = response.data });
    AdminServices.getFinalReportTrueFalse().then(function (response) { $scope.selectCol = response.data });


    /* Cascading Section for each department */
    $scope.getSectionList = function (department) {
        if (department == null) {
            $scope.SectionList = [];
        }else
            $scope.SectionList = ($filter('filter')($scope.AllSectionList, { departmentId: department }));
    }


    //Change Events for Multiple dropdown
    $scope.changeEvents = {
        onItemSelect: function (item) {
            changeColumnViewShow(item);
        },
        onItemDeselect: function (item) {
            changeColumnViewShow(item);
        }
    };

    function changeColumnViewShow(item) {
        if (item.id == 1) {
            $scope.selectCol.EmployeeId = !$scope.selectCol.EmployeeId;
        } else if (item.id == 2) {
            $scope.selectCol.EmployeeName = !$scope.selectCol.EmployeeName;
        } else if (item.id == 3) {
            $scope.selectCol.Designation = !$scope.selectCol.Designation;
        } else if (item.id == 4) {
            $scope.selectCol.Department = !$scope.selectCol.Department;
        } else if (item.id == 5) {
            $scope.selectCol.Section = !$scope.selectCol.Section;
        } else if (item.id == 6) {
            $scope.selectCol.Email = !$scope.selectCol.Email;
        } else if (item.id == 7) {
            $scope.selectCol.JoiningDate = !$scope.selectCol.JoiningDate;
        } else if (item.id == 8) {
            $scope.selectCol.ReportTo = !$scope.selectCol.ReportTo;
        } else if (item.id == 9) {
            $scope.selectCol.ReportToDesignation = !$scope.selectCol.ReportToDesignation;
        } else if (item.id == 10) {
            $scope.selectCol.TotalScore = !$scope.selectCol.TotalScore;
        } else if (item.id == 11) {
            $scope.selectCol.Increament = !$scope.selectCol.Increament;
        }
    }

    //Multiple Dropsown Config
    $scope.dropConfig = {
        scrollable: true,
        scrollableHeight: '320px',
        showCheckAll: false,
        showUncheckAll: false
    }


    /* This Section for Pagination for Pending List */
    $scope.ViewItems = [{ value: 10, id: 10 }, { value: 20, id: 20 }, { value: 50, id: 50 }, { value: 100, id: 100 }, { value: 200, id: 200 }, { value: 500, id: 500 }];
    $scope.selectItem = $scope.ViewItems[0];
    $scope.ViewPerPage = 10;
    $scope.setitemsPerPage = function (num) {
        $scope.ViewPerPage = num.value;
    }


    $scope.GenerateFinalReport = function (data) {
        AdminServices.GenerateFinalReport(data);
    }


    $scope.viewHelpScore = function () {
        var modalInstance = $uibModal.open({
            templateUrl: '\View/Super Admin Modal/HelpTotalScore.html',
            controller: 'finalReportController',
            scope: $scope,
            size: 'lg'
        });
    }

}]);
myApp.controller('dashboard', ['$scope', 'AdmindataServices', function ($scope, AdmindataServices) {

    $scope.PieChart = function (data) {
        var myJson = {
            globals: {
                shadow: false,
                fontFamily: "Verdana",
                fontWeight: "50"
            },
            type: "pie",
            backgroundColor: "#fff",

            legend: {
                layout: "x5",
                position: "0px",
                borderColor: "transparent",
                marker: {
                    borderRadius: 15,
                    borderColor: "transparent"
                }
            },
            tooltip: {
                text: "%v person"
            },
            plot: {
                refAngle: "90",
                borderWidth: "0px",
                valueBox: {
                    placement: "in",
                    text: "%npv %",
                    fontSize: "15px",
                    textAlpha: 1,
                }
            },
            series: [{
                text: "Unsubmited",
                values: [data.unSumited],
                backgroundColor: "#e80417 #600910",
            }, {
                text: "Submited",
                values: [data.sumited],
                backgroundColor: "#1d6d09 #69d84e"
            }]
        };

        return myJson;
    }


}])
myApp.controller('allDeletedEmployeeController', ['$scope', '$uibModal', 'AdminServices', 'CreatePDF', 'AdmindataServices', 'OtherDataServices', 'AdmindataSetting', '$filter', '$route', function ($scope, $uibModal, AdminServices, CreatePDF, AdmindataServices, OtherDataServices, AdmindataSetting, $filter, $route) {

    $scope.initi = function () {
        AdmindataServices.getDeletedEmployeeList().then(function (response) {
            $scope.Employees = response.data;
        })
        OtherDataServices.getDepartmentList().then(function (response) {
            $scope.DepartmentList = response.data;
        })
        OtherDataServices.getSectionList().then(function (response) {
            $scope.AllSectionList = response.data;
        })

        OtherDataServices.getDesignationList().then(function (response) {
            $scope.DesignationList = response.data;
        })

    }

    $scope.initi();

    //Dropdown list for group by Approve or Pending
    $scope.StatusBy = [{ id: 1, value: true, label: 'Approve' }, { id: 2, value: false, label: 'Pending' }];

    //Column Selection 
    AdminServices.GetEmployeeColumnList().then(function (response) { $scope.ColumnList = response.data });
    AdminServices.GetEmployeeSelectedColumn().then(function (response) { $scope.SelectedColumn = response.data });
    AdminServices.GetEmployeeSelectedCol().then(function (response) { $scope.selectCol = response.data });


    /* Cascading Section for each department */
    $scope.getSectionList = function (department) {
        if (typeof department === "undefined") {
            $scope.SectionList = [];
        } else {
            $scope.SectionList = ($filter('filter')($scope.AllSectionList, { departmentId: department }));
        }
    }


    //Change Events for Multiple dropdown
    $scope.changeEvents = {
        onItemSelect: function (item) {
            changeColumnViewShow(item);
        },
        onItemDeselect: function (item) {
            changeColumnViewShow(item);
        }
    };

    function changeColumnViewShow(item) {
        if (item.id == 1) {
            $scope.selectCol.EmployeeId = !$scope.selectCol.EmployeeId;
        } else if (item.id == 2) {
            $scope.selectCol.EmployeeName = !$scope.selectCol.EmployeeName;
        } else if (item.id == 3) {
            $scope.selectCol.Designation = !$scope.selectCol.Designation;
        } else if (item.id == 4) {
            $scope.selectCol.Department = !$scope.selectCol.Department;
        } else if (item.id == 5) {
            $scope.selectCol.Section = !$scope.selectCol.Section;
        } else if (item.id == 6) {
            $scope.selectCol.Email = !$scope.selectCol.Email;
        } else if (item.id == 7) {
            $scope.selectCol.Location = !$scope.selectCol.Location;
        } else if (item.id == 8) {
            $scope.selectCol.JoiningDate = !$scope.selectCol.JoiningDate;
        } else if (item.id == 9) {
            $scope.selectCol.ReportTo = !$scope.selectCol.ReportTo;
        } else if (item.id == 10) {
            $scope.selectCol.ReportToDesignation = !$scope.selectCol.ReportToDesignation;
        } else if (item.id == 11) {
            $scope.selectCol.ReportToDepartment = !$scope.selectCol.ReportToDepartment;
        } else if (item.id == 12) {
            $scope.selectCol.Status = !$scope.selectCol.Status;
        }
    }

    //Multiple Dropsown Config
    $scope.dropConfig = {
        scrollable: true,
        scrollableHeight: '320px',
        showCheckAll: false,
        showUncheckAll: false
    }


    /* This Section for Pagination for Pending List */
    $scope.ViewItems = [{ value: 10, id: 10 }, { value: 20, id: 20 }, { value: 50, id: 50 }, { value: 100, id: 100 }, { value: 200, id: 200 }, { value: 500, id: 500 }];
    $scope.selectItem = $scope.ViewItems[0];
    $scope.ViewPerPage = 10;
    $scope.setitemsPerPage = function (num) {
        $scope.ViewPerPage = num.value;
    }


    $scope.ViewEmployee = function (data) {
        $scope.Info = data;
        var modalInstance = $uibModal.open({
            templateUrl: '\View/Super Admin Modal/EmployeeView.html',
            controller: 'allDeletedEmployeeController',
            scope: $scope,
            size: 'md',
        });
    }

    
    $scope.RecoverEmployee = function (data) {
        swal({
            title: "Warning!",
            text: "Are You sure Recover the Employee " + data.employeeName + "?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, I do",
            cancelButtonText: "No, cancel!",
            closeOnConfirm: false,
            closeOnCancel: false,
            showLoaderOnConfirm: true
        }, function (isConfirm) {
            if (isConfirm) {
                AdmindataServices.ActiveEmployee(data.employeeId).then(function (response) {
                    swal("Success", "You have successfully Recover the Employee " + data.employeeName, "success");
                    $route.reload();
                }, function (error) {
                    swal("Error", error.data.message, "error");
                })

            } else {
                swal.close();
            }
        });
    }

    //Open Modal for Print Objective
    $scope.ReportPrint = function (data) {
        var docDefinition = CreatePDF.GenerateJobDescription(data);
        pdfMake.createPdf(docDefinition).print();
    }

    $scope.ReportDownload = function (data) {
        var docDefinition = CreatePDF.GenerateJobDescription(data);
        pdfMake.createPdf(docDefinition).download('EmployeeInformationReport.pdf');
    }

    $scope.GenerateReport = function (data) {
        AdminServices.GenerateEmployeeListReport(data);
    }

}])

/* Organogram Section */
myApp.controller('totalOrganogram', ['$scope', 'HOBUdataServices', 'OtherDataServices', function ($scope, HOBUdataServices, OtherDataServices) {

    $scope.GenarateOrganogram = function (data) {
        $scope.chartData = [['Name', 'ReportsTo', 'tooltip']];

        HOBUdataServices.getTotalOrganogram(data).then(function (response) {
            var newobject = [['Name', 'ReportsTo', 'tooltip']];
            angular.forEach(response.data, function (val) {
                newobject.push(
                    [
                        {
                            v: val.employeeName,
                            f: '<div class="customBox"><div>' + (val.employeeName + ' (' + val.employeeId + ')') + '</div><div class="title">' + val.designation + '</div><div class="title">' + val.groupName + '</div></div>'
                        },
                        (val.reportToName),
                        (val.employeeName)
                    ]
                );

            });
            $scope.chartData = newobject;
        })
    }

    $scope.GetDepartmentList = function () {
        OtherDataServices.getDepartmentList().then(function (response) {
            $scope.DepartmentList = response.data;
        })
    }

    $scope.GetDepartmentList();
    $scope.GenarateOrganogram('');


    $scope.GetDepartmentWiseOrganogram = function (data) {
        var searchData;
        if (data == null) {
            searchData = '';
        }else
        {
            searchData = data;
        }

        HOBUdataServices.getTotalOrganogram(searchData).then(function (response) {
            var newobject = [['Name', 'ReportsTo', 'tooltip']];
            angular.forEach(response.data, function (val) {
                newobject.push(
                    [
                        {
                            v: val.employeeName,
                            f: '<div class="customBox"><div>' + (val.employeeName + ' (' + val.employeeId + ')') + '</div><div class="title">' + val.designation + '</div><div class="title">' + val.groupName + '</div></div>'
                        },
                        (val.reportToName),
                        (val.employeeName)
                    ]
                );

            });
            $scope.chartData = [];
            $scope.chartData = newobject;
        })
    }

}])

myApp.controller('totalEmployee', ['$scope', 'OtherDataServices', '$uibModal', '$route', function ($scope, OtherDataServices, $uibModal, $route) {
    
    $scope.loadData = function () {
        OtherDataServices.getEmployeeNumbers().then(function (response) {
            $scope.getEmployeeNumbersList = response.data;
            $scope.TotalNumbers = alasql('VALUE OF SELECT SUM(numberOfEmployees) FROM ?', [$scope.getEmployeeNumbersList]);
        })

        OtherDataServices.getDepartmentList().then(function (response) {
            $scope.DepartmentList = response.data;
        })
    }

    $scope.buttonProcess = function () {
        $scope.isProcessing = false;
        $scope.addButton='Add',
        $scope.updateButton='Update'
    }

    $scope.loadData();
    $scope.buttonProcess();

    $scope.addEmployeeNumbers = function () {
        var modalInstance = $uibModal.open({
            templateUrl: '\View/TotalEmployee/AddNumbers.html',
            controller: 'totalEmployee',
            scope: $scope,
            size: 'md',
        });
    }

    $scope.updateEmployeeNumber = function (data) {
        $scope.updateNumber = {};
        angular.copy(data, $scope.updateNumber);

        var modalInstance = $uibModal.open({
            templateUrl: '\View/TotalEmployee/UpdateNumbers.html',
            controller: 'totalEmployee',
            scope: $scope,
            size: 'md',
        });
    }

    $scope.storeEmployeeNumber = function (invalid,data) {
        $scope.addButton = 'Adding...';
        $scope.isProcessing = true;

        if (!invalid) {

            OtherDataServices.addEmployeeNumbers(data).then(function (response) {
                
                swal('Success', response.data, 'success');
                $route.reload();

            }, function (error) {
                swal('Error', error.data.message, 'error');
                $scope.buttonProcess();
            })

        } else {
            $scope.buttonProcess();
        }
    }

    $scope.updatingEmployeeNumbers = function (invalid, data) {
        $scope.updateButton = 'Updating...';
        $scope.isProcessing = true;

        if (!invalid) {

            OtherDataServices.updateEmployeeNumbers(data).then(function (response) {

                swal('Success', response.data, 'success');
                $route.reload();

            }, function (error) {
                swal('Error', error.data.message, 'error');
                $scope.buttonProcess();
            })

        } else {
            $scope.buttonProcess();
        }
    }

}])



/* Difference Type of Data and Operation Services*/
myApp.factory("Cascading", ['$filter', 
  function($filter){

      var service = {};     

      // Dummy Data
      var Position= [
          { "id": 1, "position": "Manager" },
          { "id": 2, "position": "IT" },
          { "id": 3, "position": "Junior Officer" },
          { "id": 4, "position": "Senior Officer" },
          { "id": 5, "position": "General Manager" },
          { "id": 6, "position": "Assistant Manager" },
      ];

      var Department= [
         { "id": 1, "department": "Production" },
         { "id": 2, "department": "Procurement" },
         { "id": 3, "department": "Human Resource" },
         { "id": 4, "department": "Dying" },
         { "id": 5, "department": "Color and Technical" },
         { "id": 6, "department": "QC" },
      ];

      var Section = [
          {"Id":1, "section":"Dying", "departmentId": 1},
          {"Id": 2, "section": "Febric", "departmentId": 1 },
          { "Id": 3, "section": "Color", "departmentId": 1 },
          { "Id": 4, "section": "Washing", "departmentId": 2 },
          { "Id": 5, "section": "Dying", "departmentId": 2 },
          { "Id": 6, "section": "Merchandizing", "departmentId": 2 },
          { "Id": 7, "section": "amdin", "departmentId": 3 },
          { "Id": 8, "section": "compliance", "departmentId": 3 },
          { "Id": 9, "section": "HR", "departmentId": 3 },
          { "Id": 10, "section": "Febric", "departmentId": 4 },
          { "Id": 11, "section": "Washing", "departmentId": 4 },
          { "Id": 12, "section": "Tech", "departmentId": 5 },
          { "Id": 13, "section": "Embrodary", "departmentId": 5 },
          { "Id": 14, "section": "IT", "departmentId": 5 },
          { "Id": 15, "section": "Account", "departmentId": 6 },
          { "Id": 16, "section": "Quaity Manager", "departmentId": 6 },
          ];

      // Services
      service.getPosition = function(){    
          return Position;
      };

      service.getDepartment = function(){
          return Department;
      };

      service.getDepartmentSection = function (departmentId) {
          var items = ($filter('filter')(Section, { departmentId: departmentId }));
          return items;
      };

      return service;       
  }]);
myApp.factory("dataService", ['$http', '$filter', function ($http, $filter) {
    var services = [];

    var group = [{ id: 0, value: "All" }, { id: 1, value: 1 }, { id: 2, value: 2 }, { id: 3, value: 3 }, { id: 4, value: 4 }, { id: 5, value: 5 }, { id: 6, value: 6 }, { id: 7, value: 7 }, { id: 8, value: 8 }, { id: 9, value: 9 }, { id: 10, value: 10 }];

    services.getAllData = function () {
        return $http.get('https://jsonplaceholder.typicode.com/albums');
    }

    services.getSpecificData = function (data) {
        return $http.get('https://jsonplaceholder.typicode.com/albums/'+data)
    }

    services.getGroup = function () {
        return group;
    }

    return services;
}]);
myApp.factory('errorService', function () {
    var fac = {};
    fac.geApiError = function (errorResponse) {
        var errors = [];
        for (var key in errorResponse.ModelState) {
            for (var i = 0; i < errorResponse.ModelState[key].length; i++) {
                errors.push(errorResponse.ModelState[key][i]);
            }
        }
        return errors;
    }
    return fac;
})

myApp.factory('EmployeeObjectiveService', ['$http', 'serviceBasePath', function ($http, serviceBasePath) {
    var fac = {};

    fac.GetObjectiveColumnList = function () {
        return $http.get('/HelperJSON/ForIndividual/PersonalObjective.json')
    }

    fac.GetObjectiveSeletedColumnList = function () {
        return $http.get('/HelperJSON/ForIndividual/PersonalObjectiveSelectItem.json');
    }

    fac.GetObjectiveSeletCol = function () {
        return $http.get('/HelperJSON/ForIndividual/ObjectiveTrueFalse.json');
    }

    fac.getGroupItem = function () {
       return $http.get('/HelperJSON/ForIndividual/GroupItemForEmp.json');
    }

    fac.getAppraisalScale = function () {
        return $http.get('/HelperJSON/SimpleWork/SelfAppraisal.json');
    }

    fac.AddDeal = function (data) {
        return $http.post(serviceBasePath+ "/api/Employees/JobObjectives/SaveEvidenceFile", data, {
            withCredentials: true, //must be true for sent file
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        })
    }

    fac.getOtherObjectiveColumnList = function () {
        return $http.get('/HelperJSON/ForReportee/Objectives.json')
    }

    fac.getOtherSelectedColumn = function () {
        return $http.get('/HelperJSON/ForReportee/ObjectiveSelectedItems.json')
    }

    fac.getOtherObjectiveSelected = function () {
        return $http.get('/HelperJSON/ForReportee/ObjectivesTrueFalse.json')
    }

    fac.getEmployeeColumnList = function () {
        return $http.get('/HelperJSON/ForReportee/EmployeeList.json');
    }

    fac.getEmployeeSelectedColumn = function () {
        return $http.get('/HelperJSON/ForReportee/EmployeeListSelectItem.json');
    }

    fac.getEmployeeSelected = function () {
        return $http.get('/HelperJSON/ForReportee/EmployeeTrueFalse.json');
    }

    fac.getEmployeeList=function(data){
        return $http.get('/HelperJSON/MocData/EmployeeList.json');
    }

    fac.getOtherObjectiveList = function (data) {
        return $http.get('/HelperJSON/MocData/OtherObjective.json');
    }

    fac.getMyObjective = function (data) {
        return $http.get('/HelperJSON/MocData/EmployeeeObjective.json');
    }

    fac.getMyObjective = function (data) {
        return $http.get('/HelperJSON/MocData/EmployeeeObjective.json');
    }

    fac.getMyJobDescription = function (data) {
        return $http.get('/HelperJSON/MocData/EmployeeJobDes.json');
    }

    return fac;

}]);

myApp.factory('EmployeeDataServices', ['$http', 'serviceBasePath', function ($http, serviceBasePath) {
    var fac = [];

    fac.getEmployeeList = function (data) {
        return $http.get(serviceBasePath + '/api/Employees/EmployeesData/GetOtherEmployeesList');
    }

    fac.getOtherObjectiveList = function () {
        return $http.get(serviceBasePath + '/api/Employees/EmployeesData/GetOthersEmployeeObjectives');
    }

    fac.getMyObjective = function () {
        return $http.get(serviceBasePath + '/api/Employees/EmployeesData/GetIndividualEmployeeObjectiveList');
    }

    fac.getMyAppraisalObjective = function () {
        return $http.get(serviceBasePath + '/api/Employees/EmployeesData/GetSelfAppraisalForIndividualEmployee');
    }

    fac.getMyJobDescription = function (data) {
        return $http.get(serviceBasePath + '/api/Employees/EmployeesData/GetEmployeeJobDescriptionSingleObject');
    }

    fac.getObjectiveById = function (data) {
        return $http.get(serviceBasePath + '/api/Employees/EmployeesData/GetOthersObjectiveById/' + data);
    }

    fac.getEmployeeById = function (data) {
        return $http.get(serviceBasePath + '/api/Employees/EmployeesData/GetEmployeeById/' + data);
    }

    fac.GenerateMyObjectiveList = function (data) {

        var excelStyle = {
            sheetid: 'My Objective List',
            headers: true,
            column: {
                style: 'font-size:15px'
            },
            columns: [
              { columnid: 'objectiveId', title: 'Objective Id' },
              { columnid: 'title', title: 'Objective Title' },
              { columnid: 'kpi', title: 'Key Performance Indicators' },
              { columnid: 'target', title: 'Target' },
              { columnid: 'weight', title: 'Weight'},
              {
                  columnid: 'note',
                  title: 'Note & Action',
                  cell: {
                      value: function (value) {
                          if (value == null)
                              return '';
                          else
                              return value
                      }
                  }
              },
              {
                  columnid: 'isObjectApprove',
                  title: 'Status',
                  cell: {
                      value: function (value) { return (value ? 'Approve' : 'Pending') }
                  }
              },
            ]
        };

        alasql('SELECT * INTO XLS("MyObjectives.xls",?) FROM ?', [excelStyle, data]);
    }

    fac.GenerateMySelfAppraisalList = function (data) {

        var excelStyle = {
            sheetid: 'My Self Appraisal List',
            headers: true,
            column: {
                style: 'font-size:15px'
            },
            columns: [
              { columnid: 'objectiveId', title: 'Objective Id' },
              { columnid: 'title', title: 'Objective Title' },
              { columnid: 'kpi', title: 'Key Performance Indicators' },
              { columnid: 'target', title: 'Target' },
              { columnid: 'weight', title: 'Weight' },
              {
                  columnid: 'note',
                  title: 'Note & Action',
                  cell: {
                      value: function (value) {
                          if (value == null)
                              return '';
                          else
                              return value
                      }
                  }
              },
              {
                  columnid: 'comments',
                  title: 'Comments',
                  cell: {
                      value: function (value) {
                          if (value == null)
                              return '';
                          else
                              return value
                      }
                  }
              },
              {
                  columnid: 'selfAppraisal',
                  title: 'Self Appraisal',
                  cell: {
                      value: function (value) {
                          if (value == null)
                              return '';
                          else
                              return value
                      }
                  }
              },
            ]
        };

        alasql('SELECT * INTO XLS("MySelfAppraisal.xls",?) FROM ?', [excelStyle, data]);
    }

    fac.GenerateOtherObjectiveList = function (data) {

        var excelStyle = {
            sheetid: 'Others Objective List',
            headers: true,
            column: {
                style: 'font-size:15px'
            },
            columns: [
              { columnid: 'employeeId', title: 'Employee Id' },
              { columnid: 'employeeName', title: 'Employee Name' },
              { columnid: 'reportToName', title: 'Reposrts To' },
              { columnid: 'objectiveId', title: 'Objective Id' },
              { columnid: 'title', title: 'Objective Title' },
              { columnid: 'kpi', title: 'Key Performance Indicators' },
              { columnid: 'target', title: 'Target' },
              { columnid: 'weight', title: 'Weight' },
              {
                  columnid: 'note',
                  title: 'Note & Action',
                  cell: {
                      value: function (value) {
                          if (value == null)
                              return '';
                          else
                              return value
                      }
                  }
              },
              {
                  columnid: 'isObjectiveApproved',
                  title: 'Status',
                  cell: {
                      value: function (value) { return (value ? 'Approve' : 'Pending') }
                  }
              },
            ]
        };

        alasql('SELECT * INTO XLS("OthersObjectives.xls",?) FROM ? ORDER BY EmployeeId', [excelStyle, data]);
    }

    fac.GenerateOtherEmployeeList = function (data) {

        var excelStyle = {
            sheetid: 'Others Employee List',
            headers: true,
            column: {
                style: 'font-size:15px'
            },
            columns: [
              { columnid: 'employeeId', title: 'Employee Id' },
              { columnid: 'employeeName', title: 'Employee Name' },
              { columnid: 'designation', title: 'Designation' },
              { columnid: 'section', title: 'Section' },
              { columnid: 'department', title: 'Department' },
              {
                  columnid: 'email',
                  title: 'Email',
                  cell: {
                      value: function (value) {
                          if (value == null)
                              return '';
                          else
                              return value
                      }
                  }
              },
              { columnid: 'joiningDate', title: 'Joining Date' },
              { columnid: 'location', title: 'Location' },
              { columnid: 'reportTo', title: 'Reports To' },
              { columnid: 'reportToDesignation', title: 'Report To Designation' },
              { columnid: 'reportToDepartment', title: 'Report To Department' },
              {
                  columnid: 'jobPurpose',
                  title: 'Job Purpose',
                  cell: {
                      value: function (value) {
                          if (value == null)
                              return '';
                          else
                              return value
                      }
                  }
              },
              {
                  columnid: 'keyAccountabilities',
                  title: 'Key Accountabilities',
                  cell: {
                      value: function (value) {
                          if (value == null)
                              return '';
                          else
                              return value
                      }
                  }
              },
              {
                  columnid: 'isHOBUConfirmed',
                  title: 'Status',
                  cell: {
                      value: function (value) { return (value ? 'Approve' : 'Pending') }
                  }
              },
            ]
        };

        alasql('SELECT employeeId,employeeName,designation,section,department,email,CONVERT(STRING,joiningDate,103) as joiningDate,location,reportTo,reportToDesignation,reportToDepartment,jobPurpose,keyAccountabilities,isHOBUConfirmed INTO XLS("OthersEmployee.xls",?) FROM ? ORDER BY EmployeeName', [excelStyle, data]);
    }

    fac.StoreJobDescription = function (data) {
        return $http.post(serviceBasePath + '/api/JobDescription/JobDescription/Save', data);
    }

    fac.UpdateJobDescription = function (data) {
        return $http.post(serviceBasePath + '/api/JobDescription/JobDescription/UpdateJobDescripsion', data);
    }

    fac.StoreJobObjective = function (data) {
        return $http.post(serviceBasePath + '/api/Employees/JobObjectives/SaveObjective', data);
    }

    fac.UpdateJobObjective = function (data) {
        return $http.post(serviceBasePath + '/api/Employees/JobObjectives/SaveObjective', data);
    }

    fac.postSelfAppraisal = function (data) {
      return $http.post(serviceBasePath + '/api/Employees/Employees/SaveSeflAppraisal',data);
    }

    fac.isApproveObjective = function (objectiveId) {
        return $http.get(serviceBasePath + '/api/Admin/AdminActivities/ApproveObjectiveByReportee/'+objectiveId);
    }

    fac.isApproveJobDescription = function (jobDescriptionId) {
       return $http.get(serviceBasePath + '/api/Admin/AdminActivities/ApproveJobDescriptionByReportee/'+jobDescriptionId);
    }

    return fac;
}])

myApp.factory('HOBUServices', ['$http',function ($http) {
    var fac = [];

    //Employee List
    fac.GetEmployeeColumnList = function () {
        return $http.get('/HelperJSON/ForHOBU/EmployeeList.json')
    }

    fac.GetEmployeeSelectedColumn = function () {
        return $http.get('/HelperJSON/ForHOBU/EmployeeSelectedItems.json')
    }

    fac.GetEmployeeSelectedCol= function () {
        return $http.get('/HelperJSON/ForHOBU/EmployeeTrueFalse.json')
    }

    //Objective List
    fac.GetObjectiveColumnList = function () {
        return $http.get('/HelperJSON/ForHOBU/ObjectiveList.json')
    }

    fac.GetObjectiveSelectedList = function () {
        return $http.get('/HelperJSON/ForHOBU/ObjectiveSelectedtem.json')
    }

    fac.GetObjectiveSelectedCol = function () {
        return $http.get('/HelperJSON/ForHOBU/ObjectiveTrueFalse.json')
    }

    //Performance List
    fac.GetPerformanceList = function () {
        return $http.get('/HelperJSON/ForHOBU/PerformanceList.json')
    }

    fac.GetPerformanceSelectedList = function () {
        return $http.get('/HelperJSON/ForHOBU/PerformanceSelectedItems.json')
    }

    fac.GetPerformanceSelectedCol = function () {
        return $http.get('/HelperJSON/ForHOBU/PerformanceTrueFalse.json')
    }

    fac.getAppraisalScale = function () {
        return $http.get('/HelperJSON/SimpleWork/SelfAppraisal.json');
    }

    return fac;
}])

myApp.factory('HOBUdataServices', ['$http', 'serviceBasePath', function ($http, serviceBasePath) {
    var fac = {};

    fac.getEmployeeList = function (data) {
        return $http.get(serviceBasePath + '/api/Admin/HeadOfBussinessUnit/GetEmployeesForHOBU');
    }

    fac.getObjectiveList = function (data) {
        return $http.get(serviceBasePath + '/api/Admin/HeadOfBussinessUnit/GetIndividualEmployeeObjectiveList');
    }

    fac.getEmployeeListPerformanceAppraisal = function (data) {
        return $http.get(serviceBasePath + '/api/Admin/HeadOfBussinessUnit/GetEmployeesObjectiveForHOBUWithReportTo');
    }

    fac.getObjectiveListForAppraisal = function () {
       
        return $http.get(serviceBasePath + '/api/Admin/HeadOfBussinessUnit/GetEmployeesObjectiveForHOBUforPerformanceAppraisal');

    }

    fac.GenerateOtherEmployeeList = function (data) {

        var excelStyle = {
            sheetid: 'Employee List',
            headers: true,
            column: {
                style: 'font-size:15px'
            },
            columns: [
              { columnid: 'employeeId', title: 'Employee Id' },
              { columnid: 'employeeName', title: 'Employee Name' },
              { columnid: 'designation', title: 'Designation' },
              { columnid: 'section', title: 'Section' },
              { columnid: 'department', title: 'Department' },
              { columnid: 'email', title: 'Email' },
              { columnid: 'joindate', title: 'Joining Date' },
              { columnid: 'location', title: 'Location' },
              { columnid: 'reportToName', title: 'Reports To' },
              { columnid: 'reportToDesignation', title: 'Report To Designation' },
              { columnid: 'reportToDepartment', title: 'Report To Department' },
              { columnid: 'jobPurpose', title: 'Job Purpose' },
              { columnid: 'keyAccountabilities', title: 'Key Accountabilities' },
              {
                  columnid: 'isHOBUConfirmed',
                  title: 'Status',
                  cell: {
                      value: function (value) { return (value ? 'Approve' : 'Pending') }
                  }
              },
            ]
        };

        alasql('SELECT employeeId,employeeName,designation,section,department,email,CONVERT(STRING,joiningDate,103) as joindate,location,reportToName,reportToDesignation,reportToDepartment,jobPurpose,keyAccountabilities,isHOBUConfirmed INTO XLS("EmployeeList.xls",?) FROM ? ORDER BY EmployeeName', [excelStyle, data]);
    }

    fac.GenerateObjectiveList = function (data) {

        var excelStyle = {
            sheetid: 'Department Objective List',
            headers: true,
            column: {
                style: 'font-size:15px'
            },
            columns: [
              { columnid: 'employeeId', title: 'Employee Id' },
              { columnid: 'employeeName', title: 'Employee Name' },
              { columnid: 'designation', title: 'Designation' },
              { columnid: 'department', title: 'Department' },
              { columnid: 'section', title: 'Section' },
              { columnid: 'reportToName', title: 'Reposrts To' },
              { columnid: 'reportToDesignation', title: 'Reposrts To Designation' },
              { columnid: 'objectiveId', title: 'Objective Id' },
              { columnid: 'title', title: 'Title' },
              { columnid: 'kpi', title: 'Key Performance Indicators' },
              { columnid: 'target', title: 'Target' },
              { columnid: 'weight', title: 'Weight' },
              {
                  columnid: 'note',
                  title: 'Note & Action',
                  cell: {
                      value: function (value) {
                          if (value == null)
                              return '';
                          else
                              return value
                      }
                    }
              },
              {
                  columnid: 'selfAppraisal',
                  title: 'Self Appraisal',
                  cell: {
                      value: function (value) {
                          if (value == null)
                              return '';
                          else
                              return value
                      }
                  }
              },
              {
                  columnid: 'performanceAppraisal',
                  title: 'Performance Appraisal',
                  cell: {
                      value: function (value) {
                          if (value == null)
                              return '';
                          else
                              return value
                      }
                  }
              },
              {
                  columnid: 'comments',
                  title: 'Comments',
                  cell: {
                      value: function (value) {
                          if (value == null)
                              return '';
                          else
                              return value
                      }
                  }
              },
              {
                  columnid: 'isObjectApprove',
                  title: 'Status',
                  cell: {
                      value: function (value) { return (value ? 'Approve' : 'Pending') }
                  }
              },
            ]
        };

        alasql('SELECT * INTO XLS("Department Objective List.xls",?) FROM ? ORDER BY EmployeeName', [excelStyle, data]);
    }

    fac.GeneratePerformaceAppraissalList = function (data) {

        var excelStyle = {
            sheetid: 'Employee Performance Appraisal List',
            headers: true,
            column: {
                style: 'font-size:15px'
            },
            columns: [
              { columnid: 'employeeId', title: 'Employee Id' },
              { columnid: 'employeeName', title: 'Employee Name' },
              { columnid: 'designation', title: 'Designation' },
              { columnid: 'department', title: 'Department' },
              { columnid: 'section', title: 'Section' },
              {
                  columnid: 'email',
                  title: 'Email',
                  cell: {
                      value: function (value) {
                          if (value == null)
                              return '';
                          else
                              return value
                      }
                  }
              },
              {
                  columnid: 'reprotToName',
                  title: 'Report To Name',
                  cell: {
                      value: function (value) {
                          if (value == null)
                              return '';
                          else
                              return value
                      }
                  }
              },
              {
                  columnid: 'overallScore',
                  title: 'Overall Score',
                  cell: {
                      value: function (value) {
                          if (value == null)
                              return '';
                          else
                              return value
                      }
                  }
              },
              {
                  columnid: 'overallComments',
                  title: 'Overall Comments',
                  cell: {
                      value: function (value) {
                          if (value == null)
                              return '';
                          else
                              return value
                      }
                  }
              },
              {
                  columnid: 'pdp',
                  title: 'Personal Development Plan',
                  cell: {
                      value: function (value) {
                          if (value == null)
                              return '';
                          else
                              return value
                      }
                  }
              },
              {
                  columnid: 'totalScore',
                  title: 'Total Score',
                  cell: {
                      value: function (value) {
                          if (value == null)
                              return '';
                          else
                              return value
                      }
                  }
              },
              {
                  columnid: 'isObjectApprove',
                  title: 'Status',
                  cell: {
                      value: function (value) { return (value ? 'Done' : 'Not Done') }
                  }
              },
            ]
        };

        alasql('SELECT * INTO XLS("EmployeePerformanceAppraisal.xls",?) FROM ? ORDER BY employeeName', [excelStyle, data]);
    }

    fac.postPerformanceAppraisal = function (data) {
        return $http.post(serviceBasePath + '/api/Employees/JobObjectives/SavePerformanceAppraisal', data);
    }

    fac.isApproveJobDescriptionByHOBU = function (JobDescriptionId) {
        return $http.get(serviceBasePath + '/api/Admin/AdminActivities/ApproveJobDescriptionByHOBU/'+ JobDescriptionId);
    }

    fac.getOrganogramData = function () {
        return $http.get(serviceBasePath + '/api/Core/Organogram/GetMyEmployeesForOrganogram');
    }

    fac.getTotalOrganogram = function (data) {

        return $http.get(serviceBasePath + '/api/Core/Organogram/GetEmployeeForTotalOrganogram?id='+data);
    }

    return fac;
}])

myApp.factory('AdminServices', ['$http', function ($http) {
    var fac = [];

    //Employee List
    fac.GetEmployeeColumnList = function () {
        return $http.get('/HelperJSON/Admin/EmployeeList.json')
    }

    fac.GetEmployeeSelectedColumn = function () {
        return $http.get('/HelperJSON/Admin/EmployeeSelectedList.json')
    }

    fac.GetEmployeeSelectedCol = function () {
        return $http.get('/HelperJSON/Admin/EmployeeTrueFalse.json')
    }

    //Objective List
    fac.GetObjectiveColumnList = function () {
        return $http.get('/HelperJSON/ForHOBU/ObjectiveList.json')
    }

    fac.GetObjectiveSelectedList = function () {
        return $http.get('/HelperJSON/ForHOBU/ObjectiveSelectedtem.json')
    }

    fac.GetObjectiveSelectedCol = function () {
        return $http.get('/HelperJSON/ForHOBU/ObjectiveTrueFalse.json')
    }

    //Performance List
    fac.GetPerformanceList = function () {
        return $http.get('/HelperJSON/ForHOBU/PerformanceList.json')
    }

    fac.GetPerformanceSelectedList = function () {
        return $http.get('/HelperJSON/ForHOBU/PerformanceSelectedItems.json')
    }

    fac.GetPerformanceSelectedCol = function () {
        return $http.get('/HelperJSON/ForHOBU/PerformanceTrueFalse.json')
    }

    fac.getAppraisalScale = function () {
        return $http.get('/HelperJSON/SimpleWork/SelfAppraisal.json');
    }


    fac.getFinalReportList = function () {
        return $http.get('/HelperJSON/Admin/FianlReportList.json');
    }

    fac.getFinalReportReportList = function () {
        return $http.get('/HelperJSON/Admin/FinalReporSelectedList.json');
    }

    fac.getFinalReportTrueFalse = function () {
        return $http.get('/HelperJSON/Admin/FinalReportTrueFalse.json');
    }


    fac.GenerateEmployeeListReport = function (data) {
        var excelStyle = {
            sheetid: 'Employee List',
            headers: true,
            column: {
                style: 'font-size:15px'
            },
            columns: [
              { columnid: 'employeeId', title: 'Employee Id' },
              { columnid: 'employeeName', title: 'Employee Name' },
              { columnid: 'designation', title: 'Designation' },
              { columnid: 'department', title: 'Department' },
              { columnid: 'section', title: 'Section' },
              {
                  columnid: 'email',
                  title: 'Email',
                  cell: {
                      value: function (value) {
                          if (value == null)
                              return '';
                          else
                              return value
                      }
                  }
              },
              { columnid: 'joiningDate', title: 'Joining Date' },
              { columnid: 'location', title: 'Location' },
              {
                  columnid: 'reportToName',
                  title: 'Report To Name',
                  cell: {
                      value: function (value) {
                          if (value == null)
                              return '';
                          else
                              return value
                      }
                  }
              },
              {
                  columnid: 'reportToDesignation',
                  title: 'Report To Designation',
                  cell: {
                      value: function (value) {
                          if (value == null)
                              return '';
                          else
                              return value
                      }
                  }
              },
              {
                  columnid: 'reportToDepartment',
                  title: 'Report To Department',
                  cell: {
                      value: function (value) {
                          if (value == null)
                              return '';
                          else
                              return value
                      }
                  }
              },
              {
                  columnid: 'isHOBUConfirmed',
                  title: 'Status',
                  cell: {
                      value: function (value) { return (value ? 'Approve' : 'Pending') }
                  }
              },
            ]
        };

        alasql('SELECT employeeId,employeeName,designation,section,department,email,CONVERT(STRING,joiningDate,103) as joiningDate,location,reportToName,reportToDesignation,reportToDepartment,isHOBUConfirmed INTO XLS("AllEmployeeList.xls",?) FROM ? ORDER BY EmployeeName', [excelStyle, data]);
    }

    fac.GenerateFinalReport = function (data) {
        var excelStyle = {
            sheetid: 'Employee Final Appraisal List',
            headers: true,
            column: {
                style: 'font-size:15px'
            },
            columns: [
              { columnid: 'employeeId', title: 'Employee Id' },
              { columnid: 'employeeName', title: 'Employee Name' },
              { columnid: 'designation', title: 'Designation' },
              { columnid: 'department', title: 'Department' },
              { columnid: 'section', title: 'Section' },
              {
                  columnid: 'email',
                  title: 'Email',
                  cell: {
                      value: function (value) {
                          if (value == null)
                              return '';
                          else
                              return value
                      }
                  }
              },
              { columnid: 'joiningDate', title: 'Joining Date' },
              {
                  columnid: 'reportToName',
                  title: 'Report To Name',
                  cell: {
                      value: function (value) {
                          if (value == null)
                              return '';
                          else
                              return value
                      }
                  }
              },
              {
                  columnid: 'reportToDesignation',
                  title: 'Report To Designation',
                  cell: {
                      value: function (value) {
                          if (value == null)
                              return '';
                          else
                              return value
                      }
                  }
              },
              {
                  columnid: 'reportToDepartment',
                  title: 'Report To Department',
                  cell: {
                      value: function (value) {
                          if (value == null)
                              return '';
                          else
                              return value
                      }
                  }
              },
              {
                  columnid: 'totalScore',
                  title: 'Total Score',
                  cell: {
                      value: function (value) {
                          if (value == null)
                              return '';
                          else
                              return value
                      }
                  }
              },
              {
                  columnid: 'increament',
                  title: 'Increament',
                  cell: {
                      value: function (value) {
                          if (value == null)
                              return '';
                          else
                              return value
                      }
                  }
              },
              { title: 'Salary' },
              { title: 'Increament' },
              { title: 'Total Salary' }
            ]
        };

        alasql('SELECT employeeId,employeeName,designation,section,department,email,CONVERT(STRING,joiningDate,103) as joiningDate,reportToName,reportToDesignation,reportToDepartment,totalScore,increaqment INTO XLS("EmployeeListFinalReport.xls",?) FROM ? ORDER BY EmployeeName', [excelStyle, data]);
    }

    return fac;
}])

myApp.factory('AdmindataServices', ['$http', 'serviceBasePath', function ($http, serviceBasePath) {
    var fac = {};

    fac.getEmployeeList = function (data) {
        return $http.get(serviceBasePath + '/api/Admin/AdminData/GetAllEmployees');
    }


    fac.addDepartment = function (data) {
        return $http.post(serviceBasePath + '/api/Employees/Employees/SaveDepartment', data);
    }

    fac.addSection = function (data) {
        return $http.post(serviceBasePath + '/api/Employees/Employees/SaveSection', data);
    }

    fac.addDesignation = function (data) {
        return $http.post(serviceBasePath + '/api/Employees/Employees/SaveDesignation', data);
    }

    fac.updateDepartment = function (data) {
        return $http.post(serviceBasePath + '/api/Employees/Employees/SaveDepartment', data);
    }

    fac.updateSection = function (data) {
        return $http.post(serviceBasePath + '/api/Employees/Employees/SaveSection', data);
    }

    fac.updateDesignation = function (data) {
        return $http.post(serviceBasePath + '/api/Employees/Employees/SaveDesignation', data);
    }

    fac.getSingleEmployee = function (Id) {
        return $http.get(serviceBasePath + '/api/Admin/AdminData/GetObjectiveByEmployeeId/' + Id);
    }

    fac.RemoveEmployee = function (employeeid) {
        return $http.post(serviceBasePath + '/api/Admin/AdminActivities/DeleteEmployee/' + employeeid);
    }

    fac.getDeletedEmployeeList = function () {
        return $http.get(serviceBasePath + '/api/Admin/AdminData/GetAllDeletedEmployees');
    }

    fac.ActiveEmployee = function (employeeid) {
        return $http.post(serviceBasePath + '/api/Admin/AdminActivities/ActiveEmployee/' + employeeid);
    }

    fac.getRoles=function()
    {
        return $http.get('/HelperJSON/Roles.json');
    }

    fac.saveEmployee = function (data) {
        return $http.post(serviceBasePath + '/api/Account/Register',data);
    }

    fac.RecoverPassword = function (data) {
        return $http.post(serviceBasePath + '/api/Account/RecoveryPassword',data);
    }

    fac.UpdateJobObjectiveDeadlineByEmployee = function (data) {
      return $http.post(serviceBasePath + '/api/Admin/DirectorActivities/ChangeObjectiveDeadLine',data);
    }

    fac.UpdateAppraisalDeadlineByEmployee = function (data) {
        return $http.post(serviceBasePath + '/api/Admin/DirectorActivities/ChangeJobDescriptionDeadLine', data);
    }

    fac.getFinalReportList = function () {
        return $http.get(serviceBasePath + '/api/Admin/AdminData/GetAllObjectivesWithIncreamentForDirector');
    }

    fac.updateEmployeeInfo = function (Data) {
        return $http.post(serviceBasePath + '/api/Employees/Employees/save', Data);
   }

    fac.LockedUser = function (data) {
        return $http.post(serviceBasePath + '/api/Account/SetLocked', data);
    }

    return fac;
}])

myApp.factory('AdmindataSetting', ['$http', 'serviceBasePath', function ($http, serviceBasePath) {
    var fac = {};

    fac.setObjectiveDeadline = function (data) {
        return $http.post(serviceBasePath + '/api/Admin/AdminActivities/SetObjectDeadline', data);
    }

    fac.setAppraisalDeadline = function (data) {
        return $http.post(serviceBasePath + '/api/Admin/AdminActivities/SetAppraisalDeadline', data);
    }

    //Missing
    fac.getDeadlines = function () {
        return $http.get(serviceBasePath + '/api/Admin/HeadOfBussinessUnit/GetDeadline');
    }

    fac.UpdateDeadline = function (data) {
        return $http.post(serviceBasePath + '/api/Admin/AdminActivities/UpdateAppraisalDeadline', data);
    }

    fac.getIncreamentList = function () {
        return $http.get(serviceBasePath + '/api/Admin/HeadOfBussinessUnit/GetIncrementData');
    }

    fac.changeIncreament = function (data) {
        return $http.post(serviceBasePath + '/api/Admin/AdminActivities/UpdateIncreamentTableData', data);
    }

    fac.getJobDescriptionChartData = function () {
        return $http.get(serviceBasePath + '/api/Core/Organogram/GetEmployeeNumberForJobDescription');
    }

    fac.getSelfAppraisalChartData = function () {
        return $http.get(serviceBasePath + '/api/Core/Organogram/GetEmployeeNumberForSelfAppraisal');
    }

    fac.getPerformanceAppraisalChartData = function () {
        return $http.get(serviceBasePath + '/api/Core/Organogram/GetEmployeeNumberForPerformenseAppraisal');
    }

    fac.getCompanyList = function () {
        return $http.get(serviceBasePath + '/api/Core/Company/Get');
    }

    fac.saveCompany = function (data) {
        return $http.post(serviceBasePath + '/api/Core/Company/Save', data);
    }

    fac.updateCompany = function (data) {
        return $http.post(serviceBasePath + '/api/Core/Company/Save', data);
    }

    fac.UpdateEmployeeRole = function (data) {
        return $http.post(serviceBasePath + '/api/Account/UpdateEmployeeRole',data);
    }

    return fac;
}])

myApp.factory('CreatePDF', ['$filter',function ($filter) {
    var fac = [];

    fac.GenerateJobDescription = function (data) {
        var date = new Date(data.joiningDate);
        var joinDate = $filter('date')(date, 'dd/MM/yyyy');

        var status='';
        if (data.isHOBUConfirmed) {
            status='Approve'
        } else
            status='Pending'

        var docDefination = {
            content: [
    {
        image: 'data:image/png;base64,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',
        width: 100,
        height: 30,
        alignment: 'center',
        margin: [0, 0, 0, 10]
    },
    {
        text: 'Employee Information',
        alignment: 'center',
        style: 'header',
        decoration: 'underline',
        margin: [0, 0, 0, 20]
    },
    {
        style: 'tableExample',
        color: 'black',
        table: {
            widths: [100, 20, '*'],
            headerRows: 2,
            // keepWithHeaderRows: 1,
            body: [
                [{ text: 'Personal Information', style: 'Subheader', colSpan: 3, alignment: 'center' }, {}, {}],
                [{ text: 'g', colSpan: 3, style: 'textWhite' }, {}, {}],
                [
                    {
                        text: 'ID',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: data.employeeId,
                        style: 'textNormal'

                    }
                ],
                [
                    {
                        text: 'Name',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: data.employeeName,
                        style: 'textNormal'

                    }
                ],
                [
                    {
                        text: 'Email',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: data.email,
                        style: 'textNormal'

                    }
                ],
                [
                    {
                        text: 'Status',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: status,
                        style: 'textNormal'

                    }
                ],
                [{ text: 'g', colSpan: 3, style: 'textWhite' }, {}, {}],
                [{ text: 'Job Information', style: 'Subheader', colSpan: 3, alignment: 'center' }, {}, {}],
                [{ text: 'g', colSpan: 3, style: 'textWhite' }, {}, {}],
                [
                    {
                        text: 'Designation',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: data.designation,
                        style: 'textNormal'

                    }
                ],
                [
                    {
                        text: 'Department',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: data.department,
                        style: 'textNormal'

                    }
                ],
                [
                    {
                        text: 'Section',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: data.section,
                        style: 'textNormal'

                    }
                ],
                [
                    {
                        text: 'Joining Date',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: joinDate,
                        style: 'textNormal'

                    }
                ],
                [
                    {
                        text: 'Location',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: data.location,
                        style: 'textNormal'

                    }
                ],
                [
                    {
                        text: 'Company',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: data.employeeCompany,
                        style: 'textNormal'

                    }
                ],
                [{ text: 'g', colSpan: 3, style: 'textWhite' }, {}, {}],
                [{ text: 'Reports To', style: 'Subheader', colSpan: 3, alignment: 'center' }, {}, {}],
                [{ text: 'g', colSpan: 3, style: 'textWhite' }, {}, {}],
                [
                    {
                        text: 'Name',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: data.reportToName,
                        style: 'textNormal'

                    }
                ],
                [
                    {
                        text: 'Designation',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: data.reportToDesignation,
                        style: 'textNormal'

                    }
                ],
                [
                    {
                        text: 'Department',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: data.reportToDepartment,
                        style: 'textNormal'

                    }
                ],
                [
                    {
                        text: 'Company',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: data.reportToCompany,
                        style: 'textNormal'

                    }
                ],
                [{ text: 'g', colSpan: 3, style: 'textWhite' }, {}, {}],
                [{ text: 'Job Purpose', style: 'Subheader', colSpan: 3, alignment: 'left' }, {}, {}],
                [{ text: data.jobPurpose, colSpan: 3, style: 'textSmall' }, {}, {}],
                [{ text: 'g', colSpan: 3, style: 'textWhite' }, {}, {}],
                [{ text: 'Key Accountabilities', style: 'Subheader', colSpan: 3, alignment: 'left' }, {}, {}],
                [{ text: data.keyAccountabilities, colSpan: 3, style: 'textSmall' }, {}, {}],

            ]
        },
        layout: 'noBorders'
    },
            ],
            styles: {
                header: {
                    fontSize: 22,
                    bold: true,
                    alignment: 'justify',

                },
                Subheader: {
                    fontSize: 16,
                    bold: true,
                    alignment: 'justify',
                    color: 'black',
                    fillColor: '#E2DCDC',
                },
                textBold: {
                    fontSize: 14,
                    bold: true,
                    alignment: 'left',
                    color: 'black',
                },
                textNormal: {
                    fontSize: 14,
                    alignment: 'left',
                    color: 'black',
                },
                textWhite: {
                    color: 'white'
                },
                textSmall: {
                    fontSize: 12,
                    alignment: 'left',
                    color: 'black',
                }
            },
            pageSize: 'A4',

            // by default we use portrait, you can change it to landscape if you wish 
            pageOrientation: 'porttrait',

            // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins 
            pageMargins: [80, 40, 80, 30],
        }

        return docDefination;
    }

    fac.GenerateObjectiveReport = function (data) {

        var date = new Date(data.joiningDate);
        var joinDate = $filter('date')(date, 'dd/MM/yyyy');

        var docDefinition = {
            content: [
		{
		    image: 'data:image/png;base64,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',
		    width: 100,
		    height: 30,
		    alignment: 'center',
		    margin: [0, 0, 0, 20]
		},
		{
		    text: 'Employee Objective Information',
		    alignment: 'center',
		    style: 'header',
		    decoration: '',
		    margin: [0, 0, 0, 20]
		},
		{
		    color: 'black',
		    table: {
		        widths: [100, 20, '*'],
		        headerRows: 2,
		        // keepWithHeaderRows: 1,
		        body: [
                    [{ text: 'Employee Information', style: 'Subheader', colSpan: 3, alignment: 'center' }, {}, {}],
                    [{ text: 'g', colSpan: 3, style: 'textWhite' }, {}, {}],
                    [
                        {
                            text: 'ID',
                            style: 'textBold'

                        },
                        {
                            text: ':',
                            style: 'textBold'

                        },
                        {
                            text: data.employeeId,
                            style: 'textNormal'

                        }
                    ],
                    [
                        {
                            text: 'Name',
                            style: 'textBold'

                        },
                        {
                            text: ':',
                            style: 'textBold'

                        },
                        {
                            text: data.employeeName,
                            style: 'textNormal'

                        }
                    ],
                    [
                        {
                            text: 'Email',
                            style: 'textBold'

                        },
                        {
                            text: ':',
                            style: 'textBold'

                        },
                        {
                            text: data.email,
                            style: 'textNormal'

                        }
                    ],
                    [
                        {
                            text: 'Designation',
                            style: 'textBold'

                        },
                        {
                            text: ':',
                            style: 'textBold'

                        },
                        {
                            text: data.designation,
                            style: 'textNormal'

                        }
                    ],
                    [
                        {
                            text: 'Department',
                            style: 'textBold'

                        },
                        {
                            text: ':',
                            style: 'textBold'

                        },
                        {
                            text: data.department,
                            style: 'textNormal'

                        }
                    ],
                    [
                        {
                            text: 'Section',
                            style: 'textBold'

                        },
                        {
                            text: ':',
                            style: 'textBold'

                        },
                        {
                            text: data.section,
                            style: 'textNormal'

                        }
                    ],
                    [
                        {
                            text: 'Company',
                            style: 'textBold'

                        },
                        {
                            text: ':',
                            style: 'textBold'

                        },
                        {
                            text: data.employeeCompany,
                            style: 'textNormal'

                        }
                    ],
                    [
                        {
                            text: 'Joining Date',
                            style: 'textBold'

                        },
                        {
                            text: ':',
                            style: 'textBold'

                        },
                        {
                            text: joinDate,
                            style: 'textNormal'

                        }
                    ],
                    [
                        {
                            text: 'Reorts To',
                            style: 'textBold'

                        },
                        {
                            text: ':',
                            style: 'textBold'

                        },
                        {
                            text: data.reportToName,
                            style: 'textNormal'

                        }
                    ],
                    [
                        {
                            text: 'Designation',
                            style: 'textBold'

                        },
                        {
                            text: ':',
                            style: 'textBold'

                        },
                        {
                            text: data.reportToDesignation,
                            style: 'textNormal'

                        }
                    ],
                    [
                        {
                            text: 'Department',
                            style: 'textBold'

                        },
                        {
                            text: ':',
                            style: 'textBold'

                        },
                        {
                            text: data.reportToDepartment,
                            style: 'textNormal'

                        }
                    ],
                    [
                        {
                            text: 'Company',
                            style: 'textBold'

                        },
                        {
                            text: ':',
                            style: 'textBold'

                        },
                        {
                            text: data.reportToCompany,
                            style: 'textNormal'

                        }
                    ],
                    [{ text: 'g', colSpan: 3, style: 'textWhite' }, {}, {}],
                    [{ text: 'Objective Information', style: 'Subheader', colSpan: 3, alignment: 'center' }, {}, {}],
                    [{ text: 'g', colSpan: 3, style: 'textWhite' }, {}, {}],
                    [
                        {
                            text: 'Objective Id',
                            style: 'textBold'

                        },
                        {
                            text: ':',
                            style: 'textBold'

                        },
                        {
                            text: data.objectiveId,
                            style: 'textNormal'

                        }
                    ],
                    [
                        {
                            text: 'Objective Title',
                            style: 'textBold'

                        },
                        {
                            text: ':',
                            style: 'textBold'

                        },
                        {
                            text: data.title,
                            style: 'textNormal'

                        }
                    ],
                    [
                        {
                            text: 'KPI',
                            style: 'textBold'

                        },
                        {
                            text: ':',
                            style: 'textBold'

                        },
                        {
                            text: data.kpi,
                            style: 'textNormal'

                        }
                    ],
                    [
                        {
                            text: 'Target',
                            style: 'textBold'

                        },
                        {
                            text: ':',
                            style: 'textBold'

                        },
                        {
                            text: data.target,
                            style: 'textNormal'

                        }
                    ],
                    [
                        {
                            text: 'Weight',
                            style: 'textBold'

                        },
                        {
                            text: ':',
                            style: 'textBold'

                        },
                        {
                            text: data.weight,
                            style: 'textNormal'

                        }
                    ],
                    [
                        {
                            text: 'Note & Action',
                            style: 'textBold'

                        },
                        {
                            text: ':',
                            style: 'textBold'

                        },
                        {
                            text: data.note,
                            style: 'textNormal'

                        }
                    ],
		        ]
		    },
		    layout: 'noBorders'
		},
            ],
            styles: {
                header: {
                    fontSize: 22,
                    bold: true,
                    alignment: 'justify',

                },
                Subheader: {
                    fontSize: 16,
                    bold: true,
                    alignment: 'justify',
                    color: 'black',
                    fillColor: '#E2DCDC',
                },
                textBold: {
                    fontSize: 14,
                    bold: true,
                    alignment: 'left',
                    color: 'black',
                },
                textNormal: {
                    fontSize: 14,
                    alignment: 'left',
                    color: 'black',
                },
                textSmall: {
                    fontSize: 12,
                    alignment: 'left',
                    color: 'black',
                },
                textWhite: {
                    color: 'white'
                }
            },
            pageSize: 'A4',

            // by default we use portrait, you can change it to landscape if you wish 
            pageOrientation: 'porttrait',

            // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins 
            pageMargins: [80, 40, 80, 30],
        }
        return docDefinition;
    }

    fac.GenerateOtherObjectiveReport = function (data) {

        var date = new Date(data.joiningDate);
        var joinDate = $filter('date')(date, 'dd/MM/yyyy');

        var docDefinition = {
            content: [
    {
        image: 'data:image/png;base64,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',
        width: 100,
        height: 30,
        alignment: 'center',
        margin: [0, 0, 0, 20]
    },
    {
        text: 'Employee Objective Information',
        alignment: 'center',
        style: 'header',
        decoration: '',
        margin: [0, 0, 0, 20]
    },
    {
        color: 'black',
        table: {
            widths: [100, 20, '*'],
            headerRows: 2,
            // keepWithHeaderRows: 1,
            body: [
                [{ text: 'Employee Information', style: 'Subheader', colSpan: 3, alignment: 'center' }, {}, {}],
                [{ text: 'g', colSpan: 3, style: 'textWhite' }, {}, {}],
                [
                    {
                        text: 'ID',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: data.employeeId,
                        style: 'textNormal'

                    }
                ],
                [
                    {
                        text: 'Name',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: data.employeeName,
                        style: 'textNormal'

                    }
                ],
                [
                    {
                        text: 'Email',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: data.email,
                        style: 'textNormal'

                    }
                ],
                [
                    {
                        text: 'Designation',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: data.designation,
                        style: 'textNormal'

                    }
                ],
                [
                    {
                        text: 'Department',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: data.department,
                        style: 'textNormal'

                    }
                ],
                [
                    {
                        text: 'Section',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: data.section,
                        style: 'textNormal'

                    }
                ],
                [
                    {
                        text: 'Joining Date',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: joinDate,
                        style: 'textNormal'

                    }
                ],
                [
                    {
                        text: 'Company',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: data.employeeCompany,
                        style: 'textNormal'

                    }
                ],
                [{ text: 'g', colSpan: 3, style: 'textWhite' }, {}, {}],
                [{ text: 'Reports To', style: 'Subheader', colSpan: 3, alignment: 'center' }, {}, {}],
                [{ text: 'g', colSpan: 3, style: 'textWhite' }, {}, {}],
                [
                    {
                        text: 'Name',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: data.reportToName,
                        style: 'textNormal'

                    }
                ],
                [
                    {
                        text: 'Designation',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: data.reportToDesignation,
                        style: 'textNormal'

                    }
                ],
                [
                    {
                        text: 'Department',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: data.reportToDepartment,
                        style: 'textNormal'

                    }
                ],
                [
                    {
                        text: 'Company',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: data.reportToCompany,
                        style: 'textNormal'

                    }
                ],
                [{ text: 'g', colSpan: 3, style: 'textWhite' }, {}, {}],
                [{ text: 'Objective Information', style: 'Subheader', colSpan: 3, alignment: 'center' }, {}, {}],
                [{ text: 'g', colSpan: 3, style: 'textWhite' }, {}, {}],
                [
                    {
                        text: 'Objective Id',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: data.objectiveId,
                        style: 'textNormal'

                    }
                ],
                [
                    {
                        text: 'Objective Title',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: data.title,
                        style: 'textNormal'

                    }
                ],
                [
                    {
                        text: 'KPI',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: data.kpi,
                        style: 'textNormal'

                    }
                ],
                [
                    {
                        text: 'Target',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: data.target,
                        style: 'textNormal'

                    }
                ],
                [
                    {
                        text: 'Weight',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: data.weight,
                        style: 'textNormal'

                    }
                ],
                [
                    {
                        text: 'Note & Action',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: data.note,
                        style: 'textNormal'

                    }
                ],
                 [{ text: 'g', colSpan: 3, style: 'textWhite' }, {}, {}],
                [{ text: 'Appraisal Information', style: 'Subheader', colSpan: 3, alignment: 'center' }, {}, {}],
                [{ text: 'g', colSpan: 3, style: 'textWhite' }, {}, {}],
                [
                    {
                        text: 'Self Appraisal',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: data.selfAppraisal,
                        style: 'textNormal'

                    }
                ],
                 [
                    {
                        text: 'Performance Appraisal',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: data.performanceAppraisal,
                        style: 'textNormal'

                    }
                 ],
                [
                    {
                        text: 'Comments',
                        style: 'textBold'

                    },
                    {
                        text: ':',
                        style: 'textBold'

                    },
                    {
                        text: data.comments,
                        style: 'textNormal'

                    }
                ]
            ]
        },
        layout: 'noBorders'
    },
            ],
            styles: {
                header: {
                    fontSize: 22,
                    bold: true,
                    alignment: 'justify',

                },
                Subheader: {
                    fontSize: 16,
                    bold: true,
                    alignment: 'justify',
                    color: 'black',
                    fillColor: '#E2DCDC',
                },
                textBold: {
                    fontSize: 12,
                    bold: true,
                    alignment: 'left',
                    color: 'black',
                },
                textNormal: {
                    fontSize: 12,
                    alignment: 'left',
                    color: 'black',
                },
                textSmall: {
                    fontSize: 12,
                    alignment: 'left',
                    color: 'black',
                },
                textWhite: {
                    color: 'white'
                }
            },
            pageSize: 'A4',

            // by default we use portrait, you can change it to landscape if you wish 
            pageOrientation: 'porttrait',

            // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins 
            pageMargins: [80, 40, 80, 30],
        }

        return docDefinition;
    }

    fac.GeneratePerformanceReport = function (info,objective) {

        var date = new Date(info.joiningDate);
        var joinDate = $filter('date')(date, 'dd/MM/yyyy');


        /* This object for Footer Row that show Total Score */
        var FooterRow = [{ text: 'Total Score', style: 'textPBold', colSpan: 5, alignment: 'right' }, {}, {}, {}, {}, { text: info.totalScore, style: 'textPNormal' }];
        var SingleRow = [];

        objective.forEach(function (row,index) {
            var dataRow = [{ text: index + 1, style: 'textPNormal' }, { text: row.title, style: 'textPleftNormal' }, { text: row.weight, style: 'textPNormal' }, { text: row.selfAppraisal, style: 'textPNormal' }, { text: row.performanceAppraisal, style: 'textPNormal' }, 
                { text: row.score, style: 'textPNormal' }];
            SingleRow.push(dataRow);
        })
        SingleRow.push(FooterRow);

        var dd = {

            content: [
                {
                    image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKgAAAA3CAYAAACYewEiAAAWwklEQVR4Xu1de3wU1b3//maSQHgjDzXKJiRC0uLVoljJbtBaazFQbWuF6yNYpWprbW9ri1weu3HrLA+tr0of6q3VCrRKb23r1cQ3liSb9MFV621NeIRsGqCAyPuRZGd+93Nmk52Z3dmd2RAIaM5f2czvnN/v/OY7Z875vYYmrZl+WueRzlw4tA1ffXOrE01fXT/n0fJh0vD2oen4U47MTde/tq1PZAyE5wLwdfGOQPHe2ydynIJMqWRl+QsguspJ9sZNVTKC0JzoEq5T4bhxX4ckzQRjRIZ9wYRnt0QiP3HqV7JqxjIAC9LRMUNrmlMlO42FQP1sMD8dpyO8DMV7jWM/f/g9AEUGnTwJoYu36L8DdU8BdLNpjBuheH/lOKaZIBBut9Ar3gHx3/66nyaMfzdCXkNv/nAzgDNc8SPsgOIdb4wdPmzpF/IOiv8O1H8DzA+ZdPVLKN470vIJhDeBkRenUdVPYdm0Dan6HBeAFhQUFMiMPwMY40opaYiYtYXNra3L043TuwCtuQGQVxv8+CUovi84ziMQ3gjgnDgd8zkI+TbbA5Q0tONc3F/6vuO43QSBMCcAlEwg+jkIXzN4S99FaOqPTADeBqIzXfL6FxSvQZuObyD8LQArDL54EiHvrWn5+MNtIJwVp4niE1jmbTxRAKVCT/4zRFQhGHYMOxMH86fiUP5F0LKNB8+NouSj+5D3+nJInUfArAWbW1t/kKrfqQdQfSb7cYQn4AHfTjf6QD9A06vJ6RVfAAyUPQUbQBinDhiKHWXfxJG88wAyHnRXN8JElL1/O87+nwWQ1E5m8MPNkcj37cY4RQEKgDZiR/YkPDGl01E3vQnQaHQSBhxss+eZqyF42cH4tY/ICioVefI3gKio/bQCbP18AJzjeO5yvCeCIOvQB8j/7X+IP1kDL9kSiQQSO566ANVn8gYU7+ccldGbAO3Q8nFfWasjT0HwUQBokafgDyBcreaOQMusn7qadyZEUvtBjH/udr0Ls7aoubVVHIri7RQHqJjUfQj50h7yevUV/3EC6HiPZ5ZE0hp14DC0zH4sE9xlRJt1cBfGvTAfUrQdmyMtln3DKQjQBwCIfXrsZM0QB6BrEPL+PqVS+lfQHu1Bs4ryCw4ByIl8+WFEh56eEegyJT7jzR9icNvbpz5AWVPA6n9ByvoHQEO69NCBjs4puO9SYa5Kbv0AzRyghePy55JET+4vugS7fN/IFG8Z03+kABoqq8TC8KXIojcBlmLK4A8gjxiP4CTjkNKtpd4EKElzoXZ+YHsD1Kz3sLy0JX7tVN6DFnryVSKSWmb9DGru8PSAYw1j6n+OIS0N+jutJ43UThBrH40VVABUtERbIrANitewEx4PgKZX/reheH98ygM0Ly9vUG52zqGjo4qwdaaSesrMGLbxTYxpeDK2RjALb5TVK5IJWglHmyOR08xdTrk9qHjFdwM0BtLf6nvQeKO1UEo/a1FLb66gHweAFo4ruIskPLT7guuw99yrU045d9t7yHt9mQDmESbM3xKJ/AyAmgkmnWhPeYDOWiOjZNwfAe7214tHOQDFF3K1kvnDmXmSmN9Os0g8iJDvv13xPZk9SYWe/BoiKot86SFEh6V28xaunANiFaxGz2tua7M/ADgh0OH68QUoXoXine4oYiAs/O4Fcbq0rk4shOK1um/nvTsYuYeEy+/s2KtGf4i/hJD3xa6tQO+5Oj8OZqbC/AKhzOLmOavTeouKnrlBaLt+cyTidbzJPSToVYD6664F0W9MotRA8V7iKFog/C8AhhlD6/RgyaX/jIErIViEMR8h7w+Txpxfm4ccqQWE7K5rHWjXxuP+sm39dlCHO5Do6izy5G9mSSrUAZqm6QBlPLe5teU6x5vcQ4JeBujnQfSKSZQmKN6StKLd/tdsnN4h9tWGfbZdG4b7yw5kBFAdzOt8QFatid9RyMOHQ92XGM3U82CRj8cKmt8Mksa7ASiDf9UcidzYQ/w5dutVgC4MlyAL5iijKI4MHoEHzhf2XvsWqLkYkIV5ItYY+xDyGuGFblfQ7v7+8J0gGCdpxkYQJliYK95+gJoVkriCFub3LkDH540vlrK1x5iRlRaRhP3NkchMM02vAjTIEtT6fQC6DejC9DAPId+DKeXy160CkfEAMjcg5CuN02cKUH0lDYvDZGrjcj9ArbfjeAO0yOOZD5Luc1wugeNrB42B43f6AcVYEo9CQj5+YBMat7BmImS5EWR6vTNuRcgbs6vp47ncg5onH1ybBXVgA8AX2uqkH6AnFqCFnoIFRFi2dXoljp5uv+U7IZ4kMe2F68ZAlreDyBqBz9pXkDXwZbQc0DD6NBkDDy0GYaFFU4xDCHmN1benABX99L1t+06AkrMRTkaAAjvAJAK3kxvxBijeryExYJnxvwBZo/a7e5O6qMcR9b39ij+pACoU5K+7A0SZhWYJ0xAjH0u81vytnqyg3TdpfsPZGKAJE5Z163NyAjT1C1AAMeS9MAmg6V6ZHP1yP0DTKchffw2g/QpERv5PavoWdKqXY/k0kf9jbccCUDHSPQ1ToWn1lkH7AfoxfsWbp35XOBeD6QpAuxdE5yeBj/lVMAWwoW09fjPb3kO2aN15yMo2/Oua1BhPqEv3gJivVTbcAtZ+Ef+XGaCBuosAyUh0i0bfsSSi+WuvBskD4313ZL+IJ6bYv1aTHq762dYHo3RN/PeC8DnIpgtcTYFoD+6d+hoq668Cw100u8Z1/SuoK+32E/WVBvoB2lea7+frSgM9Bmhve5JOukOSWX0L/zQKsnodCJ8FYyKIRgrjKIB9ADUBvBbRw7/Gss/tTqn1764dgSFZn7K9TjID8l7IhzdbEtZc3cIuogV/KUR2p3gdlwEkjPrDAE0k4wkX7LsAv4bGbb9NuQ3p5rXw9VGQB/xbnDXTQSwp+6ujKItrp4LY2EbsO1CPFTNi3q9A7SQw26egE6mISruwqW2jnWw9BmjcF39T+voDXb74hs2RiGG4tpltN0AdFdFTOyigNlVUpXcCJDK/ee1AeHJeA9PUpFN0Ii2zCpLWQZl6OUDJAa/+ms+A5LVp5ydSPwjbwXgdodKbbcdJHCDY8ElE1edAdK6j7hhHAHoaoal3phy7sm4mmGIBKnrj96D4znMcOzFYRtbyEexKzPOHfwPCtennLvRHW6BpT2JJWTyQpucA9RSsI8K01i8+iM7hqWsCxAAKaGr0/C1tbX9LJaTH4ynMJkm4GHMclLFrc6RlrJnGlScpU4D6a68BSSJOM9OmgXlivGhDd283ALVyUtGJEiz3bkopgL/uURB9O1MBAUQRjeZh2SW7kvr2FUATBek6BB4LQL9LhIed4kEH7ngfZ70SC2hmlb/SAfWt9vb2jh4oVe+ya9cu8dqw5JH3OkAXh+dBgjXaKLa6NYH55yD+M5hyAfocCLMsYXb6RIV8crHlpJ4M0MNgFkbqQSAMBuMMEBLTEg5D3j0GwauST9yB8AsA7EoWiUoXH4BwBAwZRMMAGmWklZg0bxc0ckIAyq1gfAiQBNJP9CIKbFgCJnZDKR3TY4COHj166PDBQ/Y7RtQLzo2vYvRfntHTNY65MUc3t0a6w9H04XoVoJX15WCuSpAzAs6ejtBFTbbyCzMOpGe7lB0jYUSwb29xfB+WDNB/QPFOsownAoCZH7F4sJi/iZBP+OWNZu+n3wYN87Ck9Nmk17cexkdBEN1mGUc8SGr0LMtKekIASrdAKTXqXwmh/OGFICxNkO/WHgNUDFSUX6AxSRS55kdQB49Kiz358IcYtnEthjTXQe5IHRiUbhBRBoe0aM988W5e8brNE7stQAOasXfvZKyYsT/tBAMNFwKaqEfVlQCHFyFLNyI4NdbPDUBjN+ohEO4yePE/ofg88d+L6y6BJK21rIjMv0dIFDiz2ftagT0ZwF8AGC5cxjsIecX/Y62vABqb+9MgfDUuC+PNYwNoQcHNYDy1v2gadvnSFzVLe3NdXjwmX7wbgFbWh8C82KQgFVk5wxB0a9SuWwnweBw5NB0PTLc+hW4BGoumshr85VdlBIOx108gLCrBmULv6F0oUyc7grN7UovDn4aEP1lVztdD8T3b5wCtDF+uHxDjjbZQyaoZCQlb9mjZnXN46K7ZbyWmw4q8eLE/yu7bvPjy9YCjRyPaWFFl2RokzTQxMY3pZwiVftPl85OezC1AYyC0WgHkUhlB0hD40zRAXWdipKFTnWDrXk0nTSD8HADDQ2ReRftyBV1UfwFkXm8SfTsVryz/IRHNc7oJRCh4/8aqSCJd0bhx/w5JfjaaOwKR41D2pptf1oEdGCcKidlWFik/CNDgdHNg8NGmiurULrZ5rwxG7lDrA2h2JzopyOm6W4AuqClEthwr2yga8wGEfLEDRKDuJwAZD4xujvJe4cQ66fri8FmQIGozdW9HgGh0rL4X7UuA+uuvBvEfTG+wjVS8+spZxJLhX005W17RWFGtV/FKaFTkKfi9qM10dFQhts40EhEzVlyKDqKA2Lg/3K2DE+D5myOR+Ak77/ELBw0ddPoBIpOybcZhYH9TRVXq5H1/3S0gMnzd4gAR8jqZvNxP0S1AA2FhFDfFgPJSKL7YtiNQ1wTQRIMp3QGltGf1hgLh7daituoUKNPW9ylAA+E3AJjTravJs3rmyEHMHzppmgGtqSJlheLswvyCTQR42kfmo+0LS4+p7KJZFqn9EArWfCOWGcpY0NzaYglqnrjyygclkr7nLL+2sqni5ZtS0gXCj4sITNPTuw4h76Up6e+pGwvqcAPgvbp3yAmg8+rGIpfE/svw4gjmUXk0ll0c81AFxN60uwqJvrx+GopPHHoyb4GwnvRomu9VegZpX62gdsZ8DbP1vJbiVeU7CGQxftvNmMFlTRXVdam0UeTJ/wBEo1jKwtYr70H7qMJjAqpYOT3P3wVoUQZ4eXNr6yIL7yCk4nNm7CBgtNMd6uyIejbPfTWWZWnXArXPA9KXjUv8LBTf9Snp/eH1ILiI5OHvQPE9agPQ9CILzxTo2nhBMT3CfkBiHdHzoHh7lsodCP8dwCfjQmh8E5b4Vp4YgDrdLf16GxTvuBhAV86oJsKVzt14d2NFdVowFHnyXwLRDP3hzx2JDz91LTpGesBkbHec+QBS9CjOfON+/bXOrC1LAieAiSvLvyURGSWo0wzcWFGVvpJu4goq/OuKz1rdwzy+W4Ayz9ILISSvoB1gZFtSRWLjRyEOLVnZtyB40f9ZpuSvi1ptpPRFhEqFwT7zJurWE4wQPUY5Qt6XTwqAChtyVttEBGd36Ddt4uqZhRKzsTFPM10mBJpurEq70Sz0eMpA0goC7IMjMlCn3WtddC/55eWjWB7wT4JzbCEDa5sqqlKDTQy4uP6rkEwfTwCOQDF9MCBR5sW1lSDJsE92XzfXihf/U6UzsHTqDhuAbgKoFmDzxxU0qNGzsfQSsT9MbomrHvAEFO/XM1CnQeoP7wfB+DKKypOx1PdOMkCxBYq30JFHICxKmRsBIRrOjmcWuPLFC08d/w2Mn6Bp6y+6A0fiq0rJqhkuK3pxVGNtyoY5r7zrJHR+fv6ZchQXkMxXAJKbqHTrkBq/urktIhLYklrJqvJGgIw9VBphopJ67qYbXhGvtNTt21UDMGLEUQtBT07xqWooJa+gm9BYWoKSeuEPH2nw5e1QfMZXMMwCVYYfApuM+IzdCJWOcW0D7R7LzlvWqZ6G5dP2YFHtZZClN01s9Vet071GICy2H0YwTkfOCNw3RWTHCgN8YrDIXdAQK47BUQ05gzqxe/gBrJiQVLPLAOjqK68Buw+OaJfaz9hywxs7HAU/DgTFK2fWEHGZm6EZvK2pojq5WpztCpVwCCFegnt9fjd8Yjei7jYQPRGnFzlKIW/sptkBVPFOQPDtEVCP7LHwYDyPkPcrSXxF/j3L9dZtAf0nlNL7XcsoiksEwmJxMYfU1SJUOk0fI+YRM4fX7YHitRRrS+L1/bWjMWiAEXiSaAFJAqiNqzPFBIx92ZpZckn7IbHsu/0ch6Z1dEzYMPf15BycDLSVEemaSTnF7Z7fUdce101fBs9qqqg2imGl6xSo/x7A5vz3KDrVsfrK4qYF6nYBZOzRGZUIeWORMkkA5UYovk/o1yrD94KRWHv/M1C8f0xi6w+/C4I1/E2VzsfSqSkjxSxjJM9RhMHM0PefogUbzoaqGYdJcfUQRuNhb2pLz8J1lyIr6y0Tn51QvEYZoF4BqNjXPVN+FSRyvekWH8cC8febKqrFN3lcbhHc3OlkmpJfzpgImV8CyPgWkcNQDH6vqaLaOZaxe5zYa14E+JrSfLkZsjw57lNPxdMfvh+Eu02XO3AQZ8ZvbDozk6huV3zWekvOE+MA1GhRUkhcoOZ8QBbeFrM/XURaXWYLaLO8yeAU1XreglJ6mUHGBH94B4iM/STTUwiViq/l2bdkk9VbCHmNMXsLoGKbWrJqhniFXJwhjCIq050b57z0Uob9HMnzHr9q0NDB0ecBuoLMng8ncDI0VeWJm26udnX4iw+XWMZGXGDsAvFMe5ujODaGHwPTbWmLNzjZQRc1nA5ZE5+GMQdVr4finWKzitpF/ogFYi2ysm9D8CLrW21ReDpk8WYga/QUczt2DjgtKYHOH74bBPO2QYOGa7HEm3weqKx7FJwQkyrTeARNVZp7DaAAdMM9eCecStCkAAiDXwDz/KY5L9uHpjlCEsDjF2ZPGDT2OzLoBxlsOSwjaxqv2HCTrefLWYJA3XUA/ToF4YsA1eiZicSiIJpdlYnfJX0+0Qmg+jYgwZsl/qdpd2NJmfjogrX5a38Mku50nkwaitSHQLGKiqgu0+FNf1L3AMItHm0Csi8FtABARpqHzoqbofhMn4S0OyT1ZA9qmkfxMzNnkcQu3J/HpJ7j1pkZ7zfNqTKM0D3hJHJsJOk1S40mV+Pw01B8tyQDKinlIzkeVHSqrK8BJxwA2+mTtp9NDIRvB+ORhPBAZymZ38XRIb60BdH8dQJkf3dZE6CbZwtq2ifgrcuiFiF6cwXtHrhk9ZUPgp1diM7aONEUvP1gzt6ittn1R46Z8+2PZ+P0c38KxhwXN+ptQPeNJ4SydUnhZgUVpDGPkTC3GJ4NYQ3YmZNr+0U6fWvAjwD6au7U2sBaEKEyo25Uuh4xC4M4YF7uMLBwLjyJfXu/Ew/QNnc4HgAV409cVf6ABLL9/KCTJvriOgMfdEhZ52654YXeNX+JQOYh8hSw9lmQNhlMI7tSKjZBwh+hyX91LMQQXDsQ0RzD3MXRjniB20RlCdBJqrW+U9aIHbZf/+juG4vGmgLwNIAmg3X3bwcIzQDXgKX1CGXw8VqzTMFaDzolH0jYs8UHc/VKK/sB/js06RVo0Ya0lo7E+XTwznjtVAegOH5Ic+LK8iUSkdUH3hfoc+a55+DOPWe1fa8XVk5nXv0UJ0gDjgAVchSvKp9LwGMApQ/4PUFCJ7Jh4J2miiojbaGP5Ohn2/sacAVQHaS/viIPavYbZH9q7X3JXIzIjHYmXryhojp1cVkX4/STnLwacA1QfQpBSCVF5bcy0SNugjSO57R1c5YcvaPp+te2HU8+/WP3rQYyA2iXrAVPfWbggOyB1xKklX0g/ovRHJ67aXZ1ctGBPhCmn+Xx1UCPAGoWqeiZz4/NkrJETKYIZxtJZhfcMcvODFEbSOLtGvOCDRUv20Y2HTOb/gFOWg0cM0ATZ1a0euaF2Zo6hYlKiKUxTNoAci5nI4ZRmamTiPZp4C2s4j01t6OmefbrsZCt/vax1MD/AxIIYYslYxgaAAAAAElFTkSuQmCC',
                    width: 100,
                    height: 30,
                    alignment: 'center',
                    margin: [0, 0, 0, 20]
                },
                {
                    text: 'Employee Performance Appraisal Information',
                    alignment: 'center',
                    style: 'header',
                    decoration: '',
                    margin: [0, 0, 0, 20]
                },
                {
                    color: 'black',
                    table: {
                        widths: [100, 20, '*'],
                        headerRows: 2,
                        // keepWithHeaderRows: 1,
                        body: [
                            [{ text: 'Employee Information', style: 'Subheader', colSpan: 3, alignment: 'center' }, {}, {}],
                            [{ text: 'g', colSpan: 3, style: 'textWhite' }, {}, {}],
                            [
                                {
                                    text: 'ID',
                                    style: 'textBold'

                                },
                                {
                                    text: ':',
                                    style: 'textBold'

                                },
                                {
                                    text: info.employeeId,
                                    style: 'textNormal'

                                }
                            ],
                            [
                                {
                                    text: 'Name',
                                    style: 'textBold'

                                },
                                {
                                    text: ':',
                                    style: 'textBold'

                                },
                                {
                                    text: info.employeeName,
                                    style: 'textNormal'

                                }
                            ],
                            [
                                {
                                    text: 'Email',
                                    style: 'textBold'

                                },
                                {
                                    text: ':',
                                    style: 'textBold'

                                },
                                {
                                    text: info.email,
                                    style: 'textNormal'

                                }
                            ],
                            [
                                {
                                    text: 'Designation',
                                    style: 'textBold'

                                },
                                {
                                    text: ':',
                                    style: 'textBold'

                                },
                                {
                                    text: info.designation,
                                    style: 'textNormal'

                                }
                            ],
                            [
                                {
                                    text: 'Department',
                                    style: 'textBold'

                                },
                                {
                                    text: ':',
                                    style: 'textBold'

                                },
                                {
                                    text: info.department,
                                    style: 'textNormal'

                                }
                            ],
                            [
                                {
                                    text: 'Section',
                                    style: 'textBold'

                                },
                                {
                                    text: ':',
                                    style: 'textBold'

                                },
                                {
                                    text: info.section,
                                    style: 'textNormal'

                                }
                            ],
                            [
                                {
                                    text: 'Company',
                                    style: 'textBold'

                                },
                                {
                                    text: ':',
                                    style: 'textBold'

                                },
                                {
                                    text: info.employeeCompany,
                                    style: 'textNormal'

                                }
                            ],
                            [
                                {
                                    text: 'Joining Date',
                                    style: 'textBold'

                                },
                                {
                                    text: ':',
                                    style: 'textBold'

                                },
                                {
                                    text: joinDate,
                                    style: 'textNormal'

                                }
                            ],
                            [
                                {
                                    text: 'Reort To',
                                    style: 'textBold'

                                },
                                {
                                    text: ':',
                                    style: 'textBold'

                                },
                                {
                                    text: info.reportToName,
                                    style: 'textNormal'

                                }
                            ],
                            [
                                {
                                    text: 'Designation',
                                    style: 'textBold'

                                },
                                {
                                    text: ':',
                                    style: 'textBold'

                                },
                                {
                                    text: info.reportToDesignation,
                                    style: 'textNormal'

                                }
                            ],
                            [
                                {
                                    text: 'Department',
                                    style: 'textBold'

                                },
                                {
                                    text: ':',
                                    style: 'textBold'

                                },
                                {
                                    text: info.reportToDepartment,
                                    style: 'textNormal'

                                }
                            ],
                            [
                                {
                                    text: 'Company',
                                    style: 'textBold'

                                },
                                {
                                    text: ':',
                                    style: 'textBold'

                                },
                                {
                                    text: info.reportToCompany,
                                    style: 'textNormal'

                                }
                            ],
                            [{ text: 'g', colSpan: 3, style: 'textWhite' }, {}, {}],
                            [{ text: 'Performance Appraisal Information', style: 'Subheader', colSpan: 3, alignment: 'center' }, {}, {}],
                            [{ text: 'g', colSpan: 3, style: 'textWhite' }, {}, {}],
                        ]
                    },
                    layout: 'noBorders'
                },
                 {
                     color: 'black',
                     table: {
                         widths: [10, 190, 38, 50, 70, '*'],
                         headerRows: 2,
                         // keepWithHeaderRows: 1,
                         body: [
                             [{ text: 'SL', style: 'textPBold' }, { text: 'Title', style: 'textPBold' }, { text: 'Weight', style: 'textPBold' }, { text: 'Self Appraisal', style: 'textPBold' }, { text: 'Performance Appraisal', style: 'textPBold' }, { text: 'Score', style: 'textPBold' }],
                         ].concat(SingleRow)
                     },
                 },
            ],
            styles: {
                header: {
                    fontSize: 20,
                    bold: true,
                    alignment: 'justify',

                },
                Subheader: {
                    fontSize: 16,
                    bold: true,
                    alignment: 'justify',
                    color: 'black',
                    fillColor: '#E2DCDC',
                },
                textBold: {
                    fontSize: 12,
                    bold: true,
                    alignment: 'left',
                    color: 'black',
                },
                textNormal: {
                    fontSize: 12,
                    alignment: 'left',
                    color: 'black',
                },
                textSmall: {
                    fontSize: 12,
                    alignment: 'left',
                    color: 'black',
                },
                textWhite: {
                    color: 'white'
                },
                textPBold: {
                    fontSize: 10,
                    bold: true,
                    alignment: 'center',
                    color: 'black',
                },
                textPNormal: {
                    fontSize: 10,
                    bold: false,
                    alignment: 'center',
                    color: 'black',
                },
                textPleftNormal: {
                    fontSize: 10,
                    bold: false,
                    alignment: 'left',
                    color: 'black',
                }
            },

            pageSize: 'A4',

            // by default we use portrait, you can change it to landscape if you wish 
            pageOrientation: 'porttrait',

            // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins 
            pageMargins: [80, 40, 80, 30],
        }

        return dd;
    }

    return fac;
}])

myApp.factory('OtherDataServices', ['$http', '$filter', 'serviceBasePath', function ($http, $filter, serviceBasePath) {
    var fac = {};

    fac.getDepartmentList = function () {
        return $http.get(serviceBasePath + '/api/Admin/AdminData/GetDepartments');
    }

    fac.getSectionList = function (data) {
        return $http.get(serviceBasePath + '/api/Admin/AdminData/GetSections');
    }

    fac.getDesignationList = function (data) {
        return $http.get(serviceBasePath + '/api/Admin/AdminData/GetDesignation');
    }

    fac.getJoinSectionList = function (Section,Department) {
        return alasql('SELECT * FROM ? AS Section JOIN ? AS Department ON  Section.DepartmentId=Department.id', [Section, Department]);
    }

    fac.getEmployeeNumbers = function () {
        return $http.get(serviceBasePath + '/api/Core/EmployeeSummery/GetEmployeeSummery');
    }

    fac.addEmployeeNumbers = function (data) {
       return $http.post(serviceBasePath + '/api/Core/EmployeeSummery/Save', data);
    }

    fac.updateEmployeeNumbers = function (data) {
        return $http.post(serviceBasePath + '/api/Core/EmployeeSummery/Save', data);
    }

    return fac;
}])


/*Custom Filter */

myApp.filter('multilineText', function () {

    return function (text) {

        if (text == '')
            return '  ';
        else {
            return text;
        }
    }
});
