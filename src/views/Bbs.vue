<template>
  <div class="container">
    <h1>掲示板アプリケーション(Vue.js版)</h1>
    <!-- 記事投稿フォームコンポーネント -->
    <CompArticleForm />
    <hr />
    <div v-for="article of currentArticleList" v-bind:key="article.id">
      <div>記事ID：{{ article.id }}</div>
      <div>投稿者名：{{ article.name }}</div>
      <div>
        投稿内容：
        <pre>{{ article.content }}</pre>
      </div>
      <!-- 記事削除フォームコンポーネント -->
      <CompDeleteArticleForm v-bind:aritcle-id="article.id" />
      <br />

      <!-- コメント表示コンポーネント -->
      <CompShowComment v-bind:comment-list="article.commentList" />

      <!-- コメント投稿フォームコンポーネント -->
      <CompCommentForm v-bind:aritcle-id="article.id" />

      <hr />
    </div>
  </div>
</template>

<script lang="ts">
import { Article } from "@/types/article";
import { Component, Vue } from "vue-property-decorator";
import CompArticleForm from "@/components/CompArticleForm.vue";
import CompDeleteArticleForm from "@/components/CompDeleteArticleForm.vue";
import CompCommentForm from "@/components/CompCommentForm.vue";
import CompShowComment from "@/components/CompShowComment.vue";

@Component({
  components: {
    CompArticleForm,
    CompDeleteArticleForm,
    CompShowComment,
    CompCommentForm,
  },
})
export default class Bbs extends Vue {
  /**
   * 記事一覧をWebAPIからVuexストアにセットする.
   * @remarks 初期画面表示時に呼ばれる
   */
  created(): void {
    this.$store.dispatch("getArticleList");
  }

  /**
   * 記事⼀覧を取得する.
   *
   * @returns 記事一覧
   * @remarks
   * Vuexストア内の記事⼀覧(articles)を返す
   */
  get currentArticleList(): Array<Article> {
    return this.$store.getters.getArticles;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  font-size: 30px;
}
pre {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}
</style>
