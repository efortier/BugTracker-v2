var express = require('express');
var router = express.Router();
var Issues = require('./models.issues');
var User = require("./models.users");

router.get('/getissuescount', function (req, res, next) {

    if( User.isAuthenticated(req) === false ) return res.json({noauth:true, success: false, msg: "Unauthorized"});

    Issues.getTotalIssuesCount( (err, count) => {
        if(err) throw err;
        if(count === undefined) return res.json({success: false});
        return res.json({"success": true, count: count });
    });

});

router.get('/getprojects', function (req, res, next) {

    if( User.isAuthenticated(req) === false ) return res.json({noauth:true, success: false, msg: "Unauthorized"});

    Issues.getProjects((err, list) => {
        if (err) throw err;
        if (!list) return res.json({"success": false});

        // maps AOS to SOA.
        var idList = list.map(function (obj) { return obj._id; });
        var nameList = list.map(function (obj) { return obj.project_name; });

        return res.json({
            success: true,
            idlist: idList,
            namelist: nameList
        });

    });

});

router.get('/gettypes', function (req, res, next) {

    if( User.isAuthenticated(req) === false ) return res.json({noauth:true, success: false, msg: "Unauthorized"});

    Issues.getTypes((err, list) => {
        if (err) throw err;
        if (!list) return res.json({ "success": false });

        // maps AOS to SOA.
        var idList = list.map(function (obj) { return obj._id; });
        var nameList = list.map(function (obj) { return obj.type_name; });

        return res.json({
            success: true,
            idlist: idList,
            namelist: nameList
        });

    });

});

router.get('/getseverity', function (req, res, next) {

    if( User.isAuthenticated(req) === false ) return res.json({noauth:true, success: false, msg: "Unauthorized"});

    Issues.getSeverity((err, list) => {
        if (err) throw err;
        if (!list) return res.json({ "success": false });

        // maps AOS to SOA.
        var idList = list.map(function (obj) { return obj._id; });
        var nameList = list.map(function (obj) { return obj.severity_name; });

        return res.json({
            success: true,
            idlist: idList,
            namelist: nameList
        });

    });

});

router.get('/getstates', function (req, res, next) {
    
    if( User.isAuthenticated(req) === false ) return res.json({noauth:true, success: false, msg: "Unauthorized"});

    Issues.getStates((err, list) => {
        if (err) throw err;
        if (!list) return res.json({"success": false });

        // maps AOS to SOA.
        var idList = list.map(function (obj) { return obj._id; });
        var nameList = list.map(function (obj) { return obj.status_name; });

        return res.json({
            success: true,
            idlist: idList,
            namelist: nameList
        });

    });

});
    
router.get('/getusers', function (req, res, next) {

    if( User.isAuthenticated(req) === false ) return res.json({noauth:true, success: false, msg: "Unauthorized"});

    Issues.getUsers((err, list) => {
        if (err) throw err;
        if (!list) return res.json({ "success": false });

        // maps AOS to SOA.
        var idList = list.map(function (obj) { return obj._id; });
        var nameList = list.map(function (obj) { return obj.user_name; });

        return res.json({
            success: true,
            idlist: idList,
            namelist: nameList
        });

    });

});

router.post('/savereport', function (req, res, next) {
    
    if( User.isAuthenticated(req) === false ) return res.json({noauth:true, success: false, msg: "Unauthorized"});

    Issues.saveReport( req.body, (err, savedReport) => {
        if (err) throw err;
        return res.json({
            "success": true,
            "report_id": savedReport._id,
        });
    });
});
    
router.post('/getreport', function (req, res, next) {

    if( User.isAuthenticated(req) === false ) return res.json({noauth:true, success: false, msg: "Unauthorized"});

    Issues.getReport( req.body.report_id, (err, report) => {
        if (err) throw err;
        if(!report) return res.json({"success": false});
        return res.json({"success": true, "report": report });
    });

});
    
router.post('/deletereport', function (req, res, next) {

    if( User.isAuthenticated(req) === false ) return res.json({noauth:true, success: false, msg: "Unauthorized"});

    Issues.deleteReport( req.body.report_id, (err, report) => {
        if (err) throw err;
        if(!report) return res.json({"success": false });
        return res.json({
            "success": true
        });
    });
});

router.post('/updatereport', function (req, res, next) {
    
    if( User.isAuthenticated(req) === false ) return res.json({noauth:true, success: false, msg: "Unauthorized"});

    Issues.updateReport( req.body, (err, updatedReport) => {
        if (err) throw err;
        if(!updatedReport) return res.json({"success": false });
        return res.json({"success": true });
    });
});

router.post('/reportexists', function (req, res, next) {
    Issues.reportExists( req.body.report_id, (err, count) => {
        if (err) {
            throw err;
        } else {
            if(!count) {
                return res.json({
                    "success": false
                });
    
            } else {
                return res.json({
                    "success": true
                });
            }
        }
    });
});

router.post('/getpage', function (req, res, next) {

    if( User.isAuthenticated(req) === false ) return res.json({noauth:true, success: false, msg: "Unauthorized"});

    const page = req.body;
    Issues.getIssuesByPage(page, (err, issues) => {
        if (err) throw err;
        if (!issues) return res.json({"success": false });

        return res.json({
            "success": true,
            "totalElements": page.totalElements,
            "issues": issues
        });

    });

});

router.post('/getallissues', function (req, res, next) {

    if( User.isAuthenticated(req) === false ) return res.json({noauth:true, success: false, msg: "Unauthorized"});

    Issues.getAllIssues( req.body, (err, issues) => {
        if (err) throw err;
        if (!issues) return res.json({"success": false });

        return res.json({
            "success": true,
            "issues": issues //.splice(0,1)
        });

    });

});

module.exports = router;