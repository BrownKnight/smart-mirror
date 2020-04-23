<template>
    <div class="apple-music">
        <img id="artwork" v-if="currentItem" :src="currentItem.artworkURL" alt="Album Artwork" />
        <div id="artwork" v-if="!currentItem"></div>
        <div id="title" v-if="currentItem">{{ currentItem.title }}</div>
        <div id="albumartist" v-if="currentItem">{{ currentItem.albumName }} | {{ currentItem.artistName }}</div>
        <button v-on:click="search('car', ['albums', 'playlists'])">Play!</button>
        <button v-on:click="stopMusic">Stop</button>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class AppleMusic extends Vue {
    music!: MusicKit.MusicKitInstance;
    currentItem: MusicKit.MediaItem | null = null;

    created() {
        document.addEventListener("musickitloaded", this.configureMusicKit);
        // this.music = window.MusicKit.getInstance();
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
        this.music.addEventListener("playbackStateDidChange", () => {
            if (this.music.player.isPlaying) {
                this.currentItem = this.music.player.nowPlayingItem;
            } else {
                this.currentItem = null;
            }
        });
    }

    private search(searchTerm: string, resultTypes: string[]) {
        console.log("play music");
        // Set the playback queue to a specific album, and play
        this.music.api.library.search(searchTerm, { types: resultTypes.join(",") }).then(resource => {
            if (Object.keys(resource).length === 0) {
                console.log(
                    `Could not find any results for searchTerm: ${searchTerm} and types ${resultTypes.join(",")}`
                );
                return;
            }
            console.log(resource);
            console.log(`Found ${resource["library-playlists"].data.length} Playlists`);
            const playlist = resource["library-playlists"].data[0];
            console.log("Found playlist");
            console.log(playlist);
            this.music.setQueue({ playlist: playlist.id }).then(() => {
                this.music.play();
            });
        });
        // this.music.setQueue({
        //     album: "1025210938"
        // });

        // // Playback Controls
        // this.music.play();
    }

    stopMusic() {
        this.music.stop();
    }
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
