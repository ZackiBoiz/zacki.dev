(async function() {
    const card = document.getElementById('discord-card');
    if (!card) return;

    function getStatusClass(status) {
        switch (status) {
            case "online": return "success";
            case "idle": return "warning";
            case "dnd": return "danger";
            default: return "muted";
        }
    }

    function getStatusIcon(status) {
        const statusClass = getStatusClass(status);
        switch (status) {
            case "online": return `<i class="fas fa-circle ${statusClass}"></i>`;
            case "idle": return `<i class="fas fa-moon ${statusClass}"></i>`;
            case "dnd": return `<i class="fas fa-minus-circle ${statusClass}"></i>`;
            case "offline": default: return `<i class="fas fa-circle-notch ${statusClass}"></i>`;
        }
    }

    function escapeHTML(str) {
        return str.replace(/[&<>"']/g, m => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[m]);
    }

    try {
        const res = await fetch("https://api.lanyard.rest/v1/users/900442235760443442");
        const { data } = await res.json();

        const user = data.discord_user;
        const avatar = user.avatar
            ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
            : "https://cdn.discordapp.com/embed/avatars/0.png";
        const username = escapeHTML(user.username);
        const globalName = escapeHTML(user.global_name || "");
        const status = data.discord_status;

        let guildTag = "";
        if (user.primary_guild && user.primary_guild.tag) {
            guildTag = `
                <span class="discord-guild" title="${escapeHTML(user.primary_guild.tag)} badge">
                    <img class="discord-guild-badge" src="https://cdn.discordapp.com/clan-badges/${user.primary_guild.identity_guild_id}/${user.primary_guild.badge}.png?size=64" alt="Guild badge">
                    ${escapeHTML(user.primary_guild.tag)}
                </span>
            `;
        }

        let activities = "";
        if (Array.isArray(data.activities)) {
            activities = data.activities.map(act => {
                let type = act.type;
                if (type === 4) {
                    let emoji = act.emoji ? `<span class="discord-activity-emoji">${escapeHTML(act.emoji.name)}</span>` : "";
                    return `<div class="discord-activity">${emoji}<span class="discord-activity-details">${escapeHTML(act.state || "")}</span></div>`;
                } else {
                    let images = "";
                    if (act.assets && act.assets.large_image) {
                        let largeImg = act.assets.large_image;
                        let largeUrl = largeImg.startsWith("mp:external")
                            ? `https://media.discordapp.net/${largeImg.replace(/^mp:/, "")}`
                            : `https://cdn.discordapp.com/app-assets/${act.application_id}/${largeImg}.png`;
                        let largeTitle = act.assets.large_text ? escapeHTML(act.assets.large_text) : "";
                        images += `<img class="discord-activity-largeimg" src="${largeUrl}" alt="" title="${largeTitle}">`;
                        if (act.assets.small_image) {
                            let smallImg = act.assets.small_image;
                            let smallUrl = smallImg.startsWith("mp:external")
                                ? `https://media.discordapp.net/${smallImg.replace(/^mp:/, "")}`
                                : `https://cdn.discordapp.com/app-assets/${act.application_id}/${smallImg}.png`;
                            let smallTitle = act.assets.small_text ? escapeHTML(act.assets.small_text) : "";
                            images += `<img class="discord-activity-smallimg" src="${smallUrl}" alt="" title="${smallTitle}">`;
                        }
                        images = `<span class="discord-activity-images">${images}</span>`;
                    }
                    let label = "";
                    switch (type) {
                        case 0: // Playing
                            label = `Playing ${escapeHTML(act.name)}`;
                            break;
                        case 1: // Streaming
                            label = `Streaming ${act.details ? escapeHTML(act.details) : escapeHTML(act.name)}`;
                            break;
                        case 2: // Listening
                            label = `Listening to ${escapeHTML(act.name)}`;
                            break;
                        case 3: // Watching
                            label = `Watching ${act.details ? escapeHTML(act.details) : escapeHTML(act.name)}`;
                            break;
                        case 5: // Competing
                            label = `Competing in ${escapeHTML(act.name)}`;
                            break;
                        default:
                            label = escapeHTML(act.name);
                    }
                    let details = act.details && type !== 1 && type !== 3 ? `<span class="discord-activity-details">${escapeHTML(act.details)}</span>` : "";
                    let state = act.state ? `<span class="discord-activity-meta">${escapeHTML(act.state)}</span>` : "";
                    return `<div class="discord-activity">${images}<span class="discord-activity-title">${label}</span>${details}${state}</div>`;
                }
            }).join("");
        }

        card.innerHTML = `
            <div class="discord-header">
                <img class="discord-avatar" src="${avatar}" alt="Discord avatar">
                <div class="discord-names">
                    <span class="discord-username">${username}</span>
                    <span class="discord-global">${globalName}</span>
                </div>
                ${guildTag}
            </div>
            <div class="discord-status">
                ${getStatusIcon(status)}
                <span>${status.charAt(0).toUpperCase() + status.slice(1)}</span>
            </div>
            ${activities}
        `;
    } catch (e) {
        card.innerHTML = `<em>Could not load Discord status.</em>`;
    }
})();
