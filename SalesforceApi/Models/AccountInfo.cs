using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SalesforceApi.Models
{
    public class AccountInfo
    {
        public string Id { get; set; }

        [Required]
        [Display(Name = "Account Name")]
        public string AccountName { get; set; }

        [Required]
        [Display(Name = "Owner Id")]
        public string AccountOwnerId { get; set; }

        [Display(Name = "Account Owner")]
        public string OwnerName { get; set; }

        [Required]
        [Display(Name = "Street")]
        public string BillingStreet { get; set; }

        [Required]
        [Display(Name = "City")]
        public string BillingCity { get; set; }

        [Required]
        [Display(Name = "State")]
        public string BillingState { get; set; }

        [Required]
        [Display(Name = "Zip Code")]
        public string BillingZip { get; set; }

        [Required]
        [Display(Name = "Country")]
        public string BillingCountry { get; set; }

        [Required]
        [Display(Name = "Phone")]
        public string Phone { get; set; }

        [Required]
        [Display(Name = "Email")]
        public string Email { get; set; }

    }
}