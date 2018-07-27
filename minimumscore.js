
var minScore = 0;
var hideTextPosts = false
var hideLinkPosts = false
const mobile = Array.from(document.getElementsByTagName("article")).length > 2 ? true : false;

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
                console.log("Showing all posts");
                hide_function();
                break;
            case "text":
                hideTextPosts = false;
                hideLinkPosts = true;
                console.log("Showing text posts only");
                hide_function();
                break;
            case "link":
                hideTextPosts = true;
                hideLinkPosts = false;
                console.log("Showing links only");
                hide_function();
                break;
        }
    });

    return newSelect;
}

function createInputs_desktop(){
    var newinput = document.createElement("input");
    var span1 = document.createElement("span");
    var span2 = document.createElement("span");
    

    span1.innerText = "Hide posts below score: ";
    span2.innerText = " Show ";
    newinput.type = "number";
    newinput.value = minScore;

    newinput.addEventListener("input", () => {
        minScore = Number(newinput.value);
        console.log("Hiding posts with a score below " + minScore);
        hidePosts_desktop();
    });

    var spacer = Array.from(document.getElementsByClassName("content")).filter(i => i.tagName == "DIV")[0].getElementsByClassName("spacer")[0];
    spacer.appendChild(span1);
    spacer.appendChild(newinput);
    spacer.appendChild(span2);
    spacer.appendChild(createSelector(hidePosts_desktop));
    console.log("Desktop inputs created");
}

function createInputs_mobile(){
    var newDiv = document.createElement("div");
    var newInput = document.createElement("input");
    var span1 = document.createElement("span");
    var span2 = document.createElement("span");
    var newSelect = createSelector(hidePosts_mobile);
    var br = document.createElement("br");

    span1.innerText = "Hide posts below score: ";
    span2.innerText = " Show ";
    newDiv.style.margin = "8px 10px";
    newDiv.id = "min-score-div";
    newInput.style.width = "70px";

    newInput.type = "number";
    newInput.value = minScore;
    newInput.addEventListener("input", () => {
        minScore = Number(newInput.value);
        console.log("Hiding posts with a score below " + minScore);
        hidePosts_mobile();
    })

    newDiv.appendChild(span1);
    newDiv.appendChild(newInput);
    newDiv.appendChild(br);
    newDiv.appendChild(span2);
    newDiv.appendChild(newSelect);

    var postsList = document.getElementsByClassName("PostsList")[0];
    postsList.parentElement.insertBefore(newDiv, postsList);
}

function hidePosts_desktop(){
    Array.from(document.getElementsByClassName("thing")).forEach(link => {
        if (link.dataset.score && link.dataset.domain){
            const textPost = link.dataset.domain.includes("self.") ? true : false;
            if (Number(link.dataset.score) < Number(minScore) || (textPost && hideTextPosts) || (!textPost && hideLinkPosts)){
                link.style.display = "none";
            } else {
                link.style.display = "";
            }
        }
    });
}

function hidePosts_mobile(){
    Array.from(document.getElementsByTagName("article")).forEach(article => {
        var score = Number(article.getElementsByClassName("VotingBox__score")[0].innerText);
        if (isNaN(score)){
            score = 1;
        }
        var textPost = Array.from(article.getElementsByClassName("PostHeader__author-link")).length > 1 ? false : true;
        var isAd = Array.from(article.getElementsByClassName("PostHeader__promoted-flair")).length > 0 ? true : false;
        if (score < minScore || (textPost && hideTextPosts) || (!textPost && hideLinkPosts) || isAd){
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