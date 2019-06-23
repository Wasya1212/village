var upload = require('../libs/multer');
var passport = require("../libs/passport");
var User = require("../models/user");
var Resident = require("../models/residents");
var Building = require("../models/building");
var Post = require("../models/post");
var mongoose = require("mongoose");
var async = require("async");

function getMainPosts(callback, options = {}) {
  Post
    .find({ size: { $ne: 'small' } })
    .sort({ $natural: -1 })
    .limit(options.limit || 5)
    .skip(options.skip || 0)
    .exec(function(err, posts) {
        if (err) console.error(err.message);
        callback(posts || []);
    });
}

function getSmallPosts(callback) {
  Post
    .find({ size: 'small' })
    .sort({ $natural: -1 })
    .limit(5)
    .exec(function(err, posts) {
        if (err) console.error(err.message);
        callback(posts || []);
    });
}

function getHotPosts(callback) {
  Post
    .find({})
    .select({title: 1, _id: 1})
    .sort({ $natural: -1 })
    .limit(12)
    .exec(function(err, posts) {
        if (err) console.error(err.message);
        callback(posts || []);
    });
}

function getPostsCount(callback) {
  Post.countDocuments({ size: { $ne: 'small' } }, function(err, count) {
    if (err) console.error(err.message);
    callback(count);
  });
}

function getPostById(id, callback) {
  Post.findById(id, function(err, post) {
    if (err) console.error(err.message);
    callback(post);
  });
}

function getUserById(id, callback) {
  User.findUserById(id, function(err, user) {
      if (err) console.error(err.message);
      callback(user || {});
  });
}

function getNewsByTagName(tag_name, callback, options = {}) {
  Post
    .find({ tag_name: tag_name })
    .sort({ $natural: -1 })
    .limit(options.limit || 12)
    .skip(options.page ? (options.page - 1) * (options.limit || 12) : 0)
    .exec(function(err, post) {
      if (err) console.error(err.message);
      callback(post || []);
    });
}

function getNewsCount(tag_name, callback) {
  Post.countDocuments({ tag_name: tag_name }, function(err, count) {
    if (err) console.error(err.message);
    callback(count);
  });
}

function getNews(tag_name, callback, options) {
  async.parallel({
    news: function(callback) {
      getNewsByTagName(tag_name, function(posts) {
        callback(null, posts);
      }, options);
    },
    newsPagesCount: function(callback) {
      getNewsCount(tag_name, function(count) {
        callback(null, Math.round((count / (options.limit || 12)) + 0.45));
      });
    }
  }, function(err, result) {
    callback(result.news, result.newsPagesCount);
  });
}

