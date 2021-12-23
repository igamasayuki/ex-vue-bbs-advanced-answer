<template>
  <div class="container">
    <h1>掲示板アプリケーション(Vue.js版)</h1>
    <form>
      <div>投稿者名：<input type="text" v-model="articleName" /></div>
      <div>
        投稿内容：<textarea
          v-model="articleContent"
          rows="5"
          cols="25"
        ></textarea>
      </div>
      <button type="button" v-on:click="addArticle()">記事投稿</button>
    </form>
    <hr />
    <div
      v-for="(article, articleIndex) of currentArticleList"
      v-bind:key="article.id"
    >
      <div>記事INDEX：{{ articleIndex }}</div>
      <div>記事ID：{{ article.id }}</div>
      <div>投稿者名：{{ article.name }}</div>
      <div>
        投稿内容：
        <pre>{{ article.content }}</pre>
      </div>
      <form>
        <button type="button" v-on:click="deleteArticle(articleIndex)">
          記事削除
        </button>
      </form>
      <br />

      <div v-for="comment of article.commentList" v-bind:key="comment.id">
        <div>コメント者名：{{ comment.name }}</div>
        <div>
          コメント内容：
          <pre>{{ comment.content }}</pre>
        </div>
      </div>

      <CompCommentForm v-bind:aritcle-id="article.id" />

      <hr />
    </div>
  </div>
</template>

<script lang="ts">
import { Article } from "@/types/article";
import { Component, Vue } from "vue-property-decorator";
import CompCommentForm from "@/components/CompCommentForm.vue";

@Component({
  components: {
    CompCommentForm,
  },
})
export default class Bbs extends Vue {
  // 投稿者名
  private articleName = "";
  // 投稿内容
  private articleContent = "";

  /**
   * 記事一覧をWebAPIからVuexストアにセットします.
   *
   */
  created(): void {
    this["$store"].dispatch("getArticleList");
  }

  /**
   * 記事⼀覧を表⽰します.
   *
   * @remarks
   * Vuexストア内の記事⼀覧(articles)を返す
   */
  get currentArticleList(): Array<Article> {
    return this.$store.getters.getArticles;
  }
  /**
   * 記事を追加する.
   */
  addArticle(): void {
    // 最新の記事IDに１プラスする形で記事IDを作成する
    let articles = this.$store.getters.getArticles;
    let newId = 0;
    // もし記事が１件でもあれば最後の記事IDに1を足したものをIDとする
    if (articles.length) {
      newId = articles[0].id + 1;
    }
    // ミューテーションのaddArticleメソッドを呼ぶ
    // 第２引数には「名前：値,・・・」のオブジェクト形式で渡す
    // ミューテーションに渡す引数のことを「ペイロード」という
    this.$store.commit("addArticle", {
      article: new Article(newId, this.articleName, this.articleContent, []),
    });
    // 入力値をフォームからクリアする
    this.articleName = "";
    this.articleContent = "";
  }

  /**
   * 記事を削除する.
   *
   * @param articleIndex : 記事のINDEX番号
   */
  deleteArticle(articleIndex: number): void {
    // ミューテーションのdeleteArticleメソッドを呼ぶ
    // 第２引数には「名前：値,・・・」のオブジェクト形式で渡す
    // ミューテーションに渡す引数のことを「ペイロード」という
    this.$store.commit("deleteArticle", {
      articleIndex: articleIndex,
    });
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
