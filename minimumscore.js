
var minScore = 0;


function createInput(){
    var newinput = document.createElement("input");
    var newSpan = document.createElement("span");

    newSpan.innerText = "Hide posts below score: ";
    newinput.type = "number";

    newinput.addEventListener("input", () => {
        minScore = Number(newinput.value);
        console.log("Hiding posts with a score below " + minScore);
        hideBelow();
    });
    
    var spacer = Array.from(document.getElementsByClassName("content")).filter(i => i.tagName == "DIV")[0].getElementsByClassName("spacer")[0];
    spacer.appendChild(newSpan);
    spacer.appendChild(newinput);
}

function hideBelow(){
    Array.from(document.getElementsByClassName("thing")).forEach(link => {
        if (link.dataset.score){
            if (Number(link.dataset.score) < Number(minScore)){
                link.style.display = "none";
            } else {
                link.style.display = "";
            }
        }
    })
}

createInput();

setInterval(hideBelow, 500);