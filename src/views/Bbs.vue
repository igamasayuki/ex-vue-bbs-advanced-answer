<template>
  <div class="container">
    <h1>掲示板アプリケーション(Vue.js版)</h1>
    <form>
      <div class="error">
        {{ articleNameErrorMessage }}
      </div>
      <div>投稿者名：<input type="text" v-model="articleName" /></div>
      <div class="error">
        {{ articleContentErrorMessage }}
      </div>
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
    <div v-for="article of currentArticleList" v-bind:key="article.id">
      <div>記事ID：{{ article.id }}</div>
      <div>投稿者名：{{ article.name }}</div>
      <div>
        投稿内容：
        <pre>{{ article.content }}</pre>
      </div>
      <form>
        <button type="button" v-on:click="deleteArticle(article.id)">
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
import axios from "axios";
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
  // 投稿者名エラーメッセージ
  private articleNameErrorMessage = "";
  // 投稿内容
  private articleContent = "";
  // 投稿内容エラーメッセージ
  private articleContentErrorMessage = "";

  /**
   * 記事一覧をWebAPIからVuexストアにセットする.
   * @remarks 初期画面表示時に呼ばれる
   */
  created(): void {
    this["$store"].dispatch("getArticleList");
  }

  /**
   * 記事一覧をWebAPIからVuexストアにセットする.
   * @remarks 記事やコメント追加、削除時にはcreatedが呼ばれないためこちらを実装
   */
  updated(): void {
    this["$store"].dispatch("getArticleList");
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

  /**
   * 記事を追加する.
   *
   * @returns Promiseオブジェクト
   */
  async addArticle(): Promise<void> {
    // 今までのエラーメッセージを削除
    this.articleNameErrorMessage = "";
    this.articleContentErrorMessage = "";

    let hasErrors = false;
    if (this.articleName === "") {
      this.articleNameErrorMessage = "投稿者名を入力してください";
      hasErrors = true;
    } else if (50 < this.articleName.length) {
      this.articleNameErrorMessage = "投稿者名は50文字以内で入力してください";
      hasErrors = true;
    }

    if (this.articleContent === "") {
      this.articleContentErrorMessage = "投稿内容を入力してください";
      hasErrors = true;
    } else if (50 < this.articleContent.length) {
      this.articleContentErrorMessage =
        "投稿内容は50文字以内で入力してください";
      hasErrors = true;
    }

    if (hasErrors) {
      // エラーがひとつでもあった場合は追加しない
      return;
    }

    // 記事投稿WebAPIを呼ぶ
    await axios.post("http://153.127.48.168:8080/ex-bbs-api/bbs/article", {
      name: this.articleName,
      content: this.articleContent,
    });

    // 入力値をフォームからクリアする
    this.articleName = "";
    this.articleContent = "";
  }

  /**
   * 記事を削除する.
   *
   * @param articleId - 記事ID
   * @returns Promiseオブジェクト
   */
  async deleteArticle(articleId: number): Promise<void> {
    // 記事を削除するWebAPIを呼ぶ
    let targetUrl =
      "http://153.127.48.168:8080/ex-bbs-api/bbs/article/" + articleId;
    await axios.delete(targetUrl);
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
