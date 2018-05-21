using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SalesforceApi.Models
{
    public class DonationInfo
    {
        public string Id { get; set; }
        public string DonationName { get; set; }
        public string AccountId { get; set; }
        public int Amount { get; set; }
        public string DonationDate { get; set; }
    }
}