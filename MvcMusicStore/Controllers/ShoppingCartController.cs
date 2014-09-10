using MvcMusicStore.App_Base;
using MvcMusicStore.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MvcMusicStore.Controllers
{
    public class ShoppingCartController : Controller
    {
        MvcMusicStoreEntities storeDB = new MvcMusicStoreEntities();
        //
        // GET: /ShoppingCart/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult OrderCart()
        {
            return View();
        }

        public ActionResult Details(int id = 0)
        {
            return View();

        }

        [ChildActionOnly]
        public ActionResult CartSummary()
        {
            var cart = ShoppingCart.GetCart(this.HttpContext);
            ViewData["CartCount"] = cart.GetCount();
            return PartialView("CartSummary");
        }

        [HttpPost]
        public JsonResult AddToCart(int id)
        {
            List<lstCart> lstCart = null;
            try
            {
                // Retrieve the album from the database
                var addedAlbum = storeDB.Albums
                                .Single(album => album.AlbumId == id);
                // Add it to the shopping cart
                var cart = ShoppingCart.GetCart(this.HttpContext);
                cart.AddToCart(addedAlbum);


                lstCart = cart.GetCartItems();

            }
            catch (Exception ex)
            {
                var objResultado = "Error " + ex.Message;
            }

            // Go back to the main store page for more shopping
            return Json(lstCart);
        }

        [HttpPost]
        public JsonResult GetListCart()
        {
            var cart = ShoppingCart.GetCart(this.HttpContext);
            var lstCart = cart.GetCartItems();
            return Json(lstCart);
        }

        [HttpPost]
        public JsonResult GetTotalCart()
        {
            var totalCart = new ShoppingCart().GetTotal();
            return Json(totalCart);
        }
        [HttpPost]
        public ActionResult RemoveFromCart(int id)
        {
            // Remove the item from the cart
            var cart = ShoppingCart.GetCart(this.HttpContext);
            // Get the name of the album to display confirmation
            string albumName = storeDB.Carts
                        .Single(item => item.RecordId == id).Album.Title;
            // Remove from cart
            int itemCount = cart.RemoveFromCart(id);
            // Display the confirmation message

            List<lstCart> lstCart = cart.GetCartItems();

            return Json(lstCart);
        }

        [HttpGet]
        public JsonResult GetListOdersByUserId(int intUserId)
        {

            var lstOrder = storeDB.Orders.AsEnumerable()
                .Where(w => w.UserId == intUserId)
                .Select(s => new Order
                {
                    OrderId = s.OrderId,
                    UserId = s.UserId,
                    OrderDate = s.OrderDate,
                    FirstName = s.FirstName,
                    LastName = s.LastName,
                    Address = s.Address,
                    City = s.City,
                    State = s.State,
                    PostalCode = s.PostalCode,
                    Country = s.Country,
                    Phone = s.Phone,
                    Email = s.Email,
                    Total = s.Total
                }).ToList();
            //return Json(lstCountries);
            return Json(lstOrder, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetListOderDetailsByOrderId(int intOrderId)
        {
            var Album = storeDB.Albums.AsEnumerable();
            var lstOrderDetails = storeDB.OrderDetails.AsEnumerable()
                 .Join(Album, od => od.AlbumId, a => a.AlbumId, (od, a) => new { od, a })
                .Where(w => w.od.OrderId == intOrderId)
                .Select(s => new lstOrderDetails
                {
                    OrderDetailId = s.od.OrderDetailId,
                    OrderId = s.od.OrderId.HasValue? Convert.ToInt32(s.od.OrderId):0,
                    Album = s.a.Title,
                    Quantity = s.od.Quantity.HasValue ? Convert.ToInt32(s.od.Quantity) : 0,
                    UnitPrice = s.od.UnitPrice.HasValue ? Convert.ToDecimal(s.od.UnitPrice) : 0,
                }).ToList();
            //return Json(lstCountries);
            return Json(lstOrderDetails, JsonRequestBehavior.AllowGet);
        }
    }
}
