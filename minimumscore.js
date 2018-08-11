var minScore = 0;
var hideTextPosts = false;
var hideLinkPosts = false;
var type_selector_value = "all";
var show_nsfw = true;
const old_times_days = [0, 1, 3, 7, 14, 21, 30, 45]; //days ago
const old_times_months = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; //months ago
var show_older_than = 0; //days

var url = window.location.href;
if (url.includes("?")){
    var params = new Map(url.split("?").pop().split("&").map(i => i.split("=")));
    minScore = params.get("minScore") || 0;
    show_older_than = params.get("minAge") || 0;
    if (params.has("showNsfw")){
        show_nsfw = params.get("showNsfw") == "true";
    }
    if (params.has("showTypes")){
        switch(params.get("showTypes")){
            case "text":
                type_selector_value = "text";
                hideLinkPosts = true;
                break;
            case "link":
                type_selector_value = "link";
                hideTextPosts = true;
                break;
            default:
                hideTextPosts = false;
                hideLinkPosts = false;
                type_selector_value = "all";
                break;
        }
    }
}

function createSelector(hide_function){
    var newSelect = document.createElement("select");
    var op1 = document.createElement("option");
    var op2 = document.createElement("option");
    var op3 = document.createElement("option");

    op1.text = "All posts";
    op1.value = "all";
    op2.text = "Text Posts only";
    op2.value = "text";
    op3.text = "Links only";
    op3.value = "link";

    newSelect.appendChild(op1);
    newSelect.appendChild(op2);
    newSelect.appendChild(op3);
    
    newSelect.addEventListener("change", () => {
        switch(newSelect.value) {
            case "all":
                hideTextPosts = false;
                hideLinkPosts = false;
                type_selector_value = "all";
                console.log("Showing all posts");
                hide_function();
                break;
            case "text":
                hideTextPosts = false;
                hideLinkPosts = true;
                type_selector_value = "text";
                console.log("Showing text posts only");
                hide_function();
                break;
            case "link":
                hideTextPosts = true;
                hideLinkPosts = false;
                type_selector_value = "link";
                console.log("Showing links only");
                hide_function();
                break;
        }
    });

    return newSelect;
}

function createTimeSelector(hide_function){
    var time_selector = document.createElement("select");

    old_times_days.forEach(time => {
        var option = document.createElement("option");
        option.value = time;
        option.text = time == 1 ? time + " day" : time + " days";
        time_selector.appendChild(option);
    });

    old_times_months.forEach(time => {
        var option = document.createElement("option");
        option.value = time * 30;
        option.text = time + " months";
        time_selector.appendChild(option);
    });

    time_selector.addEventListener("change", () => {
        show_older_than = time_selector.value;
        console.log("Only shoping posts older than " + show_older_than + " days.");
        hide_function();
    });

    return time_selector;

}

function createInputs_desktop(){
    //var spacer = Array.from(document.getElementsByClassName("content")).filter(i => i.tagName == "DIV")[0].getElementsByClassName("spacer")[0];
    var spacer = document.createElement("div");
    var siteTable = document.getElementById("siteTable");
    siteTable.parentElement.insertBefore(spacer, siteTable);
    spacer.style.margin = "0px 0px 10px 8px";
    var newinput = document.createElement("input");
    var span1 = document.createElement("span");
    var span2 = document.createElement("span");
    var span3 = document.createElement("span");
    var time_selector = createTimeSelector(hidePosts_desktop);
    var type_selector = createSelector(hidePosts_desktop);
    var nsfw_toggle = document.createElement("input");
    var nsfw_label = document.createElement("label");

    type_selector.value = type_selector_value;
    time_selector.value = show_older_than;

    span1.innerText = "Hide posts below score: ";
    span2.innerText = " Show ";
    span3.innerText = " older than ";
    nsfw_label.innerText = " Show nsfw: ";

    newinput.type = "number";
    newinput.value = minScore == 0 ? "" : minScore;
    newinput.style.width = "70px";

    newinput.addEventListener("input", () => {
        minScore = Number(newinput.value);
        console.log("Hiding posts with a score below " + minScore);
        hidePosts_desktop();
    });

    nsfw_toggle.type = "checkbox";
    nsfw_toggle.checked = show_nsfw;

    nsfw_toggle.addEventListener("change", () => {
        show_nsfw = nsfw_toggle.checked;
        show_nsfw ? console.log("Showing nsfw posts") : console.log("Hiding nsfw posts");
        hidePosts_desktop();
    });

    

    spacer.appendChild(span1);
    spacer.appendChild(newinput);
    spacer.appendChild(span2);
    spacer.appendChild(type_selector);
    spacer.appendChild(span3);
    spacer.appendChild(time_selector);
    nsfw_label.appendChild(nsfw_toggle);
    spacer.appendChild(nsfw_label);
    console.log("Desktop inputs created");
}

