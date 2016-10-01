'use strict';
/**
 *
 */

(function() {


var appCommand = angular.module('gasolinemonitor', ['googlechart', 'ui.bootstrap','ngSanitize', 'ngModal']);






// --------------------------------------------------------------------------
//
// Controler Ping
//
// --------------------------------------------------------------------------

// Ping the server
appCommand.controller('GasolineControler',
	function ( $http, $scope,$sce ) {

	
	// --------------------------------------------------------------------------
	//
	//  General
	//
	// --------------------------------------------------------------------------

	this.isshowhistory = false;
	this.showhistory = function( showhistory ) {
		this.isshowhistory = showhistory;
	};
	
	this.listevents = '';
	this.getListEvents = function ( listevents ) {
		return $sce.trustAsHtml(  listevents);
	}
	
	// --------------------------------------------------------------------------
	//
	//  Manage the query
	//
	// --------------------------------------------------------------------------
	this.listqueries= [];
	this.newQuery = function()
	{
		this.currentquery= {};
		this.listqueries.push(  this.currentquery );
		this.resulttestquery ={};
		this.isshowDialog=true;
		
	}
	
	this.editQuery = function( queryinfo ) {
		this.currentquery=queryinfo;
		this.resulttestquery ={};
		this.isshowDialog=true;
	};
	
	this.loading=false;

	this.loadQueries =function() {
		var self=this;
		self.loading=true;
		$http.get( '?page=custompage_gasolinetruck&action=loadqueries' )
				.success( function ( jsonResult ) {
						console.log("history",jsonResult);
						self.listqueries = jsonResult.listqueries;
						self.listevents		= jsonResult.listevents;
						self.loading=false;
				})
				.error( function() {
					self.loading=false;
					alert('an error occure');
					});
	}
	this.loadQueries();

	this.currentquery ={ 'id':'',  'sql':'',    'datasource':'java:comp/env/', 'expl' :'', 'testparameters':''};
	
	/**
	 * Save the query
	 */
	this.saveQuery = function() {
		var self=this;
		self.listeventssave=''; 
		var json = angular.toJson(this.currentquery, false);
		
		$http.get( '?page=custompage_gasolinetruck&action=savequery&json='+json )
				.success( function ( jsonResult ) {
						console.log("history",jsonResult);
						self.listqueries = jsonResult.listqueries;
						self.listeventssave		= jsonResult.listevents;
						self.currentquery.oldId=jsonResult.id;

				})
				.error( function() {
					alert('an error occure');
					});
	}
	
	/**
	 * remove
	 */
	this.removeQuery = function() {
		var self=this;
		if (! confirm("Would you like to remove this query ?"))
			return;
		self.listeventssave=''; 
		var json = angular.toJson(this.currentquery, false);
		
		$http.get( '?page=custompage_gasolinetruck&action=removequery&json='+json )
				.success( function ( jsonResult ) {
						self.listqueries = jsonResult.listqueries;
						self.closeDialog();
				})
				.error( function() {
					alert('an error occure');
					});
	}
	
	
	/**
	 * Test the query
	 */
	this.executing=false;
	this.testQuery = function() {
		var self=this;
		self.listeventstest='';
		self.listeventssave='';
		self.executing=true;
		var json = angular.toJson(this.currentquery, false);
		
		$http.get( '?page=custompage_gasolinetruck&action=testquery&json='+json+'&'+this.currentquery.testparameters )
				.success( function ( jsonResult ) {
						console.log("history",jsonResult);
						self.resulttestquery = jsonResult;
						self.listeventstest= jsonResult.listevents;
						self.executing=false;
				})
				.error( function() {
					self.executing=false;
					alert('an error occure');
					});
	}
	// --------------------------------------------------------------------------
	//
	//  Manage the modal
	//
	// --------------------------------------------------------------------------

	this.isshowDialog=false;
	this.openDialog = function()
	{
		this.isshowDialog=true;
	};
	this.closeDialog = function()
	{
		this.isshowDialog=false;
	};
	
	this.testdisplay='list';
	
	this.currenttab="query";
	this.setTab = function( tab ) {
		document.getElementById( this.currenttab ).className ='';
		this.currenttab = tab;
		document.getElementById( this.currenttab ).className ='active';
	};
	this.getHeaderResultTest = function() {
		var firstline =  this.resulttestquery.rows[ 0 ];
		return firstline;
	}

});



})();