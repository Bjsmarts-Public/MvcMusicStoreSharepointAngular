using MvcMusicStore.App_Base;
using MvcMusicStore.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MvcMusicStore.Controllers
{
    public class AccountController : Controller
    {
        MvcMusicStoreEntities storeDB = new MvcMusicStoreEntities();
        //
        // GET: /Account/

        public ActionResult LogOn()
        {
            return View();
        }

        [HttpPost]
        public JsonResult LogOn(LogOnModel model)
        {
            var user = storeDB.Users.AsEnumerable()
                            .Where(w => w.UserName == model.UserName && w.Password == model.Password)
                            .Select(s => s.User_id).SingleOrDefault();
            if (user == 0)
            {
                Session["userId"] = null;
            }
            else
            {
                Session["userId"] = user;
            }

            return Json(user);
        }

        [HttpPost]
        public JsonResult LogOut()
        {
            Session.Abandon();
            Session["userId"] = null;


            return null;
        }

        [HttpPost]
        public JsonResult VerificaLogeo()
        {
            User objUser = new User();

            if (Session["userId"] == null)
            {
                objUser = null;
            }
            else
            {
                objUser = storeDB.Users.AsEnumerable()
               .Where(w => w.User_id == Convert.ToInt32(Session["userId"]))
               .Select(s =>new User()
               {
                   User_id = s.User_id,
                   UserName = s.UserName,
                   Email = s.Email,
                   Password = s.Password

               }).SingleOrDefault();
            }

            return Json(objUser);
        }

        public ActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public string Register(User model)
        {
            string strResultado = "ok";
            try
            {
                storeDB.Users.Add(model);
                storeDB.SaveChanges();
            }
            catch (Exception ex)
            {

                strResultado = "Error al registrar" + ex.Message;
            }


            // If we got this far, something failed, redisplay form
            return strResultado;
        }


    }
}
