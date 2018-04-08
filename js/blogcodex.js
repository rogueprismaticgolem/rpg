function getRequest(requestUrl, callback, error) {
    let request = new XMLHttpRequest();

    request.open("GET", requestUrl, true);
    request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            let response = JSON.parse(this.responseText);
            callback(response);
        } else if (request.readyState === XMLHttpRequest.DONE && request.status !== 200) {
            error(request.status);
        }
    }

    request.send();
}

function getBlogIdByUrl(url, ccwater, error) {
    let requestUrl = 'https://www.googleapis.com/blogger/v3/blogs/byurl?view=READER&key=AIzaSyDihK9FHNJi4JtAqhXCDD0isZW-QvvxnbU&url=' + encodeURIComponent('https://' + url + '.blogspot.com/' );

    getRequest(requestUrl, ccwater, error);
}

function getPostData(blogid, callback, error) {
    results = [];
    privateGetPosts(blogid, callback, error, {}, results);
}

function privateGetPosts(blogid, callback, error, posts, results) {
    let requestUrl = ""
    if (posts.nextPageToken) {
        requestUrl = 'https://www.googleapis.com/blogger/v3/blogs/' + blogid + '/posts?key=AIzaSyDihK9FHNJi4JtAqhXCDD0isZW-QvvxnbU&fields=nextPageToken,items(published,url,title,labels)&maxResults=250&pageToken=' + posts.nextPageToken;
    } else {
        requestUrl = 'https://www.googleapis.com/blogger/v3/blogs/' + blogid + '/posts?key=AIzaSyDihK9FHNJi4JtAqhXCDD0isZW-QvvxnbU&fields=nextPageToken,items(published,url,title,labels)&maxResults=250'
    }

    getRequest(requestUrl, function(p) {
        if (p.items && p.items.length > 0) {
            results = results.concat(p.items);
        }
        if (p.nextPageToken) {
            privateGetPosts(blogid, callback, error, p, results);
        } else {
            callback(results);
        }
    });
}

function tablify(baseUrl, items) {
    items.sort(function (a,b) {
        if (a.published > b.published)
            return 1;
        if (a.published < b.published)
            return -1;
        return 0;
    });
    let r  = "<table><tbody>";
    r = r + '<tr><td>#</td><td>Title</td><td>Date</td><td>Labels</td></tr>';
    for (i = 0; i < items.length; i++) {
        r = r + '<tr><td>' + (i+1) + '</td>';
        r = r + '<td><A href="'+items[i].url+'">'+items[i].title+'</A></td>';
        r = r + '<td>'+items[i].published.substring(0,10)+'</td>';
        r = r + '<td>' + buildLabels(baseUrl, items[i].labels) + '</td>';
    }
    r = r + "</tbody></table>";

    return r;
}

function buildLabels(baseUrl, labels) {
    let result = [];
    if (labels && labels.length > 0)
    {
        labels.sort();
        for (j = 0; j < labels.length; j++) {
            result.push(buildLabelURL(baseUrl, labels[j]));
        }
        return result.join(", ");
    }
    return "";
}

function buildLabelURL(baseUrl, label) {
    return '<A HREF="' + baseUrl + '/search/label/' + label + '">' + label + '</A>';
}

