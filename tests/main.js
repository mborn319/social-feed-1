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
                accounts: ["@ford"],
                limit: 2,
                access_token: "150849908413827|a20e87978f1ac491a0c4a721c961b68c"
            },
            template: "myTemplate.html"
        });

            //it should be trying to get the post template
            expect(jasmine.Ajax.requests.first().url).toEqual("myTemplate.html");
    });
    it("doesn't call template.html if template_html parameter is provided", function() {
        var spy = spyOn($,"ajax");
        spy.and.callFake(function(ajaxOpts) {
            //It should NOT be trying to get the template!
            expect(ajaxOpts.url).not.toBe("template.html");
        });
        //activate Facebook
        $('.socialFeed').socialfeed({
            // FACEBOOK
            facebook: {
                accounts: ["@ford"],
                limit: 2,
                access_token: "150849908413827|a20e87978f1ac491a0c4a721c961b68c"
            },
            template_html: '<div class="post">{{=it.text}}</div>'
        });

    });

    it("doesn't show images or videos if show_media==false", function() {
        var spy = spyOn($,"ajax");
        spy.and.callFake(function(ajaxOpts) {
            //this func is called when a request is submitted.
            console.log("request made!",ajaxOpts)
            console.log(jasmine.Ajax.requests.mostRecent())
            //run the success callback with Ajax data containing images.
            ajaxOpts.success({
                data:{"created_time":"1445621846","link":"https://instagram.com/p/9MFF3JpCSZ/","images":{"low_resolution":{"url":"https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/s320x320/e35/12093730_1507891029525919_728814339_n.jpg","width":320,"height":320},"thumbnail":{"url":"https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/s150x150/e35/c140.0.799.799/12081091_1639959399608146_2093722151_n.jpg","width":150,"height":150},"standard_resolution":{"url":"https://scontent.cdninstagram.com/hphotos-xaf1/t51.2885-15/s640x640/sh0.08/e35/12093730_1507891029525919_728814339_n.jpg","width":640,"height":640}},"caption":{"created_time":"1445621846","text":"And here’s the third #FORDprofile submission that stopped us in our hashtag-searching tracks. Gotta love the moody cityscape caught by @mcalpinephotography. Ian drove high atop a parking garage in London, Ontario to get this shot—where is the coolest location you’ve found to capture your Ford?\n\nThanks to everyone who took the time to show off their rides.\n\n#Ford #Focus #FordFocus #city #photography","from":{"username":"ford","profile_picture":"https://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-19/11376530_1647567845473963_321960853_a.jpg","id":"215007312","full_name":"Ford Motor Company"},"id":"1102278405050868998"},"type":"image","id":"1102278401846420633_215007312","user":{"username":"ford","profile_picture":"https://scontent.cdninstagram.com/hphotos-xfa1/t51.2885-19/11376530_1647567845473963_321960853_a.jpg","id":"215007312","full_name":"Ford Motor Company"}}
            });
        })//.and.callThrough();//let the call continue.

        //activate Facebook. Note that we do not Spy on the $.ajax function - we let it run its course, THEN examine the data.
        $('.socialFeed').socialfeed({
            // INSTAGRAM
            instagram: {
                accounts: ["@ford"],
                limit: 10,
                client_id: "88b4730e0e2c4b2f8a09a6184af2e218"
            },
            template_html: '<div class="post">{{=it.text}}{{=it.attachment}}</div>',
            show_media: true
        });
        //there should be no images in .socialFeed div, even though we "returned" some from the fake ajax call.
        expect($('.socialFeed').find("img").length).toBe(0);
                //clear div contents & event handlers
            //    $('.socialFeed').html('').off();

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
    it("calls Facebook for the userid",function() {

        var spy = spyOn($,"ajax");
        spy.and.callFake(function(ajaxOpts) {
            //this callback is called when the $.ajax function is run.
            //The options string contains the arguments / options object which was passed to $.ajax by our plugin.

            //make sure the $.ajax request url queries the @ford facebook page.
            expect(ajaxOpts.url).toContain('https://graph.facebook.com/ford');
            //make sure the access token is passed correctly
            expect(ajaxOpts.url).toContain('access_token=150849908413827|a20e87978f1ac491a0c4a721c961b68c');
        });

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
    });
    it("calls Instagram to get the users",function() {
        var spy = spyOn($,"ajax");
        spy.and.callFake(function(ajaxOpts) {
            //check that it calls instagram, searching for the user @ford
            expect( ajaxOpts.url).toContain("https://api.instagram.com/v1/users/search/?q=ford");
            //check that it's correctly passing the client id
            expect( ajaxOpts.url).toContain("client_id=88b4730e0e2c4b2f8a09a6184af2e218");
            //check that it's asking for only one user
            expect( ajaxOpts.url).toContain("count=1");
        });

        //activate socialFeed with only Instagram details
        $('.socialFeed').socialfeed({
            // INSTAGRAM
            instagram: {
                accounts: ["@ford"],
                client_id: "88b4730e0e2c4b2f8a09a6184af2e218"
            },
            // we use template_html for this test to skip the annoying call to template.html
            template_html: '<article class="twitter-post"><h4>{{=it.author_name}}</h4><p>{{=it.text}}<a href="{{=it.link}}" target="_blank">read more</a></p></article>'
        });


    });
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
