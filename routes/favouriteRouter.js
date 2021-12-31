const express = require("express");
const bodyParser = require("body-parser");
const authenticate = require("../authenticate");
const cors = require("./cors");
const Favourite = require("../models/favourite");
const mongoose = require("mongoose");

const favouriteRouter = express.Router();

favouriteRouter.use(bodyParser.json());

favouriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus = 200;
  })
  .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favourite.findOne({ user: req.user._id })
      .populate("user")
      .populate("dish")
      .then((fav) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(fav);
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favourite/");
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favourite.findOne({ user: req.user._id })
      .then((fav) => {
        if (fav !== null) {
          for (let i = 0; i < req.body.length; i++) {
            if (fav.dish.indexOf(req.body[i]._id) === -1) {
              fav.dish.unshift(req.body[i]);
            }
          }
          fav
            .save()
            .then((fav) => {
              Favourite.findOne({ _id: fav._id })
                .then((fav) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(fav);
                })
                .catch((err) => next(err));
            })
            .catch((err) => next(err));
        } else {
          Favourite.create({ user: req.user._id, dish: body })
            .then((fav) => {
              Favourite.findOne({ _id: fav._id })
                .populate("dishes")
                .then((fav) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(fav);
                })
                .catch((err) => next(err));
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favourite.deleteOne({ user: req.user._id })
      .then((fav) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(fav);
      })
      .catch((err) => next(err));
  });

favouriteRouter
  .route("/:favouriteId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus = 200;
  })
  .get(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end(
        "GET operation not supported on /favourite/:favouriteId" +
          req.params.dishId
      );
    }
  )
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favourite/:favouriteId");
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favourite.findOne({ user: req.user._id })
      .then((fav) => {
        if (fav !== null) {
          if (fav.dish.indexOf(req.params.favouriteId) === -1) {
            fav.dish.unshift(req.params.favouriteId);
            fav
              .save()
              .then((fav) => {
                Favourite.findOne({ _id: fav._id })
                  .then((fav) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(fav);
                  })
                  .catch((err) => next(err));
              })
              .catch((err) => next(err));
          }
        }
      })
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favourite.findOne({ user: req.user._id })
      .then((fav) => {
        let index = fav.dish.indexOf(req.params.favouriteId);
        if (index !== -1) {
          fav.dish.splice(index, 1);
          fav
            .save()
            .then((fav) => {
              Favourite.findOne({ _id: fav._id })
                .then((fav) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(fav);
                })
                .catch((err) => next(err));
            })
            .catch((err) => next(err));
        } else {
          var err = new Error("It's not in your favourite list!");
          res.statusCode = 403;
          res.setHeader("Content-Type", "application/json");
          next(err);
        }
      })
      .catch((err) => next(err));
  });

module.exports = favouriteRouter;
