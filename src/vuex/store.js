import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    breadList: [],
    navList: []
  },
  //private 不公开
  mutations: {
    setBreadList(state, amount) {
      state.breadList = amount
    },
    setNavList: function (state, payload) {
      let index = -1
      for (var i = 0; i < state.navList.length; i++) {
        state.navList[i].currentActive = false
        if (state.navList[i].url == payload.data.url) {
          index = i
        }
      }
      if (index == -1) {
        state.navList.push(payload.data)
      } else {
        state.navList[index].data = payload.data.data
        state.navList[index].currentActive = true
      }
    },
    removeNav: function (state, index) {
      for (var i = 0; i < state.navList.length; i++) {
        state.navList[i].currentActive = false
      }
      //index导航的索引，起始点为0 state.navList.length为导航个数，起始值为1 统一就需要length减一
      if (state.navList.length - 1 > index) {
        window.location.href = "#" + state.navList[index + 1].url
        state.navList[index + 1].currentActive = true
      } else {
        //console.log(index)
        window.location.href = "#" + state.navList[index - 1].url
        state.navList[index - 1].currentActive = true
      }
      state.navList.splice(index, 1)
    },
    cleanNav: function (state) {
      state.navList = []
    }
  },
  //获取
  getters: {
    getBreadList: (state) => {
      return state.breadList
    },
  }
});
