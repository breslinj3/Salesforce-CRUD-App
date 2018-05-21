using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SalesforceApi.Models
{
    public class AccountInfo
    {
        public string Id { get; set; }
        public string AccountName { get; set; }
        public string AccountOwnerId { get; set; }
        public string BillingStreet { get; set; }
        public string BillingCity { get; set; }
        public string BillingState { get; set; }
        public string BillingZip { get; set; }
        public string BillingCountry { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }

    }
}