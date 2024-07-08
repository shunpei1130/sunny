<template>
    <div class="sunny">
      <img class="mobilePhoneMonochromatic1" alt="" src="../assets/Mobile Phone_Monochromatic 1.png" />
      <b class="sunny1">sunnyヘようこそ</b>
      <b class="sunnyContainer">
        <p class="p">SUNNYは</p>
        <p class="p">自分が継続することを設定し</p>
        <p class="p">継続を仲間とシェアして目標を達成する</p>
        <p class="p">新しいSNSです。</p>
      </b>
      <div class="sunnyChild" />
      <div class="sunnyItem" />
      <b class="b">利用規約 と プライバシーポリシー</b>
      <div class="rectangleParent" @click="onGroupContainerClick">
        <div class="groupChild" />
        <b class="sunny3">SUNNYをはじめる</b>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent } from 'vue'
  import { useRouter } from 'vue-router'
  
  export default defineComponent({
  name: "WelcomeView",
  setup() {
    const router = useRouter()

    const onGroupContainerClick = () => {
      router.push('/privacy-policy')
    }

    return {
      onGroupContainerClick
    }
  }
})
</script>
  
  <style scoped>
  .mobilePhoneMonochromatic1 {
    position: absolute;
    top: 194px;
    left: 43px;
    width: 273px;
    height: 204px;
    overflow: hidden;
  }
  .sunny1 {
    position: absolute;
    top: 128px;
    left: 118px;
  }
  .p {
    margin: 0;
  }
  .sunnyContainer {
    position: absolute;
    top: 440px;
    left: 62px;
    font-size: 14px;
  }
  .sunnyChild {
    position: absolute;
    top: 726.5px;
    left: 113.5px;
    background-color: #008080;
    border-top: 1px solid #008080;
    box-sizing: border-box;
    width: 47px;
    height: 1px;
  }
  .sunnyItem {
    position: absolute;
    top: 726.5px;
    left: 171.5px;
    background-color: #008080;
    border-top: 1px solid #008080;
    box-sizing: border-box;
    width: 100px;
    height: 1px;
  }
  .b {
    position: absolute;
    top: 712px;
    left: 116px;
    font-size: 10px;
    color: #ececec;
    text-align: left;
  }
  .groupChild {
    position: absolute;
    top: 0px;
    left: 0px;
    border-radius: 12px;
    background-color: #008080;
    width: 263px;
    height: 57px;
  }
  .sunny3 {
    position: absolute;
    top: 17px;
    left: 67px;
  }
  .rectangleParent {
    position: absolute;
    top: 595px;
    left: 57px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    width: 263px;
    height: 57px;
    cursor: pointer;
    font-size: 15px;
    color: #fff;
  }
  .sunny {
    width: 100%;
    position: relative;
    background-color: #2f4f4f;
    height: 812px;
    overflow: hidden;
    text-align: center;
    font-size: 16px;
    color: #d3d3d3;
    font-family: Poppins;
  }
  </style>