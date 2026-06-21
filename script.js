const usernameInput =
document.getElementById("username");

const historyList =
document.getElementById("history");

const themeBtn =
document.getElementById("themeBtn");

let searchHistory =
JSON.parse(
localStorage.getItem("history")
) || [];

renderHistory();

if(localStorage.getItem("theme")==="dark"){
    document.body.classList.add("dark");
}

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        localStorage.setItem("theme","dark");
    }else{
        localStorage.setItem("theme","light");
    }

});

usernameInput.addEventListener("keypress",(e)=>{

    if(e.key==="Enter"){
        getProfile();
    }

});

async function getProfile(){

    const username =
    usernameInput.value.trim();

    if(!username){
        alert("Enter a username");
        return;
    }

    document.getElementById("loader")
    .classList.remove("hidden");

    try{

        const profileResponse =
        await fetch(
            `https://api.github.com/users/${username}`
        );

        if(!profileResponse.ok){

            document.getElementById("profileCard")
            .innerHTML =
            "<h2>❌ User Not Found</h2>";

            document.getElementById("loader")
            .classList.add("hidden");

            return;
        }

        const profile =
        await profileResponse.json();

        displayProfile(profile);

        fetchRepos(username);

        updateHistory(username);

    }

    catch(error){

        document.getElementById("profileCard")
        .innerHTML =
        "<h2>Something went wrong</h2>";

    }

    document.getElementById("loader")
    .classList.add("hidden");
}

function displayProfile(profile){

    document.getElementById("profileCard")
    .innerHTML =

    `
    <img
    src="${profile.avatar_url}"
    class="profile-image">

    <h2>${profile.name || profile.login}</h2>

    <p>${profile.bio || "No bio available"}</p>

    <p><strong>Location:</strong>
    ${profile.location || "N/A"}</p>

    <button onclick="window.open('${profile.html_url}')">
    Open Profile
    </button>

    <button onclick="copyLink('${profile.html_url}')">
    Copy Profile Link
    </button>
    `;

    document.getElementById("followers")
    .innerText =
    profile.followers;

    document.getElementById("following")
    .innerText =
    profile.following;

    document.getElementById("repos")
    .innerText =
    profile.public_repos;

    const years =

    new Date().getFullYear() -

    new Date(profile.created_at)
    .getFullYear();

    document.getElementById("age")
    .innerText =
    years + " yrs";
}

async function fetchRepos(username){

    const response =
    await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated`
    );

    const repos =
    await response.json();

    const repoList =
    document.getElementById("repoList");

    repoList.innerHTML = "";

    repos.slice(0,10)
    .forEach(repo=>{

        repoList.innerHTML +=

        `
        <div class="repo-card">

            <h3>${repo.name}</h3>

            <p>
            ${repo.description || "No Description"}
            </p>

            <p>
            ⭐ ${repo.stargazers_count}
            </p>

            <p>
            🍴 ${repo.forks_count}
            </p>

            <p>
            ${repo.language || "Unknown"}
            </p>

        </div>
        `;
    });

}

function updateHistory(username){

    if(!searchHistory.includes(username)){

        searchHistory.unshift(username);

        if(searchHistory.length>5){

            searchHistory.pop();
        }

        localStorage.setItem(
            "history",
            JSON.stringify(searchHistory)
        );

        renderHistory();
    }
}

function renderHistory(){

    historyList.innerHTML="";

    searchHistory.forEach(item=>{

        historyList.innerHTML +=

        `<li>${item}</li>`;

    });

}

function copyLink(url){

    navigator.clipboard.writeText(url);

    alert("Profile link copied!");
}
