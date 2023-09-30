<template>
  <q-card style="width: 350px; overflow: visible" @click="onClick">
    <!-- <q-slider
      v-if="canPlay"
      thumb-size="0"
      dense
      v-model="progress"
      :min="0"
      :max="1"
      color="pink"
    /> -->
    <q-linear-progress
      :indeterminate="!canPlay"
      animation-speed="0"
      :value="progress"
      color="pink"
    />

    <q-card-section class="row items-center no-wrap">
      <div>
        <div class="fw-b">
          <span class="mr-1 op-8 fz-13">{{ curIdx + 1 }}/{{ count }}</span>
          <span>{{ curItem.name }}</span>
        </div>
        <div class="text-grey fz-13 mt-1">{{ desc }}</div>
      </div>

      <q-space />

      <q-btn flat round icon="fast_rewind" v-show="count > 0" @click.stop="onNext(-1)" />
      <q-btn flat round :icon="isPlay ? 'pause' : 'play_arrow'" @click.stop="onPlay" />
      <q-btn flat round icon="fast_forward" v-show="count > 0" @click.stop="onNext(1)" />
    </q-card-section>
  </q-card>
</template>

<script>
let audio = new Audio();
function getShowTime(time) {
  const second = Math.floor(time);
  return `${Math.floor(second / 60)}:${second % 60}`.replace(/\b(\d)\b/g, "0$1");
}

export default {
  name: "music-player",
  props: {
    list: Array,
    current: Number,
  },
  data() {
    return {
      curIdx: this.current,
      progress: 0,
      canPlay: false,
      isPlay: false,
      desc: "",
      duration: null,
    };
  },
  computed: {
    count() {
      return this.list.length;
    },
    curItem() {
      return this.list[this.curIdx];
    },
  },
  watch: {
    current(val) {
      this.curIdx = val;
    },
    curItem() {
      this.setAudio();
    },
  },
  mounted() {
    this.setAudio();
  },
  unmounted() {
    audio.pause();
  },
  methods: {
    onClick(e) {
      if (this.duration) {
        audio.currentTime = (e.offsetX / this.$el.clientWidth) * this.duration; // trigger oncanplay
        this.canPlay = false;
        audio.play();
      }
    },
    onNext(dx) {
      let idx = this.curIdx + dx;
      if (idx >= this.count) idx = 0;
      if (idx < 0) idx = this.count - 1;
      this.curIdx = idx;
    },
    setAudio() {
      if (!audio.paused) {
        audio.pause();
      }
      audio.src = this.curItem.url;
      this.desc = "-";
      this.progress = 0;
      this.canPlay = false;
      audio.oncanplay = () => {
        this.canPlay = true;
      };
      audio.ontimeupdate = () => {
        const { duration, currentTime: curTime } = audio;
        this.duration = duration;
        if (!duration) {
          this.progress = 0;
        } else {
          this.progress = curTime / duration;
          if (duration < 1) {
            this.desc = duration.toFixed(2) + "s";
          } else {
            this.desc = getShowTime(curTime) + " / " + getShowTime(duration || 0);
          }
        }
      };
      audio.onpause = () => {
        this.isPlay = false;
      };
      audio.onended = () => {
        if (!audio.duration) this.progress = 1;
      };
      audio.onplay = () => {
        this.isPlay = true;
      };
      audio.play();
      this.isPlay = true;
    },
    onPlay() {
      if (!this.isPlay) audio.play();
      else audio.pause();
    },
  },
};
</script>