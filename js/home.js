document.addEventListener("DOMContentLoaded", async () => {
    const card = document.getElementById("discord-card");
    if (!card) return;

    const STATUS_ICONS = {
        online: {
            name: "Online",
            icon: "fa-circle",
            color: "success"
        },
        idle: {
            name: "Idle",
            icon: "fa-moon",
            color: "warning"
        },
        dnd: {
            name: "Do Not Disturb",
            icon: "fa-minus-circle",
            color: "danger"
        },
        offline: {
            name: "Offline",
            icon: "fa-circle-dot",
            color: "muted"
        },
    };

    const USER_BADGES = {
        [1 << 0]: {
            title: "Discord Staff",
            asset: "assets/discordstaff.svg"
        },
        [1 << 1]: {
            title: "Discord Partner",
            asset: "assets/discordpartner.svg"
        },
        [1 << 2]: {
            title: "HypeSquad Events",
            asset: "assets/hypesquadevents.svg"
        },
        [1 << 3]: {
            title: "Discord Bug Hunter",
            asset: "assets/discordbughunter1.svg"
        },
        [1 << 6]: {
            title: "HypeSquad Bravery",
            asset: "assets/hypesquadbravery.svg"
        },
        [1 << 7]: {
            title: "HypeSquad Brilliance",
            asset: "assets/hypesquadbrilliance.svg"
        },
        [1 << 8]: {
            title: "HypeSquad Balance",
            asset: "assets/hypesquadbalance.svg"
        },
        [1 << 9]: {
            title: "Early Supporter",
            asset: "assets/earlysupporter.webp"
        },
        [1 << 14]: {
            title: "Discord Bug Hunter",
            asset: "assets/discordbughunter2.svg"
        },
        [1 << 17]: {
            title: "Early Verified Bot Developer",
            asset: "assets/discordbotdev.svg"
        },
        [1 << 18]: {
            title: "Moderator Programs Alumni",
            asset: "assets/discordmod.svg"
        },
        [1 << 22]: {
            title: "Active Developer",
            asset: "assets/activedeveloper.svg"
        }
    };

    function escape(str = "") {
        return str
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function toURL(imgKey, id, appId) {
        if (!imgKey) return null;
        if (imgKey.startsWith("mp:external")) {
            return `https://media.discordapp.net/${imgKey.replace(/^mp:/, "")}`;
        }
        return `https://cdn.discordapp.com/app-assets/${appId}/${imgKey}.png`;
    }

    try {
        const response = await fetch("https://api.lanyard.rest/v1/users/900442235760443442");
        const { data: lanyardData } = await response.json();
        const discordUser = lanyardData.discord_user;
        const discordStatus = lanyardData.discord_status || "offline";
        const userInfo = {
            avatarURL: discordUser.avatar
                ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png?size=128`
                : `https://cdn.discordapp.com/embed/avatars/0.png`,
            username: escape(discordUser.username),
            discriminator: discordUser.discriminator === "0" ? null : discordUser.discriminator,
            globalName: escape(discordUser.global_name || ""),
            guild: discordUser.primary_guild && discordUser.primary_guild.tag ? {
                tag: escape(discordUser.primary_guild.tag),
                tagURL: `https://cdn.discordapp.com/clan-badges/${discordUser.primary_guild.identity_guild_id}/${discordUser.primary_guild.badge}.png?size=64`
            } : null,
            publicFlags: discordUser.public_flags
        };

        const status = STATUS_ICONS[discordStatus] || STATUS_ICONS.offline;
        let badgesHtml = "";
        if (userInfo.publicFlags) {
            Object.keys(USER_BADGES).forEach(flag => {
                if ((userInfo.publicFlags & flag) === Number(flag)) {
                    const badge = USER_BADGES[flag];
                    badgesHtml += `<img class="discord-badge hover-action" src="${badge.asset}" alt="badge" title="${badge.title}">`;
                }
            });
        }

        let html = `
            <div class="discord-header">
                <img class="discord-avatar" src="${userInfo.avatarURL}" alt="Avatar">
                <div class="discord-names">
                    <span class="discord-username">
                        ${userInfo.username + (userInfo.discriminator ? `#${userInfo.discriminator}` : "")}
                        <span class="discord-badges">${badgesHtml}</span>
                    </span>
                    <span class="discord-global">${userInfo.globalName}</span>
                </div>
                ${userInfo.guild ? `
                    <span class="discord-guild-tag hover-action" title="${userInfo.guild.tag} tag">
                        <img src="${userInfo.guild.tagURL}" alt="Guild tag">
                        ${userInfo.guild.tag}
                    </span>` : ""
                }
            </div>
            <div class="discord-status">
                <i class="fas ${status.icon} ${status.color}"></i>
                <span>${status.name}</span>
            </div>
        `;

        if (Array.isArray(lanyardData.activities)) {
            lanyardData.activities.forEach(activity => {
                if (activity.type === 4) {
                    const emoji = activity.emoji ? escape(activity.emoji.name) : "";
                    const statusText = escape(activity.state || "");
                    html += `
                        <div class="discord-activity-card">
                            <div class="discord-activity-card-body">
                                <div class="discord-activity-card-text">
                                    <div class="discord-activity-card-details">${emoji} ${statusText}</div>
                                </div>
                            </div>
                        </div>
                    `;
                    return;
                }

                const largeImageURL = toURL(activity.assets?.large_image, null, activity.application_id);
                const smallImageURL = toURL(activity.assets?.small_image, null, activity.application_id);
                const activityTypeLabels = {
                    0: "🎮 Playing",
                    1: "🎥 Streaming",
                    2: "🎧 Listening to",
                    3: "👀 Watching",
                    5: "🏆 Competing in"
                };
                const activityLabel = activityTypeLabels[activity.type] || escape(activity.name);
                const activityDetails = activity.details && ![1, 3].includes(activity.type) ? escape(activity.details) : "";
                const activityMeta = activity.state ? escape(activity.state) : "";

                html += `
                    <div class="discord-activity-card">
                        <div class="discord-activity-card-header">
                            ${activityLabel}
                        </div>
                        <div class="discord-activity-card-body">
                            ${largeImageURL ? `
                                <div class="discord-activity-card-assets">
                                    <img class="discord-activity-card-large hover-action" src="${largeImageURL}" title="${escape(activity.assets.large_text)}">
                                    ${smallImageURL ? `<img class="discord-activity-card-small hover-action" src="${smallImageURL}" title="${escape(activity.assets.small_text)}">` : ""}
                                </div>` : ""
                            }
                            <div class="discord-activity-card-text">
                                <div class="discord-activity-card-name">
                                    ${escape(activity.name)}
                                </div>
                                ${activityDetails ? `<div class="discord-activity-card-details">${activityDetails}</div>` : ""}
                                ${activityMeta ? `<div class="discord-activity-card-meta">${activityMeta}</div>` : ""}
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        card.innerHTML = html;
    } catch (e) {
        card.innerHTML = `<em>Could not load Discord status.</em>`;
        console.error(e);
    }
});