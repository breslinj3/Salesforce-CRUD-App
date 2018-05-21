using Newtonsoft.Json.Linq;
using SalesforceApi.Models;
using SalesforceApi.SiteTools;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace SalesforceApi.Controllers.API
{
    public class SFDonationController : ApiController
    {
        public async Task<JObject> GetDonationsAsync()
        {
            var sf = new SalesforceTools();

            await sf.SFLoginAsync();

            var recordType = "Donation__c";

            var fields = new List<string>
            {
                "id",
                "name",
                "amount__c",
                "donation_date__c"

            };

            return await sf.FindRecordAsync(recordType: recordType, fields: fields);

        }

        public async Task<IHttpActionResult> GetDonationAsync(string id)
        {

            var sf = new SalesforceTools();

            await sf.SFLoginAsync();

            var recordType = "Donation__c";

            var record = await sf.FindRecordAsync(id, recordType: recordType);

            return Ok(record);

        }

        [HttpPost]
        public async Task<IHttpActionResult> CreateNewDonationAsync(DonationInfo donationInfo)
        {
            if (!ModelState.IsValid)
                return BadRequest();
            var sf = new SalesforceTools();

            await sf.SFLoginAsync();

            var recordType = "Donation__c";

            var recordFields = new JObject();


            recordFields.Add("Name", donationInfo.DonationName);
            recordFields.Add("Amount__c", donationInfo.Amount);
            recordFields.Add("Account_Name__c", donationInfo.AccountId);
            recordFields.Add("Donation_Date__c", donationInfo.DonationDate);

            var user = await sf.CreateRecordAsync(recordFields, recordType);

            return Created(new Uri(Request.RequestUri + "/"), user);
        }
        [HttpPut]
        public async Task<IHttpActionResult> UpdateDonationAsync(string id, DonationInfo donationInfo)
        {
            if (!ModelState.IsValid)
                return BadRequest();
            var sf = new SalesforceTools();

            await sf.SFLoginAsync();

            var recordType = "Donation__c";

            var recordFields = new JObject();


            recordFields.Add("Name", donationInfo.DonationName);
            recordFields.Add("Amount__c", donationInfo.Amount);
            recordFields.Add("Account_Name__c", donationInfo.AccountId);
            recordFields.Add("Donation_Date__c", donationInfo.DonationDate);


            var record = await sf.UpdateRecordAsync(id, recordFields, recordType);



            return Created(new Uri(Request.RequestUri + "/"), record);
        }

        [HttpDelete]
        public async Task<IHttpActionResult> DeleteDonationAsync(string id)
        {
            if (!ModelState.IsValid)
                return BadRequest();
            var sf = new SalesforceTools();

            await sf.SFLoginAsync();

            var recordType = "Donation__c";

            var message = await sf.DeleteRecordAsync(id, recordType);

            return Ok(message);
        }
 
}
}
