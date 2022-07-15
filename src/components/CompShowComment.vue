<template>
  <div class="ex">
    <div v-for="comment of commentList" v-bind:key="comment.id">
      <div>コメント者名：{{ comment.name }}</div>
      <div>
        コメント内容：
        <pre>{{ comment.content }}</pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from "vue-property-decorator";
import { Comment } from "@/types/comment";

/**
 * コメントフォームコンポーネント.
 */
@Component
export default class CompShowComment extends Vue {
  // 親コンポーネントから受け取るコメントリスト
  @Prop()
  commentList!: Array<Comment>;
}
</script>
