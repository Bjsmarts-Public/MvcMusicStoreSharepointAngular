using MvcMusicStore.App_Base;
using MvcMusicStore.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MvcMusicStore.Controllers
{
    public class CheckoutController : Controller
    {
        MvcMusicStoreEntities storeDB = new MvcMusicStoreEntities();
        private const string PromoCode = "FREE";
        //
        // GET: /Checkout/


        public ActionResult AddressAndPayment()
        {
            return View();
        }

        //
        // POST: /Checkout/AddressAndPayment
        [HttpPost]
        public ActionResult AddressAndPayment(FormCollection values, string promoCodeForm)
        {
            var order = new Order();
            TryUpdateModel(order);
            try
            {
                if (string.Equals(promoCodeForm, PromoCode, StringComparison.OrdinalIgnoreCase) == false)
                {
                    return View(order);
                }
                else
                {
                    //order.Username = User.Identity.Name;
                    //order.UserId = 1;
                    order.OrderDate = DateTime.Now;
                    //Save Order
                    storeDB.Orders.Add(order);
                    storeDB.SaveChanges();
                    //Process the order
                    var cart = ShoppingCart.GetCart(this.HttpContext);
                    cart.CreateOrder(order);
                    order.OrderId = order.OrderId;
                    //return RedirectToAction("Complete",
                    //                        new { id = order.OrderId });
                    return Json(order);
                }
            }
            catch
            {
                //Invalid - redisplay with errors
                return View(order);
            }
        }

        [HttpGet]
        public JsonResult GetListCountries()
        {
            var lstCountries = storeDB.Countries.AsEnumerable()
                .Select(s=> new Country
                                {
                                    CountryId = s.CountryId,
                                    Sigla = s.Sigla,
                                    CountryName = s.CountryName
                                }).ToList();
            //return Json(lstCountries);
            return Json(lstCountries, JsonRequestBehavior.AllowGet);
        }

        //
        // GET: /Checkout/Complete
        public ActionResult Complete(int id)
        {
            // Validate customer owns this order
            bool isValid = storeDB.Orders.Any(o => o.OrderId == id);
            if (isValid)
            {
                return View(id);
            }
            else
            {
                return View("Error");
            }
        }


    }
}
