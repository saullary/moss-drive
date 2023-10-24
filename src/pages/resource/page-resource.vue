<style lang="scss">
.q-linear-progress__track--dark {
  border-radius: 20px;
  background: var(--q-primary);
  opacity: 1;
}
.q-linear-progress__model {
  border-radius: 20px;
}
</style>

<template>
  <div class="q-pa-md">
    <div class="bg-card-1 pa-4">
      <div class="al-c">
        <span class="title">IPFS Storage</span>
        <span class="ml-auto fz-13">Total 120GB July 3,2022</span>
      </div>
      <div class="mt-4">
        <q-linear-progress
          :value="0.4"
          :buffer="0.6"
          size="10px"
          rounded
          color="accent"
          style="background: #334155"
        />
      </div>
    </div>

    <div class="bg-card-1 mt-4 ov-h">
      <div class="pa-4">
        <div class="title">Purchase</div>
      </div>
      <div class="pa-3"></div>
      <div class="pa-4 al-c" style="background: #94f9ca; color: #333">
        <div class="fz-13 mr-auto">
          <p>Storage: <b class="fz-14">1GB/20GB</b></p>
          <p class="mt-1">Expiration date: <b class="fz-14">Apr 2 2024</b></p>
        </div>
        <div class="ta-r mr-3">
          <p>Total Costs</p>
          <p>
            <b class="fz-20 mr-1">30.22</b>
            <span class="fz-12">USDC</span>
          </p>
        </div>
        <div>
          <q-btn rounded color="white" unelevated>
            <span class="gray-3">Approve</span>
          </q-btn>
        </div>
      </div>
    </div>

    <div class="bg-card-1 mt-4 pa-4">
      <div class="title">Bill Details</div>
    </div>
  </div>
</template>