module.exports = function(app) {
    app.get('/feed', function(req, res) {
      var current_page = req.query.page || 1;

      async.parallel({
        smallPosts: function(callback) {
          getSmallPosts(function(posts) {
            callback(null, posts || []);
          });
        },
        mainPosts: function(callback) {
          getMainPosts(function(posts) {
            callback(null, posts || []);
          }, { limit: 8, skip: (current_page - 1) * 8 });
        },
        hotPosts: function(callback) {
          getHotPosts(function(posts) {
            callback(null, posts || []);
          });
        },
        postsPagesCount: function(callback) {
          getPostsCount(function(count) {
            callback(null, Math.round((count / 8) + 0.45));
          });
        }
      }, function(err, result) {
        res.render('pages/frontpage', {
            admin: req.session.admin,
            mainPosts: result.mainPosts,
            smallPosts: result.smallPosts,
            hotPosts: result.hotPosts,
            postsPagesCount: result.postsPagesCount,
            currentPage: current_page
        });
      });
    });

    app.get('/city', function(req, res) {
      getNews('city', function(posts, pagesCount) {
        res.render('pages/news', {
          admin: req.session.admin,
          mainNews: posts,
          postsPagesCount: pagesCount,
          currentPage: req.query.page,
          tagPageName: 'city'
        });
      }, {
        limit: 16,
        page: req.query.page
      });
    });

    app.get('/advertisement', function(req, res) {
      getNews('advertisement', function(posts, pagesCount) {
        res.render('pages/news', {
          admin: req.session.admin,
          mainNews: posts,
          postsPagesCount: pagesCount,
          currentPage: req.query.page,
          tagPageName: 'advertisement'
        });
      }, {
        limit: 16,
        page: req.query.page
      });
    });

    app.get('/sport', function(req, res) {
      getNews('sport', function(posts, pagesCount) {
        res.render('pages/news', {
          admin: req.session.admin,
          mainNews: posts,
          postsPagesCount: pagesCount,
          currentPage: req.query.page,
          tagPageName: 'sport'
        });
      }, {
        limit: 16,
        page: req.query.page
      });
    });

    app.get('/culture', function(req, res) {
      getNews('culture', function(posts, pagesCount) {
        res.render('pages/news', {
          admin: req.session.admin,
          mainNews: posts,
          postsPagesCount: pagesCount,
          currentPage: req.query.page,
          tagPageName: 'culture'
        });
      }, {
        limit: 16,
        page: req.query.page
      });
    });

    app.get('/post', function(req, res, next) {
      if (!(req.query.id && mongoose.Types.ObjectId.isValid(req.query.id))) {
        res.redirect('/feed');
        return next();
      }

      async.waterfall([
        function(callback) {
          getPostById(req.query.id, function(post) {
            callback(null, post);
          });
        },
        function(post, callback) {
          getUserById(post.sender, function(user) {
            callback(null, post, user);
          });
        },
        function(post, user, callback) {
          getSmallPosts(function(small_posts) {
            callback(null, post, user, small_posts);
          });
        },
        function(post, user, small_posts, callback) {
          getHotPosts(function(posts) {
            callback(null, {
              post: post,
              sender: user,
              hotPosts: posts,
              smallPosts: small_posts
            });
          });
        }
      ], function(err, result) {
        if (err) {
          res.redirect('/feed');
          return next();
        }

        res.render('pages/post', {
            admin: req.session.admin,
            post: result.post,
            sender: result.sender,
            hotPosts: result.hotPosts,
            smallPosts: result.smallPosts
        });
      });
    });

    app.get('/*', function(req, res, next) {
        if (req.isAuthenticated()) {
            console.log('authenticated');
            req.session.admin = true;
            next();
        } else {
            console.log('non authorized');
            req.session.admin = false;
            res.redirect('/feed');
        }
    });

    app.get('/', function(req, res) {
        res.redirect('/feed');
    });

    app.get('/residents', function(req, res) {
        if (req.query.add && req.query.buldId) {
            res.render('pages/new-resident', {admin: req.session.admin});
        } else if (req.query.edit && req.query.residentId) {
            Resident.findById(req.query.residentId, function(err, resident) {
                if (err) conso.error(err.message);

                res.render('pages/residents', {admin: req.session.admin, resident: resident});
            });
        } else if (req.query.id && mongoose.Types.ObjectId.isValid(req.query.id)) {
            Resident.findById(req.query.id, function(err, resident) {
                if (err) {
                    console.error(err.message);
                }

                Building.findById(resident.building, function(err, building) {
                    if (err) console.error(err.message);

                    res.render('pages/person', {
                        admin: req.session.admin,
                        person: resident,
                        building: building
                    });
                });
            });
        } else {
            Resident.find({}, function(err, residents) {
                if (err) {
                    console.error(err.message);
                }

                res.render('pages/residents', {
                    admin: req.session.admin,
                    residents: residents
                });
            });
        }
    });

    app.post('/buildings/get', function(req, res, next) {
        let query = req.body || {};

        console.log(req.body);

        if (query != {}) {
            for (var key in query) {
                if (!query[key] || query[key] == '') {
                    delete query[key]
                }
            }

            var minArea = parseInt(query.allAreaFrom),
                maxArea = parseInt(query.allAreaTo),
                minLeavingArea = parseInt(query.leavingAreaFrom),
                maxLeavingArea = parseInt(query.leavingAreaTo),
                minSgArea = parseInt(query.sgAreaFrom),
                maxSgArea = parseInt(query.sgAreaTo),
                minBusinessArea = parseInt(query.businessAreaFrom),
                maxBusinessArea = parseInt(query.businessAreaTo),
                minForestArea = parseInt(query.forestAreaFrom),
                maxForestArea = parseInt(query.forestAreaTo),
                LeaversCount = parseInt(query.leavers),
                OwnersCount = parseInt(query.owners);

            query = {
                allArea: {
                    $lte: maxArea, $gte: minArea
                },
                area: {
                    $lte: maxLeavingArea, $gte: minLeavingArea
                },
                sgArea: {
                    $lte: maxSgArea, $gte: minSgArea
                },
                businessArea: {
                    $lte: maxBusinessArea, $gte: minBusinessArea
                },
                forestArea: {
                    $lte: maxForestArea, $gte: minForestArea
                }
            };

            if (req.body.village && req.body.village != '') query.village = req.body.village;
            if (req.body.street && req.body.street != '') query.street = req.body.street;
            if (req.body.number && req.body.number != '') query.number = req.body.number;
        }

        Building.find(query, function(err, buildings) {
            if (err) console.error(err.message);

            console.log('buildings:');
            console.log(buildings);

            res.send({buildings: buildings});
            next();
        });
    });

    app.get('/buildings', function(req, res) {
        if (req.query.add) {
            res.render('pages/new-house', {admin: req.session.admin});
        } else if (req.query.id && mongoose.Types.ObjectId.isValid(req.query.id)) {
            Building.findById(req.query.id, function(err, building) {
                if (err) {
                    console.error(err.message);
                }

                async.waterfall([function(callback) {
                    Resident.find({_id: {$in: building.residents}}, function(err, residents) {
                        if (err) console.error(err.message);

                        Resident.find({_id: {$in: building.owners}}, function(err, owners) {
                            callback(err, {residents: residents, owners: owners});
                        });
                    });
                }], function(err, results) {
                    if (err) {
                        console.error(err.message);
                    }

                    res.render('pages/buildings', {
                        admin: req.session.admin,
                        building: building,
                        residents: results.residents,
                        owners: results.owners
                    });
                });
            });
        } else {
            Building.find({}, function(err, buildings) {
                if (err) {
                    console.error(err.message);
                }

                res.render('pages/residents', {
                    admin: req.session.admin,
                    buildings: buildings
                });
            });
        }
    });

    app.post('/buildings', function(req, res, next) {
        let query = req.body || {};

        if (query != {}) {
            for (var key in query) {
                if (!query[key] || query[key] == '') {
                    delete query[key]
                }
            }

            console.log(query);
        }

        Building.find(query, function(err, buildings) {
            if (err) {
                console.error(err.message);
            }

            res.send({buildings: buildings});
            next();
        });
    });

    app.post('/buildings/getAllSuka', function(req, res, next) {
        Building.find({}, function(err, buildings) {
            if (err) {
                console.error(err.message);
            }

            res.send({buildings: buildings});
            next();
        });
    });

    app.get('/profile', function(req, res) {
        res.render('frontpage', {admin: req.session.admin});
    });

    app.get('/person', function(req, res) {
        res.render('nev_person', {admin: req.session.admin});
    });

    app.get('/logout', function(req, res, next) {
        req.session.admin = false;
        req.logout();
        res.redirect('/login');
    });

    app.post('/addBuilding', function(req, res, next) {
        Building.createBuilding(new Building({
            village: req.body.settlement,
            street: req.body.street,
            number: req.body.number_h,
            area: req.body.area_h,
            sgArea: req.body.area_zm,
            businessArea: req.body.area_b,
            forestArea: req.body.area_l,
            allArea: parseInt(req.body.area_l) + parseInt(req.body.area_b) + parseInt(req.body.area_zm) + parseInt(req.body.area_h)
        }), function(err, building) {
            if (err) {
                console.error(err.message);
            }

            console.log(building);
            res.send({});
            next();
        });
    });

    app.post('/residents/get', function(req, res, next) {
        let query = req.body || {};

        if (query != {}) {
            for (var key in query) {
                if (!query[key] || query[key] == '') {
                    delete query[key]
                }
            }

            console.log(query);
        }

        Resident.find(query, function(err, residents) {
            if (err) console.error(err.message);
            res.send({residents: residents});
            next();
        });
    });

    app.post('/makeDeath', function(req, res, next) {
        console.log(req.body);

        Resident.findByIdAndUpdate(req.body.id, {$set: {dateOfDeath: Date.now()}}, function(err, resident) {
            if (err) console.error(err.message);

            console.log(resident);

            res.send({});
            next();
        });
    });

    app.post('/residents/delete', function(req, res, next) {
        Building.update({_id: req.body.buildingId}, {$pull: {
                residents: req.body['residents[]'] instanceof Array
                    ? {$in: req.body['residents[]']}
                    : req.body['residents[]']
            }
        }, function(err, results) {
            if (err) console.error(err.message);

            res.send({});
            next();
        });
    });

    app.post('/owners/delete', function(req, res, next) {
        console.log(req.body);
        Building.update({_id: req.body.buildingId}, {$pull: {
                owners: req.body['owners[]'] instanceof Array
                    ? {$in: req.body['owners[]']}
                    : req.body['owners[]']
            }
        }, function(err, results) {
            if (err) console.error(err.message);

            res.send({});
            next();
        });
    });

    app.post('/addDocument', upload.any(), function(req, res, next) {
        console.log(req.files[0]);

        if (req.files[0]) {
            var documentName = req.files[0].originalname,
                filename = req.files[0].filename;

            Resident.findByIdAndUpdate(req.body.residentId, {$push: {documents: {
                title: documentName,
                filename: filename
            }}}, function(err) {
                if (err) console.error(err.message);

                res.send({});
                next();
            });
        } else {
            console.log(req.body);
            res.send({});
            next();
        }
    });

    app.post('/residents/add', function(req, res, next) {
        console.log(req.body);
        Building.update({_id: req.body.buildingId}, {$push: {residents: req.body.residentId}}, function(err, building) {
            if (err) console.error(err.message);

            Resident.findByIdAndUpdate(req.body.residentId, {$set: {building: req.body.buildingId}}, { multi: true }, function(err, resident) {
                if (err) console.error(err.message);

                console.log(resident);

                res.send({});
                next();
            });
        });
    });

    app.post('/residents/remove', function(req, res, next) {
        Building.findByIdAndUpdate(req.body.newBuildingId, {$push: {
            residents: req.body['residents[]'] instanceof Array
                ? {$in: req.body['residents[]']}
                : req.body['residents[]']
        }}, function(err) {
            if (err) console.error(err.message);

            Building.update({_id: req.body.buildingId}, {$pull: {
                residents: req.body['residents[]'] instanceof Array
                    ? {$in: req.body['residents[]']}
                    : req.body['residents[]']
            }}, function(err, results) {
                if (err) console.error(err.message);

                Resident.update({_id: req.body['residents[]'] instanceof Array
                    ? {$in: req.body['residents[]']}
                    : req.body['residents[]']
                }, {$set: {building: 'none'}}, function(err, residents) {
                    if (err) console.error(err.message);

                    res.send({});
                    next();
                });
            });
        });
    });

    app.post('/editResident', upload.any(), function(req, res, next) {
        Resident.findByIdAndUpdate(req.body.residentId, {$set: {
            avatar : req.files[0] && req.files[0].filename ? req.files[0].filename : 'avatar.png',
            name: {
                fName: req.body.fName,
                mName: req.body.mName,
                lName: req.body.lName
            },
            conviction: {
                status: req.body.conviction == 'yes' ? true : false,
                description: req.body.conviction == 'yes' ? req.body.convictionInfo : ''
            },
            work: req.body.work,
            study: req.body.study,
            passport: req.body.passport
        }}, function(err, resident) {
            if (err) {
                console.error(err);
            }

            if (!resident) {
                console.log('no resident')
            }

            console.log(resident);
            res.send({});
            next();
        });
    });

    app.post('/addResident', upload.any(), function(req, res, next) {
        Resident.createResident(new Resident({
            avatar : req.files[0] && req.files[0].filename ? req.files[0].filename : 'avatar.png',
            name: {
                fName: req.body.fName,
                mName: req.body.mName,
                lName: req.body.lName
            },
            birth: req.body.birth,
            conviction: {
                status: req.body.conviction == 'yes' ? true : false,
                description: req.body.conviction == 'yes' ? req.body.convictionInfo : ''
            },
            work: req.body.work,
            study: req.body.study,
            //dateOfDeath: req.body.dateOfDeath,
            passport: req.body.passport,
            building: req.body.buildingId
        }), function(err, resident) {
            if (err) {
                console.error(err);
            }

            if (!resident) {
                console.log('no resident')
            }

            Building.findByIdAndUpdate(req.body.buildingId, {$push: {residents: resident._id}}, function(err, building) {
                if (err) console.error(err.message);

                console.log(resident);
                res.send({});
                next();
            });
        });
    });

    app.post('/addOwner', function(req, res, next) {
        Building.findByIdAndUpdate(req.body.buildingId, {$push: {owners: req.body.residentId}}, function(err, building) {
            if (err) console.error(err.message);

            res.send({success: true});
            next();
        });
    });

    app.post('/registrate', function(req, res, next) {
        User.createUser(new User({
            nickname: req.body.username,
            password: req.body.password
        }), function(err, user) {
            if (err) {
                console.error(err.message);
            }

            if (user) {
                console.log(user);
                res.send({user: user});
            }
            next();
        });
    });

    app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/feed' }));

    app.post('/getPost', function(req, res, next) {
        Post.findById(req.body.id, function(err, post) {
            if (err) console.error(err.message);

            res.send(post);
            next();
        });
    });

    app.post('/post', upload.any(), function(req, res, next) {
        var preview = 'default.png',
            title = req.body.title,
            description = req.body.description,
            size = req.body.size,
            images = req.body.images,
            photos = [],
            authors = req.body.authors,
            links = req.body.links,
            tag_name = req.body.tag_name;

        //console.log(req.files);
        //console.log(req.body);

        if (req.files.length > 0) {
            req.files.forEach(function(file) {
                if (file.fieldname == 'preview') {
                    preview = file.filename;
                } else {
                    photos.push(file.filename);
                }
            });
        }

        Post.createPost(new Post({
            text: description,
            title: title,
            sender: req.user._id,
            preview: preview,
            size: size,
            photos: images,
            links: links != '' ? links.split(',') : [],
            authors: authors != '' ? authors.split(',') : [],
            imagesIndexes: images != '' ? images.split(',') : [],
            photos: photos,
            tag_name: tag_name
        }), function(err, post) {
            if (err) console.error(err.message);

            console.log('Post:');
            console.log(post);
            res.send({});
            next();
        });
    });

    app.post('/post/delete', function(req, res, next) {
        Post.deleteOne({_id: req.body.postId}, function(err, result) {
            if (err) console.error(err.message);

            res.send({});
            next();
        });
    });
}
