using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace SalesforceApi.SiteTools
{
    public class SalesforceTools
    {
        private static string oauthToken = "";
        private static string serviceUrl = "";

        public async Task SFLoginAsync()
        {
            HttpClient authClient = new HttpClient();


            var accountName = ApiKeys.SalesforceApiKeys.sfAccountName;
            var accountPw = ApiKeys.SalesforceApiKeys.sfAccountPassword;

            var customerKey = ApiKeys.SalesforceApiKeys.sfCustomerKey;
            var customerSecret = ApiKeys.SalesforceApiKeys.sfCustomerSecret;
            var accountToken = ApiKeys.SalesforceApiKeys.sfAccountToken;

            var loginPassword = accountPw + accountToken;

            HttpContent content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                {"grant_type","password" },
                { "client_id",customerKey},
                { "client_secret",customerSecret},
                { "username",accountName},
                { "password",loginPassword}


            });



            HttpResponseMessage message = await authClient.PostAsync("https://login.salesforce.com/services/oauth2/token", content);

            var responseString = await message.Content.ReadAsStringAsync();

            JObject obj = JObject.Parse(responseString);

            oauthToken = (string)obj["access_token"];
            serviceUrl = (string)obj["instance_url"];

        }

        public async Task<JObject> FindRecordAsync(string id = null, string recordType = null, List<string> fields = null,string query = null)
        {
            HttpClient queryClient = new HttpClient();

            string restQuery;
            if (String.IsNullOrWhiteSpace(id) && !String.IsNullOrWhiteSpace(query))
            {
                restQuery = serviceUrl + "/services/data/v25.0/query?q=SELECT+" + string.Join(",", fields) + "+from+" + recordType+"+WHERE+name+LIKE+'%25"+query+"%25'";
            }
            else if (String.IsNullOrWhiteSpace(id))
            {

                restQuery = serviceUrl + "/services/data/v25.0/query?q=SELECT+" + string.Join(",", fields) + "+from+" + recordType;

            }
            else
            {
                restQuery = serviceUrl + "/services/data/v25.0/sobjects/" + recordType + "/" + id;

            }
            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, restQuery);

            request.Headers.Add("Authorization", "Bearer " + oauthToken);

            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            HttpResponseMessage response = await queryClient.SendAsync(request);

            return JObject.Parse(await response.Content.ReadAsStringAsync());

        }

        public async Task<JObject> CreateRecordAsync(JObject record, string recordType)
        {
            HttpClient createClient = new HttpClient();

            var strRecord = record.ToString();

            HttpContent content = new StringContent(record.ToString(), Encoding.UTF8, "application/json");

            string uri = serviceUrl + "/services/data/v25.0/sobjects/" + recordType;

            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, uri);

            request.Headers.Add("Authorization", "Bearer " + oauthToken);

            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Content = content;

            HttpResponseMessage response = await createClient.SendAsync(request);

            var message = JObject.Parse(await response.Content.ReadAsStringAsync());

            return await FindRecordAsync(message["id"].ToString(), recordType);

        }

        public async Task<JObject> UpdateRecordAsync(string id, JObject record, string recordType)
        {
            HttpClient updateClient = new HttpClient();

            HttpContent content = new StringContent(record.ToString(), Encoding.UTF8, "application/json");

            string uri = serviceUrl + "/services/data/v25.0/sobjects/" + recordType + "/" + id;

            HttpRequestMessage request = new HttpRequestMessage(new HttpMethod("PATCH"), uri);

            request.Headers.Add("Authorization", "Bearer " + oauthToken);

            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            request.Content = content;

            HttpResponseMessage response = await updateClient.SendAsync(request);

            var message = await response.Content.ReadAsStringAsync();

            return await FindRecordAsync(id, recordType);
        }

        public async Task<string> DeleteRecordAsync(string id, string recordType)
        {
            HttpClient deleteClient = new HttpClient();

            string uri = serviceUrl + "/services/data/v25.0/sobjects/" + recordType + "/" + id;

            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Delete, uri);

            request.Headers.Add("Authorization", "Bearer " + oauthToken);

            HttpResponseMessage response = await deleteClient.SendAsync(request);

            var message = await response.Content.ReadAsStringAsync();

            return message;

        }


    }
}