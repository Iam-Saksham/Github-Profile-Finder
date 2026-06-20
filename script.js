async function getProfile() {

    const username =
        document.getElementById("username").value.trim();

    const profile =
        document.getElementById("profile");

    if (username === "") {

        profile.innerHTML =
            "<h3>Please enter a GitHub username.</h3>";

        return;
    }

    profile.innerHTML =
        "<h3>Loading profile...</h3>";

    try {

        const response =
            await fetch(
                `https://api.github.com/users/${username}`
            );

        if (!response.ok) {

            profile.innerHTML =
                "<h3>User not found.</h3>";

            return;
        }

        const data =
            await response.json();

        profile.innerHTML =

        `
        <img
            src="${data.avatar_url}"
            class="profile-image">

        <h2 class="profile-name">
            ${data.name || "No Name Available"}
        </h2>

        <div class="info">
            <strong>Username:</strong>
            ${data.login}
        </div>

        <div class="info">
            <strong>Bio:</strong>
            ${data.bio || "No Bio Available"}
        </div>

        <div class="info">
            <strong>Company:</strong>
            ${data.company || "Not Available"}
        </div>

        <div class="info">
            <strong>Location:</strong>
            ${data.location || "Not Available"}
        </div>

        <div class="info">
            <strong>Followers:</strong>
            ${data.followers}
        </div>

        <div class="info">
            <strong>Following:</strong>
            ${data.following}
        </div>

        <div class="info">
            <strong>Public Repositories:</strong>
            ${data.public_repos}
        </div>

        <div class="info">
            <strong>Website:</strong>
            <a href="${data.blog}" target="_blank">
                ${data.blog || "Not Available"}
            </a>
        </div>

        <div class="info">
            <strong>Account Created:</strong>
            ${new Date(data.created_at).toDateString()}
        </div>

        <br>

        <a
            href="${data.html_url}"
            target="_blank">

            View GitHub Profile

        </a>
        `;

    }

    catch (error) {

        profile.innerHTML =
            "<h3>Something went wrong.</h3>";
    }
}
