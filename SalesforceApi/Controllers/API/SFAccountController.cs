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
    public class SFAccountController : ApiController
    {
        public async Task<JToken> GetAccountsAsync(string query = null)
        {
            var sf = new SalesforceTools();

            await sf.SFLoginAsync();

            var record = "Account";

            var fields = new List<string>
            {
                "id",
                "name",
                "billingCity",
                "billingState"

            };

            var accounts = await sf.FindRecordAsync(recordType: record, fields: fields,query:query);

            return accounts["records"];
        
        }

        public async Task<IHttpActionResult> GetAccountAsync(string id)
        {

            var sf = new SalesforceTools();

            await sf.SFLoginAsync();

            var recordType = "Account";

            var record = await sf.FindRecordAsync(id, recordType: recordType);

            return Ok(record);

        }

        [HttpPost]
        public async Task<IHttpActionResult> CreateNewAccountAsync(AccountInfo accountInfo)
        {
            if (!ModelState.IsValid)
                return BadRequest();
            var sf = new SalesforceTools();

            await sf.SFLoginAsync();

            var recordType = "Account";

            var recordFields = new JObject();

            recordFields.Add("Name", accountInfo.AccountName);
            recordFields.Add("OwnerId", accountInfo.AccountOwnerId);
            recordFields.Add("Email__c", accountInfo.Email);
            recordFields.Add("BillingStreet", accountInfo.BillingStreet);
            recordFields.Add("BillingCity", accountInfo.BillingCity);
            recordFields.Add("BillingState", accountInfo.BillingState);
            recordFields.Add("BillingPostalCode", accountInfo.BillingZip);
            recordFields.Add("BillingCountry", accountInfo.BillingCountry);
            recordFields.Add("Phone", accountInfo.Phone);

        var record = await sf.CreateRecordAsync(recordFields, recordType);

            return Created(new Uri(Request.RequestUri + "/"), record);
        }

        [HttpPut]
        public async Task<IHttpActionResult> UpdateAccountAsync(string id, AccountInfo accountInfo)
        {
            if (!ModelState.IsValid)
                return BadRequest();
            var sf = new SalesforceTools();

            await sf.SFLoginAsync();


            var recordType = "Account";

            var recordFields = new JObject();

            recordFields.Add("Name", accountInfo.AccountName);
            recordFields.Add("OwnerId", accountInfo.AccountOwnerId);
            recordFields.Add("Email__c", accountInfo.Email);
            recordFields.Add("BillingStreet", accountInfo.BillingStreet);
            recordFields.Add("BillingCity", accountInfo.BillingCity);
            recordFields.Add("BillingState", accountInfo.BillingState);
            recordFields.Add("BillingPostalCode", accountInfo.BillingZip);
            recordFields.Add("BillingCountry", accountInfo.BillingCountry);
            recordFields.Add("Phone", accountInfo.Phone);


            var record = await sf.UpdateRecordAsync(id, recordFields, recordType);



            return Created(new Uri(Request.RequestUri + "/"), record);
        }

        [HttpDelete]
        public async Task<IHttpActionResult> DeleteAccountAsync(string id)
        {
            if (!ModelState.IsValid)
                return BadRequest();
            var sf = new SalesforceTools();

            await sf.SFLoginAsync();

            var recordType = "Account";

            var message = await sf.DeleteRecordAsync(id, recordType);

            return Ok(message);
        }
    }
}
