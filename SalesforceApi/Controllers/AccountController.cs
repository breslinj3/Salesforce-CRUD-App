using SalesforceApi.Models;
using SalesforceApi.SiteTools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace SalesforceApi.Controllers
{
    public class AccountController : Controller
    {
        [Route("account/new")]
        public ActionResult New()
        {
            var accountInfo = new AccountInfo();
            return View("AccountForm", accountInfo);
        }
        [Route("account/edit/{id}")]
        public async Task<ActionResult> UpdateAsync(string id)
        {

            var sf = new SalesforceTools();

            await sf.SFLoginAsync();

            var account = await sf.FindRecordAsync(id, "Account");

            var ownerName = await sf.FindRecordAsync(account["OwnerId"].ToString(), "User");


            var accountInfo = new AccountInfo()
            {
                Id = account["Id"].ToString(),
                AccountName = account["Name"].ToString(),
                AccountOwnerId = account["OwnerId"].ToString(),
                OwnerName = ownerName["Name"].ToString(),
                BillingStreet = account["BillingStreet"].ToString(),
                BillingCity = account["BillingCity"].ToString(),
                BillingState = account["BillingState"].ToString(),
                BillingZip = account["BillingPostalCode"].ToString(),
                BillingCountry = account["BillingCountry"].ToString(),
                Phone = account["Phone"].ToString(),
                Email = account["Email__c"].ToString()
            };


            return View("AccountForm", accountInfo);
        }
    }
}