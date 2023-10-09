
<template>
  <q-menu style="width: 130px" auto-close>
    <q-list>
      <q-item clickable @click="$refs.input.click()">
        <q-item-section>Upload File</q-item-section>
      </q-item>
      <q-item class="hide-in-touch" clickable @click="$refs.input2.click()">
        <q-item-section>Upload Folder</q-item-section>
      </q-item>
      <q-item clickable>
        <q-item-section>Create Folder</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
  <div>
    <div class="d-n">
      <input ref="input" multiple type="file" @input="onInput" />
      <input ref="input2" multiple webkitdirectory type="file" @input="onInput" />
    </div>
  </div>
</template>

<script>
export default {
  emits: ["files"],
  props: {
    allowDrop: Boolean,
    disabled: Boolean,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    asMobile() {
      return this.$store.state.asMobile;
    },
  },
  mounted() {
    document.ondragover = (ev) => {
      ev.preventDefault();
    };
    document.ondrop = async (ev) => {
      ev.preventDefault();
      if (!this.allowDrop) return;
      const files = await this.scanFiles(ev.dataTransfer);
      this.getFiles(files);
    };
    document.onpaste = async (ev) => {
      if (!this.allowDrop) return;
      const files = await this.scanFiles(ev.clipboardData);
      this.getFiles(files);
    };
  },
  methods: {
    onInput(e) {
      // console.log(e);
      this.getFiles(e.target.files);
      const { input, input2 } = this.$refs;
      input.value = null;
      if (input2) input2.value = null;
    },
    onClick() {
      this.$refs.file.click();
    },
    async scanFiles(e) {
      const { items = [], files = [] } = e;
      const [item] = items;
      if (!item || !item.webkitGetAsEntry) return files;
      const entry = item.webkitGetAsEntry();
      if (!entry) return files;
      return entry.isFile ? files : this.getEntryDirectoryFiles(entry);
    },
    async getEntryDirectoryFiles(entry) {
      let res = [];
      var internalProces = (item, path, res) => {
        if (item.isFile) {
          return new Promise((resolve) => {
            item.file((file) => {
              file.path = path + file.name;
              var newFile = new File([file], file.path, { type: file.type });
              res.push(newFile);
              resolve(res);
            });
          });
        } else if (item.isDirectory) {
          return new Promise((resolve, reject) => {
            var dirReader = item.createReader();
            dirReader.readEntries(async (entries) => {
              for (let i = 0; i < entries.length; i++) {
                await internalProces(entries[i], path + item.name + "/", res);
              }
              resolve(res);
            }, reject);
          });
        }
      };
      await internalProces(entry, "", res);
      return res;
    },
    getFiles(files) {
      if (!files || !files.length) return;
      this.loading = true;
      const list = [];
      // console.log(files);
      [].slice.call(files).forEach((it) => {
        const name = it.webkitRelativePath || it.name;
        if (/\.DS_Store$/.test(name)) return;
        list.push({
          name,
          file: it,
          size: this.$bucket.getFileSize(it.size),
        });
      });
      this.loading = false;
      this.onFiles(list);
    },
    onFiles(list) {
      // console.log(list);
      this.$emit("files", list);
    },
  },
};
</script>