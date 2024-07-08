<template>
  <footer class="footer">
    <div class="vector-icon" @click="onVectorClick">
      <svg xmlns="http://www.w3.org/2000/svg" width="88" height="88" viewBox="0 0 88 88" fill="none">
<g filter="url(#filter0_d_4009_1041)">
<path d="M84 40C84 62.0914 66.0914 80 44 80C21.9086 80 4 62.0914 4 40C4 17.9086 21.9086 0 44 0C66.0914 0 84 17.9086 84 40Z" fill="#3ABB84"/>
<path d="M66.9437 30.7767V51.4719C66.9437 53.9957 64.8787 56.0607 62.3549 56.0607H30.2337L21.0562 65.2382V23.9395C21.0562 21.4157 23.1211 19.3507 25.645 19.3507H48.8181C48.6805 20.0849 48.5887 20.865 48.5887 21.6451C48.5887 27.9776 53.7281 33.117 60.0605 33.117C62.6532 33.117 65.0164 32.2222 66.9437 30.7767ZM53.1774 21.6451C53.1774 25.4538 56.2519 28.5282 60.0605 28.5282C63.8692 28.5282 66.9437 25.4538 66.9437 21.6451C66.9437 17.8364 63.8692 14.762 60.0605 14.762C56.2519 14.762 53.1774 17.8364 53.1774 21.6451Z" fill="white"/>
</g>
<defs>
<filter id="filter0_d_4009_1041" x="0" y="0" width="88" height="88" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="4"/>
<feGaussianBlur stdDeviation="2"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4009_1041"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4009_1041" result="shape"/>
</filter>
</defs>
</svg>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterView',
  methods: {
    onVectorClick() {
      console.log('Vector clicked');
    }
  }
}
</script>

<style scoped>
footer {
position: fixed;
bottom: 0;
left: 0;
right: 0;
height: 80px;
display: flex;
justify-content: center;
align-items: center;
background-color: transparent; /* 背景色を透明に */
}

.vector-icon {
width: 80px;
height: 80px;
flex-shrink: 0;
filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
cursor: pointer;
position: absolute;
right: 10px; /* 右に10px移動 */
bottom: 10px; /* 下に10px移動 */
}


</style>
