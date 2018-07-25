
var minScore = 0;
var hideTextPosts = false
var hideLinkPosts = false


function createInput(){
    var newinput = document.createElement("input");
    var span1 = document.createElement("span");
    var span2 = document.createElement("span");
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

    span1.innerText = "Hide posts below score: ";
    span2.innerText = " Show ";
    newinput.type = "number";

    newinput.addEventListener("input", () => {
        minScore = Number(newinput.value);
        console.log("Hiding posts with a score below " + minScore);
        hideBelow();
    });

    newSelect.addEventListener("change", () => {
        switch(newSelect.value) {
            case "all":
                hideTextPosts = false;
                hideLinkPosts = false;
                console.log("Showing all posts");
                hideBelow();
                break;
            case "text":
                hideTextPosts = false;
                hideLinkPosts = true;
                console.log("Showing text posts only");
                hideBelow();
                break;
            case "link":
                hideTextPosts = true;
                hideLinkPosts = false;
                console.log("Showing links only");
                hideBelow();
                break;
        }
    });
    
    var spacer = Array.from(document.getElementsByClassName("content")).filter(i => i.tagName == "DIV")[0].getElementsByClassName("spacer")[0];
    spacer.appendChild(span1);
    spacer.appendChild(newinput);
    spacer.appendChild(span2);
    spacer.appendChild(newSelect);
}

function hideBelow(){
    Array.from(document.getElementsByClassName("thing")).forEach(link => {
        if (link.dataset.score && link.dataset.domain){
            const textPost = link.dataset.domain.includes("self.") ? true : false;
            if (Number(link.dataset.score) < Number(minScore) || (textPost && hideTextPosts) || (!textPost && hideLinkPosts)){
                link.style.display = "none";
            } else {
                link.style.display = "";
            }
        }
    })
}

createInput();

setInterval(hideBelow, 500);