function createInputs_mobile(){
    var postsList = document.getElementsByClassName("PostsList")[0];
    var newDiv = document.createElement("div");
    var newInput = document.createElement("input");
    var span1 = document.createElement("span");
    var span2 = document.createElement("span");
    var span3 = document.createElement("span");
    var newSelect = createSelector(hidePosts_mobile);
    var br1 = document.createElement("br");
    var br2 = document.createElement("br");
    var nsfw_check = document.createElement("input");
    var nsfw_label = document.createElement("label");
    var time_selector = createTimeSelector(hidePosts_mobile);

    time_selector.value = show_older_than;

    span1.innerText = "Hide posts below score: ";
    span2.innerText = " Show ";
    span3.innerText = " older than ";
    newDiv.style.margin = "8px 10px";
    newDiv.id = "min-score-div";
    newInput.style.width = "70px";
    newSelect.value = type_selector_value;

    nsfw_label.innerText = "Show nsfw: ";
    nsfw_check.type = "checkbox";
    nsfw_check.checked = show_nsfw;

    nsfw_check.addEventListener("change", () => {
        show_nsfw = nsfw_check.checked;
        show_nsfw ? console.log("Showing nsfw posts") : console.log("Hiding nsfw posts");
        hidePosts_mobile();
    });
    nsfw_label.appendChild(nsfw_check);

    newInput.type = "number";
    newInput.value = minScore == 0 ? "" : minScore;
    newInput.addEventListener("input", () => {
        minScore = Number(newInput.value);
        console.log("Hiding posts with a score below " + minScore);
        hidePosts_mobile();
    })

    newDiv.appendChild(span1);
    newDiv.appendChild(newInput);
    newDiv.appendChild(br1);
    newDiv.appendChild(span2);
    newDiv.appendChild(newSelect);
    newDiv.appendChild(span3);
    newDiv.appendChild(time_selector);
    newDiv.appendChild(br2);
    newDiv.appendChild(nsfw_label);

    postsList.parentElement.insertBefore(newDiv, postsList);
}

function addParams(url, params){
    if (!url.includes("?")) {
        url += "?";
        params.forEach(pair => url += pair[0] + "=" + pair[1] + "&");
        return url.slice(0, -1);
    } else {
        var base_url = url.split("?").shift();
        return_url = base_url + "?";
        var params_before = new Map(url.split("?").pop().split("&").filter(i => !!i).map(i => i.split("=")));
        params.forEach(pair => params_before.set(pair[0], pair[1]));
        for (key of params_before.keys()){
            return_url += key + "=" + params_before.get(key) + "&";
        }
        return return_url.slice(0, -1);
    }
}

function hidePosts_desktop(){
    Array.from(document.getElementsByClassName("thing")).forEach(link => {
        if (link.dataset.score && link.dataset.domain){
            const textPost = link.dataset.domain.includes("self.") ? true : false;
            const post_time = new Date((new Date()).setTime(link.dataset.timestamp));
            const now = new Date();
            const too_new = now - post_time < Number(show_older_than) * 24 * 60 * 60 * 1000;
            const is_nsfw = link.dataset.nsfw == "true";
            if (Number(link.dataset.score) < Number(minScore) || (textPost && hideTextPosts) || (!textPost && hideLinkPosts) || too_new
                || (is_nsfw && !show_nsfw)){
                link.style.display = "none";
            } else {
                link.style.display = "";
            }
        }
    });
    var next_a = document.getElementsByClassName("next-button")[0].firstChild;
    var prev_a = null;
    try {
        prev_a = document.getElementsByClassName("prev-button")[0].firstChild;
    } catch(TypeError){}
    var params = [
        ["minScore", minScore],
        ["minAge", show_older_than],
        ["showTypes", type_selector_value],
        ["showNsfw", show_nsfw]
    ];
    next_a.href = addParams(next_a.href, params);
    if (prev_a){
        prev_a.href = addParams(prev_a.href, params);
    }
}

function hidePosts_mobile(){
    Array.from(document.getElementsByTagName("article")).forEach(article => {
        var score = Number(article.getElementsByClassName("VotingBox__score")[0].innerText);
        if (isNaN(score)){
            score = 1;
        }
        var textPost = Array.from(article.getElementsByClassName("PostHeader__author-link")).length < 2;
        var isAd = Array.from(article.getElementsByClassName("PostHeader__promoted-flair")).length > 0;
        var isNsfw = Array.from(article.getElementsByClassName("PostHeader__nsfw-text")).length > 0;
        var time_diff = 1;
        var time_list = Array.from(article.getElementsByClassName("PostHeader__author-link"));
        var time_text = "";
        if (time_list.length > 0) {
            time_text = time_list.pop().parentElement.innerText.split("u/")[0];
        }
        var time_letter = time_text.slice(-1);
        var time_value = Number(time_text.slice(0, -1));
        switch(time_letter){
            case "m":
                time_diff = time_value * 60 * 1000;
                break;
            case "h":
                time_diff = time_value * 60 * 60 * 1000;
                break;
            case "d":
                time_diff = time_value * 24 * 60 * 60 * 1000;
                break;
            case "w":
                time_diff = time_value * 7 * 24 * 60 * 60 * 1000;
                break;
            case "y":
                time_diff = time_value * 365 * 24 * 60 * 60 * 1000;
                break;
        }

        if (score < minScore || (textPost && hideTextPosts) || (!textPost && hideLinkPosts) || isAd || (isNsfw && !show_nsfw)
            || time_diff < show_older_than * 24 * 60 * 60 * 1000){
            article.style.display = "none";
        } else {
            article.style.display = "";
        }
    });
}

var mobile_interval = null;

function setupMobile(){
    var not_created = !document.getElementById("min-score-div");
    if (not_created){
        try {
            createInputs_mobile();
            if (mobile_interval) {
                clearInterval(mobile_interval);
            }
            mobile_interval = setInterval(hidePosts_mobile, 500);
        } catch (TypeError) {
            
        }
    }
}

try {
    createInputs_desktop();
    setInterval(hidePosts_desktop, 500);
} catch (TyperError) {
    setInterval(setupMobile, 500);
}