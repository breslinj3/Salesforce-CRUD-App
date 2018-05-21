﻿$(document).ready(function () {
    var recordTypeSelect ="<div class='form-group'><label name='recordType'>Record Type</label><select id='recordType' name='recordType' class='form-control'> \
                         <option value='' disabled selected>Please select:</option><option>Account</option><option>Donation</option></select></div>"
// Donation Fields

    var accountName = "<div class='form-group'><label for='AccountName'>Account Name</label><input id='AccountName' name='AccountName' type='text' class='form-control' /></div>";
    var donationName = "<div class='form-group'><label for='donationName'>Donation Name</label><input id='donationName' name='donationName' type='text' class='form-control' /></div>";
    var amount = "<div class='form-group'><label for='amount'>Amount</label><input id='amount' name='amount' type='text' class='form-control' /></div>";
    var donationDate = " <div class='form-group'><label for='donationDate'> Donation Date</label><input id='donationDate' name='donationDate' type='text' class='form-control' /></div>";

//Account Fields

    var newAccountName = "<div class='form-group'><label for='newAccountName'>Account Name</label><input id='newAccountName' name='newAccountName' type='text' class='form-control' /></div>";
    var accountOwnerName = "<div class='form-group'><label for='accountOwnerName'>Owner Name</label><input id='accountOwnerName' name='accountOwnerName' type='text' class='form-control' /></div>";
    var addressStreet = "<div class='form-group'><label for='addressStreet'>Billing Street</label><input id='addressStreet' name='addressStreet' type='text' class='form-control' /></div>";
    var addressCity = "<div class='form-group'><label for='addressCity'>Billing City</label><input id='addressCity' name='addressCity' type='text' class='form-control' /></div>";
    var addressState = "<div class='form-group'><label for='addressState'>Billing State</label><input id='addressState' name='addressState' type='text' class='form-control' /></div>";
    var addressZip = "<div class='form-group'><label for='addressZip'>Billing Zip Code</label><input id='addressZip' name='addressZip' type='text' class='form-control' /></div>";
    var addressCountry = "<div class='form-group'><label for='addressCountry'>Billing Country</label><input id='addressCountry' name='addressCountry' type='text' class='form-control' /></div>";
    var phone = "<div class='form-group'><label for='phone'>Phone</label><input id='phone' name='phone' type='text' class='form-control' /></div>";
    var email = "<div class='form-group'><label for='email'>Email</label><input id='email' name='email' type='text' class='form-control' /></div>";

// search locations

    var recordType ="";
    var recordId = "";

// Hash Routes
    window.onhashchange = function () {
        var hashSpot = window.location.hash;
        hashRender(hashSpot);
    };
    window.onload = function () {
        var hashSpot = window.location.hash;
        hashRender(hashSpot);
    }


    //Render form for read options

    $(document).on('click', '#viewRecord', function () {
        window.location.hash = "view";
        renderViewRecordForm();

    })

 //Render form for create options
    $(document).on('click', '#addRecord', function () {
        renderAddRecordForm();
    })

// View Records

    $(document).on('click', '.recordView', function () {
        $("#id").val($(this).attr("data-record-id"));
        $("#viewRecordForm").trigger("submit");
    });

    $(document).on("submit", "#viewRecordForm", function (e) {
        e.preventDefault();
        recordType = $("#recordType").val();
        recordId = $("#id").val();
        window.location.hash = "view/" + recordType + "/" + recordId;
        renderViewRecordResult();
    })

 //Change date format
    $(document).on('blur', '#donationDate', function () {
        $("#donationDate").val(moment($("#donationDate").val()).format("YYYY-MM-DD"))

    })

//Show create form
    $(document).on('change', '#createRecordForm #recordType', function () {
        recordType = $("#recordType").val();
        window.location.hash = "add/" + recordType;
        populateAddRecordForm();

    })

//Create record
    $(document).on('submit', "#createRecordForm", function (e) {
       e.preventDefault();
       var record;
       var url = ($("#recordType").val() === "Donation" ? "/api/sfdonation" : "/api/sfaccount");
       if ($("#recordType").val() === "Donation") {
           record = {
               DonationName: $("#donationName").val(),
               Amount: $("#amount").val(),
               DonationDate: $("#donationDate").val(),
               AccountId: $("#accountId").val(),
           };
       }
       else if ($("#recordType").val() === "Account") {
           record = {
               AccountName: $("#newAccountName").val(),
               AccountOwnerId: $("#accountOwnerId").val(),
               BillingStreet: $("#addressStreet").val(),
               BillingCity: $("#addressCity").val(),
               BillingState: $("#addressState").val(),
               BillingZip: $("#addressZip").val(),
               BillingCountry: $("#addressCountry").val(),
               Phone: $("#phone").val(),
               Email: $("#email").val()
           }

       }
       $.ajax({
           url: url,
           method: "POST",
           data: record
       })
           .done(function (e) {
               recordType = $("#recordType").val();
               recordId = e["Id"];
               window.location.hash = "view/" + recordType + "/" + recordId;
           })
           .fail(function (e) {
               alert("An error occured.")
           });
      
    })

//Show update form
    $(document).on('click', ".resultMulti #edit, .resultSingle #edit, .centeredSingle #edit", function () {
        var type = $("#recordType").val()
        var url = (type === "Donation" ? "/api/sfdonation/" : "/api/sfaccount/") + $(this).attr("data-record-id")

        if (type === "Donation") {
            var donationInfoPromise = $.getJSON(url);
            $.when(donationInfoPromise).then(function (donationInfo) {
                $.getJSON("/api/sfaccount/" + donationInfo["Account_Name__c"], function (accountInfo) {
                    $("#mainBody").html("");

                    $("#AccountId").typeahead('destroy');
                    $("#AccountName").typeahead('destroy');

                    $("#mainBody").html("<form id='updateRecordForm'><label id='recordType' data-record-type=" + type + ">Edit " + donationInfo["Name"] + "</label><div id='formContent'>" +
                        accountName + donationName + amount + donationDate + "<input type='hidden' value=" + accountInfo["Id"] + " id='accountId' name='accountId' /><input type='hidden' id='recordId' data-record-id=" + donationInfo["Id"] + " /><button id='submit' class='btn btn-primary'>Update Donation</button>"
                        + "</div></form>");

                    $("#AccountName").val(accountInfo["Name"]);
                    $("#donationName").val(donationInfo["Name"]);
                    $("#amount").val(donationInfo["Amount__c"]);
                    $("#donationDate").val(donationInfo["Donation_Date__c"]);

                    typeahead_account_init();

                });
            });
        } else if (type === "Account") {
            $.getJSON(url, function (account) {
                $("#mainBody").html("");

                $("#mainBody").html("<form id='updateRecordForm'><label id='recordType' data-record-type=" + type + ">Edit " + account["Name"] + "</label><div id='formContent'>" +
                    "<div class='col-lg-6 col-xs-12'>" + newAccountName + phone + email + "</div><div class='col-lg-6 col-xs-12'>" + addressStreet + addressCity + addressState + addressZip + addressCountry + "</div><br style='clear:both'><hr><input type='hidden' id='accountOwnerId' value=" + account["OwnerId"] + "><input type='hidden' id='recordId' data-record-id=" + account["Id"] + "><button id='submit' class='btn btn-primary'>Update Account</button>"
                    + "</div></form>")

                $("#newAccountName").val(account["Name"]);
                $("#addressStreet").val(account["BillingStreet"])
                $("#addressCity").val(account["BillingCity"])
                $("#addressState").val(account["BillingState"])
                $("#addressZip").val(account["BillingPostalCode"])
                $("#addressCountry").val(account["BillingCountry"])
                $("#phone").val(account["Phone"])
                $("#email").val(account["Email__c"])

            })

        }


    });

//Update record
    $(document).on('submit', "#updateRecordForm", function (e) {
        e.preventDefault();
        var record;
        var url = ($("#recordType").attr("data-record-type") === "Donation" ? "/api/sfdonation/" : "/api/sfaccount/")+$("#recordId").attr("data-record-id");
        if ($("#recordType").attr("data-record-type") === "Donation") {
            record = {
                DonationName: $("#donationName").val(),
                Amount: $("#amount").val(),
                DonationDate: $("#donationDate").val(),
                AccountId: $("#accountId").val(),
            };
        }
        else if ($("#recordType").attr("data-record-type") === "Account") {
            record = {
                AccountName: $("#newAccountName").val(),
                AccountOwnerId: $("#accountOwnerId").val(),
                BillingStreet: $("#addressStreet").val(),
                BillingCity: $("#addressCity").val(),
                BillingState: $("#addressState").val(),
                BillingZip: $("#addressZip").val(),
                BillingCountry: $("#addressCountry").val(),
                Phone: $("#phone").val(),
                Email: $("#email").val()
            }

        }
        $.ajax({
            url: url,
            method: "PUT",
            data: record
        })
            .done(function (data) {
                if (data["attributes"]["type"] === "Account") {
                    $("#mainBody").html("");
                    var type = "Account";
                    $("#mainBody").append("<div class='centeredSingle'><h2>General Information</h2> \
                                <p>\
                                Account Id: "+ data["Id"] + "<br />\
                                Name: "+ data["Name"] + " <br />\
                                Phone Number: "+ data["Phone"] + " <br />\
                                Account Created: "+ moment(data["CreatedDate"]).format("l") + " <br />\
                                </p><a id='delete' data-record-id=" + data["Id"] + " class='btn btn-primary'>Delete</a><a id='edit' data-record-id=" + data["Id"] + " class='btn btn-info'>Edit</a>\
                                <h2>Addresses</h2>\
                                <p>\
                                    Billing Address:<br />"
                        + data["BillingStreet"] + "<br />" +
                        data["BillingCity"] + ", " + data["BillingState"] + " " + data["BillingPostalCode"]
                        + "</p>\
                      <input id='recordType' type='hidden' value="+type+" /></div>")

                } else {
                    $.getJSON("/api/sfaccount/" + data["Account_Name__c"], function (account) {
                        alert("Done")
                        var type = "Donation";
                        $("#mainBody").html("");
                        $("#mainBody").append("<div class='centeredSingle'><h2>General Information</h2> \
                                <p>\
                                Donation Id: "+ data["Id"] + "<br />\
                                Account Name: "+ account["Name"] + "<br />\
                                Donation Name: "+ data["Name"] + " <br />\
                                Amount: $"+ data["Amount__c"] + " <br />\
                                Donation Date: "+ moment(data["Donation_Date__c"]).format("l") + " <br />\
                                </p><a id='delete' data-record-id=" + data["Id"] + " class='btn btn-primary'>Delete</a>\
                                <a id='edit' data-record-id=" + data["Id"] + " class='btn btn-primary'>Edit</a>\
                                <input id='recordType' type='hidden' value="+ type +" /></div>")
                    });
                   
                }
            })
            .fail(function (e) {
                alert("An error occured.")
            });

    })

//delete record
    $(document).on('click', ".resultMulti #delete,.resultSingle #delete,.centeredSingle #delete", function () {
        if (confirm("Are you sure you want to delete this record?")) {
            var url = ($("#recordType").val() === "Donation" ? "/api/sfdonation/" : "/api/sfaccount/") + $(this).attr("data-record-id");

            $.ajax({
                url: url,
                method: "DELETE"
            })
                .done(function () {
                    $("#id").val("All");
                    $("#viewRecordForm").trigger('submit');
                })
                .fail(function (e) {
                    alert("An error occured.")
                });
        }
    })


    $("#mainBody").css("margin-top", "3%")

    function typeahead_account_init() {

        var accounts = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('Name'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            prefetch: './api/sfaccount',
            remote: {
                url: './api/sfaccount?query=%QUERY',
                wildcard: '%QUERY'
            }
        });

        accounts.initialize();

        $('#AccountName').typeahead(null, {
            name: 'account',
            display: 'Name',
            valueKey: "Id",
            source: accounts,
            templates: {
                suggestion: function (account) {
                    return '<p style="font-size: 1.1em;"><strong>Name:</strong> ' + account.Name + "<br><strong>Id:</strong> " + account.Id + '</p>';
                }
            }
        }).on('typeahead:selected typeahead:autocomplete', function (e, data) {
            $("#accountId").val(data.Id);
        });

    }
    typeahead_account_init();

    function typeahead_user_init() {

        var accounts = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('Name'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            prefetch: './api/sfuser',
            remote: {
                url: './api/sfuser?query=%QUERY',
                wildcard: '%QUERY'
            }
        });

        accounts.initialize();

        $('#accountOwnerName').typeahead(null, {
            name: 'User',
            display: 'Name',
            valueKey: "Id",
            source: accounts,
            templates: {
                suggestion: function (user) {
                    return '<p style="font-size: 1.1em;"><strong>Name:</strong> ' + user.Name + "<br><strong>Id:</strong> " + user.Id + '</p>';
                }
            }
        }).on('typeahead:selected typeahead:autocomplete', function (e, data) {
            $("#accountOwnerId").val(data.Id);
        });

    }
    typeahead_user_init();

    function hashRender(hashSpot) {
        var hashArr = hashSpot.split('/');
        if (hashArr.length < 2) {
            if (hashSpot === "") {
                renderHome();
            } else if (hashSpot === "#view") {
                renderViewRecordForm();

            } else if (hashSpot === "#add") {
                renderAddRecordForm();
            }
        } else {
            recordType = hashArr[1];
            recordId = hashArr[2];
            if (hashArr[0] === "#view") {
                renderViewRecordForm();
                renderViewRecordResult();
                $("#recordType").val(recordType);
                $("#id").val(recordId);
            }
            else if (hashArr[0] === "#add") {
                recordType = hashArr[1];
                $("#recordType").val(recordType);
                populateAddRecordForm();
            }
        }
    }

    function renderHome() {
        $("#mainBody").html("<div class='row'>\
            <div id ='viewRecord' class='col-md-6 col-sm-6 col-xs-12 recordBlock'>\
            <i class='fas fa-address-card'></i>\
            <p>View a Record</p>\
        </div >\
            <div id='addRecord' class='col-md-6 col-sm-6 col-xs-12 recordBlock'>\
                <i class='fas fa-plus'></i>\
                <p>Add Record</p>\
            </div>\
    </div>");

    }

    function renderViewRecordForm() {
        $("#mainBody").html("<form id='viewRecordForm'>" + recordTypeSelect +
            "<div class='form-group'>\
                        <label for='id'>Record ID (Enter \"All\" to get every record)</label>\
                        <input id='id' class='form-control' type='text' name='id'>\
                    </div>\
                    <button id='submit' class='btn btn-primary'>Search</button>\
                </form>\
                <hr />\
        <div id='resultsRow' class='row'></div>");
    }

    function renderAddRecordForm() {
        window.location.hash = "add";
        $("#mainBody").html("<form id='createRecordForm'>" + recordTypeSelect + "<div id='formContent'></div></form>\
                <hr />\
        <div id='resultsRow' class='row'></div>");
    }

    function renderViewRecordResult() {
        if (recordType === "Account") {
            if (recordId === "All") {

                $.getJSON("/api/sfaccount", function (data) {
                    if (data.length === 0) {
                        throw "No records in this recordType"
                    }
                    $("#resultsRow").html("");
                    for (var i = 0; i < data.length; i++) {

                        $("#resultsRow").append("<div class='col-md-4 col-sm-6 col-xs-12'><div class='resultMulti'><p><a class='recordView' data-record-id=" + data[i]["Id"] + ">" + data[i]["Name"] + "</a><br />" + data[i]["BillingCity"] + ", " + data[i]["BillingState"] + "</p> \
                                        <a id='delete' data-record-id=" + data[i]["Id"] + "><i id='deleteIcon' class='fas fa-trash-alt'></i> \
                                        </a><a id='edit' data-record-id=" + data[i]["Id"] + "><i id='editIcon' class='fas fa-edit'></i></a></div></div>")
                    }
                }).fail(function (e) {
                    $("#resultsRow").html("");
                    $("#resultsRow").append("<div class='centeredSingle'><h2>No records found.</h2></div>")
                    console.log(e)
                });;

            }
            else {
                $.getJSON("/api/sfaccount/" + recordId, function (data) {
                    $("#resultsRow").html("");
                    var date = moment(data["CreatedDate"]).format("l");
                    // Account Single View
                    $("#resultsRow").append("<div class='centeredSingle'>\
                                <h2>Account Information</h2><hr> \
                                <p>\
                                <strong>Account Id:</strong> "+ data["Id"] + "<br />\
                                <strong>Name:</strong> "+ data["Name"] + " <br />\
                                <strong>Phone Number:</strong> "+ data["Phone"] + " <br />\
                                <strong>Account Created:</strong> "+ date + " <br />\
                                </p><a id='delete' data-record-id=" + data["Id"] + "><i id='deleteIcon' class='fas fa-trash-alt'></i></a><a id='edit' data-record-id=" + data["Id"] + "><i id='editIcon' class='fas fa-edit'></i></a>\
                                <p>\
                                    <strong>Billing Address:</strong><br />"
                        + data["BillingStreet"] + "<br />" +
                        data["BillingCity"] + ", " + data["BillingState"] + " " + data["BillingPostalCode"]
                        + "</p>\
                      </div>")
                }).fail(function () {
                    $("#resultsRow").html("");
                    $("#resultsRow").append("<div class='centeredSingle'><h2>No Record Found.</h2></div>")
                });
            }

        }
        else if (recordType === "Donation") {
            if (recordId === "All") {
                $.getJSON("/api/sfdonation", function (data) {
                    if (data["records"].length === 0) {
                        throw "No records available."
                    }
                    $("#resultsRow").html("");
                    for (var i = 0; i < data["records"].length; i++) {

                        $("#resultsRow").append("<div class='col-md-4 col-sm-6 col-xs-12'><div class='resultMulti'><p><a class='recordView' data-record-id=" + data["records"][i]["Id"] + ">" + data["records"][i]["Name"] + "</a><br />$"
                            + data["records"][i]["Amount__c"] + "</p><a id='delete' data-record-id=" + data["records"][i]["Id"] + "> <i id='deleteIcon' class='fas fa-trash-alt'></i></a>\
                                        <a id='edit' data-record-id=" + data["records"][i]["Id"] + "><i id='editIcon' class='fas fa-edit'></i></a></div></div>")


                    }
                }).fail(function (e) {
                    $("#resultsRow").html("");
                    $("#resultsRow").append("<div class='centeredSingle'><h2>No records found.</h2></div>")
                    console.log(e);

                });

            }
            else {
                var donationInfoPromise = $.getJSON("/api/sfdonation/" + recordId);
                //Donation Single View
                $.when(donationInfoPromise).then(function (donationInfo) {
                    $.getJSON("/api/sfaccount/" + donationInfo["Account_Name__c"], function (accountInfo) {
                        $("#resultsRow").html("");
                        $("#resultsRow").append("<div class='centeredSingle'>\
                                <h2>General Information</h2> \
                                <hr> \
                                <p>\
                                <strong>Donation Id:</strong> "+ donationInfo["Id"] + "<br />\
                                <strong>Account Name:</strong> "+ accountInfo["Name"] + "<br />\
                                <strong>Donation Name:</strong> "+ donationInfo["Name"] + " <br />\
                                <strong>Amount:</strong> $"+ donationInfo["Amount__c"] + " <br />\
                                <strong>Donation Date:</strong> "+ moment(donationInfo["Donation_Date__c"]).format("l") + " <br />\
                                </p><a id='delete' data-record-id=" + donationInfo["Id"] + "><i id='deleteIcon' class='fas fa-trash-alt'></i></a> \
                                <a id='edit' data-record-id=" + donationInfo["Id"] + "><i id='editIcon' class='fas fa-edit'></i></a></div>")
                    }).fail(function () {
                        $("#resultsRow").html("");
                        $("#resultsRow").append("<div class='centeredSingle'><h2>An error occured retreiving account information for the donation.</h2></div>")
                    });
                }).fail(function () {
                    $("#resultsRow").html("");
                    $("#resultsRow").append("<div class='centeredSingle'><h2>No Record Found.</h2></div>")
                })


            }
        }
    }

    function populateAddRecordForm() {
        $("#formContent").html("");

        if (recordType === "Donation") {

            $("#AccountId").typeahead('destroy');
            $("#AccountName").typeahead('destroy');

            $("#formContent").append(accountName + donationName + amount + donationDate + "<input type='hidden' value='' id='accountId' name='accountId' /><button id='submit' class='btn btn-primary'>Create Donation</button>");

            typeahead_account_init();
        } else {
            $("#accountOwnerId").typeahead('destroy');
            $("#accountOwnerName").typeahead('destroy');

            $("#formContent").append("<hr><div class='col-lg-6 col-xs-12'>" + newAccountName + accountOwnerName + phone + email + "</div><div class='col-lg-6 col-xs-12'>" + addressStreet + addressCity + addressState + addressZip + addressCountry + "</div><br style='clear:both;'><hr><input type='hidden' id='accountOwnerId'/><button id='submit' class='btn btn-primary'>Create Account</button>")

            typeahead_user_init();
        }
    }

 })
