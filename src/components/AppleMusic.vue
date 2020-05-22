<template>
    <div class="apple-music">
        <img id="artwork" v-if="currentItem" :src="currentItem.artworkURL" alt="Album Artwork" />
        <div id="artwork" v-if="!currentItem"></div>
        <div id="title" v-if="currentItem">{{ currentItem.title }}</div>
        <div id="albumartist" v-if="currentItem">{{ currentItem.albumName }} | {{ currentItem.artistName }}</div>
        <button v-on:click="playMusic()">Play!</button>
        <button v-on:click="search('car', ['albums', 'playlists'])">Search For Car</button>
        <button v-on:click="stopMusic">Stop</button>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MycroftClient, { WebMusicControlMessage } from "./../mycroft-client/mycroftClient";
@Component
export default class AppleMusic extends Vue {
    music!: MusicKit.MusicKitInstance;
    currentItem: MusicKit.MediaItem | null = null;

    mycroftClient!: MycroftClient;

    created() {
        document.addEventListener("musickitloaded", this.configureMusicKit);
        this.mycroftClient = MycroftClient.getInstance();
    }

    private configureMusicKit() {
        console.log("Creating MusicKit Config - Fetching dev token");
        fetch("/api/apple-music-developer-token")
            .then(data => data.json())
            .then(json => {
                const musicKitConfiguration: MusicKit.Configuration = {
                    developerToken: json.developerToken,
                    app: {
                        name: "Smart Mirror",
                        build: "1.0.0"
                    },
                    declarativeMarkup: false
                };

                console.log("Configuring MusicKit");
                this.music = window.MusicKit.configure(musicKitConfiguration);
                console.log("MusicKit Configured");
            })
            .then(this.registerEventHandlers);
    }

    private registerEventHandlers() {
        //TODO: Tell MyCroft about the change in media item
        this.music.addEventListener("playbackStateDidChange", this.updateNowPlayingItem.bind(this));

        this.mycroftClient.onWebMusicControlMessage("play", this.attemptToPlayNewMedia.bind(this));

        this.mycroftClient.onAudioControlMessage("resume", this.resumeMusic.bind(this));
        this.mycroftClient.onAudioControlMessage("pause", this.pauseMusic.bind(this));
        this.mycroftClient.onAudioControlMessage("stop", this.pauseMusic.bind(this));
        this.mycroftClient.onAudioControlMessage("next", this.nextTrack.bind(this));
        this.mycroftClient.onAudioControlMessage("prev", this.previousTrack.bind(this));

        this.mycroftClient.onAudioControlMessage("track_info", this.sendTrackInfo.bind(this));
    }

    private search(searchTerm: string, resultTypes: string[]) {
        console.log(`Searching for ${resultTypes} called ${searchTerm}`);
        // Set the playback queue to a specific album, and play
        this.music.api.library.search(searchTerm, { types: resultTypes.join(",") }).then(resource => {
            if (Object.keys(resource).length === 0) {
                console.log(
                    `Could not find any results for searchTerm: ${searchTerm} and types ${resultTypes.join(",")}`
                );
                return;
            }
            console.log(resource);

            if (resultTypes.includes("songs") && "library-songs" in resource) {
                console.log(`Found ${resource["library-songs"].data.length} Songs in response`);
                const song = resource["library-songs"].data[0];
                this.music.setQueue({ song: song.id }).then(() => {
                    this.music.play();
                });
            } else if (resultTypes.includes("albums") && "library-albums" in resource) {
                console.log(`Found ${resource["library-albums"].data.length} albums in response`);
                const album = resource["library-albums"].data[0];
                this.music.setQueue({ album: album.id }).then(() => {
                    this.music.play();
                });
            } else if (resultTypes.includes("playlists") && "library-playlists" in resource) {
                console.log(`Found ${resource["library-playlists"].data.length} playlists in response`);
                const playlist = resource["library-playlists"].data[0];
                this.music.setQueue({ playlist: playlist.id }).then(() => {
                    this.music.play();
                });
            }
        });
    }

    playMusic() {
        this.music.play().then(() => console.log("Playing!"));
        console.log(this.music.player.nowPlayingItem);
    }

    stopMusic() {
        this.music.stop();
    }

    //region APPLE MUSIC EVENT HANDLERS
    private updateNowPlayingItem() {
        if (this.music.player.isPlaying) {
            this.currentItem = this.music.player.nowPlayingItem;
        } else {
            this.currentItem = null;
        }
        this.sendTrackInfo();
    }
    //endregion
    //region MYCROFT EVENT HANDLERS
    //TODO: Send messages back with currently playing info
    private attemptToPlayNewMedia(message: WebMusicControlMessage) {
        console.log("Attempting to play new music");
        console.log(message);
        const mediaTypes = message.data.type.split("+");
        this.search(message.data.name ?? "", mediaTypes);
    }

    private pauseMusic() {
        this.music.player.pause();
    }

    private resumeMusic() {
        this.music.player.play();
    }

    private nextTrack() {
        this.music.player.skipToNextItem();
    }

    private previousTrack() {
        this.music.player.skipToPreviousItem();
    }

    private sendTrackInfo() {
        const appleMusicTrackInfo = this.music.player.nowPlayingItem;
        if (!appleMusicTrackInfo) {
            return;
        }
        const trackInfo = {
            name: appleMusicTrackInfo.title,
            artist: appleMusicTrackInfo.artistName,
            album: appleMusicTrackInfo.albumName,
            url: appleMusicTrackInfo.artworkURL
        };
        this.mycroftClient.sendMessage("mycroft.audio.service.track_info_reply", trackInfo);
    }
    //endregion
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#artwork {
    width: 35rem;
    height: 35rem;
}
#title {
    font-size: 1.5rem;
}
</style>
