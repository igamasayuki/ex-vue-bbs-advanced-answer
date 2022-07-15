<template>
  <div class="ex">
    <div>記事ID：{{ article.id }}</div>
    <div>投稿者名：{{ article.name }}</div>
    <div>
      投稿内容：
      <pre>{{ article.content }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from "vue-property-decorator";
import { Article } from "@/types/article";

/**
 * コメントフォームコンポーネント.
 */
@Component
export default class CompShowArticle extends Vue {
  // 親コンポーネントから受け取る記事
  @Prop()
  article!: Article;
}
</script>
