<template>
    <div class="apple-music">
        <div>Apple Music BLAH</div>
        <button v-on:click="playMusic">Play!</button>
        <button v-on:click="stopMusic">Stop</button>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class AppleMusic extends Vue {
    lastMessage = "Placeholder Message";
    music!: MusicKit.MusicKitInstance;

    created() {
        document.addEventListener("musickitloaded", this.configureMusicKit);
        // this.music = window.MusicKit.getInstance();
    }

    configureMusicKit() {
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
                this.music.authorize().then(() => {
                    console.log("User is definitely authorised");
                    this.music.api.library.albums(null).then(cloudAlbums => {
                        // user's cloudAlbums
                        console.log("Got users Cloud Albums");
                        console.log(cloudAlbums);
                    });
                });
            });
    }

    playMusic() {
        console.log("play music");
        // Set the playback queue to a specific album, and play
        this.music.api.library.search("Car", { types: "playlists" }).then(resource => {
            const playlist = resource["library-playlists"].data[0];
            console.log("Found playlist")
            console.log(playlist)
            this.music.setQueue({ playlist: playlist.id }).then(() => {
                this.music.play()
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
<style scoped></style>
