<template>
  <div class="ex">
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";

/**
 * コメントフォームコンポーネント.
 */
@Component
export default class CompArticleForm extends Vue {
  // 投稿者名
  articleName = "";
  // 投稿者名エラーメッセージ
  articleNameErrorMessage = "";
  // 投稿内容
  articleContent = "";
  // 投稿内容エラーメッセージ
  articleContentErrorMessage = "";

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

    // 一覧取得
    this.$store.dispatch("getArticleList");
  }
}
</script>
