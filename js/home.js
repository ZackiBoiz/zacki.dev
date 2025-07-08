document.addEventListener("DOMContentLoaded", async () => {
    const card = document.getElementById("discord-card");
    if (!card) return;

    const LANYARD_USER_ID = "900442235760443442";
    const WS_URL = "wss://api.lanyard.rest/socket";

    const STATUS_ICONS = {
        online: {
            name: "Online",
            asset: "assets/statuses/online.svg",
        },
        onlineMobile: {
            name: "Online",
            asset: "assets/statuses/online-mobile.svg",
        },
        streaming: {
            name: "Streaming",
            asset: "assets/statuses/streaming.svg",
        },
        idle: {
            name: "Idle",
            asset: "assets/statuses/idle.svg",
        },
        dnd: {
            name: "Do Not Disturb",
            asset: "assets/statuses/dnd.svg",
        },
        offline: {
            name: "Offline",
            asset: "assets/statuses/offline.svg",
        },
    };

    const DISCORD_BADGE_ASSETS = {
        staff: "5e74e9b61934fc1f67c65515d1f7e60d",
        partner: "3f9748e53446a137a052f3454e2de41e",
        hypesquad: "bf01d1073931f921909045f3a39fd264",
        bug_hunter_lvl1: "2717692c7dca7289b35297368a940dd0",
        hypesquad_house_1: "8a88d63823d8a71cd5e390baa45efa02",
        hypesquad_house_2: "011940fd013da3f7fb926e4a1cd2e618",
        hypesquad_house_3: "3aa41de486fa12454c3761e8e223442e",
        premium_early_supporter: "7060786766c9c840eb3019e725d2b358",
        bug_hunter_lvl2: "848f79194d4be5ff5f81505cbd0ce1e6",
        verified_developer: "6df5892e0f35b051f8b61eace34f4967",
        certified_moderator: "fee1624003e2fee35cb398e125dc479b",
        active_developer: "6bdc42827a38498929a4920da12695d9",
        bot_commands: "6f9e37f9029ff57aef81db857890005e",
        automod: "f2459b691ac7453ed6039bbcfaccbfcd",
        legacy_username: "6de6d34650760ba5551a79732e98ed60",
        premium: "2ba85e8026a8614b640c2837bcdfe21b",
        premium_tenure_3_month_v2: "4514fab914bdbfb4ad2fa23df76121a6",
        premium_tenure_6_month_v2: "2895086c18d5531d499862e41d1155a6",
        premium_tenure_12_month_v2: "0334688279c8359120922938dcb1d6f8",
        premium_tenure_24_month_v2: "0d61871f72bb9a33a7ae568c1fb4f20a",
        premium_tenure_36_month_v2: "11e2d339068b55d3a506cff34d3780f3",
        premium_tenure_60_month_v2: "cd5e2cfd9d7f27a8cdcd3e8a8d5dc9f4",
        guild_booster_lvl1: "51040c70d4f20a921ad6674ff86fc95c",
        guild_booster_lvl2: "0e4080d1d333bc7ad29ef6528b6f2fb7",
        guild_booster_lvl3: "72bed924410c304dbe3d00a6e593ff59",
        guild_booster_lvl4: "df199d2050d3ed4ebf84d64ae83989f8",
        guild_booster_lvl5: "996b3e870e8a22ce519b3a50e6bdd52f",
        guild_booster_lvl6: "991c9f39ee33d7537d9f408c3e53141e",
        guild_booster_lvl7: "cb3ae83c15e970e8f3d410bc62cb8b99",
        guild_booster_lvl8: "7142225d31238f6387d9f09efaa02759",
        guild_booster_lvl9: "ec92202290b48d0879b7413d2dde3bab",
        quest_completed: "7d9ae358c8c5e118768335dbe68b4fb8"
    };

    const DISCORD_USER_FLAGS = {
        STAFF: 1 << 0,
        PARTNER: 1 << 1,
        HYPESQUAD: 1 << 2,
        BUG_HUNTER_LEVEL_1: 1 << 3,
        HYPESQUAD_ONLINE_HOUSE_1: 1 << 6,
        HYPESQUAD_ONLINE_HOUSE_2: 1 << 7,
        HYPESQUAD_ONLINE_HOUSE_3: 1 << 8,
        PREMIUM_EARLY_SUPPORTER: 1 << 9,
        TEAM_PSEUDO_USER: 1 << 10,
        BUG_HUNTER_LEVEL_2: 1 << 14,
        VERIFIED_BOT: 1 << 16,
        VERIFIED_DEVELOPER: 1 << 17,
        CERTIFIED_MODERATOR: 1 << 18,
        BOT_HTTP_INTERACTIONS: 1 << 19,
        ACTIVE_DEVELOPER: 1 << 22,
        BOT_COMMANDS: 1 << 23,
        USES_AUTOMOD: 1 << 24
    };

    const USER_BADGES = {
        [DISCORD_USER_FLAGS.STAFF]: { key: "staff", title: "Discord Staff", fallback: "assets/badges/discordstaff.svg" },
        [DISCORD_USER_FLAGS.PARTNER]: { key: "partner", title: "Discord Partner", fallback: "assets/badges/discordpartner.svg" },
        [DISCORD_USER_FLAGS.HYPESQUAD]: { key: "hypesquad", title: "HypeSquad Events", fallback: "assets/badges/hypesquadevents.svg" },
        [DISCORD_USER_FLAGS.BUG_HUNTER_LEVEL_1]: { key: "bug_hunter_lvl1", title: "Discord Bug Hunter", fallback: "assets/badges/discordbughunter1.svg" },
        [DISCORD_USER_FLAGS.HYPESQUAD_ONLINE_HOUSE_1]: { key: "hypesquad_house_1", title: "HypeSquad Bravery", fallback: "assets/badges/hypesquadbravery.svg" },
        [DISCORD_USER_FLAGS.HYPESQUAD_ONLINE_HOUSE_2]: { key: "hypesquad_house_2", title: "HypeSquad Brilliance", fallback: "assets/badges/hypesquadbrilliance.svg" },
        [DISCORD_USER_FLAGS.HYPESQUAD_ONLINE_HOUSE_3]: { key: "hypesquad_house_3", title: "HypeSquad Balance", fallback: "assets/badges/hypesquadbalance.svg" },
        [DISCORD_USER_FLAGS.PREMIUM_EARLY_SUPPORTER]: { key: "premium_early_supporter", title: "Early Supporter", fallback: "assets/badges/earlysupporter.webp" },
        [DISCORD_USER_FLAGS.BUG_HUNTER_LEVEL_2]: { key: "bug_hunter_lvl2", title: "Discord Bug Hunter", fallback: "assets/badges/discordbughunter2.svg" },
        [DISCORD_USER_FLAGS.VERIFIED_DEVELOPER]: { key: "verified_developer", title: "Early Verified Bot Developer", fallback: "assets/badges/discordbotdev.svg" },
        [DISCORD_USER_FLAGS.CERTIFIED_MODERATOR]: { key: "certified_moderator", title: "Moderator Programs Alumni", fallback: "assets/badges/discordmod.svg" },
        [DISCORD_USER_FLAGS.ACTIVE_DEVELOPER]: { key: "active_developer", title: "Active Developer", fallback: "assets/badges/activedeveloper.svg" },
        [DISCORD_USER_FLAGS.BOT_COMMANDS]: { key: "bot_commands", title: "Supports Commands", fallback: "assets/badges/supportscommands.svg" },
        [DISCORD_USER_FLAGS.USES_AUTOMOD]: { key: "automod", title: "Uses Automod", fallback: "assets/badges/automod.svg" }
    };

    const USER_FLAIRS = {
        bot: {
            title: "Bot",
            asset: "assets/flairs/Bot.svg"
        },
        verified_bot: {
            title: "Verified Bot",
            asset: "assets/flairs/VerifiedBot.svg"
        },
        beta: {
            title: "Beta",
            asset: "assets/flairs/Beta.svg"
        },
        ai: {
            title: "Artificial Intelligence",
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
    };

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
            .replaceAll("\"", "&quot;")
            .replaceAll("'", "&#039;");
    }

    function hasFlag(flags, bit) {
        return typeof flags === "number" && (flags & bit) === bit;
    }

    function getFirstValidImageURL(urls) {
        return new Promise(resolve => {
            if (!urls || !urls.length) return resolve(null);
            let idx = 0;
            function tryNext() {
                if (idx >= urls.length) return resolve(null);
                const url = urls[idx++];
                if (!url) return tryNext();
                const img = new Image();
                img.onload = () => resolve(url);
                img.onerror = tryNext;
                img.src = url;
            }
            tryNext();
        });
    }

    async function getAssetWithFallback(urls) {
        return await getFirstValidImageURL(urls);
    }

    async function toURL(imgKey, id, appId, fallbackType) {
        let urls = [];
        if (!imgKey) {
            if (fallbackType === "large" && appId) {
                urls = [
                    `https://dcdn.dstn.to/app-icons/${appId}?size=512&t=${Date.now()}`,
                    `https://cdn.discordapp.com/app-icons/${appId}.png?size=512&t=${Date.now()}`
                ];
            }
        } else if (typeof imgKey === "string") {
            if (imgKey.startsWith("mp:external/")) {
                const match = imgKey.match(/mp:external\/([^/]+\/https?\/.+)/);
                if (match) {
                    urls = [`https://media.discordapp.net/external/${match[1]}?size=512&t=${Date.now()}`];
                }
            } else if (/^\d+$/.test(imgKey) && appId) {
                urls = [`https://cdn.discordapp.com/app-assets/${appId}/${imgKey}.png?size=512&t=${Date.now()}`];
            }
        }
        if (!urls.length) return null;
        return await getAssetWithFallback(urls);
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
        const discordCardEl = card.closest(".discord-card") || card;
        discordCardEl.classList.remove("gradient-border");
        discordCardEl.style.background = "";
        const infoEl = card.querySelector(".discord-info");
        if (infoEl) infoEl.style.background = "";

        card.innerHTML = `
            <div class="discord-info">
                <div class="discord-header">
                    <span class="discord-avatar-wrapper">
                        <img class="discord-avatar" src="assets/default/unknown.svg" alt="Avatar">
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

    function renderLoadingCard() {
        card.innerHTML = `
            <div class="discord-info">
                <div class="discord-header">
                    <span class="discord-avatar-wrapper">
                        <img class="discord-avatar" src="assets/default/unknown.svg" alt="Avatar">
                        <span class="discord-status-badge">
                            <i class="fas fa-circle-notch fa-spin discord-icon hover-action muted" title="Loading..."></i>
                        </span>
                    </span>
                    <div class="discord-names">
                        <span class="discord-global">Loading...</span>
                        <span class="discord-username">Fetching Discord status</span>
                    </div>
                </div>
                <div class="discord-activity-card">
                    <div class="discord-activity-card-header">
                        <span>Status</span>
                    </div>
                    <div class="discord-activity-card-body">
                        <div class="discord-activity-card-text">
                            <div class="discord-activity-card-details">
                                Please wait while we load Discord presence.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async function renderBadges(flags, BADGES) {
        if (!flags || typeof flags !== "number") return "";
        const badgePromises = Object.keys(BADGES).map(async flag => {
            if (hasFlag(flags, Number(flag))) {
                const badge = BADGES[flag];
                if (!badge) return "";
                const src = await getDiscordBadgeAssetURL(badge.key, badge.fallback);
                return `<img class="discord-icon hover-action" src="${src}" alt="Badge" title="${badge.title}">`;
            }
            return "";
        });
        const badgeHtmlArr = await Promise.all(badgePromises);
        return badgeHtmlArr.join("");
    }

    function renderFlairs(flairs, FLAIRS) {
        if (!flairs || typeof flairs !== "object") return "";
        return Object.keys(FLAIRS).map(flair => {
            if (flairs[flair]) {
                const badge = FLAIRS[flair];
                if (!badge) return "";
                return `<img class="discord-icon-flair hover-action" src="${badge.asset}" alt="Flair" title="${badge.title}">`;
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

    async function getUserBannerURL(discordUser) {
        const userId = discordUser.id;
        const urls = [
            `https://dcdn.dstn.to/banners/${userId}?size=512&t=${Date.now()}`
        ];
        if (discordUser.banner) {
            urls.push(`https://cdn.discordapp.com/banners/${userId}/${discordUser.banner}?size=512&t=${Date.now()}`);
        }
        return await getFirstValidImageURL(urls);
    }

    async function getUserAvatarURL(discordUser) {
        const userId = discordUser.id;
        const urls = [
            `https://dcdn.dstn.to/avatars/${userId}?size=512&t=${Date.now()}`
        ];
        if (discordUser.avatar) {
            urls.push(`https://cdn.discordapp.com/avatars/${userId}/${discordUser.avatar}?size=512&t=${Date.now()}`);
        }
        if (discordUser.discriminator && !isNaN(parseInt(discordUser.discriminator)) && discordUser.discriminator !== "0") {
            urls.push(`https://cdn.discordapp.com/embed/avatars/${parseInt(discordUser.discriminator) % 5}.png?size=512&t=${Date.now()}`);
        } else if (!discordUser.avatar && userId) {
            const fallbackNum = (BigInt(userId) >> 22n) % 6n;
            urls.push(`https://cdn.discordapp.com/embed/avatars/${fallbackNum}.png?size=512&t=${Date.now()}`);
        }
        urls.push("assets/default/unknown.svg");
        return await getFirstValidImageURL(urls);
    }

    async function getDiscordBadgeAssetURL(key) {
        const assetId = DISCORD_BADGE_ASSETS[key];
        if (!assetId) return null;
        const url = `https://cdn.discordapp.com/badge-icons/${assetId}.png?size=512&t=${Date.now()}`;

        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => resolve(url);
            img.onerror = () => resolve(null);
            img.src = url;
        });
    }

    async function fetchDstnProfile(userId) {
        try {
            const res = await fetch(`https://dcdn.dstn.to/profile/${userId}`);
            if (!res.ok) return null;
            const data = await res.json();
            if (!data || Object.keys(data).length === 0) return null;
            return data;
        } catch {
            return null;
        }
    }

    function mergeProfileLanyard(profile, lanyard) {
        console.log(lanyard);
        console.log(profile);
        const merged = { ...lanyard };

        if (profile && Array.isArray(profile.badges) && profile.badges.length > 0) {
            merged.profile_badges = profile.badges;
        } else if (lanyard && Array.isArray(lanyard.profile_badges)) {
            merged.profile_badges = lanyard.profile_badges;
        }

        merged.discord_user = {
            ...(lanyard.discord_user || {})
        };

        if (profile && profile.user_profile) {
            merged.discord_user.profile = profile.user_profile;
        }
        if (profile && profile.legacy_username) {
            merged.discord_user.legacy_username = profile.legacy_username;
        }
        if (profile && profile.connected_accounts) {
            merged.discord_user.connected_accounts = profile.connected_accounts;
        }

        if (profile && profile.user) {
            for (const key of Object.keys(profile.user)) {
                if (!(key in merged.discord_user)) {
                    merged.discord_user[key] = profile.user[key];
                }
            }
        }

        console.log(merged);
        return merged;
    }

    function renderProfileBadges(badges) {
        if (!Array.isArray(badges) || badges.length === 0) return "";
        return badges.map(badge => {
            const src = badge.icon
                ? `https://cdn.discordapp.com/badge-icons/${badge.icon}.png?size=512&t=${Date.now()}`
                : "assets/badges/unknown.svg";
            const title = badge.description || badge.id || "";
            const link = badge.link || null;
            const imgTag = `<img class="discord-icon hover-action" src="${src}" alt="Badge" title="${title}">`;
            return link
                ? `<a href="${link}" target="_blank" rel="noopener noreferrer">${imgTag}</a>`
                : imgTag;
        }).join("");
    }

    async function renderDiscordCard(lanyardData) {
        try {
            if (
                !lanyardData ||
                !lanyardData.discord_user ||
                (Object.keys(lanyardData.discord_user).length === 0 && lanyardData.discord_user.constructor === Object)
            ) {
                return renderFallbackCard("No Discord user data. They may not be linked with Lanyard.");
            }
            if (window._lanyardLiveTimersIntervals && Array.isArray(window._lanyardLiveTimersIntervals)) {
                window._lanyardLiveTimersIntervals.forEach(intervalId => clearInterval(intervalId));
            }
            window._lanyardLiveTimersIntervals = [];

            const discordUser = lanyardData.discord_user;
            let discordStatus = lanyardData.discord_status;
            if (Array.isArray(lanyardData.activities)) {
                if (lanyardData.activities.some(act => act && act.type === ACTIVITY_TYPES.STREAMING)) {
                    discordStatus = "streaming";
                }
            }
            if (lanyardData.active_on_discord_mobile && discordStatus === "online") {
                discordStatus = "onlineMobile";
            }

            let avatarURL = await getUserAvatarURL(discordUser);
            let bannerURL = await getUserBannerURL(discordUser);

            const userInfo = {
                avatarURL,
                avatarDecorationURL: discordUser.avatar_decoration_data?.asset
                    ? `https://cdn.discordapp.com/avatar-decoration-presets/${discordUser.avatar_decoration_data.asset}.png?size=128&t=${Date.now()}`
                    : null,
                nameplateAsset: discordUser.collectibles?.nameplate?.asset || null,
                username: escape(discordUser.username || "Unknown"),
                discriminator: discordUser.discriminator === "0" ? null : discordUser.discriminator,
                globalName: escape(discordUser.global_name || discordUser.username || "Unknown"),
                publicFlags: discordUser.public_flags,
                flairs: {
                    bot: discordUser.bot && !hasFlag(discordUser.public_flags, DISCORD_USER_FLAGS.VERIFIED_BOT),
                    verified_bot: discordUser.bot && hasFlag(discordUser.public_flags, DISCORD_USER_FLAGS.VERIFIED_BOT),
                    system: discordUser.system
                },
                bio: discordUser.bio || "",
                accentColor: discordUser.profile?.banner_color
                    ? discordUser.profile.banner_color
                    : discordUser.profile?.accent_color
                        ? (typeof discordUser.profile.accent_color === "number"
                            ? `#${discordUser.profile.accent_color.toString(16).padStart(6, "0")}`
                            : discordUser.profile.accent_color)
                        : null,
                pronouns: discordUser.pronouns || "",
                legacyUsername: discordUser.legacy_username || "",
                guild: discordUser.primary_guild?.tag
                    ? {
                        tag: escape(discordUser.primary_guild.tag),
                        tagURL: discordUser.primary_guild.identity_guild_id && discordUser.primary_guild.badge
                            ? `https://cdn.discordapp.com/clan-badges/${discordUser.primary_guild.identity_guild_id}/${discordUser.primary_guild.badge}.png?size=64&t=${Date.now()}`
                            : "",
                        guildId: discordUser.primary_guild.identity_guild_id
                    }
                    : null
            };

            let guildLookup = null;
            if (userInfo.guild?.guildId) {
                try {
                    const res = await fetch(`https://discordlookup.mesalytic.moe/v1/guild/${userInfo.guild.guildId}`);
                    if (res.ok) {
                        const info = await res.json();
                        guildLookup = info;
                    }
                } catch (err) {
                    console.warn("Guild lookup failed:", err);
                }
            }


            const status = STATUS_ICONS[discordStatus];

            let badgesHtml = lanyardData.profile_badges && lanyardData.profile_badges.length > 0
                ? renderProfileBadges(lanyardData.profile_badges)
                : await renderBadges(userInfo.publicFlags, USER_BADGES);

            let flairsHtml = renderFlairs(userInfo.flairs, USER_FLAIRS);

            let displayGlobalName = userInfo.globalName;
            let displayUsername = `${userInfo.username}${userInfo.discriminator ? `#${userInfo.discriminator}` : ""}`;

            let html = "";

            if (bannerURL) {
                html += `
                    <div class="discord-banner">
                        <img class="discord-banner-image" src="${bannerURL}" alt="User Banner">
                    </div>
                `;
            } else if (userInfo.accentColor) {
                html += `
                    <div class="discord-banner">
                        <div class="discord-banner-color" style="background: ${userInfo.accentColor};"></div>
                    </div>
                `;
            } else {
                if (userInfo.avatarURL) {
                    const img = new window.Image();
                    img.crossOrigin = "Anonymous";
                    img.src = userInfo.avatarURL;
                    await new Promise(resolve => {
                        img.onload = resolve;
                        img.onerror = resolve;
                    });

                    let avgColor = null;
                    try {
                        const canvas = document.createElement("canvas");
                        canvas.width = img.naturalWidth || img.width;
                        canvas.height = img.naturalHeight || img.height;
                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                        let r = 0, g = 0, b = 0, count = 0;
                        for (let i = 0; i < data.length; i += 4) {
                            if (data[i + 3] < 128) continue;
                            r += data[i];
                            g += data[i + 1];
                            b += data[i + 2];
                            count++;
                        }
                        if (count > 0) {
                            r = Math.round(r / count);
                            g = Math.round(g / count);
                            b = Math.round(b / count);
                            avgColor = `rgb(${r}, ${g}, ${b})`;
                        }
                    } catch (e) { }

                    if (avgColor) {
                        html += `
                            <div class="discord-banner">
                                <div class="discord-banner-color" style="background: ${avgColor};"></div>
                            </div>
                        `;
                    }
                }
            }

            html += `<div class="discord-info">`;

            html += `
                <div class="discord-header">
                    ${userInfo.nameplateAsset ? `
                        <video class="discord-nameplate"
                            src="https://cdn.discordapp.com/assets/collectibles/${userInfo.nameplateAsset}asset.webm"
                            poster="https://cdn.discordapp.com/assets/collectibles/${userInfo.nameplateAsset}static.png"
                            autoplay loop muted playsinline>
                        </video>` : ""
                    }
                    <span class="discord-avatar-wrapper">
                        <img class="discord-avatar" src="${userInfo.avatarURL}" alt="Avatar">
                        ${userInfo.avatarDecorationURL
                            ? `<img class="discord-avatar-decoration" src="${userInfo.avatarDecorationURL}" alt="Avatar decoration">`
                            : ""
                        }
                        ${STATUS_ICONS[discordStatus] ? `
                            <span class="discord-status-badge ${discordStatus === "onlineMobile" ? "online-mobile" : ""}">
                                <img class="discord-icon hover-action" src="${STATUS_ICONS[discordStatus].asset}" title="${STATUS_ICONS[discordStatus].name}">
                            </span>` : ""
                        }
                    </span>
                    <div class="discord-names">
                        <span class="discord-global">
                            ${userInfo.globalName}
                            <span class="discord-icons">${renderFlairs(userInfo.flairs, USER_FLAIRS)}</span>
                            <span class="discord-icons">${
                                await (lanyardData.profile_badges?.length
                                    ? renderProfileBadges(lanyardData.profile_badges)
                                    : renderBadges(userInfo.publicFlags, USER_BADGES))
                            }</span>
                        </span>
                        <span class="discord-username">
                            ${userInfo.username}${userInfo.discriminator ? `#${userInfo.discriminator}` : ""}
                        </span>
                    </div>
                    ${userInfo.guild?.tagURL
                        ? (() => {
                            const titleText = guildLookup?.name
                                ? `(${escape(guildLookup.name)}) ${userInfo.guild.tag} tag`
                                : `${userInfo.guild.tag} tag`;

                            const spanHtml = `
                                <span class="discord-guild-tag hover-action" title="${titleText}">
                                    <img src="${userInfo.guild.tagURL}" alt="Guild tag">
                                    ${userInfo.guild.tag}
                                </span>
                            `;

                            if (guildLookup?.instant_invite) {
                                return `<a href="${escape(guildLookup.instant_invite)}" target="_blank" rel="noopener noreferrer" >${spanHtml}</a>`;
                            }

                            return spanHtml;
                        })() : ""
                    }
                </div>
            `;

            // Remove bio/pronouns/original name display
            // if (userInfo.bio || userInfo.pronouns) {
            //     html += `
            //         <div class="discord-profile-extra">
            //             ${userInfo.bio ? `<div class="discord-profile-bio">${escape(userInfo.bio)}</div>` : ""}
            //             ${userInfo.pronouns ? `<div class="discord-profile-pronouns">${escape(userInfo.pronouns)}</div>` : ""}
            //         </div>
            //     `;
            // }

            let liveTimers = [];

            let spotifyData = lanyardData.spotify;
            let activities = Array.isArray(lanyardData.activities) ? [...lanyardData.activities] : [];
            if (spotifyData) {
                activities = activities.filter(
                    act => !(act && act.type === 2 && act.id && typeof act.id === "string" && act.id.startsWith("spotify:"))
                );
            }

            for (let idx = 0; idx < activities.length; idx++) {
                const activity = activities[idx];
                if (!activity || typeof activity !== "object") continue;
                if (activity.type === ACTIVITY_TYPES.CUSTOM) {
                    let emoji = "";
                    if (activity.emoji) {
                        if (activity.emoji.id) {
                            const ext = activity.emoji.animated ? "gif" : "png";
                            const emojiURL = `https://cdn.discordapp.com/emojis/${activity.emoji.id}.${ext}?size=128&t=${Date.now()}`;
                            emoji = `<img class="discord-custom-emoji discord-icon hover-action" src="${emojiURL}" alt="${escape(activity.emoji.name)}" title=":${activity.emoji.name}:">`;
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
                    continue;
                }

                let largeImageURL = await toURL(activity.assets?.large_image, null, activity.application_id, "large");
                if (!largeImageURL && activity.application_id) {
                    largeImageURL = await toURL(null, null, activity.application_id, "large");
                }
                if (!largeImageURL) {
                    largeImageURL = "assets/default/unknown.svg";
                }

                let smallImageURL = await toURL(activity.assets?.small_image, null, activity.application_id);
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
            }

            if (spotifyData) {
                let timeDetails = renderTimeDetails(spotifyData.timestamps, "spotify", liveTimers);
                const albumArtURL = spotifyData.album_art_url || "assets/default/unknown.svg";
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
                                <img class="discord-activity-card-large hover-action" src="${albumArtURL}" title="${album}">
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
            html += `</div>`;
            card.innerHTML = html;

            const discordCardEl = card.closest(".discord-card") || card;
            discordCardEl.classList.remove("gradient-border");
            discordCardEl.style.background = "";
            const infoEl = card.querySelector(".discord-info");
            if (infoEl) infoEl.style.background = "";

            if (
                discordUser.profile &&
                Array.isArray(discordUser.profile.theme_colors) &&
                discordUser.profile.theme_colors.length > 0
            ) {
                const colors = discordUser.profile.theme_colors.map(c => "#" + c.toString(16).padStart(6, "0"));
                const gradient = `linear-gradient(to bottom, ${colors.join(", ")})`;
                discordCardEl.classList.add("gradient-border");
                discordCardEl.style.background = gradient;

                function isDark(hex) {
                    let c = hex.replace("#", "");
                    if (c.length === 3) c = c.split("").map(x => x + x).join("");
                    let n = parseInt(c, 16);
                    let r = (n >> 16) & 0xff;
                    let g = (n >> 8) & 0xff;
                    let b = n & 0xff;

                    return (0.299 * r + 0.587 * g + 0.114 * b) < 128;
                }

                function mixColor(hex, mix, alpha) {
                    let c = hex.replace("#", "");
                    if (c.length === 3) c = c.split("").map(x => x + x).join("");
                    let n = parseInt(c, 16);
                    let r = (n >> 16) & 0xff;
                    let g = (n >> 8) & 0xff;
                    let b = n & 0xff;

                    let mixR, mixG, mixB, mixA = 1;
                    if (mix.startsWith("#")) {
                        let m = mix.replace("#", "");
                        if (m.length === 3) m = m.split("").map(x => x + x).join("");
                        let mn = parseInt(m, 16);
                        mixR = (mn >> 16) & 0xff;
                        mixG = (mn >> 8) & 0xff;
                        mixB = mn & 0xff;
                    } else if (mix.startsWith("rgba")) {
                        let arr = mix.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d\.]+)?\)/);
                        mixR = parseInt(arr[1]);
                        mixG = parseInt(arr[2]);
                        mixB = parseInt(arr[3]);
                        mixA = arr[4] !== undefined ? parseFloat(arr[4]) : 1;
                    } else {
                        mixR = mixG = mixB = 0;
                    }

                    let outR = Math.round((1 - alpha) * r + alpha * mixR);
                    let outG = Math.round((1 - alpha) * g + alpha * mixG);
                    let outB = Math.round((1 - alpha) * b + alpha * mixB);
                    return `rgb(${outR},${outG},${outB})`;
                }

                const mixedColors = colors.map(c =>
                    isDark(c)
                        ? mixColor(c, "#000000", 0.6) // mix with black + alpha
                        : mixColor(c, "#ffffff", 0.6) // mix with white + alpha
                );
                const darkGradient = `linear-gradient(to bottom, ${mixedColors[0]}, ${mixedColors[0]}, ${mixedColors[mixedColors.length - 1]})`;
                if (infoEl) infoEl.style.background = darkGradient;
            } else {
                discordCardEl.classList.remove("gradient-border");
                discordCardEl.style.background = "";
                if (infoEl) infoEl.style.background = "";
            }

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
        } catch (e) {
            renderFallbackCard(`Error rendering Discord card.\n\n${e.stack}`);
            return console.error("Discord card error:", e);
        }
    }

    async function handlePresence(presence) {
        try {
            const profile = await fetchDstnProfile(LANYARD_USER_ID);
            const merged = mergeProfileLanyard(profile, presence);
            await renderDiscordCard(merged);
        } catch (e) {
            renderFallbackCard(`Error updating presence.\n\n${e.stack}`);
            return console.error("Presence update error:", e);
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
            renderLoadingCard();
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
    } catch (e) {
        renderFallbackCard(`Could not connect to Discord status.\n\n${e.stack}`);
        console.error("Initial connection error:", e);
    }
});