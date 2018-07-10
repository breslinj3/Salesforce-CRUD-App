using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SalesforceApi.Models
{
    public class DonationInfo
    {
        public string Id { get; set; }

        [Required]
        [Display(Name = "Donation Name")]
        public string DonationName { get; set; }

        [Required]
        [Display(Name = "Account Id")]
        public string AccountId { get; set; }

        [Display(Name = "Account Name")]
        public string AccountName { get; set; }

        [Required]
        public int Amount { get; set; }

        [Required]
        [Display(Name = "Donation Date")]
        public string DonationDate { get; set; }
    }
}