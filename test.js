var url = 'https://www.storehippo.com';
getContent("http://localhost:5500?url="+ url, function(content) {
    assert(content.length > 10000, "content length should be greater than 10K");
    console.log(url + ":", content.length);
    done();
});