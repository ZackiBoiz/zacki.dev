document.addEventListener("DOMContentLoaded", async () => {
    const card = document.getElementById("discord-card");
    if (!card) return;

    const LANYARD_USER_ID = "900442235760443442";
    const WS_URL = "wss://api.lanyard.rest/socket";

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
            asset: "assets/badges/discordstaff.svg"
        },
        [1 << 1]: {
            title: "Discord Partner",
            asset: "assets/badges/discordpartner.svg"
        },
        [1 << 2]: {
            title: "HypeSquad Events",
            asset: "assets/badges/hypesquadevents.svg"
        },
        [1 << 3]: {
            title: "Discord Bug Hunter",
            asset: "assets/badges/discordbughunter1.svg"
        },
        [1 << 6]: {
            title: "HypeSquad Bravery",
            asset: "assets/badges/hypesquadbravery.svg"
        },
        [1 << 7]: {
            title: "HypeSquad Brilliance",
            asset: "assets/badges/hypesquadbrilliance.svg"
        },
        [1 << 8]: {
            title: "HypeSquad Balance",
            asset: "assets/badges/hypesquadbalance.svg"
        },
        [1 << 9]: {
            title: "Early Supporter",
            asset: "assets/badges/earlysupporter.webp"
        },
        [1 << 14]: {
            title: "Discord Bug Hunter",
            asset: "assets/badges/discordbughunter2.svg"
        },
        [1 << 17]: {
            title: "Early Verified Bot Developer",
            asset: "assets/badges/discordbotdev.svg"
        },
        [1 << 18]: {
            title: "Moderator Programs Alumni",
            asset: "assets/badges/discordmod.svg"
        },
        [1 << 22]: {
            title: "Active Developer",
            asset: "assets/badges/activedeveloper.svg"
        },
        [1 << 23]: {
            title: "Supports Commands",
            asset: "assets/badges/supportscommands.svg"
        },
        [1 << 24]: {
            title: "Uses Automod",
            asset: "assets/badges/automod.svg"
        }
    };

    const USER_FLAIRS = {
        bot: {
            title: "App",
            asset: "assets/flairs/App.svg"
        },
        verified_bot: {
            title: "Verified App",
            asset: "assets/flairs/VerifiedApp.svg"
        },
        beta: {
            title: "Beta",
            asset: "assets/flairs/Beta.svg"
        },
        ai: {
            title: "AI",
            asset: "assets/flairs/DarkAi.svg"
        },
        official: {
            title: "Official",
            asset: "assets/flairs/Official.svg"
        },
        original_poster: {
            title: "Original Poster",
            asset: "assets/flairs/OriginalPoster.svg"
        },
        system: {
            title: "System",
            asset: "assets/flairs/System.svg"
        },
    }

    const PLATFORM_TYPES = {
        desktop: {
            title: "Desktop",
            asset: "assets/platforms/desktop.svg"
        },
        windows: {
            title: "Desktop (Windows)",
            asset: "assets/platforms/desktop.svg"
        },
        macos: {
            title: "Desktop (MacOS)",
            asset: "assets/platforms/desktop.svg"
        },
        linux: {
            title: "Desktop (Linux)",
            asset: "assets/platforms/desktop.svg"
        },
        web: {
            title: "Web",
            asset: "assets/platforms/web.svg"
        },
        mobile: {
            title: "Mobile",
            asset: "assets/platforms/mobile.svg"
        },
        ios: {
            title: "Mobile (iOS)",
            asset: "assets/platforms/mobile.svg"
        },
        android: {
            title: "Mobile (Android)",
            asset: "assets/platforms/mobile.svg"
        },
        embedded: {
            title: "Console",
            asset: "assets/platforms/embedded.svg"
        },
        playstation: {
            title: "Console (PlayStation)",
            asset: "assets/platforms/embedded.svg"
        },
        ps4: {
            title: "Console (PlayStation 4)",
            asset: "assets/platforms/embedded.svg"
        },
        ps5: {
            title: "Console (PlayStation 5)",
            asset: "assets/platforms/embedded.svg"
        },
        nintendo_switch: {
            title: "Console (Nintendo Switch)",
            icon: "assets/platforms/embedded.svg"
        },
        xbox: {
            title: "Console (Xbox)",
            icon: "fab fa-xbox"
        },
        steam: {
            title: "Steam",
            icon: "fab fa-steam"
        },
        epic_games_store: {
            title: "Epic Games Store",
            icon: "fas fa-store"
        },
    };

    const ACTIVITY_TYPES = {
        PLAYING: 0,
        STREAMING: 1,
        LISTENING: 2,
        WATCHING: 3,
        CUSTOM: 4,
        COMPETING: 5
    };

    const ACTIVITY_LABELS = {
        [ACTIVITY_TYPES.PLAYING]: "🎮 Playing",
        [ACTIVITY_TYPES.STREAMING]: "🎥 Streaming",
        [ACTIVITY_TYPES.LISTENING]: "🎧 Listening to",
        [ACTIVITY_TYPES.WATCHING]: "👀 Watching",
        [ACTIVITY_TYPES.COMPETING]: "🏆 Competing in"
    };

    const LANYARD_OPS = {
        EVENT: 0,
        HELLO: 1,
        INITIALIZE: 2,
        HEARTBEAT: 3
    };

    const LANYARD_EVENTS = {
        INIT_STATE: "INIT_STATE",
        PRESENCE_UPDATE: "PRESENCE_UPDATE"
    }

    function escape(str = "") {
        if (typeof str !== "string") return "";
        return str
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function toURL(imgKey, id, appId, fallbackType) {
        if (!imgKey) {
            if (fallbackType === "large" && appId) {
                return `https://dcdn.dstn.to/app-icons/${appId}`;
            }
            return null;
        }
        if (typeof imgKey !== "string") return null;
        if (imgKey.startsWith("mp:external/")) {
            const match = imgKey.match(/mp:external\/([^/]+\/https?\/.+)/);
            if (match) {
                return "https://media.discordapp.net/external/" + match[1];
            }
        }
        if (/^\d+$/.test(imgKey) && appId) {
            return `https://cdn.discordapp.com/app-assets/${appId}/${imgKey}.png`;
        }
        return null;
    }

    function formatDuration(ms) {
        ms = Math.max(0, ms);
        let totalSeconds = Math.floor(ms / 1000);
        let hours = Math.floor(totalSeconds / 3600);
        let minutes = Math.floor((totalSeconds % 3600) / 60);
        let seconds = totalSeconds % 60;
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        } else {
            return `${minutes}:${seconds.toString().padStart(2, "0")}`;
        }
    }

    function renderFallbackCard(errorMsg) {
        card.innerHTML = `
            <div class="discord-info">
                <div class="discord-header">
                    <span class="discord-avatar-wrapper">
                        <img class="discord-avatar" src="assets/app-icons/default.svg" alt="Avatar">
                        <span class="discord-status-badge">
                            <i class="fas fa-circle-dot discord-icon hover-action muted" title="Offline"></i>
                        </span>
                    </span>
                    <div class="discord-names">
                        <span class="discord-global">Unavailable</span>
                        <span class="discord-username">Discord status unavailable</span>
                    </div>
                </div>
                <div class="discord-activity-card">
                    <div class="discord-activity-card-header">
                        <span>Status</span>
                    </div>
                    <div class="discord-activity-card-body">
                        <div class="discord-activity-card-text">
                            <div class="discord-activity-card-details">
                                ${errorMsg ? escape(errorMsg) : "Could not load Discord presence."}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderBadges(flags, BADGES) {
        if (!flags || typeof flags !== "number") return "";
        return Object.keys(BADGES).map(flag => {
            if ((flags & flag) === Number(flag)) {
                const badge = BADGES[flag];
                if (!badge) return "";
                return `<img class="discord-icon hover-action" src="${badge.asset}" alt="Badge" title="${badge.title}">`;
            }
            return "";
        }).join("");
    }

    function renderFlairs(flairs, FLAIRS) {
        if (!flairs || typeof flairs !== "object") return "";
        return Object.keys(FLAIRS).map(flair => {
            if (flairs[flair]) {
                const badge = FLAIRS[flair];
                if (!badge) return "";
                return `<img class="discord-icon hover-action" src="${badge.asset}" alt="Flair" title="${badge.title}">`;
            }
            return "";
        }).join("");
    }

    function renderTimeDetails(timestamps, idxOrName, liveTimers) {
        if (timestamps) {
            if (timestamps.start) {
                if (timestamps.end) {
                    const playedMs = timestamps.end - timestamps.start;
                    if (playedMs > 0) {
                        return `<div class="discord-activity-card-time">Active for ${formatDuration(playedMs)}</div>`;
                    }
                } else {
                    const timerId = `discord-activity-elapsed-timer-${idxOrName}`;
                    const start = timestamps.start;
                    liveTimers.push({ id: timerId, start });
                    return `<div class="discord-activity-card-time"><span id="${timerId}">${formatDuration(Date.now() - start)}</span> elapsed</div>`;
                }
            } else if (timestamps.end) {
                const timerId = `discord-activity-ended-timer-${idxOrName}`;
                const end = timestamps.end;
                liveTimers.push({ id: timerId, end, ended: true });
                return `<div class="discord-activity-card-time">Ended <span id="${timerId}">${formatDuration(Date.now() - end)}</span> ago</div>`;
            }
        }
        return "";
    }

    async function getUserBannerURL(userId) {
        const url = `https://dcdn.dstn.to/banners/${userId}`;
        try {
            const res = await fetch(url, {
                method: "GET"
            });
            if (res.ok) return url;
        } catch { }
        return null;
    }

    async function renderDiscordCard(lanyardData) {
        try {
            if (!lanyardData || !lanyardData.discord_user) {
                renderFallbackCard("No Discord user data.");
                return;
            }
            if (window._lanyardLiveTimersIntervals && Array.isArray(window._lanyardLiveTimersIntervals)) {
                window._lanyardLiveTimersIntervals.forEach(intervalId => clearInterval(intervalId));
            }
            window._lanyardLiveTimersIntervals = [];

            const discordUser = lanyardData.discord_user;
            const discordStatus = lanyardData.discord_status || "offline";
            let avatarURL;
            if (discordUser.avatar) {
                avatarURL = `https://dcdn.dstn.to/avatars/${discordUser.id}`;
            } else if (discordUser.discriminator && !isNaN(parseInt(discordUser.discriminator))) {
                avatarURL = `https://cdn.discordapp.com/embed/avatars/${parseInt(discordUser.discriminator) % 5}.png`;
            } else {
                avatarURL = "assets/app-icons/default.svg";
            }

            // --- Banner logic ---
            let bannerURL = await getUserBannerURL(discordUser.id);

            const userInfo = {
                avatarURL,
                avatarDecorationURL: discordUser.avatar_decoration_data && discordUser.avatar_decoration_data.asset
                    ? `https://cdn.discordapp.com/avatar-decoration-presets/${discordUser.avatar_decoration_data.asset}.png?size=128`
                    : null,
                nameplateAsset: discordUser.collectibles && discordUser.collectibles.nameplate && discordUser.collectibles.nameplate.asset
                    ? discordUser.collectibles.nameplate.asset
                    : null,
                username: escape(discordUser.username || "Unknown"),
                discriminator: discordUser.discriminator === "0" ? null : discordUser.discriminator,
                globalName: escape(discordUser.global_name || discordUser.username || "Unknown"),
                guild: discordUser.primary_guild && discordUser.primary_guild.tag ? {
                    tag: escape(discordUser.primary_guild.tag),
                    tagURL: discordUser.primary_guild.identity_guild_id && discordUser.primary_guild.badge
                        ? `https://cdn.discordapp.com/clan-badges/${discordUser.primary_guild.identity_guild_id}/${discordUser.primary_guild.badge}.png?size=64`
                        : ""
                } : null,
                publicFlags: discordUser.public_flags,
                flairs: {
                    bot: !!discordUser.bot
                }
            };

            const status = STATUS_ICONS[discordStatus] || STATUS_ICONS.offline;

            let flairsHtml = renderFlairs(userInfo.flairs, USER_FLAIRS);
            let badgesHtml = renderBadges(userInfo.publicFlags, USER_BADGES);

            let displayGlobalName = userInfo.globalName;
            let displayUsername = `${userInfo.username}${userInfo.discriminator ? `#${userInfo.discriminator}` : ""}`;

            let html = "";

            // Banner (full width, no padding)
            if (bannerURL) {
                html += `<div class="discord-banner"><img src="${bannerURL}" alt="User Banner"></div>`;
            }

            // Start info wrapper
            html += `<div class="discord-info">`;

            html += `
                <div class="discord-header">
                    ${userInfo.nameplateAsset
                    ? `<video class="discord-nameplate" src="https://cdn.discordapp.com/assets/collectibles/${userInfo.nameplateAsset}asset.webm" poster="https://cdn.discordapp.com/assets/collectibles/${userInfo.nameplateAsset}static.png" autoplay loop muted playsinline></video>`
                    : ""
                }
                    <span class="discord-avatar-wrapper">
                        <img class="discord-avatar" src="${userInfo.avatarURL}" alt="Avatar">
                        ${userInfo.avatarDecorationURL
                    ? `<img class="discord-avatar-decoration" src="${userInfo.avatarDecorationURL}" alt="Avatar decoration">`
                    : ""
                }
                        <span class="discord-status-badge">
                            <i class="fas ${status.icon} discord-icon hover-action ${status.color}" title="${status.name}"></i>
                        </span>
                    </span>
                    <div class="discord-names">
                        <span class="discord-global">
                            ${displayGlobalName}
                            <span class="discord-icons">${flairsHtml}</span>
                            <span class="discord-icons">${badgesHtml}</span>
                        </span>
                        <span class="discord-username">
                            ${displayUsername}
                        </span>
                    </div>
                    ${userInfo.guild && userInfo.guild.tagURL ? `
                        <span class="discord-guild-tag hover-action" title="${userInfo.guild.tag} tag">
                            <img src="${userInfo.guild.tagURL}" alt="Guild tag">
                            ${userInfo.guild.tag}
                        </span>` : ""
                }
                </div>
            `;

            let liveTimers = [];

            let spotifyData = lanyardData.spotify;
            let activities = Array.isArray(lanyardData.activities) ? [...lanyardData.activities] : [];
            if (spotifyData) {
                activities = activities.filter(
                    act => !(act && act.type === 2 && act.id && typeof act.id === "string" && act.id.startsWith("spotify:"))
                );
            }

            activities.forEach((activity, idx) => {
                if (!activity || typeof activity !== "object") return;
                if (activity.type === ACTIVITY_TYPES.CUSTOM) {
                    let emoji = "";
                    if (activity.emoji) {
                        if (activity.emoji.id) {
                            const ext = activity.emoji.animated ? "gif" : "png";
                            const emojiUrl = `https://cdn.discordapp.com/emojis/${activity.emoji.id}.${ext}`;
                            emoji = `<img class="discord-custom-emoji" src="${emojiUrl}" alt="${escape(activity.emoji.name)}" title=":${activity.emoji.name}:">`;
                        } else if (activity.emoji.name) {
                            emoji = escape(activity.emoji.name);
                        }
                    }
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

                let largeImageURL = toURL(activity.assets?.large_image, null, activity.application_id, "large");
                if (!largeImageURL && activity.application_id) {
                    largeImageURL = `https://dcdn.dstn.to/app-icons/${activity.application_id}`;
                }
                if (!largeImageURL) {
                    largeImageURL = "assets/app-icons/default.svg";
                }

                let smallImageURL = toURL(activity.assets?.small_image, null, activity.application_id);
                const activityLabel = ACTIVITY_LABELS[activity.type] || escape(activity.name || "");
                const activityDetails = activity.details ? escape(activity.details) : "";
                const activityMeta = activity.state ? escape(activity.state) : "";

                let timeDetails = renderTimeDetails(activity.timestamps, idx, liveTimers);
                let platformDetails = activity.platform ? PLATFORM_TYPES[activity.platform] : null;

                let largeImageTitle = activity.name || "";
                if (activity.assets && activity.assets.large_text) {
                    largeImageTitle = escape(activity.assets.large_text);
                } else if (activity.details) {
                    largeImageTitle = escape(activity.details);
                }

                let activityButtons = "";
                if (activity.type === ACTIVITY_TYPES.STREAMING && activity.url) {
                    activityButtons += `<a href="${escape(activity.url)}" target="_blank" class="project-btn activity-btn">Watch Stream</a>`;
                }

                html += `
                    <div class="discord-activity-card">
                        <div class="discord-activity-card-header">
                            <span>${activityLabel}</span>
                            ${activityButtons}
                        </div>
                        <div class="discord-activity-card-body">
                            ${largeImageURL ? `
                                <div class="discord-activity-card-assets">
                                    <img class="discord-activity-card-large hover-action" src="${largeImageURL}" title="${largeImageTitle}">
                                    ${smallImageURL ? `<img class="discord-activity-card-small hover-action" src="${smallImageURL}" title="${escape(activity.assets?.small_text || "")}">` : ""}
                                </div>` : ""
                    }
                            <div class="discord-activity-card-text">
                                <div class="discord-activity-card-title">
                                    ${escape(activity.name || "")}
                                    ${platformDetails
                        ? platformDetails.asset
                            ? `<img class="discord-icon hover-action" src="${platformDetails.asset}" alt="Platform" title="${platformDetails.title}">`
                            : platformDetails.icon
                                ? `<i class="blurple discord-icon hover-action ${platformDetails.icon}" title="${platformDetails.title}"></i>`
                                : ""
                        : activity.platform ? "unknown platform" : ""
                    }
                                </div>
                                ${activityDetails ? `<div class="discord-activity-card-details">${activityDetails}</div>` : ""}
                                ${activityMeta ? `<div class="discord-activity-card-meta">${activityMeta}</div>` : ""}
                                ${timeDetails}
                            </div>
                        </div>
                    </div>
                `;
            });

            if (spotifyData) {
                let timeDetails = renderTimeDetails(spotifyData.timestamps, "spotify", liveTimers);
                const albumArtUrl = spotifyData.album_art_url || "assets/app-icons/default.svg";
                const album = spotifyData.album ? escape(spotifyData.album) : "Unknown Album";
                const artist = spotifyData.artist ? escape(spotifyData.artist) : "Unknown Artist";
                const song = spotifyData.song ? escape(spotifyData.song) : "Unknown Song";
                html += `
                    <div class="discord-activity-card">
                        <div class="discord-activity-card-header">
                            ${ACTIVITY_LABELS[ACTIVITY_TYPES.LISTENING]}
                        </div>
                        <div class="discord-activity-card-body">
                            <div class="discord-activity-card-assets">
                                <img class="discord-activity-card-large hover-action" src="${albumArtUrl}" title="${album}">
                            </div>
                            <div class="discord-activity-card-text">
                                <div class="discord-activity-card-title">
                                    ${song}
                                </div>
                                <div class="discord-activity-card-details">${artist}</div>
                                <div class="discord-activity-card-meta">${album}</div>
                                ${timeDetails}
                            </div>
                        </div>
                    </div>
                `;
            }

            // End info wrapper
            html += `</div>`;

            card.innerHTML = html;

            if (liveTimers.length > 0) {
                const intervalId = setInterval(() => {
                    liveTimers.forEach(timer => {
                        const el = document.getElementById(timer.id);
                        if (el) {
                            if (timer.ended) {
                                el.textContent = formatDuration(Date.now() - timer.end);
                            } else {
                                el.textContent = formatDuration(Date.now() - timer.start);
                            }
                        }
                    });
                }, 1000);
                window._lanyardLiveTimersIntervals.push(intervalId);
            }
        } catch (err) {
            renderFallbackCard("Error rendering Discord card.");
            console.error("Discord card error:", err);
        }
    }

    function handlePresence(presence) {
        try {
            renderDiscordCard(presence);
        } catch (err) {
            renderFallbackCard("Error updating presence.");
            console.error("Presence update error:", err);
        }
    }

    function connectLanyardWS() {
        let ws;
        let heartbeatInterval = null;
        let reconnectTimeout = null;

        function cleanup() {
            if (ws) {
                ws.onclose = ws.onerror = ws.onmessage = ws.onopen = null;
                try { ws.close(); } catch { }
                ws = null;
            }
            if (heartbeatInterval) {
                clearInterval(heartbeatInterval);
                heartbeatInterval = null;
            }
            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
                reconnectTimeout = null;
            }
        }

        function start() {
            try {
                ws = new WebSocket(WS_URL);
            } catch (err) {
                renderFallbackCard("WebSocket connection failed.");
                return;
            }

            ws.onopen = () => {
                console.log("opened lanyard websocket");
            };

            ws.onmessage = (event) => {
                let msg;
                try {
                    msg = JSON.parse(event.data);
                } catch (e) {
                    renderFallbackCard("Invalid data from server.");
                    return;
                }
                if (msg.op === LANYARD_OPS.HELLO) {
                    console.log("got hello");

                    const interval = msg.d.heartbeat_interval;
                    ws.send(JSON.stringify({
                        op: LANYARD_OPS.INITIALIZE,
                        d: {
                            subscribe_to_id: LANYARD_USER_ID
                        }
                    }));

                    heartbeatInterval = setInterval(() => {
                        ws.send(JSON.stringify({
                            op: LANYARD_OPS.HEARTBEAT
                        }));
                    }, interval);
                } else if (msg.op === LANYARD_OPS.EVENT) {
                    if (msg.t === LANYARD_EVENTS.INIT_STATE) {
                        handlePresence(msg.d);
                    } else if (msg.t === LANYARD_EVENTS.PRESENCE_UPDATE) {
                        handlePresence(msg.d);
                    }
                }
            };

            ws.onerror = () => {
                cleanup();
                renderFallbackCard("WebSocket error. Retrying...");
                reconnectTimeout = setTimeout(start, 2000);
            };

            ws.onclose = () => {
                cleanup();
                renderFallbackCard("WebSocket closed. Retrying...");
                reconnectTimeout = setTimeout(start, 2000);
            };
        }

        start();
    }

    try {
        connectLanyardWS();
    } catch (err) {
        renderFallbackCard("Could not connect to Discord status.");
        console.error("Initial connection error:", err);
    }
});