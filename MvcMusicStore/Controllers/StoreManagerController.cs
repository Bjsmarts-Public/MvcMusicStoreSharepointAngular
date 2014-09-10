using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MvcMusicStore.Models;

namespace MvcMusicStore.Controllers
{
    public class StoreManagerController : Controller
    {
        MvcMusicStoreEntities storeDB = new MvcMusicStoreEntities();
        //
        // GET: /StoreManager/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Create()
        {
            ViewBag.GenreId = new SelectList(storeDB.Genres, "GenreId", "Name");
            ViewBag.ArtistId = new SelectList(storeDB.Artists, "artistId", "Name");
            return View();
        }

        [HttpPost]
        public ActionResult Create(Album album)
        {
            if (ModelState.IsValid)
            {
                storeDB.Albums.Add(album);
                storeDB.SaveChanges();
                //return RedirectToAction("Index");
            }

            ViewBag.GenreId = new SelectList(storeDB.Genres, "GenreId", "Name", album.GenreId);
            ViewBag.ArtistId = new SelectList(storeDB.Artists, "artistId", "Name", album.ArtistId);
            return View(album);
        }

        [HttpPost]
        public JsonResult ListaAlbum()
        {
            var Genre = storeDB.Genres.AsEnumerable();
            var Artist = storeDB.Artists.AsEnumerable();

            var albums = storeDB.Albums.AsEnumerable()
                .Join(Genre, a => a.GenreId, g => g.GenreId, (a, g) =>new { a, g })
                .Join(Artist, jg => jg.a.ArtistId, ar => ar.ArtistId, (jg, ar) =>new { jg, ar })
                .OrderByDescending(ob => ob.jg.a.AlbumId)
                .Select(s =>new lstStoreManager
                {
                    AlbumId = s.jg.a.AlbumId,
                    TitleAlbum = s.jg.a.Title,
                    Artist = (s.ar.Name.Length>25? s.ar.Name.Substring(0,25) + "..." : s.ar.Name),
                    Genre = (s.jg.g.Name.Length >25 ? s.jg.g.Name.Substring(0, 25) + "..." : s.jg.g.Name),
                    PriceAlbum = s.jg.a.Price.HasValue ?Convert.ToDecimal(s.jg.a.Price) : 0
                }).ToList();
            return Json(albums);
        }

        [HttpPost]
        public  JsonResult ObtenerAlbumByAlbumId(int intAlbumId)
        {
            var album = storeDB.Albums.AsEnumerable()
                .Where(w => w.AlbumId == intAlbumId)
                .Select(s =>new Album
                {
                    AlbumId = s.AlbumId,
                    GenreId = s.GenreId,
                    ArtistId = s.ArtistId,
                    Title = s.Title,
                    Price = s.Price,
                    AlbumArtUrl = s.AlbumArtUrl
                }).SingleOrDefault();
return Json(album);
        }

        [HttpPost]
        public  JsonResult ObtenerAlbumCompletoByAlbumId(int intAlbumId)
        {
            var Genre = storeDB.Genres.AsEnumerable();
            var Artist = storeDB.Artists.AsEnumerable();

            var album = storeDB.Albums.AsEnumerable()
                .Join(Genre, a => a.GenreId, g => g.GenreId, (a, g) =>new { a, g })
                .Join(Artist, jg => jg.a.ArtistId, ar => ar.ArtistId, (jg, ar) =>new { jg, ar })
                .Where(w => w.jg.a.AlbumId == intAlbumId)
                
                .Select(s =>new lstStoreManager
                {
                    AlbumId = s.jg.a.AlbumId,
                    TitleAlbum = s.jg.a.Title,
                    Artist = s.ar.Name,
                    Genre = s.jg.g.Name,
                    PriceAlbum = s.jg.a.Price.HasValue ?Convert.ToDecimal(s.jg.a.Price) : 0,
                    AlbumArtUrl = s.jg.a.AlbumArtUrl

                }).SingleOrDefault();

            return Json(album);
        }

        [HttpPost]
        public JsonResult ObtenerListaGenre()
        {
            var Genres = storeDB.Genres.AsEnumerable()

                .Select(s =>new Genre
                {
                    GenreId = s.GenreId,
                    Name = s.Name,
                    Descripcion = s.Descripcion

                }).ToList();
            return Json(Genres);
        }

        [HttpPost]
        public  JsonResult ObtenerListaArtist()
        {
            var Artist = storeDB.Artists.AsEnumerable()
                .Select(s =>new Artist
                {
                    ArtistId = s.ArtistId,
                    Name = s.Name
                }).ToList();
            return Json(Artist);
        }

        public ActionResult Details(int id = 0)
        {
            Album album = storeDB.Albums.Find(id);
            if (album == null)
            {
                return HttpNotFound();
            }
            return View(album);

        }

        //
        // GET: /StoreManager/Edit/5

        public ActionResult Edit(int id = 0)
        {
            Album album = storeDB.Albums.Find(id);
            if (album == null)
            {
                return HttpNotFound();
            }
            ViewBag.GenreId = new SelectList(storeDB.Genres, "GenreId", "Name", album.GenreId);
            ViewBag.ArtistId = new SelectList(storeDB.Artists, "artistId", "Name", album.ArtistId);
            return View(album);
        }

        //
        // POST: /StoreManager/Edit/5

        [HttpPost]
        public ActionResult Edit(Album album)
        {
            if (ModelState.IsValid)
            {
                storeDB.Entry(album).State = EntityState.Modified;
                storeDB.SaveChanges();
                // return RedirectToAction("Index");
            }
            ViewBag.GenreId = new SelectList(storeDB.Genres, "GenreId", "Name", album.GenreId);
            ViewBag.ArtistId = new SelectList(storeDB.Artists, "artistId", "Name", album.ArtistId);
            return View(album);
        }

        //
        // GET: /StoreManager/Delete/5

        public ActionResult Delete(int id = 0)
        {
            Album album = storeDB.Albums.Find(id);
            if (album == null)
            {
                return HttpNotFound();
            }
            return View(album);
        }

        //
        // POST: /StoreManager/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(int id)
        {
            Album album = storeDB.Albums.Find(id);
            storeDB.Albums.Remove(album);
            storeDB.SaveChanges();
            //return RedirectToAction("Index");
            return View(album);
        }

        public ActionResult WizardForm()
        {
            return View();
        }
        public ActionResult WizardGenreArtist()
        {
            return View();
        }
        public ActionResult WizardTitlePrice()
        {
            return View();
        }

        public ActionResult WizardAlbumArtUrl()
        {
            return View();
        }

        protected override void Dispose(bool disposing)
        {
            storeDB.Dispose();
            base.Dispose(disposing);
        }
    }
}
