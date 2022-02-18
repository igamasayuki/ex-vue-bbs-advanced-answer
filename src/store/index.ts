import { Article } from "@/types/article";
import { Comment } from "@/types/comment";
import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    articles: new Array<Article>(),
  }, // end state
  actions: {
    /**
     * 記事一覧情報を WebAPI から取得して mutation を呼び出す.
     *
     * @param context コンテキスト
     */
    async getArticleList(context) {
      //1)
      const response = await axios.get(
        "http://153.127.48.168:8080/ex-bbs-api/bbs/articles"
      );
      const payload = response.data;
      console.dir("response:" + JSON.stringify(payload));
      context.commit("setArticleList", payload);
    },
  }, // end actions
  mutations: {
    /**
     * payloadで受け取ったJSON形式の従業員一覧情報をステートにセットする.
     *
     * @param state ステート
     * @param payload actionから受け取る従業員一覧情報(JSON形式)
     */
    setArticleList(state, payload) {
      state.articles = payload.articles;
      console.log("articles:" + state.articles);
    },
    /**
     * コメントを追加する.
     *
     * @remarks 渡されたPayload中のaritcleIdから対象の記事を見つけ、その中のCommentListにコメントを追加します
     * @param state ステート
     * @param payload コメント情報
     */
    addComment(state, payload) {
      // 渡されたpayload中のaritcleIdから追加対象の記事を検索する
      const article = state.articles.find(
        (article) => article.id === payload.comment.articleId
      );
      // 記事が存在していたらCommentListにコメントを追加
      if (article) {
        // 渡されたpayloadからコメントを生成
        const comment = new Comment(
          payload.comment.id,
          payload.comment.name,
          payload.comment.content,
          payload.comment.articleId
        );
        article.commentList.unshift(comment);
      }
    },
  }, // end mutations
  getters: {
    /**
     * 記事一覧を返す.
     *
     * @param state ステート
     * @returns 記事一覧情報 (新しい投稿が上に来る順序)
     */
    getArticles(state) {
      return state.articles;
    },
  }, // end getters
  modules: {}, // end modules
});
