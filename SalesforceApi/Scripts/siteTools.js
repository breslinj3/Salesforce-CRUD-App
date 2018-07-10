$(document).ready(function () {

    $(document).on('blur', '#donationDate', function () {
        var date = (moment($("#donationDate").val()).isValid() ? moment($("#donationDate").val()).format("YYYY-MM-DD") : "");
        $("#donationDate").val(date);
    })

    var accounts = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('Name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: '/api/sfaccount',
        remote: {
            url: '/api/sfaccount?query=%QUERY',
            wildcard: '%QUERY'
        }
    });
    var owners = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('Name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: '/api/sfuser',
        remote: {
            url: '/api/sfuser?query=%QUERY',
            wildcard: '%QUERY'
        }
    });

    $('#createDonationForm #accountName, #updateDonationForm #accountName').typeahead(null, {
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

    $('#accountOwnerName').typeahead(null, {
        name: 'User',
        display: 'Name',
        valueKey: "Id",
        source: owners,
        templates: {
            suggestion: function (user) {
                return '<p style="font-size: 1.1em;"><strong>Name:</strong> ' + user.Name + "<br><strong>Id:</strong> " + user.Id + '</p>';
            }
        }
    }).on('typeahead:selected typeahead:autocomplete', function (e, data) {
        $("#accountOwnerId").val(data.Id);
    });



    $(document).on('submit', "#createDonationForm", function (e) {
        e.preventDefault();
        var record = {
            DonationName: $("#donationName").val(),
            Amount: $("#amount").val(),
            DonationDate: $("#donationDate").val(),
            AccountId: $("#accountId").val(),
        };

        $.ajax({
            url: "/api/sfdonation",
            method: "POST",
            data: record
        })
            .done(function (e) {
                toastr.options.onShown = function () {
                    setTimeout(3000);
                    window.location.href = "/donation/new"

                }
                toastr.success("Record Created.");
               
            })
            .fail(function (e) {
                console.log(e);
                toastr.error("An error occured.")
            });


    });

    $(document).on('submit', "#updateDonationForm", function (e) {
        e.preventDefault();
        var record = {
            DonationName: $("#donationName").val(),
            Amount: $("#amount").val(),
            DonationDate: $("#donationDate").val(),
            AccountId: $("#accountId").val()
        };
        $.ajax({
            url: "/api/sfdonation/" + $("#donationId").val(),
            method: "PUT",
            data: record
        })
            .done(function (data) {
                toastr.options.onShown = function () {
                    setTimeout(3000);
                    window.location.href = "/details"

                }
                toastr.success("Successfully Updated");
            })
            .fail(function (e) {
              
                toastr.error("An error occured.")
       
            });
    })

    $(document).on('submit', "#createAccountForm", function (e) {
        e.preventDefault();
        var record = {
            AccountName: $("#accountName").val(),
            AccountOwnerId: $("#accountOwnerId").val(),
            BillingStreet: $("#billingStreet").val(),
            BillingCity: $("#billingCity").val(),
            BillingState: $("#billingState").val(),
            BillingZip: $("#billingZip").val(),
            BillingCountry: $("#billingCountry").val(),
            Phone: $("#phone").val(),
            Email: $("#email").val()
        }
       $.ajax({
           url: "/api/sfaccount",
            method: "POST",
            data: record
        })
            .done(function (e) {
                toastr.options.onShown = function () {
                    setTimeout(3000);
                    window.location.href = "/account/new"

                }
                toastr.success("Record Created.");
            })
            .fail(function (e) {
                toastr.error("An error occured.")
            });


    });

    $(document).on('submit', "#updateAccountForm", function (e) {
        e.preventDefault();
        var record = {
            AccountName: $("#accountName").val(),
            AccountOwnerId: $("#accountOwnerId").val(),
            BillingStreet: $("#billingStreet").val(),
            BillingCity: $("#billingCity").val(),
            BillingState: $("#billingState").val(),
            BillingZip: $("#billingZip").val(),
            BillingCountry: $("#billingCountry").val(),
            Phone: $("#phone").val(),
            Email: $("#email").val()
        }
        $.ajax({
            url: "/api/sfaccount/" + $("#accountId").val(),
            method: "PUT",
            data: record
        })
            .done(function (data) {
               
                toastr.options.onShown = function () {
                    setTimeout(3000);
                    window.location.href = "/details"

                }
                toastr.success("Successfully Updated");

            })
            .fail(function (e) {
                toastr.error("An error occured.")
            });
    })

    $("#viewRecordForm").submit(function (e) {
        e.preventDefault();

        var recordType = $("#recordType").val();
        var recordId = $("#id").val()


        if(recordType === "Account") {
            if(recordId === "All") {

                $.getJSON("/api/sfaccount", function (data) {
                    if (data.length === 0) {
                        throw "No records in this recordType"
                    }

                    $("#resultsRow").html("");
                    for (var i = 0; i < data.length; i++) {

                        $("#resultsRow").append("<div class='col-md-4 col-sm-6 col-xs-12'><div class='resultMulti'><p><a class='recordView' data-record-id=" + data[i]["Id"] + ">" + data[i]["Name"] + "</a><br />" + data[i]["BillingCity"] + ", " + data[i]["BillingState"] + "</p> \
                                        <a id='delete' data-record-id=" + data[i]["Id"] + "><i id='deleteIcon' class='fas fa-trash-alt'></i> \
                                        </a><a class='edit' href='account/edit/" + data[i]["Id"] + "'><i id='editIcon' class='fas fa-edit'></i></a></div></div>")
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
                                </p><a id='delete' data-record-id=" + data["Id"] + "><i id='deleteIcon' class='fas fa-trash-alt'></i></a><a class='edit' href='/account/edit/" + data["Id"] + "'><i id='editIcon' class='fas fa-edit'></i></a>\
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

                        $("#resultsRow").append("<div class='col-md-4 col-sm-6 col-xs-12'><div class='resultMulti'><p><a class='recordView' data-record-id=" + data["records"][i]["Id"] + ">" + data["records"][i]["Name"] + "</a><br />"
                            + "<span class='amount'>" + data["records"][i]["Amount__c"] + "</span>" + "</p><a id='delete' data-record-id=" + data["records"][i]["Id"] + "> <i id='deleteIcon' class='fas fa-trash-alt'></i></a>\
                                        <a class='edit' href='/donation/edit/" + data["records"][i]["Id"] + "'><i id='editIcon' class='fas fa-edit'></i></a></div></div>")


                    }
                    $(".amount").formatCurrency();
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
                                <strong>Amount:</strong> <span class='amount'>"+ donationInfo["Amount__c"] + "</span> <br />\
                                <strong>Donation Date:</strong> "+ moment(donationInfo["Donation_Date__c"]).format("l") + " <br />\
                                </p><a id='delete' data-record-id=" + donationInfo["Id"] + "><i id='deleteIcon' class='fas fa-trash-alt'></i></a> \
                                <a class='edit' href='/donation/edit/" + donationInfo["Id"] + "'><i id='editIcon' class='fas fa-edit'></i></a></div>")
                        $(".amount").formatCurrency();
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
                    $(".loadOverlay").remove();
                    toastr.success("Record deleted.");
                    $("#id").val("All")
                    $("#viewRecordForm").trigger("submit");
                })
                .fail(function (e) {
                    toastr.error("An error occured.");
                });
        }
    })

    $(document).on("click", ".recordView", function () {
        $("#id").val($(this).attr("data-record-id"));
        $("#viewRecordForm").trigger("submit");


    });

});