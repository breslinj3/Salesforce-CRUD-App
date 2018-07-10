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
    public class DonationController : Controller
    {

        [Route("donation/new")]
        public ActionResult New()
        {
            var donationInfo = new DonationInfo();
            return View("DonationForm",donationInfo);
        }

        [Route("donation/edit/{id}")]
        public async Task<ActionResult> UpdateAsync(string id)
        {

            var sf = new SalesforceTools();

            await sf.SFLoginAsync();

            var donation = await sf.FindRecordAsync(id, "Donation__c");

            var accountName = await sf.FindRecordAsync(donation["Account_Name__c"].ToString(), "Account");


            var donationInfo = new DonationInfo()
            {
                Id = donation["Id"].ToString(),
                DonationName = donation["Name"].ToString(),
                AccountId = donation["Account_Name__c"].ToString(),
                Amount = (int)donation["Amount__c"],
                DonationDate = donation["Donation_Date__c"].ToString(),
                AccountName = accountName["Name"].ToString()
            };

            return View("DonationForm", donationInfo);
        }
    }
}