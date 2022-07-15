<template>
  <div class="ex">
    <form>
      <button type="button" v-on:click="deleteArticle(aritcleId)">
        記事削除
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from "vue-property-decorator";
import axios from "axios";

/**
 * 記事削除フォームコンポーネント.
 */
@Component
export default class CompArticleForm extends Vue {
  // 親コンポーネントから受け取る記事ID
  @Prop()
  aritcleId!: number;

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

    // 一覧取得
    this.$store.dispatch("getArticleList");
  }
}
</script>
