describe("jQuery social feed plugin", function() {
    it("is chainable", function() {
        expect(typeof $(".socialFeed").socialfeed()).toBe("object");
        expect(typeof $(".socialFeed").socialfeed().attr).toBe("function");
    });
});

describe("option testing", function() {
    beforeEach(function() {
        //setup the fake $.ajax function so we can inspect the calls
        jasmine.Ajax.install();
    });
    afterEach(function() {
        //remove fake $.ajax function
        jasmine.Ajax.uninstall();

        //clear div contents & event handlers
        $('.socialFeed').html('').off();
    });
    it("gets correct post template.html", function() {
            //activate Facebook
            $('.socialFeed').socialfeed({
                // FACEBOOK
                facebook: {
                    accounts: ["@ford","#ford"],
                    limit: 2,
                    access_token: "150849908413827|a20e87978f1ac491a0c4a721c961b68c"
                },
                template: "myTemplate.html"
            });

            //it should be trying to get the post template
            expect(jasmine.Ajax.requests.first().url).toEqual("myTemplate.html");
    });
    it("doesn't call template.html if template_html parameter is provided", function() {
            //activate Facebook
            $('.socialFeed').socialfeed({
                // FACEBOOK
                facebook: {
                    accounts: ["@ford","#ford"],
                    limit: 2,
                    access_token: "150849908413827|a20e87978f1ac491a0c4a721c961b68c"
                },
                template_html: '<div class="post">{{=it.text}}</div>'
            });

            //It should NOT be trying to get the template!
            expect(jasmine.Ajax.requests.first().url).not.toBe("template.html");
    });

    it("doesn't show images or videos if show_media==false", function() {
        config = {
            clientid: "88b4730e0e2c4b2f8a09a6184af2e218"
        };
        //first we define the "ajax" response. We want to test with images.
        jasmine.Ajax.stubRequest("https://api.instagram.com/v1/users/search/?q=ford&client_id="+config.clientid+"&count=1&callback=jQuery211036345327717325593_1445058650506&_=1445058650507").andReturn({
            "responseText":"/**/ jQuery211036345327717325593_1445058650506({\"meta\":{\"code\":200},\"data\":[{\"username\":\"ford\",\"profile_picture\":\"https:\/\/scontent.cdninstagram.com\/hphotos-xfa1\/t51.2885-19\/11376530_1647567845473963_321960853_a.jpg\",\"id\":\"215007312\",\"full_name\":\"Ford Motor Company\"}]})"
        });


        //activate Facebook. Note that we do not Spy on the $.ajax function - we let it run its course, THEN examine the data.
        $('.socialFeed').socialfeed({
            // INSTAGRAM
            instagram: {
                accounts: ["@ford","#ford"],
                limit: 2,
                client_id: "88b4730e0e2c4b2f8a09a6184af2e218"
            },
            template_html: '<div class="post">{{=it.text}}</div>',
            show_media: false
        });

        //there should be no images in .socialFeed div, even though we "returned" some from the fake ajax call.
        expect($('.socialFeed').find("img").length).toBe(0);

    });
});


describe("AJAX", function() {
    beforeEach(function() {
        //setup the fake $.ajax function so we can inspect the calls
        jasmine.Ajax.install();
    });
    afterEach(function() {
        //remove fake $.ajax function
        jasmine.Ajax.uninstall();

        //clear div contents & event handlers
        $('.socialFeed').empty().off();
    });
    fit("calls Facebook for the userid",function() {

        console.log("before Facebook...");
        //activate socialFeed with only Facebook details
        $('.socialFeed').socialfeed({
            // FACEBOOK
            facebook: {
                accounts: ["@ford"],
                limit: 2,
                access_token: "150849908413827|a20e87978f1ac491a0c4a721c961b68c"
            },
            template_html: '<div class="post">{{=it.text}}</div>'
        });
        console.log("after Facebook...");

        //makes at least one request
        expect(jasmine.Ajax.requests.count()).toBeGreaterThan(0);

        //check that it's calling the correct url
        var stripCallback = /[?]+[a-z0-9_=&]*/i
        var lastAjaxUrl = jasmine.Ajax.requests.mostRecent().url.replace(stripCallback,'');
        console.log("lastAjaxUrl=",lastAjaxUrl);
        console.log("jasmine.Ajax.requests.mostRecent()=",jasmine.Ajax.requests.mostRecent());
        console.log("jasmine.Ajax.requests.first()=",jasmine.Ajax.requests.first());

        expect(jasmine.Ajax.requests.mostRecent().url).toBe('https://graph.facebook.com/ford/posts')
    });
    /*it("calls Instagram for a list of posts",function() {
        //activate socialFeed with only Instagram details
        $('.socialFeed').socialfeed({
            // INSTAGRAM
            instagram: {
                accounts: ["@ford","#ford"],
                limit: 2,
                client_id: "88b4730e0e2c4b2f8a09a6184af2e218"
            },
            // we use template_html for this test to skip the annoying call to template.html
            template_html: '<article class="twitter-post"><h4>{{=it.author_name}}</h4><p>{{=it.text}}<a href="{{=it.link}}" target="_blank">read more</a></p></article>'
        });

        expect(jasmine.Ajax.requests.mostRecent().url).toEqual("https://api.instagram.com/v1/users/search/?q=ford")
    });*/
});

/*
describe("AJAX responses",function() {
    it("returns status 200 when Facebook is called", function() {
        expect(true).toBe(true);
    });
    it("returns status 200 when Twitter is called", function() {
        expect(true).toBe(true);
    });
    it("returns status 200 when Google Plus is called", function() {
        expect(true).toBe(true);
    });
    it("returns status 200 when Instagram is called", function() {
        expect(true).toBe(true);
    });
    it("returns status 200 when VK is called", function() {
        expect(true).toBe(true);
    });
});
*/
