(function() {

  "use strict";

  angular
    .module('scheduler-web')
    .controller('schedulerController', function($state, $scope, $mdSidenav, $mdDialog, $timeout, $http, apiService ) { 

      var vm = this;
      
      vm.scheduleList = [];
      vm.days = ["Sun", "Mon", "Tue", "Wen", "Thur", "Fri", "Sat"];
      
      vm.departmentList = [];
      vm.facultyList = [];
      vm.yearList = [];
      vm.subjectList=[];
      
      vm.department = "";
      vm.faculty = "";
      vm.year = "";
      
      vm.filter="";
      
      vm.message="";
      vm.alertClass="";
      
      function getSchedules()
      {
          $http({method:"GET",
                url: apiService.url+"/schedule"+vm.filter})
          .then( function( response ){
              vm.scheduleList = response.data.result;
          }, function( error ){
              console.log(error);
          });
      }
      getSchedules();
      
      
      function getDepartments()
      {
          $http({ method: "GET",
                url: apiService.url+"/department"})
          .then( function( response){
              vm.departmentList = response.data.result;
          }, function( error){
              console.log(error);
          });
      }
      getDepartments();
      
       vm.updateDept=function()
      {
           vm.applyFilter();
          getYearSemester();
          getFaculty(); 
      }
      
    vm.applyFilter = function()
      {
          console.log(vm.yearList);
          vm.filter="?"
          if( vm.department && vm.department != "" )
          {
                vm.filter = vm.filter + "dept="+vm.department+"&"
          }
          if(vm.year && vm.year !="")
              {
                 vm.filter = vm.filter + "yearsem="+vm.year+"&" 
              }
          if(vm.faculty && vm.faculty !="")
             {
                  vm.filter = vm.filter + "faculty="+vm.faculty+"&" 
             }
          vm.filter = vm.filter.substr(0 , vm.filter.length - 1);
          getSchedules();
      }
      
      
      function getYearSemester()
      {
          var endPoint = "/yearsem";
          if( vm.department && vm.department != "" )
          {
             endPoint = endPoint + "?dept="+vm.department
          }
          $http({method:"GET",
                url:apiService.url+ endPoint })
          .then(function(response){
              vm.yearList=response.data.result;
          }, function(error){
              console.log(error);
          
          });
      }
      getYearSemester();
      
         function getFaculty()
       {
            var endPoint = "/faculty";
          if( vm.department && vm.department != "" )
          {
             endPoint = endPoint + "?dept="+vm.department
          }
          $http({ method: "GET",
                url: apiService.url+endPoint})
          .then( function( response){
              vm.facultyList = response.data.result;
          }, function( error){
              console.log(error);
          });
      }
      getFaculty();
      
      
     
     
      /*Create a new Schedule*/
      vm.subjectId = "";
      vm.section = "A";
      vm.startHH = "9";
      vm.startMM = "00";
      vm.endHH = "10";
      vm.endMM = "00";
      vm.dayOfWeek = "1";
      
      vm.time = [];
      vm.min = ['00','15','30','45'];
      
      vm.createSchedule = function()
      {
          var sch = {};
          sch.subject = vm.subjectId;
          sch.section = vm.section;
          sch.start = vm.startHH + ":" + vm.startMM;
          sch.end = vm.endHH + ":" + vm.endMM;
          sch.day = parseInt(vm.dayOfWeek);
          
          var data =[];
          data.push(sch);
              
            $http(
              { 
              method: "POST",
                url: apiService.url+"/schedule",
              data: data
          })
          .then( function( response ){
                $('#addSchedule').modal('hide');
                getSchedules();
                 vm.message = "Created Successfully!";
                vm.alertClass="alert-success";
             $('.alert').alert();
          }, function( error){
              console.log(error);
                 vm.message = "Creation Failed !";
                vm.alertClass="alert-danger";
             $('.alert').alert();
          });
      }
      
      
      vm.deleteSchedule=function( schId )
      {
         $http(
              { 
              method: "DELETE",
                url: apiService.url+"/schedule",
                  params:{ _id: schId }
               })
          .then( function( response ){
                getSchedules();
                vm.message = "Deleted Successfully!";
                vm.alertClass="alert-success";
             $('.alert').alert();
          }, function( error){
              console.log(error);
             vm.message = "Delete Failed !";
                vm.alertClass="alert-danger";
             $('.alert').alert();
          });
      } 
      
      
      
            
       function getSubject()
       {
           for( var i = 0; i < 24; i++ )
      {
          vm.time.push(i);
      }
           
          $http({ method: "GET",
                url: apiService.url+"/subject"})
          .then( function( response){
              vm.subjectList = response.data.result;
              if(vm.subjectList)
                 {
                    vm.subjectId = vm.subjectList[0]._id;
                 }
          }, function( error){
              console.log(error);
          });
      
      }
      getSubject();
    
    
    
      

      vm.closeSidebar = closeSidebar;
      vm.saveEdit = saveEdit;

      vm.sidebarTitle = 'Edit Classifed';

      vm.classified = $state.params.classified;

      $timeout(function() {
        $mdSidenav('left').open();    
      });

      $scope.$watch('sidenavOpen', function(sidenavOpen) {
        if(sidenavOpen === false) {
          $mdSidenav('left')
            .close()
            .then(function() {
              $state.go('classifieds');
          });
        }
      });

      // Case 1 - close the sidenav and change state manually
      // function closeSidebar = function() {
      //   vm.classified = {};
      //   $mdSidenav('left')
      //     .close()
      //     .then(function() {
      //       $state.go('classifieds');
      //   });      
      // }

      // Case 2 - simply use the watcher to move state
      function closeSidebar() {
        vm.classified = {};
        $scope.sidenavOpen = false;        
      }

      function saveEdit() {
        // Need to clear the form after, or else it will be populated when we go to add new classifieds
        $scope.sidenavOpen = false;
        // showToast('Edit Saved');
        $scope.$emit('editSaved', 'Edit Saved');
      }


    });

})();