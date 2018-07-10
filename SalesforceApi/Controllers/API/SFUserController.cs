using Newtonsoft.Json.Linq;
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

    public class SFUserController : ApiController
    {
        SalesforceTools sf = new SalesforceTools();

        public async Task<JToken> GetAccountsAsync(string query = null)
        {

            await sf.SFLoginAsync();

            var record = "User";

            var fields = new List<string>
            {
                "id",
                "name"

            };

            var accounts = await sf.FindRecordAsync(recordType: record, fields: fields, query: query);

            return accounts["records"];

        }

        public async Task<IHttpActionResult> GetAccountAsync(string id)
        {

            await sf.SFLoginAsync();

            var recordType = "User";

            var record = await sf.FindRecordAsync(id, recordType: recordType);

            return Ok(record);

        }
    }
}
